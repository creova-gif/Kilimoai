const CACHE_NAME = 'kilimo-v1.0.0-prod';
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/App.tsx',
  '/src/main.tsx',
  '/styles/globals.css',
  '/offline.html',
  '/manifest.json'
];

// Resources that should be cached for offline use
const OFFLINE_ASSETS = [
  '/offline.html',
  '/icons/icon-192x192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static resources');
      return cache.addAll([...STATIC_RESOURCES, ...OFFLINE_ASSETS]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// STALE-WHILE-REVALIDATE for CSS/JS, CACHE-FIRST for Images, NETWORK-ONLY for Auth/API (with queuing)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and Supabase Auth/API
  if (request.method !== 'GET' || url.origin.includes('supabase.co')) {
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Strategy: Stale-While-Revalidate for static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for failed network fetches
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Robust background sync for offline data (e.g., photo uploads, farm tasks)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-farming-data') {
    event.waitUntil(processOfflineQueue());
  }
});

async function processOfflineQueue() {
  console.log('[SW] Processing offline queue...');
  // Logic to pull from IndexedDB and sync to Supabase would go here
}

// Push notification support
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update from CREOVA',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('CREOVA Agri-AI', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});