---
name: design-prototype
description: "Use when user has a 13-section design spec (from design-analysis or design-brainstorm) and wants to generate a runnable frontend prototype. Keywords: generate from spec, replicate, build prototype, make something similar, reproduce the effect."
user-invocable: true
argument-hint: "[spec file path]"
---

# Design Prototype -- Generate Prototype from Dual-Layer Spec

## Goal

Input a 13-section dual-layer design spec (from design-analysis or design-brainstorm), output a runnable frontend prototype (React JSX) that faithfully reproduces the core design patterns and visual experience.

Target is **design-pattern-level reproduction** -- capture the most impressive design strategies and implement 80% of the effect with feasible technology. Not pixel-perfect cloning.

## Input Format

This skill accepts ONLY the 13-section dual-layer spec format. Whether the spec came from design-analysis (extraction) or design-brainstorm (original creation), the reading logic is the same.

**If user provides free-form description instead of a spec:** suggest running design-brainstorm first to produce a standard spec. The spec is the quality bridge between design and generation.

**Thin section handling:** Brainstorm-originated specs may have thin Token Layer sections (e.g., direction descriptions instead of precise hex values). When encountering thin sections, derive concrete values from the Quick Reference and Visual Understanding description, and mark them as `[derived]` in the output.

## Spec Reading Priority

### First Priority: Establish Direction (30 seconds to have a sense)
1. **Appendix: Agent Quick Reference** -> 5 colors, 2 fonts, key dimensions, style one-liner
2. **Section 0: Core Design Experience** -> understand "what this site is expressing"
3. **Section 11: Do's and Don'ts** -> know what absolutely must not be done

### Second Priority: Build Skeleton
4. **Section 3: Color Palette** -> define all color variables
5. **Section 4: Typography** -> pick Google Fonts substitutes + define scale
6. **Section 6: Layout Principles** -> Grid + spacing + max-width

### Third Priority: Build Core Experience
7. **Section 8: Core Interaction Patterns** -> implement by impact ranking
8. **Section 9: Animation Choreography** -> implement what's feasible, simplify and annotate the rest
9. **Section 0: Per-Screen Visual Description** -> build each section in order

### Fourth Priority: Polish Details
10. **Section 5: Component Patterns** -> button, card, nav precise styles
11. **Section 7: Depth & Elevation** -> shadows and z-index
12. **Section 10: Responsive Strategy** -> clamp and flex-wrap

### Can Skip
13. **Section 2: Visual Theme** -> already covered by Core Design Experience
14. **Section 1: Tech Stack** -> reference but don't copy original tech
15. **Section 12: Design Philosophy** -> already internalized

## Implementation Strategy

### Token System

Translate directly from spec's Token Layer:

```javascript
// From Section 3 (Colors)
const colors = {
  primary: "#xxx",
  secondary: "#xxx",
  accent: "#xxx",
  bg: "#xxx",
  surface: "#xxx",
  text: "#xxx",
  textMuted: "#xxx",
  // Section-specific palettes if any
  sections: {
    hero: { bg: "#xxx", text: "#xxx" },
  }
};

// From Section 4 (Typography)
// Add Google Fonts <link> at component top
// Font substitution strategy:
//   Compressed italic -> Bebas Neue / Anton
//   Rounded expanded -> Lilita One / Boogaloo / Bubblegum Sans
//   Hand-drawn feel -> Caveat / Patrick Hand
//   Modern refined -> DM Sans / Outfit
//   Monospace/tech -> JetBrains Mono / Fira Code

// From Section 6 (Layout)
const layout = {
  maxWidth: 1400,
  grid: 12,
  gap: "1.25rem",
  spacingUnit: "1rem",
};
```

### Core Interaction Implementation

Read Section 8, implement by priority:

**Must implement (defining experiences):**
- Core interaction pattern with full state management + animation + events
- Color system and sectional palette strategy
- Typography hierarchy visual impact

**Try to implement (differentiating details):**
- Micro-interactions (button morphing, text hover, sticker floating)
- Simplified parallax (scrollY listener)
- Decorative elements

**Simplify or annotate (nice-to-have):**
- Lottie -> static SVG + CSS animation approximation
- Physics engine -> CSS transition approximation
- Sound -> omit, annotate in comments
- Complex scroll-driven -> state switching + transition

### SVG Component Building

Create simplified SVG components based on per-screen descriptions:

