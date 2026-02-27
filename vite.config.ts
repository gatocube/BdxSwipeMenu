import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode, command }) => {
    const isLib = mode === 'lib'
    const env = loadEnv(mode, process.cwd(), '')
    const port = parseInt(env.VITE_PORT || '5177', 10)
    const deployBase = env.DEPLOY_BASE || '/BdxSwipeMenu/'
    const deployUrl = env.DEPLOY_URL || ''
    const deployHost = deployUrl ? new URL(deployUrl).hostname : undefined

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        base: command === 'serve' ? '/' : deployBase,
        server: {
            port,
            allowedHosts: deployHost ? [deployHost] : [],
        },
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
                    mobile: path.resolve(__dirname, 'mobile.html'),
                    examples: path.resolve(__dirname, 'examples.html'),
                    buildYours: path.resolve(__dirname, 'build-yours.html'),
                },
            },
        },
    }
})
