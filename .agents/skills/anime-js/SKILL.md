---
name: anime-js
description: Use when implementing lightweight, high-performance JavaScript animations — SVG path drawing, morphing, stagger effects, timeline sequences, or CSS property animations. Anime.js is already in the ecosystem; use when GSAP is overkill or for SVG-specific work.
origin: juliangarnier/anime
---

# Anime.js

A lightweight JavaScript animation library with a simple yet powerful API. Works with CSS properties, SVG, DOM attributes, and JavaScript objects.

## When to Activate

- Animating SVG paths, morphing, or drawing effects
- Lightweight animations where GSAP bundle size is a concern
- Stagger animations on lists or grids
- Timeline-based animation sequences
- Animating CSS custom properties (design tokens)
- Number counting / value animations for dashboards

## Core API

### Basic Tween

```js
import anime from 'animejs';

anime({
  targets: '.element',
  translateX: 250,
  rotate: '1turn',
  duration: 800,
  easing: 'easeInOutQuad'
});
```

### Timeline

```js
const tl = anime.timeline({
  easing: 'easeOutExpo',
  duration: 750
});

tl
  .add({ targets: '.title', opacity: [0, 1], translateY: [-20, 0] })
  .add({ targets: '.subtitle', opacity: [0, 1] }, '-=400')
  .add({ targets: '.cta', scale: [0.8, 1] }, '-=300');
```

### Stagger

```js
anime({
  targets: '.card',
  opacity: [0, 1],
  translateY: [20, 0],
  delay: anime.stagger(100),  // 100ms between each
  duration: 600,
  easing: 'easeOutQuad'
});
```

### SVG Path Drawing

```js
anime({
  targets: 'path',
  strokeDashoffset: [anime.setDashoffset, 0],
  duration: 1500,
  easing: 'easeInOutSine',
  direction: 'alternate',
  loop: true
});
```

### SVG Morphing

```js
anime({
  targets: '#shape path',
  d: [
    { value: 'M10 80 Q 95 10 180 80' },
    { value: 'M10 80 Q 95 150 180 80' }
  ],
  duration: 2000,
  loop: true,
  direction: 'alternate',
  easing: 'easeInOutQuad'
});
```

### Number Counting (for dashboards)

```js
anime({
  targets: '.yield-counter',
  innerHTML: [0, 2847],
  round: 1,
  duration: 1500,
  easing: 'easeOutExpo'
});
```

## React Integration

```tsx
import { useEffect, useRef } from 'react';
import anime from 'animejs';

function AnimatedList({ items }) {
  const listRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    anime({
      targets: listRef.current?.querySelectorAll('.item'),
      opacity: [0, 1],
      translateX: [-20, 0],
      delay: anime.stagger(80),
      duration: 500,
      easing: 'easeOutQuad'
    });
  }, [items]);

  return (
    <ul ref={listRef}>
      {items.map(item => <li key={item.id} className="item">{item.name}</li>)}
    </ul>
  );
}
```

## KILIMO AI Usage

- **Crop yield counters**: Animate numbers on the dashboard
- **SVG farm maps**: Draw field boundaries progressively
- **List reveals**: Stagger-animate market price lists
- **Progress indicators**: Animate circular SVG progress rings
- **Icon morphing**: Morph between weather icons

## Accessibility

Always check `prefers-reduced-motion` before running animations:

```js
const shouldAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (shouldAnimate) {
  anime({ /* ... */ });
}
```

## vs GSAP

| | Anime.js | GSAP |
|---|---|---|
| Bundle size | ~17KB | ~60KB+ |
| SVG morphing | Built-in | MorphSVG plugin |
| ScrollTrigger | No | Yes (plugin) |
| React hooks | Manual | `@gsap/react` |
| Free plugins | All free | All free (since Webflow) |

Use anime.js for lightweight SVG work; use GSAP for scroll-driven, complex timelines, or SplitText.

## Vendor Reference

Full source: `vendor/anime/`
