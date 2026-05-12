# KILIMO Agri-AI Suite - Design System Application Guide
**Ensuring Visual Consistency Across All User Flows**

---

## 🎨 Design Philosophy

### Core Principles
1. **Mobile-First**: Design for small screens, enhance for larger ones
2. **Gradient-Driven**: Use green-emerald-teal gradients for visual appeal
3. **High Contrast**: Ensure accessibility with clear color separation
4. **Smooth Animations**: Use Motion for delightful micro-interactions
5. **Responsive Typography**: Scale text appropriately across devices
6. **Touch-Friendly**: Minimum 44px tap targets for mobile
7. **Bilingual-Ready**: Accommodate longer Swahili text without breaking

---

## 🎯 Color Palette

### Primary Colors (Brand Identity)
```css
--green-500: #10b981      /* Primary actions, success states */
--emerald-600: #059669    /* Gradient middle, hover states */
--teal-600: #0d9488       /* Gradient end, accents */
--green-50: #f0fdf4       /* Light backgrounds, highlights */
```

### Semantic Colors
```css
/* Success */
--green-600: #16a34a      /* Success icons, positive trends */
--green-100: #dcfce7      /* Success backgrounds */

/* Warning */
--orange-600: #ea580c     /* Warnings, medium priority */
--orange-100: #ffedd5     /* Warning backgrounds */

/* Error */
--red-600: #dc2626        /* Errors, high priority, danger */
--red-100: #fee2e2        /* Error backgrounds */

/* Info */
--blue-600: #2563eb       /* Information, weather, links */
--blue-100: #dbeafe       /* Info backgrounds */

/* Neutral */
--gray-50: #f9fafb        /* Card backgrounds */
--gray-100: #f3f4f6       /* Subtle backgrounds */
--gray-600: #4b5563       /* Secondary text */
--gray-900: #111827       /* Primary text */
```

### User Type Colors (For Navigation/Identification)
```css
--farmer-green: #10b981       /* Farmers */
--org-blue: #3b82f6          /* Organizations */
--coop-purple: #8b5cf6       /* Cooperatives */
--buyer-orange: #f59e0b      /* Buyers */
--extension-teal: #14b8a6    /* Extension Officers */
--agri-red: #ef4444          /* Agribusinesses */
--institution-indigo: #6366f1 /* Institutions */
--guest-gray: #6b7280        /* Guest Mode */
```

---

## 📐 Layout Patterns

### 1. Container Widths
```tsx
/* Full-width mobile, constrained desktop */
<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

/* Form containers */
<div className="w-full max-w-md mx-auto">
  {/* Form content */}
</div>

/* Dashboard content */
<div className="w-full max-w-6xl mx-auto">
  {/* Dashboard content */}
</div>
```

### 2. Spacing Scale
```tsx
/* Tight spacing (mobile cards) */
<div className="space-y-2 md:space-y-3">

/* Normal spacing (sections) */
<div className="space-y-4 md:space-y-6">

/* Loose spacing (major sections) */
<div className="space-y-6 md:space-y-8">

/* Grid gaps */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
```

### 3. Responsive Grids
```tsx
/* 1 column mobile, 2 tablet, 3 desktop */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

/* 2 columns mobile, 4 desktop */
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">

/* Stat cards */
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

/* Full-width sidebar layout */
<div className="grid lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">{/* Main content */}</div>
  <div className="lg:col-span-1">{/* Sidebar */}</div>
</div>
```

---

## 🎴 Component Patterns

### 1. Hero/Banner Sections
```tsx
/* Gradient hero with animation */
<div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white">
  {/* Animated background orbs */}
  <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl"></div>
  <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
  
  <div className="relative z-10">
    {/* Hero content */}
  </div>
</div>
```

**Usage**: Welcome screens, dashboard headers, feature highlights  
**Variants**: Change gradient colors for different user types

