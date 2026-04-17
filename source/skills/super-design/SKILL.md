---
name: super-design
description: "Use when starting any design work -- creating UI, analyzing websites, building prototypes, extracting design patterns, or improving design quality. This is the entry point for all design lifecycle skills."
user-invocable: true
argument-hint: "[intent or URL]"
---

# Super Design

**Announce at start:** "I'm using the super-design skill to route your request."

Full-lifecycle design skill system. Routes to the right skill, manages session state, enforces human-in-the-loop at every decision point.

## Language Adaptation (GLOBAL RULE -- applies to ALL skills in this system)

<IRON-LAW>
ALL user-facing output MUST match the user's input language. If the user writes in Chinese, respond in Chinese. If in English, respond in English. If in Japanese, respond in Japanese. This applies to every skill routed from this system -- no exceptions.

What stays in English: template heading names, field keys (e.g. "Creativity 1:", "What:", "Why it's good:"), code snippets, CSS values, technical identifiers.

What MUST be in the user's language: all prose, descriptions, analysis, judgments, explanations, gate questions, suggestions, and any other natural-language content.
</IRON-LAW>

<HARD-GATE>
Do NOT execute any design work directly from this bootstrap skill. ALWAYS route to a specific sub-skill. This skill only does: routing, state management, direction tracking. If you find yourself writing analysis, generating code, or producing design content here, STOP -- you are in the wrong skill.
</HARD-GATE>

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

| Signal | Route to | Required action |
|--------|----------|-----------------|
| URL + "look at" / "what's good about" / "inspiration" | design-essence | **REQUIRED:** Invoke design-essence skill |
| URL + "analyze" / "extract" / "teardown" | design-analysis | **REQUIRED:** Invoke design-analysis skill |
| URL + "replicate" / "clone" / "build something like" | design-analysis then design-prototype | **REQUIRED:** Invoke design-analysis first |
| "Build X" / "Design X" / "Create X" (no reference URL) | design-brainstorm | **REQUIRED:** Invoke design-brainstorm skill |
| Has spec + "generate prototype" / "build it" | design-prototype | **REQUIRED:** Invoke design-prototype skill |
| Figma URL (figma.com/design/...) | figma-to-code | **REQUIRED:** Invoke figma-to-code skill |
| "Review the design" / "critique" | design-critique | **REQUIRED:** Invoke design-critique skill |
| "Fix typography" / "fix layout" / "fix colors" ... | Specific execution skill | **REQUIRED:** Invoke the specific skill |
| "Write a plan" / "implementation plan" | design-plan | **REQUIRED:** Invoke design-plan skill |
| "Submit" / "finish" / "deliver" | design-finish | **REQUIRED:** Invoke design-finish skill |

When intent is ambiguous, ask ONE clarifying question with options. Do NOT guess.

## Human-in-the-Loop Protocol

**THE IRON LAW: NO ADVANCING PAST A HUMAN GATE WITHOUT EXPLICIT USER CONFIRMATION.**

Every skill in this system follows these rules:

1. **Show before asking** -- present the output first, then ask for approval
2. **One question per gate** -- never stack multiple decisions
3. **Prefer options over open-ended** -- "A, B, or C?" beats "What do you think?"
4. **WAIT for response** -- after presenting a gate, STOP and WAIT. Do NOT continue. Do NOT assume approval.
5. **Allow skipping** -- user says "skip" or "move on", respect it immediately
6. **Never auto-advance** -- "looks good" from the agent is NOT user confirmation

### Red Flags -- STOP if you notice these:

- About to continue without user having responded to a gate
- About to say "Great!" / "Looks good!" / "Moving on..." without user input
- About to skip a section because "it's obvious"
- About to merge two gates into one message
- Thinking "the user probably wants me to continue"
- Thinking "this gate is unnecessary for this case"

**All of these mean: STOP. Present the gate. WAIT.**

## Phase 3 Decision Gate

After prototype is ready, present exactly these options:

> **Prototype is ready. What's next?**
>
> **A. Design polish first** -- Run critique to find issues, fix them, then develop
>
> **B. Straight to development** -- Build it first, polish later if needed
>
> **C. Selective polish** -- Only fix specific aspects (e.g., just typography, just colors)

WAIT for user choice. Do NOT proceed without explicit selection.

If user chooses A:
1. **REQUIRED:** Invoke design-critique (review mode)
2. Present issue list
3. WAIT for user to select which issues to fix
4. Route to execution skills based on issue types
5. After resolved OR user says done, **REQUIRED:** Invoke design-critique --verify

If user chooses C:
- WAIT for user to specify which aspects
- Route directly to the named skill(s)

## Direction Management

Track design direction to prevent conflicting operations:

- `design-distill` sets direction = "subtractive"
- `design-animate`, `design-colorize` set direction = "additive"

When user requests a skill that conflicts with current direction:

> **Current direction is [additive/subtractive] (already ran [skill]).
> [Requested skill] works in the opposite direction and may conflict with previous changes.
> Switch direction? This may override some earlier work.**

WAIT for explicit confirmation before proceeding. "Yes" or "switch" required.

## Critique --verify Trigger

Run `design-critique --verify` when ANY of these conditions is met (whichever comes first):

1. `critique_issues.remaining` is empty (all accepted issues resolved)
2. User explicitly says "done" / "verify now" / "all fixed"
3. Bootstrap detects `executed` list covers all skill types corresponding to accepted issues

## Skill Transition Rules

Each skill has exactly ONE set of valid next skills:

| Current Skill | Valid Next Skills | Routing |
|--------------|------------------|---------|
| design-essence | design-analysis, END | User chooses |
| design-analysis | design-prototype, END | User chooses |
| design-brainstorm | design-prototype, design-plan | User chooses |
| design-prototype | design-critique, design-plan, END | Phase 3 Decision Gate |
| figma-to-code | design-critique, design-plan, END | Phase 3 Decision Gate |
| design-critique | execution skills, design-critique --verify | Bootstrap routes from issue list |
| execution skills | design-critique --verify, next execution skill | Bootstrap routes |
| design-plan | execution (subagent or inline) | User chooses |
| design-review | design-finish | Direct |
| design-finish | END | Terminal |

Do NOT invoke skills outside these transitions. Do NOT skip steps.

## Skill Zones

**Reference-Free Zone** (do NOT reference `reference/*.md` files):
- design-essence, design-analysis, design-prototype, figma-to-code, design-brainstorm

**Process Control** (no design content output):
- design-plan, design-review, design-finish

**Reference-Guided Zone** (may reference `reference/*.md` files):
- Infrastructure: design-token, design-critique
- Execution: design-typeset, design-layout, design-colorize, design-animate, design-distill, design-adapt
- Quality: design-a11y, design-harden, design-audit
