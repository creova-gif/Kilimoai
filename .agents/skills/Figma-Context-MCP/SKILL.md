---
name: Figma-Context-MCP
description: Use when implementing designs from Figma files. Gives the coding agent direct access to Figma design data — layouts, styles, components — for accurate one-shot design implementation. Paste a Figma URL and implement the design in any framework.
origin: GLips/Figma-Context-MCP
---

# Figma Context MCP (Framelink)

Give your coding agent access to Figma files. Implement designs in any framework in one-shot. When the agent has access to Figma design data, it's significantly better at accurately implementing designs than using screenshots.

## When to Activate

- Implementing a Figma design as React components
- Checking exact spacing, colors, or typography from a Figma file
- Converting Figma components to KILIMO AI React components
- Verifying that implemented UI matches the Figma spec
- Extracting design tokens from a Figma file

## Setup

### 1. Get a Figma Access Token
Create one at: Figma → Settings → Security → Personal access tokens

### 2. Configure MCP

Add to your MCP config (`~/.kiro/settings/mcp.json` or `.kiro/settings/mcp.json`):

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_TOKEN"],
      "disabled": false
    }
  }
}
```

Or with environment variable:
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp"],
      "env": {
        "FIGMA_API_KEY": "YOUR_TOKEN"
      }
    }
  }
}
```

### 3. Use It

Paste a Figma URL in chat:
```
Implement this Figma design as a React component:
https://www.figma.com/file/XXXXX/KILIMO-AI?node-id=123:456
```

## How It Works

1. Paste a Figma file, frame, or group URL
2. The MCP server fetches layout and styling metadata from the Figma API
3. It simplifies and translates the response — only relevant layout/styling info is sent to the model
4. The agent implements the design with accurate spacing, colors, and typography

## KILIMO AI Usage

Use when:
- A designer provides Figma mockups for new farmer-facing screens
- Implementing the onboarding flow from design specs
- Checking that implemented components match the design system
- Extracting color tokens or spacing values from the design file

## Supported Frameworks

React, Vue, Angular, Svelte, HTML/CSS, Tailwind CSS, and more.

## Source

Full source: `.agents/skills/Figma-Context-MCP/`
Quickstart: [framelink.ai/docs/quickstart](https://www.framelink.ai/docs/quickstart)
