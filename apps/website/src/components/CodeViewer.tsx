'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { json, jsonLanguage, jsonParseLinter } from '@codemirror/lang-json'
import { yaml as yamlLang } from '@codemirror/lang-yaml'
import { linter, lintGutter } from '@codemirror/lint'
import { EditorView } from '@codemirror/view'
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night'
import { jsonSchema } from 'codemirror-json-schema'
import jsYaml from 'js-yaml'
import { cn } from '@/utils/utils'
import { colorPickerPlugin, colorPickerTheme } from './editor/colorPickerPlugin'
import { useTheme } from './ThemeContext'

type Format = 'json' | 'yaml'

interface CodeViewerProps {
    data: unknown
    onChange?: (data: unknown) => void
    schema?: Record<string, unknown>
    className?: string
    height?: number
    readOnly?: boolean
}

const sharedTheme = EditorView.theme({
    '&': { fontSize: '11px', height: '100%' },
    '.cm-content': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', padding: '8px 0' },
    '.cm-gutters': { background: 'transparent', border: 'none' },
    '.cm-activeLineGutter': { background: 'transparent' },
    '.cm-scroller': { overflow: 'auto' },
    '.cm-editor': { height: '100%' },
})

const darkOverrides = EditorView.theme({
    '&': { background: 'transparent' },
    '.cm-gutters': { background: 'transparent' },
})

const lightBaseTheme = EditorView.theme({
    '&': { background: 'transparent' },
    '.cm-activeLine': { background: 'rgba(0,0,0,0.04)' },
    '.cm-cursor': { borderLeftColor: '#334155' },
    '.cm-selectionBackground': { background: 'rgba(99,102,241,0.15) !important' },
})

function yamlLinter() {
    return linter((view) => {
        const doc = view.state.doc.toString()
        if (!doc.trim()) return []
        try {
            jsYaml.load(doc)
            return []
        } catch (e: unknown) {
            const err = e as { mark?: { position?: number }; message?: string }
            const pos = err.mark?.position ?? 0
            return [{
                from: Math.min(pos, doc.length),
                to: Math.min(pos + 1, doc.length),
                severity: 'error' as const,
                message: err.message ?? 'Invalid YAML',
            }]
        }
    })
}

function serialize(data: unknown, format: Format): string {
    if (format === 'yaml') {
        return jsYaml.dump(data, { indent: 2, lineWidth: 120, noRefs: true }).trimEnd()
    }
    return JSON.stringify(data, null, 2)
}

function parse(text: string, format: Format): unknown {
    if (format === 'yaml') return jsYaml.load(text)
    return JSON.parse(text)
}

export function CodeViewer({ data, onChange, schema, className, height, readOnly }: CodeViewerProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [format, setFormat] = useState<Format>('json')
    const editorRef = useRef<ReactCodeMirrorRef>(null)
    const isExternalUpdate = useRef(false)
    const lastValidData = useRef(data)

    const serialized = useMemo(() => serialize(data, format), [data, format])

    const [value, setValue] = useState(serialized)

    useEffect(() => {
        setValue(prev => {
            if (prev === serialized) {
                return prev
            }
            isExternalUpdate.current = true
            return serialized
        })
    }, [serialized])

    const handleChange = useCallback((val: string) => {
        if (isExternalUpdate.current) {
            isExternalUpdate.current = false
            return
        }
        setValue(val)
        if (!onChange) return
        try {
            const parsed = parse(val, format)
            if (parsed !== null && parsed !== undefined) {
                lastValidData.current = parsed
                onChange(parsed)
            }
        } catch {
            // invalid — lint markers show the error; don't propagate
        }
    }, [onChange, format])

    const switchFormat = useCallback((f: Format) => {
        const newText = serialize(lastValidData.current, f)
        setFormat(f)
        isExternalUpdate.current = true
        setValue(newText)
    }, [])

    const extensions = useMemo(() => {
        const exts: import('@codemirror/state').Extension[] = [sharedTheme, lintGutter()]
        if (isLight) {
            exts.push(lightBaseTheme)
        } else {
            exts.push(tokyoNight, darkOverrides)
        }
        if (format === 'json') {
            exts.push(json())
            exts.push(linter(jsonParseLinter()))
            exts.push(colorPickerPlugin, colorPickerTheme)
            if (schema) {
                exts.push(jsonSchema(schema as Parameters<typeof jsonSchema>[0]))
            }
        } else {
            exts.push(yamlLang())
            exts.push(yamlLinter())
        }
        return exts
    }, [format, schema, isLight])

    return (
        <div className={cn('flex flex-col min-h-0', className)}>
            {/* Header with format toggle */}
            <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: '1px solid var(--bdx-border)' }}>
                <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--bdx-text-faint)' }}>
                    {format === 'json' ? 'JSON' : 'YAML'}
                </span>
                <div className="flex gap-0.5 rounded-md p-0.5" style={{ background: 'var(--bdx-input-bg)' }}>
                    {(['json', 'yaml'] as Format[]).map(f => (
                        <button
                            key={f}
                            onClick={() => switchFormat(f)}
                            className={cn(
                                'text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-all duration-150',
                                format === f ? 'bg-violet-500/25 shadow-sm' : ''
                            )}
                            style={{ color: format === f ? 'var(--bdx-text)' : 'var(--bdx-text-faint)' }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* CodeMirror editor */}
            <div
                className="flex-1 min-h-0 overflow-hidden"
                style={height ? { height, maxHeight: height } : undefined}
            >
                <CodeMirror
                    ref={editorRef}
                    value={value}
                    onChange={handleChange}
                    extensions={extensions}
                    readOnly={readOnly}
                    editable={!readOnly}
                    basicSetup={{
                        lineNumbers: false,
                        foldGutter: true,
                        highlightActiveLine: true,
                        bracketMatching: true,
                        closeBrackets: true,
                        autocompletion: true,
                        indentOnInput: true,
                    }}
                    theme={isLight ? 'light' : 'dark'}
                    height="100%"
                    style={{ height: '100%' }}
                />
            </div>
        </div>
    )
}
