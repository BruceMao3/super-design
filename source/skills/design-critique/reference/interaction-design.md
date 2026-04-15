# Interaction Design

## The Eight Interactive States

| State | When | Visual Treatment |
|-------|------|------------------|
| Default | At rest | Base styling |
| Hover | Pointer over (not touch) | Subtle lift, color shift |
| Focus | Keyboard/programmatic | Visible ring |
| Active | Being pressed | Pressed in, darker |
| Disabled | Not interactive | Reduced opacity, no pointer |
| Loading | Processing | Spinner, skeleton |
| Error | Invalid state | Red border, icon, message |
| Success | Completed | Green check, confirmation |

The common miss: designing hover without focus. Keyboard users never see hover states.

## Focus Rings

Never `outline: none` without replacement. Use `:focus-visible`:

```css
button:focus { outline: none; }
button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

Focus rings: high contrast (3:1), 2-3px thick, offset, consistent across all interactive elements.

## Form Design

- Placeholders aren't labels -- always use visible `<label>`
- Validate on blur, not every keystroke (except password strength)
- Place errors below fields with `aria-describedby`

## Loading States

- Optimistic updates: show success immediately, rollback on failure (low-stakes only)
- Skeleton screens > spinners -- they preview content shape

## Modals: Use Dialog

```javascript
const dialog = document.querySelector('dialog');
dialog.showModal();  // Focus trap, closes on Escape
```

Or use `inert` attribute on background content.

## Dropdown Positioning

Dropdowns in `overflow: hidden` containers will be clipped. Solutions:
- CSS Anchor Positioning (Chrome 125+)
- Popover API (`popover` attribute -- top layer, no z-index wars)
- Portal/Teleport pattern (React `createPortal`, Vue `<Teleport>`)
- `position: fixed` with JS coordinates

Anti-patterns:
- `position: absolute` inside `overflow: hidden`
- Arbitrary `z-index: 9999`
- Inline dropdown markup without escape hatch

## Destructive Actions

Undo > confirmation dialogs. Users click through confirmations mindlessly. Show undo toast, delete after expiry. Use confirmation only for truly irreversible or high-cost actions.

## Keyboard Navigation

Roving tabindex for component groups: one item tabbable, arrow keys move within. Provide skip links for keyboard users.

## Gesture Discoverability

Swipe-to-delete is invisible. Always provide a visible fallback.

---

**Avoid**: Removing focus indicators. Placeholder-as-label. Touch targets <44px. Custom controls without ARIA/keyboard support.
