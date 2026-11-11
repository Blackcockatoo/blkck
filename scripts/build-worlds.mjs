#!/usr/bin/env node
/* Static, crawlable world pages + shared component HTML + sitemap, in English, Japanese and Hindi.
   Usage: node scripts/build-worlds.mjs
   Writes:
     <slug>/index.html               one page per world with page:'generated' in data/worlds.js
     ja/, hi/                        localized home, every world and the store (copy in data/i18n/<lang>.js)
     data/components.js              pre-rendered map / signal / player / next-world HTML for the portal
     store.html, existing world pages  shared footer block between <!-- bss:footer --> markers
     sitemap.xml
   Content comes from data/studio-sections.js, data/gallery-items.js and data/worlds.js,
   so editing those and re-running keeps everything in step. */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { loadSiteData, loadI18n, LANGS, ROOT, SITE } from './lib/site-data.mjs';

const data = loadSiteData();
const { sections, items, manifest, worldMap, tracks, facts, storeProducts } = data;
const I18N = loadI18n();
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
const shareImage = (key, lang = 'en') => `${SITE}/share/${lang === 'en' ? '' : lang + '/'}${key}.jpg`;

/* ── i18n ──────────────────────────────────────────────────────────────
   English strings below are the source; data/i18n/<lang>.js overrides them.
   Anything missing or null in a translation falls back to English (marked lang="en"). */
const UI_EN = {
  lang: 'en', ogLocale: 'en_AU', name: 'English',
  nav: { portal: 'Portal', music: 'Music', art: 'Art', games: 'Games', store: 'Store', schools: 'Schools' },
  skip: 'Skip to content', brandSub: 'Frankston · Naarm · Victoria', crumbHome: 'Blue $nake Studio',
  inside: 'Inside {label}', glance: 'At a glance', works: 'Selected works',
  portalNote: 'Prefer the full studio portal?', portalLink: 'Open {label} in the portal →', englishPage: 'Full English page →',
  openFull: 'Open {title} full size', next: 'Next world', langLabel: 'Language',
  facts: {},
  signal: {
    eyebrow: 'Civilian Signal · B$S dispatch', title: 'Join the <em>Civilian Signal</em>',
    body: 'New songs, prints, drops and world openings from Blue $nake Studio — sent straight from Frankston. No spam. Leave any time.',
    label: 'Email address', placeholder: 'your@email.com', button: 'Join the Signal',
    note: 'One email when something new is ready. Your address is never sold or shared.'
  },
  player: {
    eyebrow: 'Signal Radio · Black Wing Crew', tracks: 'Tracks', prev: 'Previous track', play: 'Play', pause: 'Pause', next: 'Next track', seek: 'Seek', cover: 'Cover art',
    foot: 'The Neon Venom LP streams from <a href="https://blackwingcrew.netlify.app/" target="_blank" rel="noopener">Black Wing Crew</a> — lyrics, covers and downloads live there. Nothing loads until you press play.'
  },
  map: { eyebrow: 'How the worlds connect', title: 'One wing, many worlds.', body: 'Start with the sound, follow the art, then play. Every world ends with a door to the next one. Schools and councils have their own quieter track below.' },
  footer: { line: '<strong>Blue $nake Studio</strong> · The Moss Man · Frankston, Victoria, Australia', press: 'Press kit', guide: 'Field guide', schools: 'Schools &amp; councils', privacy: 'Privacy' }
};
const LANG_NAMES = { en: 'EN', ja: '日本語', hi: 'हिन्दी' };
const FONT_CSS = {
  ja: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Serif+JP:wght@500;700&display=swap',
  hi: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&family=Tiro+Devanagari+Hindi:ital@0;1&display=swap'
};
function merge(base, over) {
  if (!over || typeof over !== 'object' || Array.isArray(over)) return over ?? base;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) if (v !== null && v !== undefined) out[k] = (base && typeof base[k] === 'object' && !Array.isArray(base[k])) ? merge(base[k], v) : v;
  return out;
}
const UI = Object.fromEntries([['en', UI_EN], ...LANGS.map((l) => [l, merge(UI_EN, I18N[l].ui)])]);
const fill = (str, vars) => String(str).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
const tr = (lang) => (lang === 'en' ? {} : I18N[lang]);
const enAttr = (lang, isEn) => (lang !== 'en' && isEn ? ' lang="en"' : '');
const pre = (lang) => (lang === 'en' ? '' : '/' + lang);

