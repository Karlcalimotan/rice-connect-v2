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
            className={`inline-flex items-center gap-3 rounded-[1.1rem] px-4 py-3 text-sm font-medium leading-5 transition duration-200 ease-out focus:outline-none ${active ? 'rc-nav-link-active text-[#f8eed0]' : 'rc-nav-link text-[#d9ccb1] hover:text-[#fff7e5]'} ${className}`}
            aria-current={active ? 'page' : undefined}
        >
            {children}
        </Link>
    );
}
