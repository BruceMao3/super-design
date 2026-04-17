---
name: design-finish
description: "Use when all implementation and review is complete, ready to deliver, merge, or create a pull request."
user-invocable: true
---

# Design Finish -- Delivery Workflow


## Language Adaptation

<IRON-LAW>
ALL user-facing output MUST match the user's input language. Template heading names and field keys stay in English. All prose, descriptions, analysis, and judgments MUST be in the user's language.
</IRON-LAW>

## Overview

Final step in the design lifecycle. Verify everything is ready, then execute the user's chosen delivery action.

## Process

### Step 1: Verify

Before presenting options, verify:
- [ ] All implementation tasks completed
- [ ] Tests pass (run the test suite)
- [ ] No uncommitted changes (or all changes are staged)
- [ ] Review has been completed (design-review)

If any verification fails, report what's missing and ask how to proceed.

### Step 2: Determine Base Branch

Check git state:
- What branch are we on?
- What's the base branch (main/master/develop)?
- How many commits ahead?

### Step 3: Present Options

🧑 **Human Gate: Present exactly these 4 options (no more, no less):**

> **Ready to deliver. What would you like to do?**
>
> **A. Merge locally** -- merge this branch into [base branch]
>
> **B. Create PR** -- push and create a pull request
>
> **C. Keep as-is** -- leave the branch for later
>
> **D. Discard** -- delete the branch and changes

### Step 4: Execute Choice

**A. Merge locally:**
```bash
git checkout [base-branch]
git merge [current-branch]
```

**B. Create PR:**
```bash
git push -u origin [current-branch]
gh pr create --title "[title]" --body "[description]"
```
Return the PR URL.

**C. Keep as-is:**
Confirm the branch name and any uncommitted state.
"Branch [name] preserved. You can resume later."

**D. Discard:**
🧑 **Extra confirmation:** "This will delete branch [name] and all uncommitted changes. Type 'confirm' to proceed."
Only execute after explicit confirmation.

### Step 5: Cleanup

- Update `.super-design-state.json` to mark phase as complete
- If worktree was used, clean it up

## Key Principles

1. **Verify before offering options** -- don't offer merge if tests fail
2. **Exactly 4 options** -- consistent, predictable interface
3. **Extra confirmation for destructive actions** -- discard requires explicit confirmation
4. **Return actionable output** -- PR URL, branch name, merge result
