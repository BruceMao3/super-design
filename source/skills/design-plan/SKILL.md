---
name: design-plan
description: "Use when you have an approved design spec and need to create a step-by-step implementation plan before writing code."
user-invocable: true
argument-hint: "[spec file path]"
---

# Design Plan -- Implementation Planning

## Overview

Write comprehensive implementation plans from an approved design spec. Plans assume the implementing engineer has zero context for the codebase. Document everything: which files to touch, complete code, how to test. Bite-sized tasks, DRY, YAGNI, frequent commits.

## Scope Check

If the spec covers multiple independent subsystems, suggest breaking into separate plans -- one per subsystem. Each plan should produce working, testable software on its own.

## File Structure

Before defining tasks, map out which files will be created or modified:

- Each file has one clear responsibility
- Prefer smaller, focused files over large ones
- Files that change together should live together
- In existing codebases, follow established patterns

This structure informs task decomposition. Each task should produce self-contained changes.

## Task Structure

Each step is one action (2-5 minutes):

````markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.tsx`
- Modify: `exact/path/to/existing.tsx:123-145`
- Test: `tests/exact/path/to/test.tsx`

- [ ] **Step 1: Write the failing test**
```tsx
test('specific behavior', () => {
  const result = render(<Component />);
  expect(result).toMatchSnapshot();
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test -- --testPathPattern=test.tsx`
Expected: FAIL with "Component not defined"

- [ ] **Step 3: Write minimal implementation**
```tsx
export function Component() {
  return <div>...</div>;
}
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test -- --testPathPattern=test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add tests/path/test.tsx src/path/file.tsx
git commit -m "feat: add specific component"
```
````

## No Placeholders

Every step must contain actual content. These are **plan failures**:
- "TBD", "TODO", "implement later"
- "Add appropriate error handling" / "add validation"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code)
- Steps describing what to do without showing how
- References to types/functions not defined in any task

## Self-Review

After writing the complete plan:

1. **Spec coverage:** Skim each requirement in the spec. Can you point to a task? List gaps.
2. **Placeholder scan:** Search for red flag patterns. Fix them.
3. **Type consistency:** Do types, method signatures, property names match across tasks?

Fix issues inline. If a spec requirement has no task, add one.

## Human-in-the-Loop

🧑 **Human Gate: "Plan complete and saved to [path]. Two execution options:**

**1. Subagent-Driven (recommended)** -- fresh subagent per task, review between tasks

**2. Inline Execution** -- execute tasks in this session with checkpoints

**Which approach?"**

### Subagent-Driven Execution (Open Questions)

The following details are deferred to implementation:
- Subagent lifecycle (fresh agent per task, destroyed after)
- Context passing (full plan vs single task excerpt + project context)
- Failure retry strategy (auto-retry vs report to human)
- Session state sync between subagent and bootstrap
- Whether two-stage review uses the same reviewer agent

### Inline Execution

Execute tasks sequentially in current session. After every 2-3 tasks, checkpoint:

🧑 **Human Gate: "Tasks N-M complete. Results look right? Continue?"**

## Key Principles

1. **Exact file paths always**
2. **Complete code in every step**
3. **Exact commands with expected output**
4. **DRY, YAGNI, frequent commits**
5. **Test-first when possible**
