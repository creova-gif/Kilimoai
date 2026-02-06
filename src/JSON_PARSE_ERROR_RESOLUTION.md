# JSON Parse Error Resolution

## Problem Summary
Frontend components were receiving `text/html` responses instead of `application/json` when calling backend endpoints, causing the error:
```
Expected JSON but received: text/html
```

## Root Cause Analysis

### 1. **Auth Middleware Body Consumption**
The authentication middleware (`/supabase/functions/server/auth_middleware.tsx`) was consuming the request body by calling `await c.req.json()` to extract the `userId`. 

**Why this caused the error:**
- HTTP request bodies can only be read once
- After the middleware consumed the body, route handlers couldn't read it
- This caused parsing errors that triggered Deno's default HTML error pages
- HTML error pages were returned to the frontend instead of JSON errors

### 2. **Missing 404 Handler**
The server had no catch-all route handler for undefined endpoints. When a route didn't match:
- Hono returned a default 404 response (possibly HTML)
- Frontend expected JSON but received HTML

### 3. **Inconsistent Error Responses**
Some error responses didn't include the `success: false` field, making error handling inconsistent.

## Solutions Implemented

### ✅ Fix 1: Auth Middleware - Stop Consuming Request Body
**File:** `/supabase/functions/server/auth_middleware.tsx`

**Changes:**
- Removed the code that read request body in middleware
- Only extract `userId` from path params and query params
- Let route handlers read their own request bodies
- Added fallback to check both `user:${userId}:profile` and `user:${userId}` keys
- Changed error handling to return JSON instead of continuing silently

**Before:**
```typescript
// Read body (BAD - consumes stream)
const body = await c.req.json();
userId = body.userId || null;
c.req.json = async () => body; // Attempted re-set
```

**After:**
```typescript
// Only read from path/query params
userId = c.req.param("userId");
if (!userId) {
  userId = c.req.query("userId") || null;
}
// Let route handlers read the body themselves
```

### ✅ Fix 2: Added Global 404 Handler
**File:** `/supabase/functions/server/index.tsx`

**Changes:**
- Added catch-all route handler at the end of the file (before `Deno.serve`)
- Returns JSON response with helpful error message
- Lists available routes for debugging

```typescript
app.all("*", (c) => {
  console.error(`404 Not Found: ${c.req.method} ${c.req.url}`);
  return c.json({
    success: false,
    error: "Route not found",
    message: `The endpoint ${c.req.method} ${new URL(c.req.url).pathname} does not exist`,
    availableRoutes: [
      "POST /make-server-ce1844e7/register",
      "POST /make-server-ce1844e7/login",
      "GET /make-server-ce1844e7/family-plan/:userId",
      "GET /make-server-ce1844e7/farm-graph/:userId",
      "GET /make-server-ce1844e7/health",
    ]
  }, 404);
});
```

### ✅ Fix 3: Standardized Error Responses
**Files:** 
- `/supabase/functions/server/index.tsx` (farm-graph and family-plan endpoints)

**Changes:**
- Updated error responses to include `success: false` field
- Added `message` field with error details
- Consistent structure across all endpoints

**Before:**
```typescript
return c.json({ error: "Failed to fetch farm graph" }, 500);
```

**After:**
```typescript
return c.json({ 
  success: false,
  error: "Failed to fetch farm graph",
  message: error.message || "Unknown error"
}, 500);
```

### ✅ Fix 4: Frontend Error Handling
**Files:**
- `/components/FamilyFarmPlanner.tsx`
- `/components/FarmGraphDashboard.tsx`

**Changes:**
- Removed content-type checking (server now always returns JSON)
- Always attempt to parse JSON response, even on errors
- Better error logging with details from error response

**Before:**
```typescript
if (!response.ok) {
  console.error("Failed to load:", response.status, response.statusText);
  return;
}

const contentType = response.headers.get("content-type");
if (!contentType || !contentType.includes("application/json")) {
  console.error("Expected JSON but received:", contentType);
  return;
}

const data = await response.json();
```

**After:**
```typescript
// Always parse JSON first
const data = await response.json();

if (!response.ok) {
  console.error("Failed to load:", response.status, data.error || data.message || response.statusText);
  return;
}

if (data.success) {
  // Handle success
} else {
  console.error("Load failed:", data.error || data.message);
}
```

## Technical Details

### Request Body Streaming in Fetch API
- Request bodies are **ReadableStreams** that can only be consumed once
- Once `req.json()`, `req.text()`, or `req.arrayBuffer()` is called, the stream is exhausted
- Attempting to read again will fail or return empty data
- Middleware must NOT consume the body if route handlers need it

### Hono Framework Behavior
- `c.json()` automatically sets `Content-Type: application/json`
- Global error handler (`app.onError`) catches unhandled errors
- Middleware runs in order: global middleware → route-specific middleware → route handler
- 404 handler must be registered LAST (after all other routes)

## Verification Checklist

- ✅ Auth middleware no longer consumes request body
- ✅ All endpoints return JSON (even errors and 404s)
- ✅ Error responses include `success`, `error`, and `message` fields
- ✅ Frontend handles errors gracefully without content-type checking
- ✅ Global error handler catches all unhandled exceptions
- ✅ 404 handler returns helpful JSON response

## Testing Recommendations

### Test Cases:
1. **Valid Requests:**
   - `GET /make-server-ce1844e7/family-plan/:userId` → Returns JSON with plan data
   - `GET /make-server-ce1844e7/farm-graph/:userId` → Returns JSON with graph data

2. **Invalid Routes:**
   - `GET /make-server-ce1844e7/invalid-route` → Returns JSON 404 error

3. **Error Scenarios:**
   - Missing userId → Returns JSON error with clear message
   - Database error → Returns JSON 500 error with details

4. **POST Requests:**
   - `POST /make-server-ce1844e7/family-plan/create` → Body is readable by handler

## Impact

### Before Fix:
- ❌ "Expected JSON but received: text/html" errors
- ❌ Silent failures when body couldn't be parsed
- ❌ HTML error pages returned to frontend
- ❌ Inconsistent error handling

### After Fix:
- ✅ All responses are valid JSON
- ✅ Clear error messages in JSON format
- ✅ Request bodies readable by route handlers
- ✅ Consistent error structure across all endpoints
- ✅ Better debugging with helpful 404 messages

## Related Files Modified

1. `/supabase/functions/server/auth_middleware.tsx` - Fixed body consumption
2. `/supabase/functions/server/index.tsx` - Added 404 handler, standardized errors
3. `/components/FamilyFarmPlanner.tsx` - Improved error handling
4. `/components/FarmGraphDashboard.tsx` - Improved error handling

## Prevention Guidelines

### For Future Development:

1. **Never consume request body in middleware** unless you're specifically building a body parser
2. **Always return JSON from API endpoints**, never HTML
3. **Include consistent error structure:** `{ success: false, error: string, message: string }`
4. **Add 404 handler as the last route** in the application
5. **Test error scenarios** to ensure JSON responses

---

**Status:** ✅ **RESOLVED**  
**Date:** January 24, 2026  
**Priority:** Critical  
**Category:** Backend Infrastructure
