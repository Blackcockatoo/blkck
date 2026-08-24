(function publishPortfolioTruth(root, factory) {
  const projects = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = projects;
  }

  if (root) {
    root.BSS_PORTFOLIO_PROJECTS = projects;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function buildPortfolioTruth() {
  return Object.freeze([
    Object.freeze({
      id: 'auralia-phone-theme',
      label: 'Auralia — Phone Theme',
      status: 'Free digital edition',
      availability: 'Live',
      desc: 'Six matched Lock and Home Screen wallpaper themes for iPhone and Android. Free, with no account or sign-up.',
      href: 'auralia/'
    }),
    Object.freeze({
      id: 'meta-pet',
      label: 'Meta-Pet',
      status: 'Working prototype',
      availability: 'Live',
      desc: 'A local-first learning companion. School routes have no advertising or behavioural tracking, and no student account is required by default.',
      href: '#meta-pet'
    }),
    Object.freeze({
      id: 'teacher-tools',
      label: "Teacher's Secret Cheatsheet",
      status: 'Live',
      availability: 'Live',
      desc: 'Low-admin behaviour-support templates for stretched teachers. Print and use.',
      href: 'https://teachers-secret-cheatsheet.vercel.app/'
    }),
    Object.freeze({
      id: 'black-wing-crew',
      label: 'Black Wing Crew / Neon Venom',
      status: 'Streaming',
      availability: 'Live',
      desc: 'Songs, lyric posters, QR drops and streaming releases.',
      href: 'https://blackwingcrew.netlify.app/'
    }),
    Object.freeze({
      id: 'magic-cube',
      label: 'B$S Magic Rubix Cube',
      status: 'Playable prototype',
      availability: 'Live',
      desc: 'Six-face 5×5 word cube with art, game and net views. No login or advertising.',
      href: 'magic-cube.html'
    }),
    Object.freeze({
      id: 'i-ran-lego',
      label: 'I RAN, LEGO!',
      status: 'Live prototype',
      availability: 'Live',
      desc: 'An interactive picture-book musical with authored camera movement, timed lyrics and chapter controls.',
      href: 'i-ran-lego.html'
    }),
    Object.freeze({
      id: 'moss60',
      label: 'Moss 60',
      status: 'Research-in-progress',
      availability: 'Live demo',
      desc: 'Visual number-system research spanning base-60 geometry, glyphs and symbolic identity.',
      href: 'https://www.bluesnakestudios.com/app/moss60'
    }),
    Object.freeze({
      id: 'semantic-sovereignty',
      label: 'Semantic Sovereignty',
      status: 'Published research',
      availability: 'Published',
      desc: 'A published working doctrine on language, framing, meaning and narrative defence.',
      href: 'documents/oss-734g-known-unknowns-register.html'
    }),
    Object.freeze({
      id: 'visual-worlds',
      label: 'Visual Worlds',
      status: 'Live',
      availability: 'Live',
      desc: 'Ten gallery rooms spanning mythology, portraits, parody and print.',
      href: '#visual-worlds'
    }),
    Object.freeze({
      id: 'frankston-fuji',
      label: 'Frankston → Fuji',
      status: 'Independent project',
      availability: 'Live',
      desc: 'An independent bilingual creative and learning project connecting Frankston and Fuji/Susono themes; not an official sister-city programme.',
      href: '#frankston-fuji'
    }),
    Object.freeze({
      id: 'frankston-2035',
      label: 'Frankston 2035',
      status: 'Independent proposal',
      availability: 'Live artefact',
      desc: 'A Blue $nake Studio civic-imagination proposal, not an official council plan or policy.',
      href: 'frankston-2035.html'
    }),
    Object.freeze({
      id: 'black-omen-waahn',
      label: 'Black Omen / Waahn',
      status: 'Research-in-progress',
      availability: 'Live research map',
      desc: 'Boonwurrung language research on Bunurong Country; not an approved translation, endorsement or claim of cultural authority.',
      href: '#black-omen-waahn'
    })
  ]);
});
