const CACHE_NAME = 'accounting-app-v4';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './security.js',
  './forge.min.js',
  './html5-qrcode.min.js',
  './logo.png',
  './logo_option1.png',
  './logo_option2.png',
  './manifest.json'
];

// Install Service Worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch assets: Network-First strategy to ensure updates are delivered instantly
self.addEventListener('fetch', (event) => {
  // Only intercept local HTTP/S requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If it's a valid successful response, cache/update the file
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If network request fails (offline), fall back to cached copy
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
