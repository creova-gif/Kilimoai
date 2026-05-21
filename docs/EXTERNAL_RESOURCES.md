# External Resources & Knowledge Base

This project incorporates several external repositories as reference material, design assets, and agent knowledge. These are located in the `vendor/` directory and at the project root.

## 📦 Vendor Repositories (`vendor/`)

| Repository | Path | Description |
| :--- | :--- | :--- |
| **SVGL** | `vendor/svgl` | 1000+ SVG logos. Useful for branding and integrations. |
| **RTK** | `vendor/rtk` | Real-time Toolkit for AI applications. |
| **Open Agents** | `vendor/open-agents` | Vercel's framework and examples for building autonomous AI agents. |
| **Skills** | `vendor/skills` | Matt Pocock's engineering and productivity skills for AI agents. |
| **Awesome Design** | `vendor/awesome-design-md` | Curated collection of design resources and best practices. |
| **Glow Icons** | `vendor/glow-icons` | Premium icon library (Solid & Outline versions). |
| **GSAP** | `vendor/GSAP` | GreenSock Animation Platform — full source and docs. All plugins now free. |
| **GSAP Master MCP** | `vendor/gsap-master-mcp-server` | MCP server for AI-powered GSAP animation creation and debugging. |
| **Motion** | `vendor/motion` | Motion (motiondivision) — React animation library source. |
| **Motion Vue** | `vendor/motion-vue` | Motion for Vue 3 — official Vue binding for Motion. |
| **Anime.js** | `vendor/anime` | Lightweight JavaScript animation library by Julian Garnier. |
| **Open Design** | `vendor/open-design` | Open-source alternative to Claude Design — 31 skills, 129+ design systems, 16 agent CLIs. |
| **gstack** | `vendor/gstack` | Garry Tan's (YC CEO) AI software factory — 23 specialist roles as slash commands. |
| **Ruflo** | `vendor/ruflo` | Multi-agent AI orchestration for Claude Code (formerly claude-flow). |
| **Open Generative AI** | `vendor/Open-Generative-AI` | Open-source AI image/video generation — 200+ models, no content filters. |
| **ECC** | `vendor/ECC` | Harness-native operator system — skills, security scanning, cross-harness config. |

## 🗂 Root-Level Repositories

| Repository | Path | Description |
| :--- | :--- | :--- |
| **Superpowers** | `superpowers/` | Composable agent skills for brainstorming, TDD, code review, and planning. |
| **Awesome Claude Subagents** | `awesome-claude-code-subagents/` | 131+ specialized subagents across 10 categories. |
| **Antigravity Skills** | `antigravity-awesome-skills/` | 1,460+ installable agentic SKILL.md playbooks. |
| **Magic MCP** | `magic-mcp/` | MCP server for AI-driven UI component generation. |
| **RTK AI** | `rtk-ai/` | RTK AI toolkit. |
| **SVGL** | `svgl/` | SVG logo library (also in vendor). |

## 🛠 Usage for Agents

Agents should reference these directories when:

- **Designing UI**: Check `vendor/awesome-design-md`, `vendor/glow-icons`, and `vendor/open-design/design-systems/`
- **Finding Logos**: Check `vendor/svgl/static/library`
- **Implementing Animations**: Reference `vendor/GSAP/`, `vendor/motion/`, `vendor/anime/` for patterns and API docs
- **GSAP via MCP**: Use `vendor/gsap-master-mcp-server/` — add to Claude with `claude mcp add-json gsap-master '{"command":"npx","args":["bruzethegreat-gsap-master-mcp-server@latest"]}'`
- **Implementing AI Features**: Reference patterns in `vendor/open-agents` and `vendor/rtk`
- **Expanding Capabilities**: Use `vendor/skills` as a template for new `.agents/skills/`
- **Planning Work**: Use `superpowers/skills/brainstorming` and `superpowers/skills/writing-plans` patterns
- **Adding Subagents**: Reference `awesome-claude-code-subagents/categories/` for agent definitions
- **UI Component Generation**: Reference `magic-mcp` for AI-generated UI patterns
- **Design Artifacts**: Use `vendor/open-design/` — run `pnpm tools-dev` to start the design server
- **Code Review & QA**: Use `vendor/gstack/` — install with `./setup` and use slash commands
- **Agent Orchestration**: Use `vendor/ruflo/` for multi-agent swarms and persistent memory
- **AI Media Generation**: Use `vendor/Open-Generative-AI/` for crop images, tutorial videos, marketing assets
- **Security Scanning**: Use `vendor/ECC/` — `npx ecc-agentshield scan --path ./src`
- **Token Cost Tracking**: Use `.agents/skills/codeburn/` — `npx codeburn`

## 🔄 Maintenance

To update vendor repos:
```bash
cd vendor/<repo_name> && git pull
```

For root-level repos:
```bash
cd <repo_name> && git pull
```

To add a new vendor repo:
```bash
git clone --depth=1 <repo-url> vendor/<name>
```

## 📋 Skills Index

All skills with SKILL.md files are in `.agents/skills/`. See `AGENTS.md` for the full skills table with use-when guidance.
