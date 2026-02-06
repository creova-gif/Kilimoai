# Language Support - Quick Reference Card

## 🚀 Quick Start (Copy & Paste)

### 1. Component Props Interface
```typescript
interface YourComponentProps {
  language: "en" | "sw";
  // ... other props
}
```

### 2. Basic Text Object
```typescript
const text = {
  en: {
    title: "Your Title",
    button: "Click Me",
    message: "Success!",
  },
  sw: {
    title: "Kichwa Chako",
    button: "Bonyeza Hapa",
    message: "Mafanikio!",
  }
};
```

### 3. Usage in JSX
```typescript
<h1>{text[language].title}</h1>
<button>{text[language].button}</button>
```

## 📋 Common Translations

| English | Swahili | Context |
|---------|---------|---------|
| Dashboard | Dashibodi | Main page |
| Save | Hifadhi | Button |
| Cancel | Ghairi | Button |
| Delete | Futa | Button |
| Edit | Hariri | Button |
| View | Tazama | Button |
| Search | Tafuta | Action |
| Loading | Inapakia | Status |
| Success | Mafanikio | Message |
| Error | Hitilafu | Message |
| Farm | Shamba | Agriculture |
| Crop | Zao | Agriculture |
| Crops | Mazao | Agriculture |
| Harvest | Mavuno | Agriculture |
| Market | Soko | Commerce |
| Price | Bei | Commerce |
| Weather | Hali ya Hewa | Weather |
| Today | Leo | Time |
| Tomorrow | Kesho | Time |
| Week | Wiki | Time |
| Month | Mwezi | Time |

## ✅ Checklist for New Components

- [ ] Add `language: "en" | "sw"` to props interface
- [ ] Create bilingual text object with matching keys
- [ ] Replace all hardcoded text with `text[language].key`
- [ ] Test component in both English and Swahili
- [ ] Verify layout works with longer Swahili text
- [ ] Pass `language` prop to all child components

## 🔧 Dynamic Text with Variables

```typescript
const text = {
  en: {
    greeting: (name: string) => `Hello, ${name}!`,
    count: (n: number) => `${n} item${n !== 1 ? 's' : ''}`,
  },
  sw: {
    greeting: (name: string) => `Habari, ${name}!`,
    count: (n: number) => `Bidhaa ${n}`,
  }
};

// Usage
<h1>{text[language].greeting(userName)}</h1>
<p>{text[language].count(items.length)}</p>
```

## 🎨 Toast Messages

```typescript
import { toast } from "sonner@2.0.3";

const msg = {
  en: { success: "Saved successfully!", error: "Failed to save" },
  sw: { success: "Imehifadhiwa!", error: "Imeshindwa kuhifadhi" }
};

toast.success(msg[language].success);
toast.error(msg[language].error);
```

## 📅 Date Formatting

```typescript
const formatDate = (date: Date, language: "en" | "sw") => {
  const locale = language === "en" ? "en-US" : "sw-TZ";
  return date.toLocaleDateString(locale, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};
```

## 💰 Currency Formatting

```typescript
const formatCurrency = (amount: number, language: "en" | "sw") => {
  const locale = language === "en" ? "en-US" : "sw-TZ";
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'TZS',
  }).format(amount);
};
```

## 📝 Form Example

```typescript
const formText = {
  en: {
    name: { label: "Full Name", placeholder: "Enter your name" },
    email: { label: "Email", placeholder: "your.email@example.com" },
    submit: "Submit",
  },
  sw: {
    name: { label: "Jina Kamili", placeholder: "Weka jina lako" },
    email: { label: "Barua Pepe", placeholder: "barua.pepe@mfano.com" },
    submit: "Wasilisha",
  }
};

return (
  <form>
    <label>{formText[language].name.label}</label>
    <input placeholder={formText[language].name.placeholder} />
    <button>{formText[language].submit}</button>
  </form>
);
```

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T
```typescript
// Hardcoded text
<h1>Dashboard</h1>

// Missing language prop
export function MyComponent({ userId }: Props) {
  return <h1>Dashboard</h1>;
}

// Incomplete translations
const text = {
  en: { title: "Dashboard", save: "Save" },
  sw: { title: "Dashibodi" } // Missing 'save'
};
```

### ✅ DO
```typescript
// Use text object
<h1>{text[language].title}</h1>

// Accept language prop
export function MyComponent({ userId, language }: Props) {
  const text = { 
    en: { title: "Dashboard" }, 
    sw: { title: "Dashibodi" } 
  };
  return <h1>{text[language].title}</h1>;
}

// Complete translations
const text = {
  en: { title: "Dashboard", save: "Save" },
  sw: { title: "Dashibodi", save: "Hifadhi" }
};
```

## 🔗 Quick Links

- **Full Guide**: `/LANGUAGE_IMPLEMENTATION_GUIDE.md`
- **Fix Documentation**: `/LANGUAGE_CONSISTENCY_FIX.md`
- **Summary**: `/LANGUAGE_FIX_SUMMARY.md`
- **Example Components**: 
  - AISupport: `/components/AISupport.tsx`
  - FAQ: `/components/FAQ.tsx`
  - VideoTutorials: `/components/VideoTutorials.tsx`

## 🆘 Need Help?

1. Check the Language Implementation Guide
2. Look at example components (AISupport, FAQ, VideoTutorials)
3. Use this quick reference for common patterns
4. Test in both languages before committing

## 📊 Status Check

✅ **All 62 components in App.tsx now receive `language={language}` prop**

Next step: Implement internal language support in each component

---

**Last Updated**: January 21, 2026  
**Print this page**: Keep it handy while coding! 📌
