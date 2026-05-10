import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium leading-5 transition duration-200 ease-out focus:outline-none font-[\'Playfair_Display\',serif] ' +
                (active
                    ? 'border-rice-mutedOlive/60 bg-rice-parchment text-rice-ink shadow-[0_10px_24px_rgba(7,30,24,0.16)]'
                    : 'border-transparent text-rice-ink/70 hover:border-rice-mutedOlive/35 hover:bg-rice-parchment/70 hover:text-rice-ink') +
                className
            }
        >
            {children}
        </Link>
    );
}
