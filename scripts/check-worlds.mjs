// Verifies the static world pages, share cards, responsive images, store config and sitemap.
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { loadSiteData, LANGS, ROOT, SITE } from './lib/site-data.mjs';

const { worldMap, manifest } = loadSiteData();
const read = (rel) => readFileSync(path.join(ROOT, rel), 'utf8');
const fail = [];
const assert = (ok, msg) => { if (!ok) fail.push(msg); };

const sitemap = read('sitemap.xml');
for (const w of worldMap.worlds) {
  const file = w.page === 'generated' ? `${w.slug}/index.html` : w.href.replace(/^\//, '').replace(/\/$/, '/index.html');
  assert(existsSync(path.join(ROOT, file)), `${w.slug}: page ${file} missing`);
  assert(existsSync(path.join(ROOT, 'share', `${w.slug}.jpg`)), `${w.slug}: share card missing`);
  if (w.page !== 'generated') continue;
  const html = read(file);
  const canonical = `${SITE}/${w.slug}/`;
  assert(html.includes(`<link rel="canonical" href="${canonical}">`), `${w.slug}: canonical`);
  assert(html.includes(`content="${SITE}/share/${w.slug}.jpg"`), `${w.slug}: og:image`);
  assert(/<title>[^<]{10,}<\/title>/.test(html), `${w.slug}: title`);
  assert(/<meta name="description" content="[^"]{30,}">/.test(html), `${w.slug}: description`);
  assert(html.includes('data-bss-signal'), `${w.slug}: Civilian Signal form`);
  assert(html.includes('class="bss-next"'), `${w.slug}: next-world link`);
  assert(!/<script(?![^>]*(src=|ld\+json))/.test(html), `${w.slug}: inline script found (pages must work without JS)`);
  assert(sitemap.includes(`<loc>${canonical}</loc>`), `${w.slug}: not in sitemap`);
  for (const m of html.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(' ')[0];
      const builtAtDeploy = url.startsWith('/i-ran-lego/assets/'); // written by scripts/prepare-i-ran-lego.py
      if (url.startsWith('/') && !url.startsWith('//') && !builtAtDeploy) assert(existsSync(path.join(ROOT, decodeURIComponent(url))), `${w.slug}: missing asset ${url}`);
    }
  }
}
for (const key of ['home', 'store']) assert(existsSync(path.join(ROOT, 'share', `${key}.jpg`)), `share/${key}.jpg missing`);

for (const [src, [, , widths]] of Object.entries(manifest)) {
  const stem = src.replace(/\.[^.]+$/, '');
  for (const w of widths) for (const ext of ['avif', 'webp']) {
    assert(existsSync(path.join(ROOT, 'opt', `${stem}-${w}.${ext}`)), `opt copy missing for ${src} @${w} ${ext}`);
  }
}

// Localized pages: /<lang>/, /<lang>/store/, /<lang>/<slug>/ for every world.
let localized = 0;
const assetsExist = (html, label) => {
  for (const m of html.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(' ')[0];
      if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/i-ran-lego/assets/')) assert(existsSync(path.join(ROOT, decodeURIComponent(url))), `${label}: missing asset ${url}`);
    }
  }
};
for (const lang of LANGS) {
  const pages = [['', 'home'], ['store/', 'store'], ...worldMap.worlds.map((w) => [`${w.slug}/`, w.slug])];
  for (const [rel, key] of pages) {
    const file = `${lang}/${rel}index.html`;
    const label = `${lang}/${rel}`;
    if (!existsSync(path.join(ROOT, file))) { fail.push(`${label}: page missing`); continue; }
    const html = read(file);
    localized++;
    const canonical = `${SITE}/${lang}/${rel}`;
    const heroLinks = html.match(/<ul class="bss-links">([\s\S]*?)<\/ul>/)?.[1] || '';
    assert(!heroLinks.includes(`href="/${lang}/${rel}"`), `${label}: hero link points back at its own page`);
    assert(html.startsWith(`<!doctype html>\n<html lang="${lang}">`), `${label}: lang attribute`);
    assert(html.includes(`<link rel="canonical" href="${canonical}">`), `${label}: canonical`);
    assert(html.includes(`hreflang="${lang}" href="${canonical}"`) && html.includes('hreflang="en"') && html.includes('hreflang="x-default"'), `${label}: hreflang alternates`);
    assert(html.includes(`content="${SITE}/share/${lang}/${key}.jpg"`) && existsSync(path.join(ROOT, 'share', lang, `${key}.jpg`)), `${label}: localized share card`);
    assert(html.includes('fonts.googleapis.com'), `${label}: ${lang} webfont link`);
    assert(html.includes('class="bss-lang"'), `${label}: language switcher`);
    assert(html.includes('data-bss-signal'), `${label}: Civilian Signal form`);
    assert(!/undefined|\[object Object\]|\{label\}|\{title\}|\{price\}/.test(html), `${label}: unfilled template text`);
    assert(!/<script(?![^>]*(src=|ld\+json))/.test(html), `${label}: inline script found`);
    assert(sitemap.includes(`<loc>${canonical}</loc>`), `${label}: not in sitemap`);
    assetsExist(html, label);
  }
}

const index = read('index.html');
assert(index.includes(`hreflang="ja" href="${SITE}/ja/"`) && index.includes(`hreflang="hi" href="${SITE}/hi/"`), 'home hreflang alternates missing');
assert(index.includes('content="https://blkck2.com/share/home.jpg"'), 'home og:image is not the 1200x630 card');
assert(index.includes('<!-- bss:noscript -->') && index.includes('bss-worldmap'), 'home <noscript> world map missing');
for (const f of ['data/components.js', 'data/site-config.js', 'bss-components.js', 'worlds.css']) assert(index.includes(f), `index.html does not load ${f}`);

const store = read('store.html');
const ids = new Set(((await import(path.join(ROOT, 'data', 'store-products.js'))).default || []).map((p) => p.id));
for (const m of store.matchAll(/data-product="([^"]+)"/g)) assert(ids.has(m[1]), `store button ${m[1]} has no entry in data/store-products.js`);
assert(store.includes('data-bss-signal'), 'store: Civilian Signal form missing');
assert(read('robots.txt').includes('Sitemap: https://blkck2.com/sitemap.xml'), 'robots.txt sitemap line missing');

if (fail.length) { console.error(fail.join('\n')); process.exit(1); }
console.log(`World pages, ${localized} localized pages (${LANGS.join(', ')}), share cards, ${Object.keys(manifest).length} responsive images, store and sitemap verified.`);
