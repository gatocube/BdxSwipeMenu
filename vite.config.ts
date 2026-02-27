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
        build: isLib ? {
            lib: {
                entry: path.resolve(__dirname, 'src/index.ts'),
                name: 'BdxSwipeMenu',
                fileName: 'bdx-swipe-menu',
                formats: ['es'] as const,
            },
            rollupOptions: {
                external: ['react', 'react-dom', 'react/jsx-runtime'],
            },
        } : {
            rollupOptions: {
                input: {
                    index: path.resolve(__dirname, 'index.html'),
                    demo: path.resolve(__dirname, 'demo.html'),
                    docs: path.resolve(__dirname, 'docs.html'),
                    longChains: path.resolve(__dirname, 'long-chains.html'),
                },
            },
        },
    }
})
