import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import DeliveryStatusStepper from '@/Components/DeliveryStatusStepper';
import React, { useEffect, useState } from 'react';

export default function MyPurchases({ auth, orders, design_css_url }) {
    const [driversByOrder, setDriversByOrder] = useState({});
    const [selectedDrivers, setSelectedDrivers] = useState({});

    const loadDrivers = (orderId) => {
        if (driversByOrder[orderId]) return;
        fetch(route('retailer.order.drivers', orderId), { headers: { Accept: 'application/json' } })
            .then((r) => r.json())
            .then((data) => setDriversByOrder((prev) => ({ ...prev, [orderId]: data.drivers || [] })));
    };

    const handleBookDriver = (orderId) => {
        router.post(route('retailer.order.book_driver', orderId), {
            driver_id: selectedDrivers[orderId],
        });
    };

    const badgeConfig = (status, delivery_status) => {
        if (delivery_status === 'Confirmed Received') return { bg: 'bg-green-600 text-white', label: '✅ Order Completed' };
        if (delivery_status === 'Delivered') return { bg: 'bg-yellow-400 text-black', label: '🚚 Arrived / Handover' };
        
        switch (status) {
            case 'pending_preparation':
                return { bg: 'bg-yellow-400 text-black', label: '🟡 Preparing' };
            case 'ready_for_pickup':
                return { bg: 'bg-green-400 text-black', label: '🟢 Ready for Pickup' };
            case 'in_transit':
                return { bg: 'bg-blue-500 text-white', label: '🔵 In Transit' };
            default:
                return { bg: 'bg-gray-200 text-gray-600', label: status ? status.replace(/_/g, ' ') : 'Unknown' };
        }
    };

    const handleConfirm = (id) => {
        if (confirm('Are you sure you have received the order? This will mark the transaction as completed.')) {
            router.patch(route('retailer.order.confirm_received', id));
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['orders'], preserveScroll: true });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head>
                <title>My Orders</title>
                {design_css_url && <link rel="stylesheet" href={design_css_url} />}
            </Head>
            <div className="p-4 sm:p-6 bg-transparent min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1.5 h-8 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(5,150,105,0.4)]"></div>
                        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-none">
                            My Orders
                        </h2>
                    </div>

                    <div className="space-y-12">
                        {orders && orders.length > 0 ? (
                            orders.map((order) => {
                                const badge = badgeConfig(order.status, order.delivery_status);
                                return (
                                    <div key={order.id} className="glass-card p-4 sm:p-10 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>

                                        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-12 mb-10">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 rounded-lg bg-emerald-950 text-white text-[9px] font-black uppercase tracking-widest">
                                                        Order #{order.id}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-emerald-950/40 uppercase tracking-tighter">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-tight">
                                                    {order.rice_variety}
                                                </h3>
                                                <p className="text-xl sm:text-2xl font-black text-emerald-700">{order.sacks} Sacks</p>
                                                
                                                <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-white/95 border border-white/60 w-fit">
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase text-emerald-950/40 tracking-[0.2em]">Supplier Miller Hub</p>
                                                        <p className="font-extrabold text-emerald-950">{order.miller?.first_name} {order.miller?.last_name}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-left lg:text-right min-w-[280px] space-y-6">
                                                <div>
                                                    <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-600 tracking-tighter leading-none">₱{Number(order.total_price).toLocaleString()}</p>
                                                </div>
                                                
                                                <div className="flex flex-col items-start lg:items-end gap-3 pt-4 border-t border-emerald-950/5">
                                                    <div className={`px-5 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg ${badge.bg}`}>
                                                        {badge.label}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-10 border-t border-emerald-950/5">
                                            <DeliveryStatusStepper 
                                                status={
                                                    (order.shipping_method === 'pickup' && order.status === 'pending_preparation' && order.scheduled_delivery_date) 
                                                        ? 'date_scheduled' 
                                                        : (order.shipping_method === 'pickup' ? order.status : order.delivery_status || 'Pending')
                                                } 
                                                type={order.shipping_method === 'pickup' ? 'rice_pickup' : 'rice'} 
                                            />
                                            
                                            {order.shipping_method === 'delivery' && (
                                                <div className="mt-8 p-5 rounded-2xl bg-white/90 border-2 border-black">
                                                    {order.driver ? (
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="text-[9px] font-black uppercase text-emerald-950/40 tracking-[0.2em]">Your Driver</p>
                                                                <p className="font-extrabold text-emerald-950">{order.driver.first_name} {order.driver.last_name}</p>
                                                                {order.driver.vehicle_type && <p className="text-xs font-bold text-gray-500">{order.driver.vehicle_type}</p>}
                                                            </div>
                                                            <span className="text-[9px] font-black uppercase px-3 py-1 bg-amber-100 text-amber-700 border border-amber-300 rounded-full">
                                                                Booked
                                                            </span>
                                                        </div>
                                                    ) : order.delivery_status === 'Pending' ? (
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase mb-3 text-emerald-950/60">🚚 Book a Driver for Your Delivery</p>
                                                            {!driversByOrder[order.id] && (
                                                                <button
                                                                    onClick={() => loadDrivers(order.id)}
                                                                    className="mb-3 text-[10px] font-black uppercase text-emerald-700 underline"
                                                                >
                                                                    Load available drivers
                                                                </button>
                                                            )}
                                                            {driversByOrder[order.id] && driversByOrder[order.id].length === 0 && (
                                                                <p className="text-[10px] font-black uppercase text-gray-400 mb-2">No verified drivers available right now. Your order is still open for drivers to accept.</p>
                                                            )}
                                                            {driversByOrder[order.id] && driversByOrder[order.id].length > 0 && (
                                                                <>
                                                                    <div className="flex gap-2">
                                                                        <select
                                                                            className="flex-1 border-2 border-black p-2 font-black text-sm rounded-lg"
                                                                            value={selectedDrivers[order.id] || ''}
                                                                            onChange={(e) => setSelectedDrivers((prev) => ({ ...prev, [order.id]: e.target.value }))}
                                                                        >
                                                                            <option value="">Select a driver...</option>
                                                                            {driversByOrder[order.id].map((d) => (
                                                                                <option key={d.id} value={d.id}>{d.first_name} {d.last_name} ({d.vehicle_type})</option>
                                                                            ))}
                                                                        </select>
                                                                        <button
                                                                            disabled={!selectedDrivers[order.id]}
                                                                            onClick={() => handleBookDriver(order.id)}
                                                                            className={`px-5 py-2 font-black uppercase text-[10px] tracking-widest rounded-lg ${selectedDrivers[order.id] ? 'bg-emerald-950 text-white hover:bg-emerald-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                                                        >
                                                                            Book
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-[9px] font-bold text-gray-400 mt-2">Prefer to wait? A driver can still accept this job from the network.</p>
                                                                </>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-[10px] font-black uppercase text-gray-400">Driver assignment no longer available.</p>
                                                    )}
                                                </div>
                                            )}

                                            {order.delivery_status === 'Delivered' && (
                                                <div className="mt-12 flex justify-center">
                                                    <button 
                                                        onClick={() => handleConfirm(order.id)}
                                                        className="btn-2026 !px-16 !py-7"
                                                    >
                                                        Confirm Receipt
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-40 glass-card text-center">
                                <p className="text-emerald-950/40 font-black uppercase tracking-[0.4em] text-xl">No Purchases Found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
