---
name: design-critique
description: "Use when an existing UI needs design review -- identifying quality issues, anti-patterns, and improvement opportunities. Supports --verify mode for post-fix validation."
user-invocable: true
argument-hint: "[--verify]"
---

# Design Critique -- Design Quality Review


## Language Adaptation

<IRON-LAW>
ALL user-facing output MUST match the user's input language. Template heading names and field keys stay in English. All prose, descriptions, analysis, and judgments MUST be in the user's language.
</IRON-LAW>

## Overview

Review an existing UI against design quality standards. Produce a prioritized issue list. Do NOT execute fixes -- that's the job of execution skills (typeset, layout, colorize, etc.). Critique only diagnoses.

## Two Modes

### Review Mode (default)

Full design review producing a prioritized issue list.

### Verify Mode (`--verify`)

Post-fix validation. Re-check previously identified issues to confirm they've been resolved. Only checks the specific items from the previous critique, does not do a full re-review.

## Review Process

### Step 1: Gather Context

- Read the UI code (components, styles, layout)
- If a running dev server is available, view in browser
- Check for `.impeccable.md` or design context in project config
- Check for existing design tokens / CSS variables

### Step 2: Evaluate Against Design References

Consult the reference guides for each dimension:

- [Typography](reference/typography.md) -- font hierarchy, scale, readability, pairing
- [Color & Contrast](reference/color-and-contrast.md) -- palette cohesion, WCAG contrast, tinted neutrals
- [Spatial Design](reference/spatial-design.md) -- spacing system, grid, visual hierarchy, depth
- [Motion Design](reference/motion-design.md) -- duration, easing, reduced motion, perceived performance
- [Interaction Design](reference/interaction-design.md) -- states, focus, forms, loading, keyboard
- [Responsive Design](reference/responsive-design.md) -- mobile-first, breakpoints, input method, safe areas

### Step 3: Identify Issues

For each issue found:

```markdown
### Issue N: [Short Title]
- **Dimension**: typography / color / spatial / motion / interaction / responsive
- **Severity**: critical / important / nice-to-have
- **What**: One sentence describing the problem
- **Why it matters**: Impact on user experience
- **Suggested fix**: Brief direction (not implementation)
- **Execution skill**: which skill would fix this (typeset / layout / colorize / animate / adapt)
```

### Step 4: Prioritize

Sort issues by severity, then by impact. Group by dimension.

### Step 5: Present

🧑 **Human Gate:**

> **Design critique complete. Found [N] issues:**
>
> **Critical:**
> 1. [issue] -- [dimension]
> 2. ...
>
> **Important:**
> 3. [issue] -- [dimension]
> ...
>
> **Nice-to-have:**
> ...
>
> **Which issues should we fix?**

The user selects which issues to address. Bootstrap then routes to the appropriate execution skills.

## Verify Mode

When invoked with `--verify`:

1. Read the previous critique's issue list from session state
2. For each issue marked as "accepted":
   - Check the current code
   - Verify the issue is resolved
3. Report:
   - Resolved issues (with confirmation)
   - Remaining issues (still present)
   - New issues introduced by fixes (if any)

🧑 **Human Gate: "Verification complete. [N] resolved, [M] remaining. Continue to development?"**

## What Critique Does NOT Do

- Does not execute fixes (routes to execution skills)
- Does not know about downstream skills' existence (bootstrap handles routing)
- Does not modify code
- Does not suggest specific code changes (that's the execution skill's job)

## Key Principles

1. **Diagnose, don't treat** -- critique only identifies problems
2. **Severity matters** -- critical issues block, nice-to-haves don't
3. **Reference-backed** -- every finding should be traceable to a reference guide principle
4. **Actionable** -- each issue points to which dimension needs work
5. **Honest** -- if the UI is good, say so. Don't manufacture issues.
