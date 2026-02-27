/**
 * BdxSwipeMenu — radial action menu optimised for touchscreen devices.
 *
 * This component provides a convenient method to use menus on touchscreen
 * devices like iPad. It is ideal for frequently used actions, because it
 * trains the user to rely on the same gestures/movements for the same
 * actions — building muscle memory over time.
 *
 * Activation modes:
 *   click  — menu appears on tap / click (default)
 *   hold   — menu appears after a long-press (~500 ms) with a progress ring
 *   swipe  — menu appears instantly on hover / pointer-enter
 *
 * Layout (default wibeboard configuration):
 *   Top:    Configure (orange) → fan: Attach | Settings | Delete
 *   Right:  After (+) purple  → fan: SubFlow | Job → Script | AI | Recent
 *   Left:   Before (+) purple → fan: SubFlow | Job → Script | AI | Recent
 *
 * Designed to be reusable across projects.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Settings, Cpu, Code, UserCircle, Trash2, FileCode, Terminal, FileType, Brain, Wrench, Search, Paperclip, Clock, StickyNote, Briefcase, ClipboardCheck, Workflow, Pencil, MessageSquareText, GitPullRequest, AlertTriangle, BadgeCheck, Link } from 'lucide-react'

// ── Types ───────────────────────────────────────────────────────────────────────

interface SubButton {
    key: string
    label: string
    icon: typeof Plus
    color: string
}

// Top-level sub-buttons for Add (Before / After)
const ADD_NODE_TYPES: SubButton[] = [
    { key: 'subflow', label: 'SubFlow', icon: Workflow, color: '#6366f1' },
    { key: 'job', label: 'Job', icon: Briefcase, color: '#8b5cf6' },
    { key: 'recent', label: 'Recent', icon: Clock, color: '#64748b' },
]

// Job sub-types (children of Job)
const JOB_TYPES: SubButton[] = [
    { key: 'user', label: 'User', icon: UserCircle, color: '#f59e0b' },
    { key: 'script', label: 'Script', icon: Code, color: '#89e051' },
    { key: 'ai', label: 'AI', icon: Cpu, color: '#8b5cf6' },
]

const AI_ROLES: SubButton[] = [
    { key: 'planner', label: 'Planner', icon: Brain, color: '#a78bfa' },
    { key: 'worker', label: 'Worker', icon: Wrench, color: '#8b5cf6' },
    { key: 'reviewer', label: 'Reviewer', icon: Search, color: '#c084fc' },
]

const CONFIG_ACTIONS: SubButton[] = [
    { key: 'attach', label: 'Attach', icon: Paperclip, color: '#06b6d4' },
    { key: 'rename', label: 'Rename', icon: Pencil, color: '#f59e0b' },
    { key: 'settings', label: 'Settings', icon: Settings, color: '#fb7185' },
    { key: 'delete', label: 'Delete', icon: Trash2, color: '#ef4444' },
]

const CONFIG_ACTIONS_LONG: SubButton[] = [
    { key: 'attach', label: 'Attach', icon: Paperclip, color: '#06b6d4' },
    { key: 'review', label: 'Review', icon: GitPullRequest, color: '#a78bfa' },
    { key: 'rename', label: 'Rename', icon: Pencil, color: '#f59e0b' },
    { key: 'settings', label: 'Settings', icon: Settings, color: '#fb7185' },
    { key: 'delete', label: 'Delete', icon: Trash2, color: '#ef4444' },
]

const REVIEW_FLOW_STEPS: SubButton[] = [
    { key: 'respond', label: 'Respond', icon: MessageSquareText, color: '#a78bfa' },
    { key: 'request-changes', label: 'Request changes', icon: GitPullRequest, color: '#c084fc' },
    { key: 'blockers', label: 'Blockers', icon: AlertTriangle, color: '#f59e0b' },
    { key: 'tests-failed', label: 'Tests failed', icon: AlertTriangle, color: '#fb7185' },
    { key: 'proof-link', label: 'Proof link', icon: Link, color: '#22d3ee' },
    { key: 'approved', label: 'Approved', icon: BadgeCheck, color: '#22c55e' },
]

const ATTACH_TYPES: SubButton[] = [
    { key: 'expectation', label: 'Expect', icon: ClipboardCheck, color: '#22d3ee' },
    { key: 'note', label: 'Note', icon: StickyNote, color: '#fbbf24' },
]

const SCRIPT_TYPES: SubButton[] = [
    { key: 'js', label: 'JS', icon: FileCode, color: '#f7df1e' },
    { key: 'sh', label: 'SH', icon: Terminal, color: '#4ade80' },
    { key: 'py', label: 'PY', icon: FileType, color: '#3b82f6' },
]

// Virtual tile grid — all button positions snap to multiples of TILE
const TILE = 64

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n))
}

// ── Props ───────────────────────────────────────────────────────────────────────

export type BdxSwipeMenuActivation = 'click' | 'hold' | 'swipe'
export type BdxSwipeMenuDirection = 'top' | 'right' | 'bottom' | 'left' | 'bottom-right'

export interface BdxSwipeMenuProps {
    nodeId: string
    currentLabel: string
    /** Activation mode: click (default), hold (long-press), swipe (hover) */
    activationMode?: BdxSwipeMenuActivation
    /** Which directions to show buttons (default: all 4 cardinal) */
    directions?: BdxSwipeMenuDirection[]
    /** When true, buttons are pushed out so they never overlap the node */
    noOverlap?: boolean
    /**
     * When true (default), draws a connector line for the current active chain,
     * so users can always see the “path” they are in.
     */
    showActiveChainLinkLine?: boolean
    /** Demo preset. Library default is 'default'. */
    preset?: 'default' | 'long'
    onAddBefore: (nodeId: string, widgetType: string) => void
    onAddAfter: (nodeId: string, widgetType: string) => void
    onConfigure: (nodeId: string, action: string) => void
    onRename: (nodeId: string, newName: string) => void
    onDismiss: () => void
}

