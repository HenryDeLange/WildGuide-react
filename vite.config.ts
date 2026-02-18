import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { version } from './package.json';

// https://vite.dev/config/
export default defineConfig({
    define: {
        VITE_APP_VERSION: JSON.stringify(version)
    },
    plugins: [
        tanstackRouter({ // Make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
            target: 'react',
            autoCodeSplitting: true
        }),
        react(),
        svgr(),
        tsconfigPaths(),
        visualizer(),
        compression({
            algorithm: 'brotliCompress',
            ext: '.br'
        }),
        {
            name: 'watch-public-folder',
            configureServer(server) {
                server.watcher.add('public/**');
                server.watcher.on('change', () => {
                    server.ws.send({ type: 'full-reload' });
                });
            }
        },
        VitePWA({
            devOptions: {
                enabled: true
            },
            registerType: 'autoUpdate',
            strategies: 'generateSW',
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
                        urlPattern: /^https:\/\/inaturalist-open-data\.s3\.amazonaws\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'inaturalist-open-data-image-cache',
                            expiration: {
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/static\.inaturalist\.org\/photos\/.*\.(?:png|jpg|svg|gif)$/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'inaturalist-static-image-cache',
                            expiration: {
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/mt\d\.google\.com\/vt\?.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-maps-cache',
                            expiration: {
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /\.(?:png|jpg|svg|gif)$/i,
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'wildguide-image-cache',
                            expiration: {
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https?:\/\/.*\/api\/v1\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'wildguide-api-cache',
                            expiration: {
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/api\.inaturalist\.org\/.*/i,
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'inaturalist-api-cache',
                            expiration: {
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            }
        })
    ],
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
