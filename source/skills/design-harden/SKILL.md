---
name: design-harden
description: "Use when UI needs resilience -- error states, empty states, loading states, boundary conditions, i18n, long text overflow, missing data."
user-invocable: true
argument-hint: "[target component or page]"
---

# Design Harden -- Resilience & Edge Cases

## Overview

Make a UI robust against real-world conditions. Handle the cases that demos skip: errors, empty states, missing data, long text, slow networks, internationalization.

**Scope:** Error handling, boundary states, i18n. Does NOT cover accessibility (design-a11y) or performance (design-audit).

## What This Skill Fixes

### Error States
- Missing error handling (silent failures)
- Generic error messages ("Something went wrong")
- No retry mechanism after errors
- Error states that break layout

### Empty States
- Blank screens when data is empty
- No guidance on what to do next
- Missing illustrations or helpful copy in empty states

### Loading States
- No loading indication (user stares at blank screen)
- Spinner-only loading (should use skeleton screens)
- No timeout handling (infinite loading)
- Missing optimistic UI for low-stakes actions

### Boundary Conditions
- Long text overflow (truncation vs wrapping)
- Single-item and many-item edge cases
- Missing data fields (nullable values)
- Extreme viewport sizes
- Slow network conditions (3G)

### Internationalization
- Hardcoded strings (not externalized)
- Layout breaks with longer translations (German, Finnish)
- RTL text direction not handled
- Date/number/currency format assumptions
- Missing locale-aware sorting

## Process

1. **Enumerate edge cases** -- list every boundary condition for the target component
2. **Test current handling** -- what happens now when each edge case occurs?
3. **Propose hardening plan** -- specific fixes for each gap

🧑 **Human Gate: "Here are the edge cases I found and proposed fixes: [list]. Which to implement?"**

4. **Implement approved fixes**
5. **Demonstrate edge case handling** -- show before/after for each

🧑 **Human Gate: "Hardening complete. Edge cases handled satisfactorily?"**

## Empty State Design

Empty states should teach the interface:

```
BAD:  "No items found."
GOOD: "No projects yet. Create your first project to get started."
      [Create Project button]
```

Include: what this area is for, why it's empty, what action to take.

## Error Message Design

```
BAD:  "Error 500"
GOOD: "Couldn't save your changes. Check your connection and try again."
      [Retry button]
```

Include: what happened (user terms), why (if known), what to do next.

## Key Principles

1. **Every state is a designed state** -- empty, error, loading are not afterthoughts
2. **Fail gracefully** -- degrade functionality, don't crash
3. **Guide recovery** -- every error should suggest a next step
4. **Test with real data shapes** -- not just "3 items with 2 lines of text each"
5. **i18n from the start** -- retrofitting is 10x harder
