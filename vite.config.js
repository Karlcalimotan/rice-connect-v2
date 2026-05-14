import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: [
                'resources/routes/**',
                'resources/views/**',
                'Modules/**/resources/views/**',
                'Modules/**/routes/**',
            ],
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            'Modules': path.resolve(__dirname, 'Modules'),
        },
    },
});
