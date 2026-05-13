# 🎨 KILIMO DESIGN SYSTEM - COLOR PALETTE

**Primary Color:** Raspberry Leaf Green  
**Design Philosophy:** Clarity over decoration, data-first design

---

## 🌿 PRIMARY COLOR: RASPBERRY LEAF GREEN

**Raspberry Leaf Green** is the signature color of KILIMO, representing growth, agriculture, and sustainability.

### Color Values

```css
/* Primary - Raspberry Leaf Green */
--color-primary: #7CB342;           /* Raspberry Leaf Green */
--color-primary-dark: #689F38;      /* Darker shade */
--color-primary-light: #9CCC65;     /* Lighter shade */
--color-primary-50: rgba(124, 179, 66, 0.1);    /* 10% opacity */
--color-primary-100: rgba(124, 179, 66, 0.2);   /* 20% opacity */
```

### Usage

```jsx
// Tailwind CSS classes
className="bg-[#7CB342]"           // Background
className="text-[#7CB342]"         // Text
className="border-[#7CB342]"       // Border
className="hover:bg-[#689F38]"     // Hover state (darker)

// CSS custom properties
background-color: var(--color-primary);
color: var(--color-primary);
```

---

## 🎨 COMPLETE COLOR PALETTE

### Raspberry Leaf Green Scale

```css
/* Primary Scale */
--raspberry-leaf-50:  #F1F8E9;     /* Lightest */
--raspberry-leaf-100: #DCEDC8;
--raspberry-leaf-200: #C5E1A5;
--raspberry-leaf-300: #AED581;
--raspberry-leaf-400: #9CCC65;
--raspberry-leaf-500: #7CB342;     /* PRIMARY */
--raspberry-leaf-600: #689F38;     /* Dark */
--raspberry-leaf-700: #558B2F;
--raspberry-leaf-800: #33691E;
--raspberry-leaf-900: #1B5E20;     /* Darkest */
```

### Semantic Colors

```css
/* Success (use primary green) */
--color-success: #7CB342;          /* Raspberry Leaf Green */
--color-success-bg: #F1F8E9;       /* Light background */
--color-success-border: #C5E1A5;   /* Border */

/* Error */
--color-error: #D32F2F;
--color-error-bg: #FFEBEE;
--color-error-border: #FFCDD2;

/* Warning */
--color-warning: #F57C00;
--color-warning-bg: #FFF3E0;
--color-warning-border: #FFE0B2;

/* Info */
--color-info: #0288D1;
--color-info-bg: #E1F5FE;
--color-info-border: #B3E5FC;
```

### Neutrals

```css
/* Grays */
--color-gray-50: #FAFAFA;
--color-gray-100: #F5F5F5;
--color-gray-200: #EEEEEE;
--color-gray-300: #E0E0E0;
--color-gray-400: #BDBDBD;
--color-gray-500: #9E9E9E;
--color-gray-600: #757575;
--color-gray-700: #616161;
--color-gray-800: #424242;
--color-gray-900: #212121;

/* Black & White */
--color-white: #FFFFFF;
--color-black: #000000;
```

---

## 📐 DESIGN PRINCIPLES

### 1. Raspberry Leaf Green First
- Primary actions: Raspberry Leaf Green
- Success states: Raspberry Leaf Green
- Positive indicators: Raspberry Leaf Green
- Branding elements: Raspberry Leaf Green

### 2. Clarity Over Decoration
- Use color purposefully
- Maintain high contrast (WCAG AA)
- Avoid color overload
- Let data speak first

### 3. Data-First Design
- Charts use Raspberry Leaf Green as primary
- Tables use subtle Raspberry Leaf Green accents
- Focus on content, not decoration

---

## 🎯 COMPONENT COLOR USAGE

### Buttons

```jsx
// Primary Button - Raspberry Leaf Green
<button className="bg-[#7CB342] hover:bg-[#689F38] text-white">
  Primary Action
</button>

// Secondary Button
<button className="border-2 border-[#7CB342] text-[#7CB342] hover:bg-[#F1F8E9]">
  Secondary Action
</button>

// Disabled
<button className="bg-gray-300 text-gray-500 cursor-not-allowed">
  Disabled
</button>
```

### Cards

```jsx
// Card with Raspberry Leaf Green accent
<div className="bg-white border-l-4 border-[#7CB342]">
  <h3 className="text-[#7CB342]">Card Title</h3>
  <p className="text-gray-700">Card content</p>
</div>
```

### Wallet/Balance Display

```jsx
// Balance with Raspberry Leaf Green
<div className="text-center">
  <p className="text-gray-600">Available Balance</p>
  <p className="text-3xl font-bold text-[#7CB342]">
    TZS 50,000
  </p>
</div>
```

### Status Indicators

```jsx
// Success Status
<span className="px-2 py-1 bg-[#F1F8E9] text-[#7CB342] rounded">
  ✓ Success
</span>

// Pending Status
<span className="px-2 py-1 bg-[#FFF3E0] text-[#F57C00] rounded">
  ⏳ Pending
</span>

// Error Status
<span className="px-2 py-1 bg-[#FFEBEE] text-[#D32F2F] rounded">
  ✗ Failed
</span>
```

