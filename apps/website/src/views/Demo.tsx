'use client'

/**
 * Demo — BdxSwipeMenu standalone + MenuConfigurator panel.
 */

import { useState } from 'react'
import { BdxSwipeMenu, type BdxSwipeMenuState } from '@bdx/swipe-menu'
import { MenuConfigurator } from '../components/MenuConfigurator'
import { PageLayout } from '../components/PageLayout'

export function DemoPage() {
    const [state, setState] = useState<BdxSwipeMenuState>({
        nodes: [
            // First node = trigger button config
            { key: '_trigger_', label: 'Menu', icon: 'menu' },

            // Root directions
            { key: 'actions', label: 'Actions', icon: 'zap', direction: 'top' },
            { key: 'config', label: 'Config', icon: 'settings', direction: 'right' },
            { key: 'before', label: 'Special', icon: 'plus', direction: 'left' },
            { key: 'info', label: 'Info', icon: 'search', direction: 'bottom' },

            // Actions children
            { key: 'act-respond', label: 'Respond', icon: 'message-circle', parentId: 'actions' },
            { key: 'act-remind', label: 'Remind', icon: 'bell', parentId: 'actions' },
            { key: 'act-view', label: 'View', icon: 'eye', parentId: 'actions' },

            // Special children
            { key: 'before-job', label: '', icon: 'briefcase', parentId: 'before' },
            { key: 'before-note', label: 'Text', parentId: 'before' },
            { key: 'before-archive', label: 'Archive', icon: 'archive', parentId: 'before', disabled: true },

            // Config children
            { key: 'cfg-rename', label: 'Rename', icon: 'pencil', parentId: 'config', action: '__rename__' },
            { key: 'cfg-settings', label: 'Settings', icon: 'sliders-horizontal', parentId: 'config', action: 'settings' },
            { key: 'cfg-delete', label: 'Delete', icon: 'trash-2', parentId: 'config', action: 'delete' },
        ],
    })

    return (
        <PageLayout>
            <div className="flex-1 flex relative min-h-0">
                {/* Menu area — centered in remaining space */}
                <div className="flex-1 flex items-center justify-center">
                    <BdxSwipeMenu state={state} />
                </div>

                {/* Configurator panel — right side */}
                <MenuConfigurator
                    state={state}
                    onStateChange={setState}
                    className="w-[540px] m-4 shrink-0 self-stretch"
                />
            </div>
        </PageLayout>
    )
}
