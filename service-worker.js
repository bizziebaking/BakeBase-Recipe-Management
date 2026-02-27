// BakeBase Service Worker v1.3
const CACHE_NAME = 'bakebase-v1.3';
const urlsToCache = [
  './',
  './index.html',
  './bakebase-v1.3.html',
  './manifest.json'
];

// Install service worker and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('BakeBase: Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('BakeBase: Cache failed', err);
      })
  );
  self.skipWaiting();
});

// Fetch files from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail, return offline page
        return caches.match('./');
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('BakeBase: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
