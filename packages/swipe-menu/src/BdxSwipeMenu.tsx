'use client'

/**
 * BdxSwipeMenu — radial action menu optimised for touchscreen devices.
 *
 * This component provides a convenient method to use menus on touchscreen
 * devices like iPad. It is ideal for frequently used actions, because it
 * trains the user to rely on the same gestures/movements for the same
 * actions — building muscle memory over time.
 *
 * **New API (v2)** — Declarative state-based configuration:
 *
 *   // Pattern 1: Standalone — attaches to an element via [data-id]
 *   <BdxSwipeMenu state={menuState} nodeId="node-1" onAction={handler} />
 *
 *   // Pattern 2: Wrapper — wraps children with a menu
 *   <BdxSwipeMenu state={menuState} onAction={handler}>
 *     <div>I have a menu</div>
 *   </BdxSwipeMenu>
 *
 * Activation modes:
 *   click  — menu appears on tap / click (default)
 *   hold   — menu appears after a long-press (~500 ms) with a progress ring
 *   swipe  — menu appears instantly on hover / pointer-enter
 *
 * Designed to be reusable across projects.
 */

import { useState, useRef, useEffect, useCallback, useMemo, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, Settings, Cpu, Code, UserCircle, Trash2, FileCode, Terminal, FileType,
    Brain, Wrench, Search, Paperclip, Clock, StickyNote, Briefcase, ClipboardCheck,
    Workflow, Pencil, MessageSquareText, GitPullRequest, AlertTriangle, BadgeCheck,
    Link, Menu, SlidersHorizontal, type LucideIcon,
} from 'lucide-react'

// ── Types ───────────────────────────────────────────────────────────────────────

/** A single menu node (flat — use parentId to build the tree) */
export interface MenuNode {
    key: string
    label: string
    icon?: string             // lucide icon name — omit for label-only button
    color?: string            // hex color — omit for auto-assigned palette color
    parentId?: string | null  // null/undefined = root node
    direction?: BdxSwipeMenuDirection  // only for root nodes
    action?: string           // if set, clicking fires onAction with this value
    disabled?: boolean        // if true, button is dimmed and unclickable
    /** Override the auto-generated testId for backward compatibility */
    testIdKey?: string
}

/** Complete menu state */
export interface BdxSwipeMenuState {
    activation?: BdxSwipeMenuActivation
    noOverlap?: boolean
    showChainLine?: boolean
    nodes: MenuNode[]         // flat collection — nodes[0] is always the trigger node
    rename?: boolean
}

export type BdxSwipeMenuActivation = 'click' | 'hold' | 'swipe'
export type BdxSwipeMenuDirection = 'top' | 'right' | 'bottom' | 'left' | 'bottom-right'

export interface BdxSwipeMenuProps {
    state: BdxSwipeMenuState
    nodeId?: string
    currentLabel?: string
    onAction?: (nodeId: string, action: string) => void
    onRename?: (nodeId: string, newName: string) => void
    onDismiss?: () => void
    children?: React.ReactNode
}

// ── Icon Map ────────────────────────────────────────────────────────────────────

export const ICON_MAP: Record<string, LucideIcon> = {
    plus: Plus, settings: Settings, cpu: Cpu, code: Code,
    'user-circle': UserCircle, 'trash-2': Trash2, 'file-code': FileCode,
    terminal: Terminal, 'file-type': FileType, brain: Brain, wrench: Wrench,
    search: Search, paperclip: Paperclip, clock: Clock, 'sticky-note': StickyNote,
    briefcase: Briefcase, 'clipboard-check': ClipboardCheck, workflow: Workflow,
    pencil: Pencil, 'message-square-text': MessageSquareText,
    'git-pull-request': GitPullRequest, 'alert-triangle': AlertTriangle,
    'badge-check': BadgeCheck, link: Link, menu: Menu,
    'sliders-horizontal': SlidersHorizontal, 'file-text': FileCode,
}

export function resolveIcon(name?: string): LucideIcon | undefined {
    if (!name) return undefined
    return ICON_MAP[name] || Plus
}


// ── Constants ───────────────────────────────────────────────────────────────────

const TILE = 64
export const BTN_SIZE = 56

