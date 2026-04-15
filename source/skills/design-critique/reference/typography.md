# Typography

## Classic Typography Principles

### Vertical Rhythm

Your line-height should be the base unit for ALL vertical spacing. If body text has `line-height: 1.5` on `16px` type (= 24px), spacing values should be multiples of 24px. This creates subconscious harmony -- text and space share a mathematical foundation.

### Modular Scale & Hierarchy

The common mistake: too many font sizes that are too close together (14px, 15px, 16px, 18px...). This creates muddy hierarchy.

**Use fewer sizes with more contrast.** A 5-size system covers most needs:

| Role | Typical Ratio | Use Case |
|------|---------------|----------|
| xs | 0.75rem | Captions, legal |
| sm | 0.875rem | Secondary UI, metadata |
| base | 1rem | Body text |
| lg | 1.25-1.5rem | Subheadings, lead text |
| xl+ | 2-4rem | Headlines, hero text |

Popular ratios: 1.25 (major third), 1.333 (perfect fourth), 1.5 (perfect fifth). Pick one and commit.

### Readability & Measure

Use `ch` units for character-based measure (`max-width: 65ch`). Line-height scales inversely with line length -- narrow columns need tighter leading, wide columns need more.

Increase line-height for light text on dark backgrounds. The perceived weight is lighter, so text needs more breathing room. Add 0.05-0.1 to your normal line-height.

## Font Selection & Pairing

### Choosing Distinctive Fonts

Avoid the invisible defaults: Inter, Roboto, Open Sans, Lato, Montserrat. These are everywhere, making your design feel generic.

Pick the font from the brief, not from a category preset. The most common AI typography failure is reaching for the same "tasteful" font for every editorial brief.

A working selection process:
1. Read the brief. Write down three concrete words for the brand voice. Not "modern" or "elegant" -- try "warm and mechanical and opinionated."
2. Imagine the font as a physical object the brand could ship: a typewriter ribbon, a museum exhibit caption, a children's book on cheap newsprint.
3. Browse a font catalog with that physical object in mind. Reject the first thing that "looks designy."
4. Avoid your defaults from previous projects.

### Pairing Principles

You often don't need a second font. One well-chosen font family in multiple weights creates cleaner hierarchy than two competing typefaces.

When pairing, contrast on multiple axes:
- Serif + Sans (structure contrast)
- Geometric + Humanist (personality contrast)
- Condensed display + Wide body (proportion contrast)

Never pair fonts that are similar but not identical.

### Web Font Loading

```css
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}

/* Match fallback metrics to minimize shift */
@font-face {
  font-family: 'CustomFont-Fallback';
  src: local('Arial');
  size-adjust: 105%;
  ascent-override: 90%;
  descent-override: 20%;
  line-gap-override: 10%;
}
```

## Modern Web Typography

### Fluid Type

Fluid typography via `clamp(min, preferred, max)` scales text smoothly with the viewport. Use fluid type for headings and display text on marketing pages. Use fixed `rem` scales for app UIs and dashboards.

### OpenType Features

```css
.data-table { font-variant-numeric: tabular-nums; }
.recipe-amount { font-variant-numeric: diagonal-fractions; }
abbr { font-variant-caps: all-small-caps; }
code { font-variant-ligatures: none; }
body { font-kerning: normal; }
```

## Accessibility

- Never disable zoom (`user-scalable=no`)
- Use rem/em for font sizes, never px for body text
- Minimum 16px body text
- Text links need 44px+ tap targets via padding

---

**Avoid**: More than 2-3 font families per project. Skipping fallback font definitions. Using decorative fonts for body text.
