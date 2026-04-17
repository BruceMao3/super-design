---
name: design-a11y
description: "Use when UI needs accessibility review -- WCAG compliance, color contrast, keyboard navigation, screen reader support, focus management, ARIA, touch targets."
user-invocable: true
argument-hint: "[target component or page]"
---

# Design A11y -- Accessibility Review & Fix


## Language Adaptation

<IRON-LAW>
ALL user-facing output MUST match the user's input language. Template heading names and field keys stay in English. All prose, descriptions, analysis, and judgments MUST be in the user's language.
</IRON-LAW>

## Overview

Comprehensive accessibility review and remediation. This is a standalone skill, not bundled with other quality checks. A11y is complex enough to deserve dedicated focus.

## What This Skill Checks

### Perceivable
- [ ] Color contrast meets WCAG AA (4.5:1 body, 3:1 large text/UI)
- [ ] Information not conveyed by color alone
- [ ] Images have meaningful alt text (or empty alt for decorative)
- [ ] Video/audio has captions or transcripts
- [ ] Content readable at 200% zoom without horizontal scroll

### Operable
- [ ] All functionality available via keyboard
- [ ] Focus indicators visible and high-contrast (3:1)
- [ ] Focus order is logical (matches visual order)
- [ ] No keyboard traps
- [ ] Touch targets >= 44x44px
- [ ] Skip links for navigation bypass
- [ ] No content that flashes > 3 times/second

### Understandable
- [ ] Page language declared (`lang` attribute)
- [ ] Form labels visible and programmatically associated
- [ ] Error messages specific and actionable
- [ ] Consistent navigation across pages

### Robust
- [ ] Valid HTML (proper nesting, required attributes)
- [ ] ARIA roles used correctly (or native elements preferred)
- [ ] Custom controls have keyboard support + ARIA
- [ ] Works with screen readers (test with VoiceOver/NVDA)

## Process

1. **Automated scan** -- check contrast, missing alt text, missing labels, focus order
2. **Manual review** -- keyboard navigation, screen reader testing, logical structure
3. **Produce issue list** -- categorized by WCAG principle

🧑 **Human Gate:**

> **A11y review complete. Found [N] issues:**
>
> **Must fix (WCAG AA violation):**
> 1. [issue]
> ...
>
> **Should fix (best practice):**
> ...
>
> **Which to fix?**

4. **Apply approved fixes**
5. **Re-test fixed items**

🧑 **Human Gate: "A11y fixes applied. [N] issues resolved."**

## Relationship to design-adapt

Responsive adaptation (design-adapt) can introduce a11y issues:
- Mobile touch targets too small
- Collapsed navigation missing keyboard access
- Visually hidden content still in tab order
- Hover-dependent interactions on touch devices

When a11y finds adapt-related issues:
1. Flag the issue with `[adapt-related]` tag
2. Bootstrap routes back to design-adapt for those specific fixes
3. After adapt fixes, re-run a11y on ONLY those items
4. This is a bounded loop -- maximum one round-trip

## Key Principles

1. **Native elements first** -- `<button>` over `<div role="button">`
2. **Progressive enhancement** -- core functionality works without JS
3. **Test with real assistive tech** -- automated tools catch ~30% of issues
4. **Don't remove, accommodate** -- never hide content for "cleanliness" if it serves accessibility
