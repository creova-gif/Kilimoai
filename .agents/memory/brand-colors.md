---
name: Brand color system
description: Single green primary token rules; old tokens that must never reappear
---

## Rule
One and only one primary green: `#22d15a`. Shadow: `#0a3d18`.

**Why:** Previous codebase had 4+ competing greens (`#1A3B14`, `#2F5A27`, `#5DA035`, `#4B773E`) causing visual inconsistency. Mass-replaced with sed across 18+ files.

## Old tokens — permanently retired
- `#1A3B14` → `#22d15a`
- `rgba(26, 59, 20, ...)` → `rgba(34, 209, 90, ...)`
- `#5DA035` → `#22d15a`
- `#2F5A27` / `#2E5A27` → `#22d15a`
- `#4B773E` → `#22d15a`
- `rgba(58, 141, 82, ...)` → `rgba(34, 209, 90, ...)`

## Light mode backgrounds
- Cream/ivory `#FAF7F0` / `#F2ECE0` → clean green-tinted `#F0FAF2` / `#E6F5EB`

## How to apply
- Always import colors from `useTheme()`: `colors.primary`, `colors.background`, `colors.card`, `colors.text`, `colors.textMute`, `colors.border`
- Hardcode `#22d15a` only inside SVG charts (where hooks can't be used)
- `constants/FarmData.ts` nutrient color field uses `#22d15a`
