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

SCREENSHOT VERIFICATION IS MANDATORY. You MUST use Playwright to take per-screen screenshots of the target site and verify every visual description against the actual rendered page. A spec that was not screenshot-verified is a failed spec. Never skip Phase 4.
</IRON-LAW>

## Language Adaptation

<IRON-LAW>
ALL user-facing output MUST match the user's input language. Template heading names, field keys, and technical identifiers stay in English. All prose, descriptions, analysis, and judgments MUST be in the user's language.
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

#### Source Acquisition (3-Layer Automatic Fallback)

**Layer 1: curl + UA spoofing** (covers 70%+ of sites)

```bash
curl -s -L -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36" \
  -H "Accept: text/html,application/xhtml+xml" \
  -H "Accept-Language: en-US,en;q=0.9" \
  <URL> > /home/claude/source.html
```

**Layer 2: CSR empty shell detection**

Automatically determine if Layer 1 result contains real content:

```bash
SIZE=$(wc -c < /home/claude/source.html)
BODY_CONTENT=$(grep -oP '(?<=<body)[^>]*>.*' /home/claude/source.html | head -c 3000)
SCRIPT_RATIO=$(grep -c '<script' /home/claude/source.html)

# Trigger fallback if ANY condition is met:
# 1. HTML smaller than 5KB
# 2. Body content fewer than 500 characters (excluding scripts)
# 3. Framework shell markers detected: <div id="root"></div> / <div id="__next"></div> / <div id="app"></div> with no surrounding content
```

If classified as CSR empty shell -> proceed to Layer 3.

> **Analysis rule:** analysis requires complete source. The 3-layer strategy must run until substantive DOM is obtained. The rendered HTML is equivalent to what you see in browser DevTools.

**Layer 3: Headless browser rendering**

Use puppeteer or playwright to get the fully rendered DOM:

```bash
node -e "
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('<URL>', { waitUntil: 'networkidle2', timeout: 30000 });
  const html = await page.content();
  console.log(html);
  await browser.close();
})();
" > /home/claude/source.html
```

If puppeteer is not installed, run `npm install puppeteer` first or use the playwright equivalent.

**When all layers fail**

All three layers fail (rare) -> inform the user the site may have anti-scraping measures and ask if they can provide the HTML manually.

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

### Phase 4: Screenshot Cross-Correction (MANDATORY)

<IRON-LAW>
Phase 4 is NOT optional. You MUST take screenshots yourself using Playwright and verify every per-screen description against the actual rendered page. A spec without screenshot verification is a FAILED spec. Never skip this phase. Never mark sections as "[~80% accuracy]" when you have the ability to take screenshots.
</IRON-LAW>

#### Step 4.1: Per-Screen Screenshot Capture

Use Playwright MCP to navigate to the target URL and capture screenshots screen by screen:

1. Navigate to the URL with `browser_navigate`
2. Take a screenshot of the initial viewport (`browser_take_screenshot`) — this is **[Screen 1]**
3. Scroll down by one viewport height using `browser_evaluate` with `window.scrollBy(0, window.innerHeight)`
4. Take the next screenshot — **[Screen 2]**
5. Repeat scroll + screenshot until you reach the bottom of the page
6. For pages with distinct route-based sections (e.g. tabs, modals), navigate to each and screenshot separately

**Naming convention:** Label each screenshot as [Screen N] matching the Per-Screen Visual Description in Section 0.

#### Step 4.2: Screenshot vs. Spec Comparison

For EACH screenshot, compare against the corresponding [Screen N] description in Section 0 and the relevant Token Layer data (Sections 2-7). Check for:

| Check | What to compare |
|-------|----------------|
| **Colors** | Do hex values in Section 3 match what's actually rendered? Background, text, accent colors. |
| **Typography** | Do font sizes, weights, and families in Section 4 match the screenshot? |
| **Layout** | Does the grid, spacing, and element positioning in Section 6 match? |
| **Components** | Do button styles, card designs, nav patterns in Section 5 match? |
| **Animation resting state** | Are the static frames of animations (Section 9) accurately described? |
| **Visual atmosphere** | Does Section 2 mood/theme match what you actually see? |
| **Content** | Are headlines, copy, images accurately captured in Section 0? |

