import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React from 'react';

export default function Marketplace({ auth, batches, miller_town }) {

    const handleInquiry = (id) => {
        router.post(route('miller.interest', id));
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Palay Marketplace" />

            <div className="py-12 bg-transparent min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1.5 h-8 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(5,150,105,0.4)]"></div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-none">
                            {miller_town ? `Market: ${miller_town}` : 'Palay Marketplace'}
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
                                    <div className={`px-4 py-1.5 rounded-full border-2 border-black font-black text-[10px] uppercase ${
                                        batch.condition === 'fresh' ? 'bg-yellow-400 text-black' : 'bg-emerald-500 text-white'
                                    }`}>
                                        {batch.condition === 'fresh' ? '🌾 Fresh' : '☀️ Ready'}
                                    </div>
                                </div>

                                <div className="relative bg-emerald-900 text-white rounded-3xl p-6 mb-8 shadow-xl">
                                    <div className="relative flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 mb-2">Est. Inventory</p>
                                            <p className="text-3xl font-black">{batch.total_sacks ?? batch.number_of_bags} Sacks</p>
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
                                            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Location</p>
                                            <p className="text-sm font-black text-gray-900">
                                                {batch.location || `${batch.user?.municipality}, ${batch.user?.province}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    {batch.interests?.some(i => i.miller_id === auth?.user?.id) ? (
                                        <div className="w-full bg-emerald-950 text-emerald-400 font-black py-5 rounded-2xl text-center uppercase tracking-widest text-xs flex flex-col gap-1">
                                            <span>Interest Sent</span>
                                            <span className="text-[8px] text-emerald-600 tracking-[0.4em]">Awaiting Approval</span>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleInquiry(batch.id)}
                                            className="btn-2026 w-full !bg-black !text-white !py-5"
                                        >
                                            Express Interest
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                        ) : (
                            <div className="col-span-full py-40 glass-card text-center">
                                <p className="text-emerald-950/40 font-black uppercase tracking-[0.4em] text-xl">Market Currently Empty</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
