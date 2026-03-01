'use client'

import { useState, useMemo } from 'react'
import yaml from 'js-yaml'
import { cn } from '@/utils/utils'

type Format = 'json' | 'yaml'

interface CodeViewerProps {
    /** The data object to display */
    data: unknown
    /** Additional className for the outer wrapper */
    className?: string
    /** Fixed height — if omitted, stretches via flex-1 */
    height?: number
}

// ── Syntax highlighting ──────────────────────────────────────────────────────

function highlightJSON(json: string): string {
    return json.replace(
        /("(?:\\.|[^"\\])*")\s*:/g,   // keys
        '<span class="cv-key">$1</span>:'
    ).replace(
        /:\s*("(?:\\.|[^"\\])*")/g,    // string values
        ': <span class="cv-str">$1</span>'
    ).replace(
        /:\s*(\d+(\.\d+)?)/g,          // numbers
        ': <span class="cv-num">$1</span>'
    ).replace(
        /:\s*(true|false)/g,           // booleans
        ': <span class="cv-bool">$1</span>'
    ).replace(
        /:\s*(null)/g,                 // null
        ': <span class="cv-null">$1</span>'
    )
}

function highlightYAML(text: string): string {
    return text
        .split('\n')
        .map(line => {
            // Key-value lines
            if (/^\s*[\w-]+:/.test(line)) {
                return line.replace(
                    /^(\s*)([\w-]+)(:)\s*(.*)/,
                    (_, indent, key, colon, val) => {
                        let styledVal = val
                        if (/^".*"$/.test(val) || /^'.*'$/.test(val)) {
                            styledVal = `<span class="cv-str">${val}</span>`
                        } else if (/^\d+(\.\d+)?$/.test(val)) {
                            styledVal = `<span class="cv-num">${val}</span>`
                        } else if (/^(true|false)$/.test(val)) {
                            styledVal = `<span class="cv-bool">${val}</span>`
                        } else if (/^null$/.test(val)) {
                            styledVal = `<span class="cv-null">${val}</span>`
                        } else if (val) {
                            styledVal = `<span class="cv-str">${val}</span>`
                        }
                        return `${indent}<span class="cv-key">${key}</span>${colon} ${styledVal}`
                    }
                )
            }
            // List items with values
            if (/^\s*- /.test(line)) {
                return line.replace(
                    /^(\s*- )(.*)/,
                    (_, dash, val) => {
                        if (/^".*"$/.test(val) || /^'.*'$/.test(val)) {
                            return `${dash}<span class="cv-str">${val}</span>`
                        }
                        return line
                    }
                )
            }
            return line
        })
        .join('\n')
}

// ── Component ────────────────────────────────────────────────────────────────

export function CodeViewer({ data, className, height }: CodeViewerProps) {
    const [format, setFormat] = useState<Format>('json')

    const { text, highlighted } = useMemo(() => {
        if (format === 'yaml') {
            const t = yaml.dump(data, { indent: 2, lineWidth: 120, noRefs: true }).trimEnd()
            return { text: t, highlighted: highlightYAML(t) }
        }
        const t = JSON.stringify(data, null, 2)
        return { text: t, highlighted: highlightJSON(t) }
    }, [data, format])

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
                            onClick={() => setFormat(f)}
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

            {/* Syntax-highlighted code */}
            <div
                className="flex-1 min-h-0 overflow-auto px-3 py-3"
                style={{
                    ...(height ? { height, maxHeight: height } : {}),
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#334155 transparent',
                }}
            >
                <pre
                    className="text-[10px] leading-[1.7] font-mono text-slate-400 m-0 whitespace-pre"
                    dangerouslySetInnerHTML={{ __html: highlighted }}
                />
            </div>

            {/* Syntax highlighting styles */}
            <style>{`
                .cv-key { color: #c4b5fd; }
                .cv-str { color: #6ee7b7; }
                .cv-num { color: #fbbf24; }
                .cv-bool { color: #f472b6; }
                .cv-null { color: #94a3b8; font-style: italic; }
            `}</style>
        </div>
    )
}
