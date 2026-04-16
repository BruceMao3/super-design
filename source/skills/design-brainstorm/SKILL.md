---
name: design-brainstorm
description: "Use when user wants to design something from scratch -- no reference website, no existing spec. Explores intent through collaborative dialogue, proposes approaches, builds design iteratively. Keywords: build something, design something, create, new project, from scratch."
user-invocable: true
argument-hint: "[idea or feature description]"
---

# Design Brainstorm -- Original Design Through Collaborative Dialogue

**Announce at start:** "I'm using the design-brainstorm skill to explore your design idea through dialogue."

## Goal

Turn a vague idea into a fully formed 13-section design spec through structured human-in-the-loop dialogue. No reference website needed -- this is for original creation.

<HARD-GATE>
Do NOT write any code, scaffold any project, or take any implementation action until you have presented a design spec and the user has approved it. This applies to EVERY project regardless of perceived simplicity. The spec can be short for simple projects, but it MUST exist and be approved.
</HARD-GATE>

### Anti-Pattern: "This Is Too Simple To Need A Design"

Every project goes through this process. A landing page, a single component, a config change -- all of them. "Simple" projects are where unexamined assumptions cause the most wasted work. The spec can be short, but it MUST exist.

| Excuse | Reality |
|--------|---------|
| "It's just a landing page" | Landing pages have the most design decisions per square inch. |
| "I already know what I want" | Then the spec will be fast to write. Still write it. |
| "Let me just start coding" | Code without spec = rework. Every time. |
| "The spec will slow us down" | The spec IS the acceleration. It prevents wrong turns. |

## Output Format

Brainstorm outputs the **same 13-section dual-layer spec** as design-analysis. This ensures design-prototype has a unified input format regardless of whether the spec came from extraction or original creation.

Differences from analysis-produced specs:

| Section | Analysis (extracted) | Brainstorm (created) |
|---------|---------------------|---------------------|
| Section 0: Visual Understanding | From site source + screenshot | Co-created with user through dialogue |
| Section 1: Tech Stack | Identified from source | User-specified or agent-recommended |
| Sections 2-7 (Token Layer) | Precisely extracted from source | Generated from design direction, may be thinner |
| Sections 8-9 (Interaction/Animation) | Analyzed from source | Designed by user intent + agent proposals |
| Section 10: Responsive | Extracted from source | Recommended for target devices |
| Section 11: Do's/Don'ts | Inferred from present/absent patterns | Derived from design direction constraints |
| Section 12: Design Philosophy | Distilled from whole site | Direct output of brainstorm conversation |
| Appendix: Quick Reference | Summarized from extraction data | Summarized from design decisions |

Token Layer sections may be thinner (direction descriptions instead of precise hex values). This is expected -- design-prototype handles thin sections by deriving concrete values and marking them `[derived]`.

## Checklist

Complete these in order:

1. **Explore project context** -- check files, docs, recent commits, existing design patterns
2. **Ask clarifying questions** -- one at a time, understand purpose/constraints/success criteria
3. **Propose 2-3 approaches** -- with trade-offs and your recommendation
4. **Present design** -- in sections, get user approval after each section
5. **Write spec document** -- save as 13-section dual-layer spec
6. **Spec self-review** -- check for placeholders, contradictions, ambiguity, scope
7. **User reviews written spec** -- ask user to review before proceeding
8. **Transition to next phase** -- prototype or plan

## The Process

### Understanding the Idea

- Check project state first (files, docs, recent commits)
- Before asking detailed questions, assess scope: if request describes multiple independent subsystems, flag immediately. Help decompose into sub-projects first.
- For appropriately-scoped projects, ask questions one at a time
- **Prefer multiple choice** when possible, open-ended is fine too
- **Only one question per message**
- Focus on: purpose, target audience, constraints, success criteria, aesthetic direction

### Key Questions to Cover

**Purpose & Audience:**
- Who uses this? What context?
- What job are they trying to get done?
- What emotions should the interface evoke?

**Aesthetic Direction:**
- Brand personality in 3 words (not "modern" or "elegant" -- those are dead categories)
- Reference sites that capture the right feel? What specifically about them?
- What should this explicitly NOT look like? Anti-references?
- Light mode, dark mode, or both?

