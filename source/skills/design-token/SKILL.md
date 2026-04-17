---
name: design-token
description: "Use when a project needs a unified design token system -- extracting, organizing, and maintaining color, typography, spacing, and shadow variables from existing code or a design spec."
user-invocable: true
argument-hint: "[source: code|spec]"
---

# Design Token -- Token Extraction & Management


## Language Adaptation

<IRON-LAW>
ALL user-facing output MUST match the user's input language. Template heading names and field keys stay in English. All prose, descriptions, analysis, and judgments MUST be in the user's language.
</IRON-LAW>

## Overview

Extract, organize, and maintain a unified design token system. Tokens are the single source of truth for visual decisions -- colors, typography, spacing, shadows, motion. Execution skills (typeset, layout, colorize, etc.) consume these tokens.

## What Are Design Tokens

```css
/* Primitive tokens (raw values) */
--blue-500: oklch(55% 0.2 250);
--gray-100: oklch(95% 0.005 250);

/* Semantic tokens (mapped to purpose) */
--color-primary: var(--blue-500);
--color-surface: var(--gray-100);
--text-body: 1rem/1.5 'Source Sans Pro', sans-serif;
--space-sm: 8px;
--space-md: 16px;
--radius-sm: 4px;
--shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.05);
```

Two layers: primitives (what the values ARE) and semantic (what the values MEAN). Dark mode only redefines the semantic layer.

## Extraction Process

### From Existing Code

1. **Scan CSS/SCSS** for hardcoded values:
   - Color values (hex, rgb, hsl, oklch)
   - Font declarations (family, size, weight, line-height)
   - Spacing values (padding, margin, gap)
   - Shadow values (box-shadow)
   - Border radius values
   - Transition/animation durations

2. **Group and deduplicate:**
   - Cluster similar colors (within deltaE < 3)
   - Identify spacing patterns (multiples of a base unit)
   - Find font scale ratios

3. **Name semantically:**
   - Colors by role, not by value: `--color-primary` not `--blue`
   - Spacing by relationship: `--space-sm` not `--spacing-8`
   - Typography by function: `--text-heading` not `--font-24-bold`

### From Design Spec

1. Read the spec's Token Layer (Sections 2-7)
2. Map spec values to CSS custom properties
3. Organize into primitive + semantic layers

### Present for Review

🧑 **Human Gate:**

> **Extracted token system:**
>
> **Colors** (N primitives, M semantic):
> | Token | Value | Usage |
> |-------|-------|-------|
> | --color-primary | oklch(55% 0.2 250) | CTAs, links |
> | ... | ... | ... |
>
> **Typography** (N tokens):
> | Token | Value | Usage |
>
> **Spacing** (N tokens):
> | Token | Value | Usage |
>
> **Coverage complete? Naming make sense?**

## Output Format

Tokens can be output as:
- **CSS Custom Properties** (default) -- for web projects
- **JSON** -- for cross-platform or design tool sync
- **JavaScript/TypeScript constants** -- for CSS-in-JS projects

The format depends on the project's tech stack. Ask the user if unclear.

## Token Maintenance

When execution skills modify the UI:
- New values should be added as tokens, not hardcoded
- Unused tokens should be flagged (not auto-deleted -- ask first)
- Inconsistent values (similar but not identical) should be consolidated

## Relationship to Other Skills

Design-token is **data infrastructure**. Its output (the variable table) is consumed by:
- **design-typeset** -- uses font tokens
- **design-colorize** -- uses color tokens
- **design-layout** -- uses spacing tokens
- **design-adapt** -- uses responsive tokens

Run token extraction BEFORE execution skills so they have a consistent variable system to work with.

## Key Principles

1. **Semantic naming** -- name by purpose, not by value
2. **Two layers** -- primitives for raw values, semantic for meaning
3. **Consistency over completeness** -- a small consistent system beats a large inconsistent one
4. **Extract, don't invent** -- start from what exists in the code, organize it
5. **Human confirms naming** -- automated extraction, human-approved names
