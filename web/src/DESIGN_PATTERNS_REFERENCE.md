# KILIMO Design Patterns - Visual Reference

## 🎨 Design System Overview

This document provides quick reference examples for implementing consistent design patterns across the KILIMO Agri-AI Suite.

---

## 1. Color System

### Primary Gradients
```tsx
// Green (Primary)
className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600"

// Blue (Secondary)
className="bg-gradient-to-br from-blue-500 via-cyan-600 to-sky-600"

// Purple (Accent)
className="bg-gradient-to-br from-purple-500 via-pink-600 to-rose-600"

// Orange (Warning)
className="bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600"
```

### Background Colors
```tsx
// Light backgrounds
className="bg-green-50"  // Subtle green
className="bg-blue-50"   // Subtle blue
className="bg-gray-50"   // Neutral

// Cards
className="bg-white border border-gray-200"
```

---

## 2. Typography Scale

```tsx
// Page Titles
<h1 className="text-3xl md:text-5xl font-black text-gray-900">
  Main Page Title
</h1>

// Section Titles
<h2 className="text-2xl md:text-3xl font-bold text-gray-900">
  Section Title
</h2>

// Card Titles
<h3 className="text-lg font-bold text-gray-900">
  Card Title
</h3>

// Labels
<p className="text-sm font-semibold text-gray-700">
  Label Text
</p>

// Body Text
<p className="text-base text-gray-600">
  Regular body text
</p>

// Small Text
<p className="text-xs text-gray-500">
  Caption or helper text
</p>
```

---

## 3. Button Patterns

### Primary Button
```tsx
<Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg">
  Primary Action
</Button>
```

### Secondary Button
```tsx
<Button className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-xl">
  Secondary Action
</Button>
```

### Ghost Button
```tsx
<Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
  Ghost Action
</Button>
```

---

## 4. Card Patterns

### Basic Card
```tsx
<Card className="rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-200">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

### Gradient Card (Hero)
```tsx
<div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white">
  {/* Animated background */}
  <motion.div
    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
    transition={{ duration: 8, repeat: Infinity }}
    className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"
  />
  
  <div className="relative z-10">
    {/* Content here */}
  </div>
</div>
```

### Stat Card
```tsx
<div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
  <div className="flex items-start justify-between mb-3">
    <div className="p-3 bg-white/60 rounded-xl">
      <Icon className="h-6 w-6 text-green-600" />
    </div>
  </div>
  <p className="text-sm font-medium text-gray-600">Label</p>
  <p className="text-3xl font-black text-gray-900">Value</p>
</div>
```

---

## 5. Animation Patterns

### Fade In
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>
```

### Slide Up
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>
```

### Hover Lift
```tsx
<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="cursor-pointer"
>
  {/* Content */}
</motion.div>
```

### Staggered List
```tsx
{items.map((item, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
  >
    {item}
  </motion.div>
))}
```

---

## 6. Icon Patterns

### Icon Badge (Colored Background)
```tsx
<div className="p-3 bg-green-100 text-green-600 rounded-xl shadow-sm">
  <Icon className="h-6 w-6" />
</div>
```

### Icon Badge (Gradient Background)
```tsx
<div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
  <Icon className="h-6 w-6 text-white" />
</div>
```

---

## 7. Layout Patterns

### Two-Column Grid (Responsive)
```tsx
<div className="grid md:grid-cols-2 gap-6">
  <div>{/* Column 1 */}</div>
  <div>{/* Column 2 */}</div>
</div>
```

### Three-Column Grid
```tsx
<div className="grid md:grid-cols-3 gap-4">
  <div>{/* Item 1 */}</div>
  <div>{/* Item 2 */}</div>
  <div>{/* Item 3 */}</div>
</div>
```

### Hero + Content Layout
```tsx
<div className="space-y-6">
  {/* Hero Section */}
  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8">
    {/* Hero content */}
  </div>
  
  {/* Content Grid */}
  <div className="grid lg:grid-cols-3 gap-6">
    {/* Cards */}
  </div>
</div>
```

---

## 8. Form Patterns

### Input with Icon
```tsx
<div className="relative">
  <Icon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
  <Input
    className="pl-12 h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl transition-all"
    placeholder="Enter text..."
  />
</div>
```

### Input with Button
```tsx
<div className="flex gap-2">
  <Input className="flex-1 h-12 rounded-xl" placeholder="Search..." />
  <Button className="bg-green-600 hover:bg-green-700 px-6 rounded-xl">
    Search
  </Button>
