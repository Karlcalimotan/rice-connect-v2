import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import DeliveryStatusStepper from '@/Components/DeliveryStatusStepper';
import React, { useEffect } from 'react';

export default function MyPurchases({ auth, orders, design_css_url }) {

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
                <title>My Purchases</title>
                {design_css_url && <link rel="stylesheet" href={design_css_url} />}
            </Head>
            <div className="p-6 bg-transparent min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1.5 h-8 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(5,150,105,0.4)]"></div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-none">
                            My Purchases
                        </h2>
                    </div>

                    <div className="space-y-12">
                        {orders && orders.length > 0 ? (
                            orders.map((order) => {
                                const badge = badgeConfig(order.status, order.delivery_status);
                                return (
                                    <div key={order.id} className="glass-card p-10 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>

                                        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-10">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 rounded-lg bg-emerald-950 text-white text-[9px] font-black uppercase tracking-widest">
                                                        Order #{order.id}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-emerald-950/40 uppercase tracking-tighter">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-tight">
                                                    {order.rice_variety}
                                                </h3>
                                                <p className="text-2xl font-black text-emerald-700">{order.sacks} Sacks</p>
                                                
                                                <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-white/95 border border-white/60 w-fit">
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase text-emerald-950/40 tracking-[0.2em]">Supplier Miller Hub</p>
                                                        <p className="font-extrabold text-emerald-950">{order.miller?.first_name} {order.miller?.last_name}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-left lg:text-right min-w-[280px] space-y-6">
                                                <div>
                                                    <p className="text-6xl font-black text-emerald-600 tracking-tighter leading-none">₱{Number(order.total_price).toLocaleString()}</p>
                                                </div>
                                                
                                                <div className="flex flex-col items-start lg:items-end gap-3 pt-4 border-t border-emerald-950/5">
                                                    <div className={`px-5 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg ${badge.bg}`}>
                                                        {badge.label}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-10 border-t border-emerald-950/5">
                                            <DeliveryStatusStepper status={order.delivery_status || 'Pending'} type="rice" />
                                            
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
