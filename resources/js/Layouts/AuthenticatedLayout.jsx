import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const Icons = {
    Console: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="2"/><path d="M3 9h18" strokeWidth="2"/><path d="M9 21V9" strokeWidth="2"/></svg>,
    Harvest: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 20l3-7-3-7" strokeWidth="2"/><path d="M13 20l3-7-3-7" strokeWidth="2"/><path d="M19 20l3-7-3-7" strokeWidth="2"/></svg>,
    Market: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 3h18l-1 12H4L3 3z" strokeWidth="2"/><circle cx="9" cy="20" r="1" strokeWidth="2"/><circle cx="15" cy="20" r="1" strokeWidth="2"/><path d="M12 3v12" strokeWidth="2"/></svg>,
    Inventory: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/><path d="M3 9h18M3 15h18" strokeWidth="2"/><path d="M9 3v18M15 3v18" strokeWidth="2"/></svg>,
    Orders: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" strokeWidth="2"/><path d="M3 3h18l-1 18H4L3 3z" strokeWidth="2"/></svg>,
    Logistics: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth="2"/><path d="M9 22V12h6v10" strokeWidth="2"/></svg>,
    Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="2"/></svg>,
    User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2"/><circle cx="12" cy="7" r="4" strokeWidth="2"/></svg>,
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
        <div className="h-screen flex overflow-hidden selection:bg-emerald-200 selection:text-emerald-900 bg-gray-50 relative font-['Plus_Jakarta_Sans',sans-serif]">
            
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-[#042e24]/40 backdrop-blur-3xl z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* --- SIDEBAR --- */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-80 
                bg-white border-r border-gray-100 shadow-[20px_0_100px_rgba(6,95,70,0.05)] 
                transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
                overflow-y-auto no-scrollbar`}
            >
                <div className="flex h-24 items-center justify-between px-8 mb-6 relative">
                    <ApplicationLogo className="scale-110 origin-left" />
                    <button 
                        onClick={() => setIsSidebarOpen(false)} 
                        className="text-emerald-900 p-2 lg:hidden"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-6 pb-20 space-y-8 relative">
                    <div className="p-8 bg-[#064e3b] rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                        <p className="text-[10px] font-black text-emerald-100/40 uppercase tracking-[0.4em] mb-2 leading-none">System Core</p>
                        <p className="text-2xl font-extrabold text-white leading-none tracking-tighter">RiceConnect v2</p>
                        <p className="text-[10px] text-emerald-400 font-bold mt-3 border-t border-white/10 pt-3 capitalize">{user.role} Module</p>
                    </div>

                    <nav className="space-y-8">
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-emerald-950/20 uppercase px-4 tracking-[0.5em] mb-4">Operations Hub</p>
                            
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
                                        <Icons.Orders /> <span>My Orders</span>
                                    </NavLink>
                                    <NavLink href={route('retailer.purchases')} active={route().current('retailer.purchases')} onClick={handleNavClick}>
                                        <Icons.Inventory /> <span>Purchases History</span>
                                    </NavLink>
                                </>
                            )}

                            {user.role === 'driver' && (
                                <NavLink href={route('driver.dashboard')} active={route().current('driver.dashboard')} onClick={handleNavClick}>
                                    <Icons.Logistics /> <span>Operations</span>
                                </NavLink>
                            )}

                            {user.role === 'admin' && (
                                <>
                                    <a href="/admin/dashboard" className="nav-link-v2">
                                        <Icons.Console /> <span>Admin Hub</span>
                                    </a>
                                    <a href="/admin/municipalities" className="nav-link-v2">
                                        <Icons.Logistics /> <span>Geography</span>
                                    </a>
                                </>
                            )}
                        </div>

                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-emerald-950/20 uppercase px-4 tracking-[0.5em] mb-4">Identity</p>
                            
                            {user.role === 'miller' && (
                                <NavLink href={route('miller.shipping_settings')} active={route().current('miller.shipping_settings')} onClick={handleNavClick}>
                                    <Icons.Settings /> <span>Logistics Settings</span>
                                </NavLink>
                            )}
                            
                            <NavLink href={route('profile.edit')} active={route().current('profile.edit')} onClick={handleNavClick}>
                                <Icons.User /> <span>My Profile</span>
                            </NavLink>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col min-w-0 relative lg:ml-80">
                <header className="sticky top-0 z-40 px-6 py-6 lg:px-12 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-10">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="lg:hidden p-3 rounded-2xl bg-white shadow-sm border border-gray-100"
                            >
                                ☰
                            </button>
                            <div className="hidden lg:flex flex-col">
                                <h2 className="text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.4em] mb-1">Authenticated</h2>
                                <h1 className="text-2xl font-extrabold text-emerald-950 tracking-tighter leading-none">{header || 'Platform'}</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-3 p-2 rounded-full bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                        <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-white font-black text-xs">
                                            {user.first_name[0]}{user.last_name[0]}
                                        </div>
                                        <div className="hidden md:block text-left pr-4">
                                            <p className="text-xs font-black text-emerald-950 leading-none mb-1">{user.first_name}</p>
                                            <p className="text-[9px] font-bold text-emerald-500 uppercase leading-none">{user.role}</p>
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

                <main className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-12 bg-gray-50/50">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
