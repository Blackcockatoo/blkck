const CACHE_NAME = 'moss-tree-v11';

const APP_SHELL = [
  './',
  './index.html',
  './start-here.html',
  './404.html',
  './styles.css',
  './script.js',
  './data/gallery-items.js',
  './data/studio-sections.js',
  './print.html',
  './downloads/black-wing-crew-lyric-sheet.html',
  './downloads/metapet-starter-sheet.html',
  './downloads/moss-60-glyph-sheet.html',
  './downloads/bss-colouring-page.html',
  './downloads/qr-poster-drop.html',
  './downloads/bss-proof-wall.html',
  './apps/bs-word-cube.html',
  './apps/moss60-oracle-warden.html',
  './documents/oss-734g-known-unknowns-register.html',
  './documents/butterfly-symmetry-final-loop.pdf',
  './documents/victorian-statesman-recursive-lullaby.pdf',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable.svg',
  './icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] install cache error', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isShell = APP_SHELL.some(path => url.pathname.endsWith(path.replace('./', '/')));
  const isMedia = /\.(mp4|webm|mov)$/i.test(url.pathname);

  if (isMedia) {
    // Network-only for video — avoid filling cache with large files
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
          return response;
        })
        .catch(() =>
          caches.match(request).then(cached => cached || caches.match('./index.html'))
        )
    );
    return;
  }

  if (isShell) {
    // Cache-first for app shell files
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
          }
          return response;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for everything else (images, assets)
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(request).then(cached => {
        const fresh = fetch(request).then(response => {
          if (response.ok) cache.put(request, response.clone()).catch(() => {});
          return response;
        }).catch(() => cached);
        return cached || fresh;
      })
    )
  );
});
