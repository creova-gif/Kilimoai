# Language Implementation Guide for KILIMO Components

## Overview
This guide helps developers implement bilingual (English/Swahili) support in KILIMO components.

## Quick Start

### 1. Accept the Language Prop
```typescript
interface YourComponentProps {
  language: "en" | "sw";
  // ... other props
}

export function YourComponent({ language }: YourComponentProps) {
  // Component code
}
```

### 2. Define Bilingual Text Object
```typescript
const text = {
  en: {
    title: "Crop Planning",
    subtitle: "Manage your crops efficiently",
    saveButton: "Save Changes",
    cancelButton: "Cancel",
    successMessage: "Changes saved successfully!",
  },
  sw: {
    title: "Mipango ya Mazao",
    subtitle: "Simamia mazao yako kwa ufanisi",
    saveButton: "Hifadhi Mabadiliko",
    cancelButton: "Ghairi",
    successMessage: "Mabadiliko yamehifadhiwa kikamilifu!",
  }
};
```

### 3. Use in JSX
```typescript
return (
  <div>
    <h1>{text[language].title}</h1>
    <p>{text[language].subtitle}</p>
    <button>{text[language].saveButton}</button>
  </div>
);
```

## Advanced Patterns

### Dynamic Text with Variables
```typescript
const text = {
  en: {
    welcome: (name: string) => `Welcome back, ${name}!`,
    itemCount: (count: number) => `You have ${count} item${count !== 1 ? 's' : ''}`,
  },
  sw: {
    welcome: (name: string) => `Karibu tena, ${name}!`,
    itemCount: (count: number) => `Una ${count} bidhaa`,
  }
};

// Usage
<h1>{text[language].welcome(user.name)}</h1>
<p>{text[language].itemCount(items.length)}</p>
```

### Nested Text Objects (for larger components)
```typescript
const text = {
  en: {
    header: {
      title: "Dashboard",
      subtitle: "Overview of your farm",
    },
    stats: {
      crops: "Active Crops",
      tasks: "Pending Tasks",
      revenue: "Monthly Revenue",
    },
    actions: {
      addCrop: "Add New Crop",
      viewReports: "View Reports",
    }
  },
  sw: {
    header: {
      title: "Dashibodi",
      subtitle: "Muhtasari wa shamba lako",
    },
    stats: {
      crops: "Mazao Yanayoendelea",
      tasks: "Kazi Zinazosubiri",
      revenue: "Mapato ya Mwezi",
    },
    actions: {
      addCrop: "Ongeza Zao Jipya",
      viewReports: "Tazama Ripoti",
    }
  }
};

// Usage
<h1>{text[language].header.title}</h1>
<button>{text[language].actions.addCrop}</button>
```

### Date and Number Formatting
```typescript
// Date formatting
const formatDate = (date: Date, language: "en" | "sw") => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const locale = language === "en" ? "en-US" : "sw-TZ";
  return date.toLocaleDateString(locale, options);
};

// Number formatting
const formatNumber = (num: number, language: "en" | "sw") => {
  const locale = language === "en" ? "en-US" : "sw-TZ";
  return num.toLocaleString(locale);
};

// Currency formatting
const formatCurrency = (amount: number, language: "en" | "sw") => {
  const locale = language === "en" ? "en-US" : "sw-TZ";
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'TZS',
  }).format(amount);
};
```

### Toast Messages
```typescript
import { toast } from "sonner@2.0.3";

const messages = {
  en: {
    success: "Operation completed successfully!",
    error: "An error occurred. Please try again.",
    warning: "Please review your input.",
  },
  sw: {
    success: "Mchakato umekamilika kikamilifu!",
    error: "Hitilafu imetokea. Tafadhali jaribu tena.",
    warning: "Tafadhali kagua ulichoweka.",
  }
};

// Usage
toast.success(messages[language].success);
toast.error(messages[language].error);
```

### Form Labels and Placeholders
```typescript
const formText = {
  en: {
    fields: {
      name: { label: "Full Name", placeholder: "Enter your full name" },
      email: { label: "Email Address", placeholder: "your.email@example.com" },
      phone: { label: "Phone Number", placeholder: "+255 XXX XXX XXX" },
    },
    validation: {
      required: "This field is required",
      invalidEmail: "Please enter a valid email address",
      invalidPhone: "Please enter a valid phone number",
    }
  },
  sw: {
    fields: {
      name: { label: "Jina Kamili", placeholder: "Weka jina lako kamili" },
      email: { label: "Barua Pepe", placeholder: "barua.pepe@mfano.com" },
      phone: { label: "Nambari ya Simu", placeholder: "+255 XXX XXX XXX" },
    },
    validation: {
      required: "Sehemu hii inahitajika",
      invalidEmail: "Tafadhali weka barua pepe sahihi",
      invalidPhone: "Tafadhali weka nambari ya simu sahihi",
    }
  }
};

// Usage in form
<label>{formText[language].fields.name.label}</label>
<input placeholder={formText[language].fields.name.placeholder} />
```

## Common Translations Reference

### UI Elements
| English | Swahili |
|---------|---------|
| Dashboard | Dashibodi |
| Home | Nyumbani |
| Profile | Wasifu |
| Settings | Mipangilio |
| Search | Tafuta |
| Filter | Chuja |
| Sort | Panga |
| View | Tazama |
| Edit | Hariri |
| Delete | Futa |
| Save | Hifadhi |
| Cancel | Ghairi |
| Submit | Wasilisha |
| Back | Rudi |
| Next | Ifuatayo |
| Previous | Iliyotangulia |
| Loading | Inapakia |
| Success | Mafanikio |
| Error | Hitilafu |
| Warning | Onyo |

