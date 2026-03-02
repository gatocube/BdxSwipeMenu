import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
    plugins: [
        react(),
        dts({
            tsconfigPath: path.resolve(__dirname, 'tsconfig.build.json'),
            entryRoot: path.resolve(__dirname, 'src'),
            insertTypesEntry: true,
        }),
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'BdxSwipeMenu',
            fileName: () => 'index.js',
            formats: ['es'],
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                'framer-motion',
            ],
        },
    },
})
