# Responsive Design

## Mobile-First

Start with base styles for mobile, use `min-width` queries to layer complexity. Desktop-first means mobile loads unnecessary styles first.

## Breakpoints: Content-Driven

Don't chase device sizes. Start narrow, stretch until design breaks, add breakpoint there. Three breakpoints usually suffice (640, 768, 1024px). Use `clamp()` for fluid values without breakpoints.

## Detect Input Method, Not Screen Size

```css
/* Fine pointer (mouse) */
@media (pointer: fine) { .button { padding: 8px 16px; } }

/* Coarse pointer (touch) */
@media (pointer: coarse) { .button { padding: 12px 20px; } }

/* Device supports hover */
@media (hover: hover) { .card:hover { transform: translateY(-2px); } }

/* No hover (touch) */
@media (hover: none) { .card { /* use active instead */ } }
```

Don't rely on hover for functionality.

## Safe Areas

```css
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

Enable with `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.

## Responsive Images

```html
<img
  src="hero-800.jpg"
  srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Hero image"
>
```

Use `<picture>` for art direction (different crops at different sizes).

## Layout Adaptation

- Navigation: hamburger on mobile -> horizontal on tablet -> full on desktop
- Tables: transform to cards on mobile via `display: block` + `data-label`
- Progressive disclosure: `<details>/<summary>` for collapsible content

## Testing

DevTools device emulation misses: actual touch interactions, real CPU constraints, network latency, font rendering differences, browser chrome/keyboard.

Test on at least one real iPhone, one real Android. Cheap Android phones reveal performance issues simulators hide.

---

**Avoid**: Desktop-first design. Device detection instead of feature detection. Separate mobile/desktop codebases. Ignoring tablet and landscape.
