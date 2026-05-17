import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import DeliveryStatusStepper from '@/Components/DeliveryStatusStepper';
import React from 'react';

export default function Dashboard({ auth, palayAssignments, riceAssignments, history }) {
    const { data: pickupData, setData: setPickupData, post: postPickup } = useForm({
        actual_weight_kg: '',
        suggested_price_per_kg: '',
    });

    const [selectedBatch, setSelectedBatch] = React.useState(null);
    const [selectedOrder, setSelectedOrder] = React.useState(null);

    const handleLogPickup = (id) => {
        postPickup(route('driver.palay.request_pickup', id));
    };

    const handleArrive = (id) => {
        router.post(route('driver.order.deliver', { id }));
    };

    return (
        <AuthenticatedLayout user={auth?.user} header="Road Ops">
            <Head title="Driver Dashboard" />

            <div className="py-12 bg-transparent min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-3 h-10 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(5,150,105,0.4)]"></div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-none">
                            Road Ops Dashboard
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black uppercase text-orange-600">Palay Pickups</h3>
                            
                            {!palayAssignments || palayAssignments.length === 0 ? (
                                <div className="glass-card p-6 sm:p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-emerald-900/10">
                                    <span className="text-4xl mb-4 opacity-50">🌾</span>
                                    <p className="text-emerald-950/40 font-black uppercase tracking-widest text-[10px]">No pending palay pickups.</p>
                                </div>
                            ) : (
                                palayAssignments.map((batch) => (
                                    <div key={batch.id} className="glass-card group relative p-4 sm:p-8">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
                                        
                                        <div className="relative flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                                                    <h4 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">{batch.rice_variety}</h4>
                                                </div>
                                                <div className="mb-4 bg-yellow-400 border-[3px] border-black inline-block px-4 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                    <span className="text-xs font-black uppercase tracking-widest italic">📦 EST. {batch.total_sacks ?? batch.number_of_bags} SACKS</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[8px]">👤</span>
                                                        Farmer: <span className="text-gray-900">{batch.user?.first_name} {batch.user?.last_name}</span>
                                                    </p>
                                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[8px]">📞</span>
                                                        Contact: <span className="text-blue-600">{batch.user?.contact}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="bg-black text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">Palay Supply</span>
                                            </div>
                                        </div>

                                        <DeliveryStatusStepper status={batch.delivery_status} type="palay" />

                                        {batch.delivery_status === 'Payment Pending' && (
                                            <div className="mt-6 p-6 bg-gray-100 border-4 border-black border-dashed flex flex-col items-center">
                                                <div className="text-3xl mb-2">⏳</div>
                                                <p className="font-black uppercase text-gray-500 tracking-widest text-[10px] text-center">
                                                    Weight Logged. Waiting for Miller to authorize payment...
                                                </p>
                                            </div>
                                        )}

                                        {batch.delivery_status === 'Payment Authorized' && (
                                            <div className="mt-6 p-5 bg-green-50 border-4 border-black shadow-[8px_8px_0px_0px_rgba(34,197,94,1)]">
                                                <div className="flex items-center gap-2 mb-4 text-green-600">
                                                    <span className="text-xl">✅</span>
                                                    <p className="font-black uppercase tracking-tighter text-sm">Authorized by Miller</p>
                                                </div>
                                                
                                                <div className="bg-white border-2 border-black p-4 mb-5">
                                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total to Handover:</p>
                                                    <p className="text-2xl font-black text-gray-900">₱{((batch.actual_weight_kg || 0) * (batch.suggested_price_per_kg || 0)).toLocaleString()}</p>
                                                </div>

                                                <button 
                                                    onClick={() => router.post(route('driver.palay.pay_farmer', batch.id))}
                                                    className="btn-2026 w-full text-center !py-4"
                                                >
                                                    Finalize Pickup & Pay Farmer
                                                </button>
                                            </div>
                                        )}

                                        {batch.delivery_status === 'Pending' && (
                                            <div className="mt-6 p-4 bg-yellow-50 border-4 border-black border-dashed">
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-[10px] font-black uppercase mb-1">Actual Weight (kg)</label>
                                                        <input 
                                                            type="number" 
                                                            className="w-full border-4 border-black p-2 font-black text-sm"
                                                            value={pickupData.actual_weight_kg}
                                                            onChange={e => setPickupData('actual_weight_kg', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-black uppercase mb-1">Price (₱/kg)</label>
                                                        <input 
                                                            type="number" 
                                                            className="w-full border-4 border-black p-2 font-black text-sm"
                                                            value={pickupData.suggested_price_per_kg}
                                                            onChange={e => setPickupData('suggested_price_per_kg', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleLogPickup(batch.id)}
                                                    className="btn-2026 w-full text-center !bg-yellow-600 hover:!bg-yellow-700 !py-4"
                                                >
                                                    Log Weight & Start Transit
                                                </button>
                                            </div>
                                        )}

                                        {batch.delivery_status === 'In Transit' && (
                                            <div className="mt-6">
                                                <button 
                                                    onClick={() => setSelectedBatch(batch)}
                                                    className="btn-2026 w-full text-center !bg-blue-600 hover:!bg-blue-700 !py-4"
                                                >
                                                    Mark as Arrived at Miller
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black uppercase text-blue-600">Rice Deliveries</h3>
                                      {!riceAssignments || riceAssignments.length === 0 ? (
                                <div className="glass-card p-6 sm:p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-emerald-900/10">
                                    <span className="text-4xl mb-4 opacity-50">📦</span>
                                    <p className="text-emerald-950/40 font-black uppercase tracking-widest text-[10px]">No active rice deliveries.</p>
                                </div>
                            ) : (
                                riceAssignments.map((order) => (
                                    <div key={order.id} className="glass-card group relative p-4 sm:p-8">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/10 transition-all"></div>

                                        <div className="relative flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    <h4 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">{order.rice_variety}</h4>
                                                </div>
                                                <p className="text-[11px] font-black text-gray-400 uppercase mt-4 flex items-center gap-1.5">
                                                    <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[8px]">🏬</span>
                                                    Retailer: <span className="text-gray-900">{order.retailer?.first_name} {order.retailer?.last_name}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <DeliveryStatusStepper status={order.delivery_status} type="rice" />

                                        {order.delivery_status === 'Pending' && (
                                            <button 
                                                onClick={() => router.post(route('driver.order.start_trip', { id: order.id }))} 
                                                className="btn-2026 w-full text-center !bg-blue-600 hover:!bg-blue-700 !py-4 mt-6"
                                            >
                                                Confirm Loading & Start Trip
                                            </button>
                                        )}

                                        {order.delivery_status === 'In Transit' && (
                                            <button 
                                                onClick={() => handleArrive(order.id)}
                                                className="btn-2026 w-full text-center !bg-blue-600 hover:!bg-blue-700 !py-4 mt-6"
                                            >
                                                Mark as Delivered
                                            </button>
                                        )}

                                        {order.delivery_status === 'Delivered' && (
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="btn-2026 w-full text-center !bg-emerald-600 hover:!bg-emerald-700 !py-4 mt-6"
                                            >
                                                Final Sign-off
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="mt-20">
                        <h3 className="text-[10px] font-black uppercase mb-8 tracking-[0.3em] text-emerald-600">Assignment History</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase text-gray-400">Past Palay Shipments</h4>
                                {history.palay.length === 0 ? (
                                    <p className="text-[10px] font-bold text-gray-300 uppercase italic">No history yet.</p>
                                ) : (
                                    history.palay.map(item => (
                                        <div key={item.id} className="bg-white/50 border-2 border-black p-4 flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] font-black uppercase">{item.rice_variety}</p>
                                                <p className="text-[8px] font-bold text-gray-400">{new Date(item.updated_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Completed</span>
                                                <button
                                                    onClick={() => {
                                                        if(confirm('Are you sure you want to delete this completed record?')) {
                                                            router.delete(route('driver.history.delete', { type: 'palay', id: item.id }));
                                                        }
                                                    }}
                                                    className="text-[8px] font-black text-rose-600 uppercase underline hover:text-rose-800"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase text-gray-400">Past Rice Deliveries</h4>
                                {history.rice.length === 0 ? (
                                    <p className="text-[10px] font-bold text-gray-300 uppercase italic">No history yet.</p>
                                ) : (
                                    history.rice.map(item => (
                                        <div key={item.id} className="bg-white/50 border-2 border-black p-4 flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] font-black uppercase">{item.rice_variety}</p>
                                                <p className="text-[8px] font-bold text-gray-400">{new Date(item.updated_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Delivered</span>
                                                <button
                                                    onClick={() => {
                                                        if(confirm('Are you sure you want to delete this completed record?')) {
                                                            router.delete(route('driver.history.delete', { type: 'rice', id: item.id }));
                                                        }
                                                    }}
                                                    className="text-[8px] font-black text-rose-600 uppercase underline hover:text-rose-800"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {selectedBatch && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                        <div className="bg-white border-8 border-black w-full max-w-xl p-8">
                            <h3 className="text-3xl font-black uppercase mb-6">Finalize Arrival</h3>
                            <div className="bg-blue-600 text-white p-6 border-4 border-black mb-8">
                                <p className="text-[10px] font-black uppercase mb-1">Handover Total:</p>
                                <p className="text-4xl font-black">₱{((selectedBatch.actual_weight_kg || 0) * (selectedBatch.suggested_price_per_kg || 0)).toLocaleString()}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setSelectedBatch(null)} className="btn-2026 !bg-white !text-black border-4 border-black">Cancel</button>
                                <button 
                                    onClick={() => {
                                        router.post(route('driver.palay.arrive_at_miller', selectedBatch.id));
                                        setSelectedBatch(null);
                                    }}
                                    className="btn-2026 !bg-black !text-white border-4 border-black"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                        <div className="bg-white border-8 border-black w-full max-w-xl p-8">
                            <h3 className="text-3xl font-black uppercase mb-2">Final Sign-off</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-6">Retailer Handover Confirmation</p>
                            
                            <div className="bg-emerald-600 text-white p-6 border-4 border-black mb-8">
                                <p className="text-[10px] font-black uppercase mb-1">Order Value:</p>
                                <p className="text-4xl font-black">₱{Number(selectedOrder.total_price).toLocaleString()}</p>
                                <p className="text-[9px] font-bold uppercase mt-2 opacity-80">{selectedOrder.rice_variety} • {selectedOrder.sacks} Sacks</p>
                            </div>

                            <div className="p-4 bg-yellow-50 border-4 border-black mb-8 text-center">
                                <p className="text-[10px] font-black uppercase text-yellow-800">
                                    ⚠️ Action Required: Please ensure the retailer has verified the items before signing off.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setSelectedOrder(null)} className="btn-2026 !bg-white !text-black border-4 border-black">Cancel</button>
                                <button 
                                    onClick={() => {
                                        router.post(route('driver.order.final_sign_off', selectedOrder.id));
                                        setSelectedOrder(null);
                                    }}
                                    className="btn-2026 !bg-black !text-white border-4 border-black"
                                >
                                    Authorize Sign-off
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
