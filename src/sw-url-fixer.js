/**
 * SERVICE WORKER - URL FIXER
 * 
 * This service worker intercepts ALL fetch requests and fixes malformed URLs
 * It runs at the browser level, BEFORE the JavaScript code executes
 * 
 * Even if the user doesn't refresh, this will fix URLs from cached code
 */

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installing - URL fixer active');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activated - taking control');
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim());
});

// Fetch event - intercept ALL network requests
self.addEventListener('fetch', (event) => {
  const request = event.request;
  let url = request.url;
  
  // Check if this is a predictions API call
  if (url.includes('/predictions/')) {
    let modified = false;
    
    // 🔒 FIX 1: Upgrade http:// to https://
    if (url.startsWith('http://')) {
      console.warn('[SW] Detected http:// request, upgrading to https://');
      console.warn('[SW] Original URL:', url);
      url = url.replace(/^http:\/\//, 'https://');
      modified = true;
    }
    
    // 🔒 FIX 2: Add missing /functions/v1/
    if (url.includes('supabase.co/make-server-ce1844e7') && !url.includes('/functions/v1/')) {
      console.warn('[SW] Detected missing /functions/v1/, adding it');
      console.warn('[SW] Original URL:', url);
      url = url.replace('/make-server-ce1844e7/', '/functions/v1/make-server-ce1844e7/');
      modified = true;
    }
    
    if (modified) {
      console.log('[SW] Fixed URL:', url);
      
      // Create a new request with the fixed URL
      const modifiedRequest = new Request(url, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer
      });
      
      // Fetch with the fixed request
      event.respondWith(fetch(modifiedRequest));
      return;
    }
  }
  
  // For non-predictions requests, just pass through
  event.respondWith(fetch(request));
});

console.log('[SW] URL Fixer Service Worker loaded');
