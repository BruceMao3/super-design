---
name: design-essence
description: "Use when user shares a website URL and wants to quickly understand its design strengths -- what makes it good, core creativity, whether it's worth deeper analysis. Keywords: what's good about this site, core creativity, design highlights, inspiration, look at this website."
user-invocable: true
argument-hint: "[URL]"
---

# Design Essence -- Quick Design Creativity Extraction

## Goal

Input a website URL (optional screenshot), output a **lightweight creativity report** in ~5 minutes answering:

1. **What is it expressing? How?** (core design experience)
2. **What does it look like?** (visual description)
3. **What makes it good?** (creativity breakdown)
4. **Worth going deeper?** (judgment)

No tokens, no CSS, no color tables. Just the essence.

## Output Structure

```markdown
# [Site Name] - Design Essence

## Core Design Experience (most important)

### What It Expresses
1-2 paragraphs:
- Core idea/message of the site
- What UNCONVENTIONAL method it uses to express that idea
- How brand concept and interaction form are unified

Quality standard:
BAD: "This is a therapy site with lots of animation"
GOOD: "The brand slogan is 'See life from a different angle',
       and the hero's kaleidoscope rotation literally makes you
       'rotate your angle' to see different worlds --
       the navigation behavior IS the brand expression"

Key: **Find the thread between brand concept and interaction form.**

### What It Looks Like
3-5 sentences describing the most memorable visual moments.
Only what you'd remember with eyes closed.

## Core Creativity (3-5 highlights)

### Creativity N: [Short Title]
- **What**: One sentence
- **Why it's good**: What problem it solves / what feeling it creates
- **Brand unity**: Connected to brand concept or not
- **Reusability**: High / Medium / Low (works with a different theme?)

## Design Personality

One metaphor:
"This site feels like [X] crossed with [Y]"

## Judgment

- Replication value: High / Medium / Low
- Most worth borrowing: [one pattern name]
- Suggestion: [run design-analysis? borrow a specific pattern? just inspiration?]
```

## Process

### Step 1: Quick Source Scan (2 min)

```bash
curl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" <URL> | head -500
```

Only look at first 500 lines. Quickly identify:
- Tech stack (Webflow? Next.js? React?)
- Animation libraries (GSAP? Lottie? None?)
- Special interaction markers (`data-*` attributes)
- Copy content (slogans, headlines, brand messaging)

If curl returns 403, try web_fetch. Both fail: tell user.

### Step 2: Find "The Thread" (1 min)

The core step -- find unity between brand concept and interaction form:

1. Extract brand concept from copy (slogan, mission, tagline)
2. Identify core interaction from source structure (what's unconventional)
3. Ask yourself: **Is this interaction "performing" the brand concept?**

Found it -> this is the core sentence of the design experience
Can't find it -> the site may just be visually pretty but not deeply designed. Say so honestly.

### Step 3: Visual Perception (1 min)

With screenshot -> look and write
Without screenshot -> infer from DOM + classes + SVG + alt text + color variables

Only care about:
- Overall color atmosphere
- Most memorable visual element
- Dynamic or static feeling

### Step 4: Creativity Breakdown (1 min)

Extract "why is this not ordinary":

**Common creativity type checklist:**
- Navigation/switching innovation (kaleidoscope, flick cards, no-nav)
- Typography extremes (oversized, scattered letters, mixed sizes, inline animation)
- Animation-content coupling (scroll-driven, mouse-follow, physics engine)
- Multimedia mashup (photo+illustration, text+Lottie, video+SVG)
- Sound/haptic dimension
- Brand concept made tangible (slogan becomes interaction)
- Counter-positioning (medical site that doesn't look medical)

### Step 5: Present & Gate

Present the report (300-500 words). Every sentence carries information. No filler.

🧑 **Human Gate:** "Does this capture what you see? Is it worth going deeper with a full analysis?"

- User says yes -> suggest running design-analysis
- User says no / corrections -> revise the specific points, re-present
- User says "just inspiration" -> end here

## Key Principles

1. **"Core Design Experience" is the soul of the report.** Other sections can be brief, this one must be thorough.
2. **Find the thread.** Brand concept <-> interaction form unity. Find it and you've found the essence.
3. **Fast.** 5 minutes. Don't get lost in technical details.
4. **One metaphor beats ten descriptions.**
5. **Give judgment.** Don't just describe, say whether it's worth going deeper.

## Relationship to Other Skills

```
design-essence (quick scan, 5 min, grab essence)
  | "worth going deeper"
  v
design-analysis (full extraction, 30 min, 13-section spec)
  | spec output
  v
design-prototype (generate prototype from spec)
```

User can skip essence and go directly to analysis. They are progressive, not sequential.
