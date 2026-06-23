# Claude Code Task — Finish B$S Print Vault integration

You are working in the `Blackcockatoo/blkck` repository for `blkck2.com`.

## Context
A first version of the B$S Print Vault has been added:

- `print.html`
- `downloads/black-wing-crew-lyric-sheet.html`
- `downloads/metapet-starter-sheet.html`
- `downloads/moss-60-glyph-sheet.html`
- `downloads/bss-colouring-page.html`
- `downloads/qr-poster-drop.html`
- `downloads/bss-proof-wall.html`

The sitemap and web app manifest already include the Print Vault:

- `sitemap.xml` includes `https://blkck2.com/print.html`
- `manifest.webmanifest` includes a `B$S Print Vault` app shortcut

## Goal
Make the Print Vault feel like a first-class section of `blkck2.com`, not a hidden extra page.

## Tasks

### 1. Homepage navigation
Add a visible `Print Vault` link to the homepage masthead navigation.

Current masthead links include:

- Start here
- Proof Wall
- Games
- @blkck2

Add:

- Print Vault → `print.html`

Keep the navigation responsive and do not break mobile layout.

### 2. Noscript fallback
In the large `<noscript>` fallback area in `index.html`, add `Print Vault` anywhere visitors are shown the main links.

Suggested wording:

> Print Vault — printable posters, worksheets, lyric sheets, QR drops and B$S starter artefacts.

### 3. Studio tree / script-driven section
Find the data structure in `script.js` that controls the studio tree panels.

Add a Print Vault or Print Street Pack entry that points clearly to `print.html`.

Use this copy:

**Label:** Print Vault  
**Eyebrow:** Printable archive · starter pack · workshops  
**Title:** Print the omen.  
**Statement:** A living shelf of printable artefacts from Blue $nake Studio — posters, colouring pages, lyric sheets, QR drops, teacher tools, symbolic worksheets and proof-of-work documents.

Links:

- Browse Print Vault → `print.html`
- View Proof Wall → `proof-wall.html`
- Contact for workshops → `mailto:bluesssnakestudio@gmail.com?subject=B%24S%20Print%20Vault%20Workshop%20Enquiry`

### 4. Real QR code
Replace the placeholder QR graphic in `downloads/qr-poster-drop.html` with a real QR code pointing to:

`https://blkck2.com/`

Keep it printable and high contrast.

### 5. Better download language
The current download links point to printable HTML pages. That is fine for now, but change the visible labels if needed from `Download` to:

- Open / Print
- Print Sheet
- Open Starter Sheet

Avoid promising PDF files until actual PDFs exist.

### 6. Final checks
Check:

- `index.html` loads
- `print.html` loads
- all six download pages load
- mobile layout stacks correctly
- browser print preview is white-background and clean
- no broken relative paths

## Do not

- Do not enable payment yet.
- Do not collect child data.
- Do not add ads, trackers, uploads or logins.
- Do not remove existing pages.
- Do not rewrite the whole design system.

## Commercial direction
Keep the portal and free starter prints free.

Future paid offer:

**B$S Founding Pack — $9.99 AUD**

Future real income paths:

- school creative sessions
- disability arts workshops
- custom QR poster packs
- music / lyric sheet design
- kid-safe creative worldbuilding
- B$S branding commissions
