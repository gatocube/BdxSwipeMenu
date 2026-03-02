'use client'

/**
 * Demo2 — Multi-node showcase with three mock nodes.
 */

import { useState, useCallback, useMemo } from 'react'
import { BdxSwipeMenu, type BdxSwipeMenuActivation, type BdxSwipeMenuState } from '@bdx/swipe-menu'
import { renderMenuIcon } from '@/swipeMenu/ui'
import { useTheme } from '../components/ThemeContext'
import { DEFAULT_PRESET } from '../presets'
import { PageLayout } from '../components/PageLayout'
import { ModeSelector } from '../components/ModeSelector'
import { EventLog } from '../components/EventLog'
import { DemoNode } from '../components/DemoNode'
import { useNodeSelection } from '../hooks/useNodeSelection'

export function Demo2Page() {
    const { theme } = useTheme()
    const [mode, setMode] = useState<BdxSwipeMenuActivation>('click')
    const [centerLabel, setCenterLabel] = useState('Planner')
    const [log, setLog] = useState<string[]>([])

    const { selectedId, select, hover, hold, touchSelect, dismiss } = useNodeSelection(mode)

    const addLog = useCallback((msg: string) => {
        setLog(prev => [...prev.slice(-16), msg])
    }, [])

    const menuState = useMemo((): BdxSwipeMenuState => ({
        ...DEFAULT_PRESET,
        activation: mode,
        noOverlap: selectedId === 'left-node' || selectedId === 'right-node',
        nodes: selectedId === 'left-node'
            ? DEFAULT_PRESET.nodes.filter(n => {
                if (n.key === 'before') return false
                if (n.parentId?.startsWith('before')) return false
                return true
            }).map(n =>
                n.key === 'after' ? { ...n, direction: 'right' as const }
                    : n.key === 'config' ? { ...n, direction: 'bottom' as const }
                        : n
            )
            : DEFAULT_PRESET.nodes,
    }), [mode, selectedId])

    const currentLabel = selectedId === 'center-node' ? centerLabel
        : selectedId === 'left-node' ? 'Start'
            : selectedId === 'right-node' ? 'Deploy' : ''

    const handleAction = useCallback((id: string, action: string) => {
        addLog(`⚡ ${action} (${id})`)
        dismiss()
    }, [addLog, dismiss])

    const handleRename = useCallback((id: string, newName: string) => {
        addLog(`✏ Rename: ${id} → ${newName}`)
        if (selectedId === 'center-node') setCenterLabel(newName)
    }, [addLog, selectedId])

    return (
        <PageLayout className="relative overflow-hidden">

            <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-[60]">
                <ModeSelector mode={mode} onChange={setMode} />
            </div>

            <div className="absolute bottom-4 left-4 z-10">
                <div className="text-sm font-extrabold text-violet-500 font-mono">Multi-node Demo</div>
                <div className="text-[8px] mt-0.5" style={{ color: 'var(--bdx-text-faint)' }}>Three nodes · edge positioning · direction constraints</div>
            </div>

            <EventLog log={log} className="absolute bottom-4 right-4 w-[220px] max-h-[140px] overflow-auto" />

            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `radial-gradient(circle, var(--bdx-dot-pattern) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Top-left node (compact) */}
            <DemoNode
                id="left-node" label="Start" color="#22c55e" icon="▶"
                selected={selectedId === 'left-node'}
                onSelect={() => select('left-node')}
                onHover={() => hover('left-node')}
                onHold={() => hold('left-node')}
                onTouchSelect={() => touchSelect('left-node')}
                className="top-8 left-8 !w-12 !h-12 !px-1.5 justify-center"
            />

            {/* Center node */}
            <DemoNode
                id="center-node" label={centerLabel} color="#8b5cf6" icon="🤖"
                selected={selectedId === 'center-node'}
                onSelect={() => select('center-node')}
                onHover={() => hover('center-node')}
                onHold={() => hold('center-node')}
                onTouchSelect={() => touchSelect('center-node')}
                className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />

            {/* Right-edge node */}
            <DemoNode
                id="right-node" label="Deploy" color="#f59e0b" icon="🚀"
                selected={selectedId === 'right-node'}
                onSelect={() => select('right-node')}
                onHover={() => hover('right-node')}
                onHold={() => hold('right-node')}
                onTouchSelect={() => touchSelect('right-node')}
                className="top-1/2 right-8 -translate-y-1/2"
            />

            {selectedId && (
                <BdxSwipeMenu
                    state={menuState}
                    nodeId={selectedId}
                    currentLabel={currentLabel}
                    onAction={handleAction}
                    onRename={handleRename}
                    onDismiss={dismiss}
                    renderIcon={renderMenuIcon}
                    theme={theme}
                />
            )}
        </PageLayout>
    )
}
