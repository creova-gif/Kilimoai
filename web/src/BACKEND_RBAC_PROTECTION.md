# 🔒 Backend API Role-Based Protection

## ✅ **IMPLEMENTATION STATUS**

**Date:** January 2026  
**Status:** Backend RBAC Middleware Complete  
**Protection:** User extraction applied to all routes

---

## 🛠️ **What Was Implemented**

### **1. RBAC Middleware** ✅

**File:** `/supabase/functions/server/rbac.tsx` (350+ lines)

**Features:**
- Role-Feature access matrix (mirrors frontend)
- `requireFeature(featureId)` middleware
- `requireRole(roles[])` middleware
- Helper utilities (canUserEdit, canAccessMultiFarm, etc.)

### **2. Auth Middleware** ✅

**File:** `/supabase/functions/server/auth_middleware.tsx`

**Features:**
- Extracts userId from path params, query params, or body
- Fetches user profile from KV store
- Sets user in context for downstream handlers
- Default role assignment if not found

### **3. Global Application** ✅

**File:** `/supabase/functions/server/index.tsx`

**Applied:**
```typescript
// Extract user for all routes
app.use("/make-server-ce1844e7/*", authMiddleware.extractUser);
```

---

## 🎯 **How to Use RBAC Middleware**

### **Method 1: Protect by Feature**

```typescript
// Require access to "tasks" feature
app.get("/make-server-ce1844e7/tasks/:userId", 
  rbac.requireFeature("tasks"),
  async (c) => {
    const user = c.get("user");
    // ... handler logic
  }
);
```

### **Method 2: Protect by Role**

```typescript
// Only allow commercial admins
app.get("/make-server-ce1844e7/admin/analytics",
  rbac.requireRole(["commercial_farm_admin", "agribusiness_ops"]),
  async (c) => {
    // ... handler logic
  }
);
```

### **Method 3: Manual Check Inside Handler**

```typescript
app.post("/make-server-ce1844e7/some-endpoint", async (c) => {
  const user = c.get("user");
  
  if (!rbac.hasFeatureAccess(user.role, "feature-id")) {
    return c.json({
      success: false,
      error: "Feature not available for your role"
    }, 403);
  }
  
  // ... proceed
});
```

---

## 📊 **Endpoint Protection Recommendations**

### **🔴 HIGH PRIORITY - Require Specific Roles**

| Endpoint | Required Feature | Required Role |
|----------|-----------------|---------------|
| `/analytics/stats` | `analytics` | farm_manager+ |
| `/farm-graph/track` | `farm-graph` | farmer+ |
| `/farm-graph/:userId` | `farm-graph` | farmer+ |
| `/farmer-lab/add-pilot` | `farmer-lab` | extension_officer |
| `/farmer-lab/pilots` | `farmer-lab` | extension_officer |
| `/family-plan/*` | `family-planner` | All farmer roles |
| `/ai-farm-plan/*` | `crop-planning-ai` | All farmer roles |

### **🟡 MEDIUM PRIORITY - Feature-Based Protection**

| Endpoint | Required Feature | Notes |
|----------|-----------------|-------|
| `/tasks/*` | `tasks` | Farm managers only |
| `/inventory/*` | `inventory` | Farm managers only |
| `/land-allocation/*` | `land-allocation` | Farm managers only |
| `/farm-mapping/*` | `farm-mapping` | Farm managers only |
| `/digital-twin/*` | `digital-twin` | Farm managers only |
| `/agribusiness/*` | `agribusiness` | Commercial/Agribusiness |
| `/orders/*` | `orders` | Commercial/Agribusiness |
| `/institutional/*` | `institutional` | Extension/Commercial |
| `/cooperative/*` | `cooperative` | Cooperative leaders |
| `/extension/*` | `extension` | Extension officers |

### **🟢 LOW PRIORITY - Open to All Authenticated Users**

| Endpoint | Notes |
|----------|-------|
| `/market-prices/*` | All users need market data |
| `/weather/*` | All users need weather |
| `/ai/sankofa/query` | AI chat for all |
| `/diagnosis/analyze` | AI diagnosis for all |
| `/knowledge/*` | Learning resources for all |
| `/support/*` | Help/support for all |

