// Emergency no-op service worker — rollback kill switch.
//
// When a shipped service worker (sw.js or i-ran-lego/sw.js) starts pinning
// visitors to stale HTML or JavaScript, copy this file over the offending
// worker at the SAME path, keep the same filename, and redeploy. It takes over
// immediately, deletes every cache the old worker created, unregisters itself,
// and reloads open tabs so the next load comes straight from the network.
//
// Because netlify.toml already serves */sw.js with
// `Cache-Control: public, max-age=0, must-revalidate`, the replacement is
// picked up on the next visit rather than being held by the HTTP cache.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
      await self.clients.claim();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => client.navigate(client.url));
      await self.registration.unregister();
    })()
  );
});

// Pass every request straight through to the network — cache nothing.
self.addEventListener('fetch', () => {});
