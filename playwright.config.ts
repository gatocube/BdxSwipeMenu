import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './tests',
    testMatch: '**/*.e2e.ts',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:5174/BdxSwipeMenu/',
        trace: 'on-first-retry',
        headless: true,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: 'npm run dev -- --port 5174',
        url: 'http://localhost:5174/BdxSwipeMenu/',
        reuseExistingServer: !process.env.CI,
    },
})
