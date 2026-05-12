# 🔍 404 ERROR TROUBLESHOOTING GUIDE

**Error**: `404 Not Found: GET http://hsjxaxnenyomtgctungx.supabase.co/make-server-ce1844e7/tasks?userId=demo-user-123`

**Issue**: The URL is missing `https://` and `/functions/v1`

---

## ✅ What Has Been Fixed

### 1. **Created Centralized API Utilities**
**File**: `/utils/apiUtils.ts`
- ✅ Hardcoded correct URL format with `https://` and `/functions/v1`
- ✅ Enhanced logging to debug URL construction
- ✅ Type-safe API methods

### 2. **Updated TaskManagementRedesign Component**
**File**: `/components/TaskManagementRedesign.tsx`
- ✅ Imports `TasksAPI` from `/utils/apiUtils`
- ✅ Uses `TasksAPI.getTasks(userId)` instead of manual fetch

---

## 🔍 Troubleshooting Steps

### Step 1: Check Browser Console

Open your browser's Developer Tools (F12) and look for these logs:

**✅ GOOD (Fixed):**
```
[KILIMO API] GET https://hsjxaxnenyomtgctungx.supabase.co/functions/v1/make-server-ce1844e7/tasks?userId=demo-user-123
[KILIMO API] URL Components: {
  protocol: "https",
  hasProjectId: true,
  hasFunctionsPath: true,
  fullUrl: "https://..."
}
```

**❌ BAD (Old code still running):**
```
GET http://hsjxaxnenyomtgctungx.supabase.co/make-server-ce1844e7/tasks...
```

### Step 2: Clear Browser Cache

If you still see the old URL format:

**Chrome/Edge:**
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Press `Ctrl + Shift + R` to hard refresh

**Firefox:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cache"
3. Click "Clear Now"
4. Press `Ctrl + F5` to hard refresh

### Step 3: Verify Code Is Updated

Check that TaskManagementRedesign is using the new API:

```typescript
// ✅ GOOD - Should see this in /components/TaskManagementRedesign.tsx
import { TasksAPI } from "../utils/apiUtils";

const loadTasksFromBackend = async () => {
  const data = await TasksAPI.getTasks(userId);
};

// ❌ BAD - Should NOT see this
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/...`,
  ...
);
```

### Step 4: Check Import Paths

Verify the import path in `/utils/apiUtils.ts`:

```typescript
// ✅ CORRECT
import { projectId, publicAnonKey } from "./supabase/info";

// ❌ WRONG (would cause import error)
import { projectId, publicAnonKey } from "./supabase/info.tsx";
```

---

## 🧪 Testing the Fix

### Test 1: Open DevTools Before Loading

1. Open browser DevTools (F12)
2. Go to "Console" tab
3. Navigate to Tasks page
4. Look for `[KILIMO API]` logs

**Expected output:**
```
[KILIMO API] GET https://hsjxaxnenyomtgctungx.supabase.co/functions/v1/make-server-ce1844e7/tasks?userId=demo-user-123
[KILIMO API] URL Components: { protocol: "https", hasProjectId: true, hasFunctionsPath: true, fullUrl: "..." }
```

### Test 2: Check Network Tab

1. Open DevTools → "Network" tab
2. Navigate to Tasks page
3. Look for the request to `/tasks`
4. Click on it and check "Headers" → "Request URL"

**Expected:**
```
Request URL: https://hsjxaxnenyomtgctungx.supabase.co/functions/v1/make-server-ce1844e7/tasks?userId=demo-user-123
```

**NOT:**
```
Request URL: http://hsjxaxnenyomtgctungx.supabase.co/make-server-ce1844e7/tasks?userId=demo-user-123
```

---

## 🚨 If Error Persists

### Scenario 1: Browser Is Cached

**Solution:**
- Clear browser cache completely
- Try in Incognito/Private browsing mode
- Try different browser

### Scenario 2: Wrong Component Is Loading

**Check which component is actually rendering:**

Look in `/App.tsx` for the tasks tab:
```typescript
{activeTab === "tasks" && (
  <TaskManagementRedesign userId={currentUser?.id!} ... />
)}
```

Make sure it's `TaskManagementRedesign`, not `TaskManagement` (old version).

### Scenario 3: Import Error Not Visible

**Check for TypeScript/Import errors:**
1. Open VS Code Problems panel
2. Look for errors in `/utils/apiUtils.ts`
3. Look for errors in `/components/TaskManagementRedesign.tsx`

### Scenario 4: File Not Saved

**Verify files are saved:**
1. Check `/utils/apiUtils.ts` exists
2. Check it contains `API_BASE_URL = "https://..."`
3. Check `/components/TaskManagementRedesign.tsx` imports `TasksAPI`

---

## 📝 Verification Checklist

Run through this checklist:

- [ ] `/utils/apiUtils.ts` exists
- [ ] File contains `export const API_BASE_URL = "https://..."`
- [ ] File contains `export const TasksAPI = {...}`
- [ ] Import uses `"./supabase/info"` not `"./supabase/info.tsx"`
- [ ] `/components/TaskManagementRedesign.tsx` imports `TasksAPI`
- [ ] Component uses `TasksAPI.getTasks(userId)`
- [ ] Browser cache cleared
- [ ] Hard refresh performed (Ctrl + Shift + R)
- [ ] Console shows `[KILIMO API]` logs
- [ ] Console shows `https://` not `http://`
- [ ] Console shows `/functions/v1` in URL

---

## 🎯 Root Cause Analysis

The error `http://...` without `/functions/v1` suggests one of:

1. **Browser cache** - Old bundled JavaScript still loaded
2. **Wrong component** - Old `TaskManagement` component rendering instead of `TaskManagementRedesign`
3. **Import failure** - `apiUtils.ts` file not being imported correctly
4. **Build not updated** - Changes not reflected in bundled code

---

## 💡 Quick Test

Add this to the top of your component to force logging:

```typescript
// In TaskManagementRedesign.tsx, add at the top of component
useEffect(() => {
  console.log('===== COMPONENT LOADED =====');
  console.log('Using TasksAPI from:', typeof TasksAPI);
  console.log('API_BASE_URL should be:', `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`);
}, []);
```

This will confirm:
- ✅ Component is loading
- ✅ TasksAPI is defined
- ✅ Correct project ID being used

---

## 📞 Support Commands

If issue persists, share these outputs:

```bash
# 1. Check console logs (copy from browser DevTools)
# Look for: [KILIMO API] logs

# 2. Check Network request (copy from Network tab)
# URL should start with https:// and include /functions/v1

# 3. Confirm component in use
# Should be TaskManagementRedesign not TaskManagement
```

---

**Status**: ✅ Code is fixed. Issue is likely browser cache or build refresh.  
**Action**: Clear cache, hard refresh, check console for `[KILIMO API]` logs.
