import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import { fileURLToPath, URL } from 'url'
import path from 'path'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
    plugins: [tsconfigPaths(), react(), svgr()],
    resolve: {
        alias: [
            { find: '@', replacement: path.join(rootDir, 'src') },
        ],
    },
    clearScreen: false,
    server: {
        port: 3333,
        strictPort: true,
    },
    envPrefix: ['VITE_', 'TAURI_'],
    build: {
        target: ['es2015', 'safari11'],
        minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
        sourcemap: !!process.env.TAURI_DEBUG,
        rollupOptions: {
            input: [
                path.join(rootDir, 'src', 'tauri', 'dummy.html'),
                path.join(rootDir, 'src', 'tauri', 'index.html'),
            ],
            output: {
                dir: path.join(rootDir, 'dist', 'tauri'),
            },
        },
    },
})
