---
name: super-design
description: "Use when starting any design work -- creating UI, analyzing websites, building prototypes, extracting design patterns, or improving design quality. This is the entry point for all design lifecycle skills."
user-invocable: true
argument-hint: "[intent or URL]"
---

# Super Design

Full-lifecycle design skill system. Routes to the right skill based on user intent, manages session state across conversations, and enforces human-in-the-loop at every decision point.

## Session State

On session start, read `.super-design-state.json` from project root. If it exists, resume from saved state. If not, start fresh.

```json
{
  "version": 1,
  "phase": "1",
  "direction": null,
  "specs": [],
  "executed": [],
  "critique_issues": null,
  "plan": null
}
```

**State file rules:**
- Update after every skill completes
- Add to `.gitignore` (work state, not project content)
- User can reset by deleting the file
- On new session: read state, briefly summarize where we left off, ask user to confirm or reset

## Routing

Read the user's intent and route to the appropriate skill:

| Signal | Route to |
|--------|----------|
| URL + "look at" / "what's good about" / "inspiration" | design-essence |
| URL + "analyze" / "extract" / "teardown" | design-analysis |
| URL + "replicate" / "clone" / "build something like" | design-analysis then design-prototype |
| "Build X" / "Design X" / "Create X" (no reference URL) | design-brainstorm |
| Has spec + "generate prototype" / "build it" | design-prototype |
| Figma URL (figma.com/design/...) | figma-to-code |
| "Review the design" / "critique" | design-critique |
| "Fix typography" / "fix layout" / "fix colors" ... | Specific execution skill |
| "Write a plan" / "implementation plan" | design-plan |
| "Submit" / "finish" / "deliver" | design-finish |

When intent is ambiguous, ask ONE clarifying question with options.

## Human-in-the-Loop Protocol

Every skill in this system follows these rules:

1. **Show before asking** -- present the output first, then ask for approval
2. **One question per gate** -- never stack multiple decisions
3. **Prefer options over open-ended** -- "A, B, or C?" beats "What do you think?"
4. **Converge in 1-2 rounds** -- if feedback loops exceed 2 rounds, ask user to clarify the core issue
5. **Allow skipping** -- user says "skip" or "move on", respect it immediately
6. **Never auto-advance past a gate** -- wait for explicit user confirmation

## Phase 3 Decision Gate

After prototype is ready, present exactly these options:

> **Prototype is ready. What's next?**
>
> **A. Design polish first** -- Run critique to find issues, fix them, then develop
>
> **B. Straight to development** -- Build it first, polish later if needed
>
> **C. Selective polish** -- Only fix specific aspects (e.g., just typography, just colors)

If user chooses A:
1. Run design-critique (review mode)
2. Present issue list
3. Ask which issues to fix
4. Route to execution skills based on issue types
5. After all accepted issues resolved OR user says done, run design-critique --verify

If user chooses C:
- Route directly to the named skill(s)

## Direction Management

Track design direction to prevent conflicting operations:

- `design-distill` sets direction = "subtractive"
- `design-animate`, `design-colorize` set direction = "additive"

When user requests a skill that conflicts with current direction:

> **Current direction is [additive/subtractive] (already ran [skill]).
> [Requested skill] works in the opposite direction and may conflict with previous changes.
> Switch direction? This may override some earlier work.**

Wait for explicit confirmation before proceeding.

## Critique --verify Trigger

Run `design-critique --verify` when ANY of these conditions is met (whichever comes first):

1. `critique_issues.remaining` is empty (all accepted issues have been resolved by execution skills)
2. User explicitly says "done" / "verify now" / "all fixed"
3. Bootstrap detects that `executed` list covers all skill types corresponding to accepted issues

## Skill Zones

Skills are organized into zones with different rules:

**Reference-Free Zone** (do NOT reference `reference/*.md` files):
- design-essence, design-analysis, design-prototype, figma-to-code, design-brainstorm
- These skills have their own internal DO/DON'T rules
- The sole restriction is: no external design reference files

**Process Control** (no design content output):
- design-plan, design-review, design-finish

**Reference-Guided Zone** (may reference `reference/*.md` files):
- Infrastructure: design-token, design-critique
- Execution: design-typeset, design-layout, design-colorize, design-animate, design-distill, design-adapt
- Quality: design-a11y, design-harden, design-audit

## Execution Order (Suggested, Not Enforced)

When running multiple polish skills after critique:

```
critique -> token -> typeset -> layout -> colorize/animate -> adapt -> a11y -> harden -> audit
                                                               ^        |
                                                               +--------+
                                                          bounded loop (adapt-related items only)
```

User can reorder or skip as they wish.
