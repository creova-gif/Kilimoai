---
name: ruflo
description: Use when orchestrating multiple AI agents, building swarms, implementing self-learning memory across sessions, or coordinating federated agent communication. Multi-agent AI orchestration for Claude Code (formerly claude-flow).
origin: ruvnet/ruflo
---

# Ruflo

Multi-agent AI orchestration for Claude Code. Orchestrate 100+ specialized AI agents across machines, teams, and trust boundaries. Adds coordinated swarms, self-learning memory, federated comms, and enterprise security to Claude Code.

> Formerly known as claude-flow. Renamed by rUv — "Ru" is the rUv, "flo" is working until 3am.

## When to Activate

- Coordinating multiple specialized agents on a complex task
- Building self-learning agent pipelines that improve over time
- Implementing memory that persists across Claude Code sessions
- Setting up federated agent communication across machines
- Creating agent swarms for parallel task execution
- Building production AI automation pipelines

## Architecture

```
User --> Ruflo (CLI/MCP) --> Router --> Swarm --> Agents --> Memory --> LLM Providers
                                  ^                           |
                                  +---- Learning Loop <-------+
```

## Quick Start

### Path A — Claude Code Plugin (lite, slash commands only)

```bash
/plugin marketplace add ruvnet/ruflo
/plugin install ruflo-core@ruflo
/plugin install ruflo-swarm@ruflo
/plugin install ruflo-rag-memory@ruflo
```

### Path B — Full CLI Install (recommended for production)

```bash
npx ruflo init
```

Gives you: 98 agents, 60+ commands, 30 skills, MCP server, hooks, daemon.

## Key Capabilities

### Agent Swarms
Spawn specialized agents that self-organize and collaborate:
```bash
npx ruflo swarm create --agents "researcher,coder,reviewer,tester"
npx ruflo swarm run "Build the farmer registration feature"
```

### Persistent Memory
Agents remember across sessions — no re-explaining context:
```bash
npx ruflo memory store "KILIMO AI uses React 18, Supabase, Framer Motion"
npx ruflo memory recall "tech stack"
```

### Self-Learning
Agents learn from successful patterns and apply them automatically:
```bash
npx ruflo learn --from-session last
npx ruflo patterns list
```

### Federation
Secure agent communication across machines without data leakage:
```bash
npx ruflo federation connect --peer <url> --trust-level read-only
```

## Available Plugins

- `ruflo-core` — base agent definitions and slash commands
- `ruflo-swarm` — multi-agent coordination
- `ruflo-rag-memory` — retrieval-augmented memory
- `ruflo-neural-trader` — specialized trading/finance agent
- More at: `npx ruflo plugin marketplace list`

## KILIMO AI Usage

Use Ruflo when:
- Running parallel agents to build multiple features simultaneously
- Maintaining context about the KILIMO AI codebase across long sessions
- Coordinating a research agent + coding agent + review agent on a complex feature
- Building automated testing pipelines that learn from failures

## Vendor Reference

Full source: `vendor/ruflo/`
Plugins: `vendor/ruflo/plugins/`
Documentation: `vendor/ruflo/docs/`
