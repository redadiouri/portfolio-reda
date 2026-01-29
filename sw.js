const CACHE_NAME = 'portfolio-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/img/reda-300.jpg',
  '/img/reda-600.jpg',
  '/img/reda-300.webp',
  '/img/reda-600.webp',
  '/img/maison-252.jpg',
  '/img/maison-504.jpg',
  '/img/maison-252.webp',
  '/img/maison-504.webp',
  '/img/mla-270.png',
  '/img/mla-540.png',
  '/img/mla-270.webp',
  '/img/mla-540.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      }).catch(() => cached);
    })
  );
});
