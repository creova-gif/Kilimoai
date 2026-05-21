---
name: writing-plans
description: "Use when you have a spec or requirements for a multi-step KILIMO AI task, before touching code. Creates bite-sized, self-contained implementation plans."
---

# Writing KILIMO AI Implementation Plans

Write comprehensive implementation plans assuming the engineer has zero context for our codebase. Document everything they need to know: which files to touch, exact code, testing steps, and verification.

## Announcement

Start with: "I'm using the writing-plans skill to create the implementation plan."

## Save Location

`docs/plans/YYYY-MM-DD-<feature-name>.md`

## Plan Document Header

Every plan MUST start with this header:

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** Use frontend-developer, performance-engineer, or accessibility-tester skills as needed during implementation.

**Goal:** [One sentence describing what this builds for KILIMO AI farmers]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** React 18, TypeScript, Vite, Framer Motion, Tailwind CSS, Supabase

**Affected Areas:** [Components, hooks, types, i18n strings]

---
```

## Bite-Sized Task Granularity

Each step is one action (2-5 minutes):
- "Write the failing test" — step
- "Run it to make sure it fails" — step
- "Implement the minimal code to make the test pass" — step
- "Run the tests and make sure they pass" — step
- "Commit" — step

## Task Structure

```markdown
### Task N: [Component Name]

**Files:**
- Create: `src/components/ComponentName/index.tsx`
- Modify: `src/App.tsx:45-60`
- Test: `src/components/ComponentName/index.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
import { render, screen } from '@testing-library/react';
import ComponentName from './index';

test('renders greeting in English', () => {
  render(<ComponentName language="en" />);
  expect(screen.getByText('Welcome')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ComponentName.test.tsx`
Expected: FAIL with "Unable to find element"

- [ ] **Step 3: Write minimal implementation**

```typescript
export default function ComponentName({ language }: { language: string }) {
  return <div>{language === 'en' ? 'Welcome' : 'Karibu'}</div>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- ComponentName.test.tsx`
Expected: PASS

- [ ] **Step 5: Add Swahili test case**

- [ ] **Step 6: Commit**

```bash
git add src/components/ComponentName/
git commit -m "feat: add ComponentName with i18n support"
```
```

## KILIMO AI Specifics

- **i18n**: Every UI string must support both English and Swahili
- **Mobile-first**: Components must render correctly at 320px width
- **Animations**: Use Framer Motion; respect `prefers-reduced-motion`
- **Accessibility**: Touch targets >= 44px, proper ARIA labels
- **Error handling**: Network failures show farmer-friendly messages in active language
- **State**: Prefer local state; lift only when genuinely shared
- **Types**: Strict TypeScript — no `any` without justification comment

## No Placeholders

Plan failures — never write these:
- "TBD", "TODO", "implement later"
- "Add appropriate error handling" without specifics
- "Write tests for the above" without actual test code
- "Similar to Task N" — repeat the code
- Steps describing what to do without showing how

## Self-Review

After writing the plan:

1. **Spec coverage**: Can you point to a task for each requirement?
2. **Placeholder scan**: Fix any red flags
3. **Type consistency**: Do types match across tasks?
4. **i18n coverage**: Is every user-facing string bilingual?
5. **Mobile check**: Will this work on a 320px screen?

## Execution Handoff

After saving the plan, offer:

**"Plan complete and saved to `docs/plans/<filename>.md`. Ready to implement?"**

Then proceed task-by-task with the user.