#### Step 4.3: Correction Loop

For each discrepancy found:

1. **Identify** the specific section and data point that's wrong
2. **Correct** the spec with what the screenshot actually shows
3. **Label** the correction with `[screenshot-corrected]` so the source is clear
4. **Re-verify** — after corrections, take a fresh look at the screenshot to confirm the fix is accurate

Source code blind spots that ONLY screenshots can catch:
- Font rendering and actual typeface appearance
- Lottie/animation content and visual form
- Photo/image content and composition
- Color palette atmosphere (computed colors vs. CSS variable values)
- Multi-layer compositing and blend mode effects
- Gradient rendering and actual color stops
- Hover/active state visuals (use `browser_hover` / `browser_click` to trigger)

#### Step 4.4: Interactive State Capture

Beyond static screens, capture key interactive states:

1. **Hover states** — hover over primary buttons, cards, nav items; screenshot each
2. **Scroll-triggered animations** — scroll slowly through trigger zones; capture mid-animation frames
3. **Navigation states** — open mobile menu, dropdowns, modals if present; screenshot each
4. **Compare** each interactive state against Section 8 (Interaction Patterns) and Section 9 (Animation Choreography); correct discrepancies

#### Step 4.5: Completion Gate

Phase 4 is complete ONLY when:
- [ ] Every [Screen N] in Section 0 has a corresponding screenshot taken and verified
- [ ] Every discrepancy between source-based spec and screenshot has been corrected
- [ ] All corrections are labeled `[screenshot-corrected]`
- [ ] At least hover states of primary interactive elements have been captured and verified
- [ ] No Section 0 description could surprise someone who then looks at the actual screenshot

### Phase 5: Self-Review

**MANDATORY. Before presenting to user, verify ALL of the following:**

#### Structure & Completeness
- [ ] All 13 sections present with correct heading names
- [ ] Section 0 has per-screen descriptions, not just overview
- [ ] Appendix Quick Reference has all 5 fields filled with actual values

#### Token Layer Precision
- [ ] Section 3 has actual hex/oklch values, not color names
- [ ] Section 4 has actual px/rem/clamp values, not "large/small"
- [ ] Section 5 has CSS pseudo-code, not prose descriptions
- [ ] Every color has a hex value
- [ ] Every animation has a duration

#### Experience Layer Quality
- [ ] Section 8 has specific parameters (duration, easing, angles), not "smooth"
- [ ] Section 9 has Lottie URLs if Lottie was detected
- [ ] Section 11 DON'T list has at least 3 items inferred from ABSENT patterns

#### Screenshot Verification (NON-NEGOTIABLE)
- [ ] Phase 4 was executed — screenshots were actively taken, not skipped
- [ ] Every [Screen N] in Section 0 has been verified against an actual screenshot
- [ ] Colors in Section 3 have been cross-checked against rendered screenshots
- [ ] Typography in Section 4 has been cross-checked against rendered screenshots
- [ ] At least primary hover/interactive states have been captured and verified
- [ ] All screenshot-based corrections are labeled `[screenshot-corrected]`
- [ ] No per-screen description would surprise someone viewing the actual page

#### Language & Quality
- [ ] No generic praise anywhere (search: beautiful, nice, clean, modern, professional)
- [ ] Information sources labeled [source] / [screenshot] / [screenshot-corrected] / [inferred]

**Can't check all boxes? Go back and fix before presenting. If screenshot boxes are unchecked, you MUST return to Phase 4 — do not proceed.**

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
7. **Source acquisition is a fully automatic 3-layer fallback chain.** Layer 1 curl, Layer 2 CSR shell detection, Layer 3 headless rendering. No human intervention needed unless extreme anti-scraping.
