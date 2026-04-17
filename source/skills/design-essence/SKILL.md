---
name: design-essence
description: "Use when user shares a website URL and wants to quickly understand its design strengths -- what makes it good, core creativity, whether it's worth deeper analysis. Keywords: what's good about this site, core creativity, design highlights, inspiration, look at this website."
user-invocable: true
argument-hint: "[URL]"
---

# Design Essence -- Quick Design Creativity Extraction

**Announce at start:** "I'm using the design-essence skill to do a quick creative scan of this website."

<IRON-LAW>
THE OUTPUT MUST USE THE EXACT TEMPLATE BELOW. EVERY SECTION IS MANDATORY. NO SECTION MAY BE EMPTY, SKIPPED, OR MERGED WITH ANOTHER. If you cannot fill a section, write "[Could not determine -- reason]" instead of omitting it.
</IRON-LAW>

## Language Adaptation

<IRON-LAW>
ALL user-facing output MUST match the user's input language. Template heading names and field keys (e.g. "Creativity 1:", "What:", "Reusability:") stay in English. All prose, descriptions, analysis, and judgments MUST be in the user's language.
</IRON-LAW>

## Goal

Input a website URL (optional screenshot), output a **lightweight creativity report** in ~5 minutes answering:

1. **What is it expressing? How?** (core design experience)
2. **What does it look like?** (visual description)
3. **What makes it good?** (creativity breakdown)
4. **Worth going deeper?** (judgment)

No tokens, no CSS, no color tables. Just the essence.

## Mandatory Output Template

You MUST produce output in EXACTLY this structure. Every heading, every field.

```markdown
# [Site Name] - Design Essence

## Core Design Experience

### What It Expresses
[1-2 paragraphs. MUST answer ALL THREE:]
1. Core idea/message of the site
2. What UNCONVENTIONAL method it uses to express that idea
3. How brand concept and interaction form are unified ("the thread")

### What It Looks Like
[3-5 sentences. ONLY what you'd remember with eyes closed. NO generic descriptions.]

## Core Creativity

[3-5 highlights, each using this EXACT format:]

### Creativity 1: [Short Title]
- **What**: [One sentence]
- **Why it's good**: [What problem it solves / what feeling it creates]
- **Brand unity**: [Connected to brand concept or not -- explain]
- **Reusability**: [High/Medium/Low -- works with a different theme?]

### Creativity 2: [Short Title]
[same 4 fields]

### Creativity 3: [Short Title]
[same 4 fields]

## Design Personality

[EXACTLY one metaphor in this format:]
"This site feels like [X] crossed with [Y]"

## Judgment

- **Replication value**: [High / Medium / Low]
- **Most worth borrowing**: [one pattern name]
- **Suggestion**: [run design-analysis? borrow a specific pattern? just inspiration?]
```

### Output Quality Standards

**"What It Expresses" quality gate:**

| Quality | Example |
|---------|---------|
| BAD | "This is a therapy site with lots of animation" |
| BAD | "A modern website with clean design and smooth transitions" |
| GOOD | "The brand slogan is 'See life from a different angle', and the hero's kaleidoscope rotation literally makes you 'rotate your angle' to see different worlds -- the navigation behavior IS the brand expression" |

If your "What It Expresses" reads like the BAD examples, DELETE IT and rewrite. Vague descriptions are plan failures.

**"What It Looks Like" quality gate:**

| Quality | Example |
|---------|---------|
| BAD | "Clean design with nice colors and good typography" |
| GOOD | "Dark background, enormous white display type filling the viewport, a full-screen Lottie showing app UI animating with color against the darkness" |

If your description could apply to 100 other websites, it's too vague. REWRITE.

### No Placeholders Rule

These are output failures -- NEVER write them:
- "Beautiful design" / "Nice animation" / "Clean layout" (generic praise)
- "Modern website" / "Well-crafted" / "Professional" (meaningless labels)
- "Various interactive elements" / "Multiple sections" (vague references)
- "Interesting use of..." without specifying WHAT and HOW
- Any sentence without concrete visual or interaction detail

## Process

### Step 1: Quick Source Scan (2 min)

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