### 2. Cards
```tsx
/* Standard card */
<Card className="hover:shadow-lg transition-shadow border-green-200">
  <CardHeader>
    <CardTitle className="text-lg flex items-center gap-2">
      <Icon className="h-5 w-5 text-green-600" />
      {title}
    </CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>

/* Action card (clickable) */
<Card className="hover:shadow-lg transition-all cursor-pointer group border-green-200" onClick={handleClick}>
  <CardContent className="p-6">
    <div className="flex items-center gap-3">
      <div className="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6 text-green-600" />
      </div>
      <div>
        <p className="font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-600">{subtitle}</p>
      </div>
    </div>
  </CardContent>
</Card>
```

**Usage**: Feature cards, quick actions, information display  
**Variants**: Change border color to match semantic meaning

### 3. Stat Cards
```tsx
/* Gradient stat card (for hero sections) */
<div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
  <div className="flex items-center gap-2 mb-1">
    <Icon className="h-4 w-4" />
    <p className="text-xs text-white/80">{label}</p>
  </div>
  <p className="text-2xl font-bold">{value}</p>
</div>

/* Standard stat card */
<div className="text-center p-3 bg-gray-50 rounded-xl">
  <Icon className="h-5 w-5 text-blue-600 mx-auto mb-1" />
  <p className="text-xs text-gray-600">{label}</p>
  <p className="text-lg font-bold text-gray-900">{value}</p>
</div>
```

**Usage**: Dashboard stats, metric displays, KPI cards

### 4. Info/Alert Cards
```tsx
/* Success alert */
<div className="p-3 bg-green-50 border border-green-200 rounded-xl">
  <div className="flex items-start gap-2">
    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
    <div>
      <p className="text-xs font-semibold text-green-900">{title}</p>
      <p className="text-xs text-green-700 mt-1">{description}</p>
    </div>
  </div>
</div>

/* Warning alert */
<div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
  <div className="flex items-start gap-2">
    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
    <div>
      <p className="text-xs font-semibold text-orange-900">{title}</p>
      <p className="text-xs text-orange-700 mt-1">{description}</p>
    </div>
  </div>
</div>

/* Error alert */
<div className="p-3 bg-red-50 border border-red-200 rounded-xl">
  {/* Similar structure with red colors */}
</div>

/* Info alert */
<div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
  {/* Similar structure with blue colors */}
</div>
```

**Usage**: Notifications, alerts, status messages, advisories

### 5. List Items
```tsx
/* Task/item list with status */
<div className={`
  flex items-center gap-3 p-4 rounded-xl border-2 transition-all
  ${completed 
    ? 'bg-green-50 border-green-200' 
    : 'bg-white border-gray-200 hover:border-orange-300'
  }
`}>
  <div className={`
    flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
    ${completed 
      ? 'bg-green-500 border-green-500' 
      : 'border-gray-300'
    }
  `}>
    {completed && <CheckCircle className="h-3 w-3 text-white" />}
  </div>
  
  <div className="flex-1">
    <p className={`
      text-sm font-medium
      ${completed ? 'line-through text-gray-500' : 'text-gray-900'}
    `}>
      {title}
    </p>
  </div>

  <Badge className={priority === "high" 
    ? "bg-red-100 text-red-700" 
    : "bg-yellow-100 text-yellow-700"
  }>
    {priority}
  </Badge>
</div>
```

**Usage**: Task lists, crop lists, activity feeds

### 6. Empty States
```tsx
<div className="text-center py-12">
  <div className="inline-flex p-4 bg-gray-100 rounded-2xl mb-4">
    <Icon className="h-12 w-12 text-gray-400" />
  </div>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
  <p className="text-sm text-gray-600 mb-4">{description}</p>
  <Button onClick={handleAction}>
    {actionLabel}
  </Button>
</div>
```

**Usage**: No data states, empty lists, initial screens

### 7. Loading States
```tsx
/* Skeleton loader */
<div className="animate-pulse space-y-3">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
</div>

/* Spinner with text */
<div className="flex items-center justify-center py-12">
  <div className="text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
    <p className="text-sm text-gray-600">{loadingText}</p>
  </div>
</div>
```

**Usage**: Loading states, data fetching, transitions

---

## 🔘 Button Patterns

