const CACHE_NAME = 'moss-tree-v10-print-vault-tracker';

const APP_SHELL = [
  './',
  './index.html',
  './start-here.html',
  './start.html',
  './proof-wall.html',
  './print.html',
  './strongman-tracker.html',
  './site-health.html',
  './qr-portal.html',
  './press-kit.html',
  './field-guide.html',
  './black-wing-crew.html',
  './meta-pet.html',
  './teacher-tools.html',
  './404.html',
  './styles.css',
  './script.js',
  './data/gallery-items.js',
  './downloads/black-wing-crew-lyric-sheet.html',
  './downloads/metapet-starter-sheet.html',
  './downloads/moss-60-glyph-sheet.html',
  './downloads/bss-colouring-page.html',
  './downloads/qr-poster-drop.html',
  './downloads/bss-proof-wall.html',
  './apps/moss60-oracle-warden.html',
  './privacy-policy.html',
  './gov.html',
  './documents/oss-734g-known-unknowns-register.html',
  './documents/butterfly-symmetry-final-loop.pdf',
  './documents/victorian-statesman-recursive-lullaby.pdf',
  './sitemap.xml',
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

  const normalizedPath = `.${url.pathname}`;
  const isShell = APP_SHELL.some(path => {
    const shellPath = path === './' ? './index.html' : path;
    return normalizedPath === shellPath || url.pathname.endsWith(shellPath.replace('./', '/'));
  });
  const isMedia = /\.(mp4|webm|mov)$/i.test(url.pathname);

  if (isMedia) {
    // Network-only for video — avoid filling cache with large files.
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
    // Network-first for app shell files so deploys reveal new print/tracker pages quickly.
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Stale-while-revalidate for everything else (images, small assets).
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
