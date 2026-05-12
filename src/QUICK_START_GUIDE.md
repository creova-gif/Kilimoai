# 🚀 RBAC Quick Start Guide

## Get Started in 5 Minutes!

---

## 🎯 **What You Got**

You now have a **complete Role-Based Access Control (RBAC) system** with:

1. ✅ **Dynamic Navigation** - Users only see their allowed features
2. ✅ **Backend Protection** - APIs check roles before responding
3. ✅ **Admin Panel** - Manage user roles easily
4. ✅ **Upgrade Prompts** - Beautiful modals encourage upgrades

---

## 🏃‍♂️ **Quick Tour**

### **1. Login and See Your Role**

1. Login as any user type
2. Look at the **top right** - you'll see your role badge
3. Look at the **sidebar** - shows your feature count
4. Your navigation menu shows **only your allowed features**

### **2. Try Different Roles**

**Test accounts to try:**
- Smallholder Farmer: `john@example.com` → sees 26 features
- Farm Manager: `sarah@example.com` → sees 36 features
- Extension Officer: `peter@ngo.org` → sees 26 features

**What changes:**
- Navigation menu filters automatically
- Dashboard shows role-specific actions
- Feature count updates

### **3. Test Feature Access**

**As Smallholder Farmer:**
- Try to access "Task Management" → **Blocked** (not in menu)
- Try "Market Prices" → **Works** (allowed feature)

**As Farm Manager:**
- Try "Task Management" → **Works** (allowed feature)
- Try "Analytics" → **Works** (allowed feature)

### **4. Open Admin Panel**

1. Login as admin/commercial user
2. Navigate to "Admin" → "Role Management"
3. See all users and their roles
4. Click "Edit" to change a role
5. Save and see updated navigation

---

## 💻 **Code Examples**

### **Example 1: Check Feature Access**

```typescript
import { hasFeatureAccess } from './utils/roleBasedAccess';

// In your component
const canAccessTasks = hasFeatureAccess(currentUser.role, "tasks");

if (canAccessTasks) {
  // Show Task Management button
  <button onClick={() => navigate('/tasks')}>
    Task Management
  </button>
}
```

### **Example 2: Use Upgrade Prompt Hook**

```typescript
import useFeatureAccess from './hooks/useFeatureAccess';
import { FeatureUpgradePrompt } from './components/FeatureUpgradePrompt';

function MyComponent() {
  const { 
    attemptFeatureAccess, 
    showUpgradePrompt, 
    promptFeatureId,
    promptFeatureName,
    hideUpgradePrompt 
  } = useFeatureAccess({
    userRole: currentUser.role,
    onUpgradeRequest: (targetRole) => {
      // Handle upgrade (navigate to payment, etc.)
      console.log(`Upgrade to: ${targetRole}`);
    }
  });

  const handleClickFeature = () => {
    // Attempt access (shows prompt if denied)
    if (attemptFeatureAccess("tasks", "Task Management")) {
      // Navigate to feature
      navigate('/tasks');
    }
  };

  return (
    <>
      <button onClick={handleClickFeature}>
        Task Management
      </button>

      {showUpgradePrompt && (
        <FeatureUpgradePrompt
          currentRole={currentUser.role}
          featureId={promptFeatureId!}
          featureName={promptFeatureName}
          language="en"
          onClose={hideUpgradePrompt}
        />
      )}
    </>
  );
}
```

### **Example 3: Protect Backend Endpoint**

```typescript
import * as rbac from "./rbac.tsx";

// Method 1: Require specific feature
app.get("/make-server-ce1844e7/tasks/:userId",
  rbac.requireFeature("tasks"),
  async (c) => {
    const user = c.get("user");
    // Only farm managers can reach here
    return c.json({ tasks: [...] });
  }
);

// Method 2: Require specific role(s)
app.get("/make-server-ce1844e7/admin/analytics",
  rbac.requireRole(["commercial_farm_admin", "agribusiness_ops"]),
  async (c) => {
    // Only these roles can reach here
    return c.json({ stats: {...} });
  }
);

// Method 3: Manual check inside handler
app.post("/make-server-ce1844e7/some-endpoint", async (c) => {
  const user = c.get("user");
  
  if (!rbac.canUserEdit(user.role)) {
    return c.json({
      error: "Read-only access for your role"
    }, 403);
  }
  
  // Proceed with edit operation
});
```

---

## 🔧 **Common Tasks**

### **Add a New Feature**

1. **Update `/utils/roleBasedAccess.ts`:**

```typescript
export type FeatureId =
  | "home"
  | "ai-chat"
  // ... existing features
  | "my-new-feature"; // Add here

export const ROLE_FEATURES: Record<UserRole, FeatureId[]> = {
  farm_manager: [
    "home",
    "ai-chat",
    // ... existing features
    "my-new-feature", // Add to relevant roles
  ],
  // ... other roles
};
```

2. **Update `/App.tsx` navigation:**

```typescript
const allNavigationItems = [
  { id: "home", label: "Dashboard", icon: Home, category: "main" },
  // ... existing items
  { 
    id: "my-new-feature", 
    label: "My New Feature", 
    icon: Sparkles, 
    category: "main" 
  },
];
```

3. **Add route handler:**

```typescript
{activeTab === "my-new-feature" && (
  <div className="animate-fadeIn">
    <MyNewFeatureComponent />
  </div>
)}
```