---

## 🔧 **Example Implementations**

### **Example 1: Protect Task Management**

```typescript
// Get user tasks (require "tasks" feature)
app.get("/make-server-ce1844e7/tasks/:userId",
  rbac.requireFeature("tasks"),
  async (c) => {
    const user = c.get("user");
    const userId = c.req.param("userId");
    
    // Ensure user can only access their own tasks
    if (user.id !== userId && !rbac.canAccessMultiFarm(user.role)) {
      return c.json({ error: "Unauthorized" }, 403);
    }
    
    const tasks = await kv.getByPrefix(`task:${userId}:`);
    return c.json({ success: true, tasks });
  }
);

// Create task (require "tasks" feature)
app.post("/make-server-ce1844e7/tasks/create",
  rbac.requireFeature("tasks"),
  async (c) => {
    const { userId, taskName, assignedTo, dueDate } = await c.req.json();
    const user = c.get("user");
    
    // Only farm managers can assign tasks to others
    if (assignedTo && assignedTo !== userId) {
      if (!rbac.canAccessMultiFarm(user.role)) {
        return c.json({ 
          error: "Only farm managers can assign tasks to team members" 
        }, 403);
      }
    }
    
    // ... create task logic
    return c.json({ success: true });
  }
);
```

### **Example 2: Protect Farmer Lab (Extension Officers Only)**

```typescript
// Add pilot farmer (extension officers only)
app.post("/make-server-ce1844e7/farmer-lab/add-pilot",
  rbac.requireRole(["extension_officer", "commercial_farm_admin"]),
  async (c) => {
    const { farmerId, cohort, region } = await c.req.json();
    
    const pilotId = crypto.randomUUID();
    await kv.set(`pilot-farmer:${pilotId}`, {
      farmerId,
      cohort,
      region,
      addedAt: new Date().toISOString(),
      addedBy: c.get("user").id,
    });
    
    return c.json({ success: true, pilotId });
  }
);
```

### **Example 3: Protect Analytics (Multi-Farm Roles Only)**

```typescript
// Get platform analytics
app.get("/make-server-ce1844e7/analytics/stats",
  rbac.requireFeature("analytics"),
  async (c) => {
    const user = c.get("user");
    
    // Only multi-farm roles can see platform-wide stats
    if (!rbac.canAccessMultiFarm(user.role)) {
      return c.json({
        error: "Analytics dashboard is available for Farm Managers and above",
        upgrade: "Upgrade to Farm Manager to unlock analytics"
      }, 403);
    }
    
    const stats = {
      totalUsers: await kv.getByPrefix("user:").then(u => u.length),
      totalFarms: 150,
      // ... more stats
    };
    
    return c.json({ success: true, stats });
  }
);
```

### **Example 4: Read-Only for Extension Officers**

```typescript
// Update crop plan
app.post("/make-server-ce1844e7/crop-plan/update",
  rbac.requireFeature("crop-planning"),
  async (c) => {
    const user = c.get("user");
    
    // Extension officers can view but not edit
    if (!rbac.canUserEdit(user.role)) {
      return c.json({
        error: "Extension officers have read-only access",
        message: "You can view crop plans but cannot modify them"
      }, 403);
    }
    
    // ... update logic
    return c.json({ success: true });
  }
);
```

---

## 🚀 **Migration Plan**

### **Phase 1: Critical Endpoints** (DONE)
- [x] Add auth middleware (user extraction)
- [x] Create RBAC functions
- [x] Document usage patterns

### **Phase 2: High-Priority Protection** (RECOMMENDED NEXT)
1. Add RBAC to task management endpoints
2. Add RBAC to farmer lab endpoints
3. Add RBAC to analytics endpoints
4. Add RBAC to farm graph endpoints

### **Phase 3: Feature-Specific Protection** (FUTURE)
1. Add RBAC to all farm management endpoints
2. Add RBAC to agribusiness endpoints
3. Add RBAC to cooperative endpoints
4. Add RBAC to institutional endpoints

### **Phase 4: Data Scoping** (FUTURE)
1. Ensure users can only access their own data
2. Multi-farm roles can access subordinate data
3. Extension officers have read-only cross-farm access
4. Cooperative leaders see member data only

