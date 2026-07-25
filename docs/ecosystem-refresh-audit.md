# blkck2.com ecosystem refresh — audit

Audit date: 2026-07-25. Repository state at baseline: `702303f` on `main`.

Everything below was verified by inspecting this repository, the sibling
repositories and live HTTP responses. Nothing here is carried over from an
earlier summary.

---

## 1. Current repository architecture

Static HTML/CSS/JS. No framework, no bundler, no package manager. 36 HTML files,
one 60 KB `script.js`, one 77 KB `styles.css`, and two data files under `data/`
loaded as plain globals (`window.BSS_STUDIO_SECTIONS`, gallery items).

The homepage is data-driven: `data/studio-sections.js` holds 13 sections that
`script.js` renders into the scrolling section experience. That file is the
closest thing the repository already has to a project registry.

There is **one build step**: `scripts/prepare-i-ran-lego.py`, referenced by both
`vercel.json` and `netlify.toml`.

### The build step mutates tracked source files

`prepare-i-ran-lego.py` does more than unpack an archive. It:

1. Extracts `I_RAN_LEGO_LIVING_BOOK_v1.zip` into `i-ran-lego/`.
2. Patches the book's `app.js` and `config.js` to force demo mode.
3. Generates `i-ran-lego/sw.js`.
4. **Injects an `i-ran-lego` section into `data/studio-sections.js`.**
5. **Deletes the source ZIP** (`ARCHIVE.unlink`).

Step 4 uses `replace_once`, which **raises `RuntimeError` if its anchor text is
missing**. Two anchors in `data/studio-sections.js` are therefore load-bearing
and must survive any edit to that file:

- the exact line `{ label: 'Enter Black Wing Crew', href: 'https://blackwingcrew.netlify.app/', className: 'album-link', sub: 'Stream the Neon Venom LP.' },`
- the exact sequence `  {\n    slug: 'old-vic-state',`

If either is altered, **the build fails and the whole site stops deploying.**
Both injections are guarded by `if ... not in sections`, so they are idempotent.

Consequence: the committed `studio-sections.js` does not contain the
`i-ran-lego` section, but the deployed one does. The section is intentionally
**not** added by hand here, to leave the build's guard behaviour unchanged.

---

## 2. Current live-site architecture

`https://blkck2.com` is served by **Vercel** (`server: Vercel`,
`x-vercel-cache: HIT`). That is the authoritative deployment.

Three deployment configurations coexist in the repository:

| File | Platform | Status |
|---|---|---|
| `vercel.json` | Vercel | **Authoritative.** Build command + output dir only. No routes. |
| `netlify.toml` | Netlify | **Inert.** Redirects, headers and caching never run. |
| `_redirects` | Netlify | **Inert.** 40+ alias and extensionless rules never run. |
| `CNAME` (`blkck2.com`) | GitHub Pages | **Inert.** Harmless; retained. |

### The most significant defect found

Because Vercel does not read `_redirects` or `netlify.toml`, **every friendly
alias and extensionless URL on the live site 404s.** Verified:

| URL | Live status |
|---|---|
| `/chant`, `/krsnapaksi`, `/games`, `/metapet`, `/teachers`, `/press`, `/moss60`, `/gallery`, `/start-here`, `/proof-wall` | **404** |
| `/schools`, `/professional` (documented "professional mode" entry points) | **404** |
| every `*.html` page | 200 |
| `/i-ran-lego` | 200 (real directory, not the redirect rule) |

The security headers and cache-control rules in `netlify.toml` are also not
being applied.

Mitigating factor: no internal link and no sitemap entry uses an extensionless
URL, so on-site navigation is unaffected. The breakage hits externally shared
links, guessed URLs, and any printed QR artefact pointing at a short alias —
which this studio produces deliberately (`qr-portal.html`, the Print Street
Pack). This is fixed in the implementation by porting the rules into
`vercel.json`.

---

## 3. Sibling repository state (verified)

### `Blackcockatoo/bss`

Next.js 16 app. Serves two hostnames from one codebase, split by profile:

- `https://www.bluesnakestudios.com` — full studio/MetaPet universe. 200.
- `https://metapet.school` — constrained classroom build. 200.

The child-safe boundary is **real and enforced in production**. Verified by
following redirects on `metapet.school`:

| Requested | Result |
|---|---|
| `/body-forge`, `/shop`, `/digital-dna`, `/pet`, `/identity` | → `/schools/field` |
| `/monkey-invaders` | → `/schools/field` |
| `/teachers` | → `/schools/field` |
| `/schools` | `/schools` (allowed) |
| `/school-game` | `/school-game` (allowed) |

So `metapet.school` currently runs the **Field Mode** policy — tighter than the
general schools profile. Consumer areas *and* the arcade are genuinely
unreachable there. Portal copy must not imply otherwise.

### Arcade routes are NOT live yet

A sibling branch adds an `/arcade` hub, a `/bubblehex` route and a central
arcade registry to `bss`. **That branch is unmerged and undeployed:**

| URL | Live status |
|---|---|
| `https://www.bluesnakestudios.com/arcade` | **404** |
| `https://www.bluesnakestudios.com/bubblehex` | **404** |
| `https://www.bluesnakestudios.com/monkey-invaders` | 200 |

The portal therefore links to **canonical playable locations that resolve
today**, not to the pending hub. Revisit once that branch merges.