// ── Shared button style ─────────────────────────────────────────────────────────

function btnStyle(color: string, size = 56, dimmed = false): React.CSSProperties {
    return {
        width: size, height: size,
        borderRadius: size <= 44 ? 12 : 16,
        border: `1.5px solid ${dimmed ? 'rgba(148,163,184,0.25)' : `${color}44`}`,
        background: dimmed ? 'rgba(15,15,26,0.75)' : 'rgba(15,15,26,0.92)',
        backdropFilter: 'blur(12px)',
        color: dimmed ? '#94a3b8' : color,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 2,
        fontFamily: 'Inter',
        padding: 0,
        boxShadow: `0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px ${color}11`,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
    }
}

// CSS keyframe for hold progress ring (injected once)
let holdKeyframeInjected = false
function ensureHoldKeyframe() {
    if (holdKeyframeInjected) return
    holdKeyframeInjected = true
    const style = document.createElement('style')
    style.textContent = `@keyframes swipe-btn-hold-fill { from { stroke-dashoffset: var(--circ); } to { stroke-dashoffset: 0; } }`
    document.head.appendChild(style)
}

// ── Hooks ───────────────────────────────────────────────────────────────────────

/**
 * Touch-drag tracking for swipe mode.
 * On iPad, pointerEnter doesn't fire during a touch drag. Instead, we
 * track touchmove → elementFromPoint to detect which button the finger
 * is hovering, then call onSwipeHit(testId) to expand sub-menus.
 */
function useTouchSwipe(
    activationMode: BdxSwipeMenuActivation,
    onSwipeHit: (testId: string | null) => void,
) {
    const lastHitRef = useRef<string | null>(null)
    const activePointerRef = useRef<number | null>(null)
    const lastHighlightRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        if (activationMode !== 'swipe') return

        function hitTest(x: number, y: number) {
            const el = document.elementFromPoint(x, y) as HTMLElement | null
            if (!el) return
            const btn = el.closest('[data-testid]') as HTMLElement | null
            const testId = btn?.getAttribute('data-testid') || null

            if (testId !== lastHitRef.current) {
                if (lastHighlightRef.current) {
                    const prev = lastHighlightRef.current
                    prev.style.borderColor = ''
                    prev.style.boxShadow = ''
                    lastHighlightRef.current = null
                }
                lastHitRef.current = testId
                if (btn && testId) {
                    btn.style.borderColor = 'rgba(255,255,255,0.3)'
                    btn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5), 0 0 12px rgba(255,255,255,0.1)'
                    lastHighlightRef.current = btn
                }
                onSwipeHit(testId)
            }
        }

        function hitClick(x: number, y: number) {
            const el = document.elementFromPoint(x, y) as HTMLElement | null
            const btn = el?.closest('[data-testid]') as HTMLElement | null
            if (btn) btn.click()
            lastHitRef.current = null
            if (lastHighlightRef.current) {
                lastHighlightRef.current.style.borderColor = ''
                lastHighlightRef.current.style.boxShadow = ''
                lastHighlightRef.current = null
            }
        }

        const handleTouchStart = (e: TouchEvent) => {
            e.preventDefault()
        }

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault()
            const touch = e.touches[0]
            if (touch) hitTest(touch.clientX, touch.clientY)
        }

        const handleTouchEnd = (e: TouchEvent) => {
            const touch = e.changedTouches[0]
            if (touch) hitClick(touch.clientX, touch.clientY)
        }

        const handlePointerDown = (e: PointerEvent) => {
            if (e.pointerType === 'touch') {
                activePointerRef.current = e.pointerId
                e.preventDefault()
            }
        }

        const handlePointerMove = (e: PointerEvent) => {
            if (e.pointerType === 'touch' && activePointerRef.current === e.pointerId) {
                e.preventDefault()
                hitTest(e.clientX, e.clientY)
            }
        }

        const handlePointerUp = (e: PointerEvent) => {
            if (e.pointerType === 'touch' && activePointerRef.current === e.pointerId) {
                hitClick(e.clientX, e.clientY)
                activePointerRef.current = null
            }
        }

        document.addEventListener('touchstart', handleTouchStart, { passive: false })
        document.addEventListener('touchmove', handleTouchMove, { passive: false })
        document.addEventListener('touchend', handleTouchEnd, { passive: false })
        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('pointermove', handlePointerMove)
        document.addEventListener('pointerup', handlePointerUp)

        return () => {
            document.removeEventListener('touchstart', handleTouchStart)
            document.removeEventListener('touchmove', handleTouchMove)
            document.removeEventListener('touchend', handleTouchEnd)
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('pointermove', handlePointerMove)
            document.removeEventListener('pointerup', handlePointerUp)
        }
    }, [activationMode, onSwipeHit])
}