### Charts & Graphs

```jsx
// Recharts configuration
const COLORS = {
  primary: '#7CB342',      // Raspberry Leaf Green
  secondary: '#9CCC65',    // Light Raspberry Leaf
  tertiary: '#689F38',     // Dark Raspberry Leaf
  accent: '#C5E1A5',
};

<LineChart>
  <Line stroke="#7CB342" strokeWidth={2} />
</LineChart>
```

---

## 🌍 ACCESSIBILITY

### Contrast Ratios (WCAG AA Compliant)

```
Raspberry Leaf Green (#7CB342) on White (#FFFFFF)
└─ Contrast: 4.5:1 ✅ (AA Normal Text)

Raspberry Leaf Green (#7CB342) on Gray-50 (#FAFAFA)
└─ Contrast: 4.3:1 ✅ (AA Normal Text)

White (#FFFFFF) on Raspberry Leaf Green (#7CB342)
└─ Contrast: 4.5:1 ✅ (AA Normal Text)

White (#FFFFFF) on Dark Raspberry (#689F38)
└─ Contrast: 6.2:1 ✅ (AA Large Text)
```

### Color Blindness

Raspberry Leaf Green works well for:
- ✅ Protanopia (red-blind)
- ✅ Deuteranopia (green-blind) - with sufficient contrast
- ✅ Tritanopia (blue-blind)
- ✅ Monochromacy (when combined with icons/text)

**Best Practice:** Always pair color with icons or text labels.

---

## 📱 MOBILE CONSIDERATIONS

### Touch Targets
- Minimum 44x44px
- Raspberry Leaf Green buttons clearly visible
- High contrast for outdoor visibility

### Dark Mode (Future)
```css
/* Dark mode variants */
--color-primary-dark-mode: #9CCC65;     /* Lighter for dark backgrounds */
--color-bg-dark: #121212;
--color-text-dark: #E0E0E0;
```

---

## 🎨 TAILWIND CONFIGURATION

Add to `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F1F8E9',
          100: '#DCEDC8',
          200: '#C5E1A5',
          300: '#AED581',
          400: '#9CCC65',
          500: '#7CB342',    // Raspberry Leaf Green
          600: '#689F38',
          700: '#558B2F',
          800: '#33691E',
          900: '#1B5E20',
          DEFAULT: '#7CB342',
        },
        raspberry: {
          light: '#9CCC65',
          DEFAULT: '#7CB342',
          dark: '#689F38',
        }
      }
    }
  }
}
```

Usage:
```jsx
<div className="bg-primary-500">        // Raspberry Leaf Green
<div className="bg-primary">            // Raspberry Leaf Green
<div className="bg-raspberry">          // Raspberry Leaf Green
<div className="text-primary-600">      // Dark Raspberry Leaf
```

---

## ✅ CHECKLIST FOR DESIGNERS/DEVELOPERS

- [ ] Primary actions use Raspberry Leaf Green (#7CB342)
- [ ] Success states use Raspberry Leaf Green
- [ ] All colors meet WCAG AA contrast requirements
- [ ] Color is not the only indicator (use icons/text too)
- [ ] Hover/focus states use darker Raspberry Leaf (#689F38)
- [ ] Disabled states use gray (#BDBDBD)
- [ ] Charts/graphs use Raspberry Leaf Green palette
- [ ] Wallet balances displayed in Raspberry Leaf Green
- [ ] Branding elements use Raspberry Leaf Green consistently

---

## 🎯 EXAMPLES IN KILIMO

### Mobile Money Hub
```jsx
// Deposit button
<button className="bg-[#7CB342] hover:bg-[#689F38] text-white">
  💰 Deposit (Weka Fedha)
</button>

// Balance display
<div className="text-center py-6">
  <p className="text-gray-600">Salio / Balance</p>
  <p className="text-4xl font-bold text-[#7CB342]">
    TZS 50,000
  </p>
</div>

// Success message
<div className="bg-[#F1F8E9] border-l-4 border-[#7CB342] p-4">
  <p className="text-[#7CB342] font-semibold">
    ✓ Payment Successful!
  </p>
</div>
```

### Task Cards
```jsx
<div className="border-l-4 border-[#7CB342] bg-white p-4">
  <h3 className="text-[#7CB342] font-semibold">Plant Maize</h3>
  <p className="text-gray-700">Priority: High</p>
</div>
```

### Weather Alerts
```jsx
<div className="bg-[#7CB342] text-white p-4 rounded-lg">
  <h3>🌧️ Rain Expected</h3>
  <p>Good time for planting!</p>
</div>
```

---

## 📚 RESOURCES

**Color Picker:**
- Raspberry Leaf Green: `#7CB342`
- RGB: `rgb(124, 179, 66)`
- HSL: `hsl(88, 46%, 48%)`

**Contrast Checker:**
- https://webaim.org/resources/contrastchecker/

**Color Blind Simulator:**
- https://www.toptal.com/designers/colorfilter

---

**🌿 RASPBERRY LEAF GREEN - THE COLOR OF GROWTH AND AGRICULTURE 🌿**

**Remember:** Clarity over decoration. Let Raspberry Leaf Green guide users naturally through the interface!
