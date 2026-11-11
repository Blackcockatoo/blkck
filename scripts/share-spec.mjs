// Prints the share-card spec (JSON) used by scripts/make-share-cards.py.
// English cards → share/<key>.jpg; localized cards → share/<lang>/<key>.jpg.
import { loadSiteData, loadI18n, LANGS } from './lib/site-data.mjs';
const { sections, items, worldMap } = loadSiteData();
const I18N = loadI18n();
const bySlug = Object.fromEntries(sections.map((s) => [s.slug, s]));
const art = (s) => {
  const ids = s.featuredIds || [];
  const pool = ids.length ? ids.map((id) => items.find((i) => i.id === id)) : items.filter((i) => (s.series || []).includes(i.series));
  return (pool.find((i) => i && i.image) || {}).image || '01_auralia/auralia_cosmic_poster_v1.png';
};
const track = Object.fromEntries(worldMap.tracks.map((t) => [t.id, t.label]));
const cards = worldMap.worlds.map((w) => ({ key: w.slug, lang: 'en', eyebrow: track[w.track], title: bySlug[w.slug].label, line: bySlug[w.slug].title, art: w.shareArt || art(bySlug[w.slug]) }));
cards.push({ key: 'home', lang: 'en', eyebrow: 'Art · Music · Play · Learning', title: 'Blue $nake Studio', line: 'Patterns become worlds.', art: '01_auralia/auralia_cosmic_poster_v1.png' });
cards.push({ key: 'store', lang: 'en', eyebrow: 'Prints · Wallpapers · Digital', title: 'The B$S Store', line: 'Original dark art, straight from the studio.', art: '24_auralia_prints/auralia-ouroboros-golden-fire.jpg' });
for (const lang of LANGS) {
  const L = I18N[lang];
  const sh = L.ui.share;
  for (const c of cards.filter((x) => x.lang === 'en')) {
    let out;
    if (c.key === 'home') out = { eyebrow: sh.home, title: c.title, line: sh.homeLine };
    else if (c.key === 'store') out = { eyebrow: sh.store, title: sh.storeTitle, line: sh.storeLine };
    else {
      const w = worldMap.worlds.find((x) => x.slug === c.key);
      const s = (L.sections || {})[c.key] || {};
      out = { eyebrow: ((L.tracks || {})[w.track] || {}).label || c.eyebrow, title: s.label || c.title, line: s.title || c.line };
    }
    cards.push({ ...c, ...out, lang });
  }
}
process.stdout.write(JSON.stringify(cards, null, 2));
