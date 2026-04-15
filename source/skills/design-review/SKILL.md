---
name: design-review
description: "Use when implementation tasks are complete and code needs review against the design spec and engineering quality standards."
user-invocable: true
---

# Design Review -- Two-Stage Code Review

## Overview

Review implemented code against the original design spec and engineering standards. Two stages: spec compliance first, code quality second. Spec compliance must pass before code quality review begins.

## Two-Stage Review

### Stage 1: Spec Compliance

Compare implementation against every requirement in the spec:

- Does the code implement what was specified?
- Are colors, fonts, spacing values matching the spec's Token Layer?
- Are interaction patterns matching the spec's Experience Layer?
- Are Do's and Don'ts respected?
- Any missing requirements?
- Any extra unspecified work (scope creep)?

**Do not trust the implementer's self-report.** Read the actual code and verify independently.

Line-by-line comparison:
1. Read each spec section
2. Find corresponding code
3. Verify match
4. List discrepancies

🧑 **Human Gate: "Spec compliance review complete. Issues found:**
**[numbered list of discrepancies]**
**Which should we fix?"**

If issues need fixing -> fix and re-check those specific items.
Only proceed to Stage 2 when spec compliance passes.

### Stage 2: Code Quality

Check implementation quality independent of spec compliance:

- **File responsibilities:** Does each file have a clear, focused purpose?
- **Decomposition:** Are components appropriately sized? Should anything be split?
- **Naming:** Are variables, functions, components named clearly?
- **Duplication:** Any copy-paste code that should be shared?
- **Testing:** Are key behaviors tested? Are tests meaningful (not just snapshot tests)?
- **Performance:** Any obvious performance issues (unnecessary re-renders, missing memoization)?
- **Accessibility:** Basic a11y (semantic HTML, alt text, keyboard focus)?

🧑 **Human Gate: "Code quality review complete. Suggestions:**
**[numbered list with severity: critical / recommended / optional]**
**Which should we address?"**

## Push Back When Appropriate

If a finding is technically sound but wrong for THIS codebase (e.g., reviewer suggests a pattern that contradicts existing conventions), explain why and move on. Not every suggestion needs implementation.

## Key Principles

1. **Spec compliance before code quality** -- wrong output is worse than imperfect code
2. **Read actual code, don't trust reports** -- implementer may have missed things
3. **Severity levels matter** -- critical issues block, optional ones don't
4. **Respect existing patterns** -- review in context of the codebase, not in a vacuum
