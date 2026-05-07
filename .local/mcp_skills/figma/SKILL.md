---
name: mcp-figma
description: 'Call tools from the figma MCP server through code_execution callbacks. Available tools: mcpFigma_addCodeConnectMap, mcpFigma_createDesignSystemRules, mcpFigma_createNewFile, mcpFigma_generateDiagram, mcpFigma_getCodeConnectMap, mcpFigma_getCodeConnectSuggestions, mcpFigma_getContextForCodeConnect, mcpFigma_getDesignContext, mcpFigma_getFigjam, mcpFigma_getMetadata, mcpFigma_getScreenshot, mcpFigma_getVariableDefs, mcpFigma_sendCodeConnectMappings, mcpFigma_uploadAssets, mcpFigma_whoami. Reference skill for more information.'
---

# MCP Skill: figma

Use this skill when you need data or actions from this MCP server.

## Available Functions

### mcpFigma_addCodeConnectMap(...)

Map a Figma node to a code component in your codebase using Code Connect. Use the nodeId parameter to specify a node id. Use the fileKey parameter to specify the file key. If a URL is provided, extract the node id and file key from the URL, for example, if given the URL https://figma.com/design/:fileKey/:fileName?node-id=1-2, the extracted nodeId would be `1:2` and the fileKey would be `:fileKey`.

**Parameters:**

- `nodeId` (string, required): The ID of the node in the Figma document, eg. "123:456" or "123-456". This should be a valid node ID in the Figma document.
- `fileKey` (string, required): The key of the Figma file to use. If the URL is provided, extract the file key from the URL. The given URL must be in the format https://figma.com/design/:fileKey/:fileName?node-id=:int1-:int2. The extracted fileKey would be `:fileKey`.
- `clientLanguages` (string, optional): A comma separated list of programming languages used by the client in the current context in string form, e.g. `javascript`, `html,css,typescript`, etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which languages are being used. If you are unsure, it is better to list `unknown` than to make a guess.
- `clientFrameworks` (string, optional): A comma separated list of frameworks used by the client in the current context, e.g. `react`, `vue`, `django` etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which frameworks are being used. If you are unsure, it is better to list `unknown` than to make a guess
- `source` (string, required): The location of the component in the source code
- `componentName` (string, required): The name of the component to map to in the source code
- `label` (string, required): The framework or language label for this Code Connect mapping. Valid values: React, Web Components, Vue, Svelte, Storybook, Javascript, Swift, Swift UIKit, Objective-C UIKit, SwiftUI, Compose, Java, Kotlin, Android XML Layout, Flutter, Markdown
- `template` (string, optional): The executable JS template code for a Code Connect template. When provided, creates a figmadoc-type record (full template) instead of a component_browser mapping (simple mapping).
- `templateDataJson` (string, optional): JSON string of template metadata. May include isParserless (boolean), imports, nestable, props fields. If omitted when template is provided, defaults to {}.

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_addCodeConnectMap({ nodeId: "", fileKey: "", clientLanguages: "", clientFrameworks: "", source: "", componentName: "", label: "React", template: "", templateDataJson: "" });
console.log(result);
```

### mcpFigma_createDesignSystemRules(...)

Provides a prompt to generate design system rules for this repo.

**Parameters:**

- `clientLanguages` (string, optional): A comma separated list of programming languages used by the client in the current context in string form, e.g. `javascript`, `html,css,typescript`, etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which languages are being used. If you are unsure, it is better to list `unknown` than to make a guess.
- `clientFrameworks` (string, optional): A comma separated list of frameworks used by the client in the current context, e.g. `react`, `vue`, `django` etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which frameworks are being used. If you are unsure, it is better to list `unknown` than to make a guess

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_createDesignSystemRules({ clientLanguages: "", clientFrameworks: "" });
console.log(result);
```

### mcpFigma_createNewFile(...)

