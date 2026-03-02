/**
 * CodeMirror 6 ViewPlugin that detects hex color strings in JSON
 * and injects inline <input type="color"> widget decorations.
 *
 * The @uiw/codemirror-extensions-color package only works for CSS
 * syntax nodes (ColorLiteral, CallExpression) — not JSON String tokens.
 */

import { ViewPlugin, EditorView, ViewUpdate, WidgetType, Decoration, type DecorationSet } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'
import type { Range } from '@codemirror/state'

const HEX_RE = /^"(#[0-9a-fA-F]{3,8})"$/

class ColorSwatchWidget extends WidgetType {
    constructor(
        private readonly color: string,
        private readonly from: number,
        private readonly to: number,
    ) {
        super()
    }

    eq(other: ColorSwatchWidget) {
        return this.color === other.color && this.from === other.from && this.to === other.to
    }

    toDOM(view: EditorView) {
        const wrapper = document.createElement('span')
        wrapper.className = 'cm-color-swatch'
        wrapper.style.backgroundColor = this.color

        const input = document.createElement('input')
        input.type = 'color'
        input.value = this.color.length === 4
            ? `#${this.color[1]}${this.color[1]}${this.color[2]}${this.color[2]}${this.color[3]}${this.color[3]}`
            : this.color.slice(0, 7)

        const readOnly = view.state.readOnly
        if (readOnly) input.disabled = true

        input.addEventListener('change', () => {
            const newHex = input.value
            view.dispatch({
                changes: { from: this.from, to: this.to, insert: `"${newHex}"` },
            })
        })

        wrapper.appendChild(input)
        return wrapper
    }

    ignoreEvent() { return false }
}

function buildDecorations(view: EditorView): DecorationSet {
    const widgets: Range<Decoration>[] = []

    for (const range of view.visibleRanges) {
        syntaxTree(view.state).iterate({
            from: range.from,
            to: range.to,
            enter: ({ type, from, to }) => {
                if (type.name !== 'String') return
                const text = view.state.doc.sliceString(from, to)
                const match = HEX_RE.exec(text)
                if (!match) return

                const widget = Decoration.widget({
                    widget: new ColorSwatchWidget(match[1], from, to),
                    side: -1,
                })
                widgets.push(widget.range(from))
            },
        })
    }

    return Decoration.set(widgets)
}

export const colorPickerPlugin = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet
        constructor(view: EditorView) {
            this.decorations = buildDecorations(view)
        }
        update(update: ViewUpdate) {
            if (update.docChanged || update.viewportChanged) {
                this.decorations = buildDecorations(update.view)
            }
        }
    },
    { decorations: (v) => v.decorations },
)

export const colorPickerTheme = EditorView.baseTheme({
    '.cm-color-swatch': {
        display: 'inline-block',
        width: '12px',
        height: '12px',
        borderRadius: '2px',
        marginRight: '4px',
        verticalAlign: 'middle',
        marginTop: '-2px',
        outline: '1px solid var(--bdx-border-strong)',
        overflow: 'hidden',
        cursor: 'pointer',
    },
    '.cm-color-swatch input[type="color"]': {
        display: 'block',
        background: 'transparent',
        border: 'none',
        outline: '0',
        width: '24px',
        height: '12px',
        padding: '0',
        cursor: 'pointer',
    },
    '.cm-color-swatch input[type="color"]::-webkit-color-swatch-wrapper': {
        padding: '0',
    },
    '.cm-color-swatch input[type="color"]::-webkit-color-swatch': {
        border: 'none',
    },
})
