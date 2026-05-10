import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

const Icons = {
    Console: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 36 36" aria-hidden="true"><path d="M18 31V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18 12c-3.2-.2-5.7-1.9-7.4-5 3.7.2 6.4 1.6 7.4 5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 16c-3.5.3-6.3-.9-8.5-3.6 3.7-.5 6.6.3 8.5 3.6Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 20c-3.2.4-5.9-.2-8-2.3 3.5-1 6.1-.8 8 2.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 12c3.1.1 5.6-1.3 7.6-4.2-3.8-.1-6.6 1-7.6 4.2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 16c3.4.5 6.1 0 8.1-1.8-3.5-1.2-6.4-.9-8.1 1.8Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 20c3 .6 5.4.5 7.4-.5-3.1-1.6-5.7-1.8-7.4.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Harvest: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 36 36" aria-hidden="true"><path d="M18 31V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18 14c-4-.4-7.2-2.4-9.4-6.1 4.7.2 8.1 2 9.4 6.1Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 18c-4.3.4-7.8-.6-10.6-3.3 4.5-1 8-.7 10.6 3.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 22c-4 .7-7.2.2-9.8-1.6 4-1.8 7.2-1.7 9.8 1.6Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 14c3.9-.2 7.1-2 9.4-5.4-4.6.1-7.9 1.7-9.4 5.4Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 18c4 .6 7 .2 9.4-1.3-3.9-1.7-7-.9-9.4 1.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 22c3.6.8 6.4.8 8.6 0-3.4-1.4-6.1-1.4-8.6 0Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Market: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 36 36" aria-hidden="true"><path d="M18 30V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18 13c-3.1-.2-5.4-1.8-7.1-4.8 3.5.2 6.1 1.5 7.1 4.8Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 17c-3.4.3-6-.8-8.1-3.3 3.5-.4 6.3.3 8.1 3.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 13c3-.2 5.4-1.5 7.2-4-3.5 0-6 1.2-7.2 4Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 17c3.2.5 5.8.2 7.8-1-3.1-1.4-5.8-1-7.8 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 24h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M14 28h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    Inventory: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 36 36" aria-hidden="true"><path d="M18 30V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18 13c-3-.2-5.2-1.5-6.8-4 3.4.1 5.8 1.3 6.8 4Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 17c-3.2.3-5.7-.5-7.8-2.5 3.4-.7 6-.4 7.8 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 21c-3 .4-5.4.1-7.3-1.1 3-1.3 5.4-1.2 7.3 1.1Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 13c2.9-.1 5.2-1.2 6.9-3.3-3.3-.1-5.7.8-6.9 3.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 17c3 .5 5.3.3 7.2-.6-2.8-1.2-5.2-.8-7.2.6Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 21c2.7.6 4.8.5 6.5-.3-2.5-1.2-4.7-1-6.5.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Orders: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 36 36" aria-hidden="true"><path d="M18 30V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18 14c-3.4-.3-6-1.9-7.7-4.9 3.8.1 6.6 1.4 7.7 4.9Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 18c-3.7.4-6.6-.5-8.9-2.9 3.7-.8 6.6-.5 8.9 2.9Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 22c-3.4.6-6 .3-8-1.2 3.3-1.5 6-1.4 8 1.2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 14c3.3-.2 5.9-1.7 7.8-4.4-3.8 0-6.5 1.2-7.8 4.4Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 18c3.6.5 6.3.1 8.3-1.2-3.4-1.3-6.1-.9-8.3 1.2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Logistics: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 36 36" aria-hidden="true"><path d="M18 31V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18 14c-3.2-.2-5.6-1.7-7.3-4.7 3.6.1 6.2 1.4 7.3 4.7Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 18c-3.5.4-6.3-.5-8.5-2.7 3.5-.8 6.3-.5 8.5 2.7Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 14c3.3-.2 5.7-1.5 7.5-4-3.5.1-6 1.1-7.5 4Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 18c3.4.5 6 .2 8-1-3.2-1.2-5.9-.9-8 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 25c1.8-1 3.7-1.4 5.9-1.4 2.1 0 4.2.4 6.1 1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
    Settings: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 36 36" aria-hidden="true"><path d="M18 30V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18 13c-3.2-.2-5.5-1.6-7-4.4 3.5.1 6 .9 7 4.4Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 17c-3.4.4-6-.5-8.1-2.6 3.4-.8 6.1-.6 8.1 2.6Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 21c-3 .5-5.4.3-7.4-.7 3-1.3 5.5-1.2 7.4.7Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 13c3-.1 5.4-1.2 7.2-3.5-3.3-.1-5.8.8-7.2 3.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 17c3 .5 5.4.3 7.3-.4-2.8-1.2-5.3-1-7.3.4Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 21c2.8.6 5 .6 6.8 0-2.5-1.1-4.7-1.1-6.8 0Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    User: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 36 36" aria-hidden="true"><path d="M18 30V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18 18c-4-.5-7-2.8-8.7-6.9 4.5.2 7.8 1.8 8.7 6.9Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 22c-4.2.5-7.5-.7-10-3.6 4.3-.9 7.7-.4 10 3.6Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 18c4-.4 7-2.3 8.8-5.9-4.4.2-7.7 1.6-8.8 5.9Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 22c4.1.6 7.2.2 9.5-1.1-4-1.8-7.2-1.4-9.5 1.1Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden selection:bg-rice-mutedOlive/30 selection:text-rice-parchment bg-rice-deep text-rice-ink relative font-['Source_Sans_3',sans-serif]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-rice-mutedOlive/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-rice-forest/20 blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(46,139,87,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.12) 1px, transparent 1px)',
                        backgroundSize: '42px 42px',
                    }}
                />
            </div>

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-[#120e0a]/65 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* --- SIDEBAR --- */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-80 
                bg-rice-sideSage border-r border-rice-mutedOlive/20 shadow-[20px_0_100px_rgba(7,30,24,0.32)] 
                transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
                overflow-y-auto no-scrollbar`}
            >
                <div className="flex h-24 items-center justify-between px-8 mb-6 relative border-b border-rice-mutedOlive/10">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-rice-ink/50">Rice Connect</p>
                        <h1 className="font-['Playfair_Display',serif] text-2xl text-rice-ink leading-none">Archive</h1>
                    </div>
                    <button 
                        onClick={() => setIsSidebarOpen(false)} 
                        className="text-rice-ink p-2 lg:hidden"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-6 pb-20 space-y-8 relative">
                    <div
                        className="p-7 rounded-[2rem] relative overflow-hidden"
                        style={{
                            border: '1px solid var(--muted-olive, var(--muted-brown))',
                            boxShadow: '0 18px 50px color-mix(in srgb, var(--sage-accent, #2E8B57) 12%, transparent)',
                            backgroundImage:
                                'radial-gradient(circle at top left, color-mix(in srgb, var(--paper, #fff) 14%, transparent), transparent 32%), linear-gradient(145deg, var(--paper, #F5F3EC), var(--sage, #DCEDE4))',
                        }}
                    >
                            <p className="text-[10px] font-black text-rice-ink/50 uppercase tracking-[0.42em] mb-2 leading-none">System Core</p>
                            <p className="font-['Playfair_Display',serif] text-2xl text-rice-ink leading-none tracking-tight">RiceConnect v2</p>
                            <p className="text-[10px] text-rice-forest font-bold mt-3 border-t border-rice-mutedOlive/15 pt-3 capitalize">{user?.role} Module</p>
                    </div>

                    <nav className="space-y-8">
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-rice-ink/40 uppercase px-4 tracking-[0.5em] mb-4">Operations Hub</p>
                            
                            {user.role === 'farmer' && (
                                <>
                                    <NavLink href={route('farmer.harvest')} active={route().current('farmer.harvest')} onClick={handleNavClick}>
                                        <Icons.Console /> <span>Harvest Logs</span>
                                    </NavLink>
                                    <NavLink href={route('farmer.offers')} active={route().current('farmer.offers')} onClick={handleNavClick}>
                                        <Icons.Market /> <span>Offers Handshake</span>
                                    </NavLink>
                                </>
                            )}

                            {user.role === 'miller' && (
                                <>
                                    <NavLink href={route('miller.marketplace')} active={route().current('miller.marketplace')} onClick={handleNavClick}>
                                        <Icons.Market /> <span>Marketplace</span>
                                    </NavLink>
                                    <NavLink href={route('miller.inventory')} active={route().current('miller.inventory')} onClick={handleNavClick}>
                                        <Icons.Inventory /> <span>Palay Inventory</span>
                                    </NavLink>
                                    <NavLink href={route('miller.processed_inventory')} active={route().current('miller.processed_inventory')} onClick={handleNavClick}>
                                        <Icons.Inventory /> <span>Rice Stock</span>
                                    </NavLink>
                                    <NavLink href={route('miller.orders')} active={route().current('miller.orders')} onClick={handleNavClick}>
                                        <Icons.Orders /> <span>Retailer Orders</span>
                                    </NavLink>
                                    <NavLink href={route('miller.transport')} active={route().current('miller.transport')} onClick={handleNavClick}>
                                        <Icons.Logistics /> <span>Logistics Hub</span>
                                    </NavLink>
                                </>
                            )}

                            {user.role === 'retailer' && (
                                <>
                                    <NavLink href={route('retailer.marketplace')} active={route().current('retailer.marketplace')} onClick={handleNavClick}>
                                        <Icons.Market /> <span>Browse Rice</span>
                                    </NavLink>
                                    <NavLink href={route('retailer.orders')} active={route().current('retailer.orders')} onClick={handleNavClick}>
                                        import Dropdown from '@/Components/Dropdown';
                                        import { Link, usePage } from '@inertiajs/react';
                                        import { useMemo, useState } from 'react';

                                        const MenuIcons = {
                                            dashboard: () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 11.5h8.5V3H3v8.5Zm9.5 0H21V3h-8.5v8.5ZM3 21h8.5v-7.5H3V21Zm9.5 0H21v-7.5h-8.5V21Z" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round"/></svg>,
                                            inventory: () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M7 7v14m10-14v14M5 7l1-3h12l1 3" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                                            orders: () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5h14l-1 14H6L5 5Z" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round"/><path d="M9 9h6M8 13h8" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round"/></svg>,
                                            analytics: () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19h16" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round"/><path d="M7 16V11M12 16V7M17 16v-5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round"/></svg>,
                                            marketplace: () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10h16l-1.5 10h-13L4 10Z" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round"/><path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round"/><path d="M9 13h.01M15 13h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
                                            settings: () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10.6 3.8h2.8l.5 1.8a6.8 6.8 0 0 1 1.7.7l1.7-.9 2 2-1 1.7c.3.5.5 1.1.7 1.7l1.8.5v2.8l-1.8.5a6.8 6.8 0 0 1-.7 1.7l1 1.7-2 2-1.7-1a6.8 6.8 0 0 1-1.7.7l-.5 1.8h-2.8l-.5-1.8a6.8 6.8 0 0 1-1.7-.7l-1.7 1-2-2 1-1.7a6.8 6.8 0 0 1-.7-1.7L4 13.3v-2.8l1.8-.5a6.8 6.8 0 0 1 .7-1.7l-1-1.7 2-2 1.7.9a6.8 6.8 0 0 1 1.7-.7l.5-1.8Zm1.4 5.7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/></svg>,
                                        };

                                        const buildMenu = (role) => {
                                            const maps = {
                                                farmer: [
                                                    { label: 'Dashboard', href: route('dashboard'), active: 'dashboard', icon: 'dashboard' },
                                                    { label: 'Inventory', href: route('farmer.harvest'), active: 'farmer.harvest', icon: 'inventory' },
                                                    { label: 'Orders', href: route('farmer.offers'), active: 'farmer.offers', icon: 'orders' },
                                                    { label: 'Analytics', href: route('dashboard'), active: 'dashboard', icon: 'analytics' },
                                                    { label: 'Marketplace', href: route('farmer.offers'), active: 'farmer.offers', icon: 'marketplace' },
                                                ],
                                                miller: [
                                                    { label: 'Dashboard', href: route('dashboard'), active: 'dashboard', icon: 'dashboard' },
                                                    { label: 'Inventory', href: route('miller.inventory'), active: 'miller.inventory', icon: 'inventory' },
                                                    { label: 'Orders', href: route('miller.orders'), active: 'miller.orders', icon: 'orders' },
                                                    { label: 'Analytics', href: route('miller.processed_inventory'), active: 'miller.processed_inventory', icon: 'analytics' },
                                                    { label: 'Marketplace', href: route('miller.marketplace'), active: 'miller.marketplace', icon: 'marketplace' },
                                                    { label: 'Settings', href: route('miller.shipping_settings'), active: 'miller.shipping_settings', icon: 'settings' },
                                                ],
                                                retailer: [
                                                    { label: 'Dashboard', href: route('dashboard'), active: 'dashboard', icon: 'dashboard' },
                                                    { label: 'Inventory', href: route('retailer.purchases'), active: 'retailer.purchases', icon: 'inventory' },
                                                    { label: 'Orders', href: route('retailer.orders'), active: 'retailer.orders', icon: 'orders' },
                                                    { label: 'Analytics', href: route('retailer.purchases'), active: 'retailer.purchases', icon: 'analytics' },
                                                    { label: 'Marketplace', href: route('retailer.marketplace'), active: 'retailer.marketplace', icon: 'marketplace' },
                                                ],
                                                driver: [
                                                    { label: 'Dashboard', href: route('driver.dashboard'), active: 'driver.dashboard', icon: 'dashboard' },
                                                    { label: 'Inventory', href: route('driver.dashboard'), active: 'driver.dashboard', icon: 'inventory' },
                                                    { label: 'Orders', href: route('driver.dashboard'), active: 'driver.dashboard', icon: 'orders' },
                                                    { label: 'Analytics', href: route('driver.dashboard'), active: 'driver.dashboard', icon: 'analytics' },
                                                    { label: 'Marketplace', href: route('driver.dashboard'), active: 'driver.dashboard', icon: 'marketplace' },
                                                ],
                                                admin: [
                                                    { label: 'Dashboard', href: '/admin/dashboard', activePath: '/admin/dashboard', icon: 'dashboard' },
                                                    { label: 'Inventory', href: '/admin/municipalities', activePath: '/admin/municipalities', icon: 'inventory' },
                                                    { label: 'Orders', href: '/admin/dashboard', activePath: '/admin/dashboard', icon: 'orders' },
                                                    { label: 'Analytics', href: '/admin/dashboard', activePath: '/admin/dashboard', icon: 'analytics' },
                                                    { label: 'Marketplace', href: '/admin/dashboard', activePath: '/admin/dashboard', icon: 'marketplace' },
                                                ],
                                            };

                                            return maps[role] ?? maps.farmer;
                                        };

                                        function RiceEmblem() {
                                            return (
                                                <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className="h-8 w-8">
                                                    <path d="M20 35V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                                    <path d="M20 13c-3.5-.2-6.2-2.2-8-5.9 4.2.2 7.2 1.8 8 5.9Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M20 17c-3.8.3-6.8-.8-9.2-3.8 4-.5 7.2.2 9.2 3.8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M20 21c-3.6.4-6.3-.4-8.5-2.5 3.8-.9 6.7-.6 8.5 2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M20 13c3.4.1 6-1.4 8.1-4.4-4-.1-6.9 1-8.1 4.4Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M20 17c3.6.5 6.3 0 8.3-1.9-3.5-1.2-6.5-.8-8.3 1.9Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M20 21c3.2.7 5.7.6 7.8-.4-3.2-1.6-5.7-1.8-7.8.4Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            );
                                        }

                                        function MenuLink({ item, active, onClick }) {
                                            const Icon = MenuIcons[item.icon];

                                            return (
                                                <Link
                                                    href={item.href}
                                                    onClick={onClick}
                                                    className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition duration-200 ease-out ${
                                                        active
                                                            ? 'border-rice-mutedOlive/40 bg-rice-parchment text-rice-ink shadow-[0_10px_24px_rgba(7,30,24,0.12)]'
                                                            : 'border-transparent text-rice-ink/75 hover:border-rice-mutedOlive/20 hover:bg-rice-parchment/60 hover:text-rice-ink'
                                                    }`}
                                                >
                                                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl border ${active ? 'border-rice-mutedOlive/35 bg-rice-sideSage' : 'border-rice-mutedOlive/20 bg-rice-parchment/90'}`}>
                                                        <Icon />
                                                    </span>
                                                    <span className="font-['Playfair_Display',serif] text-[15px] tracking-wide">{item.label}</span>
                                                </Link>
                                            );
                                        }

                                        export default function AuthenticatedLayout({ header, children }) {
                                            const { auth } = usePage().props;
                                            const user = auth.user;
                                            const [isSidebarOpen, setIsSidebarOpen] = useState(false);
                                            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
                                            const navItems = useMemo(() => buildMenu(user?.role), [user?.role]);

                                            const closeSidebar = () => {
                                                if (window.innerWidth < 1024) {
                                                    setIsSidebarOpen(false);
                                                }
                                            };

                                            return (
                                                <div className="min-h-screen overflow-hidden bg-rice-deep text-rice-ink selection:bg-rice-mutedOlive/30 selection:text-rice-parchment">
                                                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                                                        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-rice-mutedOlive/10 blur-3xl" />
                                                        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-rice-forest/18 blur-3xl" />
                                                        <div
                                                            className="absolute inset-0 opacity-[0.08]"
                                                            style={{
                                                                backgroundImage:
                                                                    'linear-gradient(rgba(46,139,87,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.12) 1px, transparent 1px)',
                                                                backgroundSize: '44px 44px',
                                                            }}
                                                        />
                                                    </div>

                                                    {isSidebarOpen && (
                                                        <div
                                                            className="fixed inset-0 z-40 bg-rice-deep/70 lg:hidden"
                                                            onClick={() => setIsSidebarOpen(false)}
                                                        />
                                                    )}

                                                    <aside
                                                        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-rice-mutedOlive/20 bg-rice-sideSage shadow-[18px_0_50px_rgba(7,30,24,0.22)] transition-transform duration-500 ease-out ${
                                                            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-4 border-b border-rice-mutedOlive/18 px-6 py-6">
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rice-mutedOlive/30 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),rgba(220,237,228,0.9))] text-rice-forest shadow-[0_8px_18px_rgba(7,30,24,0.08)]">
                                                                <RiceEmblem />
                                                            </div>
                                                            <div>
                                                                <p className="font-['Playfair_Display',serif] text-xl text-rice-ink">Rice Connect</p>
                                                                <p className="text-[10px] uppercase tracking-[0.45em] text-rice-ink/55">Archive Ledger</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsSidebarOpen(false)}
                                                                className="ml-auto rounded-full border border-rice-mutedOlive/20 px-2 py-1 text-rice-ink lg:hidden"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>

                                                        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5 no-scrollbar">
                                                            {navItems.map((item) => {
                                                                const active = item.activePath
                                                                    ? currentPath === item.activePath
                                                                    : route().current(item.active);

                                                                return <MenuLink key={item.label} item={item} active={active} onClick={closeSidebar} />;
                                                            })}
                                                        </nav>

                                                        <div className="border-t border-rice-mutedOlive/18 p-4">
                                                            <Link
                                                                href={route('profile.edit')}
                                                                className="flex items-center gap-3 rounded-2xl border border-rice-mutedOlive/20 bg-rice-parchment px-4 py-3 text-rice-ink transition hover:bg-rice-parchment/80"
                                                            >
                                                                <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-rice-mutedOlive/20 bg-rice-sideSage">
                                                                    <MenuIcons.settings />
                                                                </span>
                                                                <span className="font-['Playfair_Display',serif] text-[15px] tracking-wide">Settings</span>
                                                            </Link>
                                                        </div>
                                                    </aside>

                                                    <div className="relative lg:pl-[260px]">
                                                        <header className="sticky top-0 z-40 border-b border-rice-forest/45 bg-rice-forest/96 backdrop-blur-sm">
                                                            <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
                                                                <div className="flex items-center gap-4">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setIsSidebarOpen((open) => !open)}
                                                                        className="rounded-2xl border border-rice-mutedOlive/30 bg-rice-sideSage px-3 py-3 text-rice-ink shadow-[0_10px_20px_rgba(7,30,24,0.16)] lg:hidden"
                                                                    >
                                                                        ☰
                                                                    </button>
                                                                    <div>
                                                                        <h2 className="font-['Playfair_Display',serif] text-[13px] uppercase tracking-[0.45em] text-rice-parchment/70">Rice Connect</h2>
                                                                        <h1 className="font-['Playfair_Display',serif] text-3xl text-rice-parchment lg:text-[2.35rem]">{header || 'Dashboard'}</h1>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-4 text-rice-parchment">
                                                                    <button className="rounded-full border border-rice-mutedOlive/25 p-2.5 transition hover:bg-rice-parchment/10" aria-label="Notifications">
                                                                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 4a5 5 0 0 0-5 5v3.5l-1.5 2V16h13V14.5l-1.5-2V9a5 5 0 0 0-5-5Z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round"/><path d="M10 17a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/></svg>
                                                                    </button>
                                                                    <button className="rounded-full border border-rice-mutedOlive/25 p-2.5 transition hover:bg-rice-parchment/10" aria-label="Settings">
                                                                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" stroke="currentColor" strokeWidth="1.35"/><path d="M4.5 12h2m11 0h2M12 4.5v2m0 11v2M7 7l1.4 1.4m7.6 7.6L17 17M7 17l1.4-1.4m7.6-7.6L17 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                                                                    </button>

                                                                    <Dropdown>
                                                                        <Dropdown.Trigger>
                                                                            <button className="flex items-center gap-3 rounded-full border border-rice-mutedOlive/25 bg-rice-parchment/10 px-2 py-1.5 text-left transition hover:bg-rice-parchment/15">
                                                                                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-rice-mutedOlive/30 bg-[radial-gradient(circle_at_30%_30%,rgba(255,250,238,0.95),rgba(181,156,115,0.55),rgba(59,42,29,0.9))] text-rice-parchment shadow-[0_8px_18px_rgba(7,30,24,0.22)]">
                                                                                    <span className="font-['Playfair_Display',serif] text-sm">
                                                                                        {user?.first_name?.[0] ?? 'R'}{user?.last_name?.[0] ?? 'C'}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="hidden min-w-0 md:block">
                                                                                    <p className="truncate font-['Playfair_Display',serif] text-[15px] text-rice-parchment">{user?.first_name ?? 'User'} Profile</p>
                                                                                    <p className="truncate text-[10px] uppercase tracking-[0.32em] text-rice-parchment/65">{user?.role ?? 'Member'} avatar</p>
                                                                                </div>
                                                                                <span className="px-1 text-rice-parchment/75">⌄</span>
                                                                            </button>
                                                                        </Dropdown.Trigger>
                                                                        <Dropdown.Content>
                                                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                                                            <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                                                        </Dropdown.Content>
                                                                    </Dropdown>
                                                                </div>
                                                            </div>
                                                        </header>

                                                        <main className="min-h-[calc(100vh-73px)] px-5 py-6 lg:px-8 lg:py-8" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.02), transparent 24%), linear-gradient(180deg, var(--bg-forest, #0b3a2e) 0%, color-mix(in srgb, var(--bg-forest, #0b3a2e) 72%, var(--paper, #F5F3EC) 28%) 100%)' }}>
                                                            <div className="mx-auto max-w-[1440px]">
                                                                {children}
                                                            </div>
                                                        </main>
                                                    </div>
                                                </div>
                                            );
                                        }
