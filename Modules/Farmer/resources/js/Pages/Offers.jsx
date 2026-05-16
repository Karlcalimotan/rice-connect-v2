import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React from 'react';

export default function Offers({ auth, offers }) {
    const handleAccept = (id) => {
        router.post(route('farmer.accept-handshake', id), {
            miller_id: offers.find(o => o.id === id)?.interests[0]?.miller_id
        });
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Handshake Offers" />
            <div className="p-8 bg-transparent min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-2 h-8 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(5,150,105,0.4)]"></div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-none">Mill Handshake Offers</h2>
                    </div>

                    {!offers || offers.length === 0 ? (
                        <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-emerald-900/10">
                            <span className="text-4xl mb-4 opacity-50">🤝</span>
                            <p className="text-emerald-950/40 font-black uppercase tracking-widest text-[10px]">No active offers. Waiting for millers...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {offers.map((batch) => (
                                <div key={batch.id} className="glass-card p-8 relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-gray-400">Palay Variety</p>
                                            <h3 className="font-black text-3xl uppercase leading-none">{batch.rice_variety}</h3>
                                        </div>
                                        <span className="px-3 py-1 bg-yellow-400 border-2 border-black text-[10px] font-black uppercase tracking-widest animate-pulse">
                                            Handshake Pending
                                        </span>
                                    </div>

                                    <div className="bg-gray-50 border-2 border-black p-4 mb-6">
                                        <p className="text-xs uppercase font-bold text-gray-500 mb-2">Interested Miller(s):</p>
                                        <div className="flex flex-col gap-4">
                                            {(batch.interests || []).map((interest) => (
                                                <div key={interest.id} className="flex justify-between items-end border-b pb-2">
                                                    <div>
                                                        <p className="font-black text-xl text-green-700">{interest.miller?.first_name} {interest.miller?.last_name}</p>
                                                        <p className="text-xs font-bold">📍 {interest.miller?.municipality}, {interest.miller?.province}</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => router.post(route('farmer.accept-handshake', batch.id), { miller_id: interest.miller_id })}
                                                        className="bg-green-500 text-black font-black px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all uppercase text-[10px]"
                                                    >
                                                        Accept {interest.miller?.first_name}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <p className="mt-4 text-[9px] font-bold text-gray-400 uppercase italic">Note: Accepting this means you allow the miller to assign a driver to your location.</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
