# blkck — the Blue $nake Studio portal

This repository powers **[blkck2.com](https://blkck2.com)**, the public portal
for **The Moss Man / Blue $nake Studio**, Frankston, Victoria.

It is not a résumé. It is the studio's front door and living index: what exists
right now, what you can play, read, watch or download, and where each thing
actually lives.

## Architecture

Static HTML, CSS and JavaScript. No framework, no bundler, no package manager.

| Path | Role |
|---|---|
| `index.html` + `script.js` + `styles.css` | The homepage experience. |
| `data/studio-sections.js` | Homepage sections, rendered by `script.js`. |
| `data/projects.js` | **Project registry — status source of truth.** |
| `data/gallery-items.js` | Gallery room contents. |
| `*.html` (root) | Destination pages: arcade, meta-pet, proof-wall, press-kit… |
| `apps/`, `downloads/`, `documents/` | Playable apps, printable packs, PDFs. |
| `i-ran-lego/` | **Build output.** Generated from the living-book ZIP. |
| `scripts/prepare-i-ran-lego.py` | The one build step. |
| `scripts/check-site.py` | Pre-deploy validation. |

## Canonical domain and deployment

**Production is `https://blkck2.com`, served by Vercel.** `vercel.json` is the
authoritative deployment configuration — build command, output directory,
redirects and headers all live there.

Three other deployment files exist and are **inert**. They are kept so the site
stays portable, but nothing in them runs today:

| File | Platform | Reality |
|---|---|---|
| `netlify.toml` | Netlify | Not executed. Vercel ignores it. |
| `_redirects` | Netlify | Not executed. Vercel ignores it. |
| `CNAME` | GitHub Pages | Not used. Harmless. |

> **If you add a redirect, add it to `vercel.json`.** Adding it only to
> `_redirects` will appear to work in review and do nothing in production.
> This exact drift previously left every friendly alias (`/chant`, `/games`,
> `/teachers`, `/press`, `/schools`…) returning 404 on the live site.

Note: `www.blkck2.com` currently has no certificate and is not attached to the
Vercel project. Domain-level canonicalisation must be configured in Vercel, not
in this repository.

## The build step mutates tracked files — read this before editing

`scripts/prepare-i-ran-lego.py` runs on every deploy. It unpacks
`I_RAN_LEGO_LIVING_BOOK_v1.zip` into `i-ran-lego/`, patches the book to demo
mode, generates its service worker, **deletes the source ZIP**, and **injects an
`i-ran-lego` section into `data/studio-sections.js`**.

That injection uses exact string matching and **raises if its anchor text is
missing**, which fails the build and stops the whole site deploying. Two strings
in `data/studio-sections.js` are therefore load-bearing:

- the `{ label: 'Enter Black Wing Crew', … sub: 'Stream the Neon Venom LP.' },` line
- the `  {\n    slug: 'old-vic-state',` sequence

Do not reformat, reorder or reword either one. `scripts/check-site.py` guards
both — it reports the failure before the deploy does.

Because the ZIP is deleted and `i-ran-lego/` is rewritten, **never commit the
result of a local build run.** Restore with
`git checkout -- I_RAN_LEGO_LIVING_BOOK_v1.zip i-ran-lego/`.

## Validation

```bash
python3 scripts/check-site.py       # link, sitemap, anchor and registry checks
python3 scripts/prepare-i-ran-lego.py   # the real build (destructive locally)
```

`check-site.py` verifies build anchors, that every internal link resolves, that
every sitemap URL maps to a real file, and that the project registry uses the
documented status vocabulary with a verification date on every entry.

## Relationship to the sibling repositories

blkck2.com is the portal. The products live in their own repositories and are
**linked, never vendored** — so visitors always get the current build.

| Project | Repository | Canonical URL |
|---|---|---|
| MetaPet — full universe | `Blackcockatoo/bss` | `https://www.bluesnakestudios.com` |
| MetaPet.school — classroom | `Blackcockatoo/bss` (schools/field profile) | `https://metapet.school` |
| Bubble Hex | `Blackcockatoo/bubblehex` | `https://bubblehex.vercel.app` |
| Monkey Invaders | `Blackcockatoo/bss` (vendored port) | `https://www.bluesnakestudios.com/monkey-invaders` |
| Monkey Invaders — enhanced | `Blackcockatoo/monkey-invaders-enhanced` | `https://monkey-invaders-enhanced.vercel.app` |

### Two things to get right

**1. MetaPet has two front doors, and they are different products.**
`bluesnakestudios.com` is the full universe. `metapet.school` is a deliberately
constrained classroom build running Field Mode, where the consumer areas *and*
the arcade are blocked at the request boundary — verified: `/body-forge`,
`/shop`, `/digital-dna`, `/pet`, `/identity` and `/monkey-invaders` all redirect
to `/schools/field`. Never describe consumer features as reachable from the
school domain.

**2. There are two Monkey Invaders.** The build served through
`bluesnakestudios.com` is an older standalone port vendored in the `bss`
repository. `monkey-invaders-enhanced` is a separate, more advanced engine
(bosses, events, pickups, secrets, progression). They have diverged. Do not
present the enhanced repository as the build the studio site serves.

An arcade hub (`/arcade`) and a `/bubblehex` route exist on an unmerged branch
in `bss`; both currently return 404 in production. The portal links to the
canonical playable locations above instead. Revisit once that branch ships.

## Adding a project without scattering route knowledge

1. Add one entry to **`data/projects.js`** — slug, title, category, status,
   audience, canonical URL, source location, description, `verified` date.
2. If it deserves a homepage section, add it to `data/studio-sections.js`.
3. If it needs a page, add the HTML file and a `sitemap.xml` entry.
4. If it needs a short URL, add a redirect to **`vercel.json`**.
5. Run `python3 scripts/check-site.py`.

### Status vocabulary

`live` · `active-dev` · `prototype` · `archive` · `concept` · `superseded`

**`live` means someone loaded the URL and exercised the main interaction**, and
recorded the date in `verified`. The existence of an HTML file is not evidence.
If you could not test it, use a weaker status and say why in `note`.

## Main strands

- **Meta-Pet** — privacy-first, child-safe digital companion and STEAM learning system.
- **Moss 60** — visual mathematics, symbolic number systems and digital-genome identity logic.
- **Arcade** — Bubble Hex, Monkey Invaders, the Six-Face Word Cube, the Oracle Warden.
- **Kṛṣṇapakṣi Chant** — a devotional code-poem: acrostic, 23 × 8 syllable grid, Reader Edition.
- **I RAN, LEGO!** — an interactive picture-book musical.
- **Black Wing Crew / Neon Venom** — the music world.
- **Teacher tools** — classroom behaviour supports and printable packs.
- **Frankston 2035 / Frankston → Fuji** — community and civic work.

## Links

- Portal: https://blkck2.com
- YouTube: https://www.youtube.com/@blkck2
- Jewble Elevator Pitch: https://elevator-pitch-seven.vercel.app/
- Email: bluesssnakestudio@gmail.com
