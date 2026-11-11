/* Real tracks only: the Neon Venom LP as hosted on the Black Wing Crew site,
   plus the I RAN, LEGO! master assembled by scripts/prepare-i-ran-lego.py at deploy.
   Add a track by appending an object; src must be a real, playable audio URL. */
(function (root) {
  var tracks = [
  {
    "n": "01",
    "title": "Earth Heart Eater Lullaby",
    "mood": "dark lullaby / gothic ambient",
    "src": "https://blackwingcrew.netlify.app/public/audio/01-earth-heart-eater-lullaby.mp3",
    "cover": "https://blackwingcrew.netlify.app/public/covers/01-earth-heart-eater-lullaby.jpg",
    "album": "Neon Venom",
    "artist": "Black Wing Crew"
  },
  {
    "n": "02",
    "title": "Earth Heart Eater",
    "mood": "ritual bass / earth-core myth",
    "src": "https://blackwingcrew.netlify.app/public/audio/02-earth-heart-eater.mp3",
    "cover": "https://blackwingcrew.netlify.app/public/covers/02-earth-heart-eater.jpg",
    "album": "Neon Venom",
    "artist": "Black Wing Crew"
  },
  {
    "n": "03",
    "title": "The Whisper Recursion",
    "mood": "spoken recursion / cyber-oracle",
    "src": "https://blackwingcrew.netlify.app/public/audio/03-the-whisper-recursion.mp3",
    "cover": "https://blackwingcrew.netlify.app/public/covers/03-the-whisper-recursion.jpg",
    "album": "Neon Venom",
    "artist": "Black Wing Crew"
  },
  {
    "n": "04",
    "title": "Word Beneath the Sky",
    "mood": "black-sky ballad / prophetic drone",
    "src": "https://blackwingcrew.netlify.app/public/audio/04-word-beneath-the-sky.mp3",
    "cover": "https://blackwingcrew.netlify.app/public/covers/04-word-beneath-the-sky.jpg",
    "album": "Neon Venom",
    "artist": "Black Wing Crew"
  },
  {
    "n": "05",
    "title": "Word Above the Sky",
    "mood": "skyward hymn / luminous decay",
    "src": "https://blackwingcrew.netlify.app/public/audio/05-word-above-the-sky.mp3",
    "cover": "https://blackwingcrew.netlify.app/public/covers/05-word-above-the-sky.jpg",
    "album": "Neon Venom",
    "artist": "Black Wing Crew"
  },
  {
    "n": "06",
    "title": "Velvet Lie Sky",
    "mood": "velvet synth noir / beautiful deception",
    "src": "https://blackwingcrew.netlify.app/public/audio/06-velvet-lie-sky.mp3",
    "cover": "https://blackwingcrew.netlify.app/public/covers/06-velvet-lie-sky.jpg",
    "album": "Neon Venom",
    "artist": "Black Wing Crew"
  },
  {
    "n": "07",
    "title": "Mask Beneath the Sky",
    "mood": "mask ritual / surveillance pulse",
    "src": "https://blackwingcrew.netlify.app/public/audio/07-mask-beneath-the-sky.mp3",
    "cover": "https://blackwingcrew.netlify.app/public/covers/07-mask-beneath-the-sky.jpg",
    "album": "Neon Venom",
    "artist": "Black Wing Crew"
  },
  {
    "n": "08",
    "title": "Neon Beach Heartbreak",
    "mood": "neon beach heartbreak / synthwave noir",
    "src": "https://blackwingcrew.netlify.app/public/audio/08-neon-beach-heartbreak.mp3",
    "cover": "https://blackwingcrew.netlify.app/public/covers/08-neon-beach-heartbreak.jpg",
    "album": "Neon Venom",
    "artist": "Black Wing Crew"
  },
  {
    "n": "09",
    "title": "Who Dares Wins",
    "mood": "daring anthem / storm-march energy",
    "src": "https://blackwingcrew.netlify.app/public/audio/09-who-dares-wins.mp3",
    "cover": "https://blackwingcrew.netlify.app/public/covers/09-who-dares-wins.jpg",
    "album": "Neon Venom",
    "artist": "Black Wing Crew"
  },
  {
    "n": "10",
    "title": "By Listening, You Agree",
    "mood": "consent-techno / memetic advisory",
    "src": "https://blackwingcrew.netlify.app/public/audio/10-by-listening-you-agree.mp3",
    "cover": "https://blackwingcrew.netlify.app/public/covers/10-by-listening-you-agree.jpg",
    "album": "Neon Venom",
    "artist": "Black Wing Crew"
  },
  {
    "n": "—",
    "title": "I RAN, LEGO!",
    "mood": "living book / full master",
    "src": "/i-ran-lego/assets/audio/I_RAN_LEGO_MASTER.mp3",
    "cover": "",
    "album": "I RAN, LEGO! Living Book",
    "artist": "Blue $nake Studio",
    "page": "/i-ran-lego/"
  }
];
  if (typeof module !== 'undefined' && module.exports) module.exports = tracks; else root.BSS_TRACKS = tracks;
})(typeof window !== 'undefined' ? window : this);
