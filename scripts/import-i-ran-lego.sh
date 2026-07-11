#!/usr/bin/env bash
set -euo pipefail

DRIVE_FILE_ID="1qN0zzQjyMAs-lWZekgn05qfw6iM3TsDz"
ZIP_PATH="/tmp/i-ran-lego.zip"
UNPACK_DIR="/tmp/i-ran-lego-unpack"
BOOK_DIR="i-ran-lego"

printf '[I RAN LEGO] Downloading source package...\n'
curl --fail --location --retry 3 --retry-all-errors \
  "https://drive.usercontent.google.com/download?id=${DRIVE_FILE_ID}&export=download&confirm=t" \
  --output "$ZIP_PATH"

SIZE="$(stat -c%s "$ZIP_PATH")"
if [ "$SIZE" -lt 10000000 ]; then
  printf '[I RAN LEGO] Source package was only %s bytes; refusing to deploy an incomplete download.\n' "$SIZE" >&2
  exit 1
fi
unzip -t "$ZIP_PATH" >/dev/null

rm -rf "$UNPACK_DIR" "$BOOK_DIR"
mkdir -p "$UNPACK_DIR" "$BOOK_DIR"
unzip -q "$ZIP_PATH" -d "$UNPACK_DIR"
SOURCE_DIR="$(find "$UNPACK_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
test -n "$SOURCE_DIR"
cp -a "$SOURCE_DIR"/. "$BOOK_DIR"/
rm -f "$BOOK_DIR/START_WINDOWS.bat" \
      "$BOOK_DIR/START_MAC_LINUX.command" \
      "$BOOK_DIR/start_local.py"

python3 <<'PY'
from pathlib import Path

root = Path('.')
book = root / 'i-ran-lego'

index_path = book / 'index.html'
index = index_path.read_text(encoding='utf-8')
if 'rel="canonical"' not in index:
    index = index.replace(
        '<link rel="manifest" href="manifest.webmanifest">',
        '<link rel="manifest" href="manifest.webmanifest">\n'
        '  <link rel="canonical" href="https://blkck2.com/i-ran-lego/">'
    )
if 'BACK TO BLKCK2' not in index:
    index = index.replace(
        '<div class="top-actions">',
        '<div class="top-actions">\n'
        '    <a class="ghost" href="/">BACK TO BLKCK2</a>'
    )
index = index.replace(
    '<button class="ghost" id="resetAccess">RESET PROTOTYPE ACCESS</button>',
    '<button class="ghost" id="resetAccess" hidden>RESET PROTOTYPE ACCESS</button>'
)
index = index.replace(
    '<button class="ghost" id="demoUnlock">UNLOCK FULL PROTOTYPE</button>',
    '<button class="ghost" id="demoUnlock" hidden>UNLOCK FULL PROTOTYPE</button>'
)
index_path.write_text(index, encoding='utf-8')

config_path = book / 'config.js'
config = config_path.read_text(encoding='utf-8')
config = config.replace('demoMode: true', 'demoMode: false')
config = config.replace(
    'supportEmail: "hello@blkck2.com"',
    'supportEmail: "bluesssnakestudio@gmail.com"'
)
config_path.write_text(config, encoding='utf-8')

readme = book / 'README_FIRST.txt'
if readme.exists():
    readme.rename(book / 'README_SOURCE.txt')

sections_path = root / 'data' / 'studio-sections.js'
sections = sections_path.read_text(encoding='utf-8')
cta = "      { label: 'Open I RAN, LEGO!', href: 'i-ran-lego/', className: 'album-link', sub: 'Interactive picture-book musical. Free preview.' },\n"
if "href: 'i-ran-lego/'" not in sections:
    marker = "      { label: 'Enter Black Wing Crew', href: 'https://blackwingcrew.netlify.app/', className: 'album-link', sub: 'Stream the Neon Venom LP.' },\n"
    sections = sections.replace(marker, marker + cta, 1)

if "slug: 'i-ran-lego'" not in sections:
    section = """  {
    slug: 'i-ran-lego',
    status: 'Live',
    label: 'I RAN, LEGO!',
    eyebrow: 'Living storybook · music · moving picture book',
    title: 'A book that performs itself.',
    statement: 'I RAN, LEGO! is a six-minute interactive picture-book musical: authored camera movement, word-level sing-along lyrics, chapter navigation and pause-to-explore pages.',
    pageTitle: 'I RAN, LEGO! — Interactive Living Storybook · Blue $nake Studio',
    pageDescription: 'Watch, sing and explore I RAN, LEGO! — a Blue $nake Studio living storybook with a free interactive preview, bouncing-word lyrics and a full printed-book pathway.',
    details: [
      'The camera travels through twenty-one illustrated pages in time with the complete song.',
      'A bouncing red button follows every word while chapter controls make the performance easy to revisit.',
      'Pause the programme at any point to drag, zoom and inspect the artwork.'
    ],
    links: [
      { label: 'Open the Living Book', href: 'i-ran-lego/', className: 'album-link' },
      { label: 'Watch @blkck2', href: 'https://www.youtube.com/@blkck2' },
      { label: 'Ask about print editions', href: 'mailto:bluesssnakestudio@gmail.com?subject=I%20RAN%20LEGO%20Print%20Edition' }
    ]
  },
"""
    marker = "  {\n    slug: 'old-vic-state',"
    sections = sections.replace(marker, section + marker, 1)
sections_path.write_text(sections, encoding='utf-8')

redirects_path = root / '_redirects'
redirects = redirects_path.read_text(encoding='utf-8') if redirects_path.exists() else ''
route_lines = [
    '/i-ran-lego /i-ran-lego/index.html 200',
    '/i-ran-lego/ /i-ran-lego/index.html 200',
    '/iran-lego /i-ran-lego/index.html 301',
    '/living-book /i-ran-lego/index.html 301',
]
for line in route_lines:
    if line not in redirects:
        redirects += ('\n' if redirects and not redirects.endswith('\n') else '') + line + '\n'
redirects_path.write_text(redirects, encoding='utf-8')

sitemap_path = root / 'sitemap.xml'
if sitemap_path.exists():
    sitemap = sitemap_path.read_text(encoding='utf-8')
    url = 'https://blkck2.com/i-ran-lego/'
    if url not in sitemap:
        entry = '  <url><loc>https://blkck2.com/i-ran-lego/</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>\n'
        sitemap = sitemap.replace('</urlset>', entry + '</urlset>')
    sitemap_path.write_text(sitemap, encoding='utf-8')
PY

test -f "$BOOK_DIR/index.html"
test -f "$BOOK_DIR/app.js"
test -f "$BOOK_DIR/assets/audio/I_RAN_LEGO_MASTER.mp3"
test "$(find "$BOOK_DIR/assets/pages" -name 'page-*.webp' | wc -l)" -eq 21
grep -q "slug: 'i-ran-lego'" data/studio-sections.js
grep -q '/i-ran-lego' _redirects
grep -q 'https://blkck2.com/i-ran-lego/' sitemap.xml

printf '[I RAN LEGO] Living book assembled successfully (%s bytes source).\n' "$SIZE"
