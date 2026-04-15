# Super Design

Full-lifecycle design skill plugin for AI coding agents. From inspiration research to prototype generation, design polishing, and development delivery -- with human-in-the-loop at every step.

## What It Does

Super Design covers the entire design workflow:

1. **Research** -- Analyze websites to extract design patterns and creativity
2. **Prototype** -- Generate runnable prototypes from design specs or Figma files
3. **Polish** -- Improve design quality with targeted skills (typography, color, layout, motion)
4. **Develop** -- Plan and execute implementation with structured review
5. **Deliver** -- Merge, PR, or ship with verification

## Skills (20)

### Bootstrap
- `super-design` -- Entry point, flow routing, session state

### Reference-Free Zone (no external design opinions)
- `design-essence` -- Quick 5-min website creativity scan
- `design-analysis` -- Full 13-section dual-layer design extraction
- `design-prototype` -- Generate prototype from spec
- `figma-to-code` -- Figma MCP design-to-code pipeline
- `design-brainstorm` -- Original design from scratch

### Process Control
- `design-plan` -- Implementation planning (bite-sized tasks)
- `design-review` -- Two-stage code review (spec compliance + quality)
- `design-finish` -- Delivery workflow (merge / PR / keep / discard)

### Reference-Guided Zone (with design knowledge)
- `design-critique` -- Design review + issue detection (+ `--verify` mode)
- `design-token` -- Design token extraction and management
- `design-typeset` -- Typography fixes
- `design-layout` -- Spacing and layout fixes
- `design-colorize` -- Color strategy
- `design-animate` -- Purposeful motion
- `design-distill` -- Ruthless simplification
- `design-adapt` -- Responsive adaptation
- `design-a11y` -- Accessibility review
- `design-harden` -- Error states, edge cases, i18n
- `design-audit` -- Technical quality check

## Install

### Claude Code
```bash
claude install gh:BruceMao3/super-design
```

### From source
```bash
git clone https://github.com/BruceMao3/super-design.git
cd super-design
node scripts/build.js
# Copy dist/<provider>/ contents to your project
```

## Multi-Provider Support

Build once, deploy to 7 providers:

```bash
node scripts/build.js                    # All providers
node scripts/build.js --provider cursor  # Cursor only
```

Supported: Claude Code, Cursor, Gemini, Codex, Agents (Copilot), Kiro, OpenCode.

## Architecture

```
Reference-Free Zone          Process Control         Reference-Guided Zone
(faithful extraction)        (dev workflow)           (design improvement)
                                                     
design-essence               design-plan             design-critique + reference/
design-analysis              design-review             typography.md
design-prototype             design-finish              color-and-contrast.md
figma-to-code                                          spatial-design.md
design-brainstorm                                      motion-design.md
                                                       interaction-design.md
                                                       responsive-design.md
                                                     design-token
                                                     design-typeset / layout / ...
                                                     design-a11y / harden / audit
```

## License

MIT
