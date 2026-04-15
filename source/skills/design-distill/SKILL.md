---
name: design-distill
description: "Use when UI feels cluttered, over-designed, or needs ruthless simplification -- strip to the essential, remove decorative excess."
user-invocable: true
argument-hint: "[target component or page]"
---

# Design Distill -- Ruthless Simplification

## Overview

Strip a UI down to its essence. Remove everything that doesn't directly serve the user's task. This is the opposite of adding polish -- it's about subtraction.

**Direction: subtractive.** This skill is mutually exclusive with design-animate and design-colorize. Bootstrap will warn if direction conflicts.

## What Gets Removed

- Decorative elements that don't communicate
- Redundant visual indicators (border + shadow + color all saying "this is a card")
- Unnecessary animations and transitions
- Extra colors beyond what's functionally needed
- Visual noise (too many borders, dividers, backgrounds)
- Repetitive UI patterns (icon + heading + text, repeated 6 times identically)
- Copy that restates what's visually obvious

## What Gets Preserved

- Functional clarity (can users still accomplish their task?)
- Visual hierarchy (most important thing is still most prominent)
- Accessibility (contrast, focus indicators, screen reader support)
- Brand identity (core personality, not decorative expression)

## Process

1. **Identify the core task** -- what are users actually trying to do here?
2. **List every visual element** -- categorize as essential / supporting / decorative
3. **Propose removals** -- present what would be removed and why

🧑 **Human Gate: "Here's what I'd remove: [list]. Each item with reasoning. Agree?"**

4. **Apply approved removals**
5. **Show before/after comparison**

🧑 **Human Gate: "Simplified version. Too much removed? Not enough?"**

## The Distillation Test

After removing an element, ask: "Does the page still work? Does it still communicate its purpose?" If yes, the element was decorative. If no, put it back.

## Key Principles

1. **Subtract, don't just simplify** -- removing elements entirely, not just making them smaller
2. **One indicator per concept** -- if a card has a border, it doesn't also need a shadow and a background
3. **White space is content** -- removing elements creates space, and that space has value
4. **Preserve the hierarchy** -- distillation should make the hierarchy clearer, not flatten it
5. **Don't distill to boredom** -- some visual interest is necessary. The goal is "refined", not "empty"