/** Curated palette for auto-coloring nodes when no explicit color is set */
export const AUTO_COLORS = [
    '#22d3ee',   // cyan
    '#a78bfa',   // violet
    '#34d399',   // emerald
    '#fb923c',   // orange
    '#f472b6',   // pink
    '#facc15',   // yellow
    '#60a5fa',   // blue
    '#fb7185',   // rose
    '#4ade80',   // green
    '#c084fc',   // purple
]

/** Resolve node color: use explicit color or pick from palette by index */
export function resolveColor(node: MenuNode, index: number): string {
    return node.color || AUTO_COLORS[index % AUTO_COLORS.length]
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n))
}

// ── Shared button style ─────────────────────────────────────────────────────────

export function btnStyle(color: string, size = 56, dimmed = false): React.CSSProperties {
    return {
        width: size, height: size,
        flexShrink: 0,
        borderRadius: size <= 44 ? 12 : 16,
        borderWidth: 1.5,
        borderStyle: 'solid',
        borderColor: dimmed ? 'rgba(148,163,184,0.25)' : `${color}44`,
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

// ── Shared node-button content (icon + label) ───────────────────────────────────
// Used by MotionButton inside BdxSwipeMenu and by NodeButton in the configurator

export function NodeButtonContent({ icon: Icon, label, color, size = 56, dimmed = false }: {
    icon?: LucideIcon
    label: string
    color: string
    size?: number
    dimmed?: boolean
}) {
    return (
        <>
            {Icon && (
                <Icon
                    size={dimmed ? (size <= 44 ? 16 : 20) : (size <= 44 ? 18 : 24)}
                    strokeWidth={2}
                    color={dimmed ? '#94a3b8' : color}
                />
            )}
            <span style={{
                fontSize: Icon ? (size <= 44 ? 7 : 8) : (size <= 44 ? 9 : 10),
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.3,
                lineHeight: 1,
                opacity: dimmed ? 0.85 : 0.9,
                color: dimmed ? '#94a3b8' : undefined,
                maxWidth: '90%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}>
                {label}
            </span>
        </>
    )
}

// CSS keyframe for hold progress ring
let holdKeyframeInjected = false
function ensureHoldKeyframe() {
    if (holdKeyframeInjected) return
    holdKeyframeInjected = true
    const style = document.createElement('style')
    style.textContent = `@keyframes swipe-btn-hold-fill { from { stroke-dashoffset: var(--circ); } to { stroke-dashoffset: 0; } }`
    document.head.appendChild(style)
}

// ── Hooks ───────────────────────────────────────────────────────────────────────

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

        const handleTouchStart = (e: TouchEvent) => { e.preventDefault() }
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

// ── Helpers: tree → flat button list ────────────────────────────────────────────

interface FlatBtn {
    key: string
    testId: string
    pos: { x: number; y: number }
    icon?: LucideIcon
    label: string
    color: string
    delay: number
    active: boolean
    onClick: () => void
    onHover?: () => void
    /** Path of expanded keys leading to this button */
    chainPath: string[]
    /** Whether the button is disabled */
    disabled?: boolean
}

/**
 * Direction vectors for laying out children relative to their parent.
 * The "primary" axis determines which direction children fan out;
 * "cross" axis spreads children perpendicular to that.
 */
function getDirectionVectors(dir: BdxSwipeMenuDirection): { primary: { dx: number; dy: number }; cross: { dx: number; dy: number } } {
    switch (dir) {
        case 'top': return { primary: { dx: 0, dy: -1 }, cross: { dx: 1, dy: 0 } }
        case 'bottom': return { primary: { dx: 0, dy: 1 }, cross: { dx: 1, dy: 0 } }
        case 'right': return { primary: { dx: 1, dy: 0 }, cross: { dx: 0, dy: 1 } }
        case 'left': return { primary: { dx: -1, dy: 0 }, cross: { dx: 0, dy: 1 } }
        case 'bottom-right': return { primary: { dx: 1, dy: 1 }, cross: { dx: 1, dy: -1 } }
    }
}

// ── Component ───────────────────────────────────────────────────────────────────

export function BdxSwipeMenu(props: BdxSwipeMenuProps) {
    const {
        state,
        nodeId: propNodeId,
        currentLabel = '',
        onAction, onRename, onDismiss,
        children,
    } = props

    const generatedId = useId()
    const nodeId = propNodeId || `bdx-wrap-${generatedId}`

    const activationMode = state.activation ?? 'swipe'
    const noOverlap = state.noOverlap ?? false
    const showChainLine = state.showChainLine ?? true
    const dirs = state.nodes.filter(n => !n.parentId && n.direction).map(n => n.direction!)

    // ── Expansion state: track which keys are expanded at each depth ──
    // expandedPath = ['config', 'attach'] means config branch is open, attach submenu is open
    const [expandedPath, setExpandedPath] = useState<string[]>([])
    const [renaming, setRenaming] = useState(false)
    const [renameValue, setRenameValue] = useState(currentLabel)
    const inputRef = useRef<HTMLInputElement>(null)
    const [nodeRect, setNodeRect] = useState<DOMRect | null>(null)
    const [viewport, setViewport] = useState(() => ({
        w: typeof window === 'undefined' ? 0 : window.innerWidth,
        h: typeof window === 'undefined' ? 0 : window.innerHeight,
    }))
    const visibleButtonsRef = useRef<FlatBtn[]>([])

    // ── Standalone mode: internal open/close state ──
    // Standalone = no children AND no explicit nodeId (component manages its own trigger)
    const isStandalone = !children && !propNodeId
    const [isOpen, setIsOpen] = useState(false)
    const menuVisible = isStandalone ? isOpen : true  // non-standalone is always controlled externally

    // ── Swipe-mode auto-dismiss: close menu 350ms after pointer leaves all elements ──
    const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const cancelLeave = useCallback(() => {
        if (leaveTimerRef.current) { clearTimeout(leaveTimerRef.current); leaveTimerRef.current = null }
    }, [])

    const startLeave = useCallback(() => {
        if (!isStandalone || activationMode !== 'swipe') return
        cancelLeave()
        leaveTimerRef.current = setTimeout(() => {
            setIsOpen(false)
            setExpandedPath([])
        }, 350)
    }, [isStandalone, activationMode, cancelLeave])

    useEffect(() => () => cancelLeave(), [cancelLeave])  // cleanup on unmount

    const isExpanded = useCallback((key: string, depth: number) => {
        return expandedPath.length > depth && expandedPath[depth] === key
    }, [expandedPath])

    const expandTo = useCallback((path: string[]) => {
        setExpandedPath(path)
    }, [])

    const toggleExpand = useCallback((path: string[]) => {
        const depth = path.length - 1
        const key = path[depth]
        if (expandedPath.length > depth && expandedPath[depth] === key) {
            // collapse
            setExpandedPath(path.slice(0, depth))
        } else {
            // expand (cut off anything deeper)
            setExpandedPath(path)
        }
    }, [expandedPath])

    // ── Swipe handler ──
    const handleSwipeHit = useCallback((testId: string | null) => {
        if (!testId) return
        // Handle root buttons: swipe-btn-{testIdKey}
        if (testId.startsWith('swipe-btn-')) {
            const hitKey = testId.replace('swipe-btn-', '')
            // Find the root node whose testIdKey or key matches
            const root = state.nodes.find(n => !n.parentId && ((n.testIdKey || n.key) === hitKey))
            if (root) expandTo([root.key])
            return
        }
        // Handle ext- buttons by finding the matching FlatBtn via ref
        if (testId.startsWith('ext-')) {
            const btn = visibleButtonsRef.current.find(b => b.testId === testId)
            if (btn) expandTo(btn.chainPath)
        }
    }, [expandTo, state.nodes])

    useTouchSwipe(activationMode, handleSwipeHit)

    // ── Escape key ──
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return
            if (renaming) setRenaming(false)
            else onDismiss?.()
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [onDismiss, renaming])

    // ── Track node position ──
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

    // ── Rename flow ──
    useEffect(() => {
        if (renaming) {
            setRenameValue(currentLabel)
            setTimeout(() => inputRef.current?.select(), 50)
        }
    }, [renaming, currentLabel])

    const handleRenameConfirm = useCallback(() => {
        const trimmed = renameValue.trim()
        if (trimmed && trimmed !== currentLabel) onRename?.(nodeId, trimmed)
        setRenaming(false)
    }, [renameValue, currentLabel, nodeId, onRename])

    const handleRenameKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); handleRenameConfirm() }
        else if (e.key === 'Escape') { e.preventDefault(); setRenaming(false) }
    }, [handleRenameConfirm])

    // ── Build root positions ──
    const positions = useMemo(() => {
        if (!nodeRect) return null
        const cx = nodeRect.left + nodeRect.width / 2
        const cy = nodeRect.top + nodeRect.height / 2
        // In standalone mode the trigger is BTN_SIZE, so use TILE for uniform spacing
        const gapX = isStandalone
            ? TILE
            : noOverlap
                ? nodeRect.width / 2 + BTN_SIZE / 2 + 4
                : nodeRect.width / 2 + 16
        const gapY = isStandalone
            ? TILE
            : noOverlap
                ? nodeRect.height / 2 + BTN_SIZE / 2 + 4
                : nodeRect.height / 2 + 16

        return {
            top: { x: cx, y: cy - gapY },
            right: { x: cx + gapX, y: cy },
            bottom: { x: cx, y: cy + gapY },
            left: { x: cx - gapX, y: cy },
            'bottom-right': { x: cx + gapX * 0.85, y: cy + gapY * 0.85 },
        }
    }, [nodeRect, noOverlap, isStandalone])

    // ── Build lookup tables from flat nodes ──
    const { roots, childrenOf, nodeMap } = useMemo(() => {
        const nodeMap = new Map<string, MenuNode>()
        const childrenOf = new Map<string, MenuNode[]>()
        const roots: MenuNode[] = []
        for (const n of state.nodes) {
            nodeMap.set(n.key, n)
            if (!n.parentId) {
                roots.push(n)
            } else {
                const list = childrenOf.get(n.parentId) || []
                list.push(n)
                childrenOf.set(n.parentId, list)
            }
        }
        return { roots, childrenOf, nodeMap }
    }, [state.nodes])

    /** Walk up from a node to build the full key path to root */
    const getPathToRoot = useCallback((key: string): string[] => {
        const path: string[] = []
        let current = nodeMap.get(key)
        while (current) {
            path.unshift(current.key)
            current = current.parentId ? nodeMap.get(current.parentId) : undefined
        }
        return path
    }, [nodeMap])

    /** Find the root ancestor of a node */
    const getRootKey = useCallback((key: string): string => {
        const path = getPathToRoot(key)
        return path[0] || key
    }, [getPathToRoot])

    // ── Flatten the flat node tree into positioned buttons ──
    const visibleButtons = useMemo(() => {
        const out: FlatBtn[] = []
        if (!positions) return out

        // Recursive renderer
        function renderChildren(
            parentKey: string,
            parentPos: { x: number; y: number },
            vectors: ReturnType<typeof getDirectionVectors>,
            depth: number,
        ) {
            const children = childrenOf.get(parentKey) || []
            if (children.length === 0) return

            const offset = Math.floor(children.length / 2)
            children.forEach((child, i) => {
                const childPath = getPathToRoot(child.key)
                const childExpanded = isExpanded(child.key, depth)
                const hasChildren = (childrenOf.get(child.key) || []).length > 0
                const childPos = {
                    x: parentPos.x + vectors.primary.dx * TILE + vectors.cross.dx * (i - offset) * TILE,
                    y: parentPos.y + vectors.primary.dy * TILE + vectors.cross.dy * (i - offset) * TILE,
                }

                // Build action path from the chain
                const rootKey = childPath[0]

                out.push({
                    key: child.key,
                    testId: `ext-${child.testIdKey || child.key}`,
                    pos: childPos,
                    icon: resolveIcon(child.icon),
                    label: child.label,
                    color: resolveColor(child, state.nodes.indexOf(child)),
                    delay: i * 0.03,
                    active: childExpanded,
                    disabled: !!child.disabled,
                    chainPath: childPath,
                    onClick: () => {
                        if (child.action === '__rename__') {
                            setRenaming(true)
                            return
                        }
                        if (child.action) {
                            onAction?.(nodeId, `${rootKey}:${child.action}`)
                            setExpandedPath([])
                            return
                        }
                        if (hasChildren) {
                            toggleExpand(childPath)
                            return
                        }
                        onAction?.(nodeId, `${rootKey}:${child.key}`)
                        setExpandedPath([])
                    },
                    onHover: hasChildren ? () => expandTo(childPath) : undefined,
                })

                // Recurse into expanded children
                if (childExpanded && hasChildren) {
                    renderChildren(child.key, childPos, vectors, depth + 1)
                }
            })
        }

        // Render root branches — sorted so stagger delay follows: left, top, right, bottom
        const dirOrder: Record<string, number> = { left: 0, 'top-left': 0.5, top: 1, 'top-right': 1.5, right: 2, 'bottom-right': 2.5, bottom: 3, 'bottom-left': 3.5 }
        const sortedRoots = [...roots].sort((a, b) => (dirOrder[a.direction ?? ''] ?? 9) - (dirOrder[b.direction ?? ''] ?? 9))
        for (let rIdx = 0; rIdx < sortedRoots.length; rIdx++) {
            const root = sortedRoots[rIdx]
            if (!root.direction) continue
            const pos = positions[root.direction]
            if (!pos) continue

            const rootExpanded = isExpanded(root.key, 0)

            out.push({
                key: root.key,
                testId: `swipe-btn-${root.testIdKey || root.key}`,
                pos,
                icon: resolveIcon(root.icon),
                label: root.label,
                color: resolveColor(root, state.nodes.indexOf(root)),
                delay: rIdx * 0.04,
                active: rootExpanded,
                chainPath: [root.key],
                onClick: () => toggleExpand([root.key]),
                onHover: () => expandTo([root.key]),
            })

            if (rootExpanded) {
                const vectors = getDirectionVectors(root.direction)
                renderChildren(root.key, pos, vectors, 1)
            }
        }

        // ── Viewport clamping ──
        const margin = 2
        const half = BTN_SIZE / 2

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
        for (const b of out) {
            minX = Math.min(minX, b.pos.x - half)
            minY = Math.min(minY, b.pos.y - half)
            maxX = Math.max(maxX, b.pos.x + half)
            maxY = Math.max(maxY, b.pos.y + half)
        }

        if (!Number.isFinite(minX)) return out

        let dx = 0, dy = 0
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
    }, [roots, childrenOf, positions, isExpanded, expandTo, toggleExpand, nodeId, onAction, getPathToRoot, viewport.w, viewport.h])

    // Keep ref in sync for swipe handler (avoids circular useMemo dep)
    visibleButtonsRef.current = visibleButtons

    // ── Dimming logic ──
    const shouldDim = useCallback((btn: FlatBtn) => {
        if (expandedPath.length === 0) return false

        // Root-level buttons: dim if not the active branch
        if (btn.chainPath.length === 1) {
            return btn.chainPath[0] !== expandedPath[0]
        }

        // For deeper buttons: dim if they are not on the active path
        // and there is a deeper expansion happening
        const depth = btn.chainPath.length - 1
        if (expandedPath.length <= depth) return false

        // Check if this button's branch matches the expanded path at its depth
        for (let i = 0; i < Math.min(btn.chainPath.length, expandedPath.length); i++) {
            if (btn.chainPath[i] !== expandedPath[i]) return true
        }

        return false
    }, [expandedPath])

    // ── Active chain for link line ──
    const activeChainIds = useMemo(() => {
        if (expandedPath.length === 0) return []
        const ids: string[] = []
        // Root button
        ids.push(`swipe-btn-${expandedPath[0]}`)
        // Expanded children
        for (let i = 1; i < expandedPath.length; i++) {
            ids.push(`ext-${expandedPath.slice(0, i + 1).join('-')}`)
        }
        return ids
    }, [expandedPath])

    const coordsByTestId = useMemo(() => {
        const map: Record<string, { x: number; y: number }> = {}
        for (const b of visibleButtons) map[b.testId] = b.pos
        return map
    }, [visibleButtons])

    const chainPoints = useMemo(() => {
        return activeChainIds
            .map(id => coordsByTestId[id])
            .filter(Boolean) as { x: number; y: number }[]
    }, [activeChainIds, coordsByTestId])

    const linkLineColor = expandedPath.length > 0
        ? (expandedPath[0] === 'config' ? 'rgba(245,158,11,0.8)' : 'rgba(139,92,246,0.85)')
        : 'rgba(148,163,184,0.7)'

    const stopEvents = {
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
        onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
    }

    // Standalone trigger button — nodes[0] is the trigger node
    const triggerNode = state.nodes[0]
    const TriggerIcon = ICON_MAP[triggerNode?.icon ?? 'menu'] ?? ICON_MAP['menu']
    const triggerColor = triggerNode?.color ?? AUTO_COLORS[0]

    const handleTriggerOpen = useCallback(() => {
        cancelLeave()
        setIsOpen(true)
        setExpandedPath([])   // collapse any expanded sub-menus
    }, [cancelLeave])

    const handleStandaloneDismiss = useCallback(() => {
        setIsOpen(false)
        setExpandedPath([])
        onDismiss?.()
    }, [onDismiss])

    const standaloneButton = (
        <motion.button
            data-id={nodeId}
            data-testid="bdx-trigger"
            style={{ ...btnStyle(triggerColor, BTN_SIZE), position: 'relative', zIndex: 1001 }}
            whileHover={{ scale: 1.12, borderColor: `${triggerColor}88`, boxShadow: `0 0 20px ${triggerColor}33, 0 4px 16px rgba(0,0,0,0.4)` }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onPointerEnter={() => { cancelLeave(); if (activationMode === 'swipe') handleTriggerOpen() }}
            onPointerLeave={startLeave}
            onClick={activationMode === 'click' ? handleTriggerOpen : undefined}
        >
            <NodeButtonContent icon={TriggerIcon} label={currentLabel || 'Menu'} color={triggerColor} size={BTN_SIZE} />
        </motion.button>
    )

    if (!nodeRect || !positions) {
        if (children) {
            return <div data-id={nodeId}>{children}</div>
        }
        return standaloneButton
    }

    return (
        <>
            {children && <div data-id={nodeId} style={{ display: 'contents' }}>{children}</div>}
            {!children && standaloneButton}

            <AnimatePresence>
                {menuVisible && (

                    <motion.div data-testid="swipe-buttons-menu"
                        key="menu-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                            zIndex: 1000, pointerEvents: 'none',
                            touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none',
                        }}>

                        {showChainLine && chainPoints.length >= 2 && (
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
                                    dimmed={shouldDim(b) || !!b.disabled}
                                    activationMode={activationMode}
                                    onClick={b.disabled ? () => { } : b.onClick}
                                    onHover={b.disabled ? undefined : b.onHover}
                                    onMenuEnter={cancelLeave}
                                    onMenuLeave={startLeave}
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
                                        top: (positions.bottom?.y ?? nodeRect.bottom) + 32,
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
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Standalone dismiss overlay */}
            {isStandalone && isOpen && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        zIndex: 999, cursor: 'default',
                    }}
                    onClick={handleStandaloneDismiss}
                />
            )}
        </>
    )
}

// ── MotionButton ────────────────────────────────────────────────────────────────

function MotionButton({ testId, pos, icon: Icon, label, color, delay = 0, size = 48, active, dimmed, onClick, onHover, onMenuEnter, onMenuLeave, activationMode = 'swipe' }: {
    testId: string
    pos: { x: number; y: number }
    icon?: LucideIcon
    label: string
    color: string
    delay?: number
    size?: number
    active?: boolean
    dimmed?: boolean
    onClick: () => void
    onHover?: () => void
    onMenuEnter?: () => void
    onMenuLeave?: () => void
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
        onMenuEnter?.()
        if (dimmed) return // disabled buttons don't highlight on hover
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = `${color}88`
        el.style.boxShadow = `0 4px 20px rgba(0,0,0,0.5), 0 0 12px ${color}33`
        if ((activationMode === 'swipe' || activationMode === 'click') && onHover) onHover()
    }, [activationMode, onHover, color, onMenuEnter, dimmed])

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
                onMenuLeave?.()
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
            <NodeButtonContent icon={Icon} label={label} color={color} size={size} dimmed={!!dimmed} />
        </motion.button>
    )
}
