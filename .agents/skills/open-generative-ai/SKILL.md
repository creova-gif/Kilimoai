---
name: open-generative-ai
description: Use when generating AI images or videos for KILIMO AI — crop disease visuals, farmer tutorial videos, marketing assets, or UI illustrations. Open-source alternative to AI video platforms with 200+ models, no content filters.
origin: Anil-matcha/Open-Generative-AI
---

# Open Generative AI

Free, open-source alternative to AI video platforms. Generate AI images and videos using 200+ state-of-the-art models — no content filters, no closed ecosystem, no subscription fees.

Hosted version: [muapi.ai/open-generative-ai](https://muapi.ai/open-generative-ai)

## When to Activate

- Generating crop disease reference images for KILIMO AI
- Creating farmer tutorial or explainer videos
- Building marketing assets (app store screenshots, social media)
- Generating UI illustrations for onboarding screens
- Creating visual content for agricultural education
- Prototyping visual concepts before commissioning real photography

## 4 Studios

### Image Studio
Generate images from text prompts using 200+ models:
- Crop disease identification reference images
- Farm landscape illustrations
- Farmer avatar/profile images
- UI hero images and illustrations

### Video Studio
Generate short videos from text or images:
- Tutorial videos showing farming techniques
- Animated explainers for app features
- Marketing videos for the KILIMO AI platform

### Lip Sync Studio
Sync audio to video — useful for multilingual farmer education content (English/Swahili).

### Cinema Studio
Cinematic video generation for high-quality marketing content.

## Setup

### Desktop App (easiest)
Download from [GitHub releases](https://github.com/Anil-matcha/Open-Generative-AI/releases):
- macOS Apple Silicon: `Open.Generative.AI-1.0.9-arm64.dmg`
- macOS Intel: `Open.Generative.AI-1.0.9.dmg`

macOS first-run fix:
```bash
xattr -cr "/Applications/Open Generative AI.app"
```

### Local Dev
```bash
git clone https://github.com/Anil-matcha/Open-Generative-AI
npm install
npm run dev
```

### Docker
```bash
docker-compose up
```

## Automation via Skills

For agent-driven media generation pipelines, see [Generative-Media-Skills](https://github.com/SamurAIGPT/Generative-Media-Skills) — lets Claude Code and other agents drive 200+ image/video models end-to-end (prompt → generate → edit → stitch) directly from the terminal.

## KILIMO AI Usage

Practical use cases:
- **Onboarding screens**: Generate illustrations of farmers using the app
- **Crop health**: Reference images of healthy vs diseased crops for training data
- **Marketing**: App store screenshots with AI-generated backgrounds
- **Education**: Short videos explaining pest identification or weather patterns
- **Swahili content**: Lip-sync English videos to Swahili audio for bilingual support

## Vendor Reference

Full source: `vendor/Open-Generative-AI/`
Models list: `vendor/Open-Generative-AI/models_dump.json`