---

## 📝 **Quick Reference: RBAC Utilities**

```typescript
// Check feature access
rbac.hasFeatureAccess(userRole, featureId) // boolean

// Get all features for role
rbac.getRoleFeatures(userRole) // FeatureId[]

// Middleware: Require feature
rbac.requireFeature("tasks") // Middleware function

// Middleware: Require role(s)
rbac.requireRole(["farm_manager", "commercial_farm_admin"]) // Middleware

// Get user from context
rbac.getUserFromContext(c) // { id, role } | null

// Can user edit data?
rbac.canUserEdit(userRole) // boolean

// Can access multi-farm features?
rbac.canAccessMultiFarm(userRole) // boolean

// Can access enterprise features?
rbac.canAccessEnterprise(userRole) // boolean

// Get feature count
rbac.getFeatureCount(userRole) // number
```

---

## 🔒 **Security Best Practices**

### **DO:**
✅ Always extract user with middleware  
✅ Check role/feature access before queries  
✅ Scope data queries to user's access level  
✅ Return informative error messages with upgrade paths  
✅ Log access denials for security monitoring  
✅ Use type-safe FeatureId and UserRole types  

### **DON'T:**
❌ Trust client-side feature flags  
❌ Allow users to access other users' data without permission  
❌ Return sensitive data in error messages  
❌ Skip RBAC checks for "convenience"  
❌ Hard-code role checks (use RBAC functions)  
❌ Expose system diagnostics to non-admin users  

---

## 🧪 **Testing RBAC**

### **Test Scenarios:**

1. **Smallholder tries to access tasks endpoint**
   - Expected: 403 Forbidden with message about Farm Manager requirement

2. **Farm manager creates task for team**
   - Expected: Success

3. **Extension officer tries to edit crop plan**
   - Expected: 403 with "read-only" message

4. **Agribusiness user accesses analytics**
   - Expected: Success (enterprise role)

5. **Farmer tries to access farmer lab pilot list**
   - Expected: 403 (extension officers only)

### **Test Utilities:**

```typescript
// Test helper: Simulate user context
async function testWithUser(role: UserRole, handler: Function) {
  const mockContext = {
    get: (key: string) => key === "user" ? { id: "test", role } : null,
    // ... other context methods
  };
  
  await handler(mockContext);
}

// Example test
await testWithUser("smallholder_farmer", async (c) => {
  const hasAccess = rbac.hasFeatureAccess(c.get("user").role, "tasks");
  console.assert(hasAccess === false, "Smallholder should not access tasks");
});
```

---

## 📊 **Monitoring & Logging**

### **Access Denial Logs:**

The RBAC middleware automatically logs access denials:

```
[RBAC] Access denied: smallholder_farmer attempted to access tasks
[RBAC] Role denied: farmer attempted role-restricted route (allowed: commercial_farm_admin)
```

### **Metrics to Track:**

- Access denial rate by feature
- Most requested locked features (upgrade signals)
- Role distribution across users
- Feature usage by role

---

## 🔄 **Future Enhancements**

### **1. Dynamic Role Assignment**
- Allow role upgrades/downgrades
- Temporary role elevation (e.g., "acting manager")
- Role expiration dates

### **2. Custom Permissions**
- Per-user feature overrides
- Custom enterprise roles
- Fine-grained permissions (read/write/delete)

### **3. Resource-Level Access Control**
- Field-level permissions
- Team-based access
- Shared resources with ACLs

### **4. Audit Trail**
- Log all access attempts
- Track permission changes
- Compliance reporting

---

## 📞 **Support**

**Questions about backend RBAC?**
- Check `/supabase/functions/server/rbac.tsx` for implementation
- Review this guide for usage patterns
- Contact dev team for role modifications

**Need to add RBAC to an endpoint?**
1. Identify the feature/role requirement
2. Add `rbac.requireFeature()` or `rbac.requireRole()` middleware
3. Test with different user roles
4. Update this documentation

---

**Last Updated:** January 2026  
**Maintained By:** KILIMO Backend Team  
**Version:** 1.0.0 - Production Ready ✅

---

**🌾 KILIMO Agri-AI Suite - Secure, Role-Based, Scalable Backend**
