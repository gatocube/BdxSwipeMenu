## Code review notes (library + docs)

### High-impact improvements

- **Node position tracking**: `BdxSwipeMenu` polls `getBoundingClientRect()` every 50ms. This is reliable but can be wasteful on slower devices and when many menus exist. Consider switching to:
  - `ResizeObserver` on the node element (size changes)
  - `scroll` + `resize` listeners (position changes)
  - a `requestAnimationFrame` loop only while the menu is open
- **Menu state scaling**: the component uses multiple booleans (`expanded`, `jobExpanded`, `scriptExpanded`, `aiExpanded`, `attachExpanded`, `reviewStep`). For long-term scalability, consider moving to a single `activePath` state (array of keys) so new menu depth doesn’t add more state variables.
- **Accessibility**:
  - Add `aria-label` to icon buttons and ensure focus outlines are visible.
  - Add keyboard navigation (arrow keys to move between options, Enter to select, Esc to dismiss).
  - Ensure proper `role="menu"` / `role="menuitem"` semantics if appropriate for your UI.
- **Customization / API**:
  - Today the menu structure is largely hardcoded. If this is intended as a reusable library, consider accepting a menu config tree (labels/icons/colors/actions) so consumers can define their own chains.
  - Keep a small preset-driven demo API only inside the docs site (or export it explicitly as “demo only”).

### Testing & automation

- **Unit tests**: add lightweight unit tests for chain logic (e.g. “active chain connector picks the right buttons”) without needing a browser.
- **Visual regression**: consider Playwright screenshot tests for the menu layout, especially after design tweaks (sizes/spacing/opacity).
- **CI**: ensure `npm test` runs on pull requests and publish build artifacts for GitHub Pages.

### Documentation

- **Props docs**: keep README and the `docs` page in sync (especially when new props are added).
- **Recipes**: add a “common chains” section (e.g. review flow, deploy flow, triage flow) and show the action strings your callbacks receive.

