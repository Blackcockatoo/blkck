#!/usr/bin/env python3
from __future__ import annotations

import re
import shutil
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "I_RAN_LEGO_LIVING_BOOK_v1.zip"
TARGET = ROOT / "i-ran-lego"

REQUIRED = (
    "index.html",
    "app.js",
    "styles.css",
    "config.js",
    "data/timing-data.js",
    "data/camera-data.js",
    "assets/audio/I_RAN_LEGO_MASTER.mp3",
)


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise RuntimeError(f"Could not patch {label}: expected source text was not found")
    return text.replace(old, new, 1)


def patch_product(config: str, key: str, subject: str) -> str:
    pattern = re.compile(
        rf'({re.escape(key)}:\s*\{{.*?priceLabel:\s*)"[^"]*"(\s*,.*?checkoutUrl:\s*)"[^"]*"',
        re.S,
    )
    updated, count = pattern.subn(
        rf'\1"Enquire"\2"mailto:bluesssnakestudio@gmail.com?subject={subject}"',
        config,
        count=1,
    )
    if count != 1:
        raise RuntimeError(f"Could not configure purchase path for {key}")
    return updated


def safe_extract(archive: zipfile.ZipFile, destination: Path) -> None:
    for member in archive.infolist():
        path = Path(member.filename)
        if path.is_absolute() or ".." in path.parts:
            raise RuntimeError(f"Unsafe ZIP member: {member.filename}")
    archive.extractall(destination)


def install_book() -> None:
    if not ARCHIVE.exists():
        raise FileNotFoundError(f"Missing deployment source: {ARCHIVE.name}")
    if ARCHIVE.stat().st_size < 10_000_000:
        raise RuntimeError("Living-book archive is unexpectedly small")

    with tempfile.TemporaryDirectory(prefix="iran-lego-") as tmp_name:
        tmp = Path(tmp_name)
        with zipfile.ZipFile(ARCHIVE) as archive:
            bad_member = archive.testzip()
            if bad_member:
                raise RuntimeError(f"Corrupt ZIP member: {bad_member}")
            safe_extract(archive, tmp)

        candidates = [
            path.parent
            for path in tmp.rglob("index.html")
            if (path.parent / "app.js").exists()
            and (path.parent / "assets" / "pages").is_dir()
        ]
        if len(candidates) != 1:
            raise RuntimeError(f"Expected one living-book root, found {len(candidates)}")
        source = candidates[0]

        for required in REQUIRED:
            if not (source / required).is_file():
                raise RuntimeError(f"Archive is missing {required}")
        pages = sorted((source / "assets" / "pages").glob("page-*.webp"))
        if len(pages) != 21:
            raise RuntimeError(f"Expected 21 illustrated pages, found {len(pages)}")
        if (source / "assets" / "audio" / "I_RAN_LEGO_MASTER.mp3").stat().st_size < 8_000_000:
            raise RuntimeError("Master audio is unexpectedly small")

        shutil.rmtree(TARGET, ignore_errors=True)
        shutil.copytree(source, TARGET)

    for local_launcher in ("START_WINDOWS.bat", "START_MAC_LINUX.command", "start_local.py"):
        (TARGET / local_launcher).unlink(missing_ok=True)
    readme = TARGET / "README_FIRST.txt"
    if readme.exists():
        readme.rename(TARGET / "README_SOURCE.txt")


