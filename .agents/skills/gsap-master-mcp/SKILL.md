---
name: gsap-master-mcp
description: Use when you need AI-powered GSAP animation creation, debugging, or optimization. Provides natural-language animation generation, full GSAP API coverage, performance optimization, and production-ready patterns via MCP server.
origin: bruzethegreat/gsap-master-mcp-server
---

# GSAP Master MCP Server

The most comprehensive GSAP MCP server — transforms the agent into a surgical precision animation expert with AI-powered intent analysis, complete API coverage, and production-ready patterns.

> All GSAP plugins are now 100% free thanks to Webflow — including SplitText, MorphSVG, DrawSVG, and more.

## When to Activate

- Creating GSAP animations from natural language descriptions
- Debugging animation performance issues (lag, stuttering, mobile problems)
- Setting up GSAP in a new project (React, Next.js, Vue, Vanilla)
- Optimizing existing animations for 60fps and mobile
- Implementing ScrollTrigger, SplitText, MorphSVG, DrawSVG, or Draggable
- Generating production-ready animation patterns (hero sections, page transitions, scroll reveals)

## Quick Start (MCP)

```bash
claude mcp add-json gsap-master '{"command":"npx","args":["bruzethegreat-gsap-master-mcp-server@latest"]}'
```

## 6 MCP Tools

### 1. `understand_and_create_animation`
Natural language → production GSAP code.

```
"Fade in portfolio cards one by one when scrolling"
"Create a hero title that reveals character by character"
"Build smooth hover effects for navigation"
```

Features: intent analysis, framework-specific output (React/Vue/Vanilla), mobile-optimized, 60fps guaranteed.

### 2. `get_gsap_api_expert`
Complete docs for every GSAP feature: core methods, all plugins, performance tips, advanced examples.

### 3. `generate_complete_setup`
One-command environment setup for React, Next.js, Vue, Nuxt, Svelte, or Vanilla — includes all plugins, dependencies, performance config, and starter code.

### 4. `debug_animation_issue`
AI-powered troubleshooting for: performance issues, mobile compatibility, ScrollTrigger positioning, timeline sequencing, plugin registration errors.

### 5. `optimize_for_performance`
Transform any animation for maximum smoothness: 60fps desktop, mobile-smooth variants, battery-efficient versions, memory leak prevention.

### 6. `create_production_pattern`
Battle-tested animation systems: hero sections, page transitions, scroll reveals, stagger effects, morphing SVGs.

## KILIMO AI Usage

KILIMO AI already has `gsap` and `@gsap/react` in `package.json`. Use this skill when:
- Building animated crop health dashboards
- Creating smooth page transitions between farmer screens
- Implementing scroll-triggered data reveals
- Animating weather or market price charts

## Key Patterns for React

```tsx
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function AnimatedCard() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".card", {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      }
    });
  }, { scope: container });

  return <div ref={container}>{/* cards */}</div>;
}
```

## Performance Rules

- Always use `transform` and `opacity` — never animate layout properties
- Register plugins once at app root, not per component
- Use `useGSAP` hook (not `useEffect`) for React — handles cleanup automatically
- Kill ScrollTrigger instances on unmount
- Use `will-change: transform` sparingly — only on actively animating elements
- Respect `prefers-reduced-motion` — wrap animations in a check

```ts
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefersReduced) {
  gsap.from(".hero", { opacity: 0, y: 40, duration: 0.8 });
}
```

## Vendor Reference

Full source: `vendor/GSAP/` and `vendor/gsap-master-mcp-server/`
