# blkck2.com — site switches and builders

## Paste-in switches (no code needed)

| What | File | Field |
| --- | --- | --- |
| Mailing list ("Join the Civilian Signal") | `data/site-config.js` | `signal.action` (+ `emailField` if your provider needs a different input name) |
| Store checkout per product | `data/store-products.js` | `paymentLink` on each product (Stripe Payment Link, Gumroad, or any hosted checkout URL) |
| Signal Radio tracks | `data/tracks.js` | append `{ n, title, mood, src, cover, album, artist }` — `src` must be a real audio URL |

Empty values are safe: the Signal form falls back to a pre-filled email to the studio, and store
buttons stay as the current email order. After editing, commit and push; nothing needs rebuilding.

## Builders (run locally after changing art, sections or worlds)

```bash
python3 scripts/optimize-images.py   # AVIF/WebP 640 + 1280 copies → opt/, manifest → data/image-manifest.js
python3 scripts/make-share-cards.py  # 1200×630 share cards → share/<world>.jpg (needs Gelasio + Inter fonts)
node scripts/build-worlds.mjs        # world pages /<slug>/, data/components.js, shared footers, sitemap.xml
node scripts/check-worlds.mjs        # verifies pages, share cards, opt/ copies, store ids, sitemap
node scripts/check-arcade-registry.mjs && node scripts/check-portfolio-truth.mjs
```

- World list, tracks (Music & Sound → Art & Myth → Play, plus the separate Learning & Civic track),
  page type and share art live in `data/worlds.js`.
- World page copy comes from `data/studio-sections.js` (+ the proof-strip facts in `script.js`) and
  artwork from `data/gallery-items.js`, so the portal and the static pages never drift.
- Generated files (`<slug>/index.html`, `data/components.js`, `sitemap.xml`, blocks between
  `<!-- bss:… -->` markers in existing pages) are overwritten by the builder — edit the sources instead.
