import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

export default function MyOrders({ auth, orders, design_css_url }) {
    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head>
                <title>Purchases History</title>
                {design_css_url && <link rel="stylesheet" href={design_css_url} />}
            </Head>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-2 h-8 bg-emerald-600 rounded-full"></div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-none">
                            Purchases History
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {orders && orders.length > 0 ? (
                            orders.map((order) => (
                                <div key={order.id} className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Order ID: #{order.id}</p>
                                        <h3 className="text-2xl font-black uppercase">{order.rice_variety}</h3>
                                        <p className="text-sm font-bold text-gray-600 italic">{order.sacks} Sacks ({order.total_weight}kg)</p>
                                    </div>

                                    <div className="text-center md:text-right">
                                        <p className="text-xs font-black uppercase text-gray-400">Total Paid</p>
                                        <p className="text-3xl font-black text-green-600">₱{Number(order.total_price).toLocaleString()}</p>
                                    </div>

                                    <div className="flex flex-col items-center md:items-end gap-3">
                                        <div className="flex flex-col items-end">
                                            <span className={`px-4 py-1 border-2 border-black font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                                                order.status === 'completed' ? 'bg-green-400' : 'bg-blue-400'
                                            }`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>

                                        {order.delivery_status === 'Delivered' && order.status !== 'completed' && (
                                            <button
                                                onClick={() => {
                                                    if(confirm('Have you received all items in good condition?')) {
                                                        import('@inertiajs/react').then(m => m.router.patch(route('retailer.order.confirm_received', order.id)));
                                                    }
                                                }}
                                                className="bg-emerald-950 text-white px-6 py-2 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95"
                                            >
                                                Confirm Receipt
                                            </button>
                                        )}

                                        {order.status === 'completed' && (
                                            <div className="flex items-center gap-1 text-green-600">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                                <span className="text-[10px] font-black uppercase">Finalized</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-emerald-900/10">
                                <span className="text-4xl mb-4 opacity-50">🛒</span>
                                <p className="text-emerald-950/40 font-black uppercase tracking-widest text-[10px]">No Orders Found. You haven't purchased any rice yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
