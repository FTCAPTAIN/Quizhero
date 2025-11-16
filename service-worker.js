const CACHE_NAME = 'quizhero-india-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx', // This will be the main JS bundle
];

// Install a service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache for pre-caching');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response. We don't want to cache errors.
            // Opaque responses (for cross-origin resources) don't have a status we can check, but we should cache them.
            if (!response || (response.status !== 200 && response.type !== 'opaque') ) {
              return response;
            }

            // Clone the response because it's a stream and can only be consumed once.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(() => {
            // If the network request fails, you could return a fallback page.
            // For now, we'll just let the browser handle the error.
        });
      })
  );
});


// Update a service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
