# BdxSwipeMenu

Radial swipe menu for touchscreen & desktop — React + framer-motion.

## Features

- **SwipeButtons** — Radial action menu with 3 activation modes (click, hold, swipe)
- **NodeButtonsMenu** — Simpler 4-button cardinal menu for node actions
- Touch-optimized with iPad-friendly gestures
- Glassmorphism styling with smooth framer-motion animations
- Full Playwright E2E test coverage

## Install

```bash
pnpm add github:gatocube/BdxSwipeMenu#v0.1.0
```

## Usage

```tsx
import { SwipeButtons } from 'bdx-swipe-menu'

<SwipeButtons
    nodeId="node-1"
    currentLabel="My Node"
    activationMode="click"
    onAddBefore={(id, type) => console.log('Before', id, type)}
    onAddAfter={(id, type) => console.log('After', id, type)}
    onConfigure={(id, action) => console.log('Config', id, action)}
    onRename={(id, name) => console.log('Rename', id, name)}
    onDismiss={() => console.log('Dismissed')}
/>
```

## Development

```bash
npm install
npm run dev        # Vite dev server with demo page
npm test           # Playwright E2E tests
npm run build      # Production build (demo page)
npm run build:lib  # Library build for package consumption
```

## Demo

Live demo: [gatocube.github.io/BdxSwipeMenu](https://gatocube.github.io/BdxSwipeMenu/)

## License

MIT
