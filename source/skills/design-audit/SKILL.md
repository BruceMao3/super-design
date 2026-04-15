---
name: design-audit
description: "Use when code needs technical quality review -- performance, bundle size, rendering efficiency, code duplication, CSS best practices."
user-invocable: true
argument-hint: "[target component or page]"
---

# Design Audit -- Technical Quality Check

## Overview

Review the technical quality of frontend code. This is about engineering quality, not design quality (that's design-critique) or resilience (that's design-harden).

## What This Skill Checks

### Performance
- [ ] No layout thrashing (reading then writing DOM repeatedly)
- [ ] Images optimized (WebP/AVIF, lazy loading, proper sizes)
- [ ] CSS animations use transform/opacity only (no layout properties)
- [ ] No unnecessary re-renders (React: memo, useMemo, useCallback where needed)
- [ ] Font loading optimized (font-display: swap, preload critical fonts)
- [ ] Critical CSS inlined or loaded first

### Bundle Size
- [ ] No unused CSS (dead selectors)
- [ ] No unused JavaScript imports
- [ ] Tree-shaking effective (named imports, not namespace imports)
- [ ] Icons: individual imports, not entire icon libraries
- [ ] No duplicate dependencies

### Code Quality
- [ ] No copy-paste duplication (extract shared components/utilities)
- [ ] Consistent naming conventions
- [ ] CSS custom properties used consistently (no hardcoded values)
- [ ] Component responsibilities are clear and focused
- [ ] Styles co-located with components (or in a clear system)

### CSS Best Practices
- [ ] No `!important` (specificity issues indicate structural problems)
- [ ] No deeply nested selectors (> 3 levels)
- [ ] Logical properties where appropriate (`margin-inline` vs `margin-left`)
- [ ] Modern CSS features used (`gap`, `aspect-ratio`, `container queries`)
- [ ] No vendor prefixes for well-supported features

### Rendering
- [ ] `will-change` only on elements about to animate (not preemptive)
- [ ] Intersection Observer for scroll-triggered effects (not scroll event)
- [ ] `content-visibility: auto` for off-screen content
- [ ] No forced synchronous layout

## Process

1. **Scan codebase** -- read components, styles, build config
2. **Run checks** -- against the checklists above
3. **Produce report** -- categorized by area, with severity

🧑 **Human Gate:**

> **Technical audit complete:**
>
> **Performance issues:**
> 1. [issue] -- [severity]
> ...
>
> **Code quality issues:**
> ...
>
> **Which to fix?**

4. **Apply approved fixes**
5. **Verify improvements** -- measure where possible

🧑 **Human Gate: "Audit fixes applied. Technical quality improved?"**

## Relationship to Other Quality Skills

| Skill | Checks |
|-------|--------|
| design-audit | Code quality, performance, bundle size |
| design-harden | Error states, edge cases, i18n |
| design-a11y | Accessibility, WCAG compliance |
| design-critique | Design quality, visual issues |

These are independent and can run in any order. The suggested order puts audit last because it's least likely to conflict with other changes.

## Key Principles

1. **Measure, don't guess** -- use DevTools Performance tab, Lighthouse, bundle analyzer
2. **Fix the system, not the symptom** -- if `!important` is everywhere, fix the specificity architecture
3. **Modern CSS first** -- prefer CSS solutions over JavaScript (gap > margin calc, container queries > resize observer)
4. **Progressive enhancement** -- core functionality works without JS, enhanced with JS
