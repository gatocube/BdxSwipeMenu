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

    test('JSON editor has no lint error markers on load', async ({ page }) => {
        await page.goto('demo')

        // Wait for CodeMirror to render
        const editor = page.locator('.cm-editor')
        await expect(editor).toBeVisible({ timeout: 10_000 })

        // Give the linter time to run
        await page.waitForTimeout(1500)

        const errorCount = await page.locator('.cm-lint-marker-error').count()
        expect(errorCount, 'CodeMirror should have zero lint errors on initial load').toBe(0)
    })

    test('color picker in JSON editor updates hex value', async ({ page }) => {
        await page.goto('demo')

        const editor = page.locator('.cm-editor')
        await expect(editor).toBeVisible({ timeout: 10_000 })

        // Wait for CodeMirror decorations to render (color swatches)
        const swatch = editor.locator('.cm-color-swatch input[type="color"]').first()
        await expect(swatch).toBeAttached({ timeout: 10_000 })

        const originalColor = await swatch.inputValue()
        expect(originalColor).toMatch(/^#[0-9a-fA-F]{6}$/)

        const newColor = '#ff0000'
        await swatch.evaluate((el, color) => {
            const input = el as HTMLInputElement
            input.value = color
            input.dispatchEvent(new Event('change', { bubbles: true }))
        }, newColor)

        await page.waitForTimeout(500)

        const editorText = await editor.locator('.cm-content').textContent()
        expect(editorText).toContain(newColor)
    })

    test('changing button color via color picker updates the rendered menu button', async ({ page }) => {
        await page.goto('demo')

        const editor = page.locator('.cm-editor')
        await expect(editor).toBeVisible({ timeout: 10_000 })

        // Wait for color swatches to render
        const swatch = editor.locator('.cm-color-swatch input[type="color"]').first()
        await expect(swatch).toBeAttached({ timeout: 10_000 })

        // First swatch corresponds to "actions" node (color: #7c3aed)
        const originalColor = await swatch.inputValue()
        expect(originalColor.toLowerCase()).toBe('#7c3aed')

        // Change color to bright red
        const newColor = '#ff0000'
        await swatch.evaluate((el, color) => {
            const input = el as HTMLInputElement
            input.value = color
            input.dispatchEvent(new Event('change', { bubbles: true }))
        }, newColor)

        // Wait for React state update and re-render
        await page.waitForTimeout(800)

        // Open the menu to make the "actions" button visible
        const trigger = page.getByTestId('bdx-trigger')
        await trigger.hover()
        await page.waitForTimeout(500)

        const actionsBtn = page.getByTestId('swipe-btn-actions')
        await expect(actionsBtn).toBeVisible({ timeout: 3_000 })

        // Verify the button's computed CSS color matches the new color
        const btnColor = await actionsBtn.evaluate(el => getComputedStyle(el).color)
        expect(
            btnColor,
            `"actions" button color should be red (#ff0000 → rgb(255, 0, 0)), got "${btnColor}"`
        ).toBe('rgb(255, 0, 0)')

        // Also verify the SVG icon inherits the same color
        const iconColor = await actionsBtn.locator('svg').evaluate(
            el => getComputedStyle(el).color
        )
        expect(
            iconColor,
            `SVG icon color should be red, got "${iconColor}"`
        ).toBe('rgb(255, 0, 0)')
    })

    test('direction field shows autocomplete with valid options', async ({ page }) => {
        await page.goto('demo')

        const editor = page.locator('.cm-editor')
        await expect(editor).toBeVisible({ timeout: 10_000 })
        await page.waitForTimeout(1000)

        // Access the EditorView via CM6's internal cmTile property chain:
        // .cm-content DOM -> .cmTile -> .root (DocTile) -> .view (EditorView)
        const found = await page.evaluate(() => {
            const content = document.querySelector('.cm-content')
            if (!content) return false
            const tile = (content as unknown as { cmTile?: { root?: { view?: { state: { doc: { toString(): string } }; dispatch(spec: unknown): void; focus(): void } } } }).cmTile
            const view = tile?.root?.view
            if (!view) return false
            const doc = view.state.doc.toString()
            const dirMatch = /"direction":\s*"top"/.exec(doc)
            if (!dirMatch) return false
            const valueStart = doc.indexOf('"top"', dirMatch.index)
            if (valueStart < 0) return false
            // Select "top" text (inside the quotes)
            view.dispatch({ selection: { anchor: valueStart + 1, head: valueStart + 4 } })
            view.focus()
            return true
        })

        expect(found, 'Should find and select direction value in editor').toBe(true)
        await page.waitForTimeout(200)

        // Type to replace selected text and trigger autocomplete
        await page.keyboard.type('bo')
        await page.waitForTimeout(300)

        // Trigger autocomplete explicitly
        await page.keyboard.press('Control+Space')
        await page.waitForTimeout(500)

        const autocomplete = page.locator('.cm-tooltip-autocomplete')
        await expect(autocomplete).toBeVisible({ timeout: 3_000 })

        const tooltipText = await autocomplete.textContent()
        expect(tooltipText).toContain('bottom')
    })

    test('theme toggle in header switches between glow-night and light themes', async ({ page }) => {
        await page.goto('demo')

        const trigger = page.getByTestId('bdx-trigger')
        await expect(trigger).toBeVisible({ timeout: 10_000 })

        const themeToggle = page.getByTestId('theme-toggle')
        await expect(themeToggle).toBeVisible()

        // ── 1. Default theme is glow-night ──
        await trigger.hover()
        await page.waitForTimeout(500)
        const menu = page.getByTestId('swipe-buttons-menu')
        await expect(menu).toBeVisible({ timeout: 3_000 })
        await expect(menu).toHaveAttribute('data-bdx-theme', 'glow-night')

        const actionsBtn = page.getByTestId('swipe-btn-actions')
        const glowBg = await actionsBtn.evaluate(el => getComputedStyle(el).backgroundColor)

        // Dismiss menu completely
        await page.mouse.move(10, 10)
        await expect(menu).not.toBeVisible({ timeout: 3_000 })

        // ── 2. Switch to light ──
        await themeToggle.click({ force: true })
        await page.waitForTimeout(500)

        // Open menu again — should be light
        await trigger.hover()
        await page.waitForTimeout(500)
        await expect(menu).toBeVisible({ timeout: 3_000 })
        await expect(menu).toHaveAttribute('data-bdx-theme', 'light')

        const lightBg = await actionsBtn.evaluate(el => getComputedStyle(el).backgroundColor)
        expect(lightBg).not.toBe(glowBg)

        // Dismiss menu
        await page.mouse.move(10, 10)
        await expect(menu).not.toBeVisible({ timeout: 3_000 })

        // ── 3. Toggle back to glow-night ──
        await themeToggle.click({ force: true })
        await page.waitForTimeout(500)

        await trigger.hover()
        await page.waitForTimeout(500)
        await expect(menu).toBeVisible({ timeout: 3_000 })
        await expect(menu).toHaveAttribute('data-bdx-theme', 'glow-night')
    })

    test('editor does not overflow the page vertically', async ({ page }) => {
        await page.goto('demo')

        const editor = page.locator('.cm-editor')
        await expect(editor).toBeVisible({ timeout: 10_000 })
        await page.waitForTimeout(500)

        const viewportHeight = page.viewportSize()!.height

        // Check the configurator panel (parent of editor) stays within viewport
        const configurator = page.locator('.cm-editor').locator('..')
        const box = await configurator.boundingBox()
        expect(box).toBeTruthy()

        // The editor's scrollable container should not push the page beyond viewport
        const editorBox = await editor.boundingBox()
        expect(editorBox).toBeTruthy()

        // The editor should have a bounded height with internal scroll, not push page
        // The scroller element should have overflow: auto
        const hasScroll = await page.evaluate(() => {
            const scroller = document.querySelector('.cm-editor .cm-scroller')
            if (!scroller) return false
            const style = getComputedStyle(scroller)
            return style.overflow === 'auto' || style.overflowY === 'auto'
        })
        expect(hasScroll, '.cm-scroller should have overflow: auto for scrolling').toBe(true)

        // The configurator panel should be within the viewport
        const panelBottom = box!.y + box!.height
        expect(
            panelBottom,
            `Configurator panel bottom (${panelBottom}px) should be within viewport (${viewportHeight}px)`
        ).toBeLessThanOrEqual(viewportHeight + 20)
    })
})