### 1. Primary Actions
```tsx
/* Solid primary button */
<Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
  {text.action}
</Button>

/* Standard primary */
<Button className="bg-green-600 hover:bg-green-700 text-white">
  {text.action}
</Button>
```

**Usage**: Submit forms, confirm actions, primary CTAs

### 2. Secondary Actions
```tsx
<Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
  {text.action}
</Button>
```

**Usage**: Cancel, alternative actions, secondary CTAs

### 3. Destructive Actions
```tsx
<Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
  {text.delete}
</Button>
```

**Usage**: Delete, remove, irreversible actions

### 4. Text/Link Buttons
```tsx
<button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
  {text.viewMore}
  <ArrowRight className="h-4 w-4" />
</button>
```

**Usage**: "View more", "Learn more", inline actions

### 5. Icon Buttons
```tsx
/* Round icon button */
<button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
  <Icon className="h-5 w-5 text-gray-600" />
</button>

/* Square icon button */
<button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
  <Icon className="h-5 w-5 text-gray-600" />
</button>
```

**Usage**: Menu buttons, action buttons, close buttons

---

## 📝 Form Patterns

### 1. Form Field Structure
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-900">
    {text.label}
    {required && <span className="text-red-600 ml-1">*</span>}
  </label>
  <input
    type="text"
    placeholder={text.placeholder}
    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
  />
  {error && (
    <p className="text-xs text-red-600">{text.errorMessage}</p>
  )}
  {hint && (
    <p className="text-xs text-gray-500">{text.hint}</p>
  )}
</div>
```

### 2. Form Container
```tsx
<form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
  {/* Form fields */}
  
  <div className="flex gap-3 pt-4">
    <Button type="submit" className="flex-1">
      {text.submit}
    </Button>
    <Button type="button" variant="outline" onClick={handleCancel}>
      {text.cancel}
    </Button>
  </div>
</form>
```

### 3. Select/Dropdown Pattern
```tsx
<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder={text.placeholder} />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">{text.option1}</SelectItem>
    <SelectItem value="option2">{text.option2}</SelectItem>
  </SelectContent>
</Select>
```

---

## 🎭 Animation Patterns

### 1. Page Transitions
```tsx
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className="animate-fadeIn"
>
  {/* Page content */}
</motion.div>
```

### 2. Card Hover Effects
```tsx
/* Using CSS transitions */
<Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

/* Using Motion */
<motion.div
  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
  transition={{ duration: 0.2 }}
>
```

### 3. Button Interactions
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="..."
>
  {text.action}
</motion.button>
```

### 4. Loading Animations
```tsx
/* Pulse effect */
<motion.div
  animate={{ scale: [1, 1.05, 1] }}
  transition={{ repeat: Infinity, duration: 2 }}
>

/* Spin effect */
<motion.div
  animate={{ rotate: 360 }}
  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
>
```

---

## 📱 Mobile Navigation

### Bottom Navigation Bar
```tsx
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
  <div className="grid grid-cols-5 gap-1">
    {navItems.map(item => (
      <button
        key={item.id}
        className={`
          flex flex-col items-center py-2 px-1 text-xs
          ${isActive ? 'text-green-600' : 'text-gray-600'}
        `}
      >
        <Icon className="h-6 w-6 mb-1" />
        <span className="truncate w-full text-center">{item.label}</span>
      </button>
    ))}
  </div>
</div>
```

### Floating Action Button (FAB)
```tsx
<motion.button
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  className="fixed bottom-20 right-4 md:bottom-6 md:right-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-xl hover:shadow-2xl z-40"
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
>
  <Icon className="h-6 w-6" />
</motion.button>
```

---

## 🌗 Dark Mode Considerations

### Preparing for Future Dark Mode
```tsx
/* Use semantic color classes that can be adapted */
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

/* Or use CSS variables */
:root {
  --background: white;
  --text: black;
}

[data-theme="dark"] {
  --background: #1a1a1a;
  --text: white;
}
```

---

## ✅ Design Checklist for New Features

When creating a new feature or component, ensure:

