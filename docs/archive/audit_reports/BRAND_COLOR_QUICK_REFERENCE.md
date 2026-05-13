# 🎨 KILIMO Brand Color Quick Reference

## ⚡ TL;DR

```bash
# Check for violations
npm run enforce:colors

# Will run automatically on:
- git commit (pre-commit hook)
- git push (CI/CD)
- npm run build (build process)
```

---

## ✅ ALLOWED - Use These

### Primary Brand
```jsx
className="bg-[#2E7D32]"           // ✅ PRIMARY BRAND COLOR
className="text-[#2E7D32]"         // ✅ PRIMARY BRAND COLOR
className="border-[#2E7D32]"       // ✅ PRIMARY BRAND COLOR
```

### Brand Family
```jsx
className="bg-green-50"            // ✅ Light green backgrounds
className="bg-green-100"           // ✅ Subtle green backgrounds
className="bg-green-600"           // ✅ Green accents
className="text-green-700"         // ✅ Green text
className="border-green-200"       // ✅ Green borders
```

### Neutrals
```jsx
className="bg-gray-50"             // ✅ Backgrounds
className="bg-gray-100"            // ✅ Cards
className="text-gray-600"          // ✅ Secondary text
className="text-gray-900"          // ✅ Primary text
className="border-gray-200"        // ✅ Borders
className="bg-white"               // ✅ White backgrounds
```

### Semantic Colors (Use Sparingly)
```jsx
className="text-red-600"           // ✅ Errors only
className="bg-red-50"              // ✅ Error backgrounds
className="text-orange-600"        // ✅ Warnings only
className="bg-orange-100"          // ✅ Warning backgrounds
className="text-yellow-600"        // ✅ Caution states
```

---

## ❌ BLOCKED - Never Use

### Forbidden Colors
```jsx
className="bg-blue-500"            // ❌ BLOCKED
className="text-purple-600"        // ❌ BLOCKED
className="bg-indigo-400"          // ❌ BLOCKED
className="text-emerald-700"       // ❌ BLOCKED
className="bg-teal-500"            // ❌ BLOCKED
className="text-cyan-600"          // ❌ BLOCKED
className="bg-pink-400"            // ❌ BLOCKED
```

### Forbidden Gradients
```jsx
className="bg-gradient-to-r"                          // ❌ BLOCKED
className="from-green-400 to-emerald-600"             // ❌ BLOCKED
className="bg-gradient-to-br from-blue-500"           // ❌ BLOCKED
```

---

## 🔄 Common Replacements

### Headers
```jsx
// ❌ WRONG
<div className="bg-gradient-to-r from-green-600 to-emerald-600">

// ✅ CORRECT
<div className="bg-[#2E7D32]">
```

### Buttons
```jsx
// ❌ WRONG
<Button className="bg-blue-600 hover:bg-blue-700">

// ✅ CORRECT
<Button className="bg-[#2E7D32] hover:bg-green-700">
```

### Cards
```jsx
// ❌ WRONG
<Card className="bg-gradient-to-br from-green-50 to-blue-50">

// ✅ CORRECT
<Card className="bg-green-50">
```

### Badges
```jsx
// ❌ WRONG
<Badge className="bg-emerald-100 text-emerald-700">

// ✅ CORRECT
<Badge className="bg-green-100 text-green-700">
```

### Icons
```jsx
// ❌ WRONG
<Icon className="text-blue-600" />

// ✅ CORRECT
<Icon className="text-gray-600" />  // For neutral icons
<Icon className="text-[#2E7D32]" /> // For brand icons
```

---

## 🚨 If Build Fails

### Step 1: Check Output
```bash
npm run enforce:colors
```

### Step 2: Find Violations
Look for lines like:
```
📁 /components/YourComponent.tsx
   Line 45: bg-blue-500
   → <div className="bg-blue-500 p-4">
```

### Step 3: Fix Violations
Replace blocked colors with allowed colors:
- `blue-*` → `gray-*` or `#2E7D32`
- `emerald-*` → `green-*`
- `teal-*` → `gray-*` or `green-*`
- `pink-*` → `gray-*` or `red-*` (errors only)
- Remove all gradients

### Step 4: Verify Fix
```bash
npm run enforce:colors
# Should show: ✅ CI RULE ACTIVE: No color violations detected.
```

---

## 📋 Cheat Sheet

| Use Case | Allowed | Blocked |
|----------|---------|---------|
| Primary actions | `bg-[#2E7D32]` | `bg-blue-*` |
| Headers | `bg-[#2E7D32]` | `bg-gradient-*` |
| Backgrounds | `bg-gray-50`, `bg-green-50` | `bg-blue-50` |
| Text (primary) | `text-gray-900` | `text-blue-900` |
| Text (secondary) | `text-gray-600` | `text-purple-600` |
| Success states | `text-green-600` | `text-emerald-600` |
| Warning states | `text-orange-600` | `text-yellow-500` |
| Error states | `text-red-600` | `text-pink-600` |
| Borders | `border-gray-200`, `border-green-200` | `border-blue-200` |
| Icons | `text-gray-600`, `text-[#2E7D32]` | `text-teal-600` |

---

## 🎯 Golden Rules

1. **One primary color**: `#2E7D32` (Raspberry Leaf Green)
2. **Neutrals everywhere**: Use `gray-*` and `white` for 90% of UI
3. **No gradients**: Use solid colors only
4. **Semantic colors**: `red`/`orange`/`yellow` for errors/warnings ONLY
5. **When in doubt**: Use `gray-*`

---

## ✅ Status

```
🔒 CI RULE ACTIVE
❌ NO REGRESSIONS POSSIBLE
✅ 100% COLOR LOCK MAINTAINED
```

---

**Questions?** See `/COLOR_LOCK_ENFORCEMENT.md` for full documentation.
