# External Resources & Knowledge Base

This project incorporates several external repositories as reference material, design assets, and agent knowledge. These are located in the `vendor/` directory and at the project root.

## 📦 Cloned Repositories

| Repository | Path | Description |
| :--- | :--- | :--- |
| **SVGL** | `vendor/svgl` | A large library of SVG logos (1000+ icons). Useful for branding and integrations. |
| **RTK** | `vendor/rtk` | Real-time Toolkit for AI applications. |
| **Open Agents** | `vendor/open-agents` | Vercel's framework and examples for building autonomous AI agents. |
| **Skills** | `vendor/skills` | Matt Pocock's engineering and productivity skills for AI agents. |
| **Awesome Design** | `vendor/awesome-design-md` | A curated collection of design resources and best practices. |
| **Glow Icons** | `vendor/glow-icons` | Premium icon library (Solid & Outline versions). |
| **Superpowers** | `superpowers/` | Composable agent skills for brainstorming, TDD, code review, and planning. |
| **Awesome Claude Subagents** | `awesome-claude-code-subagents/` | 131+ specialized subagents across 10 categories. |
| **Antigravity Skills** | `antigravity-awesome-skills/` | 1,460+ installable agentic SKILL.md playbooks. |
| **Magic MCP** | `magic-mcp/` | MCP server for AI-driven UI component generation. |

## 🛠 Usage for Agents

Agents should reference these directories when:
- **Designing UI**: Check `vendor/awesome-design-md` and `vendor/glow-icons`.
- **Finding Logos**: Check `vendor/svgl/static/library`.
- **Implementing AI Features**: Reference patterns in `vendor/open-agents` and `vendor/rtk`.
- **Expanding Capabilities**: Use `vendor/skills` as a template for new `.agents/skills/`.
- **Planning Work**: Use `superpowers/skills/brainstorming` and `superpowers/skills/writing-plans` patterns.
- **Adding Subagents**: Reference `awesome-claude-code-subagents/categories/` for agent definitions.
- **UI Component Generation**: Reference `magic-mcp` for AI-generated UI patterns.

## 🔄 Maintenance

To update these resources, run:
```bash
cd vendor/<repo_name> && git pull
```

For root-level repos:
```bash
cd <repo_name> && git pull
```
