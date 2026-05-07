---
name: appbuilder-ui-scaffolder
description: Generate React Spectrum UI components for Adobe Experience Cloud Shell SPAs and AEM UI Extensions. Use this skill when building frontends for App Builder projects.
---

# App Builder UI Scaffolder

Generate Spectrum-based UI for Adobe SPAs.

## Core Principles
- Use `@adobe/react-spectrum` for all UI components.
- Initialize with `@adobe/exc-app`.
- Call `runtime.done()` to signal initialization complete.

## Component Pattern
```javascript
import React from 'react';
import { Provider, defaultTheme, Button } from '@adobe/react-spectrum';

function App() {
  return (
    <Provider theme={defaultTheme}>
      <Button variant="accent">Click Me</Button>
    </Provider>
  );
}
```
