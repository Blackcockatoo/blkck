#!/usr/bin/env node
/* Static, crawlable world pages + shared component HTML + sitemap.
   Usage: node scripts/build-worlds.mjs
   Writes:
     <slug>/index.html               one page per world with page:'generated' in data/worlds.js
     data/components.js              pre-rendered map / signal / player / next-world HTML for the portal
     store.html, existing world pages  shared footer block between <!-- bss:footer --> markers
     sitemap.xml
   Content comes from data/studio-sections.js, data/gallery-items.js and data/worlds.js,
   so editing those and re-running keeps everything in step. */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { loadSiteData, ROOT, SITE } from './lib/site-data.mjs';

const data = loadSiteData();
const { sections, items, manifest, worldMap, tracks, facts } = data;
const bySlug = Object.fromEntries(sections.map((s) => [s.slug, s]));
const trackById = Object.fromEntries(worldMap.tracks.map((t) => [t.id, t]));
const today = new Date().toISOString().slice(0, 10);

const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (href) => /^(https?:|mailto:|#|\/)/.test(href) ? href : '/' + href.replace(/^\.\//, '');
const isExternal = (href) => /^https?:\/\//.test(href);
const extAttrs = (href) => isExternal(href) || /\.(pdf|zip)$/i.test(href) ? ' target="_blank" rel="noopener"' : '';

export function picture(src, alt, { sizes = '(max-width: 760px) 100vw, 33vw', eager = false, cls = '' } = {}) {
  const entry = manifest[src];
  const lazy = eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  const klass = cls ? ` class="${cls}"` : '';
  if (!entry) return `<img${klass} src="/${esc(src)}" alt="${esc(alt)}" ${lazy}>`;
  const [w, h, widths] = entry;
  const stem = src.replace(/\.[^.]+$/, '');
  const set = (ext) => widths.map((x) => `/opt/${esc(stem)}-${x}.${ext} ${x}w`).join(', ');
  return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img${klass} src="/${esc(src)}" width="${w}" height="${h}" alt="${esc(alt)}" ${lazy}></picture>`;
}

function sectionItems(section) {
  if (section.featuredIds) return section.featuredIds.map((id) => items.find((i) => i.id === id)).filter(Boolean);
  if (!section.series) return [];
  return items.filter((i) => section.series.includes(i.series));
}
function coverFor(slug) {
  const s = bySlug[slug];
  const first = s && sectionItems(s).find((i) => i.image);
  return first ? first.image : '01_auralia/auralia_cosmic_poster_v1.png';
}
const shareImage = (key) => `${SITE}/share/${key}.jpg`;

/* ── shared components ─────────────────────────────────────────────── */
export function signalHtml(id = 'signal') {
  return `<section class="bss-signal" aria-labelledby="${id}-title" data-bss-reveal>
  <p class="bss-signal-eyebrow">Civilian Signal · B$S dispatch</p>
  <h2 id="${id}-title">Join the <em>Civilian Signal</em></h2>
  <p>New songs, prints, drops and world openings from Blue $nake Studio — sent straight from Frankston. No spam. Leave any time.</p>
  <form action="mailto:bluesssnakestudio@gmail.com?subject=Join%20the%20Civilian%20Signal" method="post" enctype="text/plain" data-bss-signal>
    <label for="${id}-email">Email address</label>
    <input id="${id}-email" type="email" name="email" required autocomplete="email" placeholder="your@email.com">
    <button type="submit">Join the Signal</button>
  </form>
  <p class="bss-signal-status" role="status" aria-live="polite"></p>
  <p class="bss-signal-note">One email when something new is ready. Your address is never sold or shared.</p>
</section>`;
}

export function playerHtml(id = 'radio') {
  const list = tracks.map((t, i) => `<li><a href="${esc(t.src)}" data-src="${esc(t.src)}" data-title="${esc(t.title)}" data-meta="${esc(t.album + ' · ' + t.mood)}" data-cover="${esc(t.cover || '')}" data-artist="${esc(t.artist)}" data-album="${esc(t.album)}"><span class="n">${esc(t.n)}</span><span>${esc(t.title)}</span><span class="m">${esc(t.mood)}</span></a></li>`).join('\n    ');
  const first = tracks[0];
  return `<section class="bss-player" aria-labelledby="${id}-heading" data-bss-player data-bss-reveal>
  <div class="bss-player-head">
    <div class="bss-player-cover" role="img" aria-label="Cover art" style="background-image:url('${esc(first.cover)}')"></div>
    <div>
      <p class="bss-player-eyebrow" id="${id}-heading">Signal Radio · Black Wing Crew <span class="bss-eq" aria-hidden="true"><i></i><i></i><i></i></span></p>
      <h2 class="bss-player-title">${esc(first.title)}</h2>
      <p class="bss-player-meta">${esc(first.album + ' · ' + first.mood)}</p>
      <div class="bss-player-controls" hidden>
        <button type="button" class="bss-prev" aria-label="Previous track">◄◄</button>
        <button type="button" class="bss-play" aria-label="Play">►</button>
        <button type="button" class="bss-next-track" aria-label="Next track">►►</button>
        <div class="bss-player-bar"><span class="bss-cur">0:00</span><input class="bss-seek" type="range" min="0" max="1000" value="0" aria-label="Seek"><span class="bss-dur">0:00</span></div>
      </div>
      <audio controls preload="none" src="${esc(first.src)}"></audio>
    </div>
  </div>
  <ol class="bss-tracklist" aria-label="Tracks">
    ${list}
  </ol>
  <p class="bss-player-foot">The Neon Venom LP streams from <a href="https://blackwingcrew.netlify.app/" target="_blank" rel="noopener">Black Wing Crew</a> — lyrics, covers and downloads live there. Nothing loads until you press play.</p>
</section>`;
}

export function nextHtml(slug) {
  const next = worldMap.next(slug);
  if (!next) return '';
  const s = bySlug[next.slug] || {};
  const track = trackById[next.track];
  return `<a class="bss-next" href="${esc(next.href)}" data-bss-reveal>
  <div><small>Next world · ${esc(track.label)}</small><strong>${esc(s.label || next.slug)}</strong><span>${esc(next.short)}</span></div>
  <i aria-hidden="true">→</i>
</a>`;
}

export function worldMapHtml() {
  const main = worldMap.tracks.filter((t) => !t.separate);
  const sep = worldMap.tracks.filter((t) => t.separate);
  const trackBlock = (t, extra = '') => {
    const worlds = worldMap.worlds.filter((w) => w.track === t.id);
    return `<div class="bss-track${extra}">
      <h3>${esc(t.label)} <b>${String(worlds.length).padStart(2, '0')}</b></h3>
      <p>${esc(t.line)}</p>
      <ol>${worlds.map((w) => `<li><a href="${esc(w.href)}"><strong>${esc((bySlug[w.slug] || {}).label || w.slug)}</strong><span>${esc(w.short)}</span></a></li>`).join('')}</ol>
    </div>`;
  };
  return `<section class="bss-worldmap" aria-labelledby="worldmap-title" data-bss-reveal>
  <div class="bss-worldmap-head">
    <div><p class="bss-eyebrow">How the worlds connect</p><h2 id="worldmap-title">One wing, many worlds.</h2></div>
    <p>Start with the sound, follow the art, then play. Every world ends with a door to the next one. Schools and councils have their own quieter track below.</p>
  </div>
  <div class="bss-tracks">${main.map((t) => trackBlock(t)).join('')}</div>
  ${sep.map((t) => trackBlock(t, ' bss-track-separate')).join('')}
</section>`;
}

/* ── page shell ────────────────────────────────────────────────────── */
function head({ title, description, canonical, image, imageAlt, jsonld }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:site_name" content="Blue $nake Studio">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(imageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${image}">
  <meta name="theme-color" content="#07090c">
  <meta name="color-scheme" content="dark">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/icon-192.png">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="stylesheet" href="/worlds.css">
  <script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>
</head>`;
}

function topbar(current) {
  const nav = [
    ['/', 'Portal', true], ['/black-wing-crew.html', 'Music'], ['/visual-worlds/', 'Art'], ['/games/', 'Games'], ['/store.html', 'Store', true], ['/gov.html', 'Schools']
  ];
  return `<a class="bss-skip" href="#main">Skip to content</a>
<header class="bss-topbar">
  <a class="bss-brand" href="/" aria-label="Blue $nake Studio — home"><b>B$S</b><span>Blue $nake Studio<small>Frankston · Naarm · Victoria</small></span></a>
  <nav class="bss-topnav" aria-label="Main">${nav.map(([href, label, keep]) => `<a href="${href}"${keep ? ' class="bss-keep"' : ''}${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>
</header>`;
}

const footer = `<footer class="bss-footer">
  <p><strong>Blue $nake Studio</strong> · The Moss Man · Frankston, Victoria, Australia</p>
  <p><a href="/">Portal</a> · <a href="/store.html">Store</a> · <a href="/press-kit.html">Press kit</a> · <a href="/field-guide.html">Field guide</a> · <a href="/gov.html">Schools &amp; councils</a> · <a href="/privacy-policy.html">Privacy</a> · <a href="https://www.youtube.com/@blkck2" target="_blank" rel="noopener">YouTube @blkck2</a> · <a href="mailto:bluesssnakestudio@gmail.com">bluesssnakestudio@gmail.com</a></p>
</footer>`;

const scripts = `<script src="/data/site-config.js" defer></script>
<script src="/data/store-products.js" defer></script>
<script src="/bss-components.js" defer></script>`;

function artFigure(item) {
  if (item.mediaType === 'video') {
    return `<figure class="bss-art"><video class="bss-video" controls preload="none" playsinline src="/${esc(item.video)}" aria-label="${esc(item.title)}"></video><figcaption><strong>${esc(item.title)}</strong><span>${esc(item.medium || item.type || '')}</span></figcaption></figure>`;
  }
  const alt = item.description ? `${item.title} — ${item.description}` : item.title;
  return `<figure class="bss-art"><a href="/${esc(item.image)}" target="_blank" rel="noopener" aria-label="Open ${esc(item.title)} full size">${picture(item.image, alt, { sizes: '(max-width: 620px) 100vw, (max-width: 1100px) 50vw, 380px' })}</a><figcaption><strong>${esc(item.title)}</strong><span>${esc([item.medium, item.year].filter(Boolean).join(' · '))}</span></figcaption></figure>`;
}

function worldPage(world) {
  const s = bySlug[world.slug];
  if (!s) throw new Error(`No studio section for world ${world.slug}`);
  const track = trackById[world.track];
  const canonical = `${SITE}/${world.slug}/`;
  const title = s.pageTitle || `${s.label} — Blue $nake Studio`;
  const description = s.pageDescription || s.statement;
  const gallery = sectionItems(s);
  const cover = gallery.find((i) => i.image);
  const factRows = facts[world.slug] || [];
  const links = (s.links || []).map((l, i) => `<li><a class="bss-btn${i === 0 ? ' is-primary' : ''}" href="${esc(abs(l.href).replace(/^\/#/, '/#'))}"${extAttrs(l.href)}>${esc(l.label)}${isExternal(l.href) ? ' ↗' : ' →'}</a></li>`).join('');
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CreativeWork', '@id': canonical + '#work', name: s.label, headline: s.title, description, url: canonical, image: shareImage(world.slug), creator: { '@id': `${SITE}/#person` }, isPartOf: { '@type': 'WebSite', name: 'Blue $nake Studio', url: SITE + '/' } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Blue $nake Studio', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: track.label, item: SITE + '/#worlds' },
        { '@type': 'ListItem', position: 3, name: s.label, item: canonical }
      ] }
    ]
  };
  const titleHtml = esc(s.title).replace(/^(.*?)(\S+[.!?]?)$/, (m, a, b) => `${a}<em>${b}</em>`);
  return `${head({ title, description, canonical, image: shareImage(world.slug), imageAlt: `${s.label} — Blue $nake Studio share card`, jsonld })}
<body class="bss-page" data-world="${esc(world.slug)}">
${topbar(world.href)}
<main class="bss-main" id="main">
  <p class="bss-crumbs"><a href="/">Blue $nake Studio</a> / <a href="/#worlds">${esc(track.label)}</a> / ${esc(s.label)}</p>
  <section class="bss-hero">
    <div>
      <p class="bss-eyebrow">${esc(s.eyebrow || track.label)}</p>
      <h1>${titleHtml}</h1>
      <p class="bss-statement">${esc(s.statement)}</p>
      ${s.studioDescription ? `<p>${esc(s.studioDescription)}</p>` : ''}
      ${links ? `<ul class="bss-links">${links}</ul>` : ''}
    </div>
    ${cover ? `<figure class="bss-hero-art">${picture(cover.image, cover.description ? `${cover.title} — ${cover.description}` : cover.title, { sizes: '(max-width: 860px) 100vw, 50vw', eager: true })}</figure>` : ''}
  </section>
  ${(s.details || []).length ? `<section class="bss-section" aria-labelledby="about-title"><h2 id="about-title">Inside ${esc(s.label)}</h2><ul class="bss-details">${s.details.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></section>` : ''}
  ${factRows.length ? `<section class="bss-section" aria-labelledby="facts-title"><h2 id="facts-title">At a glance</h2><dl class="bss-facts">${factRows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></section>` : ''}
  ${gallery.length ? `<section class="bss-section" aria-labelledby="works-title"><h2 id="works-title">Selected works</h2><div class="bss-gallery">${gallery.map(artFigure).join('\n')}</div></section>` : ''}
  <p class="bss-portal-note">Prefer the full studio portal? <a href="/#${esc(world.slug)}">Open ${esc(s.label)} in the portal →</a></p>
</main>
${world.track === 'music' ? playerHtml('radio-' + world.slug) : ''}
${nextHtml(world.slug)}
${signalHtml('signal-' + world.slug)}
${footer}
${scripts}
</body>
</html>
`;
}

/* ── shared footer block for existing pages ────────────────────────── */
const MARK_START = '<!-- bss:footer -->';
const MARK_END = '<!-- /bss:footer -->';
const HEAD_START = '<!-- bss:head -->';
const HEAD_END = '<!-- /bss:head -->';
function replaceBlock(html, start, end, block, before) {
  const re = new RegExp(`${start}[\\s\\S]*?${end}\\n?`);
  const wrapped = `${start}\n${block}\n${end}\n`;
  if (re.test(html)) return html.replace(re, wrapped);
  const at = html.lastIndexOf(before);
  if (at < 0) throw new Error(`missing ${before}`);
  return html.slice(0, at) + wrapped + html.slice(at);
}
function setMeta(html, attr, key, value) {
  const re = new RegExp(`<meta\\s+${attr}="${key.replace(/[:]/g, '\\$&')}"\\s+content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attr}="${key}" content="${value}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<\/title>/, `</title>\n  ${tag}`);
}
function decorateExisting(file, { world, shareKey, player = false, store = false }) {
  const full = path.join(ROOT, file);
  let html = readFileSync(full, 'utf8');
  const blocks = [];
  if (player) blocks.push(playerHtml('radio-page'));
  if (world) blocks.push(nextHtml(world));
  blocks.push(signalHtml('signal-page'));
  const block = `<div class="bss-embed" style="padding:0 clamp(16px,4vw,40px) 48px">\n${blocks.join('\n')}\n</div>\n<script src="/data/site-config.js" defer></script>${store ? '\n<script src="/data/store-products.js" defer></script>' : ''}\n<script src="/bss-components.js" defer></script>`;
  html = replaceBlock(html, MARK_START, MARK_END, block, '</body>');
  html = replaceBlock(html, HEAD_START, HEAD_END, '<link rel="stylesheet" href="/worlds.css">', '</head>');
  if (shareKey) {
    const img = shareImage(shareKey);
    html = setMeta(html, 'property', 'og:image', img);
    html = setMeta(html, 'property', 'og:image:width', '1200');
    html = setMeta(html, 'property', 'og:image:height', '630');
    html = setMeta(html, 'name', 'twitter:card', 'summary_large_image');
    html = setMeta(html, 'name', 'twitter:image', img);
  }
  writeFileSync(full, html);
}

/* ── run ───────────────────────────────────────────────────────────── */
const generated = worldMap.worlds.filter((w) => w.page === 'generated');
for (const w of generated) {
  const dir = path.join(ROOT, w.slug);
  if (existsSync(dir) && !existsSync(path.join(dir, 'index.html'))) {
    const entries = readdirSync(dir);
    if (entries.length) throw new Error(`Refusing to write into non-empty folder ${w.slug}/`);
  }
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'index.html'), worldPage(w));
}

// Pre-rendered HTML for the single-page portal.
const components = {
  worldMap: worldMapHtml(),
  signal: signalHtml('signal-portal'),
  player: playerHtml('radio-portal'),
  next: Object.fromEntries(worldMap.worlds.map((w) => [w.slug, nextHtml(w.slug)])),
  pages: Object.fromEntries(worldMap.worlds.map((w) => [w.slug, w.href]))
};
writeFileSync(path.join(ROOT, 'data', 'components.js'),
  '/* Generated by scripts/build-worlds.mjs — edit the builder, not this file. */\nwindow.BSS_COMPONENT_HTML = ' + JSON.stringify(components) + ';\n');

const existing = worldMap.worlds.filter((w) => w.page === 'existing' && w.href.endsWith('.html'));
for (const w of existing) decorateExisting(w.href.slice(1), { world: w.slug, shareKey: w.slug, player: w.track === 'music' });
decorateExisting('store.html', { shareKey: 'store', store: true });

// Responsive <picture> markup for the hand-written pages that show artwork.
for (const file of ['store.html', 'stomps.html', 'krsnapaksi-chant.html', 'frankston-2035.html']) {
  const full = path.join(ROOT, file);
  const html = readFileSync(full, 'utf8');
  const out = html.replace(/<img\b([^>]*?)\bsrc="([^"]+)"([^>]*)>/g, (tag, pre, src, post) => {
    if (/data-bss-pic/.test(tag)) return tag;
    const key = src.replace(/^\.?\//, '');
    const entry = manifest[key];
    if (!entry) return tag;
    const [w, h, widths] = entry;
    const stem = key.replace(/\.[^.]+$/, '');
    const set = (ext) => widths.map((x) => `/opt/${stem}-${x}.${ext} ${x}w`).join(', ');
    let attrs = `${pre}src="${src}"${post}`.replace(/\s*\/$/, '');
    if (!/\bloading=/.test(attrs) && !/fetchpriority/.test(attrs)) attrs += ' loading="lazy"';
    if (!/\bdecoding=/.test(attrs)) attrs += ' decoding="async"';
    if (!/\bwidth=/.test(attrs)) attrs += ` width="${w}" height="${h}"`;
    const sizes = '(max-width: 760px) 100vw, 480px';
    return `<picture style="display:contents"><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img${attrs} data-bss-pic></picture>`;
  });
  if (out !== html) writeFileSync(full, out);
}

// No-JS home: the world map and the Signal form are plain HTML inside <noscript>.
{
  const file = path.join(ROOT, 'index.html');
  const html = readFileSync(file, 'utf8');
  writeFileSync(file, replaceBlock(html, '<!-- bss:noscript -->', '<!-- /bss:noscript -->', worldMapHtml() + '\n' + signalHtml('signal-noscript'), '<!-- CONTACT / FOOTER -->'));
}

// Sitemap: home, generated worlds, every public root page, and key sub-pages.
const exclude = new Set(['404.html', 'site-health.html', 'index.html', 'i-ran-lego.html']);
const rootPages = readdirSync(ROOT).filter((f) => f.endsWith('.html') && !exclude.has(f)).sort();
const subPages = ['auralia/', 'i-ran-lego/', 'documents/oss-734g-known-unknowns-register.html', 'apps/moss60-oracle-warden.html', 'apps/bs-word-cube.html',
  ...readdirSync(path.join(ROOT, 'downloads')).filter((f) => f.endsWith('.html')).sort().map((f) => 'downloads/' + f)];
const urls = [
  { loc: '/', priority: '1.0' },
  ...generated.map((w) => ({ loc: `/${w.slug}/`, priority: '0.9' })),
  ...rootPages.map((f) => ({ loc: '/' + f, priority: ['store.html', 'black-wing-crew.html', 'krsnapaksi-chant.html', 'stomps.html'].includes(f) ? '0.8' : '0.6' })),
  ...subPages.filter((p) => existsSync(path.join(ROOT, p.endsWith('/') ? p + 'index.html' : p))).map((p) => ({ loc: '/' + p, priority: '0.5' }))
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by scripts/build-worlds.mjs -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`Built ${generated.length} world pages, decorated ${existing.length + 1} existing pages, sitemap with ${urls.length} URLs.`);
