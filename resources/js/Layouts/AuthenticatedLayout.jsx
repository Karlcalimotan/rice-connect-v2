import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
// Scoped Rice Connect theme for authenticated pages (excludes landing)
import '../../css/rc-theme.css';

const Icons = {
    Console: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="1.8" /><path d="M3 9h18" strokeWidth="1.8" /><path d="M9 21V9" strokeWidth="1.8" /></svg>,
    Harvest: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6.5 20.5c2.2-1.7 3.9-4.4 5-8.2C12.6 8.4 14.4 5.7 17 4" strokeWidth="1.8" /><path d="M10 14.5c1.9.4 3.7.1 5.5-1" strokeWidth="1.8" /><path d="M8.8 11.2c1.8.2 3.2-.2 4.3-1.2" strokeWidth="1.8" /></svg>,
    Market: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 7.5h16l-1.3 11H5.3L4 7.5Z" strokeWidth="1.8" /><path d="M9 7.5a3 3 0 0 1 6 0" strokeWidth="1.8" /><path d="M12 9.5v6" strokeWidth="1.8" /></svg>,
    Inventory: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3.5" y="4" width="17" height="16" rx="2.5" strokeWidth="1.8" /><path d="M3.5 9.5h17M3.5 15h17" strokeWidth="1.8" /><path d="M9.5 4v16M14.5 4v16" strokeWidth="1.8" /></svg>,
    Orders: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M7 12.5l2.8 2.7L17 8.8" strokeWidth="1.8" /><path d="M4 4.5h16L18.5 20h-13L4 4.5Z" strokeWidth="1.8" /></svg>,
    Logistics: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3.5 10 12 4l8.5 6v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-9Z" strokeWidth="1.8" /><path d="M9.5 21V12h5v9" strokeWidth="1.8" /></svg>,
    Settings: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" strokeWidth="1.8" /><path d="M19 12a7.1 7.1 0 0 0-.1-1.2l2-1.6-2-3.5-2.4 1a7.7 7.7 0 0 0-2.1-1.2L14 3h-4l-.4 2.5c-.8.3-1.5.6-2.1 1.2l-2.4-1-2 3.5 2 1.6A7.1 7.1 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.5 2.4-1c.6.5 1.3.9 2.1 1.2L10 21h4l.4-2.5c.8-.3 1.5-.6 2.1-1.2l2.4 1 2-3.5-2-1.6c.1-.4.1-.8.1-1.2Z" strokeWidth="1.4" /></svg>,
    User: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="1.8" /><circle cx="12" cy="7.5" r="3.5" strokeWidth="1.8" /></svg>,
};

