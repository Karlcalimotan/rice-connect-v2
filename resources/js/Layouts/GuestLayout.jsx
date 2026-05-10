import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-rice-deep px-6 py-12 text-rice-ink">
            <div className="mb-6">
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-rice-sideSage" />
                </Link>
            </div>

            <div className="w-full overflow-hidden rounded-[1.75rem] border border-rice-mutedOlive/30 bg-rice-parchment px-6 py-6 shadow-[0_18px_45px_rgba(7,30,24,0.28)] sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
