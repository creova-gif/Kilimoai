---
name: open-design
description: Use when designing UI artifacts, pitch decks, dashboards, landing pages, or any visual output. Open-source alternative to Claude Design — 16 coding-agent CLIs, 31 composable skills, 129+ design systems, local-first, BYOK.
origin: nexu-io/open-design
---

# Open Design

The open-source, local-first alternative to Claude Design. Wires 16 coding-agent CLIs into a skill-driven design workflow with 31 composable skills and 129+ design systems. No lock-in, no subscription, BYOK at every layer.

## When to Activate

- Designing UI screens, landing pages, dashboards, or mobile app layouts
- Creating pitch decks, reports, or marketing materials
- Generating design artifacts from natural language descriptions
- Auditing existing UI against design system standards
- Prototyping new KILIMO AI features before implementation
- Generating design tokens or component specs

## Supported Agents

Auto-detected on PATH: Claude Code, Codex, Cursor Agent, Gemini CLI, OpenCode, Kiro CLI, GitHub Copilot CLI, and 9 more.

## Quick Start

```bash
pnpm tools-dev   # starts daemon + web UI
```

Or deploy to Vercel for team access.

## 31 Built-in Skills

**Design mode:**
- `web-prototype` — interactive web prototype
- `saas-landing` — SaaS landing page
- `dashboard` — data dashboard
- `mobile-app` — mobile app screen
- `gamified-app` — gamified UI
- `social-carousel` — social media carousel
- `magazine-poster` — editorial poster
- `motion-frames` — animation storyboard
- `critique` — 5-dimensional design critique
- `wireframe-sketch` — low-fidelity wireframe

**Deck mode:**
- `guizang-ppt` — magazine-style pitch deck
- `simple-deck` — clean presentation
- `replit-deck` — developer-focused deck
- `weekly-update` — team update deck

**Operations:**
- `pm-spec`, `eng-runbook`, `finance-report`, `hr-onboarding`, `invoice`, `kanban-board`, `team-okrs`

## 5 Visual Directions

Each ships a deterministic OKLch palette + font stack:

| Direction | Character |
|---|---|
| Editorial Monocle | Sophisticated, magazine-grade |
| Modern Minimal | Clean, whitespace-first |
| Warm Soft | Approachable, human |
| Tech Utility | Functional, data-dense |
| Brutalist Experimental | Bold, unconventional |

## 129+ Design Systems

Includes Linear, Stripe, Vercel, Airbnb, Notion, Anthropic, Apple, Cursor, Supabase, Figma, and 119+ more — all available as context for the agent.

## KILIMO AI Usage

Use Open Design when:
- Designing new farmer-facing screens before writing React code
- Creating pitch materials for KILIMO AI investors
- Generating a design system audit of existing components
- Prototyping the onboarding flow for new farmers
- Building marketing assets for the app

## Workflow

1. Describe what you want in natural language
2. Agent presents 5 visual directions — pick one
3. A live plan streams into the UI
4. Agent builds a real on-disk project with templates and checklists
5. 5-dimensional self-critique runs automatically
6. Artifact renders in sandboxed iframe

## Vendor Reference

Full source: `vendor/open-design/`
Skills: `vendor/open-design/skills/`
Design systems: `vendor/open-design/design-systems/`