// Localized view of a studio section; `_en` records which fields stayed in English.
function sec(slug, lang = 'en') {
  const s = bySlug[slug];
  if (!s || lang === 'en') return s && { ...s, _en: {} };
  const o = (tr(lang).sections || {})[slug] || {};
  const out = { ...s, _en: {} };
  for (const k of ['label', 'eyebrow', 'title', 'statement', 'studioDescription', 'pageTitle', 'pageDescription']) {
    if (o[k]) out[k] = o[k]; else if (s[k]) out._en[k] = true;
  }
  out.details = (s.details || []).map((d, i) => (o.details && o.details[i]) ? { text: o.details[i] } : { text: d, en: true });
  out.links = (s.links || []).map((l, i) => ({ ...l, label: (o.links && o.links[i]) || l.label, en: !(o.links && o.links[i]) }));
  return out;
}
const trackOf = (id, lang = 'en') => merge(trackById[id], (tr(lang).tracks || {})[id]);
const shortOf = (w, lang = 'en') => ((tr(lang).worlds || {})[w.slug]) || w.short;
const descOf = (item, lang = 'en') => ((tr(lang).items || {})[item.id]) || item.description;
function factsOf(slug, lang = 'en') {
  const rows = facts[slug] || [];
  const o = (tr(lang).facts || {})[slug] || [];
  return rows.map(([k, v], i) => ({ k: UI[lang].facts[k] || k, v: o[i] || v, en: lang !== 'en' && !o[i] }));
}
const worldBySlug = Object.fromEntries(worldMap.worlds.map((w) => [w.slug, w]));
const worldByHref = Object.fromEntries(worldMap.worlds.map((w) => [w.href, w]));
// English URL path of a world → its localized twin (every world has one under /<lang>/<slug>/).
function lhref(href, lang) {
  if (lang === 'en' || !href) return href;
  const clean = href.replace(/^\.\//, '/').replace(/^(?![/#]|https?:|mailto:)/, '/');
  if (clean === '/' || clean === '/index.html') return `/${lang}/`;
  if (clean === '/store.html') return `/${lang}/store/`;
  const w = worldByHref[clean] || worldByHref[clean.replace(/index\.html$/, '')];
  return w ? `/${lang}/${w.slug}/` : href;
}
// Alternate URLs (path only) for a page, keyed by language.
const altsFor = (enPath, locPath) => Object.fromEntries([['en', enPath], ...LANGS.map((l) => [l, locPath(l)])]);
const worldAlts = (w) => altsFor(w.page === 'generated' ? `/${w.slug}/` : w.href, (l) => `/${l}/${w.slug}/`);
const HOME_ALTS = altsFor('/', (l) => `/${l}/`);
const STORE_ALTS = altsFor('/store.html', (l) => `/${l}/store/`);
function hreflangLinks(alts, indent = '') {
  return [...Object.entries(alts).map(([l, p]) => `<link rel="alternate" hreflang="${l}" href="${SITE}${p}">`), `<link rel="alternate" hreflang="x-default" href="${SITE}${alts.en}">`].join('\n' + indent);
}
function langSwitch(alts, lang, cls = 'bss-lang') {
  return `<nav class="${cls}" aria-label="${esc(UI[lang].langLabel)}">${Object.entries(alts).map(([l, p]) => `<a href="${esc(p)}" hreflang="${l}" lang="${l}" data-bss-lang="${l}"${l === lang ? ' aria-current="true"' : ''}>${LANG_NAMES[l]}</a>`).join('')}</nav>`;
}


/* ── shared components ─────────────────────────────────────────────── */
export function signalHtml(id = 'signal', lang = 'en') {
  const t = UI[lang].signal;
  const msgs = lang === 'en' ? '' : ['noteFallback', 'statusLive', 'statusMail'].map((k) => ` data-msg-${k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}="${esc(t[k])}"`).join('');
  return `<section class="bss-signal" aria-labelledby="${id}-title" data-bss-reveal>
  <p class="bss-signal-eyebrow">${esc(t.eyebrow)}</p>
  <h2 id="${id}-title">${t.title}</h2>
  <p>${esc(t.body)}</p>
  <form action="mailto:bluesssnakestudio@gmail.com?subject=Join%20the%20Civilian%20Signal" method="post" enctype="text/plain" data-bss-signal${msgs}>
    <label for="${id}-email">${esc(t.label)}</label>
    <input id="${id}-email" type="email" name="email" required autocomplete="email" placeholder="${esc(t.placeholder)}">
    <button type="submit">${esc(t.button)}</button>
  </form>
  <p class="bss-signal-status" role="status" aria-live="polite"></p>
  <p class="bss-signal-note">${esc(t.note)}</p>
</section>`;
}

export function playerHtml(id = 'radio', lang = 'en') {
  const t = UI[lang].player;
  const en = lang === 'en' ? '' : ' lang="en"';
  const list = tracks.map((tk, i) => `<li><a href="${esc(tk.src)}" data-src="${esc(tk.src)}" data-title="${esc(tk.title)}" data-meta="${esc(tk.album + ' · ' + tk.mood)}" data-cover="${esc(tk.cover || '')}" data-artist="${esc(tk.artist)}" data-album="${esc(tk.album)}"${en}><span class="n">${esc(tk.n)}</span><span>${esc(tk.title)}</span><span class="m">${esc(tk.mood)}</span></a></li>`).join('\n    ');
  const first = tracks[0];
  const labels = lang === 'en' ? '' : ` data-label-play="${esc(t.play)}" data-label-pause="${esc(t.pause)}"`;
  return `<section class="bss-player" aria-labelledby="${id}-heading" data-bss-player${labels} data-bss-reveal>
  <div class="bss-player-head">
    <div class="bss-player-cover" role="img" aria-label="${esc(t.cover)}" style="background-image:url('${esc(first.cover)}')"></div>
    <div>
      <p class="bss-player-eyebrow" id="${id}-heading">${esc(t.eyebrow)} <span class="bss-eq" aria-hidden="true"><i></i><i></i><i></i></span></p>
      <h2 class="bss-player-title"${en}>${esc(first.title)}</h2>
      <p class="bss-player-meta"${en}>${esc(first.album + ' · ' + first.mood)}</p>
      <div class="bss-player-controls" hidden>
        <button type="button" class="bss-prev" aria-label="${esc(t.prev)}">◄◄</button>
        <button type="button" class="bss-play" aria-label="${esc(t.play)}">►</button>
        <button type="button" class="bss-next-track" aria-label="${esc(t.next)}">►►</button>
        <div class="bss-player-bar"><span class="bss-cur">0:00</span><input class="bss-seek" type="range" min="0" max="1000" value="0" aria-label="${esc(t.seek)}"><span class="bss-dur">0:00</span></div>
      </div>
      <audio controls preload="none" src="${esc(first.src)}"></audio>
    </div>
  </div>
  <ol class="bss-tracklist" aria-label="${esc(t.tracks)}">
    ${list}
  </ol>
  <p class="bss-player-foot">${t.foot}</p>
</section>`;
}

export function nextHtml(slug, lang = 'en') {
  const next = worldMap.next(slug);
  if (!next) return '';
  const s = sec(next.slug, lang) || {};
  const track = trackOf(next.track, lang);
  const href = lang === 'en' ? next.href : `/${lang}/${next.slug}/`;
  return `<a class="bss-next" href="${esc(href)}" data-bss-reveal>
  <div><small>${esc(UI[lang].next)} · ${esc(track.label)}</small><strong>${esc(s.label || next.slug)}</strong><span>${esc(shortOf(next, lang))}</span></div>
  <i aria-hidden="true">→</i>
</a>`;
}

export function worldMapHtml(lang = 'en') {
  const t = UI[lang].map;
  const main = worldMap.tracks.filter((tk) => !tk.separate);
  const sep = worldMap.tracks.filter((tk) => tk.separate);
  const trackBlock = (tk, extra = '') => {
    const worlds = worldMap.worlds.filter((w) => w.track === tk.id);
    const lt = trackOf(tk.id, lang);
    return `<div class="bss-track${extra}">
      <h3>${esc(lt.label)} <b>${String(worlds.length).padStart(2, '0')}</b></h3>
      <p>${esc(lt.line)}</p>
      <ol>${worlds.map((w) => `<li><a href="${esc(lang === 'en' ? w.href : `/${lang}/${w.slug}/`)}"><strong>${esc((sec(w.slug, lang) || {}).label || w.slug)}</strong><span>${esc(shortOf(w, lang))}</span></a></li>`).join('')}</ol>
    </div>`;
  };
  return `<section class="bss-worldmap" aria-labelledby="worldmap-title" data-bss-reveal>
  <div class="bss-worldmap-head">
    <div><p class="bss-eyebrow">${esc(t.eyebrow)}</p><h2 id="worldmap-title">${esc(t.title)}</h2></div>
    <p>${esc(t.body)}</p>
  </div>
  <div class="bss-tracks">${main.map((tk) => trackBlock(tk)).join('')}</div>
  ${sep.map((tk) => trackBlock(tk, ' bss-track-separate')).join('')}
</section>`;
}

/* ── page shell ────────────────────────────────────────────────────── */
function head({ title, description, canonical, image, imageAlt, jsonld, lang = 'en', alts }) {
  const u = UI[lang];
  const fonts = FONT_CSS[lang] ? `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="${FONT_CSS[lang]}">` : '';
  const locales = Object.keys(alts || {}).filter((l) => l !== lang).map((l) => `\n  <meta property="og:locale:alternate" content="${UI[l].ogLocale}">`).join('');
  return `<!doctype html>
<html lang="${u.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">${alts ? '\n  ' + hreflangLinks(alts, '  ') : ''}
  <meta property="og:site_name" content="Blue $nake Studio">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${u.ogLocale}">${locales}
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
  <link rel="manifest" href="/manifest.webmanifest">${fonts}
  <link rel="stylesheet" href="/worlds.css">
  <script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>
</head>`;
}

function topbar(current, lang = 'en', alts = null) {
  const n = UI[lang].nav;
  const p = pre(lang);
  const nav = [
    [p + '/', n.portal, true], [lang === 'en' ? '/black-wing-crew.html' : p + '/black-wing-crew/', n.music], [p + '/visual-worlds/', n.art], [p + '/games/', n.games], [lang === 'en' ? '/store.html' : p + '/store/', n.store, true], [lang === 'en' ? '/gov.html' : p + '/teacher-tools/', n.schools]
  ];
  return `<a class="bss-skip" href="#main">${esc(UI[lang].skip)}</a>
<header class="bss-topbar">
  <a class="bss-brand" href="${p}/" aria-label="Blue $nake Studio — home"><b>B$S</b><span>Blue $nake Studio<small>${esc(UI[lang].brandSub)}</small></span></a>
  <nav class="bss-topnav" aria-label="Main">${nav.map(([href, label, keep]) => `<a href="${href}"${keep ? ' class="bss-keep"' : ''}${href === current ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('')}</nav>${alts ? '\n  ' + langSwitch(alts, lang) : ''}
</header>`;
}

function footer(lang = 'en') {
  const f = UI[lang].footer;
  const p = pre(lang);
  return `<footer class="bss-footer">
  <p>${f.line}</p>
  <p><a href="${p}/">${esc(UI[lang].nav.portal)}</a> · <a href="${lang === 'en' ? '/store.html' : p + '/store/'}">${esc(UI[lang].nav.store)}</a> · <a href="/press-kit.html">${f.press}</a> · <a href="/field-guide.html">${f.guide}</a> · <a href="/gov.html">${f.schools}</a> · <a href="/privacy-policy.html">${f.privacy}</a> · <a href="https://www.youtube.com/@blkck2" target="_blank" rel="noopener">YouTube @blkck2</a> · <a href="mailto:bluesssnakestudio@gmail.com">bluesssnakestudio@gmail.com</a></p>
</footer>`;
}

const scripts = `<script src="/data/site-config.js" defer></script>
<script src="/data/store-products.js" defer></script>
<script src="/bss-components.js" defer></script>`;

function artFigure(item, lang = 'en') {
  const en = lang === 'en' ? '' : ' lang="en"';
  if (item.mediaType === 'video') {
    return `<figure class="bss-art"><video class="bss-video" controls preload="none" playsinline src="/${esc(item.video)}" aria-label="${esc(item.title)}"></video><figcaption><strong${en}>${esc(item.title)}</strong><span${en}>${esc(item.medium || item.type || '')}</span></figcaption></figure>`;
  }
  const desc = descOf(item, lang);
  const alt = desc ? `${item.title} — ${desc}` : item.title;
  const blurb = lang !== 'en' && desc ? `<span class="bss-art-desc">${esc(desc)}</span>` : '';
  return `<figure class="bss-art"><a href="/${esc(item.image)}" target="_blank" rel="noopener" aria-label="${esc(fill(UI[lang].openFull, { title: item.title }))}">${picture(item.image, alt, { sizes: '(max-width: 620px) 100vw, (max-width: 1100px) 50vw, 380px' })}</a><figcaption><strong${en}>${esc(item.title)}</strong><span${en}>${esc([item.medium, item.year].filter(Boolean).join(' · '))}</span>${blurb}</figcaption></figure>`;
}

const TEACHER_PACK_URL = 'https://teachers-secret-cheatsheet.vercel.app/';
/** The Teacher's Secret Cheatsheet menu (seven tools, audiences, principles) on /ja/ and /hi/ Teacher Tools. English keeps teacher-tools.html. */
function teacherPackHtml(lang) {
  const p = lang === 'en' ? null : I18N[lang].teacherPack;
  if (!p) return '';
  const rows = (list) => list.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
  return `<section class="bss-section bss-pack" aria-labelledby="pack-title">
    <p class="bss-eyebrow">${esc(p.eyebrow)}</p>
    <h2 id="pack-title">${esc(p.title)}</h2>
    <p class="bss-statement">${esc(p.intro)}</p>
    <ol class="bss-details bss-steps bss-pack-tools">${p.tools.map(([k, v]) => `<li><strong>${esc(k)}</strong> ${esc(v)}</li>`).join('')}</ol>
    <ul class="bss-links"><li><a class="bss-btn is-primary" href="${TEACHER_PACK_URL}" target="_blank" rel="noopener" hreflang="en">${esc(p.open)} ↗</a></li><li><a class="bss-btn" href="/teacher-tools.html" hreflang="en">${esc(UI[lang].englishPage)}</a></li></ul>
    <p class="bss-pack-note">${esc(p.packNote)}</p>
  </section>
  <section class="bss-section" aria-labelledby="pack-who-title"><h2 id="pack-who-title">${esc(p.whoTitle)}</h2><dl class="bss-facts">${rows(p.who)}</dl></section>
  <section class="bss-section" aria-labelledby="pack-how-title"><h2 id="pack-how-title">${esc(p.howTitle)}</h2><dl class="bss-facts">${rows(p.how)}</dl></section>
  <section class="bss-section" aria-labelledby="pack-bundle-title"><h2 id="pack-bundle-title">${esc(p.bundleTitle)}</h2><p>${esc(p.bundle)}</p><ul class="bss-links"><li><a class="bss-btn" href="${pre(lang)}/meta-pet/">Meta-Pet →</a></li></ul><p class="bss-pack-note">${esc(p.disclaimer)}</p></section>`;
}

function worldPage(world, lang = 'en') {
  const s = sec(world.slug, lang);
  if (!s) throw new Error(`No studio section for world ${world.slug}`);
  const u = UI[lang];
  const track = trackOf(world.track, lang);
  const alts = worldAlts(world);
  const canonical = SITE + alts[lang];
  const title = s.pageTitle || `${s.label} — Blue $nake Studio`;
  const description = s.pageDescription || s.statement;
  const gallery = sectionItems(s);
  const cover = gallery.find((i) => i.image);
  const factRows = factsOf(world.slug, lang);
  const details = lang === 'en' ? (s.details || []).map((d) => ({ text: d })) : s.details;
  const links = (s.links || []).map((l, i) => {
    const original = abs(l.href).replace(/^\/#/, '/#');
    let href = lhref(original, lang);
    // A link to this world's own standalone experience (the I RAN, LEGO! living book, the STOMPS
    // spread…) must keep opening it, not loop back to the localized overview it sits on.
    const opensEnglish = lang !== 'en' && href === alts[lang];
    if (opensEnglish) href = original;
    return `<li><a class="bss-btn${i === 0 ? ' is-primary' : ''}" href="${esc(href)}"${extAttrs(l.href)}${enAttr(lang, l.en)}${opensEnglish ? ' hreflang="en"' : ''}>${esc(l.label)}${isExternal(l.href) ? ' ↗' : ' →'}</a></li>`;
  }).join('');
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CreativeWork', '@id': canonical + '#work', name: s.label, headline: s.title, description, inLanguage: u.lang, url: canonical, image: shareImage(world.slug, lang), creator: { '@id': `${SITE}/#person` }, isPartOf: { '@type': 'WebSite', name: 'Blue $nake Studio', url: SITE + '/' } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Blue $nake Studio', item: SITE + pre(lang) + '/' },
        { '@type': 'ListItem', position: 2, name: track.label, item: SITE + pre(lang) + '/#worlds' },
        { '@type': 'ListItem', position: 3, name: s.label, item: canonical }
      ] }
    ]
  };
  if (lang === 'en') delete jsonld['@graph'][0].inLanguage;
  // Gold <em> on the last word; CJK/Devanagari titles get it on the last phrase after a comma/full stop instead.
  const titleHtml = lang === 'ja'
    ? esc(s.title).replace(/^(.*[、。])(.+?)([。！？]?)$/, (m, a, b, c) => `${a}<em>${b}</em>${c}`)
    : lang === 'hi'
      ? esc(s.title).replace(/^(.*?)(\S+(?:\s+(?:है|हैं|था|थे|गया|जाते|जाता))?\s*[।.!?]?)$/u, (m, a, b) => `${a}<em>${b}</em>`)
      : esc(s.title).replace(/^(.*?)(\S+[.!?]?)$/, (m, a, b) => `${a}<em>${b}</em>`);
  const portalNote = lang === 'en'
    ? `<p class="bss-portal-note">Prefer the full studio portal? <a href="/#${esc(world.slug)}">Open ${esc(s.label)} in the portal →</a></p>`
    : `<p class="bss-portal-note">${esc(u.portalNote)} <a href="/#${esc(world.slug)}" hreflang="en">${esc(fill(u.portalLink, { label: s.label }))}</a>${world.page === 'existing' ? ` · <a href="${esc(world.href)}" hreflang="en">${esc(u.englishPage)}</a>` : ''}</p>`;
  return `${head({ title, description, canonical, image: shareImage(world.slug, lang), imageAlt: `${s.label} — Blue $nake Studio share card`, jsonld, lang, alts })}
<body class="bss-page" data-world="${esc(world.slug)}">
${topbar(lang === 'en' ? world.href : alts[lang], lang, alts)}
<main class="bss-main" id="main">
  <p class="bss-crumbs"><a href="${pre(lang)}/">Blue $nake Studio</a> / <a href="${pre(lang)}/#worlds">${esc(track.label)}</a> / ${esc(s.label)}</p>
  <section class="bss-hero">
    <div>
      <p class="bss-eyebrow"${enAttr(lang, s._en.eyebrow)}>${esc(s.eyebrow || track.label)}</p>
      <h1${enAttr(lang, s._en.title)}>${titleHtml}</h1>
      <p class="bss-statement"${enAttr(lang, s._en.statement)}>${esc(s.statement)}</p>
      ${s.studioDescription ? `<p${enAttr(lang, s._en.studioDescription)}>${esc(s.studioDescription)}</p>` : ''}
      ${links ? `<ul class="bss-links">${links}</ul>` : ''}
    </div>
    ${cover ? `<figure class="bss-hero-art">${picture(cover.image, descOf(cover, lang) ? `${cover.title} — ${descOf(cover, lang)}` : cover.title, { sizes: '(max-width: 860px) 100vw, 50vw', eager: true })}</figure>` : ''}
  </section>
  ${world.slug === 'teacher-tools' && lang !== 'en' ? teacherPackHtml(lang) + '\n  ' : ''}${details.length ? `<section class="bss-section" aria-labelledby="about-title"><h2 id="about-title">${esc(fill(u.inside, { label: s.label }))}</h2><ul class="bss-details">${details.map((d) => `<li${enAttr(lang, d.en)}>${esc(d.text)}</li>`).join('')}</ul></section>` : ''}
  ${factRows.length ? `<section class="bss-section" aria-labelledby="facts-title"><h2 id="facts-title">${esc(u.glance)}</h2><dl class="bss-facts">${factRows.map((r) => `<div><dt>${esc(r.k)}</dt><dd${enAttr(lang, r.en)}>${esc(r.v)}</dd></div>`).join('')}</dl></section>` : ''}
  ${gallery.length ? `<section class="bss-section" aria-labelledby="works-title"><h2 id="works-title">${esc(u.works)}</h2><div class="bss-gallery">${gallery.map((i) => artFigure(i, lang)).join('\n')}</div></section>` : ''}
  ${portalNote}
</main>
${world.track === 'music' ? playerHtml('radio-' + world.slug, lang) : ''}
${nextHtml(world.slug, lang)}
${signalHtml('signal-' + world.slug, lang)}
${footer(lang)}
${scripts}
</body>
</html>
`;
}

