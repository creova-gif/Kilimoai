---
name: fusionjs
description: Use when referencing Uber's Fusion.js universal React framework patterns — SSR, plugin architecture, i18n, service workers, RPC, or Redux integration. Reference resource for universal React app architecture patterns applicable to KILIMO AI.
origin: fusionjs/fusionjs
---

# Fusion.js

Uber's open-source universal web framework for fast, powerful React apps. Represents the fusion of client and server — SSR out of the box, plugin-driven architecture for encapsulating complex frontend and backend logic.

## When to Activate

- Referencing SSR patterns for React apps
- Implementing plugin-driven architecture
- Setting up i18n with `fusion-plugin-i18n` patterns
- Implementing service workers for offline support
- RPC patterns for client-server communication
- Redux integration patterns

## Core Concept

One plugin = client + server logic:

```js
import App from 'fusion-react';
import Router from 'fusion-plugin-react-router';
import I18n from 'fusion-plugin-i18n-react';

export default () => {
  const app = new App(<Root />);

  // One line: SSR + React Provider + bundle splitting + HMR
  app.register(Router);

  // One line: server-side translation loading + client hydration
  app.register(I18n);

  return app;
};
```

## Key Plugins (Reference Patterns)

### i18n (`fusion-plugin-i18n-react`)
Pattern for loading translations server-side and hydrating client:
```js
import { I18nToken } from 'fusion-plugin-i18n-react';
// Translations loaded once on server, sent to client as JSON
```

Relevant for KILIMO AI's English/Swahili dual-language support.

### Service Worker (`fusion-plugin-service-worker`)
Pattern for offline-first PWA:
```js
import ServiceWorker from 'fusion-plugin-service-worker';
app.register(ServiceWorker);
// Handles caching strategy, background sync, push notifications
```

Relevant for KILIMO AI's offline-first requirement for rural farmers.

### RPC (`fusion-plugin-rpc`)
Type-safe client-server RPC without REST boilerplate:
```js
// Server
app.register(RPCHandlersToken, {
  getWeather: async ({ location }) => fetchWeather(location)
});

// Client
const { getWeather } = useRPCHandler();
const weather = await getWeather({ location: 'Nairobi' });
```

### Error Handling (`fusion-plugin-error-handling`)
Centralized error handling with client + server coverage:
```js
app.register(ErrorHandlingPlugin);
// Catches unhandled errors on both client and server
```

### Universal Events (`fusion-plugin-universal-events`)
Event bus that works on both client and server:
```js
emitter.emit('farmer:registered', { userId, region });
// Same event system on client and server
```

## KILIMO AI Relevance

Fusion.js is a **reference resource**, not a direct dependency. Use it to:
- Study SSR patterns for potential future KILIMO AI web optimization
- Reference i18n plugin patterns for improving English/Swahili support
- Study service worker patterns for offline-first farmer experience
- Reference universal event patterns for analytics

## Source

Full source: `.agents/skills/fusionjs/`
Docs: `.agents/skills/fusionjs/docs/`
