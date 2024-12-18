import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
        visualizer()
    ],
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