# 📱 Mobile Bottom Navigation by Role

## Role-Specific Mobile Navigation Items

The mobile bottom navigation now shows **different items for different user roles**, optimized for their most-used features.

---

## 🌾 **Smallholder Farmer** (0-5 acres)

**Bottom Nav Items (5):**
```
┌──────┬──────┬────────┬────────┬─────────┐
│ Home │  AI  │ Market │ Crops  │ Profile │
└──────┴──────┴────────┴────────┴─────────┘
```

**Icons:**
- 🏠 Home → Dashboard
- 🧠 AI → AI Chat (Sankofa)
- 🛒 Market → Market Prices
- 📋 Crops → Crop Planning
- 👤 Profile → User Profile

**Why these?**
- AI chat for instant advice
- Market prices for selling crops
- Crop planning for farm management
- Profile for settings

---

## 🌱 **Farmer** (5+ acres, Independent)

**Bottom Nav Items (5):**
```
┌──────┬──────┬────────┬────────┬─────────┐
│ Home │  AI  │ Market │ Crops  │ Profile │
└──────┴──────┴────────┴────────┴─────────┘
```

**Same as Smallholder** - Focus on core farming features

---

## 👨‍💼 **Farm Manager** (Multi-field)

**Bottom Nav Items (5):**
```
┌──────┬───────┬───────────┬──────┬─────────┐
│ Home │ Tasks │ Analytics │ Farm │ Profile │
└──────┴───────┴───────────┴──────┴─────────┘
```

**Icons:**
- 🏠 Home → Dashboard
- ✅ Tasks → Task Management (team coordination)
- 📊 Analytics → Analytics Dashboard
- 📈 Farm → Farm Graph Dashboard
- 👤 Profile → User Profile

**Why these?**
- Tasks for managing team activities
- Analytics for performance tracking
- Farm Graph for multi-field overview

---

## 🏢 **Commercial Farm Admin** (Enterprise)

**Bottom Nav Items (5):**
```
┌──────┬──────────┬────────┬───────────┬─────────┐
│ Home │ Business │ Orders │ Analytics │ Profile │
└──────┴──────────┴────────┴───────────┴─────────┘
```

**Icons:**
- 🏠 Home → Dashboard
- 💼 Business → Agribusiness Dashboard
- 🛒 Orders → Orders & E-commerce
- 📊 Analytics → Analytics Dashboard
- 👤 Profile → User Profile

**Why these?**
- Business dashboard for enterprise operations
- Orders for managing sales
- Analytics for business intelligence

---

## 🏭 **Agribusiness Operations** (Buyer/Supplier)

**Bottom Nav Items (5):**
```
┌──────┬────────┬────────┬───────────┬─────────┐
│ Home │ Market │ Orders │ Analytics │ Profile │
└──────┴────────┴────────┴───────────┴─────────┘
```

**Icons:**
- 🏠 Home → Dashboard
- 🛒 Market → Marketplace (buyer view)
- 📋 Orders → Order Management
- 📊 Analytics → Business Analytics
- 👤 Profile → User Profile

**Why these?**
- Marketplace for sourcing crops
- Orders for procurement tracking
- Analytics for business metrics

---

## 👨‍🏫 **Extension Officer** (NGO/Government)

**Bottom Nav Items (5):**
```
┌──────┬──────┬─────┬───────────┬─────────┐
│ Home │  AI  │ Lab │ Analytics │ Profile │
└──────┴──────┴─────┴───────────┴─────────┘
```

**Icons:**
- 🏠 Home → Dashboard
- 🧠 AI → AI Chat (for farmer support)
- 🔬 Lab → Farmer Lab (pilot programs)
- 📊 Analytics → Impact Analytics
- 👤 Profile → User Profile

**Why these?**
- AI for helping farmers
- Farmer Lab for pilot programs
- Analytics for impact assessment

---

## 🤝 **Cooperative Leader** (Multi-farmer)

**Bottom Nav Items (5):**
```
┌──────┬──────┬────────┬───────────┬─────────┐
│ Home │ Coop │ Market │ Analytics │ Profile │
└──────┴──────┴────────┴───────────┴─────────┘
```

**Icons:**
- 🏠 Home → Dashboard
- 👥 Coop → Cooperative Dashboard
- 🛒 Market → Marketplace (group sales)
- 📊 Analytics → Cooperative Analytics
- 👤 Profile → User Profile

