---
name: motion-vue
description: Use when implementing animations in Vue 3 applications using Motion for Vue — the official Vue binding for Motion (formerly Framer Motion). Provides the same declarative animation API as motion/react but for Vue.
origin: motiondivision/motion-vue
---

# Motion for Vue

The official Vue 3 binding for Motion (motiondivision). Same declarative animation API as `motion/react`, adapted for Vue's composition API and template syntax.

## When to Activate

- Building Vue 3 components with declarative animations
- Migrating animation patterns from React (motion/react) to Vue
- Implementing enter/leave transitions in Vue
- Gesture-driven animations (drag, hover, tap) in Vue
- Layout animations in Vue lists and grids

## Installation

```bash
npm install motion-v
```

KILIMO AI already has `motion-v` in `package.json`.

## Core Usage

### Basic Animation

```vue
<template>
  <Motion
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.4 }"
  >
    <div class="card">Content</div>
  </Motion>
</template>

<script setup>
import { Motion } from 'motion-v'
</script>
```

### Gestures

```vue
<template>
  <Motion
    :while-hover="{ scale: 1.05 }"
    :while-tap="{ scale: 0.95 }"
    :transition="{ type: 'spring', stiffness: 300, damping: 20 }"
  >
    <button>Press me</button>
  </Motion>
</template>
```

### Presence (Enter/Leave)

```vue
<template>
  <AnimatePresence>
    <Motion
      v-if="isVisible"
      :initial="{ opacity: 0, scale: 0.9 }"
      :animate="{ opacity: 1, scale: 1 }"
      :exit="{ opacity: 0, scale: 0.9 }"
    >
      <div class="modal">Modal content</div>
    </Motion>
  </AnimatePresence>
</template>

<script setup>
import { Motion, AnimatePresence } from 'motion-v'
</script>
```

### Layout Animation

```vue
<template>
  <Motion layout>
    <div :class="isExpanded ? 'expanded' : 'collapsed'">
      Content
    </div>
  </Motion>
</template>
```

### Stagger Children

```vue
<template>
  <Motion
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :transition="{ staggerChildren: 0.1 }"
  >
    <Motion
      v-for="item in items"
      :key="item.id"
      :variants="{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }"
    >
      {{ item.name }}
    </Motion>
  </Motion>
</template>
```

## Reduced Motion

```vue
<script setup>
import { useReducedMotion } from 'motion-v'

const prefersReduced = useReducedMotion()
</script>

<template>
  <Motion
    :animate="{ opacity: 1, y: prefersReduced ? 0 : 0 }"
    :initial="{ opacity: 0, y: prefersReduced ? 0 : 20 }"
  >
    Content
  </Motion>
</template>
```

## Note for KILIMO AI

KILIMO AI is a React project. This skill is relevant if:
- A Vue micro-frontend or widget is added to the platform
- Reference patterns are needed for Vue-based partner integrations
- Comparing motion/react vs motion-v API for documentation purposes

For React animations, use the `motion-foundations`, `motion-patterns`, or `motion-advanced` skills instead.

## Vendor Reference

Full source: `vendor/motion-vue/`
