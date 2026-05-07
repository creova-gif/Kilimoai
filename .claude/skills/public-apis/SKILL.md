---
name: public-apis
description: Discovery and usage of public APIs. Use this skill to search for relevant APIs for the project, understand their requirements, and implement integrations.
---

# Public APIs Skill

Discover and integrate public APIs.

## Search
Search for APIs by category or keyword using the Public APIs repository data or API.
Endpoint: `https://api.publicapis.org/entries?title=<name>` (if available) or browse `https://github.com/public-apis/public-apis`.

## Implementation
- Verify CORS support.
- Check Authentication requirements (No Auth, API Key, OAuth).
- Implement with `axios` or `fetch`.