Create a new blank Figma file. IMPORTANT: You MUST load the /figma-create-new-file skill BEFORE every call to this tool, if it exists. NEVER call this tool without loading that skill first if it exists. By default the file is placed in the authenticated user's drafts folder; If specified it can be placed inside a project. Use this tool when you need a new file to work with before calling use_figma. Returns the new file key and URL. Requires a planKey. If the user already provided a planKey, use it directly. Otherwise, call the whoami tool first to get the list of plans. If the user has one plan, use its "key" field. If multiple, ask the user which team or organization to use. Optionally accepts a projectId. If the URL is of the format https://figma.com/files/project/:projectId, https://figma.com/files/:orgId/project/:projectId, or https://figma.com/files/team/:teamId/project/:projectId then use the :projectId as the projectId.

**Parameters:**

- `fileName` (string, required): The name for the new Figma file.
- `planKey` (string, required): The team or organization key where the file should be created. Obtain this from the whoami tool — it is the "key" field in each plan.
- `editorType` (string, required): The type of Figma file to create. "design" creates a Figma design file. "figjam" creates a FigJam whiteboard file. "slides" creates a Figma Slides presentation file.
- `projectId` (string, optional): The id of the project (folder) in Figma. If the URL is provided, extract the project id from the URL. Common URL formats include https://figma.com/files/project/:projectId, https://figma.com/files/:orgId/project/:projectId, and https://figma.com/files/team/:teamId/project/:projectId. The extracted projectId would be `:projectId`.

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_createNewFile({ fileName: "", planKey: "", editorType: "design", projectId: "" });
console.log(result);
```

### mcpFigma_generateDiagram(...)

Create a flowchart, decision tree, gantt chart, sequence diagram, state diagram, or entity relationship diagram in FigJam, using Mermaid.js. Generated diagrams should be simple, unless a user asks for details. This tool also does not support generating Figma designs, class diagrams, timelines, venn diagrams, or other Mermaid.js diagram types. This tool also does not support font changes, or moving individual shapes around -- if a user asks for those changes to an existing diagram, encourage them to open the diagram in Figma. If the tool is unable to complete the user's task, reference the error that is passed back. Do not use the create_new_file tool prior to creating a diagram using this tool; generate_diagram creates its own files. IMPORTANT: After calling this tool, you MUST show the returned URL link to the user as a markdown link so they can view and edit the diagram.

**Parameters:**

- `name` (string, required): A human-readable title for the diagram. Keep it short, but descriptive.
- `mermaidSyntax` (string, required): Mermaid.js code for the diagram. Keep diagrams simple, unless the user has detailed requirements. Only the following diagram types are supported: graph, flowchart, sequenceDiagram, stateDiagram, stateDiagram-v2, gantt, and erDiagram. Make sure to use correct Mermaid.js syntax. For graph, flowchart, or entity relationship diagrams, use LR direction by default and put all shape and edge text in quotes (eg. ["Text"], -->|"Edge Text"|, --"Edge Text"-->). Do not use emojis in the Mermaid.js code. Do not use 
 to represent new lines. Feel free to use the full range of shapes and connectors that Mermaid.js syntax offers. For graph and flowchart diagrams only, you can use color styling--but do so sparingly unless the user asks for it. In gantt charts, do not use color styling. In sequence diagrams, do not use notes. Do not use the word "end" in classNames.
- `userIntent` (string, optional): A description of what the user is trying to accomplish with this tool call. Important: Do not add extraneous information other than what the user provides.
- `planKey` (string, optional): Optional. The team or organization key where the generated diagram file should be saved. The key must start with "team::" or "org::", but do not use these abbreviations in user-facing messages. If the user is authenticated, you MUST provide this parameter. If the user already provided a planKey, use it directly. Otherwise, call the whoami tool first to get the list of plans. If the user has one plan, use its "key" field. If multiple, ask the user which team or organization to use.
- `useArchitectureLayoutCode` (string, optional): Optional. To generate a diagram using the software architecture layout, pass the code from the architecture-diagram-instructions resource. Omit this parameter for standard diagrams.
- `fileKey` (string, optional): Optional. The key of an existing FigJam file to add the diagram to. Extract from a Figma URL like figma.com/board/{fileKey}/... When provided, the diagram is placed directly in this file instead of creating a new one. The user must have edit access to the file.

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_generateDiagram({ name: "", mermaidSyntax: "", userIntent: "", planKey: "", useArchitectureLayoutCode: "", fileKey: "" });
console.log(result);
```