### Agriculture Terms
| English | Swahili |
|---------|---------|
| Farm | Shamba |
| Crop | Zao |
| Crops | Mazao |
| Planting | Kupanda |
| Harvest | Mavuno |
| Soil | Udongo |
| Weather | Hali ya Hewa |
| Market | Soko |
| Price | Bei |
| Livestock | Mifugo |
| Fertilizer | Mbolea |
| Pesticide | Dawa ya Wadudu |
| Irrigation | Umwagiliaji |
| Seed | Mbegu |
| Season | Msimu |

### Time and Date
| English | Swahili |
|---------|---------|
| Today | Leo |
| Yesterday | Jana |
| Tomorrow | Kesho |
| Week | Wiki |
| Month | Mwezi |
| Year | Mwaka |
| Day | Siku |
| Morning | Asubuhi |
| Afternoon | Mchana |
| Evening | Jioni |
| Night | Usiku |

### Actions
| English | Swahili |
|---------|---------|
| Add | Ongeza |
| Create | Unda |
| Update | Sasisha |
| Remove | Ondoa |
| Share | Shiriki |
| Download | Pakua |
| Upload | Pakia |
| Print | Chapa |
| Export | Hamisha |
| Import | Leta |

## Best Practices

### 1. Keep Text Objects at Component Top
```typescript
export function MyComponent({ language }: Props) {
  // ✅ Define text at the top
  const text = {
    en: { /* ... */ },
    sw: { /* ... */ }
  };
  
  // Rest of component logic
}
```

### 2. Use Consistent Key Names
```typescript
// ✅ Good - consistent keys
const text = {
  en: { title: "Dashboard", save: "Save" },
  sw: { title: "Dashibodi", save: "Hifadhi" }
};

// ❌ Avoid - inconsistent keys
const text = {
  en: { title: "Dashboard", save: "Save" },
  sw: { heading: "Dashibodi", hifadhi: "Hifadhi" }
};
```

### 3. Extract Large Text Objects
For components with extensive text, create a separate file:

```typescript
// texts/dashboardTexts.ts
export const dashboardTexts = {
  en: {
    header: { /* ... */ },
    sidebar: { /* ... */ },
    content: { /* ... */ },
  },
  sw: {
    header: { /* ... */ },
    sidebar: { /* ... */ },
    content: { /* ... */ },
  }
};

// Dashboard.tsx
import { dashboardTexts } from './texts/dashboardTexts';

export function Dashboard({ language }: Props) {
  const text = dashboardTexts[language];
  // Use text throughout component
}
```

### 4. Handle Missing Translations
```typescript
const text = {
  en: { title: "Dashboard", newFeature: "New Feature" },
  sw: { title: "Dashibodi" } // Missing newFeature translation
};

// Safe access with fallback
const getText = (key: string) => {
  return text[language][key] || text["en"][key] || key;
};
```

### 5. Pass Language to Child Components
```typescript
export function ParentComponent({ language }: Props) {
  return (
    <div>
      <ChildComponent1 language={language} />
      <ChildComponent2 language={language} />
    </div>
  );
}
```

## Testing Language Support

### Manual Testing Checklist
- [ ] All visible text changes when switching language
- [ ] Buttons and labels display correctly
- [ ] Form validation messages appear in correct language
- [ ] Toast notifications show in correct language
- [ ] Dates and numbers format correctly
- [ ] No hardcoded English text remains
- [ ] Layout doesn't break with longer Swahili text
- [ ] Special characters (like "ñ" in Swahili) display correctly

### Component Testing Example
```typescript
// Test both languages render correctly
describe('MyComponent', () => {
  it('renders in English', () => {
    render(<MyComponent language="en" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders in Swahili', () => {
    render(<MyComponent language="sw" />);
    expect(screen.getByText('Dashibodi')).toBeInTheDocument();
  });
});
```

## Common Pitfalls to Avoid

### ❌ Hardcoded Text
```typescript
// Bad
<h1>Dashboard</h1>
<button>Save</button>

// Good
<h1>{text[language].title}</h1>
<button>{text[language].save}</button>
```

### ❌ Missing Language Prop
```typescript
// Bad - component doesn't accept language
export function MyComponent({ userId }: Props) {
  return <h1>Dashboard</h1>;
}

// Good
export function MyComponent({ userId, language }: Props) {
  const text = { en: { title: "Dashboard" }, sw: { title: "Dashibodi" } };
  return <h1>{text[language].title}</h1>;
}
```

### ❌ Incomplete Translations
```typescript
// Bad - missing Swahili translations
const text = {
  en: { title: "Dashboard", subtitle: "Welcome", save: "Save" },
  sw: { title: "Dashibodi" } // Missing subtitle and save
};

// Good - complete translations
const text = {
  en: { title: "Dashboard", subtitle: "Welcome", save: "Save" },
  sw: { title: "Dashibodi", subtitle: "Karibu", save: "Hifadhi" }
};
```

## Getting Help

### Resources
- See `/AI_ARCHITECTURE_MASTER_GUIDE.md` for AI system language integration
- See `/LANGUAGE_CONSISTENCY_FIX.md` for list of all language-supported components
- Check existing components like `AISupport`, `FAQ`, or `VideoTutorials` for implementation examples

### Translation Help
- Use Google Translate as a starting point
- Verify agricultural terminology with Tanzanian farmers or extension officers
- Keep a glossary of common terms for consistency

## Priority Implementation Order

Implement language support in this order:
1. **High Priority**: User-facing pages users visit daily (Dashboard, Market, Weather, AI Chat)
2. **Medium Priority**: Farm management tools (Crop Planning, Livestock, Tasks)
3. **Low Priority**: Admin/diagnostic tools (System Diagnostics, Master Prompts)

---

Last Updated: January 21, 2026
