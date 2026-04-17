---
name: design-animate
description: "Use when UI feels static and needs purposeful motion -- transitions, entrance animations, state changes, micro-interactions."
user-invocable: true
argument-hint: "[target component or page]"
---

# Design Animate -- Purposeful Motion


## Language Adaptation

<IRON-LAW>
ALL user-facing output MUST match the user's input language. Template heading names and field keys stay in English. All prose, descriptions, analysis, and judgments MUST be in the user's language.
</IRON-LAW>

## Overview

Add meaningful motion to a static UI. Consult [motion reference](../design-critique/reference/motion-design.md) for principles.

**Direction: additive.** This skill is mutually exclusive with design-distill. Bootstrap will warn if direction conflicts.

## What This Skill Adds

- Page load entrance animations (staggered reveals)
- State change transitions (hover, active, focus)
- Layout transitions (accordion, drawer, modal)
- Micro-interactions (button feedback, toggle animations)
- Loading state animations (skeleton shimmer, spinner)
- Reduced motion alternatives

## What This Skill Does NOT Add

- Decorative animation without purpose
- Bounce or elastic easing (feels dated)
- Animation of layout properties (width, height, padding, margin)
- Animation that hides slow loading

## Process

1. **Identify high-impact moments** -- page load, key interactions, state changes
2. **Propose motion plan** -- which elements, what type, what timing

🧑 **Human Gate: "Here's the motion plan: [list of animations with durations]. Approve?"**

3. **Implement approved animations** -- using transform + opacity only
4. **Add reduced motion alternatives** -- `@media (prefers-reduced-motion: reduce)`
5. **Show result**

🧑 **Human Gate: "Animations added. Feel right? Too much? Too little?"**

## Timing Guide

| Element | Duration | Easing |
|---------|----------|--------|
| Button feedback | 100-150ms | ease-out-quart |
| Hover state | 200ms | ease-out |
| Menu/drawer open | 300ms | ease-out-expo |
| Modal entrance | 300-400ms | ease-out-quart |
| Page load reveal | 500-800ms | ease-out-quint |
| Exit (any) | 75% of entrance | ease-in |

## Key Checks

- [ ] Only transform and opacity animated (no layout properties)
- [ ] prefers-reduced-motion respected
- [ ] Exponential easing (no bounce/elastic)
- [ ] Exit faster than entrance
- [ ] Stagger capped (total < 500ms)
- [ ] Motion serves a purpose (not decoration)
