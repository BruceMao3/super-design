---
name: design-layout
description: "Use when layout needs fixing -- spacing inconsistent, visual rhythm flat, alignment issues, grid problems, poor visual hierarchy."
user-invocable: true
argument-hint: "[target component or page]"
---

# Design Layout -- Spacing & Layout Correction


## Language Adaptation

<IRON-LAW>
ALL user-facing output MUST match the user's input language. Template heading names and field keys stay in English. All prose, descriptions, analysis, and judgments MUST be in the user's language.
</IRON-LAW>

## Overview

Fix layout and spacing issues in existing UI. Consult [spatial design reference](../design-critique/reference/spatial-design.md) for principles.

## What This Skill Fixes

- Monotonous spacing (same padding everywhere)
- Missing spacing scale (arbitrary values)
- No visual rhythm (tight/generous variation)
- Grid issues (wrong column strategy, missing auto-fit)
- Center-everything syndrome
- Cards nested inside cards
- Missing container queries for component responsiveness
- Poor visual hierarchy (squint test fails)

## Process

1. **Read current layout** -- scan CSS for spacing values, grid/flex declarations, widths
2. **Check against tokens** -- if design-token has run, use existing spacing tokens
3. **Run the squint test** -- can you identify hierarchy when blurred?
4. **Identify issues** -- compare against spatial design reference
5. **Propose changes** -- present modifications with rationale

🧑 **Human Gate: "Here are the layout changes: [list]. Apply these?"**

6. **Apply approved changes**
7. **Show diff**

🧑 **Human Gate: "Layout changes applied. Visual rhythm better?"**

## Key Checks

- [ ] 4pt spacing scale (4, 8, 12, 16, 24, 32, 48, 64, 96)
- [ ] Semantic spacing token names (--space-sm, not --spacing-8)
- [ ] gap instead of margins for sibling spacing
- [ ] Varied spacing for hierarchy (not uniform padding)
- [ ] Max-width on body text (65-75ch)
- [ ] No nested cards
- [ ] Squint test passes (clear hierarchy when blurred)
- [ ] Container queries for component-level responsiveness
