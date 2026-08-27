#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import shutil
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = Path(__file__).resolve().parent / "i-ran-lego.manifest.json"
MANIFEST = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

ARCHIVE = ROOT / MANIFEST["archive"]
TARGET = ROOT / MANIFEST["targetPath"]
REQUIRED = tuple(MANIFEST["requiredFiles"])
MIN_ARCHIVE_BYTES = MANIFEST["minArchiveBytes"]

_VALIDATORS = MANIFEST["validators"]
AUDIO_PATH = _VALIDATORS["audioPath"]
MIN_AUDIO_BYTES = _VALIDATORS["minAudioBytes"]
PAGES_GLOB = _VALIDATORS["pagesGlob"]
EXPECTED_PAGES = _VALIDATORS["expectedPages"]


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


def install_book(dry_run: bool = False) -> None:
    if not ARCHIVE.exists():
        raise FileNotFoundError(f"Missing deployment source: {ARCHIVE.name}")
    if ARCHIVE.stat().st_size < MIN_ARCHIVE_BYTES:
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
        pages = sorted(source.glob(PAGES_GLOB))
        if len(pages) != EXPECTED_PAGES:
            raise RuntimeError(f"Expected {EXPECTED_PAGES} illustrated pages, found {len(pages)}")
        if (source / AUDIO_PATH).stat().st_size < MIN_AUDIO_BYTES:
            raise RuntimeError("Master audio is unexpectedly small")

        if dry_run:
            print(f"[dry-run] Archive valid: {len(pages)} pages, all required files present")
            return

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
            '  <meta property="og:description" content="The complete Blue $nake Studio interactive picture-book musical — free and fully unlocked.">\n'
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
        'The complete digital living book is free and already unlocked. No teaser, no digital checkout. Printed and collector editions remain optional.',
    )
    index = index.replace(
        'The customer-facing flow stays this simple: secure checkout, email access, then straight into the complete experience.',
        'The complete digital living book is already open. Continue only if you want to ask about an optional printed or collector edition.',
    )
    index = index.replace(
        'This prototype is running in demonstration mode. Add the real Stripe Checkout link in <strong>config.js</strong>; no redesign is required.',
        'The full digital song and every synced lyric are free on this site. This enquiry is only for optional print or collector editions.',
    )
    index = index.replace('WATCH THE FREE PREVIEW', 'OPEN THE FULL SONG')
    index = index.replace('OPEN THE LIVING PREVIEW', 'OPEN THE FULL SONG')
    index = index.replace('OPEN PREVIEW', 'OPEN FULL SONG')
    index = index.replace('THE FREE PREVIEW ENDS HERE', 'THE FULL SONG IS OPEN')
    index = index.replace('RESTART PREVIEW', 'RESTART SONG')
    index = index.replace('UNLOCK DIGITAL EDITION', 'OPEN THE FULL SONG')
    index = index.replace('CHOOSE YOUR EDITION', 'FULL SONG · FREE TO OPEN')
    index = index.replace('Digital, physical, or the whole strange machine.', 'The whole strange machine is open.')
    index = index.replace('Immediate digital access', 'Full digital song included free')
    index = index.replace('Optional digital upgrade later', 'Full digital song already included')
    index = index.replace('CONTINUE TO CHECKOUT', 'SEND PRINT ENQUIRY')
    index = index.replace('data-open-player="preview"', 'data-open-player="full"')
    index = index.replace(
        'The living preview is free. The complete digital and printed editions are available directly from Blue $nake Studio while the checkout system is being connected.',
        'The complete digital living book is free and already unlocked. No teaser, no digital checkout. Printed and collector editions remain optional.',
    )
    index = index.replace(
        'The public preview is free. Digital access, hard copies and complete-edition orders are handled directly by Blue $nake Studio while secure checkout is being connected.',
        'The complete digital living book is free and already unlocked. No teaser, no digital checkout. Printed and collector editions remain optional.',
    )
    index = index.replace(
        'The secure checkout is being connected. For now, continue to send a pre-filled edition enquiry directly to Blue $nake Studio.',
        'The complete digital living book is already open. Continue only if you want to ask about an optional printed or collector edition.',
    )
    index = index.replace(
        'The public site carries the interactive preview only. Complete digital files and print orders are delivered directly by the studio.',
        'The full digital song and every synced lyric are free on this site. This enquiry is only for optional print or collector editions.',
    )
    index = index.replace(
        'The rest of the machine is behind the little red button.',
        'The full performance is unlocked from start to finish.',
    )
    index = index.replace(
        'Unlock the complete interactive book, or order the physical edition and bundle digital access with it.',
        'Restart the song whenever you like, or ask B$S about an optional printed edition.',
    )
    index = index.replace('CHOOSE IT. OPEN IT. PLAY IT.', 'OPTIONAL PRINT EDITIONS')
    index = index.replace('<h3 id="purchaseName">Living Book</h3>', '<h3 id="purchaseName">Printed Edition</h3>')
    index = index.replace('<span>One-time purchase</span>', '<span>Optional printed edition</span>')
    index = index.replace('<span>One-time edition</span>', '<span>Optional printed edition</span>')
    index = index.replace('<button class="gold" id="purchaseAction">CONTINUE</button>', '<button class="gold" id="purchaseAction">SEND PRINT ENQUIRY</button>')
    index = index.replace(
        '<div class="price">Digital access</div><h3>Living Book</h3>',
        '<div class="price">Full access · free</div><h3>Living Song</h3>',
        1,
    )
    index = index.replace(
        '<button class="red" data-buy="digital">OPEN THE FULL SONG</button>',
        '<button class="red" data-open-player="full">OPEN THE FULL SONG</button>',
        1,
    )
    index = index.replace(
        '<button class="red" data-open-player="full" data-media-gated disabled>OPEN THE FULL SONG</button>',
        '<button class="red" data-open-player="full">OPEN THE FULL SONG</button>',
        1,
    )
    index = index.replace(
        '<button class="gold" data-buy="complete">GET THE COMPLETE EDITION</button>',
        '<button class="gold" data-buy="print">OPTIONAL PRINT EDITIONS</button>',
        1,
    )
    index = index.replace(
        '<div class="lock-overlay" id="lockOverlay">',
        '<div class="lock-overlay" id="lockOverlay" hidden>',
        1,
    )
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
    config = re.sub(r'previewOnly:\s*true', 'previewOnly: false', config, count=1)
    config = patch_product(config, "digital", "I%20RAN%20LEGO%20Digital%20Edition")
    config = patch_product(config, "print", "I%20RAN%20LEGO%20Printed%20Book")
    config = patch_product(config, "complete", "I%20RAN%20LEGO%20Complete%20Edition")
    config = re.sub(r'supportEmail:\s*"[^"]*"', 'supportEmail: "bluesssnakestudio@gmail.com"', config, count=1)
    config_path.write_text(config, encoding="utf-8")

    app_path = TARGET / "app.js"
    app = app_path.read_text(encoding="utf-8")
    app = re.sub(
        r'entitled:\s*localStorage\.getItem\("iran-lego-entitlement"\)==="full"\s*\|\|\s*new URLSearchParams\(location\.search\)\.get\("full"\)==="1"',
        'entitled: true',
        app,
        count=1,
    )
    app = re.sub(
        r'\n\s*if\s*\(state\.preview\s*&&\s*!state\.entitled\s*&&\s*t\s*>=\s*CFG\.previewSeconds\)\s*\{\s*audio\.pause\(\);\s*lockOverlay\.classList\.add\("show"\);\s*\}',
        '\n',
        app,
        count=1,
    )
    app = re.sub(r'preview:\s*true', 'preview: false', app, count=1)
    app = app.replace('state.preview = true;', 'state.preview = false;', 1)
    app = re.sub(
        r'state\.entitled\s*\?\s*"OPEN FULL BOOK"\s*:\s*"OPEN PREVIEW"',
        '"OPEN FULL SONG"',
        app,
        count=1,
    )
    app = app.replace('$("#demoUnlock").addEventListener', '$("#demoUnlock")?.addEventListener')
    app = app.replace('$("#resetAccess").addEventListener', '$("#resetAccess")?.addEventListener')
    app_path.write_text(app, encoding="utf-8")

    (TARGET / "sw.js").write_text(
        '''const CACHE = "iran-lego-living-book-v3";
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
        cta = "      { label: 'Open I RAN, LEGO!', href: 'i-ran-lego/', className: 'album-link', sub: 'Full song and synced lyrics. Free to open.' },\n"
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
    pageDescription: 'Watch, sing and explore the complete I RAN, LEGO! living storybook — full song, synced lyrics and all twenty-one illustrated pages, free and unlocked.',
    details: [
      'The complete programme travels through twenty-one illustrated pages in time with the full song.',
      'A bouncing red button follows every word while chapter controls make the performance easy to revisit.',
      'Pause at any point to drag, zoom and inspect the artwork.'
    ],
    links: [
      { label: 'Open the Living Book', href: 'i-ran-lego/', className: 'album-link' },
      { label: 'Watch @blkck2', href: 'https://www.youtube.com/@blkck2' },
      { label: 'Ask about printed editions', href: 'mailto:bluesssnakestudio@gmail.com?subject=I%20RAN%20LEGO%20Printed%20Edition' }
    ]
  },
"""
        sections = replace_once(sections, "  {\n    slug: 'old-vic-state',", section + "  {\n    slug: 'old-vic-state',", "project section")
    sections_path.write_text(sections, encoding="utf-8")


def validate() -> None:
    pages = sorted(TARGET.glob(PAGES_GLOB))
    assert len(pages) == EXPECTED_PAGES
    assert (TARGET / AUDIO_PATH).stat().st_size > MIN_AUDIO_BYTES
    assert "demoMode: false" in (TARGET / "config.js").read_text(encoding="utf-8")
    app = (TARGET / "app.js").read_text(encoding="utf-8")
    index = (TARGET / "index.html").read_text(encoding="utf-8")
    assert "entitled: true" in app
    assert "if(state.preview && !state.entitled" not in app
    assert "WATCH THE FREE PREVIEW" not in index
    assert "UNLOCK DIGITAL EDITION" not in index
    assert 'data-open-player="full" data-media-gated disabled' not in index
    assert '"OPEN PREVIEW"' not in app
    assert "BACK TO BLKCK2" in (TARGET / "index.html").read_text(encoding="utf-8")
    assert "slug: 'i-ran-lego'" in (ROOT / "data" / "studio-sections.js").read_text(encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Prepare the I RAN, LEGO! living book for deployment.")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="verify the source archive without writing output or deleting the source",
    )
    args = parser.parse_args()

    if args.dry_run:
        install_book(dry_run=True)
        print("Dry run complete — living-book archive is valid")
        return

    install_book()
    patch_book()
    patch_portal()
    validate()
    ARCHIVE.unlink(missing_ok=True)
    print("Prepared full I RAN, LEGO! living book for deployment")


if __name__ == "__main__":
    main()