```
Original hand-drawn character -> simplified geometric SVG conveying same style language
Original Lottie athlete -> static block figure SVG + bobble/rotate CSS animation
Original photo -> gradient color block + text label placeholder
Original video -> dark background + "Play Video" label
```

Key: **style consistency matters more than precision.** All SVG components use the same visual language (same border-radius, same color saturation, same stroke width).

### Section Assembly

Build top-to-bottom following per-screen description:

1. Navigation (fixed, possibly multi-color versions)
2. Hero section (where core interaction lives)
3. Content sections (in description order)
4. Transition areas (color palette changes)
5. CTA / Join section
6. Footer

Each section is self-contained: background + content + decoration + transition.

### Do's and Don'ts Execution

Continuously check against Section 11 during generation:

```
DO "use all-caps bold headings" -> text-transform: uppercase; font-weight: 900
DON'T "no gradient backgrounds" -> all backgrounds use solid colors
DON'T "no generic stock imagery" -> use hand-drawn SVG or color block placeholders
DO "maintain generous whitespace" -> increase section padding
```

This step is often skipped but has 80% impact on whether it "feels right."

## Technical Constraints

### Available
- React hooks (useState, useEffect, useRef, useCallback)
- Tailwind core utility classes
- Inline styles
- Google Fonts CDN
- cdnjs.cloudflare.com external libraries
- Lucide React icons
- Recharts
- SVG (inline)
- CSS @keyframes animation
- CSS transition
- CSS transform / perspective / backface-hidden

### Not Available
- localStorage / sessionStorage
- npm packages (except pre-installed)
- GSAP / Lottie player / Framer Motion
- External JS libraries (except from cdnjs)
- `<form>` tags

### Substitution Table

| Original Tech | Substitute | Effect Loss |
|---------------|-----------|-------------|
| GSAP ScrollTrigger | scrollY + useEffect | Pin effect missing, use auto-carousel |
| GSAP Draggable | onClick + simple onMouse drag | Physics inertia missing |
| Lottie animation | Static SVG + CSS @keyframes | Lose frame animation detail, keep motion feel |
| Matter.js | Omit | No physics collision |
| Lenis smooth scroll | Native scroll | Scroll feel difference |
| Swiper | CSS scroll-snap or manual carousel | Functionally equivalent |
| Sound | Omit, annotate | Silent |
| Video background | Gradient + label placeholder | No dynamic footage |
| Three.js 3D | Omit or CSS 3D transform | Major simplification |

## Quality Checklist

Self-check after generation:

### Feel (Most Important)
- [ ] First glance "feels right" -- colors, fonts, density match spec description
- [ ] Core interaction is operable and smooth
- [ ] Do's and Don'ts not violated

### Token Layer
- [ ] All colors use exact spec values (or marked `[derived]` for brainstorm specs)
- [ ] Font hierarchy has clear visual difference (display != body)
- [ ] Spacing system is consistent (not random padding values)
- [ ] Border-radius is uniform

### Experience Layer
- [ ] Most impressive 1-2 interaction patterns implemented
- [ ] Section color transitions are natural
- [ ] Decorative element density is adequate (not barren)
- [ ] Animation rhythm has breathing room (not all static, not all moving)

### Engineering
- [ ] Responsive is usable (clamp + flex-wrap)
- [ ] No console errors
- [ ] Animations don't lag

## Human-in-the-Loop

After generation, present the prototype with:

```
Core patterns implemented:
1. [Pattern name] -- [one sentence]
2. ...

Main gaps vs. original:
1. [Gap] -- [reason]
2. ...

To further refine, suggestions:
1. [Next step]
```

🧑 **Human Gate: "Does the prototype feel right? What needs adjustment?"**

1-2 rounds of focused refinement. Focus on the specific issue the user identifies, don't re-generate everything.

## Routing Rule

If user provides a URL directly and asks to "replicate": suggest running design-analysis first to produce a spec. The spec is the quality bridge between analysis and generation.

## Key Principles

1. **Spec is the only input.** Don't reference original site source -- this validates spec quality.
2. **Read Quick Reference before starting.** 5 colors + 2 fonts + style one-liner, 30 seconds to establish direction.
3. **Do's and Don'ts throughout.** Whether it "feels right" is 80% determined by "what was NOT done."
4. **Impact over completeness.** 3 polished sections > 10 rough sections.
5. **SVGs are substitutes, not copies.** Same visual language, simplified geometry.
6. **Honestly annotate gaps.** Tell user what was simplified and why.
7. **Generate once, iterate from feedback.** First version runs the core patterns, subsequent versions add detail based on user feedback.
