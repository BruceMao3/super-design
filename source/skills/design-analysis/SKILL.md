---
name: design-analysis
description: "Use when user wants a full design extraction of a website -- complete technical and experiential teardown for reproduction or deep understanding. Keywords: analyze site, extract design, replicate, design teardown, DESIGN.md, how was this effect built."
user-invocable: true
argument-hint: "[URL]"
---

# Design Analysis -- Full-Stack Design Pattern Extraction

## Goal

Input a website URL (optional screenshot), output a **dual-layer design spec**:

- **Token Layer** (compatible with DESIGN.md format): palette, typography, components, layout, shadows, responsive -- usable for component-level generation
- **Experience Layer** (unique capability): visual understanding, interaction patterns, animation choreography, design philosophy -- usable for page-level replication

Quality standard: someone who has never seen the original site should have a 90%+ accurate mental picture after reading the spec.

## Spec Output Structure (13 Sections)

```markdown
# [Site Name] - Design Spec

=======================================
Experience Layer
=======================================

## Section 0: Visual Understanding

### Core Design Experience
1-2 paragraphs summarizing the core design concept and most impressive interactions.
Not "what exists" but "what it expresses" and "how it expresses it".
Point out the unity between brand concept and interaction form.

### Per-Screen Visual Description
In scroll order, each screen marked [Screen N], describe:
- Background color and overall tone
- Main visual elements (size, position, color, specific form)
- Text content, font style, typographic approach
- Interactive behavior (what triggers what effect)
- Animation effects (what moves, how, rhythm)

Standard: **specific enough that an artist could paint from it.**
BAD: "beautiful animation effects"
GOOD: "at 30% scroll, blue block character slides in from right with ease-out 0.6s"

### Overall Feeling
One sentence: the feeling it gives + how it differentiates from similar sites.

## Section 1: Tech Stack
| Layer | Choice | Identification basis |

=======================================
Token Layer
=======================================

## Section 2: Visual Theme & Atmosphere
- Design density: sparse / balanced / dense
- Mood keywords: 3-5 (e.g., "warm, inclusive, playful, storybook feel")
- Surface style: flat / micro-texture / skeuomorphic / glassmorphism
- Color temperature: warm / cool / neutral / colorful

## Section 3: Color Palette & Roles
| Semantic name | Value | Functional role | Usage context |
If sections have different color schemes, list separately.

## Section 4: Typography Rules
### Font Pairing
- Display: [font-family] -- usage, style feel
- Body: [font-family] -- usage, style feel

### Type Scale Table
| Level | Size (clamp) | Weight | Spacing | Transform | Usage |
| XXL   | clamp(x,y,z) | 900    | -0.02em | uppercase | Main heading |

### Special Typography Techniques
- Large/small text on same line: specific approach
- Scattered letter offsets/rotations: parameters
- Inline elements (Lottie/icons) mixed with text: method

## Section 5: Component Patterns
Each component with four-state CSS pseudo-code:
### Buttons
### Cards
### Navigation
### Links/Anchors
### Tags/Badges
### Inputs (if any)

## Section 6: Layout Principles
- Grid: [columns], gap [value]
- Spacing system: multiples of [base unit]
- Max width: [value]
- Whitespace philosophy: generous / compact / sectional
- Section spacing pattern: full-screen / fixed-height / content-driven

## Section 7: Depth & Elevation
| Level | box-shadow | Usage |
z-index strategy: [description]

=======================================
Experience Layer (continued)
=======================================

## Section 8: Core Interaction Patterns
Sorted by impact, each pattern includes:
- **Pattern name** (e.g., "Kaleidoscope Rotation Carousel")
- **User experience**: user does what -> sees what effect
- **Implementation mechanism**: DOM + CSS + JS coordination
- **Key parameters**: specific values (angles, duration, easing, thresholds)
- **Design intent**: why this instead of something simpler

## Section 9: Animation Choreography
### Scroll-Driven
| Trigger range | Effect | Pin | Duration |

### Lottie Animations
| Position | JSON URL | Autoplay | Loop | Duration | Content description |

### Micro-interactions
| Trigger | Effect | Parameters |

### Page Transitions
### Sound Bindings (if any)

## Section 10: Responsive Strategy
- Breakpoints: [values]
- Desktop -> Tablet: [changes]
- Tablet -> Mobile: [changes]
- Touch target minimum: [value]
- Visibility switching strategy

=======================================
Inference Layer
=======================================

## Section 11: Do's and Don'ts (Design Guardrails)

### DO (what this site does)
- [Positive rules extracted from actual patterns]

### DON'T (what this site deliberately avoids)
- [Negative rules inferred from ABSENT patterns]

Inference logic:
- No stock photos -> DON'T use generic stock imagery
- No gradient backgrounds -> DON'T use gradients
- No traditional grid -> DON'T use regular equal columns
- No shadows -> DON'T rely on shadows for hierarchy
- All uppercase text -> DO maintain uppercase transform

## Section 12: Design Philosophy Summary
- One-sentence core concept
- Brand-interaction unity analysis
- Reusable pattern priority table:
  | Priority | Pattern | Reuse difficulty | Impact |

=======================================
Appendix
=======================================

## Appendix: Agent Quick Reference
For quick lookup during generation:
- 5-color shorthand: primary=#xxx, secondary=#xxx, accent=#xxx, bg=#xxx, text=#xxx
- Font shorthand: display="xxx", body="xxx"
- Size shorthand: radius=Xpx, spacing-unit=Xrem, max-width=Xpx
- Shadow shorthand: default="x x x rgba(...)"
- Style one-liner: "[e.g., interactive storybook style, warm and inclusive, hand-drawn SVG characters, kaleidoscope navigation]"
```