### `Blackcockatoo/bubblehex`

Next 16 + RSC + Cloudflare Workers arcade game, "BUBBLE HEX". Deploys to
`https://bubblehex.vercel.app` — **200, live**. Cannot be flattened to a single
static file, so it is linked, never vendored.

### `Blackcockatoo/monkey-invaders-enhanced`

Vite/React game with a substantially evolved engine (bosses, enemy types,
events, pickups, secrets, progression). Deploys to
`https://monkey-invaders-enhanced.vercel.app` — **200, live**.

**This is not the build served through `bss`.** `bss` serves an older
standalone port vendored at `public/monkey-invaders.html`, with its own smoke
tests written against that file's inline script. The two have diverged. The
portal preserves this distinction: the `bluesnakestudios.com` link is labelled
as the standalone port, the `.vercel.app` link as the enhanced build.

---

## 4. Project inventory and classification

### Properly surfaced already
- Gallery Rooms, Black Wing Crew, Neon Venom, Old Vic State, Frankston → Fuji,
  Print Street Pack, Teacher Tools, Moss 60 / Oracle Warden, Word Cube.

### Current but buried
- **Kṛṣṇapakṣi Chant** — `krsnapaksi-chant.html` is a strong, complete page
  (acrostic, 23 × 8 grid, chant mode, glossary, Reader Edition PDF, video,
  structured data, canonical URL). Assets verified present:
  `documents/the-pulse-of-krishna-reader-edition.pdf` (4.8 MB),
  `documents/chant/krsnapaksi-chant-og.jpg`. In the sitemap at priority 0.9.
  Linked only from `index.html`, `start.html`, `proof-wall.html` — **absent from
  `start-here.html`, `press-kit.html`, `field-guide.html` and the section
  registry.** Needs surfacing, not rebuilding.
- **I RAN, LEGO!** — canonical structure is already correct: `/i-ran-lego/` is
  the real implementation, `i-ran-lego.html` is a redirect stub carrying
  `<link rel="canonical">` and a meta refresh. No competing duplicate to
  resolve. Same surfacing gap as above.

### Present but stale
- **Meta-Pet section and page.** Marked `status: 'Prototype'`. Describes a
  single product. **Makes no mention of `metapet.school` at all**, despite that
  domain being live and being the school-facing product. Primary target of
  this refresh.
- **Games section.** Marked `status: 'Prototype'`. Links Monkey Invaders
  directly at `bluesnakestudios.com/monkey-invaders.html` (the raw vendored
  file rather than the route). **No Bubble Hex. No arcade destination.**

### Missing entirely
- Any arcade or games *page*. The homepage has a `games` section but no
  destination page, so games cannot be linked, shared or QR-coded.
- A single project registry with statuses, canonical URLs and verification
  dates. Status strings are currently duplicated across
  `data/studio-sections.js` and hand-written markup in `proof-wall.html`
  (22 × "Live", 3 × "Prototype", 1 × "Project"), with no shared source.

### Duplication noted, deliberately left alone
- `start.html` ("Choose Your Path") and `start-here.html` ("Patterns become
  worlds"). Genuinely different pages, both in the sitemap, both linked. Not
  duplicates in the harmful sense. Merging them is an editorial decision beyond
  this refresh.

---

## 5. Proposed information architecture

Preserve the existing 13-section scrolling structure — it is data-driven,
coherent, and carries the studio's identity. This refresh does **not**
restructure it. It:

1. Corrects the `meta-pet` section to describe the real two-domain split.
2. Rebuilds the `games` section around a real arcade destination.
3. Adds a `krsnapaksi` section so the devotional work is a first-class entry
   rather than a lore link.
4. Adds `arcade.html` as the games destination.
5. Introduces `data/projects.js` as the status source of truth.

The blkck2 twelve/thirteen-section geometry is untouched in count and order,
apart from the additions above, which append rather than reorder.

Note: the "twelve-sector compass" warned about in the brief lives in the `bss`
repository (`NAVIGATION_TARGETS`, twelve live sectors, pinned by tests and by
`docs/route-smoke-checklist.md`). It is **not** in this repository and has not
been touched.

---

## 6. Files expected to change

- `vercel.json` — port the dead redirect rules; add security headers.
- `data/projects.js` — new registry.
- `data/studio-sections.js` — meta-pet, games, new krsnapaksi section.
  Build anchors preserved verbatim.
- `arcade.html` — new destination.
- `meta-pet.html` — two-domain split.
- `start-here.html`, `press-kit.html` — surface Kṛṣṇapakṣi and I RAN, LEGO!.
- `proof-wall.html` — accurate statuses.
- `sitemap.xml` — add new and missing pages.
- `README.md` — replace the "bio resume" description.
- `scripts/check-site.py` — new link/registry validator.

## 7. Explicitly NOT changed

- The `i-ran-lego` section injection in `prepare-i-ran-lego.py`, and both of its
  anchor strings.
- Any artwork, music, document, ZIP or download asset, linked or not.
- Any existing asset path (QR-dependent artefacts rely on stable URLs).
- `CNAME`, `netlify.toml`, `_redirects` — retained for portability and to avoid
  breaking a future platform move; documented as inert.
- `start.html` / `start-here.html` consolidation.
- The gallery room structure and `data/gallery-items.js`.
- The `bss` twelve-sector compass geometry (different repository).