**Technical:**
- Framework / tech stack constraints?
- Existing design system or components to reuse?
- Responsive requirements (which devices)?

### Exploring Approaches

- Propose 2-3 different approaches with trade-offs
- Lead with your recommended option and explain why
- Each approach should feel meaningfully different, not variations on a theme

🧑 **Human Gate: "Which approach resonates? Or should we combine elements?"**

### Presenting the Design

Once you understand what you're building, present the design **section by section**, following the 13-section spec structure:

1. Start with Section 0 (Visual Understanding) + Section 12 (Design Philosophy) -- establish the big picture
2. Then Section 11 (Do's and Don'ts) -- establish guardrails
3. Then Token Layer sections (2-7) -- colors, fonts, layout, components
4. Then Experience Layer sections (8-9) -- interactions, animations
5. Then Section 10 (Responsive) + Section 1 (Tech Stack)
6. Finally Appendix (Quick Reference) -- summarize all decisions

🧑 **Human Gate after each group: "Does this feel right? Anything to adjust?"**

Scale each section to its complexity: a few sentences if straightforward, up to 200-300 words if nuanced.

### Design Principles

- **Design for isolation and clarity** -- break into smaller units with clear purpose and well-defined interfaces
- **YAGNI ruthlessly** -- remove unnecessary features
- **In existing codebases** -- follow existing patterns, don't unilaterally restructure

## After the Design

### Write Spec Document

Save the validated design as a 13-section spec:
- Filename: `[project-name]-design-spec.md`
- Save to project directory
- Fill all 13 sections + appendix (thin sections are OK, empty sections are not)

### Spec Self-Review

**MANDATORY. Before presenting spec to user:**

- [ ] All 13 sections present (thin is OK, empty is NOT)
- [ ] Section 0 has visual description a stranger could picture
- [ ] Section 3 has at least primary, bg, text color values (can be approximate for brainstorm)
- [ ] Section 4 has font pairing identified (at least font names)
- [ ] Section 11 has at least 3 DO and 3 DON'T rules
- [ ] Appendix Quick Reference has all 5 fields
- [ ] No "TBD", "TODO", or incomplete sections
- [ ] No internal contradictions (Token Layer matches Visual Understanding)
- [ ] Scope is single-implementation-plan sized
- [ ] No ambiguous requirements (pick one interpretation, make it explicit)

**Can't check all boxes? Fix before presenting.**

### User Review Gate

🧑 **Human Gate:** "Spec written and saved to `[path]`. Please review it and let me know if you want changes before we proceed."

**WAIT for explicit approval. Do NOT continue.**

If changes requested -> update spec, re-run self-review, present again, WAIT again.
Only proceed when user explicitly approves.

### Transition

After spec is approved, present EXACTLY these options:

> **Spec approved. Next step?**
>
> **A. Generate prototype** -- run design-prototype to create a runnable prototype from this spec
>
> **B. Write implementation plan** -- run design-plan to create a detailed development plan
>
> **C. Stop here** -- keep the spec for later use

**WAIT for user choice. Do NOT proceed without explicit selection.**

- User says A -> **REQUIRED:** Invoke design-prototype skill. Do NOT invoke any other skill.
- User says B -> **REQUIRED:** Invoke design-plan skill. Do NOT invoke any other skill.
- User says C -> END. Do NOT invoke any skill.

## Red Flags -- STOP if you notice these

- About to write code before spec is approved
- About to skip a question because "the answer is obvious"
- About to combine multiple questions in one message
- About to skip a section because "it doesn't apply"
- About to proceed without user response to a gate
- Thinking "this is too simple for the full process"

**All of these mean: STOP. Follow the process.**

## Key Principles

1. **One question at a time** -- don't overwhelm with multiple questions
2. **Multiple choice preferred** -- easier to answer than open-ended
3. **YAGNI ruthlessly** -- remove unnecessary features
4. **Explore alternatives** -- always propose 2-3 approaches before settling
5. **Incremental validation** -- present design, get approval, then move on
6. **13-section output** -- always produce the standard spec format
7. **No code before approval** -- the HARD-GATE is absolute
8. **WAIT at every gate** -- never auto-advance