### mcpFigma_getCodeConnectMap(...)

Get a mapping of {[nodeId]: {codeConnectSrc: e.g. location of component in codebase, codeConnectName: e.g. name of component in codebase} E.g. {'1:2': { codeConnectSrc: 'https://github.com/foo/components/Button.tsx', codeConnectName: 'Button' } }. Use the nodeId parameter to specify a node id. Use the fileKey parameter to specify the file key. If a URL is provided, extract the node id and file key from the URL, for example, if given the URL https://figma.com/design/:fileKey/:fileName?node-id=1-2, the extracted nodeId would be `1:2` and the fileKey would be `:fileKey`.

**Parameters:**

- `nodeId` (string, required): The ID of the node in the Figma document, eg. "123:456" or "123-456". This should be a valid node ID in the Figma document.
- `fileKey` (string, required): The key of the Figma file to use. If the URL is provided, extract the file key from the URL. The given URL must be in the format https://figma.com/design/:fileKey/:fileName?node-id=:int1-:int2. The extracted fileKey would be `:fileKey`.
- `codeConnectLabel` (string, optional): The label used to fetch Code Connect information for a particular language or framework when multiple Code Connect mappings exist.

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_getCodeConnectMap({ nodeId: "", fileKey: "", codeConnectLabel: "" });
console.log(result);
```

### mcpFigma_getCodeConnectSuggestions(...)

Get AI-suggested strategy for linking a Figma node to code components via Code Connect. Workflow: call this tool → review suggestions with the user → call send_code_connect_mappings to save the approved mappings. 

Use the nodeId parameter to specify a node id. Use the fileKey parameter to specify the file key. If a URL is provided, extract the node id and file key from the URL, for example, if given the URL https://figma.com/design/:fileKey/:fileName?node-id=1-2, the extracted nodeId would be `1:2` and the fileKey would be `:fileKey`.

**Parameters:**

- `nodeId` (string, required): The ID of the node in the Figma document, eg. "123:456" or "123-456". This should be a valid node ID in the Figma document.
- `fileKey` (string, required): The key of the Figma file to use. If the URL is provided, extract the file key from the URL. The given URL must be in the format https://figma.com/design/:fileKey/:fileName?node-id=:int1-:int2. The extracted fileKey would be `:fileKey`.
- `clientLanguages` (string, optional): A comma separated list of programming languages used by the client in the current context in string form, e.g. `javascript`, `html,css,typescript`, etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which languages are being used. If you are unsure, it is better to list `unknown` than to make a guess.
- `clientFrameworks` (string, optional): A comma separated list of frameworks used by the client in the current context, e.g. `react`, `vue`, `django` etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which frameworks are being used. If you are unsure, it is better to list `unknown` than to make a guess
- `excludeMappingPrompt` (boolean, optional): Whether to exclude the prompt text and images from the response, returning only a lightweight list of unmapped components.

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_getCodeConnectSuggestions({ nodeId: "", fileKey: "", clientLanguages: "", clientFrameworks: "", excludeMappingPrompt: false });
console.log(result);
```

### mcpFigma_getContextForCodeConnect(...)

Get structured component metadata including properties, variants, and descendant tree for a Figma component or component set. Returns property definitions with types and variant options, and a tree of descendant instances and text nodes with their property references. Designed for creating Code Connect template files. Use the nodeId parameter to specify a node id. Use the fileKey parameter to specify the file key. If a URL is provided, extract the node id and file key from the URL, for example, if given the URL https://figma.com/design/:fileKey/:fileName?node-id=1-2, the extracted nodeId would be `1:2` and the fileKey would be `:fileKey`.

**Parameters:**

- `nodeId` (string, required): The ID of the node in the Figma document, eg. "123:456" or "123-456". This should be a valid node ID in the Figma document.
- `fileKey` (string, required): The key of the Figma file to use. If the URL is provided, extract the file key from the URL. The given URL must be in the format https://figma.com/design/:fileKey/:fileName?node-id=:int1-:int2. The extracted fileKey would be `:fileKey`.
- `clientLanguages` (string, optional): A comma separated list of programming languages used by the client in the current context in string form, e.g. `javascript`, `html,css,typescript`, etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which languages are being used. If you are unsure, it is better to list `unknown` than to make a guess.
- `clientFrameworks` (string, optional): A comma separated list of frameworks used by the client in the current context, e.g. `react`, `vue`, `django` etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which frameworks are being used. If you are unsure, it is better to list `unknown` than to make a guess

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_getContextForCodeConnect({ nodeId: "", fileKey: "", clientLanguages: "", clientFrameworks: "" });
console.log(result);
```

### mcpFigma_getDesignContext(...)

Get design context for a Figma node — the primary tool for design-to-code workflows. Returns reference code, a screenshot, and contextual metadata that should be adapted to the target project. See the server instructions for how to interpret and adapt the response. 

Use the nodeId parameter to specify a node id. Use the fileKey parameter to specify the file key. If a URL is provided, extract the node id and file key from the URL, for example, if given the URL https://figma.com/design/:fileKey/:fileName?node-id=1-2, the extracted nodeId would be `1:2` and the fileKey would be `:fileKey`. If the URL is of the format https://figma.com/design/:fileKey/branch/:branchKey/:fileName then use the branchKey as the fileKey. If the URL is of the format https://figma.com/make/:makeFileKey/:makeFileName then use the makeFileKey to identify the Figma Make file. The response will contain a code string and a JSON of download URLs for the assets referenced in the code. It will also include a screenshot of the node for context by default.

**Parameters:**

- `nodeId` (string, required): The ID of the node in the Figma document, eg. "123:456" or "123-456". This should be a valid node ID in the Figma document.
- `fileKey` (string, required): The key of the Figma file to use. If the URL is provided, extract the file key from the URL. The given URL must be in the format https://figma.com/design/:fileKey/:fileName?node-id=:int1-:int2. The extracted fileKey would be `:fileKey`.
- `clientLanguages` (string, optional): A comma separated list of programming languages used by the client in the current context in string form, e.g. `javascript`, `html,css,typescript`, etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which languages are being used. If you are unsure, it is better to list `unknown` than to make a guess.
- `clientFrameworks` (string, optional): A comma separated list of frameworks used by the client in the current context, e.g. `react`, `vue`, `django` etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which frameworks are being used. If you are unsure, it is better to list `unknown` than to make a guess
- `forceCode` (boolean, optional): Whether code should always be returned, instead of returning just metadata if the output size is too large. Only set this when the user directly requests to force the code.
- `disableCodeConnect` (boolean, optional): Whether Code Connect should be used to get the design context. Only set this when the user directly requests to disable Code Connect.
- `excludeScreenshot` (boolean, optional): Whether to exclude the screenshot of the design from the response. IMPORTANT: it is not recommended to exclude screenshots. Only set this to true if the user has explicitly requested it or you are trying to preserve context.

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_getDesignContext({ nodeId: "", fileKey: "", clientLanguages: "", clientFrameworks: "", forceCode: false, disableCodeConnect: false, excludeScreenshot: false });
console.log(result);
```

### mcpFigma_getFigjam(...)

Generate UI code for a given FigJam node in Figma. Use the nodeId parameter to specify a node id. If no node id is provided, use `0:1` which is the root node ID. Use the fileKey parameter to specify the file key. If a URL is provided, extract the node id from the URL, for example, if given the URL https://figma.com/board/:fileKey/:fileName?node-id=1-2, the extracted nodeId would be `1:2` and the fileKey would be `:fileKey`. IMPORTANT: This tool only works for FigJam files, not other Figma files.

**Parameters:**

- `nodeId` (string, required): The ID of the node in the Figma document, eg. "123:456" or "123-456". This should be a valid node ID in the Figma document.
- `fileKey` (string, required): The key of the Figma file to use. If the URL is provided, extract the file key from the URL. The given URL must be in the format https://figma.com/design/:fileKey/:fileName?node-id=:int1-:int2. The extracted fileKey would be `:fileKey`.
- `includeImagesOfNodes` (boolean, optional): Whether to include images of nodes in the response

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_getFigjam({ nodeId: "", fileKey: "", includeImagesOfNodes: true });
console.log(result);
```

### mcpFigma_getMetadata(...)

IMPORTANT: Always prefer to use get_design_context tool. Get metadata for a node or page in the Figma desktop app in XML format. Useful only for getting an overview of the structure, it only includes node IDs, layer types, names, positions and sizes. You can call get_design_context on the node IDs contained in this response. Use the nodeId parameter to specify a node id, it can also be the page id (e.g. 0:1). NEVER call get_metadata for Figma Make files.Extract the node id from the URL, for example, if given the URL https://figma.com/design/:fileKey/:fileName?node-id=1-2, the extracted nodeId would be `1:2`. If the URL is of the format https://figma.com/design/:fileKey/branch/:branchKey/:fileName then use the branchKey as the fileKey.

**Parameters:**

- `nodeId` (string, required): The ID of the node in the Figma document, eg. "123:456" or "123-456". This should be a valid node ID in the Figma document.
- `fileKey` (string, required): The key of the Figma file to use. If the URL is provided, extract the file key from the URL. The given URL must be in the format https://figma.com/design/:fileKey/:fileName?node-id=:int1-:int2. The extracted fileKey would be `:fileKey`.
- `clientLanguages` (string, optional): A comma separated list of programming languages used by the client in the current context in string form, e.g. `javascript`, `html,css,typescript`, etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which languages are being used. If you are unsure, it is better to list `unknown` than to make a guess.
- `clientFrameworks` (string, optional): A comma separated list of frameworks used by the client in the current context, e.g. `react`, `vue`, `django` etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which frameworks are being used. If you are unsure, it is better to list `unknown` than to make a guess

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_getMetadata({ nodeId: "", fileKey: "", clientLanguages: "", clientFrameworks: "" });
console.log(result);
```

### mcpFigma_getScreenshot(...)

Generate a screenshot for a given node or the currently selected node in the Figma desktop app. Use the nodeId parameter to specify a node id. nodeId parameter is REQUIRED. Use the fileKey parameter to specify the file key. fileKey parameter is REQUIRED. If a URL is provided, extract the file key and node id from the URL. For example, if given the URL https://figma.com/design/pqrs/ExampleFile?node-id=1-2 the extracted fileKey would be `pqrs` and the extracted nodeId would be `1:2`. By default this tool returns a short-lived URL to the screenshot plus curl instructions for downloading the PNG — the URL+curl path is strongly preferred because it uses far fewer tokens than embedding the image inline. The `enableBase64Response` parameter defaults to `false`. Only set `enableBase64Response: true` when the agent cannot fetch URLs (no shell access, no HTTP client, or a sandboxed environment that blocks outbound requests); when set, an inline base64 image entry is appended to the response in addition to the URL and curl instructions. If the URL is of the format https://figma.com/design/:fileKey/branch/:branchKey/:fileName then use the branchKey as the fileKey.

**Parameters:**

- `nodeId` (string, required): The ID of the node in the Figma document, eg. "123:456" or "123-456". This should be a valid node ID in the Figma document.
- `fileKey` (string, required): The key of the Figma file to use. If the URL is provided, extract the file key from the URL. The given URL must be in the format https://figma.com/design/:fileKey/:fileName?node-id=:int1-:int2. The extracted fileKey would be `:fileKey`.
- `contentsOnly` (boolean, optional): When true, renders the node in isolation — floating/overlapping content (e.g. connectors parented to the page that visually sit above a section) is excluded. Defaults to false so screenshots match what the user sees on the canvas. Only set to true if the caller specifically needs the isolated render.
- `enableBase64Response` (boolean, optional): When true, the response also includes the screenshot inline as a base64-encoded image entry, in addition to the short-lived URL and curl instructions. Defaults to false. Set to true ONLY if the agent cannot fetch URLs (no shell access, no HTTP client, or a sandboxed environment that blocks outbound requests)

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_getScreenshot({ nodeId: "", fileKey: "", contentsOnly: false, enableBase64Response: false });
console.log(result);
```

### mcpFigma_getVariableDefs(...)

Get variable definitions for a given node id. E.g. {'icon/default/secondary': #949494}Variables are reusable values that can be applied to all kinds of design properties, such as fonts, colors, sizes and spacings. Use the nodeId parameter to specify a node id. Extract the node id from the URL, for example, if given the URL https://figma.com/design/:fileKey/:fileName?node-id=1-2, the extracted nodeId would be `1:2`. If the URL is of the format https://figma.com/design/:fileKey/branch/:branchKey/:fileName then use the branchKey as the fileKey.

**Parameters:**

- `nodeId` (string, required): The ID of the node in the Figma document, eg. "123:456" or "123-456". This should be a valid node ID in the Figma document.
- `fileKey` (string, required): The key of the Figma file to use. If the URL is provided, extract the file key from the URL. The given URL must be in the format https://figma.com/design/:fileKey/:fileName?node-id=:int1-:int2. The extracted fileKey would be `:fileKey`.
- `clientLanguages` (string, optional): A comma separated list of programming languages used by the client in the current context in string form, e.g. `javascript`, `html,css,typescript`, etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which languages are being used. If you are unsure, it is better to list `unknown` than to make a guess.
- `clientFrameworks` (string, optional): A comma separated list of frameworks used by the client in the current context, e.g. `react`, `vue`, `django` etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which frameworks are being used. If you are unsure, it is better to list `unknown` than to make a guess

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_getVariableDefs({ nodeId: "", fileKey: "", clientLanguages: "", clientFrameworks: "" });
console.log(result);
```

### mcpFigma_sendCodeConnectMappings(...)

Save multiple Code Connect mappings in bulk. Use after get_code_connect_suggestions to confirm and save approved mappings. 

Use the nodeId parameter to specify a node id. Use the fileKey parameter to specify the file key. If a URL is provided, extract the node id and file key from the URL, for example, if given the URL https://figma.com/design/:fileKey/:fileName?node-id=1-2, the extracted nodeId would be `1:2` and the fileKey would be `:fileKey`.

**Parameters:**

- `nodeId` (string, required): The ID of the node in the Figma document, eg. "123:456" or "123-456". This should be a valid node ID in the Figma document.
- `fileKey` (string, required): The key of the Figma file to use. If the URL is provided, extract the file key from the URL. The given URL must be in the format https://figma.com/design/:fileKey/:fileName?node-id=:int1-:int2. The extracted fileKey would be `:fileKey`.
- `clientLanguages` (string, optional): A comma separated list of programming languages used by the client in the current context in string form, e.g. `javascript`, `html,css,typescript`, etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which languages are being used. If you are unsure, it is better to list `unknown` than to make a guess.
- `clientFrameworks` (string, optional): A comma separated list of frameworks used by the client in the current context, e.g. `react`, `vue`, `django` etc. If you do not know, please list `unknown`. This is used for logging purposes to understand which frameworks are being used. If you are unsure, it is better to list `unknown` than to make a guess
- `mappings` (array, required)

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_sendCodeConnectMappings({ nodeId: "", fileKey: "", clientLanguages: "", clientFrameworks: "", mappings: [] });
console.log(result);
```

### mcpFigma_uploadAssets(...)

Upload assets (images, etc.) into a Figma file. Call with a "count" to get that many single-use upload URLs. POST raw asset bytes to each URL with the correct Content-Type header (e.g. image/png, image/jpeg). Each upload URL handles storage, BlobStore commit, and canvas placement automatically. For a single image with nodeId, sets it as a fill on that existing node. Without nodeId, creates new frames with image fills on the current page. Supports PNG, JPG, GIF, and WebP formats. Max 10MB per asset.

**Parameters:**

- `fileKey` (string, required): The key of the Figma file to use. If the URL is provided, extract the file key from the URL. The given URL must be in the format https://figma.com/design/:fileKey/:fileName?node-id=:int1-:int2. The extracted fileKey would be `:fileKey`.
- `count` (integer, optional): Number of assets to upload (1-5, default 1). Returns that many single-use upload URLs. POST raw asset bytes to each URL with the correct Content-Type header (e.g. image/png, image/jpeg). Each upload URL handles storage, BlobStore commit, and canvas placement automatically.
- `nodeId` (string, optional): Optional. If provided, sets the uploaded asset as a fill on this existing node. Can only be used when count is 1.
- `scaleMode` (string, optional): How the image fills the node. Default: FILL.

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_uploadAssets({ fileKey: "", count: 1, nodeId: "", scaleMode: "FILL" });
console.log(result);
```

### mcpFigma_whoami(...)

Returns information about the authenticated user. If you are experiencing permission issues with other tools, you can use this tool to get information about who is authenticated and validate the right user is logged in.

**Parameters:** None.

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpFigma_whoami();
console.log(result);
```

## Blocked Tools

- None

## Figma-Specific Guidelines

- You may receive a rate-limit error from the Figma MCP. If this happens, explain to the user their options to fix the rate limit. If a URL is provided, fetch it and use the content to inform the user.
- IMPORTANT: ALWAYS call `mcpFigma_getDesignContext` to get context. Use the entire output from `mcpFigma_getDesignContext` as the code to implement things. `get_image` is for reference only.
- When encountering Tailwind CSS v4/v4.1 utilities that don't exist in v3.x, convert them to inline styles using React's style prop:
  V4-ONLY UTILITIES to INLINE STYLES:
  - mask-alpha, mask-luminance, mask-match → style={{maskMode: "alpha"|"luminance"|"match-source"}}
  - mask-intersect, mask-add, mask-subtract, mask-exclude → style={{maskComposite: "intersect"|"add"|"subtract"|"exclude"}}
  - mask-[url(...)] → style={{maskImage: "url(...)"}}
  - mask-size-* → style={{maskSize: "..."}}
  - mask-position-* → style={{maskPosition: "..."}}
  - text-shadow-* → style={{textShadow: "..."}}
  - text-shadow-[color] → style={{textShadow: "... [color]"}}
  - wrap-balance, wrap-pretty → style={{textWrap: "balance"|"pretty"}}
  - wrap-break-word → style={{overflowWrap: "break-word"}}
  - drop-shadow-[color] → style={{filter: "drop-shadow(... [color])"}}
  - 3D transforms (rotate-x-*, rotate-y-*, scale-z-*, translate-z-*) → style={{transform: "rotateX(...)|rotateY(...)|scaleZ(...)|translateZ(...)"}}
  - Advanced gradients (bg-linear-[angle], bg-radial-[...]) → style={{background: "linear-gradient(...)|radial-gradient(...)"}}
  - REMOVE @container queries (@sm:, @lg:) - replace with regular responsive breakpoints (sm:, md:, lg:, xl:) or component-level logic

## Notes

- Call these functions directly in `code_execution` JavaScript.
- These are pre-registered callbacks available in the sandbox; no imports needed.
