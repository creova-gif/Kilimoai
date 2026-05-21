---
name: ui-ux-pro-max
description: Use for UI/UX design tasks requiring professional-grade output — design system generation, style selection, color palettes, typography, accessibility audits, and chart design. 67 UI styles, 161 color palettes, 57 font pairings, 99 UX guidelines, 25 chart types across 15+ tech stacks.
origin: nextlevelbuilder/ui-ux-pro-max-skill
version: 2.5.0
---

# UI/UX Pro Max

AI-powered design intelligence for building professional UI/UX across multiple platforms and frameworks. 67 UI styles, 161 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types.

Homepage: [uupm.cc](https://uupm.cc)

## When to Activate

- Generating a complete design system for a new feature
- Selecting a UI style and color palette for KILIMO AI screens
- Auditing existing UI for design consistency
- Choosing typography for bilingual (English/Swahili) content
- Designing data visualizations (crop yields, weather, market prices)
- Any task requiring professional-grade visual design decisions

## Install

```bash
npx uipro-cli init --ai kiro
```

Or for other platforms: `--ai claude`, `--ai cursor`, `--ai copilot`, etc.

## Core Capabilities

### Design System Generator (v2.0 flagship)
Analyzes project requirements and generates a complete, tailored design system:
- Pattern selection (Hero-Centric, Card Grid, Dashboard, etc.)
- Style recommendation from 67 UI styles
- Color palette from 161 options
- Typography pairing from 57 font combinations
- Accessibility rating (WCAG AA/AAA)

### 67 UI Styles
Includes: Soft UI Evolution, Glassmorphism, Neumorphism, Material Design 3, Brutalism, Minimalism, Agricultural/Earthy, and 60+ more.

### 161 Color Palettes
Organized by mood, industry, and accessibility rating. Includes palettes optimized for:
- High contrast (outdoor use in bright sunlight)
- Agricultural/nature themes
- Trust and reliability (financial data)
- Warm and approachable (farmer-facing UI)

### 57 Font Pairings
Includes pairings optimized for:
- Bilingual content (Latin + extended character sets)
- Mobile readability at small sizes
- High contrast on varied backgrounds

### 99 UX Guidelines
Covers: mobile-first, touch targets, form design, error states, empty states, loading states, onboarding, and more.

### 25 Chart Types
Data visualization patterns for: bar, line, area, pie, donut, scatter, heatmap, treemap, and agricultural-specific charts.

## KILIMO AI Usage

```
/ui-ux-pro-max generate --project "KILIMO AI farmer dashboard"
  --constraints "mobile-first, outdoor use, bilingual EN/SW, low-bandwidth"
  --style "warm-approachable"
```

Use when:
- Designing the crop health monitoring screen
- Creating the market price dashboard
- Designing the farmer onboarding flow
- Selecting colors for weather condition indicators
- Choosing typography for Swahili content

## Supported Platforms

Claude Code, Cursor, Windsurf, Copilot, Kiro, RooCode, KiloCode, Codex, Qoder, Gemini, Trae, OpenCode, Continue, Warp, Augment, Antigravity.

## Source

Full source: `.agents/skills/ui-ux-pro-max/`
CLI: `.agents/skills/ui-ux-pro-max/cli/`
Docs: `.agents/skills/ui-ux-pro-max/docs/`
