import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { version } from './package.json';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        TanStackRouterVite(),
        tsconfigPaths(),
        visualizer()
    ],
    define: {
        VITE_APP_VERSION: JSON.stringify(version)
    }
    // build: {
    //     rollupOptions: {
    //         output: {
    //             manualChunks: {
    //                 react: [
    //                     'react',
    //                     'react-dom'
    //                 ],
    //             }
    //         }
    //     }
    // },
    // appType: 'mpa'
});
