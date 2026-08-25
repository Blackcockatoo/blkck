import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

function read(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const projects = require(path.join(ROOT, 'data', 'portfolio-truth.js'));
const projectIds = new Set(projects.map((project) => project.id));
assert(projectIds.has('monkey-invaders'), 'Portfolio registry is missing Monkey Invaders.');
assert(projectIds.has('bubble-hex'), 'Portfolio registry is missing Bubble Hex.');

const sections = read('data/studio-sections.js');
for (const requiredText of [
  "slug: 'games'",
  "status: 'Live'",
  'https://monkey-invaders-enhanced.vercel.app/',
  'https://bubblehex.vercel.app/',
  'https://www.bluesnakestudios.com/monkey-invaders.html'
]) {
  assert(sections.includes(requiredText), `Games section is missing ${requiredText}.`);
}

const indexHtml = read('index.html');
for (const requiredText of [
  'Games / Arcade',
  'Monkey Invaders — Twin Signal',
  'Bubble Hex',
  'Monkey Invaders — Fruitkind'
]) {
  assert(indexHtml.includes(requiredText), `Homepage fallback is missing ${requiredText}.`);
}

const vercel = JSON.parse(read('vercel.json'));
const redirectBySource = new Map((vercel.redirects || []).map((rule) => [rule.source, rule]));
const expectedRedirects = new Map([
  ['/games', '/index.html#games'],
  ['/arcade', '/index.html#games'],
  ['/monkey-invaders', 'https://monkey-invaders-enhanced.vercel.app/'],
  ['/monkey-invaders-fruitkind', 'https://www.bluesnakestudios.com/monkey-invaders.html'],
  ['/bubble-hex', 'https://bubblehex.vercel.app/'],
  ['/bubblehex', 'https://bubblehex.vercel.app/'],
  ['/schools', '/gov.html']
]);

for (const [source, destination] of expectedRedirects) {
  const rule = redirectBySource.get(source);
  assert(rule, `Vercel redirect is missing ${source}.`);
  assert(rule.destination === destination, `${source} points to ${rule.destination}, expected ${destination}.`);
}

assert(
  (vercel.rewrites || []).some((rule) => rule.source === '/auralia' && rule.destination === '/auralia/index.html'),
  'Auralia rewrite was lost while restoring redirects.'
);
assert(
  (vercel.headers || []).some((rule) => rule.source === '/auralia/edition-01/(.*)'),
  'Auralia immutable asset header was lost while restoring redirects.'
);

const netlifyRedirects = read('_redirects');
for (const alias of ['/games ', '/arcade ', '/monkey-invaders ', '/bubble-hex ', '/bubblehex ']) {
  assert(netlifyRedirects.includes(alias), `Netlify redirect registry is missing ${alias.trim()}.`);
}

assert(read('sw.js').includes("moss-tree-v19"), 'Service worker cache was not bumped to moss-tree-v19.');

console.log('Arcade registry and route configuration verified.');
