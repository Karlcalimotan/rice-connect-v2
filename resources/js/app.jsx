import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Pre-define the glob patterns
const corePages = import.meta.glob('./Pages/**/*.jsx');
const modulePages = import.meta.glob('../../Modules/*/resources/js/Pages/**/*.jsx');

// Merge both into a single map
const allPages = { ...corePages, ...modulePages };

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // Build the path based on convention
        let path;
        if (name.includes('::')) {
            const [module, page] = name.split('::');
            path = `../../Modules/${module}/resources/js/Pages/${page}.jsx`;
        } else {
            path = `./Pages/${name}.jsx`;
        }

        // Use resolvePageComponent with our merged map
        return resolvePageComponent(path, allPages);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#6E8A61',
    },
});