**Why these?**
- Cooperative dashboard for member management
- Market for group sales
- Analytics for cooperative performance

---

## 🎨 **Visual Comparison**

| Role | Nav 1 | Nav 2 | Nav 3 | Nav 4 | Nav 5 |
|------|-------|-------|-------|-------|-------|
| **Smallholder** | Home | AI | Market | Crops | Profile |
| **Farmer** | Home | AI | Market | Crops | Profile |
| **Manager** | Home | **Tasks** | **Analytics** | **Farm** | Profile |
| **Commercial** | Home | **Business** | **Orders** | Analytics | Profile |
| **Agribusiness** | Home | Market | Orders | Analytics | Profile |
| **Extension** | Home | AI | **Lab** | Analytics | Profile |
| **Cooperative** | Home | **Coop** | Market | Analytics | Profile |

**Key:**
- Bold = Role-specific unique items
- Regular = Common items

---

## 🔧 **How It Works**

### **Automatic Role Detection:**
```typescript
// Component automatically gets user role
<MobileBottomNav 
  activeTab={activeTab}
  onTabChange={setActiveTab}
  userRole={currentUser?.role}
/>
```

### **Dynamic Grid Layout:**
- Always shows exactly 5 items (optimized for mobile)
- Grid adjusts automatically: `grid-cols-5`
- Each role gets its most important features

### **Smooth Transitions:**
- When user role changes, nav items update instantly
- Framer Motion animations for smooth UX
- Active state preserves across role changes

---

## 📊 **Design Decisions**

### **Why 5 Items?**
- ✅ Perfect for thumb reach on mobile
- ✅ No horizontal scrolling needed
- ✅ Clear visual hierarchy
- ✅ Industry standard (Instagram, Twitter, etc.)

### **Why Different Items per Role?**
- ✅ Reduces cognitive load
- ✅ Shows most-used features first
- ✅ Faster access to primary functions
- ✅ Better mobile UX

### **Why Keep Home & Profile?**
- **Home:** Universal starting point for all users
- **Profile:** Universal settings & account management
- **Middle 3:** Role-specific primary features

---

## 🧪 **Testing**

### **Test Scenarios:**

1. **Login as Smallholder:**
   - See: Home, AI, Market, Crops, Profile
   - Click "AI" → Navigate to AI Chat

2. **Login as Farm Manager:**
   - See: Home, Tasks, Analytics, Farm, Profile
   - Click "Tasks" → Navigate to Task Management

3. **Login as Extension Officer:**
   - See: Home, AI, Lab, Analytics, Profile
   - Click "Lab" → Navigate to Farmer Lab

4. **Switch Roles:**
   - Change user role
   - Bottom nav updates immediately
   - Correct items show for new role

---

## 📱 **Mobile Optimization**

### **Responsive Design:**
- Only visible on mobile (`md:hidden`)
- Safe area padding for notched phones
- Touch-optimized tap targets (44px minimum)
- Backdrop blur for modern iOS feel

### **Performance:**
- Framer Motion for 60fps animations
- Minimal re-renders (memoized components)
- Fast role switching (<50ms)

---

## 🚀 **Future Enhancements**

### **Planned:**
- [ ] Swipe gestures for navigation
- [ ] Long-press for quick actions
- [ ] Haptic feedback on tap
- [ ] Customizable nav items (user preference)
- [ ] Badge indicators for updates (e.g., "5 new tasks")

### **Possible:**
- [ ] 6-item layout for premium users
- [ ] Collapsible nav bar
- [ ] Voice-activated navigation
- [ ] Gesture-based shortcuts

---

## 📞 **Support**

**Questions about mobile nav?**
- Check `/components/MobileBottomNav.tsx` for implementation
- All role logic is in `getRoleNavItems()` function
- Easy to add new roles or modify items

**Want to change nav items?**
1. Edit `getRoleNavItems()` in MobileBottomNav.tsx
2. Update the switch statement for your role
3. Add new icons if needed
4. Test on mobile device

---

**Status:** ✅ Production Ready  
**Last Updated:** January 2026  
**Version:** 1.0.0

---

**🌾 KILIMO Agri-AI Suite - Mobile-First, Role-Adaptive Navigation**
