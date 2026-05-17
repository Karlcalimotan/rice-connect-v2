import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import React from 'react';

export default function MillerOrders({ auth, orders }) {
    const { post } = useForm();

    const markAsReady = (id) => {
        if (confirm('Mark this order as ready? This will notify the retailer.')) {
            post(route('miller.order.ready', id));
        }
    };

    const completePickup = (id) => {
        if (confirm('Mark this order pickup as complete? This will transfer the funds from the Retailer.')) {
            post(route('miller.order.complete_pickup', id));
        }
    };

    const deleteOrder = (id) => {
        if (confirm('Are you sure you want to delete this completed order from your view?')) {
            router.delete(route('miller.order.delete', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Retailer Orders
                </h2>
            }
        >
            <Head title="Miller Orders Management" />

            <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-2 h-8 bg-emerald-600 rounded-full"></div>
                        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-none">
                            Fulfillment Queue
                        </h2>
                    </div>

                    <div className="space-y-8">
                        {orders && orders.length > 0 ? (
                            orders.map((order) => (
                                <div key={order.id} className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-8">
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-[10px] font-black uppercase text-white bg-black px-2 py-0.5">#{order.id}</span>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black ${
                                                    order.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                                                }`}>
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                                <span className="text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black bg-blue-50 text-blue-900">
                                                    {order.shipping_method.toUpperCase()}
                                                </span>
                                                {order.scheduled_delivery_date && (
                                                    <span className="text-[9px] font-black px-2 py-0.5 border-2 border-black bg-purple-50 text-purple-900 rounded">
                                                        📅 Scheduled: {new Date(order.scheduled_delivery_date).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-3xl font-black uppercase mb-1">{order.rice_variety}</h3>
                                            <p className="text-lg font-bold text-emerald-800">{order.sacks} Sacks — {order.total_weight}kg Total</p>
                                            
                                            <div className="mt-4 pt-4 border-t-2 border-black/5 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-950 font-black text-xs">
                                                    {order.retailer?.first_name?.[0]}{order.retailer?.last_name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">Retailer</p>
                                                    <p className="text-sm font-bold text-emerald-950">{order.retailer?.first_name} {order.retailer?.last_name}</p>
                                                </div>
                                            </div>

                                            {/* Pickup Scheduling Form if needed */}
                                            {order.shipping_method === 'pickup' && !order.scheduled_delivery_date && (
                                                <div className="mt-6 p-4 bg-emerald-50 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full lg:w-96 text-left">
                                                    <label className="block text-[10px] font-black uppercase mb-1 text-emerald-900">🗓️ Schedule Pickup Date</label>
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="date" 
                                                            className="flex-1 border-2 border-black p-2 font-black text-xs bg-white"
                                                            id={`pickup-date-${order.id}`}
                                                        />
                                                        <button 
                                                            onClick={() => {
                                                                const val = document.getElementById(`pickup-date-${order.id}`).value;
                                                                if (!val) { alert('Please select a date'); return; }
                                                                router.post(route('miller.order.schedule_delivery', order.id), { scheduled_delivery_date: val });
                                                            }}
                                                            className="bg-black text-white px-4 py-2 font-black text-[10px] uppercase hover:bg-emerald-600 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                                        >
                                                            Set Date
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="lg:text-right flex flex-col gap-4 w-full lg:w-auto">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">Payment Amount</p>
                                                <p className="text-4xl font-black text-emerald-950">₱{Number(order.total_price).toLocaleString()}</p>
                                                <p className="text-[9px] font-bold text-gray-500 uppercase mt-1 italic">
                                                    {order.shipping_method === 'delivery' ? `Inc. ₱${order.delivery_fee} Delivery` : 'Self-Pickup (No Delivery Fee)'}
                                                </p>
                                            </div>

                                            {/* Action Buttons based on status & method */}
                                            {order.status === 'pending_preparation' && (
                                                order.shipping_method === 'pickup' ? (
                                                    order.scheduled_delivery_date ? (
                                                        <button
                                                            onClick={() => markAsReady(order.id)}
                                                            className="bg-emerald-950 text-white px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-emerald-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95"
                                                        >
                                                            Mark Ready for Pickup
                                                        </button>
                                                    ) : (
                                                        <div className="bg-yellow-100 border-2 border-yellow-400 p-3 text-center rounded">
                                                            <p className="text-[10px] font-black text-yellow-800 uppercase italic">Awaiting Date Schedule</p>
                                                        </div>
                                                    )
                                                ) : (
                                                    <button
                                                        onClick={() => markAsReady(order.id)}
                                                        className="bg-emerald-950 text-white px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-emerald-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95"
                                                    >
                                                        Mark as Ready
                                                    </button>
                                                )
                                            )}

                                            {order.status === 'ready_for_pickup' && (
                                                order.shipping_method === 'pickup' ? (
                                                    <div className="flex flex-col gap-2">
                                                        <div className="bg-emerald-50 border-2 border-emerald-400 p-3 text-center">
                                                            <p className="text-[10px] font-black text-emerald-800 uppercase italic">Awaiting Retailer Pickup</p>
                                                        </div>
                                                        <button
                                                            onClick={() => completePickup(order.id)}
                                                            className="bg-green-600 text-white px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-green-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95"
                                                        >
                                                            Complete Pickup (Mark Done)
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="bg-blue-50 border-2 border-blue-200 p-3 text-center">
                                                        <p className="text-[10px] font-black text-blue-800 uppercase italic">Ready • Manage in Transport Hub</p>
                                                    </div>
                                                )
                                            )}

                                            {(order.status === 'completed' || order.status === 'cancelled') && (
                                                <button
                                                    onClick={() => deleteOrder(order.id)}
                                                    className="bg-rose-600 text-white px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-rose-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95"
                                                >
                                                    Delete Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="border-4 border-dashed border-black/10 p-20 text-center rounded-[3rem]">
                                <span className="text-6xl opacity-20">📦</span>
                                <p className="mt-6 text-emerald-950/30 font-black uppercase tracking-[0.3em] text-xs italic">
                                    No incoming orders at the moment.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