// ── Component ───────────────────────────────────────────────────────────────────

export function BdxSwipeMenu(props: BdxSwipeMenuProps) {
    const {
        nodeId, currentLabel, activationMode = 'click',
        directions, noOverlap = false,
        showActiveChainLinkLine = true,
        preset = 'default',
        onAddBefore, onAddAfter, onConfigure, onRename,
        onDismiss,
    } = props
    const dirs = directions ?? ['top', 'right', 'bottom', 'left']
    const [expanded, setExpanded] = useState<null | 'before' | 'after' | 'config'>(null)
    const [jobExpanded, setJobExpanded] = useState<null | 'after' | 'before'>(null)
    const [scriptExpanded, setScriptExpanded] = useState<null | 'after' | 'before'>(null)
    const [aiExpanded, setAiExpanded] = useState<null | 'after' | 'before'>(null)
    const [attachExpanded, setAttachExpanded] = useState(false)
    const [reviewStep, setReviewStep] = useState<number>(-1)
    const [renaming, setRenaming] = useState(false)
    const [renameValue, setRenameValue] = useState(currentLabel)
    const inputRef = useRef<HTMLInputElement>(null)
    const [nodeRect, setNodeRect] = useState<DOMRect | null>(null)
    const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight })

    const resetSubs = useCallback(() => {
        setJobExpanded(null); setScriptExpanded(null); setAiExpanded(null); setAttachExpanded(false); setReviewStep(-1)
    }, [])

    const handleSwipeHit = useCallback((testId: string | null) => {
        if (!testId) return

        if (testId === 'swipe-btn-add-after') {
            setExpanded('after'); resetSubs()
        } else if (testId === 'swipe-btn-add-before') {
            setExpanded('before'); resetSubs()
        } else if (testId === 'swipe-btn-configure') {
            setExpanded('config'); setReviewStep(-1)
        }

        else if (testId === 'ext-after-job') {
            setJobExpanded('after'); setScriptExpanded(null); setAiExpanded(null)
        } else if (testId.startsWith('ext-after-script-')) {
            setScriptExpanded('after')
        } else if (testId.startsWith('ext-after-ai-')) {
            setAiExpanded('after')
        }

        else if (testId === 'ext-before-job') {
            setJobExpanded('before'); setScriptExpanded(null); setAiExpanded(null)
        } else if (testId.startsWith('ext-before-script-')) {
            setScriptExpanded('before')
        } else if (testId.startsWith('ext-before-ai-')) {
            setAiExpanded('before')
        }

        else if (testId === 'ext-cfg-attach') {
            setAttachExpanded(true)
        }
        else if (testId === 'ext-cfg-review') {
            setReviewStep(REVIEW_FLOW_STEPS.length - 1)
        }
        else if (testId.startsWith('ext-cfg-review-')) {
            const stepKey = testId.replace('ext-cfg-review-', '')
            const idx = REVIEW_FLOW_STEPS.findIndex(s => s.key === stepKey)
            if (idx >= 0) setReviewStep(Math.min(idx + 1, REVIEW_FLOW_STEPS.length - 1))
        }
    }, [resetSubs])

    useTouchSwipe(activationMode, handleSwipeHit)

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return
            if (renaming) setRenaming(false)
            else onDismiss()
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [onDismiss, renaming])

    useEffect(() => {
        const update = () => {
            const el = document.querySelector(`[data-id="${nodeId}"]`) as HTMLElement | null
            if (el) setNodeRect(el.getBoundingClientRect())
        }
        update()
        const interval = setInterval(update, 50)
        return () => clearInterval(interval)
    }, [nodeId])

    useEffect(() => {
        const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    useEffect(() => {
        if (renaming) {
            setRenameValue(currentLabel)
            setTimeout(() => inputRef.current?.select(), 50)
        }
    }, [renaming, currentLabel])

    const handleRenameConfirm = useCallback(() => {
        const trimmed = renameValue.trim()
        if (trimmed && trimmed !== currentLabel) onRename(nodeId, trimmed)
        setRenaming(false)
    }, [renameValue, currentLabel, nodeId, onRename])

    const handleRenameKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); handleRenameConfirm() }
        else if (e.key === 'Escape') { e.preventDefault(); setRenaming(false) }
    }, [handleRenameConfirm])

    const BTN_SIZE = 56
    const positions = useMemo(() => {
        if (!nodeRect) return null
        const cx = nodeRect.left + nodeRect.width / 2
        const cy = nodeRect.top + nodeRect.height / 2
        const gapX = noOverlap
            ? nodeRect.width / 2 + BTN_SIZE / 2 + 4
            : nodeRect.width / 2 + 16
        const gapY = noOverlap
            ? nodeRect.height / 2 + BTN_SIZE / 2 + 4
            : nodeRect.height / 2 + 16

        return {
            top: { x: cx, y: cy - gapY },
            right: { x: cx + gapX, y: cy },
            bottom: { x: cx, y: cy + gapY },
            left: { x: cx - gapX, y: cy },
            'bottom-right': { x: cx + gapX * 0.85, y: cy + gapY * 0.85 },
        }
    }, [nodeRect, noOverlap])

    const show = (d: BdxSwipeMenuDirection) => dirs.includes(d)

    const cfgActions = preset === 'long' ? CONFIG_ACTIONS_LONG : CONFIG_ACTIONS
    const cfgOffset = Math.floor(cfgActions.length / 2)
    const reviewIndex = useMemo(() => cfgActions.findIndex(a => a.key === 'review'), [cfgActions])

    const activeChainIds = useMemo(() => {
        if (!expanded) return []
        if (expanded === 'after') {
            const ids = ['swipe-btn-add-after']
            if (jobExpanded === 'after') {
                ids.push('ext-after-job')
                if (scriptExpanded === 'after') ids.push('ext-after-job-script')
                if (aiExpanded === 'after') ids.push('ext-after-job-ai')
            }
            return ids
        }
        if (expanded === 'before') {
            const ids = ['swipe-btn-add-before']
            if (jobExpanded === 'before') {
                ids.push('ext-before-job')
                if (scriptExpanded === 'before') ids.push('ext-before-job-script')
                if (aiExpanded === 'before') ids.push('ext-before-job-ai')
            }
            return ids
        }
        // config
        const ids = ['swipe-btn-configure']
        if (attachExpanded) ids.push('ext-cfg-attach')
        if (preset === 'long' && reviewStep >= 0) {
            ids.push('ext-cfg-review')
            for (let i = 0; i <= Math.min(reviewStep, REVIEW_FLOW_STEPS.length - 1); i++) {
                ids.push(`ext-cfg-review-${REVIEW_FLOW_STEPS[i].key}`)
            }
        }
        return ids
    }, [expanded, jobExpanded, scriptExpanded, aiExpanded, attachExpanded, preset, reviewStep])

    const shouldDim = useCallback((testId: string) => {
        if (!expanded) return false

        // dim top-level siblings
        if (testId === 'swipe-btn-configure') return expanded !== 'config'
        if (testId === 'swipe-btn-add-after') return expanded !== 'after'
        if (testId === 'swipe-btn-add-before') return expanded !== 'before'

        // after branch
        if (expanded === 'after') {
            if (testId.startsWith('ext-after-')) {
                if (!jobExpanded) return false
                // first-level: keep job, dim siblings
                if (testId === 'ext-after-subflow' || testId === 'ext-after-recent') return true
                if (testId === 'ext-after-job') return false
            }
            if (testId.startsWith('ext-after-job-')) {
                if (!jobExpanded) return false
                if (!scriptExpanded && !aiExpanded) return false
                // keep selected category, dim siblings
                if (scriptExpanded === 'after') return testId !== 'ext-after-job-script'
                if (aiExpanded === 'after') return testId !== 'ext-after-job-ai'
            }
            return false
        }

        // before branch
        if (expanded === 'before') {
            if (testId.startsWith('ext-before-')) {
                if (!jobExpanded) return false
                if (testId === 'ext-before-subflow' || testId === 'ext-before-recent') return true
                if (testId === 'ext-before-job') return false
            }
            if (testId.startsWith('ext-before-job-')) {
                if (!jobExpanded) return false
                if (!scriptExpanded && !aiExpanded) return false
                if (scriptExpanded === 'before') return testId !== 'ext-before-job-script'
                if (aiExpanded === 'before') return testId !== 'ext-before-job-ai'
            }
            return false
        }

        // config branch
        if (expanded === 'config') {
            if (testId.startsWith('ext-cfg-')) {
                if (attachExpanded) {
                    if (testId === 'ext-cfg-attach') return false
                    if (testId.startsWith('ext-cfg-attach-')) return false
                    return true
                }
                if (preset === 'long' && reviewStep >= 0) {
                    if (testId === 'ext-cfg-review') return false
                    if (testId.startsWith('ext-cfg-review-')) return false
                    return true
                }
                return false
            }
            return false
        }

        return false
    }, [expanded, jobExpanded, scriptExpanded, aiExpanded, attachExpanded, preset, reviewStep])

    const linkLineColor = expanded === 'config' ? 'rgba(245,158,11,0.8)'
        : expanded === 'after' || expanded === 'before' ? 'rgba(139,92,246,0.85)'
            : 'rgba(148,163,184,0.7)'

    const stopEvents = {
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
        onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
    }

    const visibleButtons = useMemo(() => {
        type Btn = {
            key: string
            testId: string
            pos: { x: number; y: number }
            icon: typeof Plus
            label: string
            color: string
            delay?: number
            active?: boolean
            onClick: () => void
            onHover?: () => void
        }

        const out: Btn[] = []
        const add = (b: Btn) => out.push(b)

        if (!positions) return out

        if (show('top')) {
            add({
                key: 'config',
                testId: 'swipe-btn-configure',
                pos: positions.top,
                icon: Settings,
                label: 'Config',
                color: '#f59e0b',
                delay: 0,
                active: expanded === 'config',
                onClick: () => setExpanded(prev => prev === 'config' ? null : 'config'),
                onHover: () => { setExpanded('config'); setReviewStep(-1) },
            })
        }

        if (show('right')) {
            add({
                key: 'after',
                testId: 'swipe-btn-add-after',
                pos: positions.right,
                icon: Plus,
                label: 'After',
                color: '#8b5cf6',
                delay: 0.04,
                active: expanded === 'after',
                onClick: () => { setExpanded(prev => prev === 'after' ? null : 'after'); resetSubs() },
                onHover: () => { setExpanded('after'); resetSubs() },
            })
        }

        if (show('left')) {
            add({
                key: 'before',
                testId: 'swipe-btn-add-before',
                pos: positions.left,
                icon: Plus,
                label: 'Before',
                color: '#8b5cf6',
                delay: 0.12,
                active: expanded === 'before',
                onClick: () => { setExpanded(prev => prev === 'before' ? null : 'before'); resetSubs() },
                onHover: () => { setExpanded('before'); resetSubs() },
            })
        }

        if (show('top') && expanded === 'config') {
            cfgActions.forEach((sub, i) => {
                const btnPos = { x: positions.top.x + (i - cfgOffset) * TILE, y: positions.top.y - TILE }
                add({
                    key: `cfg-${sub.key}`,
                    testId: `ext-cfg-${sub.key}`,
                    pos: btnPos,
                    icon: sub.icon,
                    label: sub.label,
                    color: sub.color,
                    delay: i * 0.03,
                    active: (sub.key === 'attach' && attachExpanded) || (sub.key === 'review' && reviewStep >= 0),
                    onClick: () => {
                        if (sub.key === 'attach') {
                            setAttachExpanded(prev => !prev); setReviewStep(-1)
                        } else if (sub.key === 'review') {
                            setReviewStep(prev => prev >= 0 ? -1 : (REVIEW_FLOW_STEPS.length - 1)); setAttachExpanded(false)
                        } else if (sub.key === 'rename') {
                            setRenaming(true); setAttachExpanded(false); setReviewStep(-1)
                        } else {
                            onConfigure(nodeId, sub.key)
                            setExpanded(null); resetSubs()
                        }
                    },
                    onHover: () => {
                        if (sub.key === 'attach') { setAttachExpanded(true); setReviewStep(-1) }
                        else if (sub.key === 'review') { if (preset === 'long') { setReviewStep(REVIEW_FLOW_STEPS.length - 1); setAttachExpanded(false) } }
                        else { setAttachExpanded(false); setReviewStep(-1) }
                    },
                })
            })
        }

        if (show('top') && expanded === 'config' && attachExpanded) {
            const attachBtnX = positions.top.x + (cfgActions.findIndex(a => a.key === 'attach') - cfgOffset) * TILE
            const attachBtnY = positions.top.y - TILE
            ATTACH_TYPES.forEach((at, i) => {
                add({
                    key: `cfg-attach-${at.key}`,
                    testId: `ext-cfg-attach-${at.key}`,
                    pos: { x: attachBtnX + (i === 0 ? -TILE : TILE), y: attachBtnY - TILE },
                    icon: at.icon,
                    label: at.label,
                    color: at.color,
                    delay: i * 0.03,
                    onClick: () => { onConfigure(nodeId, `attach:${at.key}`); setExpanded(null); resetSubs() },
                })
            })
        }

        if (show('top') && expanded === 'config' && preset === 'long' && reviewIndex >= 0 && reviewStep >= 0) {
            const reviewBtnX = positions.top.x + (reviewIndex - cfgOffset) * TILE
            const reviewBtnY = positions.top.y - TILE
            for (let i = 0; i <= Math.min(reviewStep, REVIEW_FLOW_STEPS.length - 1); i++) {
                const step = REVIEW_FLOW_STEPS[i]
                add({
                    key: `cfg-review-${step.key}`,
                    testId: `ext-cfg-review-${step.key}`,
                    pos: { x: reviewBtnX + (i + 1) * TILE, y: reviewBtnY },
                    icon: step.icon,
                    label: step.label,
                    color: step.color,
                    delay: i * 0.03,
                    onClick: () => { onConfigure(nodeId, `review:${step.key}`); setExpanded(null); resetSubs() },
                    onHover: () => setReviewStep(Math.min(i + 1, REVIEW_FLOW_STEPS.length - 1)),
                })
            }
        }

        if (show('right') && expanded === 'after') {
            ADD_NODE_TYPES.forEach((sub, i) => {
                add({
                    key: `after-${sub.key}`,
                    testId: `ext-after-${sub.key}`,
                    pos: { x: positions.right.x + TILE, y: positions.right.y + (i - 1) * TILE },
                    icon: sub.icon,
                    label: sub.label,
                    color: sub.color,
                    delay: i * 0.03,
                    active: sub.key === 'job' && jobExpanded === 'after',
                    onClick: () => { onAddAfter(nodeId, sub.key); setExpanded(null); resetSubs() },
                    onHover: sub.key === 'job'
                        ? () => { setJobExpanded('after'); setScriptExpanded(null); setAiExpanded(null) }
                        : () => { setJobExpanded(null); setScriptExpanded(null); setAiExpanded(null) },
                })
            })
        }

        if (show('right') && expanded === 'after' && jobExpanded === 'after') {
            const jobBtnX = positions.right.x + TILE
            const jobBtnY = positions.right.y
            JOB_TYPES.forEach((jt, i) => {
                add({
                    key: `after-job-${jt.key}`,
                    testId: `ext-after-job-${jt.key}`,
                    pos: { x: jobBtnX + TILE, y: jobBtnY + (i - 1) * TILE },
                    icon: jt.icon,
                    label: jt.label,
                    color: jt.color,
                    delay: i * 0.03,
                    active: (jt.key === 'script' && scriptExpanded === 'after') || (jt.key === 'ai' && aiExpanded === 'after'),
                    onClick: () => {
                        if (jt.key === 'user') {
                            onAddAfter(nodeId, 'user')
                            setExpanded(null); resetSubs()
                        } else if (jt.key === 'script') {
                            onAddAfter(nodeId, 'script:js')
                            setExpanded(null); resetSubs()
                        } else if (jt.key === 'ai') {
                            onAddAfter(nodeId, 'ai:worker')
                            setExpanded(null); resetSubs()
                        }
                    },
                    onHover: jt.key === 'script'
                        ? () => { setScriptExpanded('after'); setAiExpanded(null) }
                        : jt.key === 'ai'
                            ? () => { setAiExpanded('after'); setScriptExpanded(null) }
                            : () => { setScriptExpanded(null); setAiExpanded(null) },
                })
            })
        }

        if (show('right') && expanded === 'after' && jobExpanded === 'after' && scriptExpanded === 'after') {
            const scriptBtnX = positions.right.x + TILE * 2
            const scriptBtnY = positions.right.y - TILE
            SCRIPT_TYPES.forEach((st, i) => {
                add({
                    key: `after-script-${st.key}`,
                    testId: `ext-after-script-${st.key}`,
                    pos: { x: scriptBtnX + TILE, y: scriptBtnY + (i - 1) * TILE },
                    icon: st.icon,
                    label: st.label,
                    color: st.color,
                    delay: i * 0.03,
                    onClick: () => { onAddAfter(nodeId, `script:${st.key}`); setExpanded(null); resetSubs() },
                })
            })
        }

        if (show('right') && expanded === 'after' && jobExpanded === 'after' && aiExpanded === 'after') {
            const aiBtnX = positions.right.x + TILE * 2
            const aiBtnY = positions.right.y + TILE
            AI_ROLES.forEach((role, i) => {
                add({
                    key: `after-ai-${role.key}`,
                    testId: `ext-after-ai-${role.key}`,
                    pos: { x: aiBtnX + TILE, y: aiBtnY + (i - 1) * TILE },
                    icon: role.icon,
                    label: role.label,
                    color: role.color,
                    delay: i * 0.03,
                    onClick: () => { onAddAfter(nodeId, `ai:${role.key}`); setExpanded(null); resetSubs() },
                })
            })
        }

        if (show('left') && expanded === 'before') {
            ADD_NODE_TYPES.forEach((sub, i) => {
                add({
                    key: `before-${sub.key}`,
                    testId: `ext-before-${sub.key}`,
                    pos: { x: positions.left.x - TILE, y: positions.left.y + (i - 1) * TILE },
                    icon: sub.icon,
                    label: sub.label,
                    color: sub.color,
                    delay: i * 0.03,
                    active: sub.key === 'job' && jobExpanded === 'before',
                    onClick: () => { onAddBefore(nodeId, sub.key); setExpanded(null); resetSubs() },
                    onHover: sub.key === 'job'
                        ? () => { setJobExpanded('before'); setScriptExpanded(null); setAiExpanded(null) }
                        : () => { setJobExpanded(null); setScriptExpanded(null); setAiExpanded(null) },
                })
            })
        }

        if (show('left') && expanded === 'before' && jobExpanded === 'before') {
            const jobBtnX = positions.left.x - TILE
            const jobBtnY = positions.left.y
            JOB_TYPES.forEach((jt, i) => {
                add({
                    key: `before-job-${jt.key}`,
                    testId: `ext-before-job-${jt.key}`,
                    pos: { x: jobBtnX - TILE, y: jobBtnY + (i - 1) * TILE },
                    icon: jt.icon,
                    label: jt.label,
                    color: jt.color,
                    delay: i * 0.03,
                    active: (jt.key === 'script' && scriptExpanded === 'before') || (jt.key === 'ai' && aiExpanded === 'before'),
                    onClick: () => {
                        if (jt.key === 'user') {
                            onAddBefore(nodeId, 'user')
                            setExpanded(null); resetSubs()
                        } else if (jt.key === 'script') {
                            onAddBefore(nodeId, 'script:js')
                            setExpanded(null); resetSubs()
                        } else if (jt.key === 'ai') {
                            onAddBefore(nodeId, 'ai:worker')
                            setExpanded(null); resetSubs()
                        }
                    },
                    onHover: jt.key === 'script'
                        ? () => { setScriptExpanded('before'); setAiExpanded(null) }
                        : jt.key === 'ai'
                            ? () => { setAiExpanded('before'); setScriptExpanded(null) }
                            : () => { setScriptExpanded(null); setAiExpanded(null) },
                })
            })
        }

        if (show('left') && expanded === 'before' && jobExpanded === 'before' && scriptExpanded === 'before') {
            const scriptBtnX = positions.left.x - TILE * 2
            const scriptBtnY = positions.left.y - TILE
            SCRIPT_TYPES.forEach((st, i) => {
                add({
                    key: `before-script-${st.key}`,
                    testId: `ext-before-script-${st.key}`,
                    pos: { x: scriptBtnX - TILE, y: scriptBtnY + (i - 1) * TILE },
                    icon: st.icon,
                    label: st.label,
                    color: st.color,
                    delay: i * 0.03,
                    onClick: () => { onAddBefore(nodeId, `script:${st.key}`); setExpanded(null); resetSubs() },
                })
            })
        }

        if (show('left') && expanded === 'before' && jobExpanded === 'before' && aiExpanded === 'before') {
            const aiBtnX = positions.left.x - TILE * 2
            const aiBtnY = positions.left.y + TILE
            AI_ROLES.forEach((role, i) => {
                add({
                    key: `before-ai-${role.key}`,
                    testId: `ext-before-ai-${role.key}`,
                    pos: { x: aiBtnX - TILE, y: aiBtnY + (i - 1) * TILE },
                    icon: role.icon,
                    label: role.label,
                    color: role.color,
                    delay: i * 0.03,
                    onClick: () => { onAddBefore(nodeId, `ai:${role.key}`); setExpanded(null); resetSubs() },
                })
            })
        }

        const margin = 2
        const half = BTN_SIZE / 2

        // Step 1: shift the whole cluster if any button would render outside viewport.
        // Step 2: clamp each button as a final safety net (when the cluster is wider
        //         than the viewport, shifting alone cannot fully fix it).
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
        for (const b of out) {
            minX = Math.min(minX, b.pos.x - half)
            minY = Math.min(minY, b.pos.y - half)
            maxX = Math.max(maxX, b.pos.x + half)
            maxY = Math.max(maxY, b.pos.y + half)
        }

        if (!Number.isFinite(minX)) return out

        let dx = 0
        let dy = 0
        if (minX < margin) dx += (margin - minX)
        if (maxX > viewport.w - margin) dx -= (maxX - (viewport.w - margin))
        if (minY < margin) dy += (margin - minY)
        if (maxY > viewport.h - margin) dy -= (maxY - (viewport.h - margin))

        const minCx = margin + half
        const maxCx = Math.max(minCx, viewport.w - margin - half)
        const minCy = margin + half
        const maxCy = Math.max(minCy, viewport.h - margin - half)

        const shifted = (dx !== 0 || dy !== 0)
            ? out.map(b => ({ ...b, pos: { x: b.pos.x + dx, y: b.pos.y + dy } }))
            : out

        return shifted.map(b => ({
            ...b,
            pos: {
                x: clamp(b.pos.x, minCx, maxCx),
                y: clamp(b.pos.y, minCy, maxCy),
            },
        }))
    }, [show, positions, expanded, resetSubs, attachExpanded, preset, cfgActions, cfgOffset, reviewIndex, reviewStep, nodeId, onConfigure, onAddAfter, onAddBefore, jobExpanded, scriptExpanded, aiExpanded, viewport.w, viewport.h])

    const coordsByTestId = useMemo(() => {
        const map: Record<string, { x: number; y: number }> = {}
        for (const b of visibleButtons) map[b.testId] = b.pos
        return map
    }, [visibleButtons])

    const chainPoints = useMemo(() => {
        const pts = activeChainIds
            .map(id => coordsByTestId[id])
            .filter(Boolean) as { x: number; y: number }[]
        return pts
    }, [activeChainIds, coordsByTestId])

    if (!nodeRect || !positions) return null

    return (
        <div data-testid="swipe-buttons-menu"
            style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                zIndex: 1000, pointerEvents: 'none',
                touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none',
            }}>

            {showActiveChainLinkLine && chainPoints.length >= 2 && (
                <svg
                    aria-hidden
                    style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
                >
                    <path
                        d={`M ${chainPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                        stroke={linkLineColor}
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity={0.9}
                    />
                    {chainPoints.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r={4.2} fill={linkLineColor} opacity={i === chainPoints.length - 1 ? 1 : 0.55} />
                    ))}
                </svg>
            )}

            <AnimatePresence>
                {visibleButtons.map(b => (
                    <MotionButton
                        key={b.key}
                        testId={b.testId}
                        pos={b.pos}
                        icon={b.icon}
                        label={b.label}
                        color={b.color}
                        delay={b.delay}
                        active={b.active}
                        dimmed={shouldDim(b.testId)}
                        activationMode={activationMode}
                        onClick={b.onClick}
                        onHover={b.onHover}
                        size={BTN_SIZE}
                    />
                ))}
            </AnimatePresence>

            <AnimatePresence>
                {renaming && (
                    <motion.div
                        data-testid="ext-rename-input"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        style={{
                            position: 'fixed',
                            left: (nodeRect.left + nodeRect.width / 2) - 100,
                            top: positions.bottom.y + 32,
                            width: 200,
                            pointerEvents: 'auto',
                        }}
                        {...stopEvents}
                    >
                        <input
                            ref={inputRef}
                            data-testid="ext-rename-field"
                            type="text"
                            value={renameValue}
                            onChange={e => setRenameValue(e.target.value)}
                            onKeyDown={handleRenameKeyDown}
                            onBlur={handleRenameConfirm}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: 10,
                                border: '1.5px solid rgba(245,158,11,0.4)',
                                background: 'rgba(15,15,26,0.95)',
                                backdropFilter: 'blur(12px)',
                                color: '#e2e8f0',
                                fontSize: 13, fontWeight: 600,
                                fontFamily: 'Inter',
                                outline: 'none', textAlign: 'center',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                                boxSizing: 'border-box',
                            }}
                        />
                        <div style={{ textAlign: 'center', marginTop: 4, fontSize: 8, color: '#64748b', fontFamily: 'Inter' }}>
                            Enter to confirm · ESC to cancel
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ── MotionButton ────────────────────────────────────────────────────────────────

function MotionButton({ testId, pos, icon: Icon, label, color, delay = 0, size = 48, active, dimmed, onClick, onHover, activationMode = 'click' }: {
    testId: string
    pos: { x: number; y: number }
    icon: typeof Plus
    label: string
    color: string
    delay?: number
    size?: number
    active?: boolean
    dimmed?: boolean
    onClick: () => void
    onHover?: () => void
    activationMode?: BdxSwipeMenuActivation
}) {
    const half = size / 2
    const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [holdProgress, setHoldProgress] = useState(false)

    useEffect(() => () => {
        if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
    }, [])

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        e.stopPropagation()
        if (activationMode === 'hold' && onHover) {
            setHoldProgress(true)
            holdTimerRef.current = setTimeout(() => {
                setHoldProgress(false)
                onHover()
            }, 500)
        }
    }, [activationMode, onHover])

    const handlePointerUp = useCallback((e?: React.PointerEvent) => {
        e?.stopPropagation()
        if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current)
            holdTimerRef.current = null
        }
        setHoldProgress(false)
    }, [])

    const handlePointerEnter = useCallback((e: React.PointerEvent) => {
        e.stopPropagation()
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = `${color}88`
        el.style.boxShadow = `0 4px 20px rgba(0,0,0,0.5), 0 0 12px ${color}33`
        if ((activationMode === 'swipe' || activationMode === 'click') && onHover) onHover()
    }, [activationMode, onHover, color])

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (activationMode === 'hold') return
        onClick()
    }, [activationMode, onClick])

    const ringRadius = half + 2
    const circumference = 2 * Math.PI * ringRadius

    useEffect(() => { ensureHoldKeyframe() }, [])

    return (
        <motion.button
            data-testid={testId}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: dimmed ? 0.55 : 1, scale: dimmed ? 0.92 : 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ delay, duration: 0.15, ease: 'easeOut' }}
            onClick={handleClick}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = `${color}44`
                el.style.boxShadow = `0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px ${color}11`
                handlePointerUp()
            }}
            style={{
                position: 'fixed',
                left: pos.x - half,
                top: pos.y - half,
                pointerEvents: 'auto',
                ...btnStyle(color, size, !!dimmed),
                ...(active ? { borderColor: `${color}aa`, boxShadow: `0 10px 26px rgba(0,0,0,0.55), 0 0 18px ${color}44` } : {}),
            }}
        >
            {holdProgress && (
                <svg
                    style={{
                        position: 'absolute',
                        left: -4, top: -4,
                        width: size + 8, height: size + 8,
                        pointerEvents: 'none',
                    }}
                >
                    <circle
                        cx={(size + 8) / 2}
                        cy={(size + 8) / 2}
                        r={ringRadius}
                        fill="none"
                        stroke={color}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeDasharray={`${circumference}`}
                        strokeDashoffset={`${circumference}`}
                        style={{
                            // @ts-expect-error CSS custom property
                            '--circ': `${circumference}`,
                            animation: 'swipe-btn-hold-fill 0.5s linear forwards',
                        }}
                    />
                </svg>
            )}
            <Icon
                size={dimmed ? (size <= 44 ? 16 : 20) : (size <= 44 ? 18 : 24)}
                strokeWidth={2}
                color={dimmed ? '#94a3b8' : color}
            />
            <span style={{
                fontSize: size <= 44 ? 7 : 8,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.3,
                lineHeight: 1,
                opacity: dimmed ? 0.85 : 0.9,
                color: dimmed ? '#94a3b8' : undefined,
            }}>
                {label}
            </span>
        </motion.button>
    )
}