/* ── localized home + store ────────────────────────────────────────── */
const FEATURED = {
  ja: ['old-vic-state', 'frankston-fuji', 'black-wing-crew', 'meta-pet', 'visual-worlds', 'games'],
  hi: ['old-vic-state', 'krsnapaksi', 'black-wing-crew', 'meta-pet', 'visual-worlds', 'games']
};
function homePage(lang) {
  const u = UI[lang];
  const h = u.home;
  const canonical = `${SITE}/${lang}/`;
  const card = (slug) => {
    const w = worldBySlug[slug];
    const s = sec(slug, lang);
    const img = w.shareArt && !w.shareArt.startsWith('zip:') ? w.shareArt : coverFor(slug);
    return `<a class="bss-card" href="/${lang}/${slug}/" data-bss-reveal>${picture(img, '', { sizes: '(max-width: 620px) 100vw, (max-width: 1100px) 50vw, 380px' })}<span class="bss-card-copy"><small>${esc(trackOf(w.track, lang).label)}</small><strong>${esc(s.label)}</strong><span>${esc(shortOf(w, lang))}</span></span></a>`;
  };
  const jsonld = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Blue $nake Studio', url: canonical, inLanguage: lang, description: h.description, publisher: { '@id': `${SITE}/#person` } };
  return `${head({ title: h.title, description: h.description, canonical, image: shareImage('home', lang), imageAlt: 'Blue $nake Studio', jsonld, lang, alts: HOME_ALTS })}
<body class="bss-page bss-home" data-world="home">
${topbar(`/${lang}/`, lang, HOME_ALTS)}
<main class="bss-main" id="main">
  <section class="bss-hero">
    <div>
      <p class="bss-eyebrow">${esc(h.eyebrow)}</p>
      <h1>${h.h1}</h1>
      <p class="bss-statement">${esc(h.lead)}</p>
      <p>${esc(h.body)}</p>
      <ul class="bss-links">
        <li><a class="bss-btn is-primary" href="#worlds">${esc(h.ctaWorlds)} →</a></li>
        <li><a class="bss-btn" href="#radio-home-heading">${esc(h.ctaListen)} →</a></li>
        <li><a class="bss-btn" href="/${lang}/meta-pet/">${esc(h.ctaMetaPet)} →</a></li>
        <li><a class="bss-btn" href="/${lang}/store/">${esc(h.ctaStore)} →</a></li>
      </ul>
    </div>
    <figure class="bss-hero-art">${picture('01_auralia/auralia_cosmic_poster_v1.png', 'Auralia — Black Birds Dream', { sizes: '(max-width: 860px) 100vw, 50vw', eager: true })}</figure>
  </section>
  <section class="bss-section" aria-labelledby="featured-title">
    <h2 id="featured-title">${esc(h.featured)}</h2>
    <div class="bss-cards">${FEATURED[lang].map(card).join('\n')}</div>
  </section>
  <div id="worlds">${worldMapHtml(lang)}</div>
  <p class="bss-portal-note"><a href="/" hreflang="en">${esc(h.fullPortal)}</a></p>
</main>
${playerHtml('radio-home', lang)}
${signalHtml('signal-home', lang)}
${footer(lang)}
${scripts}
</body>
</html>
`;
}