def patch_book() -> None:
    index_path = TARGET / "index.html"
    index = index_path.read_text(encoding="utf-8")
    if 'rel="canonical"' not in index:
        index = replace_once(
            index,
            '<link rel="manifest" href="manifest.webmanifest">',
            '<link rel="manifest" href="manifest.webmanifest">\n'
            '  <link rel="canonical" href="https://blkck2.com/i-ran-lego/">\n'
            '  <meta property="og:title" content="I RAN, LEGO! — The Living Storybook">\n'
            '  <meta property="og:description" content="A Blue $nake Studio interactive picture-book musical with a free 66-second living preview.">\n'
            '  <meta property="og:type" content="website">\n'
            '  <meta property="og:url" content="https://blkck2.com/i-ran-lego/">\n'
            '  <meta property="og:image" content="https://blkck2.com/i-ran-lego/assets/pages/page-01.webp">',
            "canonical metadata",
        )
    if 'BACK TO BLKCK2' not in index:
        index = replace_once(index, '<div class="top-actions">', '<div class="top-actions">\n    <a class="ghost" href="/">BACK TO BLKCK2</a>', "portal return link")

    index = re.sub(r'\s*<button class="ghost" id="resetAccess">.*?</button>', '', index, count=1)
    index = re.sub(r'\s*<button class="ghost" id="demoUnlock">.*?</button>', '', index, count=1)
    index = index.replace(
        'The public preview is free. Full access opens immediately after purchase, while the hard copy can be ordered on its own or bundled with the living book.',
        'The public preview is free. Digital access, hard copies and complete-edition orders are handled directly by Blue $nake Studio while secure checkout is being connected.',
    )
    index = index.replace(
        'The customer-facing flow stays this simple: secure checkout, email access, then straight into the complete experience.',
        'Choose an edition and send a pre-filled enquiry directly to Blue $nake Studio. Secure checkout and automatic access are being connected.',
    )
    index = index.replace(
        'This prototype is running in demonstration mode. Add the real Stripe Checkout link in <strong>config.js</strong>; no redesign is required.',
        'The website carries the free preview. Complete digital access and print orders are delivered directly by the studio.',
    )
    index = index.replace('CONTINUE TO CHECKOUT', 'CONTINUE WITH ENQUIRY')
    if 'LEGO Group' not in index:
        index = replace_once(
            index,
            '</footer>',
            '  <p style="margin:12px auto 0;max-width:760px;font-size:11px;line-height:1.5;opacity:.68">LEGO is a trademark of the LEGO Group, which does not sponsor, authorise or endorse this independent Blue $nake Studio work.</p>\n</footer>',
            "trademark note",
        )
    index_path.write_text(index, encoding="utf-8")

    config_path = TARGET / "config.js"
    config = config_path.read_text(encoding="utf-8")
    config = re.sub(r'demoMode:\s*true', 'demoMode: false', config, count=1)
    config = patch_product(config, "digital", "I%20RAN%20LEGO%20Digital%20Edition")
    config = patch_product(config, "print", "I%20RAN%20LEGO%20Printed%20Book")
    config = patch_product(config, "complete", "I%20RAN%20LEGO%20Complete%20Edition")
    config = re.sub(r'supportEmail:\s*"[^"]*"', 'supportEmail: "bluesssnakestudio@gmail.com"', config, count=1)
    config_path.write_text(config, encoding="utf-8")

    app_path = TARGET / "app.js"
    app = app_path.read_text(encoding="utf-8")
    app = re.sub(
        r'entitled:\s*localStorage\.getItem\("iran-lego-entitlement"\)==="full"\s*\|\|\s*new URLSearchParams\(location\.search\)\.get\("full"\)==="1"',
        'entitled: false',
        app,
        count=1,
    )
    app = app.replace('$("#demoUnlock").addEventListener', '$("#demoUnlock")?.addEventListener')
    app = app.replace('$("#resetAccess").addEventListener', '$("#resetAccess")?.addEventListener')
    app_path.write_text(app, encoding="utf-8")

    (TARGET / "sw.js").write_text(
        '''const CACHE = "iran-lego-living-book-v2";
const CORE = [
  "./", "index.html", "styles.css", "app.js", "config.js",
  "data/timing-data.js", "data/camera-data.js",
  "assets/icons/icon-192.png", "assets/icons/icon-512.png",
  "assets/pages/page-01.webp"
];
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("./")));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
''',
        encoding="utf-8",
    )


def patch_portal() -> None:
    sections_path = ROOT / "data" / "studio-sections.js"
    sections = sections_path.read_text(encoding="utf-8")
    if "href: 'i-ran-lego/'" not in sections:
        marker = "      { label: 'Enter Black Wing Crew', href: 'https://blackwingcrew.netlify.app/', className: 'album-link', sub: 'Stream the Neon Venom LP.' },\n"
        cta = "      { label: 'Open I RAN, LEGO!', href: 'i-ran-lego/', className: 'album-link', sub: 'Interactive picture-book musical. Free living preview.' },\n"
        sections = replace_once(sections, marker, marker + cta, "Start Here CTA")
    if "slug: 'i-ran-lego'" not in sections:
        section = """  {
    slug: 'i-ran-lego',
    status: 'Live',
    label: 'I RAN, LEGO!',
    eyebrow: 'Living storybook · music · moving picture book',
    title: 'A book that performs itself.',
    statement: 'I RAN, LEGO! is an interactive picture-book musical with authored camera movement, word-level sing-along lyrics, chapter navigation and pause-to-explore pages.',
    pageTitle: 'I RAN, LEGO! — Interactive Living Storybook · Blue $nake Studio',
    pageDescription: 'Watch, sing and explore I RAN, LEGO! — a Blue $nake Studio living storybook with a free 66-second interactive preview and printed-book pathway.',
    details: [
      'The complete programme travels through twenty-one illustrated pages in time with the full song.',
      'A bouncing red button follows every word while chapter controls make the performance easy to revisit.',
      'Pause at any point to drag, zoom and inspect the artwork.'
    ],
    links: [
      { label: 'Open the Living Book', href: 'i-ran-lego/', className: 'album-link' },
      { label: 'Watch @blkck2', href: 'https://www.youtube.com/@blkck2' },
      { label: 'Ask about editions', href: 'mailto:bluesssnakestudio@gmail.com?subject=I%20RAN%20LEGO%20Edition' }
    ]
  },
"""
        sections = replace_once(sections, "  {\n    slug: 'old-vic-state',", section + "  {\n    slug: 'old-vic-state',", "project section")
    sections_path.write_text(sections, encoding="utf-8")


def validate() -> None:
    pages = sorted((TARGET / "assets" / "pages").glob("page-*.webp"))
    assert len(pages) == 21
    assert (TARGET / "assets" / "audio" / "I_RAN_LEGO_MASTER.mp3").stat().st_size > 8_000_000
    assert "demoMode: false" in (TARGET / "config.js").read_text(encoding="utf-8")
    assert "entitled: false" in (TARGET / "app.js").read_text(encoding="utf-8")
    assert "BACK TO BLKCK2" in (TARGET / "index.html").read_text(encoding="utf-8")
    assert "slug: 'i-ran-lego'" in (ROOT / "data" / "studio-sections.js").read_text(encoding="utf-8")


def main() -> None:
    install_book()
    patch_book()
    patch_portal()
    validate()
    ARCHIVE.unlink(missing_ok=True)
    print("Prepared full I RAN, LEGO! living book for deployment")


if __name__ == "__main__":
    main()
