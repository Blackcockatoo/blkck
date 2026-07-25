/**
 * Blue $nake Studio — project registry.
 *
 * Single source of truth for project status, canonical URL and audience.
 * The Proof Wall, the arcade page and scripts/check-site.py all read from
 * here so a project's status is stated once, not restated in three places.
 *
 * Loaded as a plain global to match the rest of this static site. No build
 * step, no bundler.
 *
 * STATUS VOCABULARY — use these exactly:
 *   'live'        Deployed, reachable, and the principal interaction works.
 *   'active-dev'  Deployed and usable, still changing week to week.
 *   'prototype'   Real and inspectable, but incomplete or unpolished.
 *   'archive'     Kept for the record. Not maintained.
 *   'concept'     Documented intent. Nothing playable yet.
 *   'superseded'  Replaced by another entry. Says which in `supersededBy`.
 *
 * RULE: 'live' requires that someone loaded the URL and exercised the main
 * interaction. The existence of an HTML file is not evidence of anything.
 * Record the date you did that in `verified` (YYYY-MM-DD).
 *
 * AUDIENCE:
 *   'public'        General visitors.
 *   'child-facing'  Designed for children / classroom use.
 *   'experimental'  Rough edges expected; not promoted to general visitors.
 */
window.BSS_PROJECTS = [
  // ---------------------------------------------------------------- arcade
  {
    slug: 'monkey-invaders',
    title: 'Monkey Invaders',
    category: 'games',
    status: 'live',
    audience: 'public',
    url: 'https://www.bluesnakestudios.com/monkey-invaders',
    external: true,
    source: 'Blackcockatoo/bss — public/monkey-invaders.html',
    verified: '2026-07-25',
    description:
      'Arcade shooter served through the Blue $nake Studios site. This is the older standalone port, not the enhanced engine.',
    note: 'Distinct build from monkey-invaders-enhanced. See that entry.',
  },
  {
    slug: 'monkey-invaders-enhanced',
    title: 'Monkey Invaders (enhanced build)',
    category: 'games',
    status: 'active-dev',
    audience: 'experimental',
    url: 'https://monkey-invaders-enhanced.vercel.app',
    external: true,
    source: 'Blackcockatoo/monkey-invaders-enhanced',
    verified: '2026-07-25',
    description:
      'The evolved engine: bosses, additional enemy types, events, pickups, secrets and progression.',
    note: 'NOT the build currently served through bluesnakestudios.com.',
  },
  {
    slug: 'bubble-hex',
    title: 'Bubble Hex',
    category: 'games',
    status: 'live',
    audience: 'public',
    url: 'https://bubblehex.vercel.app',
    external: true,
    source: 'Blackcockatoo/bubblehex',
    verified: '2026-07-25',
    description:
      'Modern-retro arcade game. Trap enemies in bubbles, chain-pop for multipliers, clear twelve gothic neon chambers.',
  },
  {
    slug: 'word-cube',
    title: 'B$S Six-Face Word Cube',
    category: 'games',
    status: 'prototype',
    audience: 'public',
    url: 'apps/bs-word-cube.html',
    external: false,
    source: 'this repository',
    verified: '2026-07-25',
    description: 'Drag to spin a 3D artwork cube with six word-grid faces.',
    note: 'Page loads and interaction handlers are present, but the UI was not driven in a browser. Kept at the Proof Wall’s existing Prototype rating rather than upgraded on weaker evidence.',
  },
  {
    slug: 'oracle-warden',
    title: 'Oracle Warden',
    category: 'games',
    status: 'prototype',
    audience: 'experimental',
    url: 'apps/moss60-oracle-warden.html',
    external: false,
    source: 'this repository',
    verified: '2026-07-25',
    description: 'The Moss 60 glyph engine as a playable symbolic puzzle.',
  },

  // --------------------------------------------------------- metapet / bss
  {
    slug: 'metapet-universe',
    title: 'MetaPet — full universe',
    category: 'learning',
    status: 'live',
    audience: 'public',
    url: 'https://www.bluesnakestudios.com',
    external: true,
    source: 'Blackcockatoo/bss',
    verified: '2026-07-25',
    description:
      'The complete Blue $nake Studios / MetaPet experience: pet, Digital DNA, Body Forge, Moss 60 and the arcade.',
  },
  {
    slug: 'metapet-school',
    title: 'MetaPet.school — classroom build',
    category: 'learning',
    status: 'live',
    audience: 'child-facing',
    url: 'https://metapet.school',
    external: true,
    source: 'Blackcockatoo/bss — schools/field profile',
    verified: '2026-07-25',
    description:
      'A deliberately constrained Australian classroom build running Field Mode. Consumer areas and the arcade are blocked, not merely hidden.',
    note: 'Verified: /body-forge, /shop, /digital-dna, /pet, /identity and /monkey-invaders all redirect to /schools/field.',
  },
  {
    slug: 'teacher-tools',
    title: 'Teacher Tools',
    category: 'learning',
    status: 'live',
    audience: 'public',
    url: 'https://teachers-secret-cheatsheet.vercel.app/',
    external: true,
    source: 'external deployment',
    verified: '2026-07-25',
    description: 'Seven printable behaviour-support templates for teachers.',
  },
  {
    slug: 'metapet-pilot-school',
    title: 'MetaPet Pilot School',
    category: 'learning',
    status: 'prototype',
    audience: 'child-facing',
    url: 'https://metapet-pilot-school.vercel.app/',
    external: true,
    source: 'external deployment',
    verified: '2026-07-25',
    description: 'Pilot-school landing surface for school enquiries.',
  },

  // ------------------------------------------------- books / devotional work
  {
    slug: 'krsnapaksi-chant',
    title: 'Kṛṣṇapakṣi Chant',
    displayTitle: 'Kṛṣṇapakṣi Chant — Two Ciphers, One Name',
    category: 'books',
    status: 'live',
    audience: 'public',
    url: 'krsnapaksi-chant.html',
    external: false,
    source: 'this repository',
    verified: '2026-07-25',
    description:
      'A devotional code-poem: the Mahā-mantra as a Gaura-Stava acrostic and again through a 23 × 8 syllable grid, with chant mode, glossary, Reader Edition PDF and video.',
  },
  {
    slug: 'i-ran-lego',
    title: 'I RAN, LEGO!',
    category: 'books',
    status: 'live',
    audience: 'child-facing',
    url: 'i-ran-lego/',
    external: false,
    source: 'this repository — built from I_RAN_LEGO_LIVING_BOOK_v1.zip',
    verified: '2026-07-25',
    description:
      'An interactive picture-book musical with authored camera movement, word-level sing-along lyrics and pause-to-explore pages.',
    note: 'Canonical location is the directory. i-ran-lego.html is a redirect stub.',
  },

  // --------------------------------------------------- symbolic / community
  {
    slug: 'moss60',
    title: 'Moss 60',
    category: 'symbolic',
    status: 'active-dev',
    audience: 'public',
    url: 'https://www.bluesnakestudios.com/app/moss60',
    external: true,
    source: 'Blackcockatoo/bss',
    verified: '2026-07-25',
    description: 'A 60-position visual number system: base-60 geometry, glyphs and Digital DNA.',
  },
  {
    slug: 'black-wing-crew',
    title: 'Black Wing Crew',
    category: 'music',
    status: 'live',
    audience: 'public',
    url: 'https://blackwingcrew.netlify.app/',
    external: true,
    source: 'external deployment',
    verified: '2026-07-25',
    description: 'The Neon Venom LP and the studio’s music world.',
  },
  {
    slug: 'frankston-2035',
    title: 'Frankston 2035',
    category: 'community',
    status: 'prototype',
    audience: 'public',
    url: 'frankston-2035.html',
    external: false,
    source: 'this repository',
    verified: '2026-07-25',
    description: 'Community and civic vision work grounded in Frankston, Victoria.',
  },
];

window.BSS_PROJECT_STATUS_LABELS = {
  live: 'Live',
  'active-dev': 'Active development',
  prototype: 'Prototype',
  archive: 'Archive',
  concept: 'Concept',
  superseded: 'Superseded',
};

window.BSS_PROJECTS_BY_SLUG = window.BSS_PROJECTS.reduce((acc, project) => {
  acc[project.slug] = project;
  return acc;
}, {});

window.BSS_PROJECTS_BY_CATEGORY = window.BSS_PROJECTS.reduce((acc, project) => {
  (acc[project.category] ||= []).push(project);
  return acc;
}, {});
