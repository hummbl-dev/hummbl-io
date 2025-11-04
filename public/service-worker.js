// Service Worker for PWA support and offline functionality

const CACHE_VERSION = 'hummbl-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const DATA_CACHE = `${CACHE_VERSION}-data`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Static assets to cache immediately on install
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json', '/favicon.ico'];

// Maximum cache size for dynamic content
const MAX_CACHE_SIZE = 100;

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.warn('[SW] Failed to cache some static assets:', error);
      });
    })
  );

  self.skipWaiting();
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('hummbl-') && !name.startsWith(CACHE_VERSION))
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );

  self.clients.claim();
});

/**
 * Fetch event - smart caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip cross-origin requests (unless same-origin policy allows)
  if (url.origin !== location.origin && !url.pathname.startsWith('/api')) {
    return;
  }

  // Handle different resource types with appropriate strategies

  // 1. Static assets (JS, CSS, images) - Cache first with network fallback
  if (
    url.pathname.startsWith('/assets/') ||
    /\.(js|css|woff2|woff|ttf|eot|png|jpg|jpeg|gif|svg|webp|ico)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // 2. Data files (JSON) - Stale-while-revalidate strategy
  if (url.pathname.includes('/data/') || url.pathname.endsWith('.json')) {
    event.respondWith(staleWhileRevalidate(request, DATA_CACHE));
    return;
  }

  // 3. HTML pages - Network first with cache fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // 4. API requests - Network first with cache fallback (short TTL)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE, 60000)); // 1 minute cache
    return;
  }

  // 5. Default: Network first with cache fallback
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

/**
 * Cache First Strategy - Best for static assets
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const responseClone = response.clone();
      cache.put(request, responseClone).catch(() => {
        // Ignore cache errors
      });
      limitCacheSize(cacheName, MAX_CACHE_SIZE);
    }
    return response;
  } catch (error) {
    // Return offline page or error response
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Network First Strategy - Best for dynamic content
 */
async function networkFirst(request, cacheName, maxAge = 3600000) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);

    if (response.ok) {
      const responseClone = response.clone();
      cache.put(request, responseClone).catch(() => {
        // Ignore cache errors
      });
      limitCacheSize(cacheName, MAX_CACHE_SIZE);

      // Set expiration
      if (maxAge < 3600000) {
        setTimeout(() => {
          cache.delete(request).catch(() => {});
        }, maxAge);
      }
    }

    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Stale-While-Revalidate Strategy - Best for data that can be stale
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Start fetching in the background
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const responseClone = response.clone();
        cache.put(request, responseClone).catch(() => {});
        limitCacheSize(cacheName, MAX_CACHE_SIZE);
      }
      return response;
    })
    .catch(() => {
      // Network failed, will use cache if available
    });

  // Return cached version immediately, update in background
  if (cached) {
    fetchPromise.catch(() => {}); // Don't wait for fetch
    return cached;
  }

  // No cache, wait for network
  return fetchPromise.catch(() => new Response('Offline', { status: 503 }));
}

/**
 * Message event - handle commands from clients
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((name) => caches.delete(name)));
      })
    );
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(urls);
      })
    );
  }
});

/**
 * Limit cache size by removing oldest entries
 */
function limitCacheSize(cacheName, maxSize) {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxSize) {
        cache.delete(keys[0]).then(() => {
          limitCacheSize(cacheName, maxSize);
        });
      }
    });
  });
}

/**
 * Background sync for offline actions
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-notes') {
    event.waitUntil(
      // This would sync queued notes when online
      Promise.resolve()
    );
  }
});

/**
 * Push notification support (for future use)
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    tag: 'hummbl-notification',
  };

  event.waitUntil(self.registration.showNotification('HUMMBL', options));
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
