'use client'

/**
 * Demo — BdxSwipeMenu standalone + MenuConfigurator panel.
 */

import { useState } from 'react'
import { BdxSwipeMenu, type BdxSwipeMenuState } from '@bdx/swipe-menu'
import { MenuConfigurator } from '../components/MenuConfigurator'
import { PageLayout } from '../components/PageLayout'
import { useTheme } from '../components/ThemeContext'
import { renderMenuIcon } from '@/swipeMenu/ui'

export function DemoPage() {
    const { theme } = useTheme()
    const [state, setState] = useState<BdxSwipeMenuState>({
        nodes: [
            { key: '_trigger_', label: 'Menu', icon: 'menu' },

            { key: 'actions', label: 'Actions', icon: 'zap', color: '#7c3aed', direction: 'top' },
            { key: 'config', label: 'Config', icon: 'settings', color: '#0ea5e9', direction: 'right' },
            { key: 'before', label: 'Special', icon: 'plus', color: '#f59e0b', direction: 'left' },
            { key: 'info', label: 'Info', icon: 'search', color: '#10b981', direction: 'bottom' },

            { key: 'act-respond', label: 'Respond', icon: 'message-circle', parentId: 'actions' },
            { key: 'act-remind', label: 'Remind', icon: 'bell', parentId: 'actions' },
            { key: 'act-view', label: 'View', icon: 'eye', parentId: 'actions' },

            { key: 'before-job', label: '', icon: 'briefcase', parentId: 'before' },
            { key: 'before-note', label: 'Text', parentId: 'before' },
            { key: 'before-archive', label: 'Archive', icon: 'archive', parentId: 'before', disabled: true },

            { key: 'cfg-rename', label: 'Rename', icon: 'pencil', parentId: 'config', action: '__rename__' },
            { key: 'cfg-settings', label: 'Settings', icon: 'sliders-horizontal', parentId: 'config', action: 'settings' },
            { key: 'cfg-delete', label: 'Delete', icon: 'trash-2', parentId: 'config', action: 'delete' },
        ],
    })

    return (
        <PageLayout className="!h-screen !overflow-hidden">
            <div className="flex-1 flex relative min-h-0 overflow-hidden">
                <div className="flex-1 flex items-center justify-center">
                    <BdxSwipeMenu state={state} renderIcon={renderMenuIcon} theme={theme} />
                </div>

                <MenuConfigurator
                    state={state}
                    onStateChange={setState}
                    className="w-[540px] m-4 shrink-0 self-stretch"
                />
            </div>
        </PageLayout>
    )
}
