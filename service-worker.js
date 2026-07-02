const CACHE_NAME = 'jiksor-up-playstore-v4';
const FILES = ['./','./index.html','./manifest.webmanifest','./icon.svg','./privacy.html','./parent-guide.html','./game-easy/','./game-easy/index.html','./game-upgrade/','./game-upgrade/index.html'];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES).catch(() => undefined)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => undefined);
    return response;
  }).catch(() => caches.match(event.request)));
});
