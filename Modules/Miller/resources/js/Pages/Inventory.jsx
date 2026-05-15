import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React from 'react';

export default function Inventory({ auth, inventory }) {

    const handleMillRice = (batchId) => {
        const sacks = window.prompt("Enter total 50kg Sacks Produced:");
        if (sacks === null) return;
        const leftover = window.prompt("Enter total Leftover KG (Loose Rice):", "0");
        if (leftover === null) return;

        const sackCount = parseInt(sacks);
        const leftoverCount = parseFloat(leftover);

        if (!isNaN(sackCount) && !isNaN(leftoverCount)) {
            router.patch(route('miller.mill_to_rice', batchId), { sacks: sackCount, leftover_kg: leftoverCount }, {
                onSuccess: () => alert("Palay milled efficiently! Check Finished Rice stock."),
            });
        } else {
            alert("Please enter valid numbers.");
        }
    };

    const handleAction = (routeName, batchId) => {
        router.patch(route(routeName, batchId), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Miller Inventory" />
            <div className="p-6 bg-transparent min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-6 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(5,150,105,0.4)]"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-800/60">Stockpile Management</p>
                            </div>
                            <h2 className="text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-none">
                                Hub Inventory
                            </h2>
                        </div>
                    </div>

                    {inventory && inventory.length > 0 ? (
                        <div className="space-y-8">
                            {inventory.map((group) => (
                                <div key={group.rice_variety} className="glass-card overflow-hidden p-2">
                                    <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
                                    {/* Variety Header */}
                                    <div className="p-8 border-b border-white/20 bg-emerald-700/40">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-2xl font-black uppercase text-white tracking-tighter">{group.rice_variety}</h3>
                                                <p className="text-[10px] font-black uppercase text-emerald-100 tracking-widest mt-1 opacity-60">
                                                    {group.batch_count} batch{group.batch_count > 1 ? 'es' : ''}
                                                </p>
                                            </div>
                                            <div className="flex gap-4 text-center">
                                                <div className="bg-white/10 border border-white/20 rounded-2xl p-4 min-w-[120px]">
                                                    <p className="text-[9px] font-black uppercase text-emerald-50 mb-1 opacity-60">Total Weight</p>
                                                    <p className="text-2xl font-black text-white leading-none">{group.total_weight}<span className="text-xs ml-1 opacity-60 font-medium tracking-widest">KG</span></p>
                                                </div>
                                                <div className="bg-white/10 border border-white/20 rounded-2xl p-4 min-w-[120px]">
                                                    <p className="text-[9px] font-black uppercase text-emerald-50 mb-1 opacity-60">Unpacked</p>
                                                    <p className="text-2xl font-black text-white leading-none">{group.total_unpacked_weight_kg || 0}<span className="text-xs ml-1 opacity-60 font-medium tracking-widest">KG</span></p>
                                                </div>
                                                <div className="bg-white/10 border border-white/20 rounded-2xl p-4 min-w-[120px]">
                                                    <p className="text-[9px] font-black uppercase text-emerald-50 mb-1 opacity-60">Sacks</p>
                                                    <p className="text-2xl font-black text-white leading-none">{group.total_sacks}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Individual Batches */}
                                    <div className="divide-y divide-white/10">
                                        {group.batches.map((batch) => (
                                            <div key={batch.id} className="p-4 flex items-center justify-between hover:bg-white/20 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-black text-gray-300">#{batch.id}</span>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-700">{batch.farmer_name}</p>
                                                        <p className="text-xs text-gray-400">
                                                            {batch.total_weight}kg raw
                                                            {batch.unpacked_weight_kg != null && ` • ${batch.unpacked_weight_kg}kg unpacked`}
                                                            {batch.total_sacks > 0 && ` • ${batch.total_sacks} sacks`}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 border border-black text-[10px] font-black uppercase ${
                                                        batch.status === 'sold' ? 'bg-blue-200' :
                                                        batch.status === 'processing' ? 'bg-yellow-200' :
                                                        batch.status === 'processed' ? 'bg-green-200' :
                                                        batch.status === 'for_sale' ? 'bg-emerald-300' :
                                                        'bg-gray-200'
                                                    }`}>
                                                        {batch.status.replace(/_/g, ' ')}
                                                    </span>
                                                    {batch.drying_status && (
                                                        <span className="px-2 py-0.5 bg-orange-100 border border-orange-300 text-[10px] font-bold uppercase text-orange-700">
                                                            {batch.drying_status.replace(/_/g, ' ')}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    {batch.status === 'received' && batch.condition === 'fresh' && batch.drying_status !== 'drying' && batch.drying_status !== 'ready_to_process' && (
                                                        <button onClick={() => handleAction('miller.start_drying', batch.id)}
                                                            className="px-3 py-1 bg-yellow-400 text-black text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                            Start Drying
                                                        </button>
                                                    )}
                                                    {batch.drying_status === 'drying' && (
                                                        <button onClick={() => handleAction('miller.ready_to_process', batch.id)}
                                                            className="px-3 py-1 bg-orange-400 text-black text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                            Mark Dry
                                                        </button>
                                                    )}
                                                    {batch.status === 'received' && (batch.condition === 'ready' || batch.drying_status === 'ready_to_process') && (
                                                        <button onClick={() => handleAction('miller.start_processing', batch.id)}
                                                            className="px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                            Start Processing
                                                        </button>
                                                    )}
                                                    {batch.status === 'processing' && (
                                                        <button onClick={() => handleMillRice(batch.id)}
                                                            className="px-3 py-1 bg-emerald-950 text-white text-[10px] font-black uppercase rounded-lg shadow-lg flex items-center gap-2">
                                                            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15l-3-3m0 0l3-3m-3 3h12" strokeWidth="2"/></svg>
                                                            MILL TO SECURE STOCK
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-40 glass-card flex flex-col items-center justify-center text-center">
                            <p className="text-emerald-950/10 font-black uppercase tracking-[1em] text-sm mb-8">STOCKPILE EMPTY</p>
                            <p className="text-emerald-950/40 font-black uppercase tracking-[0.4em] text-xl">Operational Inactivity Detected</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