- [ ] Uses established color palette
- [ ] Follows spacing scale (4, 6, 8, 12, 16, 24px)
- [ ] Mobile-first responsive (test 375px, 768px, 1024px, 1440px)
- [ ] Minimum 44px tap targets on mobile
- [ ] Uses consistent border-radius (xl = 0.75rem, 2xl = 1rem, 3xl = 1.5rem)
- [ ] Includes hover states for interactive elements
- [ ] Has loading states for async actions
- [ ] Shows empty states when no data
- [ ] Includes error states with clear messaging
- [ ] Uses Motion for smooth animations
- [ ] Passes WCAG 2.1 AA contrast requirements
- [ ] Text is bilingual-ready (no hardcoded English)
- [ ] Works with keyboard navigation
- [ ] Has appropriate ARIA labels

---

## 🎓 Component Examples from Design System

### Using Design System Components
```tsx
import { GradientCard } from "./components/design/GradientCard";
import { StatCard } from "./components/design/StatCard";
import { ActionCard } from "./components/design/ActionCard";
import { EmptyState } from "./components/design/EmptyState";

/* Gradient feature card */
<GradientCard
  title={text.feature}
  description={text.description}
  icon={<Icon />}
  gradient="green"  // or 'blue', 'orange', 'purple'
/>

/* Stat display */
<StatCard
  label={text.crops}
  value="24"
  change="+12%"
  trend="up"
  icon={<Leaf />}
/>

/* Quick action */
<ActionCard
  title={text.action}
  description={text.description}
  icon={<Brain />}
  onClick={handleAction}
  color="green"
/>

/* No data state */
<EmptyState
  icon={<Package />}
  title={text.noData}
  description={text.addFirst}
  actionLabel={text.add}
  onAction={handleAdd}
/>
```

---

## 📊 Typography Scale

### Headings
```tsx
/* Page title */
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">

/* Section title */
<h2 className="text-xl md:text-2xl font-bold text-gray-900">

/* Subsection */
<h3 className="text-lg md:text-xl font-semibold text-gray-900">

/* Card title */
<h4 className="text-base md:text-lg font-semibold text-gray-900">
```

### Body Text
```tsx
/* Standard paragraph */
<p className="text-sm md:text-base text-gray-600">

/* Small text */
<p className="text-xs md:text-sm text-gray-500">

/* Tiny text (captions) */
<p className="text-xs text-gray-400">
```

### Font Weights
- `font-normal` (400): Body text
- `font-medium` (500): Emphasized text, buttons
- `font-semibold` (600): Card titles, labels
- `font-bold` (700): Page titles, stats
- `font-black` (900): Hero titles (sparingly)

---

## 🎯 Accessibility Requirements

### Color Contrast
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text (18px+)**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 against adjacent colors

### Touch Targets
- **Minimum size**: 44x44px for mobile
- **Spacing**: 8px minimum between targets
- **Forgiveness**: Larger hit area than visual size

### Keyboard Navigation
```tsx
/* Ensure focusable elements have visible focus */
<button className="focus:ring-2 focus:ring-green-500 focus:outline-none">

/* Tab order should follow visual order */
/* Use tabIndex only when necessary */
```

### Screen Reader Support
```tsx
/* Always include meaningful labels */
<button aria-label={text.closeDialog}>
  <X className="h-5 w-5" />
</button>

/* Use semantic HTML */
<nav aria-label="Main navigation">
<main aria-label="Main content">
<aside aria-label="Sidebar">
```

---

## 🚀 Performance Considerations

### Image Optimization
- Use Next.js Image component for automatic optimization
- Provide appropriate sizes for responsive images
- Use lazy loading for below-the-fold images

### Animation Performance
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `left`, `top`
- Use `will-change` sparingly for complex animations

### Component Loading
- Lazy load heavy components below the fold
- Show loading skeletons while data fetches
- Use React Suspense for code splitting

---

## 📚 Resources

- **Shadcn UI Docs**: https://ui.shadcn.com
- **Tailwind CSS Docs**: https://tailwindcss.com
- **Motion Docs**: https://motion.dev
- **Lucide Icons**: https://lucide.dev
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

**Last Updated**: January 22, 2026  
**Version**: 1.0  
**Maintained by**: KILIMO Design Team
