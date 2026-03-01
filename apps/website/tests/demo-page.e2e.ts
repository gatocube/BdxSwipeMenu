/**
 * Demo Page — E2E tests for the standalone BdxSwipeMenu on /demo.
 *
 * Tests trigger button, radial menu, sub-menu collapse, auto-dismiss,
 * and visual consistency between the menu trigger and the configurator tile.
 */

import { test, expect, type Page } from '@playwright/test'

test.setTimeout(30_000)

// ── Tests ────────────────────────────────────────────────────────────────────

test.describe('Demo page', () => {

    test('menu buttons hidden on start, appear on hover, positioned correctly', async ({ page }) => {
        await page.goto('demo')

        // Trigger button should be visible
        const trigger = page.getByTestId('bdx-trigger')
        await expect(trigger).toBeVisible({ timeout: 10_000 })

        // Trigger should contain an SVG (lucide icon)
        await expect(trigger.locator('svg')).toBeVisible()

        // Root radial buttons should NOT be visible initially
        await expect(page.getByTestId('swipe-btn-actions')).not.toBeVisible()
        await expect(page.getByTestId('swipe-btn-before')).not.toBeVisible()
        await expect(page.getByTestId('swipe-btn-config')).not.toBeVisible()

        // Hover trigger to open menu (swipe mode)
        await trigger.hover()
        await page.waitForTimeout(500)

        // Root radial buttons should now be visible
        await expect(page.getByTestId('swipe-btn-actions')).toBeVisible({ timeout: 3_000 })
        await expect(page.getByTestId('swipe-btn-before')).toBeVisible()
        await expect(page.getByTestId('swipe-btn-config')).toBeVisible()

        // Wait for animations to settle
        await page.waitForTimeout(500)

        // Check positions relative to trigger
        const triggerBox = await trigger.boundingBox()
        const actionsBox = await page.getByTestId('swipe-btn-actions').boundingBox()
        const beforeBox = await page.getByTestId('swipe-btn-before').boundingBox()
        const configBox = await page.getByTestId('swipe-btn-config').boundingBox()

        expect(triggerBox).toBeTruthy()
        expect(actionsBox).toBeTruthy()
        expect(beforeBox).toBeTruthy()
        expect(configBox).toBeTruthy()

        const triggerCx = triggerBox!.x + triggerBox!.width / 2
        const triggerCy = triggerBox!.y + triggerBox!.height / 2
        const actionsCy = actionsBox!.y + actionsBox!.height / 2
        const beforeCx = beforeBox!.x + beforeBox!.width / 2
        const configCx = configBox!.x + configBox!.width / 2

        // "actions" (direction: top) should be ABOVE trigger
        expect(actionsCy).toBeLessThan(triggerCy - 20)

        // "before" (direction: left) should be to the LEFT of trigger
        expect(beforeCx).toBeLessThan(triggerCx - 20)

        // "config" (direction: right) should be to the RIGHT of trigger
        expect(configCx).toBeGreaterThan(triggerCx + 20)
    })

    test('returning cursor to trigger collapses sub-menus, only root icons remain', async ({ page }) => {
        await page.goto('demo')

        const trigger = page.getByTestId('bdx-trigger')
        await expect(trigger).toBeVisible({ timeout: 10_000 })

        // Open menu
        await trigger.hover()
        await page.waitForTimeout(300)
        await expect(page.getByTestId('swipe-btn-actions')).toBeVisible({ timeout: 3_000 })

        // Hover "actions" root button to expand its sub-menu
        await page.getByTestId('swipe-btn-actions').hover()
        await page.waitForTimeout(300)

        // Sub-menu children should be visible
        await expect(page.getByTestId('ext-act-respond')).toBeVisible({ timeout: 2_000 })
        await expect(page.getByTestId('ext-act-remind')).toBeVisible()

        // Return cursor to trigger
        await trigger.hover()
        await page.waitForTimeout(500)

        // Sub-menu children should be gone
        await expect(page.getByTestId('ext-act-respond')).not.toBeVisible({ timeout: 2_000 })
        await expect(page.getByTestId('ext-act-remind')).not.toBeVisible()

        // Root buttons should still be visible (not dimmed)
        await expect(page.getByTestId('swipe-btn-actions')).toBeVisible()
        await expect(page.getByTestId('swipe-btn-before')).toBeVisible()
        await expect(page.getByTestId('swipe-btn-config')).toBeVisible()
        await expect(page.getByTestId('swipe-btn-info')).toBeVisible()
    })

    test('swipe mode auto-dismisses menu after ~350ms when cursor leaves', async ({ page }) => {
        await page.goto('demo')

        const trigger = page.getByTestId('bdx-trigger')
        await expect(trigger).toBeVisible({ timeout: 10_000 })

        // Open menu by hovering trigger
        await trigger.hover()
        await page.waitForTimeout(300)
        await expect(page.getByTestId('swipe-btn-actions')).toBeVisible({ timeout: 3_000 })

        // Move cursor away from all menu elements (top-left corner of page)
        await page.mouse.move(10, 10)

        // Buttons should still be visible immediately
        await expect(page.getByTestId('swipe-btn-actions')).toBeVisible()

        // Wait for the 350ms dismiss timer + animation buffer
        await page.waitForTimeout(600)

        // Buttons should now be hidden
        await expect(page.getByTestId('swipe-btn-actions')).not.toBeVisible({ timeout: 2_000 })
        await expect(page.getByTestId('swipe-btn-before')).not.toBeVisible()
        await expect(page.getByTestId('swipe-btn-config')).not.toBeVisible()
    })

    test('trigger icon in menu matches color and size of configurator trigger tile', async ({ page }) => {
        await page.goto('demo')

        const trigger = page.getByTestId('bdx-trigger')
        await expect(trigger).toBeVisible({ timeout: 10_000 })

        /** Extract rendered width, height, color, borderColor from a DOM element */
        async function getRendered(locator: ReturnType<typeof page.locator>) {
            return locator.evaluate(el => {
                const rect = el.getBoundingClientRect()
                const cs = getComputedStyle(el)
                return {
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                    color: cs.color,
                    borderColor: cs.borderColor,
                }
            })
        }

        // ── 1. Trigger button vs trigger tile in configurator ──

        const triggerStyles = await getRendered(trigger)

        // NodeButton tiles now have data-testid="node-tile-{key}"
        const triggerTile = page.getByTestId('node-tile-_trigger_')
        await expect(triggerTile).toBeVisible({ timeout: 5_000 })

        // Wait for framer-motion scale animations to settle
        await page.waitForTimeout(500)

        const tileStyles = await getRendered(triggerTile)

        // STRICT: exact same width and height
        expect(tileStyles.width,
            `tile width ${tileStyles.width}px should match trigger width ${triggerStyles.width}px`
        ).toBe(triggerStyles.width)
        expect(tileStyles.height,
            `tile height ${tileStyles.height}px should match trigger height ${triggerStyles.height}px`
        ).toBe(triggerStyles.height)

        // STRICT: exact same computed color
        expect(tileStyles.color,
            `tile color "${tileStyles.color}" should match trigger color "${triggerStyles.color}"`
        ).toBe(triggerStyles.color)

        // STRICT: exact same computed borderColor
        expect(tileStyles.borderColor,
            `tile borderColor "${tileStyles.borderColor}" should match trigger borderColor "${triggerStyles.borderColor}"`
        ).toBe(triggerStyles.borderColor)

        // ── 2. Radial "actions" button vs its configurator tile ──
        await trigger.hover()
        await page.waitForTimeout(500)

        const actionsBtn = page.getByTestId('swipe-btn-actions')
        await expect(actionsBtn).toBeVisible({ timeout: 3_000 })

        const actionsMenuStyles = await getRendered(actionsBtn)

        const actionsTile = page.getByTestId('node-tile-actions')
        const actionsTileStyles = await getRendered(actionsTile)

        // Colors must match
        expect(actionsTileStyles.color,
            `"actions" tile color "${actionsTileStyles.color}" should match menu button color "${actionsMenuStyles.color}"`
        ).toBe(actionsMenuStyles.color)
        expect(actionsTileStyles.borderColor,
            `"actions" tile borderColor "${actionsTileStyles.borderColor}" should match menu button "${actionsMenuStyles.borderColor}"`
        ).toBe(actionsMenuStyles.borderColor)
    })
})