### **Add a New Role**

1. **Update `/utils/roleBasedAccess.ts`:**

```typescript
export type UserRole =
  | "smallholder_farmer"
  // ... existing roles
  | "my_new_role"; // Add here

export const ROLE_FEATURES: Record<UserRole, FeatureId[]> = {
  // ... existing roles
  my_new_role: [
    "home",
    "ai-chat",
    "market",
    // ... features for this role
  ],
};

// Add display name
const names: Record<UserRole, { en: string; sw: string }> = {
  // ... existing
  my_new_role: {
    en: "My New Role",
    sw: "Jukumu Langu Jipya",
  },
};
```

2. **Update backend:** `/supabase/functions/server/rbac.tsx` (same changes)

3. **Test thoroughly!**

### **Change a User's Role**

**Method 1: Admin Panel**
1. Login as admin
2. Navigate to "Admin" → "Role Management"
3. Search for user
4. Click "Edit"
5. Select new role
6. Save

**Method 2: API Call** (for automation)
```typescript
await fetch(`/api/admin/users/${userId}/role`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ role: 'farm_manager' })
});
```

**Method 3: Direct Database** (KV store)
```typescript
const user = await kv.get(`user:${userId}:profile`);
user.role = 'farm_manager';
await kv.set(`user:${userId}:profile`, user);
```

---

## 🐛 **Troubleshooting**

### **Problem: User sees all features**

**Solution:** Check if navigation filtering is applied

```typescript
// In App.tsx, should see:
const navigationItems = currentUser?.role 
  ? filterFeaturesByRole(allNavigationItems, currentUser.role)
  : allNavigationItems;
```

### **Problem: User can access blocked feature via URL**

**Solution:** Add backend protection

```typescript
app.get("/make-server-ce1844e7/feature",
  rbac.requireFeature("feature-id"),
  async (c) => { ... }
);
```

### **Problem: Upgrade prompt doesn't show**

**Solution:** Check hook usage

```typescript
const { attemptFeatureAccess, showUpgradePrompt } = useFeatureAccess({
  userRole: user.role,
  onUpgradeRequest: (role) => { /* must be defined */ }
});

// Must render the prompt component
{showUpgradePrompt && <FeatureUpgradePrompt ... />}
```

### **Problem: Role badge not showing**

**Solution:** Ensure role is in user object

```typescript
// User object must have role property
const user = {
  id: "123",
  name: "John",
  role: "smallholder_farmer", // Required!
};
```

---

## 📊 **Check It's Working**

### **Frontend Checklist:**
- [ ] Role badge visible in header
- [ ] Feature count in sidebar
- [ ] Navigation menu filtered by role
- [ ] Smallholder sees ~26 features
- [ ] Farm manager sees ~36 features
- [ ] Toast shows role on login

### **Backend Checklist:**
- [ ] Protected endpoints return 403 for unauthorized roles
- [ ] User context available in handlers: `c.get("user")`
- [ ] Access denials logged to console
- [ ] Error messages mention upgrade path

### **Admin Panel Checklist:**
- [ ] Can view all users
- [ ] Can search users
- [ ] Can filter by role
- [ ] Can edit roles
- [ ] Role distribution chart updates

### **Upgrade Prompt Checklist:**
- [ ] Shows when accessing locked feature
- [ ] Displays current role
- [ ] Shows upgrade options
- [ ] Compares feature counts
- [ ] Highlights key features
- [ ] Closes on click outside

---

## 🎓 **Learn More**

### **Documentation:**
- `/ROLE_BASED_ACCESS_GUIDE.md` - Technical implementation
- `/BACKEND_RBAC_PROTECTION.md` - API protection guide
- `/ROLE_COMPARISON_MATRIX.md` - Feature comparison
- `/WHAT_USERS_SEE.md` - User experience guide

### **Code Reference:**
- `/utils/roleBasedAccess.ts` - Core RBAC logic
- `/hooks/useFeatureAccess.ts` - React hook
- `/components/FeatureUpgradePrompt.tsx` - Upgrade UI
- `/components/AdminRoleManager.tsx` - Admin panel
- `/supabase/functions/server/rbac.tsx` - Backend RBAC

---

## 🚀 **Quick Commands**

### **Test Different Roles:**

```bash
# Login as different users to see different views
# Smallholder: john@example.com
# Manager: sarah@example.com
# Extension: peter@ngo.org
```

### **Check Feature Access (Console):**

```javascript
// In browser console
import { hasFeatureAccess } from './utils/roleBasedAccess';

hasFeatureAccess('smallholder_farmer', 'tasks'); // false
hasFeatureAccess('farm_manager', 'tasks'); // true
```

### **View Current User Role:**

```javascript
// In browser console
const user = JSON.parse(localStorage.getItem('kilimoUser'));
console.log(user.role); // Current role
```

---

## 🎉 **You're Ready!**

Your RBAC system is now fully implemented and ready to use!

**Next Steps:**
1. Test with different user roles
2. Customize feature access as needed
3. Add new features/roles following guides above
4. Monitor analytics for upgrade opportunities

**Need Help?**
- Check documentation files listed above
- Review code comments in source files
- Contact development team

---

**🌾 Happy Building!**

**KILIMO Agri-AI Suite - Role-Based Access Control v1.0.0**