export default function AuthenticatedLayout({ header, children }) {
    const { user, notifications = [] } = usePage().props.auth;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.trim() || 'RC';

    const sidebarIcons = {
        Analytics: () => (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path strokeWidth="1.8" d="M3 3v18h18" />
                <path strokeWidth="1.8" d="M7 14l3-3 3 2 4-6" />
            </svg>
        ),
    };

    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="rc-theme h-screen relative flex overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(18,56,46,0.14),transparent_34%),radial-gradient(circle_at_90%_8%,rgba(195,161,83,0.14),transparent_24%),linear-gradient(180deg,#f7f0df_0%,#eadbb8_100%)] text-[#1d1a16] selection:bg-[#c3a153] selection:text-[#0b241d] font-['Libre_Baskerville',serif]">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-[#061510]/55 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-80 rc-sidebar-shell shadow-[24px_0_90px_rgba(7,20,16,0.32)] transform transition-transform duration-500 ease-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} overflow-y-auto no-scrollbar`}
            >
                <div className="px-6 pt-6">
                    <div className="flex items-center justify-between rounded-[1.75rem] border border-[#c3a153]/20 bg-[rgba(255,248,230,0.04)] px-5 py-4">
                        <div className="flex items-center gap-4">
                            <ApplicationLogo className="h-12 w-12 fill-current text-[#d8bd73]" />
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.5em] text-[#d9c6a0]">Rice Connect</p>
                                <h1 className="mt-1 font-['Playfair_Display',serif] text-2xl text-[#f6ecd1]">Archive Console</h1>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="rounded-full border border-white/10 p-2 text-[#f4e7c8] transition hover:bg-white/5 lg:hidden"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="px-6 pb-10 pt-6 space-y-6">
                    <div className="rc-sidebar-panel relative overflow-hidden rounded-[2rem] p-6 text-[#f7efd8]">
                        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#c3a153]/10 blur-2xl" />
                        <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#d9c6a0]">System Core</p>
                        <p className="mt-2 font-['Playfair_Display',serif] text-2xl leading-tight text-white">RiceConnect v2</p>
                        <p className="mt-4 border-t border-white/10 pt-3 text-[10px] font-bold uppercase tracking-[0.35em] text-[#c3a153] capitalize">{user.role} Module</p>
                    </div>

                    <nav className="space-y-8" aria-label="Primary">
                        <div>
                            <p className="px-4 text-[10px] font-black uppercase tracking-[0.5em] text-[#d9c6a0]">Operations Hub</p>
                            <ul className="mt-4 space-y-2">
                                {user.role === 'farmer' && (
                                    <>
                                        <li>
                                            <NavLink href={route('analytics.farmer')} active={route().current('analytics.farmer')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]">{sidebarIcons.Analytics()}</span>
                                                <span>Analytics</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink href={route('farmer.harvest')} active={route().current('farmer.harvest')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.Console /></span>
                                                <span>Harvest Logs</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink href={route('farmer.offers')} active={route().current('farmer.offers')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.Orders /></span>
                                                <span>Handshake Offers</span>
                                            </NavLink>
                                        </li>
                                    </>
                                )}

                                {user.role === 'miller' && (
                                    <>
                                        <li>
                                            <NavLink href={route('analytics.miller')} active={route().current('analytics.miller')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]">{sidebarIcons.Analytics()}</span>
                                                <span>Analytics</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink href={route('miller.marketplace')} active={route().current('miller.marketplace')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.Market /></span>
                                                <span>Marketplace</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink href={route('miller.inventory')} active={route().current('miller.inventory')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.Inventory /></span>
                                                <span>Palay Inventory</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink href={route('miller.processed_inventory')} active={route().current('miller.processed_inventory')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.Inventory /></span>
                                                <span>Rice Stock</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink href={route('miller.orders')} active={route().current('miller.orders')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.Orders /></span>
                                                <span>Retailer Orders</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink href={route('miller.transport')} active={route().current('miller.transport')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.Logistics /></span>
                                                <span>Logistics Hub</span>
                                            </NavLink>
                                        </li>
                                    </>
                                )}

                                {user.role === 'retailer' && (
                                    <>
                                        <li>
                                            <NavLink href={route('analytics.retailer')} active={route().current('analytics.retailer')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]">{sidebarIcons.Analytics()}</span>
                                                <span>Analytics</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink href={route('retailer.marketplace')} active={route().current('retailer.marketplace')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.Market /></span>
                                                <span>Browse Rice</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink href={route('retailer.orders')} active={route().current('retailer.orders')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.Orders /></span>
                                                <span>My Orders</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink href={route('retailer.purchases')} active={route().current('retailer.purchases')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.Inventory /></span>
                                                <span>Purchases History</span>
                                            </NavLink>
                                        </li>
                                    </>
                                )}

                                {user.role === 'driver' && (
                                    <li>
                                        <NavLink href={route('driver.dashboard')} active={route().current('driver.dashboard')} onClick={handleNavClick} className="w-full">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.Logistics /></span>
                                            <span>Dashboard</span>
                                        </NavLink>
                                    </li>
                                )}

                                {user.role === 'admin' && (
                                    <>
                                        <li>
                                            <NavLink href={route('admin.analytics')} active={route().current('admin.analytics')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]">{sidebarIcons.Analytics()}</span>
                                                <span>Analytics</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.Console /></span>
                                                <span>Dashboard</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink href={route('admin.municipalities.index')} active={route().current('admin.municipalities.index')} onClick={handleNavClick} className="w-full">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.Logistics /></span>
                                                <span>Geography</span>
                                            </NavLink>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>

                        <div>
                            <p className="px-4 text-[10px] font-black uppercase tracking-[0.5em] text-[#d9c6a0]">Identity</p>
                            <ul className="mt-4 space-y-2">
                                {user.role === 'miller' && (
                                    <li>
                                        <NavLink href={route('miller.shipping_settings')} active={route().current('miller.shipping_settings')} onClick={handleNavClick} className="w-full">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.Settings /></span>
                                            <span>Logistics Settings</span>
                                        </NavLink>
                                    </li>
                                )}
                                <li>
                                    <NavLink href={route('profile.edit')} active={route().current('profile.edit')} onClick={handleNavClick} className="w-full">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#c3a153]/20 bg-white/5 text-[#d8bd73]"><Icons.User /></span>
                                        <span>My Profile</span>
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col relative lg:ml-80 h-screen overflow-hidden">
                <header className="sticky top-0 z-40 border-b border-[#c3a153]/18 bg-[rgba(247,240,223,0.82)] px-6 py-5 shadow-[0_16px_42px_rgba(39,28,16,0.08)] backdrop-blur-xl lg:px-12">
                    <nav className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="rounded-2xl border border-[#c3a153]/20 bg-[rgba(255,248,230,0.8)] p-3 text-[#163329] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:hidden"
                            >
                                ☰
                            </button>
                            <div className="hidden flex-col lg:flex">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#355748]">Authenticated</h2>
                                <h1 className="mt-1 font-['Playfair_Display',serif] text-3xl font-semibold tracking-tight text-[#17362b]">{header || 'Platform'}</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Notification Dropdown (Exclude Admin) */}
                            {user.role !== 'admin' && (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="relative flex h-11 w-11 items-center justify-center rounded-[1.1rem] border border-[#c3a153]/20 bg-[rgba(255,248,230,0.86)] text-[#103227] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                                            </svg>
                                            {notifications.length > 0 && (
                                                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow-sm ring-2 ring-[#f7f0df]">
                                                    {notifications.length}
                                                </span>
                                            )}
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content width="80" align="right">
                                        <div className="px-4 py-3 border-b border-[#c3a153]/10 bg-[rgba(255,248,230,0.05)]">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d9c6a0]">Notifications</p>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                                            {notifications.length === 0 ? (
                                                <div className="px-4 py-6 text-center text-xs font-semibold text-[#8a723e] italic">
                                                    No new notifications
                                                </div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <button
                                                        key={notif.id}
                                                        onClick={() => {
                                                            router.post(route('notifications.mark_as_read', notif.id), {}, {
                                                                preserveScroll: true,
                                                                onSuccess: () => {
                                                                    if (notif.data.action_url) {
                                                                        router.visit(notif.data.action_url);
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                        className="w-full text-left px-4 py-3 border-b border-[#c3a153]/10 hover:bg-[#c3a153]/10 transition flex flex-col gap-1"
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#c3a153]">
                                                                {notif.data.title || 'Notification'}
                                                            </span>
                                                            <span className="text-[8px] font-bold text-[#8a723e]">
                                                                {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-[#2c2211] font-semibold leading-relaxed">
                                                            {notif.data.message}
                                                        </p>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>
                            )}

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-3 rounded-[1.5rem] border border-[#c3a153]/20 bg-[rgba(255,248,230,0.86)] px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] bg-[#103227] text-sm font-black text-[#f6ecd1]">
                                            {initials}
                                        </div>
                                        <div className="hidden pr-3 text-left md:block">
                                            <p className="text-xs font-black leading-none text-[#17362b]">{user.first_name}</p>
                                            <p className="mt-1 text-[9px] font-bold uppercase leading-none tracking-[0.35em] text-[#6f5b2b]">{user.role}</p>
                                        </div>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </nav>
                </header>

                <main className="flex-1 overflow-y-auto no-scrollbar bg-[radial-gradient(circle_at_top,rgba(18,56,46,0.06),transparent_42%),linear-gradient(180deg,rgba(247,240,223,0.88),rgba(236,224,192,0.98))] px-6 py-8 lg:px-12 lg:py-10">
                    <div className="mx-auto max-w-7xl pb-10">
                        {header && (
                            <div className="mb-6 lg:hidden">
                                {header}
                            </div>
                        )}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
