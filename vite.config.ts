import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { version } from './package.json';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            manifest: {
                name: 'WildGuide',
                short_name: 'WildGuide',
                description: 'Online field guide, integrated with iNaturalist.',
                theme_color: '#95A83B',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ],
                screenshots: [
                    {
                        src: 'pwa/screenshot-small.jpg',
                        sizes: '459x320',
                        type: 'image/png',
                        label: 'WildGuide'
                    },
                    {
                        src: 'pwa/screenshot-large.jpg',
                        sizes: '1296x904',
                        type: 'image/png',
                        label: 'WildGuide',
                        form_factor: 'wide'
                    }
                ],
                background_color: '#6E6F25',
                display: 'standalone',
                launch_handler: {
                    client_mode: [
                        'focus-existing',
                        'auto'
                    ]
                }
            },
            workbox: {
                runtimeCaching: [
                    {
                        // @ts-expect-error: assume it will be fine...
                        urlPattern: ({ url }) => url.pathname.startsWith('/api/v1'),
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            }
        }),
        TanStackRouterVite(),
        tsconfigPaths(),
        visualizer()
    ],
    define: {
        VITE_APP_VERSION: JSON.stringify(version)
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    react: [
                        'react',
                        'react-dom'
                    ],
                    redux: [
                        'redux',
                        'react-redux',
                        '@reduxjs/toolkit',
                        'async-mutex'
                    ],
                    ui: [
                        '@chakra-ui/react',
                        '@emotion/react',
                        '@emotion/styled',
                        'next-themes'
                    ],
                    router: [
                        '@tanstack/react-router',
                        '@tanstack/react-virtual',
                        '@tanstack/router'
                    ],
                    i18n: [
                        'i18next',
                        'i18next-browser-languagedetector',
                        'react-i18next'
                    ],
                    leaflet: [
                        'leaflet',
                        'react-leaflet',
                        'leaflet.locatecontrol'
                    ]
                }
            }
        }
    }
});
