# Color & Contrast

## Color Spaces: Use OKLCH

Stop using HSL. Use OKLCH -- it's perceptually uniform, meaning equal steps in lightness *look* equal. `oklch(lightness chroma hue)` where lightness is 0-100%, chroma ~0-0.4, hue 0-360.

To build variants, hold chroma+hue constant and vary lightness -- but **reduce chroma as you approach white or black** (high chroma at extreme lightness looks garish).

## Building Functional Palettes

### Tinted Neutrals

Pure gray is dead. Add tiny chroma (0.005-0.015) to all neutrals, hued toward your brand color. The chroma is small enough not to read as "tinted" consciously, but creates subconscious cohesion.

The hue should come from THIS project's brand, not a formula.

### Palette Structure

| Role | Purpose | Example |
|------|---------|---------|
| **Primary** | Brand, CTAs, key actions | 1 color, 3-5 shades |
| **Neutral** | Text, backgrounds, borders | 9-11 shade scale |
| **Semantic** | Success, error, warning, info | 4 colors, 2-3 shades each |
| **Surface** | Cards, modals, overlays | 2-3 elevation levels |

Skip secondary/tertiary unless you need them.

### The 60-30-10 Rule

About **visual weight**, not pixel count:
- **60%**: Neutral backgrounds, white space, base surfaces
- **30%**: Secondary colors -- text, borders, inactive states
- **10%**: Accent -- CTAs, highlights, focus states

Accent colors work *because* they're rare. Overuse kills their power.

## Contrast & Accessibility

### WCAG Requirements

| Content Type | AA Minimum | AAA Target |
|--------------|------------|------------|
| Body text | 4.5:1 | 7:1 |
| Large text (18px+ or 14px bold) | 3:1 | 4.5:1 |
| UI components, icons | 3:1 | 4.5:1 |

Placeholder text still needs 4.5:1.

### Dangerous Combinations

- Light gray text on white (#1 accessibility fail)
- Gray text on colored backgrounds -- use a shade of the background color instead
- Red on green (8% of men can't distinguish)
- Blue on red (vibrates visually)
- Thin light text on images

### Never Use Pure Gray or Pure Black

Pure gray and #000 don't exist in nature. Even chroma of 0.005-0.01 is enough to feel natural.

## Theming: Light & Dark Mode

Dark mode is NOT inverted light mode:

| Light Mode | Dark Mode |
|------------|-----------|
| Shadows for depth | Lighter surfaces for depth |
| Dark text on light | Light text on dark (reduce weight) |
| Vibrant accents | Desaturate accents slightly |
| White backgrounds | Never pure black -- use dark gray (12-18% lightness) |

Use two token layers: primitives (`--blue-500`) and semantic (`--color-primary: var(--blue-500)`). For dark mode, only redefine the semantic layer.

---

**Avoid**: Relying on color alone to convey information. Using pure black (#000) for large areas. Skipping color blindness testing.
