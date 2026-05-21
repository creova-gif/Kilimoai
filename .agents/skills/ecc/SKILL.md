---
name: ecc
description: Use when you need a complete harness-native operator system for agentic work — skills, instincts, memory optimization, continuous learning, security scanning, and research-first development. Works across Claude Code, Codex, Cursor, Gemini, Zed, GitHub Copilot, and more.
origin: affaan-m/ECC
---

# ECC — Harness-Native Operator System

The harness-native operator system for agentic work. From an Anthropic hackathon winner. Not just configs — a complete system: skills, instincts, memory optimization, continuous learning, security scanning, and research-first development.

> 182K+ stars | 28K+ forks | 170+ contributors | 12+ language ecosystems

Works across: Claude Code, Codex, Cursor, OpenCode, Gemini, Zed, GitHub Copilot, and other AI agent harnesses.

## When to Activate

- Setting up a new agent harness with production-ready skills and rules
- Implementing security scanning in the development workflow
- Building research-first development pipelines
- Optimizing agent memory and context usage
- Setting up continuous learning from agent sessions
- Cross-harness agent configuration (same config works in Claude Code, Cursor, Codex, etc.)

## Core Components

### Skills System
Production-ready skills across 12+ language ecosystems:
```bash
npx ecc-universal skills list
npx ecc-universal skills install <skill-name>
```

### Instincts
Pre-configured behavioral patterns for common agent tasks:
- Research-first development (always check docs before coding)
- Security-first review (scan before committing)
- Memory-optimized context management

### Security Scanning (AgentShield)
```bash
npx ecc-agentshield scan --path ./src
npx ecc-agentshield audit --pr <number>
```

GitHub App available at [github.com/marketplace/ecc-tools](https://github.com/marketplace/ecc-tools) — free tier for public repos, PR audits.

### Memory Optimization
Reduces context window usage while preserving critical information:
```bash
npx ecc-universal memory optimize
npx ecc-universal memory checkpoint
```

### Continuous Learning
Agents learn from successful patterns across sessions:
```bash
npx ecc-universal learn --from-session last
npx ecc-universal patterns export
```

## ECC v2 — Hermes Operator

ECC v2.0.0-rc.1 adds the Hermes operator story — a cross-harness architecture that lets the same agent configuration run identically across all supported harnesses.

Setup: [docs/HERMES-SETUP.md](https://github.com/affaan-m/ECC/blob/main/docs/HERMES-SETUP.md)

## Key Files in Vendor Copy

```
vendor/ECC/
  skills/          # 100+ installable skills
  rules/           # Agent behavioral rules
  agents/          # Agent definitions
  hooks/           # Lifecycle hooks
  mcp-configs/     # MCP server configurations
  schemas/         # JSON schemas for validation
  RULES.md         # Core behavioral rules
  SOUL.md          # Agent philosophy and values
  WORKING-CONTEXT.md  # Context management guide
```

## KILIMO AI Usage

Use ECC when:
- Setting up a new developer's environment with consistent agent behavior
- Running security scans before deploying KILIMO AI updates
- Implementing research-first patterns (check Supabase docs before writing queries)
- Optimizing context usage during long coding sessions
- Sharing agent configurations across team members using different IDEs

## Quick Install

```bash
# Universal package
npm install -g ecc-universal

# AgentShield security scanner
npm install -g ecc-agentshield
```

## Vendor Reference

Full source: `vendor/ECC/`
Skills: `vendor/ECC/skills/`
Rules: `vendor/ECC/rules/`
Security guide: `vendor/ECC/the-security-guide.md`
