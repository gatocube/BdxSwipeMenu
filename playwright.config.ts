import { defineConfig, devices } from '@playwright/test'

/**
 * Run tests against different targets:
 *   npm test                                    → dev server (next dev)
 *   TEST_BASE_URL=http://localhost:8090/static/swipemenu npx playwright test  → local nginx
 *   TEST_BASE_URL=https://bdx.gatocube.com/static/swipemenu npx playwright test  → deployed
 *   TEST_BASE_URL=https://gatocube.github.io/BdxSwipeMenu npx playwright test  → GH Pages
 */

const externalUrl = process.env.TEST_BASE_URL

const rawBase = externalUrl || 'http://localhost:5174'
const baseURL = rawBase.endsWith('/') ? rawBase : rawBase + '/'

export default defineConfig({
    testDir: './tests',
    testMatch: '**/*.e2e.ts',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'list',
    use: {
        baseURL,
        trace: 'on-first-retry',
        headless: true,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    // Only start a dev server when no external URL is provided
    ...(externalUrl ? {} : {
        webServer: {
            command: 'NEXT_PUBLIC_BASE_PATH= npx next dev -p 5174 --turbopack',
            url: 'http://localhost:5174',
            reuseExistingServer: !process.env.CI,
            timeout: 60_000,
        },
    }),
})
