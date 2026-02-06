# KILIMO Design System - Component Hierarchy

## 📦 Component Organization

```
KILIMO Agri-AI Suite
│
├── 🎨 Design System Components (/components/design/)
│   ├── Cards
│   │   ├── GradientCard         → Hero/Featured content
│   │   ├── StatCard             → Metrics with trends
│   │   ├── ActionCard           → Primary CTAs
│   │   ├── QuickActionCard      → Secondary actions
│   │   ├── InfoCard             → Information display
│   │   ├── ProgressCard         → Progress tracking
│   │   └── MetricCard           → Single metrics
│   │
│   ├── Layout
│   │   ├── HeroSection          → Page heroes
│   │   ├── PageHeader           → Page titles
│   │   └── FeatureList          → Feature lists
│   │
│   └── States
│       ├── EmptyState           → No data
│       ├── LoadingSkeleton      → Loading
│       └── NotificationBadge    → Alerts
│
├── 🧩 UI Components (/components/ui/)
│   ├── Base Components (Shadcn)
│   │   ├── Button
│   │   ├── Card
│   │   ├── Input
│   │   ├── Badge
│   │   ├── Progress
│   │   ├── Tabs
│   │   └── ... (40+ components)
│
├── 🏠 Feature Components (/components/)
│   ├── Authentication
│   │   ├── WelcomeScreen ✨ (Enhanced)
│   │   ├── LoginForm ✨ (Enhanced)
│   │   ├── RegistrationForm
│   │   └── OnboardingFlow
│   │
│   ├── Navigation
│   │   ├── MobileBottomNav ✨ (Enhanced)
│   │   ├── NavigationSidebar
│   │   ├── Header
│   │   └── BottomNavigation
│   │
│   ├── Dashboard
│   │   ├── DashboardHome
│   │   ├── QuickAccessCards
│   │   ├── RealTimeWeatherHero
│   │   └── ...
│   │
│   └── ... (60+ feature components)
│
└── 📚 Documentation
    ├── DESIGN_SYSTEM_GUIDE.md
    ├── DESIGN_PATTERNS_REFERENCE.md
    ├── UI_REDESIGN_CHECKLIST.md
    └── UI_REDESIGN_COMPLETION_SUMMARY.md
```

---

## 🎯 Component Selection Guide

### When to Use Which Card Component

```
┌─────────────────────────────────────────────────────────┐
│                    Component Decision Tree               │
└─────────────────────────────────────────────────────────┘

Need a card?
    │
    ├─ Is it a hero/featured section?
    │   └─ YES → GradientCard or HeroSection
    │       └─ Large, prominent, gradient background
    │
    ├─ Is it showing a metric/statistic?
    │   ├─ Single metric → MetricCard
    │   │   └─ One value, trend, icon
    │   └─ Multiple stats → StatCard
    │       └─ Grid of statistics
    │
    ├─ Is it a call-to-action?
    │   ├─ Primary action → ActionCard
    │   │   └─ Full gradient, prominent
    │   └─ Secondary action → QuickActionCard
    │       └─ Subtle gradient, lighter
    │
    ├─ Is it showing progress?
    │   └─ YES → ProgressCard
    │       └─ Progress bar, current/target
    │
    ├─ Is it informational content?
    │   └─ YES → InfoCard
    │       └─ Clean white/highlight variant
    │
    └─ Is it a standard content card?
        └─ YES → Card (from /ui/)
            └─ Basic Shadcn card
```

---

## 🎨 Visual Hierarchy

### Level 1: Hero Sections (Highest Impact)
```tsx
<HeroSection 
  title="Welcome to KILIMO"
  gradient="from-green-600 via-emerald-600 to-teal-700"
>
  {/* Primary content */}
</HeroSection>

<GradientCard
  title="Featured Action"
  gradient="from-green-500 to-emerald-600"
  icon={Brain}
/>
```
**Use for**: Page headers, featured content, major CTAs

---

### Level 2: Primary Content (High Impact)
```tsx
<ActionCard
  title="Get Started"
  description="Begin your journey"
  icon={Leaf}
  color="green"
/>

<PageHeader
  title="Dashboard"
  subtitle="Your farm overview"
  icon={Home}
  gradient={true}
/>
```
**Use for**: Main actions, page titles, key features

---

### Level 3: Metrics & Stats (Medium Impact)
```tsx
<MetricCard
  label="Total Revenue"
  value="8.2M TSh"
  icon={DollarSign}
  trend={{ value: 12.5, direction: "up" }}
  color="green"
/>

<StatCard
  label="Active Crops"
  value={5}
  icon={<Leaf />}
  trend={{ value: 10, direction: "up" }}
  color="green"
/>
```
**Use for**: Dashboard metrics, KPIs, statistics

---

### Level 4: Secondary Content (Standard Impact)
```tsx
<InfoCard
  title="Recent Activity"
  subtitle="Last 7 days"
  icon={Activity}
  variant="default"
>
  {/* Content */}
</InfoCard>

<QuickActionCard
  title="View Reports"
  description="Access your analytics"
  icon={BarChart}
  color="blue"
/>
```
**Use for**: Secondary features, content sections, lists

---

### Level 5: Supporting Elements (Low Impact)
```tsx
<ProgressCard
  title="Revenue Goal"
  progress={65}
  icon={Target}
  current="6.5M"
  target="10M"
  color="green"
/>

<NotificationBadge
  type="info"
  title="New Feature"
  message="Check out our latest update"
  icon={Bell}
/>
```
**Use for**: Progress tracking, notifications, badges

---

## 🎭 State Components Usage

### Empty States
```tsx
<EmptyState
  icon={Package}
  title="No Products Found"
  description="Start by adding your first product"
  actionLabel="Add Product"
  onAction={() => navigate('/add-product')}
/>
```
**Use when**: No data to display, first-time experience

