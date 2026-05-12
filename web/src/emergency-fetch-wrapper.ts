/**
 * =============================================================================
 * EMERGENCY FETCH WRAPPER - FORCES HTTPS ON ALL REQUESTS
 * =============================================================================
 * This wrapper intercepts ALL fetch calls and forces HTTPS protocol
 * Use this when browser cache is serving old code with http:// URLs
 * =============================================================================
 */

// Store original fetch before wrapping
const originalFetch = window.fetch;

// Create wrapped fetch that forces HTTPS
window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let url: string;
  
  // Extract URL from input
  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof URL) {
    url = input.toString();
  } else if (input instanceof Request) {
    url = input.url;
  } else {
    url = String(input);
  }
  
  // 🔒 FORCE HTTPS - Replace http:// with https://
  if (url.startsWith('http://')) {
    console.warn('⚠️ [FETCH WRAPPER] Detected http:// request, forcing https://');
    console.warn('   Original URL:', url);
    url = url.replace(/^http:\/\//, 'https://');
    console.warn('   Fixed URL:', url);
  }
  
  // 🔒 FORCE /functions/v1/ - Add if missing
  if (url.includes('supabase.co/make-server-ce1844e7') && !url.includes('/functions/v1/')) {
    console.warn('⚠️ [FETCH WRAPPER] Detected missing /functions/v1/, adding it');
    console.warn('   Original URL:', url);
    url = url.replace('/make-server-ce1844e7/', '/functions/v1/make-server-ce1844e7/');
    console.warn('   Fixed URL:', url);
  }
  
  // Log the final URL for debugging
  if (url.includes('predictions')) {
    console.log('🔍 [FETCH WRAPPER] Predictions API call:');
    console.log('   URL:', url);
    console.log('   Protocol:', url.startsWith('https://') ? '✅ HTTPS' : '❌ HTTP');
    console.log('   Has /functions/v1/:', url.includes('/functions/v1/') ? '✅ YES' : '❌ NO');
  }
  
  // Call original fetch with fixed URL
  return originalFetch(url, init);
};

console.log('🔒 [EMERGENCY] Fetch wrapper installed - all http:// will be upgraded to https://');
console.log('🔒 [EMERGENCY] Missing /functions/v1/ will be automatically added');

export {};
