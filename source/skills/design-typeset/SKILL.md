---
name: design-typeset
description: "Use when typography needs fixing -- font hierarchy unclear, sizes too close, poor readability, inconsistent type scale, wrong font pairing."
user-invocable: true
argument-hint: "[target component or page]"
---

# Design Typeset -- Typography Correction


## Language Adaptation

<IRON-LAW>
ALL user-facing output MUST match the user's input language. Template heading names and field keys stay in English. All prose, descriptions, analysis, and judgments MUST be in the user's language.
</IRON-LAW>

## Overview

Fix typography issues in existing UI. Consult [typography reference](../design-critique/reference/typography.md) for principles.

## What This Skill Fixes

- Flat type hierarchy (sizes too close together)
- Missing modular scale
- Poor font pairing or single-font monotony
- Inadequate line-height or measure (line length)
- Missing fluid type on headings
- Inconsistent font weights
- Body text too small (< 16px)
- Missing OpenType features (tabular nums, kerning)

## Process

1. **Read current typography** -- scan CSS for font declarations, sizes, weights, line-heights
2. **Check against tokens** -- if design-token has run, use existing font tokens
3. **Identify issues** -- compare against typography reference principles
4. **Propose changes** -- present specific modifications with rationale

🧑 **Human Gate: "Here are the typography changes I'd make: [list]. Apply these?"**

5. **Apply approved changes** -- modify CSS/components
6. **Show diff** -- present before/after

🧑 **Human Gate: "Typography changes applied. Looks right?"**

## Key Checks

- [ ] Modular scale with >= 1.25 ratio between steps
- [ ] Max 65-75ch line length for body text
- [ ] Line-height increases for light-on-dark text
- [ ] Font-display: swap on custom fonts
- [ ] rem/em units, never px for body text
- [ ] Distinct display + body font pairing (if appropriate)
- [ ] Fluid type (clamp) on headings for marketing pages
- [ ] Fixed rem scale for app UI