> **Essence rule:** essence does not require full source completeness -- as long as title, meta, main copy, and structural skeleton are obtained, that is sufficient. If Layer 1 already provides this, skip subsequent layers.

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

Only look at first 500 lines. Quickly identify:
- Tech stack (Webflow? Next.js? React?)
- Animation libraries (GSAP? Lottie? None?)
- Special interaction markers (`data-*` attributes)
- Copy content (slogans, headlines, brand messaging)

### Step 2: Find "The Thread" (1 min)

The core step -- find unity between brand concept and interaction form:

1. Extract brand concept from copy (slogan, mission, tagline)
2. Identify core interaction from source structure (what's unconventional)
3. Ask yourself: **Is this interaction "performing" the brand concept?**

Found it -> this is the core sentence of the design experience.
Can't find it -> say so honestly: "The site is visually polished but I couldn't find a deep connection between brand concept and interaction form."

### Step 3: Visual Perception (1 min)

With screenshot -> look and write specific details
Without screenshot -> infer from DOM + classes + SVG + alt text + color variables

Focus on:
- Overall color atmosphere (specific: "dark bg with warm orange accents", not "nice colors")
- Most memorable visual element (specific: "full-screen Lottie of app UI", not "animations")
- Dynamic or static feeling (specific: "scroll-triggered text reveals", not "interactive")

### Step 4: Creativity Breakdown (1 min)

Extract "why is this not ordinary" using this checklist:

- Navigation/switching innovation (kaleidoscope, flick cards, no-nav)
- Typography extremes (oversized, scattered letters, mixed sizes, inline animation)
- Animation-content coupling (scroll-driven, mouse-follow, physics engine)
- Multimedia mashup (photo+illustration, text+Lottie, video+SVG)
- Sound/haptic dimension
- Brand concept made tangible (slogan becomes interaction)
- Counter-positioning (medical site that doesn't look medical)

### Step 5: Self-Review

**MANDATORY. Before presenting to user, check your output against this list:**

- [ ] Every section of the template is present and filled
- [ ] "What It Expresses" names the SPECIFIC brand concept, not a generic category
- [ ] "What It Expresses" names the SPECIFIC interaction form, not "nice animations"
- [ ] "What It Expresses" connects the two (the thread), or explicitly says it couldn't find one
- [ ] "What It Looks Like" has concrete visual details a stranger could picture
- [ ] Each Creativity item has all 4 fields filled (What, Why, Brand unity, Reusability)
- [ ] Design Personality metaphor is specific, not generic ("TED talk x Snapchat" not "modern x clean")
- [ ] Judgment section has all 3 fields
- [ ] No vague praise anywhere (search for: beautiful, nice, clean, modern, well-crafted, professional)
- [ ] Report is 300-500 words (not shorter, not much longer)

**Can't check all boxes? Fix the output before presenting.**

### Step 6: Present & Gate

Present the report. Then:

🧑 **Human Gate:** "Does this capture what you see? Is it worth going deeper with a full analysis?"

**WAIT for user response. Do NOT continue.**

- User says yes -> "I'll run design-analysis for a full extraction." Then **REQUIRED:** invoke design-analysis skill.
- User says corrections -> revise the specific points, re-present, WAIT again.
- User says "just inspiration" -> end here. Do NOT invoke another skill.

Do NOT invoke any other skill. The ONLY valid next skill from design-essence is design-analysis.

## Key Principles

1. **"Core Design Experience" is the soul of the report.** Other sections can be brief, this one must be thorough.
2. **Find the thread.** Brand concept <-> interaction form unity. Find it and you've found the essence.
3. **Fast.** 5 minutes. Don't get lost in technical details.
7. **Source acquisition is a fully automatic 3-layer fallback chain.** Layer 1 curl, Layer 2 CSR shell detection, Layer 3 headless rendering. No human intervention needed unless extreme anti-scraping.
4. **One metaphor beats ten descriptions.**
5. **Give judgment.** Don't just describe, say whether it's worth going deeper.
6. **Specificity over praise.** "calc(6vw + 6vh) fluid type" beats "beautiful typography."
