// Prints the share-card spec (JSON) used by scripts/make-share-cards.py.
import { loadSiteData } from './lib/site-data.mjs';
const { sections, items, worldMap } = loadSiteData();
const bySlug = Object.fromEntries(sections.map((s) => [s.slug, s]));
const art = (s) => {
  const ids = s.featuredIds || [];
  const pool = ids.length ? ids.map((id) => items.find((i) => i.id === id)) : items.filter((i) => (s.series || []).includes(i.series));
  return (pool.find((i) => i && i.image) || {}).image || '01_auralia/auralia_cosmic_poster_v1.png';
};
const track = Object.fromEntries(worldMap.tracks.map((t) => [t.id, t.label]));
const cards = worldMap.worlds.map((w) => ({ key: w.slug, eyebrow: track[w.track], title: bySlug[w.slug].label, line: bySlug[w.slug].title, art: w.shareArt || art(bySlug[w.slug]) }));
cards.push({ key: 'home', eyebrow: 'Art · Music · Play · Learning', title: 'Blue $nake Studio', line: 'Patterns become worlds.', art: '01_auralia/auralia_cosmic_poster_v1.png' });
cards.push({ key: 'store', eyebrow: 'Prints · Wallpapers · Digital', title: 'The B$S Store', line: 'Original dark art, straight from the studio.', art: '24_auralia_prints/auralia-ouroboros-golden-fire.jpg' });
process.stdout.write(JSON.stringify(cards, null, 2));
