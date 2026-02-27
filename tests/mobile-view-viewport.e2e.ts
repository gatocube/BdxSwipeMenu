import { test, expect, type Page } from '@playwright/test'

test.setTimeout(60_000)

test.describe('Mobile view demo: menu stays in viewport', () => {
    test.use({ viewport: { width: 390, height: 844 } })

    async function openMobile(page: Page) {
        await page.goto('mobile')
        await expect(page.locator('text=Mobile view — menu positioning')).toBeVisible({ timeout: 10_000 })
    }

    async function openMenu(page: Page) {
        await page.getByTestId('mobile-anchor-node').click()
        await expect(page.getByTestId('swipe-btn-configure')).toBeVisible({ timeout: 3_000 })
        await expect(page.getByTestId('swipe-btn-add-after')).toBeVisible()
        await expect(page.getByTestId('swipe-btn-add-before')).toBeVisible()
    }

    async function expectButtonsInsideViewport(page: Page, label: string) {
        const vp = page.viewportSize()
        expect(vp, 'viewport size').toBeTruthy()
        const { width, height } = vp!

        const rects = await page.evaluate(() => {
            const els = Array.from(document.querySelectorAll('button[data-testid^="swipe-btn-"], button[data-testid^="ext-"]')) as HTMLButtonElement[]
            return els
                .map(el => {
                    const r = el.getBoundingClientRect()
                    const s = getComputedStyle(el)
                    const visible = s.display !== 'none'
                        && s.visibility !== 'hidden'
                        && r.width > 0
                        && r.height > 0
                    return {
                        testId: el.getAttribute('data-testid') || '(missing)',
                        x: r.x,
                        y: r.y,
                        w: r.width,
                        h: r.height,
                        visible,
                    }
                })
                .filter(x => x.visible)
        })

        expect(rects.length, `visible button count (${label})`).toBeGreaterThan(0)

        for (const r of rects) {
            const eps = 0.5
            expect(r.x, `${label} ${r.testId} x`).toBeGreaterThanOrEqual(0 - eps)
            expect(r.y, `${label} ${r.testId} y`).toBeGreaterThanOrEqual(0 - eps)
            expect(r.x + r.w, `${label} ${r.testId} right`).toBeLessThanOrEqual(width + eps)
            expect(r.y + r.h, `${label} ${r.testId} bottom`).toBeLessThanOrEqual(height + eps)
        }
    }

    const positions = [
        'Center',
        'Top-left',
        'Top edge',
        'Top-right',
        'Left edge',
        'Right edge',
        'Bottom-left',
        'Bottom edge',
        'Bottom-right',
    ] as const

    for (const pos of positions) {
        test(`all menu buttons stay inside viewport (${pos})`, async ({ page }) => {
            await openMobile(page)

            await page.getByRole('button', { name: pos, exact: true }).click()
            await openMenu(page)

            // Top-level should always be in bounds.
            await expectButtonsInsideViewport(page, `${pos}:top-level`)

            // Expand Config → show long chain (review steps).
            await page.getByTestId('swipe-btn-configure').hover()
            await expect(page.getByTestId('ext-cfg-attach')).toBeVisible({ timeout: 2_000 })
            await expect(page.getByTestId('ext-cfg-review')).toBeVisible()

            await page.getByTestId('ext-cfg-review').hover()
            await expect(page.getByTestId('ext-cfg-review-approved')).toBeVisible({ timeout: 2_000 })
            await expectButtonsInsideViewport(page, `${pos}:config-review-chain`)

            // Expand After → Job → Script → (JS/SH/PY)
            await page.getByTestId('swipe-btn-add-after').hover()
            await expect(page.getByTestId('ext-after-job')).toBeVisible({ timeout: 2_000 })
            await page.getByTestId('ext-after-job').hover()
            await expect(page.getByTestId('ext-after-job-script')).toBeVisible({ timeout: 2_000 })
            await expect(page.getByTestId('ext-after-job-ai')).toBeVisible()
            await expectButtonsInsideViewport(page, `${pos}:after-job-chain`)

            // Expand Before → Job → (Script/AI)
            await page.getByTestId('swipe-btn-add-before').hover()
            await expect(page.getByTestId('ext-before-job')).toBeVisible({ timeout: 2_000 })
            await page.getByTestId('ext-before-job').hover()
            await expect(page.getByTestId('ext-before-job-script')).toBeVisible({ timeout: 2_000 })
            await expect(page.getByTestId('ext-before-job-ai')).toBeVisible()
            await expectButtonsInsideViewport(page, `${pos}:before-job-chain`)
        })
    }
})

