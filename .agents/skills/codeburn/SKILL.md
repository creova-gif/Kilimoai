---
name: codeburn
description: Use when you need to track AI coding token usage, costs, and performance across tools. CodeBurn reads session data locally from 19 AI coding tools and shows exactly where your token budget goes — by task, model, tool, project, and provider.
origin: getagentseal/codeburn
---

# CodeBurn

See where your AI coding tokens go. Tracks token usage, cost, and performance across 19 AI coding tools. Everything runs locally — no wrapper, no proxy, no API keys.

## When to Activate

- Auditing AI coding costs across the KILIMO AI project
- Comparing token efficiency between different models or tools
- Identifying which tasks consume the most tokens
- Optimizing prompts to reduce costs
- Generating cost reports for the team

## Supported Tools (19)

Claude Code, Cursor, Copilot, Codex, Windsurf, Cline, Continue, Aider, Zed, OpenCode, and more.

## Install

```bash
npm install -g codeburn
```

Or Homebrew:
```bash
brew tap getagentseal/codeburn
brew install codeburn
```

Or run directly:
```bash
npx codeburn
```

## Key Commands

```bash
# Launch TUI dashboard
codeburn

# Show summary stats
codeburn stats

# Cost breakdown by model
codeburn stats --by model

# Cost breakdown by project
codeburn stats --by project

# Cost breakdown by task type
codeburn stats --by task

# Compare two time periods
codeburn compare --from 2026-05-01 --to 2026-05-21

# Optimize suggestions
codeburn optimize

# Export report
codeburn export --format json > token-report.json
```

## Dashboard Views

- **Dashboard**: Overall token usage, cost trends, top consumers
- **Menu Bar** (macOS): Live token counter in the menu bar
- **Optimize**: Suggestions for reducing token usage
- **Compare**: Side-by-side comparison of periods or tools

## KILIMO AI Usage

Run weekly to:
- Track how much the KILIMO AI development is costing in AI tokens
- Identify expensive operations (large file reads, repeated context)
- Compare Claude Code vs Cursor efficiency for different task types
- Generate cost reports for the team

```bash
# Weekly cost check
codeburn stats --period week

# See which KILIMO AI files cost the most to work with
codeburn stats --by file --limit 20
```

## Source

Full source: `.agents/skills/codeburn/`
