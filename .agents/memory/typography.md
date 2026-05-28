---
name: Typography pairing
description: InstrumentSerif + Inter pairing rules across the app
---

## Rule
- **InstrumentSerif_400Regular** — page titles (PageScaffold), screen headers, large numeric stats (P&L values, transaction amounts, entry amounts), EmptyState titles
- **Inter_*Bold/SemiBold** — UI labels, buttons, filter tabs, section headers, badge text, chart axis labels
- **Inter_500Medium** — subtitles, muted body copy, helper text

**Why:** InstrumentSerif gives premium editorial feel to data-heavy screens; Inter keeps controls crisp and legible.

## How to apply
- `s.title` in any screen → `InstrumentSerif_400Regular`, fontSize 20–34, letterSpacing -0.3 to -0.5
- Monetary amounts → `InstrumentSerif_400Regular` fontSize 16–24
- CTA button text → keep Inter for clarity
- PageScaffold `title` prop renders in InstrumentSerif 34px automatically
