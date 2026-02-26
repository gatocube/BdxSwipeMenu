import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
    const isLib = mode === 'lib'

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        base: '/BdxSwipeMenu/',
        ...(isLib ? {
            build: {
                lib: {
                    entry: path.resolve(__dirname, 'src/index.ts'),
                    name: 'BdxSwipeMenu',
                    fileName: 'bdx-swipe-menu',
                    formats: ['es'] as const,
                },
                rollupOptions: {
                    external: ['react', 'react-dom', 'react/jsx-runtime'],
                },
            },
        } : {}),
    }
})
