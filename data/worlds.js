/* The B$S world map: which worlds exist, which track they sit on, and where each one lives.
   Used by the home-page map (script.js), the static world pages (scripts/build-worlds.mjs)
   and the "Next world →" links. Music and art lead; learning/civic is its own track.
   page: 'generated' → scripts/build-worlds.mjs writes /<slug>/index.html
         'existing'  → the world already has its own standalone page at href
   shareArt: optional artwork for the 1200×630 share card (defaults to the world's first featured image) */
(function (root) {
  var map = {
    tracks: [
      { id: 'music', label: 'Music & Sound', line: 'Chants, civic hymns and the Neon Venom LP — the loudest door in.' },
      { id: 'art', label: 'Art & Myth', line: 'Paintings, black wings, sacred geometry and the Moss Man’s pattern-world.' },
      { id: 'play', label: 'Play', line: 'Arcade cabinets and Frankston street characters. No login.' },
      { id: 'learning', label: 'Learning & Civic', line: 'A separate, lore-light track for schools, councils and families.', separate: true }
    ],
    worlds: [
      { slug: 'black-wing-crew', track: 'music', page: 'existing', href: '/black-wing-crew.html', short: 'The Neon Venom LP and the chant engine.' },
      { slug: 'old-vic-state', track: 'music', page: 'generated', short: 'Civic-gothic song cycle: war, command, law.' },
      { slug: 'krsnapaksi', track: 'music', page: 'existing', href: '/krsnapaksi-chant.html', short: 'Two ciphers, one name — a devotional code-poem.' },
      { slug: 'i-ran-lego', track: 'music', page: 'existing', href: '/i-ran-lego/', shareArt: 'zip:I_RAN_LEGO_LIVING_BOOK_v1.zip:I_RAN_LEGO_LIVING_BOOK_v1/assets/pages/page-01.webp', short: 'A full song as a living, synced picture book.' },
      { slug: 'frankston-fuji', track: 'music', page: 'generated', short: 'A bilingual sister-city song from Frankston toward Fuji.' },
      { slug: 'visual-worlds', track: 'art', page: 'generated', shareArt: '21_mythology/bss-twin-cockatoos-stained-glass.png', short: 'Ten gallery rooms of art and myth.' },
      { slug: 'moss-man', track: 'art', page: 'generated', short: 'The creator, the studio and the hand that enters.' },
      { slug: 'black-omen-waahn', track: 'art', page: 'generated', short: 'Black Omen research map, led by cultural respect.' },
      { slug: 'moss60', track: 'art', page: 'generated', short: 'Visual mathematics: sixty-fold geometry and glyphs.' },
      { slug: 'print-street-pack', track: 'art', page: 'generated', short: 'QR drops, crests and street posters to print.' },
      { slug: 'games', track: 'play', page: 'generated', short: 'MOSS STOMPER, Monkey Invaders, Bubble Hex and more.' },
      { slug: 'stomps', track: 'play', page: 'existing', href: '/stomps.html', shareArt: 'stomps/media/stompz-golden-omen.jpg', short: 'STOMPS: a Frankston character in film.' },
      { slug: 'meta-pet', track: 'learning', page: 'existing', href: '/meta-pet.html', short: 'A local-first classroom companion.' },
      { slug: 'teacher-tools', track: 'learning', page: 'existing', href: '/teacher-tools.html', short: 'Printable, Victoria-aware classroom templates.' },
      { slug: 'frankston-2035', track: 'learning', page: 'existing', href: '/frankston-2035.html', short: 'A community future artefact for Frankston.' }
    ]
  };
  map.worlds.forEach(function (w) { if (!w.href) w.href = '/' + w.slug + '/'; });
  /* Next world: music → art → play loops; the learning track loops on itself. */
  map.next = function (slug) {
    var list = map.worlds;
    var me = list.filter(function (w) { return w.slug === slug; })[0];
    if (!me) return null;
    var chain = list.filter(function (w) { return (w.track === 'learning') === (me.track === 'learning'); });
    return chain[(chain.indexOf(me) + 1) % chain.length];
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = map; else root.BSS_WORLD_MAP = map;
})(typeof window !== 'undefined' ? window : this);
