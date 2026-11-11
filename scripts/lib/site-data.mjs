// Loads the browser-side data files (window.* globals) into Node for the static builders.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SITE = 'https://blkck2.com';
const read = (rel) => readFileSync(path.join(ROOT, rel), 'utf8');

export function loadSiteData() {
  const noop = () => null;
  const document = { readyState: 'complete', addEventListener: noop, getElementById: noop, querySelector: noop, querySelectorAll: () => [] };
  const window = { matchMedia: () => ({ matches: false }), addEventListener: noop, localStorage: { getItem: noop, setItem: noop } };
  const ctx = vm.createContext({ window, document, console, localStorage: window.localStorage, setTimeout: noop });
  for (const file of ['data/gallery-items.js', 'data/portfolio-truth.js', 'data/image-manifest.js', 'data/worlds.js', 'data/tracks.js', 'data/site-config.js', 'data/store-products.js']) {
    vm.runInContext(read(file), ctx, { filename: file });
  }
  try { vm.runInContext(read('data/studio-sections.js'), ctx, { filename: 'data/studio-sections.js' }); } catch (error) {
    if (!window.BSS_STUDIO_SECTIONS) throw error; // DOM-only intro code at the end of the file is expected to fail here
  }
  // The proof-strip facts live inside script.js; lift the literal out without running the portal.
  const script = read('script.js');
  const start = script.indexOf('const projectProofStrips = {');
  const end = script.indexOf('\n  };', start);
  const facts = start >= 0 && end > start ? vm.runInNewContext('(' + script.slice(script.indexOf('{', start), end + 4) + ')') : {};
  return {
    sections: window.BSS_STUDIO_SECTIONS || [],
    items: window.BSS_GALLERY_ITEMS || window.galleryItems || ctx.galleryItems || [],
    manifest: window.BSS_IMAGE_MANIFEST || {},
    worldMap: window.BSS_WORLD_MAP,
    tracks: window.BSS_TRACKS || [],
    facts
  };
}
