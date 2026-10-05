const CACHE_NAME = 'mr-andy-web-v1';
const OFFLINE_URL = '/offline.html';
const STATIC_FILES = [OFFLINE_URL, '/favicon.ico', '/fonts/dm-sans-latin.woff2', '/fonts/manrope-latin.woff2'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys
    .filter((key) => (key.startsWith('smart-laundry-pos-') || key.startsWith('mr-andy-web-')) && key !== CACHE_NAME)
    .map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }
  // Only public static resources are cached. Never retain customer or receipt responses.
  if (!/^\/(assets|fonts|images)\//.test(url.pathname) && url.pathname !== '/favicon.ico') return;
  event.respondWith(fetch(event.request).then((response) => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)));
    }
    return response;
  }).catch(() => caches.match(event.request).then((cached) => cached || Response.error())));
});
