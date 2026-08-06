import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Dashboard({ auth, pendingBookings = [], activeBookings = [], history = { palay: [], rice: [] } }) {
    const [localPending, setLocalPending] = useState(pendingBookings);
    
    // Sync with props
    React.useEffect(() => {
        setLocalPending(pendingBookings);
    }, [pendingBookings]);

    const handleAcceptJob = (bookingId) => {
        // Optimistic UI update: instantly filter out accepted card
        setLocalPending(prev => prev.filter(b => b.id !== bookingId));

        router.post(route('bookings.accept', bookingId), {}, {
            onSuccess: () => {
                // Instantly reloads/refresh state invalidation
            },
            onError: (err) => {
                alert(err.message || 'Failed to claim job.');
                // Revert on error
                setLocalPending(pendingBookings);
            }
        });
    };

    const handleUpdateStatus = (bookingId, nextStatus) => {
        router.post(route('bookings.update_status', bookingId), {
            status: nextStatus
        });
    };

    return (
        <AuthenticatedLayout user={auth?.user} header="Road Ops Radar">
            <Head title="Driver Radar Dashboard" />

            <div className="py-12 bg-transparent min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header branding */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-3.5 h-12 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse"></div>
                        <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-none">
                            Logistics Radar
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        
                        {/* LEFT COLUMN: THE JOB RADAR */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b-2 border-dashed border-emerald-900/10 pb-4">
                                <h3 className="text-2xl font-black uppercase text-amber-600 flex items-center gap-2">
                                    <span className="inline-block w-3 h-3 bg-amber-500 rounded-full animate-ping"></span>
                                    Job Radar (Broadcasts)
                                </h3>
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 border-2 border-amber-400 uppercase rounded-full">
                                    {localPending.length} Available
                                </span>
                            </div>

                            {localPending.length === 0 ? (
                                <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-emerald-900/10 rounded-3xl backdrop-blur-md bg-white/20">
                                    <span className="text-5xl mb-4 animate-bounce">📡</span>
                                    <p className="text-emerald-950/60 font-black uppercase tracking-widest text-[11px]">Scanning for dispatch broadcasts...</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                    {localPending.map((booking) => (
                                        <div key={booking.id} className="glass-card p-6 border border-white/40 shadow-xl relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-md hover:bg-white/60 transition-all duration-300">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                            
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="px-2 py-0.5 bg-black text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                                                        {booking.harvest_batch_id ? '🌾 Palay Inbound' : '📦 Rice Outbound'}
                                                    </span>
                                                    <h4 className="text-xl font-bold uppercase tracking-tight text-emerald-950 mt-1">
                                                        {booking.harvest_batch_id ? 'Farm ➔ Mill Station' : 'Mill Station ➔ Retailer'}
                                                    </h4>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-400 px-2 py-1 rounded">
                                                        {booking.estimated_sacks} Sacks
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 border-t border-b border-black/5 py-3 my-3 text-xs">
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-emerald-950/40">From (Origin)</p>
                                                    <p className="font-bold text-emerald-950">{booking.origin_address}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-emerald-950/40">To (Destination)</p>
                                                    <p className="font-bold text-emerald-950">{booking.destination_address}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="text-xs">
                                                    <p className="text-[9px] uppercase font-black text-emerald-950/40">Cargo Weight</p>
                                                    <p className="font-black text-emerald-900">{booking.total_weight_kg} kg</p>
                                                </div>
                                                <button
                                                    onClick={() => handleAcceptJob(booking.id)}
                                                    className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase py-3 px-6 rounded-full text-xs shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border-2 border-black"
                                                >
                                                    Accept Job
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: ACTIVE TRIPS & STATUS CONTROLS */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b-2 border-dashed border-emerald-900/10 pb-4">
                                <h3 className="text-2xl font-black uppercase text-blue-600 flex items-center gap-2">
                                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                                    My Active Deliveries
                                </h3>
                                <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 border-2 border-blue-400 uppercase rounded-full">
                                    {activeBookings.length} Active
                                </span>
                            </div>

                            {activeBookings.length === 0 ? (
                                <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-emerald-900/10 rounded-3xl backdrop-blur-md bg-white/20">
                                    <span className="text-5xl mb-4 opacity-50">🚚</span>
                                    <p className="text-emerald-950/40 font-black uppercase tracking-widest text-[11px]">No active bookings accepted yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {activeBookings.map((booking) => (
                                        <div key={booking.id} className="glass-card p-6 border-2 border-black/10 shadow-2xl relative overflow-hidden rounded-3xl bg-white/50 backdrop-blur-md">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                        booking.status === 'assigned' ? 'bg-amber-400 text-black border border-black' :
                                                        booking.status === 'at_pickup' ? 'bg-blue-500 text-white' :
                                                        booking.status === 'in_transit' ? 'bg-indigo-600 text-white animate-pulse' :
                                                        'bg-emerald-600 text-white'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                    <h4 className="text-xl font-bold uppercase tracking-tight text-emerald-950 mt-2">
                                                        Trip #{booking.id}
                                                    </h4>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-6">
                                                <div className="p-3 bg-white/40 border border-black/5 rounded-2xl">
                                                    <p className="text-[10px] font-bold text-emerald-950/50 uppercase">Route Details</p>
                                                    <p className="text-sm font-bold text-emerald-950">{booking.origin_address} ➔ {booking.destination_address}</p>
                                                </div>
                                                
                                                <div className="p-3 bg-white/40 border border-black/5 rounded-2xl flex justify-between">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-emerald-950/50 uppercase">Payload</p>
                                                        <p className="text-sm font-bold text-emerald-950">{booking.estimated_sacks} Sacks ({booking.total_weight_kg} kg)</p>
                                                    </div>
                                                    {booking.harvest_batch_id && (
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-bold text-emerald-950/50 uppercase">Farmer Contact</p>
                                                            <p className="text-sm font-bold text-blue-600">{booking.harvest_batch?.user?.contact || 'N/A'}</p>
                                                        </div>
                                                    )}
                                                    {booking.order_id && (
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-bold text-emerald-950/50 uppercase">Retailer Contact</p>
                                                            <p className="text-sm font-bold text-blue-600">{booking.order?.retailer?.contact || 'N/A'}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Step Mutations Controls */}
                                            <div className="border-t border-black/5 pt-4">
                                                {booking.status === 'assigned' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, 'at_pickup')}
                                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black uppercase py-3.5 px-6 rounded-full text-xs border-2 border-black tracking-widest transition-all shadow-md"
                                                    >
                                                        Arrive at Pickup Station
                                                    </button>
                                                )}

                                                {booking.status === 'at_pickup' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, 'in_transit')}
                                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase py-3.5 px-6 rounded-full text-xs border-2 border-black tracking-widest transition-all shadow-md"
                                                    >
                                                        Confirm Load & Start Transit
                                                    </button>
                                                )}

                                                {booking.status === 'in_transit' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, 'delivered')}
                                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase py-3.5 px-6 rounded-full text-xs border-2 border-black tracking-widest transition-all shadow-md"
                                                    >
                                                        Mark Delivered (Arrived at Destination)
                                                    </button>
                                                )}

                                                {booking.status === 'delivered' && (
                                                    <div className="p-4 bg-emerald-50 border-2 border-dashed border-emerald-400 rounded-2xl text-center">
                                                        <p className="text-emerald-800 font-bold text-xs uppercase">
                                                            Awaiting Receiver Handover Confirmation...
                                                        </p>
                                                        <p className="text-[10px] text-emerald-600 mt-1">
                                                            Receiver must confirm receipt on their dashboard to release payout.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* HISTORICAL SHIPMENTS SECTION */}
                    <div className="mt-20 border-t-2 border-dashed border-emerald-900/10 pt-10">
                        <h3 className="text-2xl font-black uppercase mb-8 text-emerald-900">Assignment History</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase text-gray-400">Past Palay Shipments</h4>
                                {history.palay.length === 0 ? (
                                    <p className="text-[10px] font-bold text-gray-300 uppercase italic">No history yet.</p>
                                ) : (
                                    history.palay.map(item => (
                                        <div key={item.id} className="bg-white/40 backdrop-blur-sm border-2 border-black/5 p-4 rounded-2xl flex justify-between items-center">
                                            <div>
                                                <p className="text-xs font-black uppercase">{item.rice_variety}</p>
                                                <p className="text-[9px] font-bold text-gray-400">{new Date(item.updated_at).toLocaleDateString()}</p>
                                            </div>
                                            <span className="text-[9px] font-black uppercase px-3 py-1 bg-green-100 text-green-700 rounded-full">Completed</span>
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
                                        <div key={item.id} className="bg-white/40 backdrop-blur-sm border-2 border-black/5 p-4 rounded-2xl flex justify-between items-center">
                                            <div>
                                                <p className="text-xs font-black uppercase">{item.rice_variety}</p>
                                                <p className="text-[9px] font-bold text-gray-400">{new Date(item.updated_at).toLocaleDateString()}</p>
                                            </div>
                                            <span className="text-[9px] font-black uppercase px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Delivered</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
