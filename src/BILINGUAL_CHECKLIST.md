# Quick Translation Implementation Checklist
**Use this checklist when adding bilingual support to any component**

---

## ✅ Pre-Implementation Checklist

### 1. Check Translation Dictionary
- [ ] Open `/utils/translations.ts`
- [ ] Verify translations exist for your component's text
- [ ] If missing, add new translations to appropriate category
- [ ] Update this checklist if you added new categories

### 2. Component Requirements
- [ ] Component needs to accept `language: "en" | "sw"` prop
- [ ] Component interface/props type updated
- [ ] All parent components pass language prop down

---

## 🔧 Implementation Steps

### Step 1: Update Component Props
```typescript
// Before
interface MyComponentProps {
  userId: string;
  data: any;
}

// After
interface MyComponentProps {
  userId: string;
  data: any;
  language: "en" | "sw";  // ← Add this
}

export function MyComponent({ userId, data, language }: MyComponentProps) {
  // Component code
}
```

### Step 2: Import Translations
```typescript
import { 
  commonTranslations,
  dashboardTranslations,
  // ... other categories as needed
  formatCurrency,  // if needed
  formatDate       // if needed
} from "../utils/translations";
```

### Step 3: Create Text Object
```typescript
export function MyComponent({ language, ...props }: MyComponentProps) {
  // Create text object at component top
  const text = {
    title: dashboardTranslations.dashboard[language],
    save: commonTranslations.save[language],
    cancel: commonTranslations.cancel[language],
    loading: commonTranslations.loading[language],
    // ... add all needed translations
  };

  // Rest of component logic
}
```

### Step 4: Replace Hardcoded Text
```tsx
// ❌ Before (hardcoded English)
<h1>Dashboard</h1>
<button>Save</button>
<button>Cancel</button>
<p>Loading...</p>

// ✅ After (using translations)
<h1>{text.title}</h1>
<button>{text.save}</button>
<button>{text.cancel}</button>
<p>{text.loading}</p>
```

### Step 5: Handle Dynamic Text
```typescript
// For text with variables
const text = {
  // Option 1: Template literals
  welcome: language === "en" 
    ? `Welcome back, ${userName}!` 
    : `Karibu tena, ${userName}!`,
  
  // Option 2: Functions (if complex)
  itemCount: (count: number) => 
    language === "en"
      ? `You have ${count} item${count !== 1 ? 's' : ''}`
      : `Una ${count} bidhaa`,
};

// Usage
<h1>{text.welcome}</h1>
<p>{text.itemCount(5)}</p>
```

### Step 6: Update Toast Messages
```typescript
// ❌ Before
toast.success("Changes saved successfully!");
toast.error("An error occurred");

// ✅ After
const messages = {
  saveSuccess: commonTranslations.saveSuccess[language],
  error: commonTranslations.errorOccurred[language],
};

toast.success(messages.saveSuccess);
toast.error(messages.error);
```

### Step 7: Format Numbers/Currency/Dates
```typescript
import { formatCurrency, formatDate, formatNumber } from "../utils/translations";

// In component
<p>Price: {formatCurrency(50000, language)}</p>
<p>Date: {formatDate(new Date(), language)}</p>
<p>Count: {formatNumber(1234567, language)}</p>
```

### Step 8: Pass Language to Child Components
```tsx
// Always pass language prop to children
<ChildComponent language={language} otherProp={value} />
<AnotherChild language={language} />
```

---

## 🧪 Testing Checklist

### Manual Testing
- [ ] Switch to English - all text displays in English
- [ ] Switch to Swahili - all text displays in Swahili
- [ ] No hardcoded English text remains visible
- [ ] Layout doesn't break with longer Swahili text
- [ ] Button labels are fully visible
- [ ] Form validation messages show in correct language
- [ ] Toast notifications show in correct language
- [ ] Modal/dialog text is translated
- [ ] Placeholder text is translated
- [ ] Error messages are translated
- [ ] Loading states show correct language

