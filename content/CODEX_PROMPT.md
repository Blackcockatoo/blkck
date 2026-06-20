# Codex Prompt

Build this folder into a polished Blue Snake Studios portfolio website.

Use the current structure as the source of truth:

- `index.html` is the static app shell.
- `styles.css` controls the dark-gold B$S look.
- `script.js` renders the hash-routed pages.
- `data/gallery-items.js` contains the gallery item metadata.
- `assets/` contains grouped image folders.
- `content/` contains sitemap, page copy and gallery labels.

Keep the core site pages:

- Home
- Auralia
- Insidious Rhythms
- Black Wing Crew
- Neon Venom
- Paintings
- B$S Branding
- MOSS60 / Geometry
- Process / Sketchbook
- About
- Contact

Design direction:

- dark luxury portfolio
- black, gold, deep blue, neon pink and venom green accents
- ornate but readable
- large visual-first gallery cards
- fast mobile layout
- clean modal image viewer
- clear collection filtering
- easy to add new images through `data/gallery-items.js`

Do not overcomplicate it with a database. Keep it static and deployable to Netlify, Vercel or GitHub Pages.

Potential improvements:

1. Add collection filter buttons on the home page.
2. Add a masonry layout for poster images.
3. Add lazy-loading thumbnails.
4. Add an individual detail route for each artwork.
5. Add a simple contact form placeholder.
6. Add SEO meta tags for each major collection.
7. Add a downloadable press / portfolio PDF later.
8. Add video thumbnails for the files in `assets/10_video/`.
