/**
 * JSON Schema describing BdxSwipeMenuState.
 * Used by codemirror-json-schema for autocomplete + inline validation.
 */

const ICON_NAMES = [
    'plus', 'settings', 'cpu', 'code', 'user-circle', 'trash-2',
    'file-code', 'terminal', 'file-type', 'brain', 'wrench', 'search',
    'paperclip', 'clock', 'sticky-note', 'briefcase', 'clipboard-check',
    'workflow', 'pencil', 'message-square-text', 'git-pull-request',
    'alert-triangle', 'badge-check', 'link', 'menu', 'sliders-horizontal',
    'file-text',
] as const

const menuNodeSchema = {
    type: 'object',
    properties: {
        key:       { type: 'string', description: 'Unique identifier for this node' },
        label:     { type: 'string', description: 'Display label' },
        icon:      { type: 'string', enum: [...ICON_NAMES], description: 'Lucide icon name' },
        color:     { type: 'string', pattern: '^#[0-9a-fA-F]{3,8}$', description: 'Hex color (e.g. #22d3ee)' },
        parentId:  { type: ['string', 'null'], description: 'Parent node key (null = root)' },
        direction: { type: 'string', enum: ['top', 'right', 'bottom', 'left', 'bottom-right'], description: 'Expansion direction (root nodes only)' },
        action:    { type: 'string', description: 'Action identifier fired on click' },
        disabled:  { type: 'boolean', description: 'Dim and disable this node' },
    },
    required: ['key', 'label'],
} as const

export const menuStateSchema = {
    type: 'object',
    properties: {
        activation:    { type: 'string', enum: ['click', 'hold', 'swipe'], description: 'How the menu opens: click, hold (~500ms), or swipe (hover)' },
        noOverlap:     { type: 'boolean', description: 'Prevent sub-menus from overlapping the trigger' },
        showChainLine: { type: 'boolean', description: 'Draw connector lines between chained nodes' },
        rename:        { type: 'boolean', description: 'Enable inline rename on trigger node' },
        nodes:         { type: 'array', items: menuNodeSchema, description: 'Flat list of menu nodes (nodes[0] is the trigger)' },
    },
    required: ['nodes'],
} as const