### Responsive Testing
- [ ] Test on mobile (< 640px width)
- [ ] Test on tablet (640px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Check text wrapping on small screens
- [ ] Verify abbreviations work on mobile if used

### Edge Cases
- [ ] Empty states show translated text
- [ ] Error states show translated text
- [ ] Loading skeletons/spinners have correct labels
- [ ] Tooltips are translated (if any)
- [ ] Confirmation dialogs are translated
- [ ] Success/warning banners are translated

---

## 📝 Common Patterns & Solutions

### Pattern 1: Lists with Dynamic Content
```typescript
const crops = ["Maize", "Rice", "Beans"];

// Create translations for list items
const cropTranslations = {
  maize: agriTermsTranslations.maize[language],
  rice: agriTermsTranslations.rice[language],
  beans: agriTermsTranslations.beans[language],
};

// Use in JSX
{crops.map(crop => (
  <li key={crop}>{cropTranslations[crop.toLowerCase()]}</li>
))}
```

### Pattern 2: Conditional Text
```typescript
const text = {
  status: task.completed 
    ? commonTranslations.completed[language]
    : commonTranslations.pending[language],
};

<span>{text.status}</span>
```

### Pattern 3: Pluralization
```typescript
const text = {
  itemCount: (count: number) => {
    if (language === "en") {
      return `${count} item${count !== 1 ? 's' : ''}`;
    } else {
      return `${count} bidhaa`;  // Swahili doesn't pluralize the same way
    }
  },
};
```

### Pattern 4: Form Fields
```typescript
const formText = {
  nameLabel: authTranslations.fullName[language],
  namePlaceholder: authTranslations.namePlaceholder[language],
  emailLabel: authTranslations.email[language],
  emailPlaceholder: authTranslations.emailPlaceholder[language],
  required: errorTranslations.required[language],
};

<label>{formText.nameLabel}</label>
<input placeholder={formText.namePlaceholder} />
{error && <span>{formText.required}</span>}
```

### Pattern 5: Tables
```typescript
const tableHeaders = {
  name: commonTranslations.name?.[language] || (language === "en" ? "Name" : "Jina"),
  date: commonTranslations.date?.[language] || (language === "en" ? "Date" : "Tarehe"),
  status: commonTranslations.status?.[language] || (language === "en" ? "Status" : "Hali"),
  actions: commonTranslations.actions?.[language] || (language === "en" ? "Actions" : "Vitendo"),
};

<thead>
  <tr>
    <th>{tableHeaders.name}</th>
    <th>{tableHeaders.date}</th>
    <th>{tableHeaders.status}</th>
    <th>{tableHeaders.actions}</th>
  </tr>
</thead>
```

---

## 🚫 Common Mistakes to Avoid

### ❌ Don't hardcode text
```tsx
// Bad
<h1>Dashboard</h1>
<button>Save</button>
```

### ❌ Don't forget to pass language prop
```tsx
// Bad
<ChildComponent userId={userId} />

// Good
<ChildComponent userId={userId} language={language} />
```

### ❌ Don't mix translation systems
```tsx
// Bad - mixing hardcoded and translated
<h1>{text.title}</h1>
<p>Some hardcoded English text</p>  // ← Wrong!

// Good - all translated
<h1>{text.title}</h1>
<p>{text.description}</p>
```

### ❌ Don't translate variable names or IDs
```tsx
// Bad
const cropId = language === "en" ? "maize" : "mahindi";  // Wrong!

// Good - IDs stay in English, only display text translates
const cropId = "maize";  // Always English
const cropName = agriTermsTranslations.maize[language];  // Display name
```

### ❌ Don't forget toast messages
```tsx
// Bad - toast still in English
onClick={() => {
  // ... some action
  toast.success("Action completed!");  // Wrong!
}}

// Good
const messages = {
  success: commonTranslations.success[language],
};

onClick={() => {
  // ... some action
  toast.success(messages.success);
}}
```

---

## 🎯 Priority Translation Order

### 1. High-Priority Text (Must translate)
- ✅ Page titles and headings
- ✅ Button labels
- ✅ Form labels and placeholders
- ✅ Error messages
- ✅ Success/failure toast messages
- ✅ Navigation labels
- ✅ Call-to-action text

### 2. Medium-Priority Text (Should translate)
- ⚠️ Descriptions and subtitles
- ⚠️ Help text and tooltips
- ⚠️ Empty state messages
- ⚠️ Table headers
- ⚠️ Card titles
- ⚠️ Modal dialog content

### 3. Low-Priority Text (Nice to translate)
- 💡 Technical labels (if user-facing)
- 💡 Debug information (if shown to users)
- 💡 Footer text
- 💡 Very rarely-seen text

---

## 📚 Quick Reference - Most Used Translations

### Navigation
```typescript
home: commonTranslations.home[language]
dashboard: dashboardTranslations.dashboard[language]
profile: settingsTranslations.profile[language]
settings: settingsTranslations.settings[language]
back: commonTranslations.back[language]
```

### Actions
```typescript
save: commonTranslations.save[language]
cancel: commonTranslations.cancel[language]
submit: commonTranslations.submit[language]
delete: commonTranslations.delete[language]
edit: commonTranslations.edit[language]
add: commonTranslations.add[language]
```

### Status
```typescript
loading: commonTranslations.loading[language]
success: commonTranslations.success[language]
error: commonTranslations.error[language]
pending: commonTranslations.pending[language]
completed: commonTranslations.completed[language]
```

### Messages
```typescript
saveSuccess: commonTranslations.saveSuccess[language]
errorOccurred: commonTranslations.errorOccurred[language]
confirmDelete: commonTranslations.confirmDelete[language]
noData: commonTranslations.noData[language]
```

---

## 🔄 Component Update Workflow

1. **Identify component** to update
2. **Check existing translations** in `/utils/translations.ts`
3. **Add language prop** to component interface
4. **Import translations** at top of file
5. **Create text object** inside component
6. **Replace all hardcoded text** with `{text.key}`
7. **Update toast messages** to use translations
8. **Pass language prop** to all child components
9. **Test in both languages** (EN and SW)
10. **Commit with clear message**: "Add bilingual support to [ComponentName]"

---

## 📊 Progress Tracking

### Components Completed
- ✅ DashboardHome
- ✅ WelcomeScreen
- ✅ LoginForm
- ✅ RegistrationForm
- ✅ MobileBottomNav
- ✅ (Add more as you complete them)

### Components In Progress
- 🟡 (List components currently being updated)

### Components Pending
- ⚪ AISupport (Next priority)
- ⚪ MarketPrices
- ⚪ WeatherCard
- ⚪ CropPlanningManagement
- ⚪ (List remaining components)

---

## 🆘 Troubleshooting

### Problem: Translation key doesn't exist
**Solution**: Add it to `/utils/translations.ts` in appropriate category

### Problem: Text too long, breaks layout
**Solution**: Use responsive CSS, consider abbreviations for mobile

### Problem: Language prop not received
**Solution**: Check parent component passes language prop down

### Problem: Toast still in English
**Solution**: Create messages object with translations, use in toast calls

### Problem: Date/number formatting incorrect
**Solution**: Use utility functions: `formatDate()`, `formatNumber()`, `formatCurrency()`

### Problem: Pluralization not working correctly
**Solution**: Use function-based translations for complex plural rules

---

## 📞 Support & Resources

- **Translation Dictionary**: `/utils/translations.ts`
- **Implementation Guide**: `/LANGUAGE_IMPLEMENTATION_GUIDE.md`
- **User Journeys**: `/USER_JOURNEY_MAPS.md`
- **Summary**: `/BILINGUAL_IMPLEMENTATION_SUMMARY.md`
- **This Checklist**: `/BILINGUAL_CHECKLIST.md`

---

**Last Updated**: January 22, 2026  
**Version**: 1.0  
**Maintained by**: KILIMO Development Team

---

## 🎉 Quick Start Example

Here's a complete mini-example to get you started:

```typescript
// 1. Import
import { commonTranslations, dashboardTranslations } from "../utils/translations";

// 2. Update interface
interface MyComponentProps {
  userId: string;
  language: "en" | "sw";  // ← Add this
}

// 3. Create text object
export function MyComponent({ userId, language }: MyComponentProps) {
  const text = {
    title: dashboardTranslations.dashboard[language],
    save: commonTranslations.save[language],
    cancel: commonTranslations.cancel[language],
  };

  // 4. Use in JSX
  return (
    <div>
      <h1>{text.title}</h1>
      <button>{text.save}</button>
      <button>{text.cancel}</button>
    </div>
  );
}
```

**That's it! Your component is now bilingual! 🎉**
