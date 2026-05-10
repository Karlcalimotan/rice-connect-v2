import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                rice: {
                    deep: 'var(--bg-forest)',
                    forest: 'var(--bg-forest)',
                    darkMoss: 'var(--sage-accent)',
                    sideSage: 'var(--sage)',
                    paleMoss: 'var(--pale-moss, var(--paper))',
                    parchment: 'var(--paper)',
                    mutedOlive: 'var(--muted-brown)',
                    ink: 'var(--text-dark)'
                }
            }
        },
    },

    plugins: [forms],
};
