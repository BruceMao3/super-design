---
name: design-colorize
description: "Use when color needs work -- palette lacks cohesion, poor contrast, no brand presence, dead neutrals, wrong theme choice."
user-invocable: true
argument-hint: "[target component or page]"
---

# Design Colorize -- Color Strategy

## Overview

Fix color issues in existing UI. Consult [color reference](../design-critique/reference/color-and-contrast.md) for principles.

**Direction: additive.** This skill is mutually exclusive with design-distill. Bootstrap will warn if direction conflicts.

## What This Skill Fixes

- Dead/lifeless neutrals (pure gray without brand tint)
- Poor WCAG contrast ratios
- No 60-30-10 visual weight balance
- Accent color overuse (everything is "primary")
- Pure black (#000) or pure white (#fff)
- Gray text on colored backgrounds
- Missing dark mode support (or dark mode = inverted light mode)
- HSL color space (should be OKLCH)

## Process

1. **Audit current palette** -- extract all color values from CSS
2. **Check contrast** -- verify WCAG AA compliance for all text/background combinations
3. **Check against tokens** -- if design-token has run, use existing color tokens
4. **Identify issues** -- compare against color reference
5. **Propose changes** -- present specific color modifications

🧑 **Human Gate: "Here are the color changes: [list with before/after swatches]. Apply these?"**

6. **Apply approved changes**
7. **Show diff**

🧑 **Human Gate: "Color changes applied. Palette feels cohesive?"**

## Key Checks

- [ ] OKLCH color space (not HSL)
- [ ] Tinted neutrals toward brand hue (chroma 0.005-0.015)
- [ ] WCAG AA contrast: 4.5:1 body text, 3:1 large text/UI
- [ ] 60-30-10 visual weight distribution
- [ ] No pure black or pure white
- [ ] No gray text on colored backgrounds
- [ ] Semantic color tokens (--color-primary, not --blue)
- [ ] Primitives + semantic two-layer token system
