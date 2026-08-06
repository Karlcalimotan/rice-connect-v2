import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

const statusLabel = (status) => {
    const labels = {
        pending: 'Awaiting Pickup',
        sold: 'Agreed',
        in_transit: 'In Transit',
    };
    return labels[status] ?? status;
};

const statusStyle = (status) => {
    const styles = {
        pending: 'bg-amber-400 text-black',
        sold: 'bg-emerald-500 text-white',
        in_transit: 'bg-blue-500 text-white',
    };
    return styles[status] ?? 'bg-gray-200 text-gray-700';
};

export default function IncomingPalay({ auth, batches }) {
    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Incoming Palay" />

            <div className="py-12 bg-transparent min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1.5 h-8 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(5,150,105,0.4)]"></div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-none">
                            Incoming Palay
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {batches && batches.length > 0 ? (
                            batches.map((batch) => (
                                <div key={batch.id} className="glass-card group relative p-8">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>

                                    <div className="relative flex justify-between items-start mb-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-emerald-900/30 tracking-[0.4em] mb-2">Palay Batch</p>
                                            <h3 className="text-3xl font-black uppercase tracking-tighter text-gray-900 leading-none">{batch.rice_variety}</h3>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full border-2 border-black font-black text-[10px] uppercase ${statusStyle(batch.status)}`}>
                                            {statusLabel(batch.status)}
                                        </div>
                                    </div>

                                    <div className="relative bg-emerald-900 text-white rounded-3xl p-6 mb-8 shadow-xl">
                                        <div className="relative flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 mb-2">Est. Inventory</p>
                                                <p className="text-3xl font-black">{batch.total_sacks ?? batch.number_of_bags ?? 0} Sacks</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 mb-2">Weight</p>
                                                <p className="text-xl font-black">
                                                    {batch.actual_weight_kg ?? batch.total_weight ?? '—'} kg
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative space-y-4 mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-400">
                                                👤
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Farmer Partner</p>
                                                <p className="text-sm font-black text-gray-900">{batch.user?.first_name} {batch.user?.last_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                                📍
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Pickup Location</p>
                                                <p className="text-sm font-black text-gray-900">
                                                    {batch.location || `${batch.user?.municipality}, ${batch.user?.province}`}
                                                </p>
                                            </div>
                                        </div>
                                        {batch.driver && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                                    🚚
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Assigned Driver</p>
                                                    <p className="text-sm font-black text-gray-900">{batch.driver?.first_name} {batch.driver?.last_name}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-40 glass-card text-center">
                                <p className="text-emerald-950/40 font-black uppercase tracking-[0.4em] text-xl">No Incoming Palay</p>
                                <p className="mt-3 text-sm font-semibold text-emerald-900/30">Agreed batches will appear here once the handshake is confirmed.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
