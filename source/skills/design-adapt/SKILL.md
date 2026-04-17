---
name: design-adapt
description: "Use when UI needs responsive adaptation -- mobile, tablet, different viewports, container-level responsiveness, touch vs pointer input."
user-invocable: true
argument-hint: "[target component or page]"
---

# Design Adapt -- Responsive Adaptation


## Language Adaptation

<IRON-LAW>
ALL user-facing output MUST match the user's input language. Template heading names and field keys stay in English. All prose, descriptions, analysis, and judgments MUST be in the user's language.
</IRON-LAW>

## Overview

Make a UI work well across devices and viewports. Not just "shrink it" -- adapt the interface for different contexts. Consult [responsive reference](../design-critique/reference/responsive-design.md) for principles.

## What This Skill Fixes

- Desktop-only layout (breaks on mobile)
- Viewport-based component sizing (should use container queries)
- Hidden functionality on mobile (amputated, not adapted)
- Missing touch accommodations (small tap targets, hover-dependent interactions)
- No safe area handling (notch, home indicator)
- Missing responsive images (one size fits all)
- Desktop-first CSS (should be mobile-first)

## Process

1. **Assess current state** -- test at mobile, tablet, desktop widths
2. **Identify breakage points** -- where does the layout fail?
3. **Propose adaptation strategy** -- per component/section

🧑 **Human Gate: "Here's the responsive plan: [list of changes per breakpoint]. Approve?"**

4. **Implement approved changes**
5. **Test at each breakpoint** -- verify in browser if possible
6. **Show results at each size**

🧑 **Human Gate: "Responsive adaptation complete. Check mobile/tablet/desktop views."**

## Adaptation Strategies

| Pattern | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Navigation | Hamburger + drawer | Horizontal compact | Full with labels |
| Data tables | Stacked cards | Scrollable | Full table |
| Multi-column | Single column | 2 columns | 3-4 columns |
| Images | Full-width | Contained | Side-by-side |
| Forms | Stacked labels | Side labels | Side labels |

## Key Checks

- [ ] Mobile-first CSS (min-width queries)
- [ ] Container queries for component responsiveness
- [ ] 44px minimum touch targets
- [ ] No hover-dependent functionality
- [ ] Safe area handling (env() insets)
- [ ] Responsive images (srcset + sizes)
- [ ] Input method detection (pointer: fine/coarse)
- [ ] Content-driven breakpoints (not device-driven)

## Relationship to design-a11y

Responsive adaptation may introduce new a11y issues:
- Mobile touch targets too small
- Collapsed navigation missing keyboard access
- Hidden content still in tab order

If design-a11y runs after adapt and finds adapt-related issues, bootstrap will route back to adapt for those specific fixes, then re-run a11y on those items only. This is a bounded loop.
