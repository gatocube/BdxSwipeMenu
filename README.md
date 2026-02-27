# BdxSwipeMenu

Radial swipe menu for touchscreen & desktop — React + framer-motion.

## Features

- **BdxSwipeMenu** — Radial action menu with 3 activation modes (click, hold, swipe)
- Touch-optimized with iPad-friendly gestures
- Glassmorphism styling with smooth framer-motion animations
- Full Playwright E2E test coverage

## Install

```bash
pnpm add github:gatocube/BdxSwipeMenu#v0.1.0
```

## Usage

```tsx
import { BdxSwipeMenu } from 'bdx-swipe-menu'

// Important: your node element must exist in the DOM as `[data-id="node-1"]`.
// The menu tracks screen position via `getBoundingClientRect()`.

<BdxSwipeMenu
    nodeId="node-1"
    currentLabel="My Node"
    activationMode="click"
    onAddBefore={(id, widgetType) => {
        // Example chains (3-step):
        // - before → job → script:js
        // - before → job → ai:planner
        // - before → subflow
        console.log('Before', id, widgetType)
    }}
    onAddAfter={(id, widgetType) => {
        // Example chains (3-step):
        // - after → job → script:py
        // - after → job → ai:worker
        // - after → recent
        console.log('After', id, widgetType)
    }}
    onConfigure={(id, action) => {
        // Example chains (3-step):
        // - config → attach:note
        // - config → attach:expectation
        // - config → settings
        console.log('Config', id, action)
    }}
    onRename={(id, name) => console.log('Rename', id, name)}
    onDismiss={() => console.log('Dismissed')}
/>
```

## Development

```bash
npm install
npm run dev        # Vite dev server (index + demo + docs)
npm test           # Playwright E2E tests
npm run build      # Production build (GitHub Pages site)
npm run build:lib  # Library build for package consumption
```

## Demo

Live pages:

- Home: https://gatocube.github.io/BdxSwipeMenu/
- Demo: https://gatocube.github.io/BdxSwipeMenu/demo.html
- Docs: https://gatocube.github.io/BdxSwipeMenu/docs.html
- Mobile view: https://gatocube.github.io/BdxSwipeMenu/mobile.html
- Long chains: https://gatocube.github.io/BdxSwipeMenu/long-chains.html

## License

MIT
