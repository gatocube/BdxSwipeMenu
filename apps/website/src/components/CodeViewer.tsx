'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { json, jsonLanguage, jsonParseLinter } from '@codemirror/lang-json'
import { yaml as yamlLang } from '@codemirror/lang-yaml'
import { linter, lintGutter } from '@codemirror/lint'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import { jsonSchema } from 'codemirror-json-schema'
import jsYaml from 'js-yaml'
import { cn } from '@/utils/utils'
import { colorPickerPlugin, colorPickerTheme } from './editor/colorPickerPlugin'

type Format = 'json' | 'yaml'

interface CodeViewerProps {
    data: unknown
    onChange?: (data: unknown) => void
    schema?: Record<string, unknown>
    className?: string
    height?: number
    readOnly?: boolean
}

const baseTheme = EditorView.theme({
    '&': { fontSize: '11px', background: 'transparent' },
    '.cm-content': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', padding: '8px 0' },
    '.cm-gutters': { background: 'transparent', border: 'none' },
    '.cm-activeLine': { background: 'rgba(255,255,255,0.03)' },
    '.cm-activeLineGutter': { background: 'transparent' },
    '.cm-scroller': { overflow: 'auto' },
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
    const [format, setFormat] = useState<Format>('json')
    const editorRef = useRef<ReactCodeMirrorRef>(null)
    const isExternalUpdate = useRef(false)
    const lastValidData = useRef(data)

    const serialized = useMemo(() => serialize(data, format), [data, format])

    const [value, setValue] = useState(serialized)

    useEffect(() => {
        isExternalUpdate.current = true
        setValue(serialized)
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
        const exts = [baseTheme, oneDark, lintGutter()]
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
    }, [format, schema])

    return (
        <div className={cn('flex flex-col min-h-0', className)}>
            {/* Header with format toggle */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06]">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    {format === 'json' ? 'JSON' : 'YAML'}
                </span>
                <div className="flex gap-0.5 bg-white/[0.04] rounded-md p-0.5">
                    {(['json', 'yaml'] as Format[]).map(f => (
                        <button
                            key={f}
                            onClick={() => switchFormat(f)}
                            className={cn(
                                'text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-all duration-150',
                                format === f
                                    ? 'text-white bg-violet-500/25 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-300'
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* CodeMirror editor */}
            <div
                className="flex-1 min-h-0"
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
                    theme="dark"
                    height={height ? `${height}px` : '100%'}
                    style={{ height: '100%', overflow: 'auto' }}
                />
            </div>
        </div>
    )
}
