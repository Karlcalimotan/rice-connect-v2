import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import DeliveryStatusStepper from '@/Components/DeliveryStatusStepper';
import FleetManagement from '../Components/FleetManagement';
import React from 'react';

export default function Transport({ auth, inbound, outbound, allDrivers, myFleet }) {
    const { data: palayData, setData: setPalayData, post: postPalay } = useForm({
        actual_weight_kg: '',
        suggested_price_per_kg: '',
    });

    const { data: finalizeData, setData: setFinalizeData, post: postFinalize } = useForm({
        final_price_per_kg: '',
    });

    const { data: driverAssignment, setData: setDriverAssignment } = useForm({
        driver_id: '',
        type: ''
    });

    const { data: pickupScheduling, setData: setPickupScheduling, post: postPickupSchedule } = useForm({
        scheduled_pickup_date: '',
    });

    const { data: deliveryScheduling, setData: setDeliveryScheduling, post: postDeliverySchedule } = useForm({
        scheduled_delivery_date: '',
    });

    const handleConfirmPickup = (id) => {
        postPalay(route('miller.palay.confirm_pickup', id));
    };

    const handleFinalizeTransaction = (id) => {
        postFinalize(route('miller.palay.finalize', id));
    };

    const handleAssignDriver = (id, type) => {
        if (!driverAssignment.driver_id) {
            alert('Please select a driver first.');
            return;
        }
        router.post(route('miller.transport.assign_driver', id), {
            driver_id: driverAssignment.driver_id,
            type: type
        });
    };

    const handleDispatch = (id) => {
        router.post(route('miller.order.dispatch', id));
    };

    const handleSchedulePickup = (id) => {
        postPickupSchedule(route('miller.palay.schedule_pickup', id), {
            onSuccess: () => setPickupScheduling('scheduled_pickup_date', ''),
        });
    };

    const handleScheduleDelivery = (id) => {
        postDeliverySchedule(route('miller.order.schedule_delivery', id), {
            onSuccess: () => setDeliveryScheduling('scheduled_delivery_date', ''),
        });
    };

    React.useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['inbound', 'outbound'], preserveScroll: true });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Logistics & Transport" />

            <div className="py-12 bg-transparent min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-3 h-10 bg-black border-2 border-green-500"></div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-none">
                            Transport Hub
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* INBOUND: Palay Picking */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black uppercase text-green-700">Inbound: Palay Picking</h3>
                                <span className="bg-green-100 text-green-800 text-xs font-black px-2 py-1 border-2 border-black uppercase">Farmer ➔ Miller</span>
                            </div>

                            {!inbound || inbound.length === 0 ? (
                                <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-emerald-900/10">
                                    <span className="text-4xl mb-4 opacity-50">🌾</span>
                                    <p className="text-emerald-950/40 font-black uppercase tracking-widest text-[10px]">No inbound logistics active.</p>
                                </div>
                            ) : (
                                inbound.map((batch) => (
                                    <div key={batch.id} className="glass-card group relative p-8">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
                                        
                                        <div className="relative flex justify-between items-start mb-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
                                                    <h4 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">{batch.rice_variety}</h4>
                                                </div>
                                                <div className="space-y-1 mt-4">
                                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[8px]">🚜</span>
                                                        Farmer: <span className="text-gray-900">{batch.user?.first_name} {batch.user?.last_name}</span>
                                                    </p>
                                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[8px]">📍</span>
                                                        Origin: <span className="text-gray-900">{batch.user?.municipality || 'Unknown'}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-2">
                                                <span className="bg-orange-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">Inbound Palay</span>
                                                {batch.scheduled_pickup_date && (
                                                    <span className={`text-[8px] font-black px-2 py-1 border rounded uppercase tracking-wider ${
                                                        batch.schedule_is_read 
                                                        ? 'bg-gray-100 text-gray-500 border-gray-300' 
                                                        : 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                                                    }`}>
                                                        {batch.schedule_is_read ? '✓ Scheduled: ' : '📅 Scheduled: '}
                                                        {new Date(batch.scheduled_pickup_date).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <DeliveryStatusStepper status={batch.delivery_status || 'Pending'} type="palay" />

                                        {batch.delivery_status === 'Payment Pending' && (
                                            <div className="mt-6 p-4 glass-card !bg-yellow-400/20 border-4 border-black">
                                                <p className="text-xs font-black uppercase mb-3 text-yellow-700 underline decoration-black decoration-4 offset-4">Authorization Required</p>
                                                <div className="flex justify-between items-end mb-6 bg-white/40 backdrop-blur-sm p-4 border-2 border-black">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-gray-500">Driver Logged:</p>
                                                        <p className="text-lg font-black">{batch.actual_weight_kg} kg @ ₱{batch.suggested_price_per_kg}/kg</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black uppercase text-gray-500">Total to Pay Farmer:</p>
                                                        <p className="text-lg font-black text-green-600">₱{((batch.actual_weight_kg || 0) * (batch.suggested_price_per_kg || 0)).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => router.post(route('miller.palay.authorize', batch.id))}
                                                    className="btn-2026 w-full text-center !py-4"
                                                >
                                                    Authorize Payment & Start Transit
                                                </button>
                                            </div>
                                        )}

                                        {batch.delivery_status === 'Pending' && (
                                            <div className="mt-6 space-y-4">
                                                <div className="p-4 glass-card !bg-emerald-50 border-2 border-black">
                                                    <label className="block text-[10px] font-black uppercase mb-1 text-emerald-900">🗓️ Schedule Inbound Pickup</label>
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="date" 
                                                            className="flex-1 border-2 border-black p-2 font-black text-xs rounded-lg"
                                                            value={pickupScheduling.scheduled_pickup_date}
                                                            onChange={e => setPickupScheduling('scheduled_pickup_date', e.target.value)}
                                                        />
                                                        <button 
                                                            onClick={() => handleSchedulePickup(batch.id)}
                                                            className="bg-black text-white px-4 py-2 font-black text-[10px] uppercase rounded-lg hover:bg-emerald-600 transition-colors"
                                                        >
                                                            Set
                                                        </button>
                                                    </div>
                                                </div>

                                                {!batch.driver_id ? (
                                                    <div className="p-4 glass-card !bg-white/30 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                        <label className="block text-[10px] font-black uppercase mb-1">Assign Truck (My Fleet)</label>
                                                        <div className="flex gap-2">
                                                            <select 
                                                                className="flex-1 border-4 border-black p-2 font-black text-sm"
                                                                onChange={e => setDriverAssignment('driver_id', e.target.value)}
                                                            >
                                                                <option value="">Select Official Driver...</option>
                                                                {myFleet?.map((d) => (
                                                                    <option key={d.id} value={d.id}>{d.first_name} {d.last_name} ({d.vehicle_type})</option>
                                                                ))}
                                                                <option value={auth.user.id}>Self (Miller)</option>
                                                            </select>
                                                            <button 
                                                                onClick={() => handleAssignDriver(batch.id, 'palay')}
                                                                className="btn-2026 !px-6 !py-2"
                                                            >
                                                                Assign
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-4 glass-card !bg-yellow-400/20 border-4 border-black border-dashed">
                                                        <p className="text-[10px] font-black text-yellow-800 uppercase tracking-widest text-center">
                                                            Waiting for Assigned Driver to weigh Palay at farm...
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* OUTBOUND: Rice Delivery */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black uppercase text-blue-700">Outbound: Rice Delivery</h3>
                                <span className="bg-blue-100 text-blue-800 text-xs font-black px-2 py-1 border-2 border-black uppercase">Miller ➔ Retailer</span>
                            </div>

                            {!outbound || outbound.length === 0 ? (
                                <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-emerald-900/10">
                                    <span className="text-4xl mb-4 opacity-50">📦</span>
                                    <p className="text-emerald-950/40 font-black uppercase tracking-widest text-[10px]">No outbound deliveries.</p>
                                </div>
                            ) : (
                                outbound.map((order) => (
                                    <div key={order.id} className="glass-card group relative p-8">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/10 transition-all"></div>

                                        <div className="relative flex justify-between items-start mb-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                                                    <h4 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">{order.rice_variety}</h4>
                                                </div>
                                                <div className="space-y-1 mt-4">
                                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[8px]">🏬</span>
                                                        Retailer: <span className="text-gray-900">{order.retailer?.first_name} {order.retailer?.last_name}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-2">
                                                <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">Outbound Rice</span>
                                            </div>
                                        </div>

                                        <DeliveryStatusStepper status={order.delivery_status || 'Pending'} type="rice" />

                                        {order.delivery_status === 'Pending' && (
                                            <div className="mt-6 space-y-4">
                                                {!order.driver_id ? (
                                                    <div className="p-4 glass-card !bg-white/30 border-4 border-black">
                                                        <label className="block text-[10px] font-black uppercase mb-1">Assign Truck (My Fleet)</label>
                                                        <div className="flex gap-2">
                                                            <select 
                                                                className="flex-1 border-4 border-black p-2 font-black text-sm"
                                                                onChange={e => setDriverAssignment('driver_id', e.target.value)}
                                                            >
                                                                <option value="">Select Official Driver...</option>
                                                                {myFleet?.map((d) => (
                                                                    <option key={d.id} value={d.id}>{d.first_name} {d.last_name} ({d.vehicle_type})</option>
                                                                ))}
                                                            </select>
                                                            <button 
                                                                onClick={() => handleAssignDriver(order.id, 'rice')}
                                                                className="btn-2026 !px-6 !py-2"
                                                            >
                                                                Assign
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                     <button 
                                                         onClick={() => handleDispatch(order.id)}
                                                         className="btn-2026 w-full text-center !py-4"
                                                     >
                                                         Dispatch for Delivery
                                                     </button>
                                                 )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <FleetManagement allDrivers={allDrivers} myFleet={myFleet} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
