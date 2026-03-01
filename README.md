# BdxSwipeMenu

Radial swipe menu for touchscreen & desktop — React + framer-motion.

## Features

- **BdxSwipeMenu** — Radial action menu with 3 activation modes (click, hold, swipe)
- Touch-optimized with iPad-friendly gestures
- Glassmorphism styling with smooth framer-motion animations
- Full Playwright E2E test coverage

## Packages

- **Library**: `@bdx/swipe-menu` (in [`packages/swipe-menu`](packages/swipe-menu))
- **Website (docs + demos)**: `@bdx/website` (in [`apps/website`](apps/website))

## Usage

```tsx
import { BdxSwipeMenu, DEFAULT_PRESET } from '@bdx/swipe-menu'

export function Example() {
  return (
    <BdxSwipeMenu
      state={{
        ...DEFAULT_PRESET,
        activation: 'click',
      }}
      onAction={(nodeId, action) => console.log('Action', nodeId, action)}
      onRename={(nodeId, name) => console.log('Rename', nodeId, name)}
    />
  )
}
```

## Development

```bash
pnpm install
pnpm dev         # run the website
pnpm build       # build the website (static export)
pnpm build:lib   # build @bdx/swipe-menu
pnpm test:smoke  # smoke E2E tests
```

## Demo

Live pages:

- Home: https://gatocube.github.io/BdxSwipeMenu/
- Demo: https://gatocube.github.io/BdxSwipeMenu/demo
- Docs: https://gatocube.github.io/BdxSwipeMenu/docs

## License

MIT
