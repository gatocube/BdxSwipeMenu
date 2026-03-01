/**
 * Smoke test: visit every page, assert it loads with no console errors.
 */

import { test, expect, type Page, type ConsoleMessage } from '@playwright/test'

test.setTimeout(30_000)

const PAGES = [
    { path: '', label: 'Home' },
    { path: 'demo', label: 'Demo' },
    { path: 'components', label: 'Components' },
    { path: 'docs', label: 'Docs' },
    { path: 'examples', label: 'Examples' },
    { path: 'build-yours', label: 'Build Yours' },
]

function collectErrors(page: Page) {
    const errors: string[] = []
    const handler = (msg: ConsoleMessage) => {
        if (msg.type() === 'error') {
            errors.push(msg.text())
        }
    }
    page.on('console', handler)
    return { errors, cleanup: () => page.off('console', handler) }
}

test.describe('Smoke: all pages load without errors', () => {
    for (const { path, label } of PAGES) {
        test(`${label} page loads (/${path})`, async ({ page }) => {
            const { errors, cleanup } = collectErrors(page)

            const resp = await page.goto(path || '/', { waitUntil: 'domcontentloaded' })
            expect(resp?.status(), `${label} HTTP status`).toBeLessThan(400)

            // Wait a moment for any late console errors
            await page.waitForTimeout(500)
            cleanup()

            // Filter out known non-critical warnings
            const real = errors.filter(e =>
                !e.includes('favicon.ico') &&
                !e.includes('Download the React DevTools') &&
                !e.includes('Mixed Content')
            )
            expect(real, `${label} console errors`).toEqual([])
        })
    }
})
