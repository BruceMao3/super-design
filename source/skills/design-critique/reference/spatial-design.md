# Spatial Design

## Spacing Systems

### Use 4pt Base, Not 8pt

8pt is too coarse -- you'll frequently need 12px. Use 4pt: 4, 8, 12, 16, 24, 32, 48, 64, 96px.

### Name Tokens Semantically

Name by relationship (`--space-sm`, `--space-lg`), not value (`--spacing-8`). Use `gap` instead of margins for sibling spacing -- eliminates margin collapse.

## Grid Systems

### The Self-Adjusting Grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
}
```

Columns are at least 280px, as many as fit per row, leftovers stretch. No breakpoints needed for card-style content.

For complex layouts, use named grid areas and redefine at breakpoints.

## Visual Hierarchy

### The Squint Test

Blur your eyes. Can you identify: the most important element? The second? Clear groupings? If everything looks the same weight, you have a hierarchy problem.

### Multiple Dimensions

Don't rely on size alone. Combine:

| Tool | Strong | Weak |
|------|--------|------|
| Size | 3:1+ ratio | <2:1 ratio |
| Weight | Bold vs Regular | Medium vs Regular |
| Color | High contrast | Similar tones |
| Position | Top/left | Bottom/right |
| Space | Surrounded by whitespace | Crowded |

Best hierarchy uses 2-3 dimensions at once.

### Cards Are Not Required

Spacing and alignment create grouping naturally. Use cards only when content is truly distinct and actionable. Never nest cards inside cards.

## Container Queries

```css
.card-container { container-type: inline-size; }

@container (min-width: 400px) {
  .card { grid-template-columns: 120px 1fr; }
}
```

A card in a narrow sidebar stays compact; the same card in main content expands automatically.

## Optical Adjustments

- Text at `margin-left: 0` looks indented -- use `-0.05em` to optically align
- Play icons shift right; arrows shift toward their direction
- Touch targets: 44px minimum via padding or pseudo-elements

## Depth & Elevation

Semantic z-index scale: dropdown(100) -> sticky(200) -> modal-backdrop(300) -> modal(400) -> toast(500) -> tooltip(600).

Shadows should be subtle -- if you can clearly see it, it's probably too strong.

---

**Avoid**: Arbitrary spacing. Making all spacing equal. Creating hierarchy through size alone.
