import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const projects = require(path.join(ROOT, 'data', 'portfolio-truth.js'));

function read(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(Array.isArray(projects), 'Portfolio truth must export an array.');
assert(projects.length === 11, `Expected 11 portfolio projects, found ${projects.length}.`);
assert(new Set(projects.map((project) => project.id)).size === projects.length, 'Portfolio project ids must be unique.');

for (const project of projects) {
  for (const field of ['id', 'label', 'status', 'availability', 'desc', 'href']) {
    assert(typeof project[field] === 'string' && project[field].trim(), `${project.id || 'Unknown project'} is missing ${field}.`);
  }
}

const expectedTruth = {
  'meta-pet': ['Working prototype', 'Live'],
  'teacher-tools': ['Live', 'Live'],
  'black-wing-crew': ['Streaming', 'Live'],
  'i-ran-lego': ['Live prototype', 'Live'],
  'moss60': ['Research-in-progress', 'Live demo'],
  'frankston-fuji': ['Independent project', 'Live'],
  'frankston-2035': ['Independent proposal', 'Live artefact'],
  'black-omen-waahn': ['Research-in-progress', 'Live research map']
};

for (const [id, [status, availability]] of Object.entries(expectedTruth)) {
  const project = projects.find((candidate) => candidate.id === id);
  assert(project, `Missing portfolio truth for ${id}.`);
  assert(project.status === status, `${id} status must be ${status}, found ${project.status}.`);
  assert(project.availability === availability, `${id} availability must be ${availability}, found ${project.availability}.`);
}

const mainScript = read('script.js');
assert(mainScript.includes('window.BSS_PORTFOLIO_PROJECTS || []'), 'Homepage must consume the portfolio registry.');
assert(!mainScript.includes('const projects = ['), 'Homepage has regained an inline project registry.');

const studioSections = read('data/studio-sections.js');
for (const id of Object.keys(expectedTruth)) {
  if (id === 'i-ran-lego' || id === 'meta-pet' || id === 'teacher-tools' || id === 'black-wing-crew' || id === 'moss60' || id === 'frankston-fuji' || id === 'frankston-2035' || id === 'black-omen-waahn') {
    assert(studioSections.includes(`bssProjectStatus('${id}'`), `Studio section ${id} must consume the portfolio registry.`);
  }
}

const indexHtml = read('index.html');
const truthIndex = indexHtml.indexOf('data/portfolio-truth.js');
const sectionsIndex = indexHtml.indexOf('data/studio-sections.js');
assert(truthIndex >= 0 && truthIndex < sectionsIndex, 'index.html must load portfolio truth before studio sections.');

for (const page of ['meta-pet.html', 'press-kit.html', 'frankston-2035.html']) {
  const html = read(page);
  assert(html.includes('data/portfolio-truth.js'), `${page} must load portfolio truth.`);
  assert(html.includes('data/portfolio-status.js'), `${page} must hydrate status text from the registry.`);
}

const frankstonHtml = read('frankston-2035.html');
assert(!frankstonHtml.includes('src="script.js"'), 'frankston-2035.html must not load the index-only portal script.');
assert(!frankstonHtml.includes('data/studio-sections.js'), 'frankston-2035.html must not load index-only studio sections.');

const publicCopy = [
  'field-guide.html',
  'frankston-2035.html',
  'gov.html',
  'index.html',
  'meta-pet.html',
  'packs.html',
  'press-kit.html',
  'proof-wall.html',
  'start-here.html',
  'start.html',
  'strongman-tracker.html',
  'teacher-tools.html'
].map(read).join('\n');

const staleClaims = [
  /\bno trackers\b/i,
  /\bzero admin\b/i,
  /\bno student data collect(?:ed|ion)\b/i,
  /\bMeta-Pet\b[^\n]{0,80}\b(?:In dev|In development)\b/i
];

for (const pattern of staleClaims) {
  assert(!pattern.test(publicCopy), `Public copy contains stale or over-broad claim: ${pattern}.`);
}

console.log(`Portfolio truth verified (${projects.length} projects).`);