</div>
```

---

## 9. Badge Patterns

### Status Badge
```tsx
// Success
<Badge className="bg-green-100 text-green-700 font-semibold">
  Active
</Badge>

// Warning
<Badge className="bg-orange-100 text-orange-700 font-semibold">
  Pending
</Badge>

// Error
<Badge className="bg-red-100 text-red-700 font-semibold">
  Overdue
</Badge>

// Info
<Badge className="bg-blue-100 text-blue-700 font-semibold">
  New
</Badge>
```

---

## 10. Empty State Pattern

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="p-6 bg-gray-100 rounded-full mb-6">
    <Icon className="h-12 w-12 text-gray-400" />
  </div>
  <h3 className="text-xl font-bold text-gray-900 mb-2">
    No Items Found
  </h3>
  <p className="text-gray-600 mb-6 max-w-sm">
    Get started by adding your first item
  </p>
  <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
    Add Item
  </Button>
</div>
```

---

## 11. Loading State Pattern

```tsx
<div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
  <div className="flex items-start gap-3 mb-4">
    <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-5 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
    </div>
  </div>
  <div className="space-y-2">
    <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
    <div className="h-4 bg-gray-200 rounded-lg w-5/6 animate-pulse" />
  </div>
</div>
```

---

## 12. Progress Pattern

```tsx
<div className="space-y-2">
  <div className="flex items-center justify-between text-sm">
    <span className="font-semibold text-gray-700">Progress</span>
    <span className="font-bold text-gray-900">65%</span>
  </div>
  <Progress value={65} className="h-2" />
  <div className="flex items-center justify-between text-xs text-gray-600">
    <span>Current: 6.5M TSh</span>
    <span>Target: 10M TSh</span>
  </div>
</div>
```

---

## 13. Notification Pattern

```tsx
<div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 shadow-md">
  <div className="flex items-start gap-3">
    <div className="text-blue-600 flex-shrink-0 mt-0.5">
      <AlertCircle className="h-5 w-5" />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-bold text-blue-900 mb-1">
        Information
      </h4>
      <p className="text-xs text-blue-700 leading-relaxed">
        This is an informational message for the user.
      </p>
    </div>
    <button className="text-blue-600 hover:opacity-70">
      <X className="h-4 w-4" />
    </button>
  </div>
</div>
```

---

## 14. Mobile Bottom Nav Pattern

```tsx
<div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-50">
  <div className="grid grid-cols-5 h-16">
    {navItems.map((item) => (
      <button
        key={item.id}
        className={`flex flex-col items-center justify-center gap-1 ${
          isActive ? "text-green-600" : "text-gray-500"
        }`}
      >
        <item.icon className="h-5 w-5" />
        <span className="text-xs font-semibold">{item.label}</span>
      </button>
    ))}
  </div>
</div>
```

---

## 15. Quick Reference: Spacing

```
p-2  → 8px padding
p-3  → 12px padding
p-4  → 16px padding
p-5  → 20px padding
p-6  → 24px padding
p-8  → 32px padding

gap-2  → 8px gap
gap-3  → 12px gap
gap-4  → 16px gap
gap-6  → 24px gap

mb-2  → 8px margin bottom
mb-4  → 16px margin bottom
mb-6  → 24px margin bottom
```

---

## 16. Quick Reference: Border Radius

```
rounded-lg   → 8px
rounded-xl   → 12px
rounded-2xl  → 16px
rounded-3xl  → 24px
rounded-full → 9999px (circle)
```

---

## 17. Quick Reference: Shadows

```
shadow-sm  → Subtle shadow
shadow-md  → Medium shadow
shadow-lg  → Large shadow
shadow-xl  → Extra large shadow
shadow-2xl → Huge shadow
```

---

## Usage Tips

1. **Consistency**: Use the same patterns across similar components
2. **Mobile First**: Design for mobile, enhance for desktop
3. **Animations**: Keep animations subtle (0.3-0.5s duration)
4. **Colors**: Stick to the defined color palette
5. **Spacing**: Use multiples of 4px (0.25rem)
6. **Touch Targets**: Minimum 44x44px on mobile
7. **Feedback**: Always provide visual feedback on interactions

---

**Quick Start Template**:
```tsx
import { motion } from "motion/react";
import { Icon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function MyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all">
        <CardContent className="p-6">
          {/* Your content */}
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

---

**End of Design Patterns Reference**
