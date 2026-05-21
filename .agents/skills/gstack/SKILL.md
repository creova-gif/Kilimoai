---
name: gstack
description: Use when you need a virtual engineering team for code review, QA, design critique, security audits, architecture planning, or release automation. Garry Tan's (YC CEO) open-source AI software factory — 23 specialist roles as slash commands.
origin: garrytan/gstack
---

# gstack

Garry Tan's (President & CEO of Y Combinator) open-source AI software factory. Turns Claude Code into a virtual engineering team — 23 specialist roles and 8 power tools, all slash commands, all Markdown, MIT license.

> "I don't think I've typed like a line of code probably since December." — Andrej Karpathy

## When to Activate

- Before shipping a feature — run `/review` and `/qa`
- Planning a new feature — run `/plan-ceo-review` or `/plan-eng-review`
- Designing UI — run `/design-consultation` or `/design-shotgun`
- Security audit — run `/cso`
- Architecture decisions — run `/plan-eng-review`
- Release prep — run `/ship` and `/land-and-deploy`
- Retrospectives — run `/retro`
- Investigating bugs — run `/investigate`

## Install

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

Or use the vendor copy: `vendor/gstack/`

## Slash Commands

### Planning
- `/office-hours` — describe what you're building, get structured feedback
- `/plan-ceo-review` — product/business review of a feature idea
- `/plan-eng-review` — architecture and technical review
- `/plan-design-review` — design review before building
- `/plan-devex-review` — developer experience review
- `/autoplan` — auto-generate a plan from context

### Design
- `/design-consultation` — design consultation session
- `/design-shotgun` — rapid design exploration (multiple directions)
- `/design-html` — generate HTML/CSS design artifact
- `/design-review` — review existing design

### Code Review & QA
- `/review` — full code review (eng manager + security + design)
- `/qa` — open a real browser, test your staging URL
- `/qa-only` — QA without code review
- `/devex-review` — developer experience audit

### Security
- `/cso` — Chief Security Officer audit (OWASP + STRIDE)

### Release
- `/ship` — prepare PR for shipping
- `/land-and-deploy` — land and deploy to production
- `/canary` — canary release
- `/setup-deploy` — configure deployment

### Utilities
- `/browse` — web browsing (use instead of MCP browser tools)
- `/connect-chrome` — connect to Chrome for browser automation
- `/benchmark` — performance benchmarking
- `/investigate` — systematic bug investigation
- `/retro` — team retrospective
- `/document-release` — generate release notes
- `/document-generate` — generate documentation
- `/learn` — learn from codebase patterns
- `/freeze` / `/unfreeze` — freeze/unfreeze codebase state
- `/guard` — add guardrails
- `/careful` — careful mode for risky operations
- `/gstack-upgrade` — upgrade gstack

## KILIMO AI Usage

Run before every PR:
```
/review          # catches bugs, security issues, design problems
/qa              # tests the actual UI in a browser
```

Run when planning new farmer features:
```
/plan-ceo-review    # is this the right thing to build?
/plan-eng-review    # is this the right way to build it?
/design-shotgun     # what should it look like?
```

## Vendor Reference

Full source: `vendor/gstack/`
SKILL.md template: `vendor/gstack/SKILL.md.tmpl`
