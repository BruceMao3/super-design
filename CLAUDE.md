# Super-Design Skill Set -- Maintenance Rules

## Project Overview

This is the **super-design** plugin -- a set of design skills for Claude Code (and other AI coding agents). The source of truth is in `source/skills/`, with built distributions in `dist/` for multiple platforms.

Repository: `BruceMao3/super-design`

## Skill Authoring Rules

### Language
- All skill content MUST be written in English. No Chinese or mixed-language text in skill files.
- Comments, instructions, rules, quality gates -- everything in English.

### Source Acquisition
- Never use a bare `curl` as the only source acquisition method. Always use the **3-layer automatic fallback chain**:
  1. curl + UA spoofing
  2. CSR empty shell detection (check for framework shells like `<div id="root"></div>`)
  3. Headless browser rendering (puppeteer/playwright)
- **essence** is lenient: skip Layer 3 if basic info (title, meta, copy) is already obtained from Layer 1.
- **analysis** is strict: must run all layers until substantive DOM is obtained.

### Screenshot Verification (design-analysis)
- Phase 4 (Screenshot Cross-Correction) is **mandatory, never optional**.
- Must actively take screenshots using Playwright MCP -- never rely on user-provided screenshots as the only path.
- Screenshots must be taken **per-screen** (scroll by viewport height, capture each screen).
- Every per-screen description in Section 0 must be verified against an actual screenshot.
- Discrepancies must be corrected and labeled `[screenshot-corrected]`.
- Interactive states (hover, scroll animations, modals) must also be captured and verified.
- Self-review (Phase 5) must include screenshot verification checklist -- if unchecked, must return to Phase 4.

### Quality Gates
- No generic praise: "beautiful", "nice", "clean", "modern", "professional" are banned.
- Every data point must be specific: hex values not color names, px/rem not "large/small", duration+easing not "smooth".
- Information sources must be labeled: `[source]` / `[screenshot]` / `[screenshot-corrected]` / `[inferred]`.

## Repository Hygiene
- `source/skills/` is the single source of truth. `dist/` is built output.
- `.DS_Store` is in `.gitignore` -- never commit macOS metadata files.
- Do not put private/sensitive docs (design specs, internal references) into this public repo.
- The outer directory (`/Users/bruce/git_repos/design_agent/`) contains local-only reference docs that should NOT be committed.

## Build & Distribution
- Build script: `scripts/build.js`
- Distributes to 7 platforms: claude-code, agents, codex, cursor, gemini, kiro, opencode
- After editing source skills, remember to rebuild if needed before release.