## Extraction Process

### Phase 1: Source Acquisition

```bash
curl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" <URL>
```
403 -> try web_fetch. Both fail -> tell user.

### Phase 2: Token Layer Auto-Extraction

Systematically scan source, fill sections:

**Colors:**
- `var(--color-xxx)` / `var(--xxx)` CSS variables
- Inline `fill="xxx"` / `background:` / `color:` values
- Class semantic colors (`is-purple` / `bg-red`)
- Organize into "semantic name + value + role" table

**Typography:**
- `font-family` declarations + Google Fonts `<link>`
- All `clamp()` / `font-size` values -> scale table
- `font-weight` / `letter-spacing` / `line-height` / `text-transform`

**Components:**
- `<button>` / `.btn` complete style chains
- `.card` or containers with `border-radius` + `box-shadow`
- `<nav>` / `<header>` structure
- transition / hover parameters

**Layout:**
- `grid-cols-` / `grid` / `gap`
- Recurring padding/margin rem values
- `max-width` constraints

**Depth:**
- All `box-shadow` values
- `z-index` usage patterns

**Responsive:**
- `@media` breakpoints
- Tailwind breakpoint classes
- Visibility switching patterns

### Phase 3: Experience Layer Analysis

Requires agent understanding and judgment:

**Visual Understanding Description:**
- Based on Token Layer data, construct natural language per-screen descriptions
- Standard: an artist could paint from it

**Interaction Patterns:**
- `data-*` attributes + JS references -> infer interaction behavior
- Scroll-driven: pin containers (`height: xxxsvh` + `sticky`)
- Drag: Draggable / `touch-action` / `cursor-grab`
- 3D: `perspective` + `backface-hidden`
- Mouse follow: `data-image-trail` / `data-sticker-cursor`
- clipPath masking

**Animation Choreography:**
- Lottie: `data-src="xxx.json"` + `data-autoplay` + `data-loop`
- CSS: `@keyframes` + `animation` properties
- Scroll triggers: `data-w-id` + IX2 or ScrollTrigger
- Transitions: `data-transition-link` structures
- Sound: `<audio>` tags + `data-sound-*` bindings

**Do's and Don'ts:**
- DO: extract from actual patterns
- DON'T: infer from **absent** patterns (key insight source)

### Phase 4: Screenshot Cross-Correction

**Source code blind spots** (must rely on screenshots):
1. Font rendering form (compressed/expanded/handwritten feel)
2. Lottie animation content (realistic/abstract/geometric blocks)
3. Photo/image actual content
4. Color palette overall atmosphere
5. Multi-layer compositing effects

With screenshot -> per-screen comparison correction -> update spec
Without screenshot -> mark "~80% accuracy" + list blind spot questions

### Phase 5: Human-in-the-Loop

Present the "Visual Understanding Description" and ask only:

🧑 **Human Gate: "Does this description match what you see on the site? What's wrong?"**

1-2 rounds of correction to converge. Completion signal: user confirms description is accurate.

Then present the full spec section by section:
- Token Layer sections: present as a group, ask for accuracy
- Interaction Patterns: present each, ask if the behavior description is correct
- Do's and Don'ts: present, ask if the inferences make sense

🧑 **Human Gate after each group: "Accurate? Anything to correct?"**

## Output Requirements

- Format: Markdown
- Filename: `[domain]-design-spec.md`
- Save to project directory
- Present to user for review

## Key Principles

1. **Token Layer precise, Experience Layer vivid.** Color values must be exact; experience descriptions need insight.
2. **Description is the quality gate.** If the description is wrong, the spec is useless no matter how detailed.
3. **Label information sources.** Each key piece tagged [source] / [screenshot] / [inferred].
4. **Do's and Don'ts are hidden value.** Design essence is often in "what was deliberately NOT done."
5. **Agent Quick Reference must be filled.** This is the highest-efficiency entry point during generation.
6. **No code generation.** Code is handled by design-prototype.
