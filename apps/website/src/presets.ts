/**
 * Presets — reusable BdxSwipeMenuState configurations for the demo website.
 * These are app-specific; the library only ships a minimal DEFAULT_STATE.
 */

import type { BdxSwipeMenuState, MenuNode } from '@bdx/swipe-menu'

/** Shared "add" sub-tree nodes (used by both after & before branches) */
function addNodes(parentKey: string): MenuNode[] {
    return [
        { key: `${parentKey}-subflow`, label: 'SubFlow', icon: 'workflow', color: '#6366f1', parentId: parentKey, action: 'subflow' },
        { key: `${parentKey}-job`, label: 'Job', icon: 'briefcase', color: '#8b5cf6', parentId: parentKey },
        { key: `${parentKey}-recent`, label: 'Recent', icon: 'clock', color: '#64748b', parentId: parentKey, action: 'recent' },
        { key: `${parentKey}-job-user`, label: 'User', icon: 'user-circle', color: '#f59e0b', parentId: `${parentKey}-job`, action: 'user' },
        { key: `${parentKey}-job-script`, label: 'Script', icon: 'code', color: '#89e051', parentId: `${parentKey}-job` },
        { key: `${parentKey}-job-ai`, label: 'AI', icon: 'cpu', color: '#8b5cf6', parentId: `${parentKey}-job` },
        { key: `${parentKey}-job-script-js`, label: 'JS', icon: 'file-code', color: '#f7df1e', parentId: `${parentKey}-job-script`, action: 'script:js' },
        { key: `${parentKey}-job-script-sh`, label: 'SH', icon: 'terminal', color: '#4ade80', parentId: `${parentKey}-job-script`, action: 'script:sh' },
        { key: `${parentKey}-job-script-py`, label: 'PY', icon: 'file-type', color: '#3b82f6', parentId: `${parentKey}-job-script`, action: 'script:py' },
        { key: `${parentKey}-job-ai-planner`, label: 'Planner', icon: 'brain', color: '#a78bfa', parentId: `${parentKey}-job-ai`, action: 'ai:planner' },
        { key: `${parentKey}-job-ai-worker`, label: 'Worker', icon: 'wrench', color: '#8b5cf6', parentId: `${parentKey}-job-ai`, action: 'ai:worker' },
        { key: `${parentKey}-job-ai-reviewer`, label: 'Reviewer', icon: 'search', color: '#c084fc', parentId: `${parentKey}-job-ai`, action: 'ai:reviewer' },
    ]
}

export const DEFAULT_PRESET: BdxSwipeMenuState = {
    activation: 'click',
    noOverlap: false,
    showChainLine: true,
    rename: true,
    nodes: [
        { key: '_trigger_', label: 'Menu', icon: 'menu' },
        { key: 'config', label: 'Config', icon: 'settings', color: '#f59e0b', direction: 'top', testIdKey: 'configure' },
        { key: 'cfg-attach', label: 'Attach', icon: 'paperclip', color: '#06b6d4', parentId: 'config', testIdKey: 'cfg-attach' },
        { key: 'cfg-attach-expectation', label: 'Expect', icon: 'clipboard-check', color: '#22d3ee', parentId: 'cfg-attach', action: 'attach:expectation', testIdKey: 'cfg-attach-expectation' },
        { key: 'cfg-attach-note', label: 'Note', icon: 'sticky-note', color: '#fbbf24', parentId: 'cfg-attach', action: 'attach:note', testIdKey: 'cfg-attach-note' },
        { key: 'cfg-rename', label: 'Rename', icon: 'pencil', color: '#f59e0b', parentId: 'config', action: '__rename__', testIdKey: 'cfg-rename' },
        { key: 'cfg-settings', label: 'Settings', icon: 'settings', color: '#fb7185', parentId: 'config', action: 'settings', testIdKey: 'cfg-settings' },
        { key: 'cfg-delete', label: 'Delete', icon: 'trash-2', color: '#ef4444', parentId: 'config', action: 'delete', testIdKey: 'cfg-delete' },
        { key: 'after', label: 'After', icon: 'plus', color: '#8b5cf6', direction: 'right', testIdKey: 'add-after' },
        ...addNodes('after'),
        { key: 'before', label: 'Before', icon: 'plus', color: '#8b5cf6', direction: 'left', testIdKey: 'add-before' },
        ...addNodes('before'),
    ],
}

export const LONG_PRESET: BdxSwipeMenuState = {
    ...DEFAULT_PRESET,
    nodes: [
        { key: '_trigger_', label: 'Menu', icon: 'menu' },
        { key: 'config', label: 'Config', icon: 'settings', color: '#f59e0b', direction: 'top', testIdKey: 'configure' },
        { key: 'cfg-attach', label: 'Attach', icon: 'paperclip', color: '#06b6d4', parentId: 'config', testIdKey: 'cfg-attach' },
        { key: 'cfg-attach-expectation', label: 'Expect', icon: 'clipboard-check', color: '#22d3ee', parentId: 'cfg-attach', action: 'attach:expectation', testIdKey: 'cfg-attach-expectation' },
        { key: 'cfg-attach-note', label: 'Note', icon: 'sticky-note', color: '#fbbf24', parentId: 'cfg-attach', action: 'attach:note', testIdKey: 'cfg-attach-note' },
        { key: 'cfg-review', label: 'Review', icon: 'git-pull-request', color: '#a78bfa', parentId: 'config', testIdKey: 'cfg-review' },
        { key: 'cfg-review-respond', label: 'Respond', icon: 'message-square-text', color: '#a78bfa', parentId: 'cfg-review', action: 'review:respond', testIdKey: 'cfg-review-respond' },
        { key: 'cfg-review-request-changes', label: 'Request changes', icon: 'git-pull-request', color: '#c084fc', parentId: 'cfg-review', action: 'review:request-changes', testIdKey: 'cfg-review-request-changes' },
        { key: 'cfg-review-blockers', label: 'Blockers', icon: 'alert-triangle', color: '#f59e0b', parentId: 'cfg-review', action: 'review:blockers', testIdKey: 'cfg-review-blockers' },
        { key: 'cfg-review-tests-failed', label: 'Tests failed', icon: 'alert-triangle', color: '#fb7185', parentId: 'cfg-review', action: 'review:tests-failed', testIdKey: 'cfg-review-tests-failed' },
        { key: 'cfg-review-proof-link', label: 'Proof link', icon: 'link', color: '#22d3ee', parentId: 'cfg-review', action: 'review:proof-link', testIdKey: 'cfg-review-proof-link' },
        { key: 'cfg-review-approved', label: 'Approved', icon: 'badge-check', color: '#22c55e', parentId: 'cfg-review', action: 'review:approved', testIdKey: 'cfg-review-approved' },
        { key: 'cfg-rename', label: 'Rename', icon: 'pencil', color: '#f59e0b', parentId: 'config', action: '__rename__', testIdKey: 'cfg-rename' },
        { key: 'cfg-settings', label: 'Settings', icon: 'settings', color: '#fb7185', parentId: 'config', action: 'settings', testIdKey: 'cfg-settings' },
        { key: 'cfg-delete', label: 'Delete', icon: 'trash-2', color: '#ef4444', parentId: 'config', action: 'delete', testIdKey: 'cfg-delete' },
        { key: 'after', label: 'After', icon: 'plus', color: '#8b5cf6', direction: 'right', testIdKey: 'add-after' },
        ...addNodes('after'),
        { key: 'before', label: 'Before', icon: 'plus', color: '#8b5cf6', direction: 'left', testIdKey: 'add-before' },
        ...addNodes('before'),
    ],
}