// Product cards are read from store.html so the localized stores never drift from the English one.
function storeCards() {
  const html = readFileSync(path.join(ROOT, 'store.html'), 'utf8');
  const decode = (v) => v.replace(/&amp;/g, '&').replace(/&middot;/g, '·').replace(/&#8594;/g, '→').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  return [...html.matchAll(/<article class="card[^"]*"[\s\S]*?<\/article>/g)].map(([c]) => ({
    id: c.match(/data-product="([^"]+)"/)[1],
    types: (c.match(/data-types="([^"]+)"/) || [, ''])[1],
    title: decode(c.match(/card-title">([\s\S]*?)<\/h2>/)[1]),
    price: decode(c.match(/class="price">([\s\S]*?)<small>/)[1].trim()),
    note: decode(c.match(/<small>([\s\S]*?)<\/small>/)[1]),
    tags: [...c.matchAll(/<span class="tag[^"]*"[^>]*>([\s\S]*?)<\/span>/g)].map((m) => decode(m[1])),
    imgs: [...c.matchAll(/<img class="card-img" src="([^"]+)"\s*alt="([^"]+)"/g)].map((m) => ({ src: m[1].replace(/^\.?\//, ''), alt: decode(m[2]) })),
    href: decode(c.match(/class="order-btn"[\s\S]*?href="([^"]+)"/)[1])
  }));
}
function storePage(lang) {
  const u = UI[lang];
  const st = u.store;
  const canonical = `${SITE}/${lang}/store/`;
  const products = Object.fromEntries((storeProducts || []).map((p) => [p.id, p]));
  const cards = storeCards().map((c) => {
    const p = products[c.id] || {};
    const desc = ((tr(lang).store || {})[c.id]) || '';
    const checkout = p.paymentLink;
    const btn = checkout
      ? `<a class="bss-btn is-primary" href="${esc(checkout)}" target="_blank" rel="noopener">${esc(st.buy)} ↗</a>`
      : `<a class="bss-btn is-primary" href="${esc(c.href)}" data-product="${esc(c.id)}" data-buy-label="${esc(st.buy)}">${esc(st.order)} →</a>`;
    return `<article class="bss-product" id="${esc(c.id)}" data-bss-reveal>
  <div class="bss-product-imgs">${c.imgs.map((i) => picture(i.src, `${c.title} — ${i.alt}`, { sizes: '(max-width: 620px) 100vw, 380px' })).join('')}</div>
  <div class="bss-product-body">
    <p class="bss-product-tags">${c.tags.map((t) => esc((st.tags || {})[t] || t)).join(' · ')}</p>
    <h2 lang="en">${esc(c.title)}</h2>
    ${desc ? `<p>${esc(desc)}</p>` : ''}
    <p class="bss-price"><strong>${esc(fill(st.from, { price: c.price.replace(/^From\s+/i, '') }))}</strong> <small>${esc((st.notes || {})[c.note] || c.note)}</small></p>
    ${btn}
  </div>
</article>`;
  }).join('\n');
  const jsonld = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: st.title, url: canonical, inLanguage: lang, description: st.description };
  return `${head({ title: st.title, description: st.description, canonical, image: shareImage('store', lang), imageAlt: 'The B$S Store', jsonld, lang, alts: STORE_ALTS })}
<body class="bss-page bss-store" data-world="store">
${topbar(`/${lang}/store/`, lang, STORE_ALTS)}
<main class="bss-main" id="main">
  <p class="bss-crumbs"><a href="/${lang}/">Blue $nake Studio</a> / ${esc(u.nav.store)}</p>
  <p class="bss-eyebrow">${esc(st.eyebrow)}</p>
  <h1 class="bss-page-title">${esc(st.h1)}</h1>
  <p class="bss-statement">${esc(st.lead)}</p>
  <a class="bss-next bss-free" href="/auralia/" hreflang="en"><div><small>Auralia</small><strong>${esc(st.freeTitle)}</strong><span>${esc(st.freeBody)}</span></div><i aria-hidden="true">→</i></a>
  <div class="bss-products">
${cards}
  </div>
  <section class="bss-section" aria-labelledby="how-title">
    <h2 id="how-title">${esc(st.howTitle)}</h2>
    <ol class="bss-details bss-steps">${st.how.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
    <p>${esc(st.howNote)} <a href="mailto:bluesssnakestudio@gmail.com">bluesssnakestudio@gmail.com</a></p>
  </section>
  <p class="bss-portal-note"><a href="/store.html" hreflang="en">${esc(u.englishPage)}</a></p>
</main>
${signalHtml('signal-store', lang)}
${footer(lang)}
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
function decorateExisting(file, { world, shareKey, player = false, store = false, alts = null }) {
  const full = path.join(ROOT, file);
  let html = readFileSync(full, 'utf8');
  const blocks = [];
  if (alts) blocks.push(langSwitch(alts, 'en', 'bss-lang bss-lang-bar'));
  if (player) blocks.push(playerHtml('radio-page'));
  if (world) blocks.push(nextHtml(world));
  blocks.push(signalHtml('signal-page'));
  const block = `<div class="bss-embed" style="padding:0 clamp(16px,4vw,40px) 48px">\n${blocks.join('\n')}\n</div>\n<script src="/data/site-config.js" defer></script>${store ? '\n<script src="/data/store-products.js" defer></script>' : ''}\n<script src="/bss-components.js" defer></script>`;
  html = replaceBlock(html, MARK_START, MARK_END, block, '</body>');
  html = replaceBlock(html, HEAD_START, HEAD_END, (alts ? hreflangLinks(alts) + '\n' : '') + '<link rel="stylesheet" href="/worlds.css">', '</head>');
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

// Localized site: /<lang>/ home, /<lang>/<slug>/ for every world, /<lang>/store/.
let localized = 0;
for (const lang of LANGS) {
  const write = (rel, html) => { const dir = path.join(ROOT, lang, rel); mkdirSync(dir, { recursive: true }); writeFileSync(path.join(dir, 'index.html'), html); localized++; };
  write('', homePage(lang));
  write('store', storePage(lang));
  for (const w of worldMap.worlds) write(w.slug, worldPage(w, lang));
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
for (const w of existing) decorateExisting(w.href.slice(1), { world: w.slug, shareKey: w.slug, player: w.track === 'music', alts: worldAlts(w) });
decorateExisting('store.html', { shareKey: 'store', store: true, alts: STORE_ALTS });

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
  let out = replaceBlock(html, '<!-- bss:noscript -->', '<!-- /bss:noscript -->', worldMapHtml() + '\n' + signalHtml('signal-noscript'), '<!-- CONTACT / FOOTER -->');
  out = replaceBlock(out, '<!-- bss:hreflang -->', '<!-- /bss:hreflang -->', hreflangLinks(HOME_ALTS), '</head>');
  writeFileSync(file, out);
}

// Sitemap: home, generated worlds, every public root page, and key sub-pages.
const exclude = new Set(['404.html', 'site-health.html', 'index.html', 'i-ran-lego.html']);
const rootPages = readdirSync(ROOT).filter((f) => f.endsWith('.html') && !exclude.has(f)).sort();
const subPages = ['auralia/', 'i-ran-lego/', 'documents/oss-734g-known-unknowns-register.html', 'apps/moss60-oracle-warden.html', 'apps/bs-word-cube.html',
  ...readdirSync(path.join(ROOT, 'downloads')).filter((f) => f.endsWith('.html')).sort().map((f) => 'downloads/' + f)];
const altByPath = {};
for (const alts of [HOME_ALTS, STORE_ALTS, ...worldMap.worlds.map(worldAlts)]) for (const p of Object.values(alts)) altByPath[p] = alts;
const urls = [
  { loc: '/', priority: '1.0' },
  ...generated.map((w) => ({ loc: `/${w.slug}/`, priority: '0.9' })),
  ...rootPages.map((f) => ({ loc: '/' + f, priority: ['store.html', 'black-wing-crew.html', 'krsnapaksi-chant.html', 'stomps.html'].includes(f) ? '0.8' : '0.6' })),
  ...subPages.filter((p) => existsSync(path.join(ROOT, p.endsWith('/') ? p + 'index.html' : p))).map((p) => ({ loc: '/' + p, priority: '0.5' })),
  ...LANGS.flatMap((l) => [{ loc: `/${l}/`, priority: '0.9' }, { loc: `/${l}/store/`, priority: '0.7' }, ...worldMap.worlds.map((w) => ({ loc: `/${l}/${w.slug}/`, priority: '0.7' }))])
];
const altXml = (loc) => {
  const alts = altByPath[loc];
  if (!alts) return '';
  return [...Object.entries(alts), ['x-default', alts.en]].map(([l, p]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${p}"/>`).join('');
};
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by scripts/build-worlds.mjs -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map((u) => `  <url><loc>${SITE}${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority>${altXml(u.loc)}</url>`).join('\n')}
</urlset>
`;
writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`Built ${generated.length} world pages, ${localized} localized pages (${LANGS.join(', ')}), decorated ${existing.length + 1} existing pages, sitemap with ${urls.length} URLs.`);
