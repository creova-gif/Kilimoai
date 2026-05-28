---
name: SVG chart imports
description: react-native-svg imports must be at the top of file; mid-file placement breaks Metro bundler
---

## Rule
All `import Svg, { ... } from 'react-native-svg'` declarations must appear at the **top of the file** with other imports.

**Why:** Metro bundler (Hermes transform) throws `"Identifier 'Svg' has already been declared"` when an import statement appears after function/variable declarations mid-file. This is a JS module scope issue.

## How to apply
- If adding SVG charts to an existing file, always check that the import goes in the top import block
- When grepping for duplicate Svg imports, also check line number — a single import on line >50 means it's misplaced
- `Dimensions` from react-native must also be imported at the top before using `Dimensions.get('window').width` in chart constants
