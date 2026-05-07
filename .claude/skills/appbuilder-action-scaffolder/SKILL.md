---
name: appbuilder-action-scaffolder
description: Scaffold, implement, deploy, and debug Adobe Runtime actions. Use this skill whenever the user needs to add actions to an App Builder project, understand action structure, configure actions in the manifest, use App Builder SDKs, or implement serverless patterns in Adobe context.
---

# App Builder Action Scaffolder

Full lifecycle skill for Adobe Runtime actions.

## Action Layout
Place action code at `src/<extension-dir>/actions/<action-name>/index.js` and register in `src/<extension-dir>/ext.config.yaml`.

## Implementation Pattern
```javascript
const { Core } = require('@adobe/aio-sdk');
const logger = Core.Logger('main', { level: 'info' });

async function main(params) {
  try {
    logger.info('Action started');
    // Implementation
    return {
      statusCode: 200,
      body: { message: 'Success' }
    };
  } catch (error) {
    logger.error(error);
    return {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    };
  }
}
exports.main = main;
```

## Commands
- `aio app deploy`: Deploy actions.
- `aio app invoke <action>`: Invoke action.
- `aio app logs`: View logs.