---

### Loading States
```tsx
<LoadingSkeleton variant="card" count={3} />
<LoadingSkeleton variant="list" count={5} />
<LoadingSkeleton variant="stat" count={4} />
```
**Use when**: Fetching data, initial load

---

## 🏗️ Layout Patterns

### Dashboard Layout
```tsx
<div className="space-y-6">
  {/* Hero */}
  <HeroSection title="Welcome" subtitle="Your overview" />
  
  {/* Stats Grid */}
  <div className="grid md:grid-cols-4 gap-4">
    <MetricCard {...} />
    <MetricCard {...} />
    <MetricCard {...} />
    <MetricCard {...} />
  </div>
  
  {/* Content Grid */}
  <div className="grid lg:grid-cols-3 gap-6">
    <InfoCard {...} className="lg:col-span-2" />
    <InfoCard {...} />
  </div>
</div>
```

---

### Feature Grid Layout
```tsx
<div className="space-y-6">
  {/* Page Header */}
  <PageHeader 
    title="Features" 
    subtitle="Explore our tools" 
    gradient={true}
  />
  
  {/* Actions Grid */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    <QuickActionCard {...} />
    <QuickActionCard {...} />
    <QuickActionCard {...} />
  </div>
</div>
```

---

## 📊 Component Complexity Scale

```
Simple → Complex

Card (Basic)
  └─ Minimal styling, static content

InfoCard
  └─ Icon, action button, flexible content

StatCard / MetricCard
  └─ Data visualization, trends, icons

QuickActionCard
  └─ Interactive, hover effects, icons

ActionCard
  └─ Full gradient, complex animations

GradientCard
  └─ Advanced animations, decorative elements

HeroSection
  └─ Multiple animations, background effects
```

---

## 🎨 Color Coding by Function

### Primary Actions → Green
```tsx
color="green"
gradient="from-green-500 to-emerald-600"
```
**Use for**: Main CTAs, success states, farm-related content

### Information → Blue
```tsx
color="blue"
gradient="from-blue-500 to-cyan-600"
```
**Use for**: Info messages, weather, water-related content

### Analytics → Purple
```tsx
color="purple"
gradient="from-purple-500 to-pink-600"
```
**Use for**: Reports, analytics, premium features

### Warnings → Orange
```tsx
color="orange"
gradient="from-orange-500 to-amber-600"
```
**Use for**: Warnings, pending states, attention needed

### Neutral → Gray
```tsx
color="gray"
gradient="from-gray-500 to-slate-600"
```
**Use for**: Disabled states, secondary content

---

## 🔄 Animation Stagger Patterns

### List Items (Cards)
```tsx
{items.map((item, index) => (
  <ActionCard
    key={index}
    {...item}
    delay={index * 0.1}  // 0, 0.1, 0.2, 0.3, ...
  />
))}
```

### Grid Items (Metrics)
```tsx
{metrics.map((metric, index) => (
  <MetricCard
    key={index}
    {...metric}
    delay={index * 0.05}  // Faster for smaller items
  />
))}
```

### Sections (Page Load)
```tsx
<HeroSection {...} />           // delay: 0
<div delay={0.2}>Stats</div>    // delay: 0.2
<div delay={0.4}>Content</div>  // delay: 0.4
```

---

## 🎯 Responsive Patterns

### Mobile-First Grid
```tsx
// 1 column mobile, 2 desktop, 3 large
className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"

// 1 column mobile, 3 desktop
className="grid md:grid-cols-3 gap-4"

// 2 columns mobile, 4 desktop
className="grid grid-cols-2 md:grid-cols-4 gap-3"
```

### Responsive Padding
```tsx
// Smaller mobile, larger desktop
className="p-4 md:p-6 lg:p-8"

// Rounded corners
className="rounded-2xl md:rounded-3xl"

// Text size
className="text-xl md:text-3xl"
```

---

## 🚀 Quick Start Templates

### Simple Feature Page
```tsx
export function MyFeature() {
  return (
    <div className="space-y-6 p-4">
      <PageHeader 
        title="Feature Name"
        subtitle="Description"
        icon={Icon}
      />
      
      <div className="grid md:grid-cols-2 gap-4">
        <InfoCard title="Section 1">
          {/* Content */}
        </InfoCard>
        <InfoCard title="Section 2">
          {/* Content */}
        </InfoCard>
      </div>
    </div>
  );
}
```

### Dashboard Template
```tsx
export function MyDashboard({ user }) {
  return (
    <div className="space-y-6 pb-6">
      <HeroSection 
        title={`Welcome ${user.name}`}
        subtitle="Your overview"
      >
        {/* Quick stats */}
      </HeroSection>
      
      <div className="grid md:grid-cols-4 gap-4">
        <MetricCard label="Metric 1" value="123" icon={Icon1} />
        <MetricCard label="Metric 2" value="456" icon={Icon2} />
        <MetricCard label="Metric 3" value="789" icon={Icon3} />
        <MetricCard label="Metric 4" value="012" icon={Icon4} />
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <InfoCard title="Activity" className="lg:col-span-2">
          {/* Recent activity */}
        </InfoCard>
        <InfoCard title="Quick Actions">
          {/* Action buttons */}
        </InfoCard>
      </div>
    </div>
  );
}
```

---

## 📖 Further Reading

- **DESIGN_SYSTEM_GUIDE.md** - Complete design system documentation
- **DESIGN_PATTERNS_REFERENCE.md** - Code examples and patterns
- **UI_REDESIGN_CHECKLIST.md** - Implementation roadmap

---

**Last Updated**: January 22, 2026  
**Version**: 1.0
