---
name: design-analysis
description: "Use when user wants a full design extraction of a website -- complete technical and experiential teardown for reproduction or deep understanding. Keywords: analyze site, extract design, replicate, design teardown, DESIGN.md, how was this effect built."
user-invocable: true
argument-hint: "[URL]"
---

# Design Analysis -- Full-Stack Design Pattern Extraction

**Announce at start:** "I'm using the design-analysis skill to do a full design extraction. This will produce a 13-section dual-layer spec."

<IRON-LAW>
THE OUTPUT MUST CONTAIN ALL 13 SECTIONS PLUS THE APPENDIX. NO SECTION MAY BE OMITTED. If a section cannot be determined, write "[Could not determine from source -- needs screenshot verification]" as the content. An incomplete spec is a failed spec.
</IRON-LAW>

## Goal

Input a website URL (optional screenshot), output a **dual-layer design spec**:

- **Token Layer**: palette, typography, components, layout, shadows, responsive
- **Experience Layer**: visual understanding, interaction patterns, animation, design philosophy

Quality standard: someone who has never seen the original site should have a 90%+ accurate mental picture after reading the spec.

## Mandatory Spec Structure (13 Sections + Appendix)

Every section below is REQUIRED. Use the EXACT heading names.

```markdown
# [Site Name] - Design Spec

## Section 0: Visual Understanding
### Core Design Experience
[1-2 paragraphs: core design concept + most impressive interactions.
NOT "what exists" but "what it expresses" and "how."]

### Per-Screen Visual Description
[In scroll order. Each screen marked [Screen N]. For each:
- Background color and overall tone
- Main visual elements (size, position, color, specific form)
- Text content, font style, typographic approach
- Interactive behavior (what triggers what)
- Animation effects (what moves, how, rhythm)

Standard: **specific enough that an artist could paint from it.**]

### Overall Feeling
[One sentence: the feeling + differentiation from similar sites.]

## Section 1: Tech Stack
[Table: Layer | Choice | Identification basis]

## Section 2: Visual Theme & Atmosphere
[Design density | Mood keywords (3-5) | Surface style | Color temperature]

## Section 3: Color Palette & Roles
[Table: Semantic name | Value | Functional role | Usage context
If sections have different color schemes, list separately.]

## Section 4: Typography Rules
### Font Pairing
[Display font + Body font with usage and style feel]
### Type Scale Table
[Table: Level | Size (clamp) | Weight | Spacing | Transform | Usage]
### Special Typography Techniques
[Any non-standard type treatment found]

## Section 5: Component Patterns
[Each component with CSS pseudo-code for states:
Buttons, Cards, Navigation, Links, Tags, Inputs]

## Section 6: Layout Principles
[Grid | Spacing system | Max width | Whitespace philosophy | Section spacing]

## Section 7: Depth & Elevation
[Table: Level | box-shadow | Usage. Plus z-index strategy.]

## Section 8: Core Interaction Patterns
[Sorted by impact. Each pattern:
- Pattern name
- User experience: user does X -> sees Y
- Implementation: DOM + CSS + JS
- Key parameters: specific values
- Design intent: why this, not something simpler]

## Section 9: Animation Choreography
### Scroll-Driven
[Table: Trigger range | Effect | Pin | Duration]
### Lottie Animations
[Table: Position | JSON URL | Autoplay | Loop | Duration | Content]
### Micro-interactions
[Table: Trigger | Effect | Parameters]
### Page Transitions
### Sound Bindings (if any)

## Section 10: Responsive Strategy
[Breakpoints | Desktop->Tablet changes | Tablet->Mobile changes | Touch targets | Visibility switching]

## Section 11: Do's and Don'ts
### DO (what this site does)
[Rules extracted from actual patterns present]
### DON'T (what this site deliberately avoids)
[Rules inferred from ABSENT patterns -- key insight source]

## Section 12: Design Philosophy Summary
[One-sentence core concept | Brand-interaction unity analysis |
Reusable pattern priority table: Priority | Pattern | Difficulty | Impact]

## Appendix: Agent Quick Reference
- 5-color shorthand: primary=#xxx, secondary=#xxx, accent=#xxx, bg=#xxx, text=#xxx
- Font shorthand: display="xxx", body="xxx"
- Size shorthand: radius=Xpx, spacing-unit=Xrem, max-width=Xpx
- Shadow shorthand: default="x x x rgba(...)"
- Style one-liner: "[description]"
```

## No Placeholders Rule

These are spec failures -- NEVER write them:

- "Beautiful animation effects" / "Nice typography" (generic praise)
- "Various interactive elements" (vague reference)
- "Standard layout" / "Typical navigation" (non-descriptive)
- "Appropriate spacing" / "Good contrast" (no specific values)
- Any color described as "blue" or "green" without hex/oklch value
- Any font size described as "large" or "small" without px/rem/clamp value
- Any animation without duration and easing specified
- "See screenshot" without also writing the description

