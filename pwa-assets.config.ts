import { defineConfig } from '@vite-pwa/assets-generator/config';

export default defineConfig({
    headLinkOptions: {
        preset: '2023'
    },
    preset: 'minimal-2023',
    images: ['public/logo.png']
});
