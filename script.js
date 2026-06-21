(() => {
  const root = document.documentElement;
  const stage = document.getElementById('tree-stage');
  const tree = document.getElementById('tree');
  const panelWrap = document.getElementById('panel-wrap');
  const counter = document.getElementById('current-count');
  const total = document.getElementById('total-count');
  const status = document.getElementById('status');
  const items = window.BSS_GALLERY_ITEMS || [];

  const sections = [
    {
      slug: 'start-here',
      label: 'Start Here',
      eyebrow: 'Studio overview · Frankston, Australia',
      title: 'Patterns become worlds.',
      statement: 'The Moss Man is the creator. Blue $nake Studio is the world-building studio. blkck2.com is the portal.',
      studioDescription: 'Blue $nake Studio builds child-safe learning tools, mythic music worlds, visual art and symbolic engines — all connected through The Moss Man\'s pattern-based universe.',
      pageTitle: 'The Moss Man / Blue $nake Studio — Art, Music, Meta-Pet & Moss 60',
      pageDescription: 'The Moss Man is the creator. Blue $nake Studio is the world-building studio. blkck2.com is the portal. Art, music, Meta-Pet, Moss 60 and teacher tools from Frankston, Australia.',
      startHere: true,
      details: [],
      links: [
        { label: 'Try Meta-Pet', href: 'https://www.bluesnakestudios.com/', className: 'album-link' },
        { label: 'Download Teacher Pack', href: 'https://teachers-secret-cheatsheet.vercel.app/', className: 'album-link' },
        { label: 'Enter Black Wing Crew', href: 'https://blackwingcrew.netlify.app/', className: 'album-link' },
        { label: 'Gallery Rooms', href: '#visual-worlds' },
        { label: 'Elevator Pitch', href: 'https://elevator-pitch-seven.vercel.app/' },
        { label: 'YouTube @blkck2', href: 'https://www.youtube.com/@blkck2' },
        { label: 'Email B$S', href: 'mailto:bluesssnakestudio@gmail.com' }
      ],
      featuredIds: ['moss-man-runic-scribe', 'auralia-cosmic-poster', 'black-wing-chant-sheet', 'neon-venom-enter-dream-qr', 'moss60-geometry-linework', 'painting-bss-woman-cockatoo', 'blue-snake-gold-logo']
    },
    {
      slug: 'moss-man',
      label: 'The Moss Man',
      eyebrow: 'About the practice · Blue $nake Studio',
      title: 'A studio without hard borders.',
      statement: 'The Moss Man is the creative identity behind a practice where painting, music, design, learning and systems thinking continuously inform one another.',
      pageTitle: 'The Moss Man — About the Practice · Blue $nake Studio',
      pageDescription: 'Tom from Frankston: artist, musician, educator and founder of Blue $nake Studio. A practice where painting, music, design, learning and systems thinking inform one another.',
      textualInstallation: true,
      details: [
        'The work moves between expressive art and practical tools without treating them as separate disciplines.',
        'Each project begins with a clear idea, then finds its strongest form: image, sound, print, interface or classroom resource.',
        'Use the sections to explore the practice, then follow project links for deeper detail.'
      ],
      links: [
        { label: 'Start with Visual Worlds', href: '#visual-worlds', className: 'album-link' },
        { label: 'Black Wing Crew', href: 'https://blackwingcrew.netlify.app/' },
        { label: 'YouTube @blkck2', href: 'https://www.youtube.com/@blkck2' }
      ],
      featuredIds: ['moss-man-runic-scribe', 'moss-man-victorian-library', 'moss-man-frankston-courts', 'moss-man-hope-poster', 'auralia-cosmic-poster', 'black-wing-chant-sheet', 'neon-venom-enter-dream-qr', 'painting-bss-woman-cockatoo']
    },
    {
      slug: 'visual-worlds',
      label: 'Gallery Rooms',
      eyebrow: 'Selected work · Visual archive',
      title: 'Enter the visual worlds.',
      statement: 'A curated archive of paintings, characters, symbols, campaign artwork and works in progress—organised as distinct rooms, each with its own atmosphere and purpose.',
      pageTitle: 'Gallery Rooms — Blue $nake Studio · blkck2.com',
      pageDescription: 'Ten gallery chambers: The Painted Wing, Neon Venom, The Omen Room, The Learning Beast, Moss 60 Engine, Street Print Arsenal, Colouring Pages, Memetics & Public Repair, The Moss Man and Humour & Parody.',
      series: ['Auralia', 'Insidious Rhythms', 'Original Paintings', 'B$S Branding', 'Process / References'],
      rooms: true,
      details: [
        'No more boring categories. A visitor enters chambers: painting room, venom room, omen room, learning room, number room and street-print room.',
        'Each room explains what it is, why it matters, what lives there, and what people should do next.',
        'The gallery becomes a guided studio experience: myth first, proof underneath, usable pathways everywhere.'
      ],
      links: [
        { label: 'Contact B$S', href: 'mailto:bluesssnakestudio@gmail.com', className: 'album-link' },
        { label: 'Watch @blkck2', href: 'https://www.youtube.com/@blkck2' }
      ]
    },
    {
      slug: 'black-wing-crew',
      label: 'Black Wing Crew',
      eyebrow: 'Music and moving image · Neon Venom',
      title: 'Sound with a visual identity.',
      statement: 'Black Wing Crew brings music, performance and graphic language together through recurring symbols, rhythmic hooks, short-form video and print-led releases.',
      pageTitle: 'Black Wing Crew / Neon Venom — Blue $nake Studio',
      pageDescription: 'The 2026 Neon Venom digital LP by Blue $nake Studio: tracklist, streaming, downloads, lyrics, QR drops, lyric posters and street print assets.',
      series: ['Black Wing Crew', 'Neon Venom'],
      details: [
        'This is the sound-and-symbol branch for Neon Venom, Woman Money Venom and Black Omen energy.',
        'Built for songs, YouTube clips, lyric posters, sticker sheets, QR drops and street promotion.',
        'The aim: make people scan, listen, look twice, and remember the hook.'
      ],
      links: [
        { label: 'Open Black Wing Crew', href: 'https://blackwingcrew.netlify.app/', className: 'album-link' },
        { label: 'Watch on YouTube', href: 'https://www.youtube.com/@blkck2' }
      ],
      featuredIds: ['black-wing-cosmic-singing', 'neon-venom-cyberpunk-poster', 'bss-twin-cockatoos-stained-glass', 'neon-venom-enter-dream-qr', 'black-wing-chant-sheet', 'neon-venom-campaign']
    },
    {
      slug: 'old-vic-state',
      label: 'Old Vic State',
      eyebrow: 'Civic gothic · recursive song cycle · Victoria',
      title: 'The old state dreams in circles.',
      statement: 'Old Vic State is a civic-gothic song and image cycle about memory, command and the structures that outlive the people who believe they control them.',
      pageTitle: 'Old Vic State — Civic Gothic Song Cycle · Blue $nake Studio',
      pageDescription: 'A civic-gothic song and image cycle from Blue $nake Studio. One wing remembers fire. One wing remembers law. Between them hangs the body of command.',
      oldVicState: true,
      details: [
        'One wing remembers fire. One wing remembers law. Between them hangs the body of command.',
        'The project moves between wartime nightmare and civic ritual: press room, stairwell, hospital glass, curfew street, ledger and seal.',
        'Its answer is not forgetting or revenge, but witness, transfer and symmetry: the wound finds its author; memory sharpens into hope.'
      ],
      links: [
        { label: 'Listen to Old Vic State', href: 'https://suno.com/playlist/41d71043-b3a3-4ee0-aa80-8aae92922872', className: 'album-link' },
        { label: 'Read Butterfly Symmetry', href: 'documents/butterfly-symmetry-final-loop.pdf' },
        { label: 'Read the Victorian Lullaby', href: 'documents/victorian-statesman-recursive-lullaby.pdf' }
      ],
      featuredIds: ['old-vic-command-cycle', 'old-vic-ledger-city', 'old-vic-butterfly-triptych', 'old-vic-ledger-witness', 'old-vic-state-campaign']
    },
    {
      slug: 'frankston-fuji',
      label: 'Frankston → Fuji',
      eyebrow: 'Sister-city song · learning bridge',
      title: 'Two shores. One song.',
      statement: 'The Frankston → Fuji branch is for the bilingual sister-city material: song, lyric sheets, practice games, taiko rhythm, cultural connection and school-friendly learning.',
      pageTitle: 'Frankston → Fuji — Sister-City Song · Blue $nake Studio',
      pageDescription: 'Bilingual Japanese and English sister-city material for schools and councils: lyric sheets, pronunciation guides, taiko rhythm and cultural connection between Frankston and Susono.',
      details: [
        'Keep this branch clean and respectful so councils, schools and collaborators can understand it quickly.',
        'Use it for Japanese/English lyric sheets, pronunciation cards, rhythm practice and context tidbits.',
        'It should feel like a bridge: Frankston shore, Fuji shadow, shared rhythm.'
      ],
      links: [
        { label: 'Open Frankston → Fuji', href: 'https://frankston2fuji.netlify.app/', className: 'album-link' },
        { label: 'Email studio', href: 'mailto:bluesssnakestudio@gmail.com' }
      ],
      featuredIds: ['fuji-taiko-scene', 'fuji-lyric-study-sheet', 'fuji-bilingual-chorus', 'fuji-sister-cities-song', 'fuji-pronunciation-sheet']
    },
    {
      slug: 'black-omen-waahn',
      label: 'Black Omen / Waahn',
      eyebrow: 'Respectful research · language journey',
      title: 'Ask before the omen speaks.',
      statement: 'This branch holds the Black Omen / Waahn research path: Bunurong–Boonwurrung enquiry, place respect, translation limits, word-bank notes and consultation-first process.',
      pageTitle: 'Black Omen / Waahn — Bunurong Language Research · Blue $nake Studio',
      pageDescription: 'Respectful research-in-progress into Black Omen, Waahn and Bunurong–Boonwurrung language near Frankston. Consultation-first, not a final translation or cultural authority.',
      details: [
        'Frame it as research-in-progress, not cultural authority or final translation.',
        'Good for notes, contact drafts, source maps, word-bank experiments and permission pathways.',
        'The tone should be ancient, careful and transparent: from Frankston, made with your son, seeking guidance.'
      ],
      links: [
        { label: 'Open Waahn Research Map', href: 'https://waahn.netlify.app/', className: 'album-link' },
        { label: 'Email B$S', href: 'mailto:bluesssnakestudio@gmail.com' }
      ],
      featuredIds: ['black-omen-research-map', 'black-omen-language-working-map', 'auralia-cosmic-poster', 'black-wing-chant-sheet', 'insidious-rhythms-gold']
    },
    {
      slug: 'meta-pet',
      label: 'Meta-Pet',
      eyebrow: 'Privacy-first learning · In development',
      title: 'Technology that gives attention back.',
      statement: 'Meta-Pet is a child-safe digital learning companion built for healthy device use, creativity and schools — without ads, trackers, social feeds, gambling loops or unnecessary data collection.',
      pageTitle: 'Meta-Pet — Privacy-First Learning · Blue $nake Studio',
      pageDescription: 'A child-safe STEAM learning companion: no ads, no trackers, no unnecessary data collection. Puzzles, pattern recognition and healthy device use for schools and families.',
      details: [
        'No ads, no trackers, no unnecessary cloud data — privacy-first from the ground up.',
        'Healthy device use design: no social feeds, no gambling loops, no endless scroll.',
        'Classroom mode: zero-admin setup, no login required for students.',
        'Parent peace of mind: transparent, local-first, fully child-safe.',
        'A STEAM learning companion powered by puzzles, pattern recognition and creative tasks.',
        'Prototype available now. Contact the studio for school pilot enquiries.'
      ],
      links: [
        { label: 'Open Meta-Pet', href: 'https://www.bluesnakestudios.com/', className: 'album-link' },
        { label: 'Meta-Pet Pilot School', href: 'https://metapet-pilot-school.vercel.app/' },
        { label: 'Teacher Tools', href: '#teacher-tools' },
        { label: 'Email studio', href: 'mailto:bluesssnakestudio@gmail.com' }
      ],
      featuredIds: ['meta-pet-kid-with-feather', 'meta-pet-process-overview', 'meta-pet-no-login', 'meta-pet-one-more-app', 'meta-pet-digital-genomes', 'meta-pet-companion-portrait', 'meta-pet-neon-ornament']
    },
    {
      slug: 'moss60',
      label: 'Moss 60',
      eyebrow: 'Visual mathematics · 108 · 360',
      title: 'A number system you can see and feel.',
      statement: 'Moss 60 explores base-60 thinking, cycles, geometry, colour and sound as a visual framework for puzzles, identity systems and creative learning.',
      pageTitle: 'Moss 60 — Visual Number System · Blue $nake Studio',
      pageDescription: 'A 60-position visual mathematics system: base-60 thinking, geometry, glyphs and digital DNA. Powers the Meta-Pet learning engine and symbolic identity system.',
      series: ['MOSS60 / Geometry'],
      details: [
        'A 60-position visual number system grounded in base-60 geometry, cycles and proportion.',
        'Powers Meta-Pet: digital DNA genomes, glyph puzzles and symbolic identity systems.',
        'Semantic Sovereignty doctrine: language, framing, meaning and narrative defence.',
        'Try the Oracle Warden — a playable glyph engine with interactive Moss 60 logic.',
        'Research and invention phase. Contact the studio to discuss pilot use or collaboration.'
      ],
      links: [
        { label: 'Explore Digital DNA', href: 'https://www.bluesnakestudios.com/digital-dna', className: 'album-link' },
        { label: 'Oracle Warden', href: 'apps/moss60-oracle-warden.html', className: 'game-link' },
        { label: 'Connect to Meta-Pet', href: '#meta-pet' },
        { label: 'Contact for demo', href: 'mailto:bluesssnakestudio@gmail.com' }
      ]
    },
    {
      slug: 'teacher-tools',
      label: 'Teacher Tools',
      eyebrow: 'Classroom proof · behaviour support',
      title: 'Useful in a real classroom.',
      statement: 'Teacher Tools is the proof branch: classroom-ready supports, behaviour sheets, healthy attention design and low-admin learning material for stretched teachers.',
      pageTitle: 'Teacher Tools — Behaviour Support · Blue $nake Studio',
      pageDescription: 'Seven printable behaviour support templates for stretched teachers. Victoria-aware, low admin, child-facing. Behaviour framed as communication throughout.',
      details: [
        'Seven printable behaviour-support templates: transition flows, attention supports, classroom strategies.',
        'Who it helps: classroom teachers, education support officers, integration aides, parents, support coordinators.',
        'Low admin: print-and-use formats, child-facing language, Victoria-aware framing.',
        'Free to download and use in your classroom.',
        'Not legal, medical or clinical advice. These are practical classroom tools, not professional assessments.'
      ],
      links: [
        { label: 'Open Teacher Tools Landing Page', href: 'https://teachers-secret-cheatsheet.vercel.app/', className: 'album-link' },
        { label: 'Open Meta-Pet Pilot School', href: 'https://metapet-pilot-school.vercel.app/' },
        { label: 'Open Meta-Pet', href: 'https://www.bluesnakestudios.com/' },
        { label: 'Email B$S', href: 'mailto:bluesssnakestudio@gmail.com' }
      ],
      featuredIds: ['teacher-one-device-flow', 'teacher-transition-flow', 'meta-pet-no-login', 'meta-pet-process-overview', 'moss60-geometry-linework']
    },
    {
      slug: 'print-street-pack',
      label: 'Print Street Pack',
      eyebrow: 'Poster arsenal · QR drops · Officeworks-ready',
      title: 'Print the omen.',
      statement: 'The Print Street Pack branch is for posters, stickers, QR codes, cutouts, cards, coasters, A4 layouts and physical promo kits that make B$S leave the screen.',
      pageTitle: 'Print Street Pack — Posters, QR & Stickers · Blue $nake Studio',
      pageDescription: 'A4 poster packs, QR sticker sheets, chant posters, brand marks and print-ready street assets from Blue $nake Studio. Officeworks-ready, cuttable, scannable.',
      series: ['Neon Venom', 'B$S Branding', 'Insidious Rhythms', 'Black Wing Crew'],
      featuredIds: [
        'neon-venom-portrait-qr',
        'bwc-neon-qr-sheet',
        'bwc-crest-sheet',
        'bss-serpent-crest',
        'old-vic-state-campaign',
        'neon-venom-campaign',
        'neon-venom-portal-qr',
        'black-wing-chant-sheet'
      ],
      details: [
        'This is central to your style: not just online — printable, cuttable, scannable, hand-to-hand.',
        'Organise files as A4 poster packs, two-up prints, sticker sheets, QR sheets and promo cards.',
        'Every downloadable piece should have clean names so it can go straight to Officeworks or a local printer.'
      ],
      links: [
        { label: 'Watch @blkck2', href: 'https://www.youtube.com/@blkck2', className: 'album-link' },
        { label: 'Email for print files', href: 'mailto:blkck2@gmail.com' }
      ]
    }
  ];

  const studioInscription = [
    'The studio shapes the artist who believes he shaped the studio.',
    'The studio names the artist who believes he named the studio.',
    'The studio builds the artist who believes he built the studio.',
    'The studio dreams the artist who believes he dreamed the studio.',
    'The studio signs the artist who believes he signed the studio.',
    'The studio frames the artist who believes he framed the studio.',
    'The studio records the artist who believes he recorded the studio.',
    'The studio reveals the artist who believes he revealed the studio.',
    'The studio contains the artist who believes he contains the studio.',
    'The studio invents the artist who believes he invented the studio.',
    'The studio gives form to the artist who believes he gave form to the studio.',
    'The studio becomes the artist who believes the artist became the studio.',
    'The work creates the artist who believes he created the work.',
    'The image creates the painter who believes he painted the image.',
    'The song creates the singer who believes he wrote the song.',
    'The myth creates the maker who believes he made the myth.',
    'The brand creates the artist who believes he created the brand.',
    'The symbol creates the hand who believes it drew the symbol.',
    'The vision creates the creator who believes he created the vision.',
    'The archive creates the artist who believes he controls the archive.'
  ];

  const rulerInscription = [
    'The law watches the judge; the judge believes he speaks the law.',
    'The ledger reads the ruler; the ruler believes he wrote the ledger.',
    'The throne weighs the ruler; the ruler believes he holds the throne.',
    'The mask reads the wearer; the wearer believes he hides behind the mask.',
    'The record measures the ruler who believes he controls the record.',
    'The page judges the author; the author believes he wrote the page.',
    'The mirror studies the face; the face believes it owns the mirror.',
    'The archive remembers the ruler who believes he owns the archive.',
    'The law contains the ruler who believes he commands the law.',
    'The office defines the ruler who believes he defines the office.',
    'The title binds the ruler who believes he holds the title.',
    'The seal marks the ruler who believes he gives meaning to the seal.',
    'The register names the ruler who believes he created the register.',
    'The institution observes the ruler who believes he embodies the institution.',
    'The mandate limits the ruler who believes he controls the mandate.',
    'The constitution restrains the ruler who believes he interprets the constitution.',
    'The account audits the ruler who believes he manages the account.',
    'The document validates the ruler who believes he validates the document.',
    'The system produces the ruler who believes he produced the system.',
    'The page records the ruler who believes he authored the page.',
    'The signature binds the ruler who believes he controls the signature.',
    'The crown weighs the ruler who believes he carries the crown.',
    'The throne judges the ruler who believes he owns the throne.',
    'The oath holds the ruler who believes he made the oath.',
    'The evidence exposes the ruler who believes he controls the evidence.',
    'The history writes the ruler who believes he is writing history.'
  ];


  const projectProofStrips = {
    'start-here': [
      ['What it is', 'A concise introduction to the studio, its disciplines and its active projects.'],
      ['Why it matters', 'It gives schools, councils and collaborators a clear view of the work and its practical value.'],
      ['Exists already', 'A working gallery, music releases, Meta-Pet, Teacher Tools, Moss 60 and print-ready assets.'],
      ['Next move', 'Choose a discipline, review the work, then follow the relevant project or contact link.']
    ],
    'moss-man': [
      ['What it is', 'The front-door map for the whole B$S studio-world.'],
      ['Why it matters', 'It turns wild creative output into one readable myth-tech archive.'],
      ['Exists already', 'Moss Tree hub, gallery rooms, 25 media pieces, @blkck2 links, contact pathway.'],
      ['Next move', 'Enter Gallery Rooms first, then follow the proof into music, tools and print.']
    ],
    'visual-worlds': [
      ['What it is', 'A room-based archive for art, promo, music-world imagery, school proof and number systems.'],
      ['Why it matters', 'Rooms make B$S feel discovered, not browsed.'],
      ['Exists already', 'Eight named chambers, preview tiles, room modals, proof tags and selected works.'],
      ['Next move', 'Open a room, then turn the strongest pieces into print/download packs.']
    ],
    'black-wing-crew': [
      ['What it is', 'The dark chant and song-world branch for Neon Venom, Black Omen and recursive hooks.'],
      ['Why it matters', 'It gives the studio a sound, a symbol language and a scannable public identity.'],
      ['Exists already', 'Black Wing Crew site, YouTube @blkck2, chant sheets, QR bait and video sources.'],
      ['Next move', 'Connect every song to one poster, one QR card and one short clip.']
    ],
    'old-vic-state': [
      ['What it is', 'A Victorian civic-gothic song, image and poetry cycle built around recursion, witness and command.'],
      ['Why it matters', 'It joins the studio\'s music, political symbolism and long-form writing into one complete world.'],
      ['Exists already', 'Four key artworks, a Suno playlist and two finished illustrated books.'],
      ['Core line', 'One wing remembers fire. One wing remembers law. Between them hangs the body of command.']
    ],
    'frankston-fuji': [
      ['What it is', 'A sister-city song and learning bridge from Frankston toward Fuji/Susono.'],
      ['Why it matters', 'It makes the music useful for cultural connection, language practice and school/community outreach.'],
      ['Exists already', 'Frankston → Fuji link, lyric-sheet direction, taiko/rhythm learning ideas and bilingual practice pathway.'],
      ['Next move', 'Add a clean one-page explanation for councils, schools and sister-city contacts.']
    ],
    'black-omen-waahn': [
      ['What it is', 'A respectful research branch for Black Omen, Waahn and Bunurong/Boonwurrung language enquiry.'],
      ['Why it matters', 'It keeps culture, permission and place respect visible instead of treating language as decoration.'],
      ['Exists already', 'Waahn research map, word-bank direction, contact framing and consultation-first notes.'],
      ['Next move', 'Keep it marked as research-in-progress and store approvals/notes beside the work.']
    ],
    'meta-pet': [
      ['What it is', 'A privacy-first learning companion and school pilot pathway.'],
      ['Why it matters', 'It proves B$S is not only art: it can become a child-safe education tool.'],
      ['Exists already', 'Meta-Pet Pilot School link, Moss 60 engine link, teacher pathway and privacy-first pitch.'],
      ['Next move', 'Build a school-facing one-pager and a classroom demo route.']
    ],
    'moss60': [
      ['What it is', 'The number engine under the moss: base-60, 108/360 cycles, glyphs and digital DNA.'],
      ['Why it matters', 'It gives the magic a hidden logic so the work feels alive, learnable and repeatable.'],
      ['Exists already', 'Moss 60 geometry asset, symbolic marks, Meta-Pet identity direction and puzzle/game concepts.'],
      ['Next move', 'Package it as a playable engine first, with deeper maths available underneath.']
    ],
    'teacher-tools': [
      ['What it is', 'The practical classroom branch: cheat sheets, behaviour support and school pilot material.'],
      ['Why it matters', 'It gives the studio a serious use-case for teachers, children and families.'],
      ['Exists already', 'Teacher\'s Secret Cheatsheet link, Meta-Pet Pilot School, Drive teacher structure and printable pack plan.'],
      ['Next move', 'Make a calm Teacher Tools homepage with quick buttons and downloadable sheets.']
    ],
    'print-street-pack': [
      ['What it is', 'The physical deployment branch for posters, stickers, QR codes, cards and cutout packs.'],
      ['Why it matters', 'It makes B$S leave the screen and become something people can hold, scan and share.'],
      ['Exists already', 'Drive print folders, QR/sticker assets, chant posters, brand marks and naming rules.'],
      ['Next move', 'Create one clean A4 QR sheet, one sticker sheet and one school one-pager.']
    ]
  };

  const galleryRooms = [
    {
      slug: 'painted-wing',
      number: 'ROOM 01',
      title: 'The Painted Wing',
      eyebrow: 'paintings · handmade myth · Auralia body',
      doorway: 'Enter where the hand still shows.',
      statement: 'The handmade chamber: physical paintings, Auralia portraits, cockatoo companions, spiral listeners and blue/gold studio mythology.',
      mood: 'warm gold, bird-shadow, halo, brush texture, living sketchbook',
      useFor: 'portfolio proof, artist identity, handmade credibility, exhibition pieces',
      proof: ['physical paintings', 'Auralia portrait language', 'cockatoo totem work', 'blue/gold B$S palette'],
      promise: 'This room proves the studio is not only prompts and code — there is a hand, a mythology, and a real painter underneath it.',
      ids: ['painting-bss-woman-cockatoo', 'painting-redhair-auralia', 'painting-spiral-listener', 'painting-two-muses', 'auralia-serpent-profile', 'auralia-moon-dust', 'bss-twin-cockatoos-stained-glass', 'auralia-ouroboros-keyart', 'auralia-blue-flight-relief', 'auralia-dark-profile-snake', 'she-weaves-dawn-stained-glass', 'she-weaves-dawn-woodblock', 'painting-child-namo-narayana', 'auralia-klimt-mosaic']
    },
    {
      slug: 'neon-venom-room',
      number: 'ROOM 02',
      title: 'Neon Venom',
      eyebrow: 'QR portals · sticker bait · music-world colour',
      doorway: 'Enter the bright poison.',
      statement: 'The loud chamber: QR portals, black birds, venom colours, stickers, music hooks and scan-me street energy.',
      mood: 'hot pink, electric cyan, toxic green, night market glow, sticker-wall chaos',
      useFor: 'music promo, YouTube traffic, QR drops, sticker sheets, street campaigns',
      proof: ['QR stickers', 'Black Wing Crew bait', 'neon campaign graphics', 'promo-ready visuals'],
      promise: 'This room makes the work scannable, shareable and hard to ignore.',
      ids: ['neon-venom-portrait-qr', 'bwc-neon-qr-sheet', 'neon-venom-campaign', 'neon-venom-portal-qr', 'neon-venom-enter-dream-qr', 'neon-venom-black-birds-dream', 'woman-money-venom-shorts-qr', 'woman-money-venom-full-qr', 'neon-venom-cyberpunk-poster', 'black-wing-cosmic-singing']
    },
    {
      slug: 'omen-room',
      number: 'ROOM 03',
      title: 'The Omen Room',
      eyebrow: 'black birds · black butterflies · chant sheets',
      doorway: 'Enter where the sign looks back.',
      statement: 'The darker ceremonial chamber: black birds, black butterflies, chant sheets, lyric-world material and the sign-dreams-the-seer language system.',
      mood: 'moon bay, folded wing, bird omen, black butterfly, recursive hook',
      useFor: 'Black Wing Crew, Black Omen, lyric posters, chant sheets, film clip identity',
      proof: ['Black Omen chant sheet', 'Auralia omen poster', 'Insidious Rhythms lyrics', 'raw video sources'],
      promise: 'This room gives the music its mythology and makes the songs feel like they came from somewhere older.',
      ids: ['black-omen-research-map', 'black-omen-language-working-map', 'black-wing-chant-sheet', 'auralia-cosmic-poster', 'insidious-rhythms-gold', 'insidious-rhythms-blue', 'video-black-wing-source-01', 'video-source-02', 'black-cockatoo-deity-throne', 'bss-coat-of-arms', 'krishna-bss-portrait', 'krishna-bss-fullbody', 'moss-man-victorian-library', 'omen-fire-silhouette', 'omen-campfire-face', 'black-cockatoo-queen', 'bss-mascot-all-seeing-eye', 'omen-blue-serpent-deity', 'bss-twin-cockatoos-night']
    },
    {
      slug: 'learning-beast',
      number: 'ROOM 04',
      title: 'The Learning Beast',
      eyebrow: 'Meta-Pet · school pilot · teacher proof',
      doorway: 'Enter the tool hiding inside the myth.',
      statement: 'The proof chamber: Meta-Pet school pilot, teacher tools, behaviour-support thinking and classroom material connected to the B$S pattern engine.',
      mood: 'calmer glow, classroom night-mode, child-safe creature, practical magic',
      useFor: 'school pitch, teacher pathway, classroom printables, behaviour support, Meta-Pet explanation',
      proof: ['Meta-Pet Pilot School link', 'Teacher Tools link', 'behaviour-support direction', 'Moss 60 learning engine'],
      promise: 'This room shows the serious education purpose underneath the wild visual shell.',
      ids: ['meta-pet-process-overview', 'teacher-one-device-flow', 'teacher-transition-flow', 'meta-pet-no-login', 'meta-pet-digital-genomes', 'meta-pet-companion-portrait', 'meta-pet-neon-ornament', 'meta-pet-kid-with-feather', 'auralia-divine-ascending', 'auralia-coin-m', 'auralia-coin-f']
    },
    {
      slug: 'moss60-engine',
      number: 'ROOM 05',
      title: 'Moss 60 Engine',
      eyebrow: 'number system · symbolic geometry · digital DNA',
      doorway: 'Enter the machine under the moss.',
      statement: 'The hidden engine chamber: geometry, symbolic maths, base-60 energy, glyph thinking, 108/360 cycles and digital DNA logic.',
      mood: 'linework, triangles, rings, sigils, engine light, sacred circuit board',
      useFor: 'interactive puzzles, Meta-Pet identity, digital DNA, skill-game mechanics, mythic logic systems',
      proof: ['MOSS60 geometry study', 'B$S symbolic marks', 'Auralia serpent loop', 'fire/mood texture'],
      promise: 'This room keeps the maths behind the magic so the work feels alive instead of random.',
      ids: ['moss60-dna-geometry-campaign', 'meta-pet-neon-ornament', 'meta-pet-digital-genomes', 'moss60-geometry-linework', 'blue-snake-gold-logo', 'auralia-serpent-profile', 'bss-cockatoo-logo', 'spiral-mountain-god', 'auralia-moss60-linework']
    },
    {
      slug: 'street-print-arsenal',
      number: 'ROOM 06',
      title: 'Street Print Arsenal',
      eyebrow: 'posters · stickers · QR cards · cutout packs',
      doorway: 'Enter the room that leaves the screen.',
      statement: 'The physical deployment chamber: lyric posters, brand marks, QR cards, sticker sheets, cutouts and anything that can be printed, trimmed, handed out or stuck up.',
      mood: 'Officeworks-ready, street table, cut marks, QR glow, sticker pile, promo ritual',
      useFor: 'A4 poster packs, QR sheets, sticker sheets, school one-pagers, song posters, handout kits',
      proof: ['QR designs', 'lyric posters', 'brand marks', 'chant sheets', 'sticker-ready artwork'],
      promise: 'This room turns the online world into physical evidence people can hold, scan and remember.',
      downloadPack: { label: '↓ Download QR Pack', href: 'downloads/bss-qr-drop-pack.zip' },
      ids: ['neon-venom-portrait-qr', 'bwc-neon-qr-sheet', 'bwc-crest-sheet', 'bss-serpent-crest', 'old-vic-state-campaign', 'neon-venom-campaign', 'neon-venom-portal-qr', 'black-wing-chant-sheet', 'qr-pink', 'qr-orange', 'qr-yellow', 'qr-green', 'qr-purple', 'qr-cyan', 'qr-rainbow', 'neon-venom-cyberpunk-poster', 'moss-man-hope-poster']
    },
    {
      slug: 'colouring-pages',
      number: 'ROOM 07',
      title: 'Colouring Pages',
      eyebrow: 'printable line art · quiet creativity · studio symbols',
      doorway: 'Take the world into your own hands.',
      statement: 'A printable collection of detailed Auralia, cockatoo, serpent, butterfly and Moss Man artwork—made for colouring, classrooms and calm creative time.',
      mood: 'clean paper, patient linework, ceremonial detail, black ink, open imagination',
      useFor: 'home printing, classroom activities, mindful colouring, creative workshops, studio handouts',
      proof: ['seven printable artworks', 'detailed and simple options', 'Auralia visual world', 'full-size PNG files'],
      promise: 'This room invites people to participate in the studio world, one colour at a time.',
      downloadPack: { label: '↓ Download Colouring Pack', href: 'downloads/bss-colouring-pages-pack.zip' },
      ids: ['colouring-auralia-landscape', 'colouring-auralia-flute', 'colouring-auralia-omen', 'colouring-auralia-gateway', 'colouring-moss-man', 'colouring-cockatoo-serpent', 'print-ruler-is-read', 'colouring-child-saint', 'colouring-pug-kiss', 'colouring-auralia-simple', 'colouring-auralia-detailed', 'colouring-auralia-female']
    },
    {
      slug: 'memetics-public-repair',
      number: 'ROOM 08',
      title: 'Memetics & Public Repair',
      eyebrow: 'semantic systems · public responsibility · action frameworks',
      doorway: 'Awareness is the start. Repair is the proof.',
      statement: 'A focused chamber for memetic systems, narrative responsibility and public-repair frameworks—designed to turn attention into clear next steps.',
      mood: 'black paper, warning gold, civic pressure, hard choices, practical routes forward',
      useFor: 'memetics research, campaign analysis, public-interest frameworks, responsibility mapping',
      proof: ['Known Unknowns Register', 'seven public-repair posters', 'action frameworks', 'semantic sovereignty research'],
      promise: 'This room asks what messages do after they attract attention—and whether they lead toward truth, responsibility and repair.',
      links: [
        { label: 'Open Known Unknowns Register', href: 'documents/oss-734g-known-unknowns-register.html', className: 'album-link' }
      ],
      ids: ['memetics-duty-nine-steps', 'memetics-fear-duty', 'memetics-awareness-repair', 'memetics-story-duty', 'memetics-status-quo-personal', 'memetics-awareness-safety', 'memetics-status-quo-systems']
    },
    {
      slug: 'moss-man-room',
      number: 'ROOM 09',
      title: 'The Moss Man',
      eyebrow: 'Tom Moss · Frankston, Australia',
      doorway: 'The portrait archive.',
      statement: 'Ten years of self-portraiture, parody and myth-building. From the runic scribe to the budget medieval warrior.',
      mood: 'Warm, strange, self-aware',
      useFor: 'Press, collaboration pitches, social content',
      proof: ['Runic scribe portrait', 'Frankston Law Courts', 'Crown of the Clucker', 'HOPE poster', '$5 medieval warrior'],
      promise: 'You will understand who made this.',
      ids: ['moss-man-runic-scribe', 'moss-man-frankston-courts', 'moss-man-hope-poster', 'moss-man-crown-clucker', 'moss-man-five-dollar-warrior', 'moss-man-pug-oldmaster', 'moss-man-notice-poster', 'moss-man-victorian-library', 'moss-man-portrait-v1', 'moss-man-portrait-v2', 'moss-man-fire-cockatoo', 'moss-man-candid']
    },
    {
      slug: 'humour-room',
      number: 'ROOM 10',
      title: 'Humour & Parody',
      eyebrow: 'Black Wing Crew · Comedy archive',
      doorway: 'The part where the studio laughs at itself.',
      statement: 'Breaking Beak, Beak to the Future, Crown of the Clucker and the official emu/kangaroo national policy.',
      mood: 'Irreverent, very Australian',
      useFor: 'Social posts, YouTube thumbnails, merch',
      proof: ['Beak to the Future', 'Breaking Beak', 'Pi Wizard Chicken', 'Forward Together Awkward Forever'],
      promise: 'One of these becomes a meme.',
      ids: ['humour-beak-to-the-future', 'humour-breaking-beak', 'humour-pi-wizard-chicken', 'humour-forward-together', 'moss-man-crown-clucker', 'moss-man-five-dollar-warrior']
    }
  ];


  total.textContent = String(sections.length).padStart(2, '0');

  const slugs = sections.map(section => section.slug);
  let active = Math.max(0, slugs.indexOf(location.hash.slice(1)));
  let wheelLocked = false;
  let pointerStartY = null;
  let pointerStartX = null;
  let lastFocused = null;

  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function externalAttrs(href) {
    return href && !href.startsWith('#') && !href.startsWith('mailto:') ? ' target="_blank" rel="noopener"' : '';
  }

  function mediaPreview(item) {
    if (item.mediaType === 'video') {
      return `<video class="card-media lazy-video" data-src="${escapeHtml(item.video)}" muted preload="none" playsinline></video>`;
    }
    return `<img class="card-media" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" />`;
  }

  function artCard(item) {
    return `
      <article class="art-card" data-series="${escapeHtml(item.series)}">
        <button type="button" data-art-id="${escapeHtml(item.id)}">
          ${mediaPreview(item)}
          <div class="art-body">
            <div class="meta-line">${escapeHtml(item.series)} · ${escapeHtml(item.medium)}</div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <div class="tags">${(item.tags || []).slice(0, 5).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
          </div>
        </button>
      </article>
    `;
  }

  function linksRow(section) {
    const links = section.links || [];
    if (!links.length) return '';
    return `<div class="links-row">${links.map(link => `<a class="project-link ${link.className || ''}" href="${escapeHtml(link.href)}"${externalAttrs(link.href)}>${escapeHtml(link.label)}</a>`).join('')}</div>`;
  }

  function filterBar(sectionItems) {
    const series = [...new Set(sectionItems.map(i => i.series))];
    if (series.length < 2) return '';
    return `
      <div class="gallery-filter-bar" role="group" aria-label="Filter by series">
        <button class="filter-btn is-active" data-filter="all">All</button>
        ${series.map(s => `<button class="filter-btn" data-filter="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join('')}
      </div>`;
  }

  function startHereAudience() {
    const doors = [
      {
        audience: 'Schools / Parents',
        what: 'Child-safe learning tools and classroom support.',
        detail: 'Meta-Pet digital companion, Teacher\'s Secret Cheatsheet, behaviour-support templates, privacy-first design — no ads, no trackers.',
        cta: 'Try Meta-Pet', href: 'https://www.bluesnakestudios.com/'
      },
      {
        audience: 'Art / Music / Culture',
        what: 'Mythic music worlds, visual art, print packs and lore.',
        detail: 'Black Wing Crew, Neon Venom LP, gallery rooms, sticker sheets, lyric posters, YouTube and street print drops.',
        cta: 'Enter Black Wing Crew', href: 'https://blackwingcrew.netlify.app/'
      },
      {
        audience: 'Theory / Invention',
        what: 'Visual number system, symbolic engine and digital DNA.',
        detail: 'Moss 60 base-60 geometry, Semantic Sovereignty doctrine, interactive glyph engine, proof layers and pattern logic.',
        cta: 'Explore Moss 60', href: '#moss60'
      }
    ];
    return `
      <section class="start-here-pack" aria-label="Choose your door">
        <div class="section-heading">
          <p class="eyebrow">Choose your door</p>
          <h2>Three ways into the studio.</h2>
        </div>
        <div class="start-card-grid">
          ${doors.map(d => `
            <a class="start-card" href="${escapeHtml(d.href)}"${externalAttrs(d.href)}>
              <span>${escapeHtml(d.audience)}</span>
              <strong>${escapeHtml(d.what)}</strong>
              <p>${escapeHtml(d.detail)}</p>
              <em>${escapeHtml(d.cta)} →</em>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  }

  function featuredProjectsGrid() {
    const projects = [
      { label: 'Meta-Pet', status: 'In development', desc: 'A privacy-first digital pet and learning companion — no ads, trackers, social feeds, gambling loops or unnecessary data.', href: '#meta-pet' },
      { label: 'Teacher\'s Secret Cheatsheet', status: 'Live', desc: 'Behaviour-support templates for stretched teachers. Print and use. Zero admin.', href: 'https://teachers-secret-cheatsheet.vercel.app/' },
      { label: 'Black Wing Crew / Neon Venom', status: 'Live', desc: '2026 LP: songs, lyric posters, QR drops, streaming.', href: 'https://blackwingcrew.netlify.app/' },
      { label: 'Moss 60', status: 'Research', desc: 'Visual number system — base-60 digital DNA, glyph engine and symbolic identity.', href: '#moss60' },
      { label: 'Semantic Sovereignty', status: 'Active', desc: 'Doctrine on language, framing, meaning and narrative defence.', href: 'documents/oss-734g-known-unknowns-register.html' },
      { label: 'Visual Worlds', status: 'Live', desc: '10 gallery rooms: mythology, portraits, parody, print.', href: '#visual-worlds' },
      { label: 'Frankston → Fuji', status: 'In progress', desc: 'Bilingual sister-city song, Japanese practice & taiko.', href: '#frankston-fuji' },
      { label: 'Black Omen / Waahn', status: 'Research', desc: 'Bunurong-Boonwurrung language research map.', href: '#black-omen-waahn' }
    ];
    return `
      <section class="featured-projects" aria-label="Studio projects">
        <div class="section-heading">
          <p class="eyebrow">What we make</p>
          <h2>Studio projects.</h2>
        </div>
        <div class="featured-project-grid">
          ${projects.map(p => `
            <a class="featured-project-card" href="${escapeHtml(p.href)}"${externalAttrs(p.href)}>
              <strong>${escapeHtml(p.label)}</strong>
              ${p.status ? `<span class="project-status">${escapeHtml(p.status)}</span>` : ''}
              <p>${escapeHtml(p.desc)}</p>
            </a>`).join('')}
        </div>
      </section>
    `;
  }

  function startHereAbout() {
    return `
      <section class="studio-about" aria-label="About the studio">
        <div class="section-heading">
          <p class="eyebrow">The Moss Man / Tom Moss · Frankston, Australia</p>
          <h2>A studio without hard borders.</h2>
        </div>
        <div class="about-body">
          <p>Tom is a hands-on creator, artist, songmaker, behavioural thinker, digital developer, pattern-builder and world-maker. He has spent years building connected systems where a painting informs a number, a chant informs a classroom tool, and a black cockatoo feather threads through all of it.</p>
          <p>Blue $nake Studio is his production entity. blkck2.com is the portal. The work covers visual art, music, education technology and symbolic systems — held together by a single principle: <em>patterns become worlds.</em></p>
          <div class="links-row">
            <a class="project-link album-link" href="#moss-man">Meet The Moss Man →</a>
            <a class="project-link" href="mailto:bluesssnakestudio@gmail.com">Contact the studio</a>
          </div>
        </div>
      </section>
    `;
  }

  function panelFooter() {
    return `
      <footer class="panel-footer" role="contentinfo">
        <p class="footer-brand">Created by <strong>The Moss Man</strong> / <strong>Blue $nake Studio</strong> — <a href="https://blkck2.com/">blkck2.com</a> — <a href="https://www.youtube.com/@blkck2" target="_blank" rel="noopener noreferrer">@blkck2</a></p>
        <p class="footer-contact"><a href="mailto:bluesssnakestudio@gmail.com">bluesssnakestudio@gmail.com</a> · <a href="mailto:blkck2@gmail.com">blkck2@gmail.com</a></p>
      </footer>
    `;
  }

  function collectionGrid() {
    return `
      <div class="mini-collections">
        ${sections.slice(1).map((section, index) => `
          <a class="collection-chip" href="#${section.slug}" data-jump-index="${index + 1}">
            <small>${String(index + 2).padStart(2, '0')}</small>
            <strong>${escapeHtml(section.label)}</strong>
          </a>`).join('')}
      </div>
    `;
  }

  function getSectionItems(section) {
    if (section.featuredIds) {
      return section.featuredIds.map(id => items.find(item => item.id === id)).filter(Boolean);
    }
    if (!section.series) return [];
    return items.filter(item => section.series.includes(item.series));
  }


  function getRoomItems(room) {
    return (room.ids || []).map(id => items.find(item => item.id === id)).filter(Boolean);
  }

  function roomThumb(item) {
    if (!item) return '';
    if (item.mediaType === 'video') {
      return `<video src="${escapeHtml(item.video)}" muted preload="metadata" playsinline></video>`;
    }
    return `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" />`;
  }

  function roomCard(room, index) {
    const roomItems = getRoomItems(room);
    return `
      <article class="room-card" style="--room-index:${index}">
        <button type="button" data-room-slug="${escapeHtml(room.slug)}" aria-label="Enter ${escapeHtml(room.title)}">
          <div class="room-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
          <div class="room-preview">${roomItems.slice(0, 4).map(roomThumb).join('')}</div>
          <div class="room-copy">
            <p class="room-number">${escapeHtml(room.number)}</p>
            <p class="meta-line">${escapeHtml(room.eyebrow)}</p>
            <h3>${escapeHtml(room.title)}</h3>
            <em>${escapeHtml(room.doorway)}</em>
            <p>${escapeHtml(room.statement)}</p>
            <div class="room-mini">
              <span>mood</span><strong>${escapeHtml(room.mood)}</strong>
            </div>
            <strong class="enter-room">Enter room</strong>
          </div>
        </button>
      </article>
    `;
  }

  function roomsShowcase() {
    return `
      <section class="room-showcase" aria-label="B$S gallery rooms">
        <div class="section-heading">
          <p class="eyebrow">Gallery rooms</p>
          <h2>Not categories. Chambers.</h2>
          <p class="room-intro">The visitor should feel like they are walking through a strange studio archive: handmade myth, venom promo, omen language, school proof, number engine and street-print arsenal.</p>
        </div>
        <div class="room-tour">
          ${galleryRooms.map(room => `<button type="button" data-room-slug="${escapeHtml(room.slug)}"><span>${escapeHtml(room.number)}</span>${escapeHtml(room.title)}</button>`).join('')}
        </div>
        <div class="room-grid">${galleryRooms.map(roomCard).join('')}</div>
      </section>
    `;
  }

  function openRoom(roomSlug) {
    const room = galleryRooms.find(candidate => candidate.slug === roomSlug);
    if (!room) return;
    const roomItems = getRoomItems(room);
    const backdrop = getOrCreateModal();
    backdrop.querySelector('.modal-content').innerHTML = `
      <div class="room-modal-head">
        <p class="eyebrow">${escapeHtml(room.number)} · ${escapeHtml(room.eyebrow)}</p>
        <h2>${escapeHtml(room.title)}</h2>
        <p class="room-doorway-line">${escapeHtml(room.doorway)}</p>
        <p>${escapeHtml(room.statement)}</p>
        <blockquote>${escapeHtml(room.promise)}</blockquote>
        <div class="room-facts">
          <div><span>mood</span><strong>${escapeHtml(room.mood)}</strong></div>
          <div><span>use it for</span><strong>${escapeHtml(room.useFor)}</strong></div>
        </div>
        ${linksRow(room)}
        ${room.downloadPack ? `<div class="links-row"><a class="project-link album-link" href="${escapeHtml(room.downloadPack.href)}" download>${escapeHtml(room.downloadPack.label)}</a></div>` : ''}
        <div class="room-proof-strip">
          ${(room.proof || []).map(proof => `<span>${escapeHtml(proof)}</span>`).join('')}
        </div>
      </div>
      <div class="gallery-grid room-modal-grid">${roomItems.map(artCard).join('')}</div>
    `;
    backdrop.querySelectorAll('[data-art-id]').forEach(button => {
      button.addEventListener('click', () => {
        const item = items.find(candidate => candidate.id === button.dataset.artId);
        if (item) openModal(item);
      });
    });
    activateModal(backdrop);
  }


  function projectProofStrip(section) {
    const proofRows = projectProofStrips[section.slug] || [];
    if (!proofRows.length) return '';
    return `
      <section class="project-proof-strip" aria-label="${escapeHtml(section.label)} proof strip">
        <div class="proof-strip-head">
          <p class="eyebrow">Proof strip</p>
          <strong>Creative vision. Practical outcomes.</strong>
        </div>
        <div class="proof-strip-grid">
          ${proofRows.map(([label, value]) => `
            <article class="proof-card">
              <span>${escapeHtml(label)}</span>
              <p>${escapeHtml(value)}</p>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }

  function textualInstallation() {
    const movement = (title, subtitle, lines) => `
      <section class="inscription-movement">
        <header><span>${escapeHtml(subtitle)}</span><h3>${escapeHtml(title)}</h3></header>
        <ol>${lines.map(line => `<li><p>${escapeHtml(line)}</p></li>`).join('')}</ol>
      </section>`;

    return `
      <section class="textual-installation" aria-labelledby="installation-title">
        <div class="installation-threshold">
          <p class="eyebrow">Textual installation · two movements</p>
          <h2 id="installation-title">The hand enters.<br><em>The room looks back.</em></h2>
          <p>Authorship turns like a mirror: first the studio makes its maker, then the structures of power read those who claim to command them.</p>
        </div>
        <details class="installation-vault">
          <summary><span>Enter the inscription</span><small>46 reversals · studio / authority</small></summary>
          <div class="inscription-diptych">
            ${movement('The Studio Looks Back', 'Movement I · The maker is made', studioInscription)}
            ${movement('The Ruler Is Read', 'Movement II · Authority observed', rulerInscription)}
          </div>
          <footer>The studio becomes witness. The record becomes author.</footer>
        </details>
      </section>`;
  }

  function oldVicStateFeature() {
    const chapters = [
      ['I', 'The Omen', 'War becomes government; government dreams it has escaped war.', '19_old_vic_state/black-omen-command-cycle.jpeg'],
      ['II', 'The Ledger', 'Justice deferred. Truth recorded. Silence witnessed. Time remembers.', '19_old_vic_state/old-vic-ledger-city.jpeg'],
      ['III', 'Butterfly Symmetry', 'One wing remembers fire. One wing remembers law.', '19_old_vic_state/butterfly-symmetry-triptych.jpeg'],
      ['IV', 'The Witness', 'The civic memory remains when the office, crown and speaker are gone.', '19_old_vic_state/victorian-ledger-witness.jpeg']
    ];
    return `
      <section class="old-vic-feature" aria-labelledby="old-vic-feature-title">
        <figure class="old-vic-hero">
          <img src="14_music_campaigns/old-vic-state-campaign.png" alt="Old Vic State in monumental gold lettering between a recording studio and a gothic civic procession" loading="lazy">
          <figcaption>
            <span>Old Vic State · B$S original cycle</span>
            <h2 id="old-vic-feature-title">Memory sharpened into hope.</h2>
            <p>The debt remembers names. The old gods do not hurry.</p>
          </figcaption>
        </figure>
        <div class="old-vic-axis" aria-hidden="true"><span>WAR</span><i></i><strong>COMMAND</strong><i></i><span>LAW</span></div>
        <div class="old-vic-chapters">
          ${chapters.map(([number, title, copy, image]) => `
            <figure>
              <img src="${image}" alt="${escapeHtml(title)} artwork from the Old Vic State cycle" loading="lazy">
              <figcaption><span>${number}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(copy)}</p></figcaption>
            </figure>`).join('')}
        </div>
        <blockquote>
          <p>“The soldier is awake. The people are awake. The government sleeps inside its own command.”</p>
          <cite>The Inversion of the Recursive Dream · final inscription</cite>
        </blockquote>
        <div class="old-vic-books">
          <a href="documents/butterfly-symmetry-final-loop.pdf" target="_blank" rel="noopener">
            <span>Book I · 8 pages</span><strong>The Inversion of the Recursive Dream</strong><em>Butterfly symmetry / civic transfer verse</em>
          </a>
          <a href="documents/victorian-statesman-recursive-lullaby.pdf" target="_blank" rel="noopener">
            <span>Book II · two versions</span><strong>The Victorian Statesman’s Recursive Lullaby</strong><em>Memory sharpened into hope</em>
          </a>
        </div>
      </section>`;
  }

  function panelTemplate(section, index) {
    const sectionItems = getSectionItems(section);
    const hasGallery = sectionItems.length > 0;
    const galleryTitle = index === 0 ? 'Doorway proof' : `${section.label} proof`;
    const tabs = hasGallery ? `
      <div class="panel-subnav" role="tablist" aria-label="${escapeHtml(section.label)} views">
        <button class="panel-subtab is-active" id="subtab-${section.slug}-overview" type="button" role="tab" aria-selected="true" aria-controls="view-${section.slug}-overview" data-panel-view="overview">Overview</button>
        <button class="panel-subtab" id="subtab-${section.slug}-images" type="button" role="tab" aria-selected="false" aria-controls="view-${section.slug}-images" data-panel-view="images">Images <span>${sectionItems.length}</span></button>
      </div>` : '';
    return `
      <article class="panel ${index === active ? 'is-active' : ''}" id="panel-${section.slug}" role="tabpanel" aria-labelledby="tab-${section.slug}" ${index === active ? '' : 'hidden'}>
        <div class="panel-scroll">
          ${tabs}
          <section class="panel-view is-active" id="view-${section.slug}-overview" role="tabpanel" aria-labelledby="subtab-${section.slug}-overview" data-panel-view-panel="overview">
            <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
            <h1>${escapeHtml(section.title)}</h1>
            <p class="statement">${escapeHtml(section.statement)}</p>
            ${section.studioDescription ? `<p class="studio-description">${escapeHtml(section.studioDescription)}</p>` : ''}
            ${section.textualInstallation ? textualInstallation() : ''}
            ${section.oldVicState ? oldVicStateFeature() : ''}
            ${linksRow(section)}
            ${!section.startHere ? `<ul class="details">${(section.details || []).map(detail => `<li>${escapeHtml(detail)}</li>`).join('')}</ul>` : ''}
            ${projectProofStrip(section)}
            ${section.startHere ? startHereAudience() : ''}
            ${section.startHere ? featuredProjectsGrid() : ''}
            ${section.startHere ? startHereAbout() : ''}
            ${section.startHere ? collectionGrid() : ''}
            ${section.rooms ? roomsShowcase() : ''}
            ${panelFooter()}
          </section>
          ${hasGallery ? `
            <section class="panel-view panel-images-view" id="view-${section.slug}-images" role="tabpanel" aria-labelledby="subtab-${section.slug}-images" data-panel-view-panel="images" hidden>
              <div class="gallery-section">
                <div class="section-heading">
                  <p class="eyebrow">Selected works</p>
                  <h2>${escapeHtml(galleryTitle)}</h2>
                </div>
                ${filterBar(sectionItems)}
                <div class="gallery-grid">${sectionItems.map(artCard).join('')}</div>
              </div>
            </section>` : ''}
        </div>
      </article>
    `;
  }

  function buildTree() {
    tree.querySelectorAll('.node').forEach(node => node.remove());
    sections.forEach((section, index) => {
      const node = document.createElement('button');
      node.className = `node${index === active ? ' is-active' : ''}`;
      node.style.setProperty('--i', index);
      node.style.setProperty('--side', index % 2 === 0 ? -1 : 1);
      node.id = `tab-${section.slug}`;
      node.type = 'button';
      node.setAttribute('role', 'tab');
      node.setAttribute('aria-selected', String(index === active));
      node.setAttribute('aria-controls', `panel-${section.slug}`);
      node.tabIndex = index === active ? 0 : -1;
      node.dataset.index = index;
      node.dataset.slug = section.slug;
      node.innerHTML = `<span class="node-index">${String(index + 1).padStart(2, '0')}</span><span class="node-label">${escapeHtml(section.label)}</span>`;
      node.addEventListener('click', () => select(index, { focus: true }));
      tree.appendChild(node);
    });
  }

  function buildPanels() {
    panelWrap.innerHTML = sections.map(panelTemplate).join('');

    panelWrap.querySelectorAll('[data-art-id]').forEach(button => {
      button.addEventListener('click', () => {
        const item = items.find(candidate => candidate.id === button.dataset.artId);
        if (item) openModal(item);
      });
    });
    panelWrap.querySelectorAll('[data-room-slug]').forEach(button => {
      button.addEventListener('click', () => openRoom(button.dataset.roomSlug));
    });
    panelWrap.querySelectorAll('[data-jump-index]').forEach(anchor => {
      anchor.addEventListener('click', event => {
        event.preventDefault();
        select(Number(anchor.dataset.jumpIndex), { focus: true });
      });
    });

    panelWrap.querySelectorAll('.panel-subnav').forEach(nav => {
      nav.addEventListener('click', event => {
        const button = event.target.closest('[data-panel-view]');
        if (!button) return;
        const panel = nav.closest('.panel');
        const targetView = button.dataset.panelView;
        nav.querySelectorAll('.panel-subtab').forEach(tab => {
          const selected = tab === button;
          tab.classList.toggle('is-active', selected);
          tab.setAttribute('aria-selected', String(selected));
        });
        panel.querySelectorAll('.panel-view').forEach(view => {
          const selected = view.dataset.panelViewPanel === targetView;
          view.classList.toggle('is-active', selected);
          view.hidden = !selected;
        });
        const scroll = panel.querySelector('.panel-scroll');
        if (scroll) scroll.scrollTop = 0;
      });
    });
    // Gallery series filter
    panelWrap.querySelectorAll('.gallery-filter-bar').forEach(bar => {
      bar.addEventListener('click', event => {
        const btn = event.target.closest('.filter-btn');
        if (!btn) return;
        const filter = btn.dataset.filter;
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('is-active', b === btn));
        const grid = bar.nextElementSibling;
        if (grid) {
          grid.querySelectorAll('.art-card').forEach(card => {
            card.hidden = filter !== 'all' && card.dataset.series !== filter;
          });
        }
      });
    });

    // Lazy-load video thumbnails via IntersectionObserver
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const video = entry.target;
          if (entry.isIntersecting && !video.src && video.dataset.src) {
            video.src = video.dataset.src;
            video.preload = 'metadata';
            videoObserver.unobserve(video);
          }
        });
      }, { rootMargin: '300px' });
      panelWrap.querySelectorAll('.lazy-video').forEach(v => videoObserver.observe(v));
    } else {
      // Fallback: set src immediately
      panelWrap.querySelectorAll('.lazy-video').forEach(v => {
        if (v.dataset.src) { v.src = v.dataset.src; v.preload = 'metadata'; }
      });
    }

    // Image skeleton — mark loaded images immediately, others on load event
    panelWrap.querySelectorAll('.card-media').forEach(media => {
      if (media.tagName === 'IMG') {
        if (media.complete && media.naturalWidth) {
          media.classList.add('loaded');
        } else {
          media.addEventListener('load', () => media.classList.add('loaded'), { once: true });
          media.addEventListener('error', () => media.classList.add('loaded'), { once: true });
        }
      }
    });
  }

  function select(index, options = {}) {
    const next = Math.max(0, Math.min(sections.length - 1, index));
    const changed = next !== active;
    active = next;
    root.style.setProperty('--active', active);
    counter.textContent = String(active + 1).padStart(2, '0');

    document.querySelectorAll('.node').forEach((node, i) => {
      const selected = i === active;
      node.classList.toggle('is-active', selected);
      node.setAttribute('aria-selected', String(selected));
      node.tabIndex = selected ? 0 : -1;
    });

    document.querySelectorAll('.panel').forEach((panel, i) => {
      const selected = i === active;
      panel.classList.toggle('is-active', selected);
      panel.hidden = !selected;
      if (selected) {
        const scroll = panel.querySelector('.panel-scroll');
        if (scroll) scroll.scrollTop = 0;
      }
    });

    if (options.focus) {
      const node = document.querySelectorAll('.node')[active];
      if (node) node.focus({ preventScroll: true });
    }
    if (options.hash !== false && location.hash !== `#${slugs[active]}`) {
      history.replaceState(null, '', `#${slugs[active]}`);
    }
    const activeSec = sections[active];
    document.title = activeSec.pageTitle || `${activeSec.label} — Blue $nake Studio · blkck2.com`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', activeSec.pageDescription || activeSec.statement);
    if (changed && status) status.textContent = `${sections[active].label} selected`;
  }

  function getOrCreateModal() {
    let backdrop = document.querySelector('.modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      backdrop.setAttribute('role', 'dialog');
      backdrop.setAttribute('aria-modal', 'true');
      backdrop.setAttribute('aria-label', 'Detail view');
      backdrop.innerHTML = '<div class="modal"><button class="modal-close" type="button" aria-label="Close">Close ✕</button><div class="modal-content"></div></div>';
      document.body.appendChild(backdrop);

      function closeModal() {
        const video = backdrop.querySelector('video');
        if (video) { video.pause(); video.currentTime = 0; }
        backdrop.classList.remove('open');
        if (backdrop._trapHandler) {
          backdrop.removeEventListener('keydown', backdrop._trapHandler);
          backdrop._trapHandler = null;
        }
        if (lastFocused) { lastFocused.focus({ preventScroll: true }); lastFocused = null; }
      }

      backdrop.querySelector('.modal-close').addEventListener('click', closeModal);
      backdrop.addEventListener('click', event => { if (event.target === backdrop) closeModal(); });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
      });
      backdrop._close = closeModal;
    }
    return backdrop;
  }

  function activateModal(backdrop) {
    lastFocused = document.activeElement;
    backdrop.classList.add('open');

    const modalEl = backdrop.querySelector('.modal');
    const getFocusable = () => [...modalEl.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )];

    const focusable = getFocusable();
    if (focusable.length) focusable[0].focus({ preventScroll: true });

    function trapHandler(event) {
      if (event.key !== 'Tab' || !backdrop.classList.contains('open')) return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }

    if (backdrop._trapHandler) backdrop.removeEventListener('keydown', backdrop._trapHandler);
    backdrop._trapHandler = trapHandler;
    backdrop.addEventListener('keydown', trapHandler);
  }

  function openModal(item) {
    const backdrop = getOrCreateModal();
    const media = item.mediaType === 'video'
      ? `<video src="${escapeHtml(item.video)}" controls preload="metadata" playsinline></video>`
      : `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" />`;
    const downloadAction = item.series === 'Colouring Pages'
      ? '<div class="links-row"><a class="project-link" href="' + escapeHtml(item.image) + '" download>Download for printing</a></div>'
      : '';
    backdrop.querySelector('.modal-content').innerHTML = `
      ${media}
      <div class="modal-body">
        <div class="meta-line">${escapeHtml(item.series)} · ${escapeHtml(item.medium)} · ${escapeHtml(item.year)}</div>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.description)}</p>
        <div class="tags">${(item.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
        ${downloadAction}
      </div>
    `;
    activateModal(backdrop);
    if (item.mediaType === 'video') {
      const video = backdrop.querySelector('video');
      if (video) video.play().catch(() => {});
    }
  }

  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      select(active + 1, { focus: true });
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      select(active - 1, { focus: true });
    } else if (event.key === 'Home') {
      event.preventDefault();
      select(0, { focus: true });
    } else if (event.key === 'End') {
      event.preventDefault();
      select(sections.length - 1, { focus: true });
    }
  });

  stage.addEventListener('wheel', event => {
    if (Math.abs(event.deltaY) < 12 || wheelLocked) return;
    event.preventDefault();
    wheelLocked = true;
    select(active + Math.sign(event.deltaY));
    window.setTimeout(() => { wheelLocked = false; }, 430);
  }, { passive: false });

  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerStartY = event.clientY;
    pointerStartX = event.clientX;
  });

  stage.addEventListener('pointerup', event => {
    if (pointerStartY === null) return;
    const dy = event.clientY - pointerStartY;
    const dx = event.clientX - pointerStartX;
    pointerStartY = null;
    pointerStartX = null;
    if (Math.abs(dy) > 38 && Math.abs(dy) > Math.abs(dx) * .8) {
      select(active + (dy < 0 ? 1 : -1));
    }
  });

  stage.addEventListener('pointercancel', () => {
    pointerStartY = null;
    pointerStartX = null;
  });

  window.addEventListener('hashchange', () => {
    const index = slugs.indexOf(location.hash.slice(1));
    if (index >= 0) select(index, { hash: false });
  });

  function setupIntroFilm() {
    const intro = document.getElementById('intro-film');
    const video = document.getElementById('intro-video');
    const enter = document.getElementById('intro-enter');
    const sound = document.getElementById('intro-sound');
    if (!intro || !video || !enter || !sound) return;

    video.muted = false;
    video.volume = 1;
    sound.textContent = 'Sound on';
    sound.setAttribute('aria-pressed', 'true');

    const closeIntro = () => {
      intro.classList.add('is-leaving');
      window.setTimeout(() => {
        intro.hidden = true;
        video.pause();
      }, 650);
    };

    const startFilm = () => {
      video.play().catch(() => {
        video.pause();
        video.currentTime = 0;
        video.muted = false;
        sound.classList.add('needs-start');
        sound.textContent = 'Start with sound';
        sound.setAttribute('aria-pressed', 'false');
      });
    };

    enter.addEventListener('click', closeIntro);
    video.addEventListener('ended', closeIntro);
    sound.addEventListener('click', () => {
      if (sound.classList.contains('needs-start')) {
        sound.classList.remove('needs-start');
        video.muted = false;
        video.currentTime = 0;
        sound.textContent = 'Sound on';
        sound.setAttribute('aria-pressed', 'true');
        video.play().catch(() => {});
        return;
      }
      video.muted = !video.muted;
      sound.textContent = video.muted ? 'Sound off' : 'Sound on';
      sound.setAttribute('aria-pressed', String(!video.muted));
      if (video.paused) video.play().catch(() => {});
    });
    startFilm();
  }
  buildTree();
  buildPanels();
  select(active, { hash: location.hash.length > 1 });
  setupIntroFilm();

  // ─── Krishna Sanctum ──────────────────────────────────────────────────────────
  function setupKrishnaSanctum() {
    const sanctum  = document.getElementById('krishna-sanctum');
    const door     = document.getElementById('brand-mark-door');
    const closeBtn = document.getElementById('sanctum-close');
    if (!sanctum || !door) return;

    let lastFocused = null;

    function getFocusable() {
      return [...sanctum.querySelectorAll(
        'button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])'
      )];
    }

    function openSanctum() {
      lastFocused = document.activeElement;
      sanctum.removeAttribute('aria-hidden');
      sanctum.classList.add('is-open');
      setTimeout(() => { if (closeBtn) closeBtn.focus({ preventScroll: true }); }, 820);
      sanctum.addEventListener('keydown', trapFocus);
    }

    function closeSanctum() {
      sanctum.setAttribute('aria-hidden', 'true');
      sanctum.classList.remove('is-open');
      sanctum.removeEventListener('keydown', trapFocus);
      if (lastFocused) { lastFocused.focus({ preventScroll: true }); lastFocused = null; }
    }

    function trapFocus(e) {
      if (e.key !== 'Tab') return;
      const f = getFocusable();
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) {
        e.preventDefault(); f[f.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
        e.preventDefault(); f[0].focus();
      }
    }

    door.addEventListener('click', e => { e.stopPropagation(); openSanctum(); });
    door.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); openSanctum(); }
    });
    if (closeBtn) closeBtn.addEventListener('click', closeSanctum);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && sanctum.classList.contains('is-open')) closeSanctum();
    });
  }
  setupKrishnaSanctum();
})();
