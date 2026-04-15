---
name: figma-to-code
description: "Use when user provides a Figma URL and wants to convert designs to frontend code. Keywords: Figma, design-to-code, figma.com/design, component implementation, Figma MCP."
user-invocable: true
argument-hint: "[Figma URL]"
---

# Figma to Code -- Figma MCP Design-to-Code Pipeline

## Goal

Input a Figma URL, output production-ready frontend code by leveraging the Figma MCP protocol for pixel-accurate design data extraction.

## URL Parsing

Extract fileKey and nodeId from Figma URLs:

```
figma.com/design/:fileKey/:fileName?node-id=:nodeId
  -> convert "-" to ":" in nodeId

figma.com/design/:fileKey/branch/:branchKey/:fileName
  -> use branchKey as fileKey

figma.com/board/:fileKey/:fileName
  -> FigJam file, use get_figjam
```

## Workflow

### Step 1: Locate Target

```
Parse Figma URL -> extract fileKey, nodeId
  |
  v
get_metadata(fileKey, nodeId)
  |
  -> Parse XML structure tree
  -> Identify Section / Frame / Symbol hierarchy
  -> Extract variant info from Symbol names (Type=X, State=Y)
  |
  v
🧑 Human Gate: "I found these components in the file:
   [list of components with variant counts]
   Which ones should I extract?"
```

### Step 2: Extract Data

For each target component variant:

```
get_design_context(fileKey, nodeId, clientFrameworks="react")
  |
  -> Reference code (React + Tailwind)
  -> Design Tokens (colors/fonts/spacing)
  -> Screenshot (visual reference)
  -> Component description + doc links
  -> Asset URLs (images/SVGs, expire in 7 days)
```

### Step 3: Generate Spec

Organize MCP data into structured spec:

```markdown
# Component Spec: [Component Name]

## Overview
[Component description from Figma metadata]
Documentation: [link]

## Variants
| Property | Values |
|----------|--------|
| Type     | Standard, Social, Learn, Product, Horizontal |
| State    | Default, Hover, Selected, Dragged |

## Design Tokens
| Token | Value | Usage |
|-------|-------|-------|
| gray-50 | #FFFFFF | Background |
| gray-200 | #E6E6E6 | Border |

## Structure (per variant)
[DOM hierarchy description]

## Props Interface
[TypeScript interface]

## Reference Code
[Reference implementation]
```

🧑 **Human Gate: "Here's the extracted spec. Accurate? Any components missing?"**

### Step 4: Adapt to Project

```
Read project tech stack (React/Vue/Svelte/vanilla)
Read project styling (Tailwind/CSS Modules/styled-components)
Map Figma tokens to project token system
Convert reference code to project conventions
```

🧑 **Human Gate: "Here's the adapted code. Does it match the Figma design?"**

### Step 5: Verify

Compare rendered output against Figma screenshots.
If gap is too large -> revise and re-present.

## MCP Tools Reference

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `get_metadata` | File structure tree (XML) | First call: understand file organization |
| `get_design_context` | Code + tokens + screenshot | Core extraction per component |
| `get_screenshot` | Rendered screenshot | Only if get_design_context screenshot is insufficient |
| `get_variable_defs` | Variable definitions | When token extraction needs more detail |
| `search_design_system` | Search components/variables/styles | When looking for specific assets |

## API Call Budget

| Plan | Daily Calls | Strategy |
|------|:-----------:|---------|
| Professional | 200/day | 1 metadata scan + targeted component extractions |
| Organization | 200/day | Same, with higher rate limit |
| Enterprise | 600/day | Can extract more components per session |

**Optimization:** 1 get_metadata to scan structure -> find target nodeIds from XML -> precise get_design_context calls. Never call get_design_context on top-level sections (too large, will error).

## Reference Code Usage Principles

MCP returns React + Tailwind reference code. It is NOT final code:

1. **Don't copy-paste** -- adapt to project tech stack
2. **Tailwind classes are precise** -- spacing, colors, fonts extracted pixel-accurately from Figma
3. **Image URLs expire** -- 7 days, replace with project asset paths
4. **Don't install Tailwind** -- unless project already uses it, convert to project's style system

## What MCP Cannot Provide

| Info | MCP | Source |
|------|:---:|--------|
| Static visual styles | Yes | |
| Component structure | Yes | |
| Design Tokens | Yes | |
| Variant matrix | Yes | |
| Screenshots | Yes | |
| Interaction behavior | No | PRD needed |
| Responsive breakpoints | No | Separate spec |
| Business logic | No | PRD needed |
| Data sources/API | No | Tech docs |

## Key Principles

1. **Token-first.** Extract all tokens -> build variable system -> then implement components. Components reference variables, not hardcoded values.
2. **Variant-aware.** Use Figma Symbol naming (`Type=X, State=Y`) to auto-build component props and conditional rendering.
3. **Incremental extraction.** Don't extract the entire design system at once. Go page by page, module by module.
4. **Bidirectional verification.** Code -> screenshot -> compare with Figma screenshot -> feedback loop.