**Every data point must be specific.** "ease-out 0.6s" not "smooth animation." "#1a1a2e" not "dark blue."

## Extraction Process

### Phase 1: Source Acquisition

```bash
curl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" <URL>
```
403 -> try web_fetch. Both fail -> tell user.

### Phase 2: Token Layer Auto-Extraction

Systematically scan source, fill Sections 2-7:

**Colors (Section 3):**
- `var(--color-xxx)` CSS variables
- Inline `fill`, `background`, `color` values
- Class semantic colors (`is-purple`, `bg-red`)
- Organize into: semantic name + hex value + role + context

**Typography (Section 4):**
- `font-family` + Google Fonts `<link>`
- All `clamp()` / `font-size` values -> scale table
- `font-weight` / `letter-spacing` / `line-height` / `text-transform`

**Components (Section 5):**
- `<button>` / `.btn` style chains with transitions
- `.card` containers with border-radius + shadow
- `<nav>` / `<header>` structure

**Layout (Section 6):**
- `grid-cols-` / `grid` / `gap`
- Recurring padding/margin values
- `max-width` constraints

**Depth (Section 7):**
- All `box-shadow` values
- `z-index` usage

**Responsive (Section 10):**
- `@media` breakpoints
- Visibility switching patterns

### Phase 3: Experience Layer Analysis

Fill Sections 0, 8, 9, 11, 12:

**Visual Understanding (Section 0):**
- Based on Token Layer data, construct per-screen descriptions
- Standard: an artist could paint from it

**Interaction Patterns (Section 8):**
- `data-*` attributes + JS -> infer behavior
- Scroll-driven: pin containers, sticky, height: xxxsvh
- Drag, 3D, mouse follow, clipPath

**Animation (Section 9):**
- Lottie: `data-src`, `data-autoplay`, `data-loop`
- CSS: `@keyframes` + `animation`
- Scroll triggers, transitions, sound bindings

**Do's and Don'ts (Section 11):**
- DO: extract from patterns PRESENT
- DON'T: infer from patterns ABSENT (this is the key insight source)

### Phase 4: Screenshot Cross-Correction

Source code blind spots (must rely on screenshots):
1. Font rendering form
2. Lottie animation content
3. Photo/image content
4. Color palette atmosphere
5. Multi-layer compositing effects

With screenshot -> per-screen comparison -> update spec
Without screenshot -> mark "[~80% accuracy -- no screenshot]" on visual sections

### Phase 5: Self-Review

**MANDATORY. Before presenting to user, verify:**

- [ ] All 13 sections present with correct heading names
- [ ] Section 0 has per-screen descriptions, not just overview
- [ ] Section 3 has actual hex/oklch values, not color names
- [ ] Section 4 has actual px/rem/clamp values, not "large/small"
- [ ] Section 5 has CSS pseudo-code, not prose descriptions
- [ ] Section 8 has specific parameters (duration, easing, angles), not "smooth"
- [ ] Section 9 has Lottie URLs if Lottie was detected
- [ ] Section 11 DON'T list has at least 3 items inferred from ABSENT patterns
- [ ] Appendix Quick Reference has all 5 fields filled with actual values
- [ ] No generic praise anywhere (search: beautiful, nice, clean, modern, professional)
- [ ] Every color has a hex value
- [ ] Every animation has a duration
- [ ] Information sources labeled [source] / [screenshot] / [inferred]

**Can't check all boxes? Fix before presenting.**

### Phase 6: Present & Gate

Present the spec section by section. After EACH group, WAIT for confirmation:

**Group 1:** Section 0 (Visual Understanding)
🧑 **Human Gate:** "Does this visual description match what you see? What's wrong?"
WAIT. 1-2 rounds of correction.

**Group 2:** Sections 1-7 (Tech + Token Layer)
🧑 **Human Gate:** "Token data accurate? Any corrections?"
WAIT.

**Group 3:** Sections 8-10 (Experience Layer)
🧑 **Human Gate:** "Interaction and animation descriptions correct?"
WAIT.

**Group 4:** Sections 11-12 + Appendix
🧑 **Human Gate:** "Do's/Don'ts and philosophy make sense?"
WAIT.

After all groups confirmed:
Save as `[domain]-design-spec.md`.
🧑 **Human Gate:** "Spec saved. Generate a prototype from this spec?"

- User says yes -> **REQUIRED:** Invoke design-prototype skill.
- User says no -> end here. Do NOT invoke another skill.

Do NOT invoke any skill other than design-prototype from here.

## Key Principles

1. **Token Layer precise, Experience Layer vivid.** Color values exact; experience descriptions insightful.
2. **Description is the quality gate.** Wrong description = useless spec.
3. **Label information sources.** [source] / [screenshot] / [inferred]
4. **Do's and Don'ts are hidden value.** Design essence is in "what was deliberately NOT done."
5. **Quick Reference must be filled.** Highest-efficiency entry during generation.
6. **No code generation.** Code is design-prototype's job.
