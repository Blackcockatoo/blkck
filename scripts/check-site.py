#!/usr/bin/env python3
"""Site health checks for blkck2.com.

Run before every deploy:

    python3 scripts/check-site.py

Checks, in order of how badly they break the site:

1. BUILD ANCHORS — scripts/prepare-i-ran-lego.py patches data/studio-sections.js
   using exact-match anchors and raises if they are missing. Losing one takes
   the entire deploy down, so this is checked first and loudest.
2. INTERNAL LINKS — every local href/src in every tracked HTML file resolves.
3. SITEMAP — every sitemap URL maps to a file that exists.
4. PROJECT REGISTRY — data/projects.js uses the documented status vocabulary
   and every entry carries a verification date.

Exit code 0 = clean, 1 = at least one failure.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
SITE_ORIGIN = "https://blkck2.com"

# Anchors that scripts/prepare-i-ran-lego.py depends on. Keep in sync with
# patch_portal() in that file.
BUILD_ANCHORS = (
    (
        "data/studio-sections.js",
        "      { label: 'Enter Black Wing Crew', href: 'https://blackwingcrew.netlify.app/',"
        " className: 'album-link', sub: 'Stream the Neon Venom LP.' },\n",
        "Start Here CTA insertion point",
    ),
    (
        "data/studio-sections.js",
        "  {\n    slug: 'old-vic-state',",
        "i-ran-lego section insertion point",
    ),
)

VALID_STATUSES = {
    "live",
    "active-dev",
    "prototype",
    "archive",
    "concept",
    "superseded",
}

# Directories that hold generated or vendored output rather than source.
SKIP_DIRS = {".git", "node_modules"}

# i-ran-lego/ is produced by scripts/prepare-i-ran-lego.py from the living-book
# ZIP. What is committed is a stale intermediate whose index.html still points
# at split timing-part-*.js files; the build overwrites the whole tree with the
# packaged edition (data/timing-data.js). Linting the checked-in copy therefore
# reports failures that cannot occur on the deployed site.
BUILD_GENERATED_DIRS = {"i-ran-lego"}

failures: list[str] = []
notes: list[str] = []


def fail(message: str) -> None:
    failures.append(message)


def check_build_anchors() -> None:
    for rel_path, anchor, label in BUILD_ANCHORS:
        path = ROOT / rel_path
        if not path.exists():
            fail(f"BUILD ANCHOR: {rel_path} is missing entirely")
            continue
        if anchor not in path.read_text(encoding="utf-8"):
            fail(
                f"BUILD ANCHOR LOST in {rel_path}: {label}. "
                "scripts/prepare-i-ran-lego.py will raise and the deploy will fail."
            )


def html_files() -> list[Path]:
    return [
        path
        for path in sorted(ROOT.rglob("*.html"))
        if not any(part in SKIP_DIRS for part in path.parts)
        and not any(part in BUILD_GENERATED_DIRS for part in path.parts)
    ]


def is_external(href: str) -> bool:
    return bool(urlparse(href).scheme) or href.startswith("//")


def check_internal_links() -> None:
    pattern = re.compile(r'(?:href|src)="([^"]+)"')
    checked = 0

    for page in html_files():
        for raw in pattern.findall(page.read_text(encoding="utf-8", errors="replace")):
            href = raw.strip()
            if (
                not href
                or href.startswith("#")
                or href.startswith("mailto:")
                or href.startswith("tel:")
                or href.startswith("data:")
                or href.startswith("javascript:")
                or is_external(href)
                # Attributes built by inline JS, e.g. href="${path}" or {{slug}}.
                or "${" in href
                or "{{" in href
            ):
                continue

            target = unquote(href.split("#", 1)[0].split("?", 1)[0])
            if not target:
                continue

            base = ROOT if target.startswith("/") else page.parent
            resolved = (base / target.lstrip("/")).resolve()
            checked += 1

            if resolved.is_dir():
                if not (resolved / "index.html").exists():
                    fail(
                        f"BROKEN LINK: {page.relative_to(ROOT)} -> {href} "
                        "(directory has no index.html)"
                    )
                continue

            if not resolved.exists():
                fail(f"BROKEN LINK: {page.relative_to(ROOT)} -> {href}")

    notes.append(f"internal links checked: {checked}")


def check_sitemap() -> None:
    sitemap = ROOT / "sitemap.xml"
    if not sitemap.exists():
        fail("SITEMAP: sitemap.xml is missing")
        return

    locs = re.findall(r"<loc>([^<]+)</loc>", sitemap.read_text(encoding="utf-8"))
    for loc in locs:
        if not loc.startswith(SITE_ORIGIN):
            fail(f"SITEMAP: {loc} is not on {SITE_ORIGIN}")
            continue

        rel = loc[len(SITE_ORIGIN) :].lstrip("/")
        if rel in ("", "/"):
            rel = "index.html"

        target = (ROOT / rel).resolve()
        if target.is_dir():
            target = target / "index.html"

        # The i-ran-lego directory is produced by the build step, so its absence
        # in a clean checkout is expected rather than an error.
        if not target.exists():
            if rel.startswith("i-ran-lego"):
                notes.append(f"sitemap: {loc} is build-generated (not in checkout)")
                continue
            fail(f"SITEMAP: {loc} has no corresponding file ({rel})")

    notes.append(f"sitemap URLs checked: {len(locs)}")


def check_project_registry() -> None:
    registry = ROOT / "data" / "projects.js"
    if not registry.exists():
        fail("REGISTRY: data/projects.js is missing")
        return

    text = registry.read_text(encoding="utf-8")
    slugs = re.findall(r"^\s*slug: '([^']+)'", text, re.MULTILINE)
    statuses = re.findall(r"^\s*status: '([^']+)'", text, re.MULTILINE)
    verified = re.findall(r"^\s*verified: '([^']+)'", text, re.MULTILINE)

    if not slugs:
        fail("REGISTRY: no project entries found")
        return

    for status in statuses:
        if status not in VALID_STATUSES:
            fail(
                f"REGISTRY: unknown status '{status}'. "
                f"Allowed: {', '.join(sorted(VALID_STATUSES))}"
            )

    duplicates = {slug for slug in slugs if slugs.count(slug) > 1}
    for slug in sorted(duplicates):
        fail(f"REGISTRY: duplicate slug '{slug}'")

    if len(statuses) != len(slugs):
        fail(f"REGISTRY: {len(slugs)} projects but {len(statuses)} status fields")

    if len(verified) != len(slugs):
        fail(
            f"REGISTRY: {len(slugs)} projects but {len(verified)} verified dates. "
            "Every project needs a date someone actually loaded it."
        )

    for date in verified:
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date):
            fail(f"REGISTRY: verified date '{date}' is not YYYY-MM-DD")

    notes.append(f"projects in registry: {len(slugs)}")


def main() -> int:
    check_build_anchors()
    check_internal_links()
    check_sitemap()
    check_project_registry()

    for note in notes:
        print(f"  ... {note}")

    if failures:
        print(f"\nFAILED — {len(failures)} problem(s):\n")
        for failure in failures:
            print(f"  ✗ {failure}")
        return 1

    print("\nOK — site checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
