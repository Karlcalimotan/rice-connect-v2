import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React from 'react';

export default function ProcessedInventory({ auth, inventory }) {
    
    const handleListForSale = (id) => {
        const price = window.prompt("Enter Selling Price per SACK (₱):");
        if (price === null) return;
        
        const priceVal = parseFloat(price);
        
        if (!isNaN(priceVal) && priceVal > 0) {
            router.post(route('miller.list_for_sale', id), {
                price_per_sack: priceVal,
            });
        } else {
            alert("Please enter a valid numeric amount.");
        }
    };

    const handleUpdateThreshold = (id, current) => {
        const threshold = window.prompt("Enter new Low Stock Threshold:", String(current));
        
        if (threshold !== null) {
            const thresholdVal = parseInt(threshold);
            if (!isNaN(thresholdVal) && thresholdVal >= 0) {
                router.patch(route('miller.update_threshold', id), {
                    low_stock_threshold: thresholdVal
                });
            } else {
                alert("Please enter a valid number.");
            }
        }
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Processed Rice" />
            <div className="p-6 bg-transparent min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-2 h-8 bg-green-600 border border-black"></div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-none">
                            Finished Rice Stock
                        </h2>
                    </div>
                
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {inventory && inventory.length > 0 ? (
                            inventory.map((item) => (
                                <div key={item.id} className="glass-card p-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="bg-green-600 text-white text-[10px] inline-block px-2 py-1 uppercase font-black border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            {item.price_per_sack ? 'Listed for Sale' : 'Ready to List'}
                                        </div>
                                        <span className="text-xs font-black text-gray-400">#{item.id}</span>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase mb-2">{item.rice_variety}</h3>
                                    
                                    <div className="bg-white/30 backdrop-blur-md border-2 border-black p-3 space-y-2 mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black uppercase text-gray-400">Sacks Available</span>
                                            <div className="flex items-center gap-2">
                                                {item.total_sacks <= item.low_stock_threshold ? (
                                                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black uppercase border border-red-300 animate-pulse">
                                                        ⚠️ LOW
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black uppercase border border-green-300">
                                                        ✅ GOOD
                                                    </span>
                                                )}
                                                <span className="font-bold text-green-600 text-lg">{item.total_sacks}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                                            <span className="text-[10px] font-black uppercase text-gray-400">Alert Threshold</span>
                                            <button 
                                                onClick={() => handleUpdateThreshold(item.id, item.low_stock_threshold)}
                                                className="text-[10px] font-bold text-blue-600 underline uppercase"
                                            >
                                                Edit: {item.low_stock_threshold}
                                            </button>
                                        </div>
                                        {item.price_per_sack && (
                                            <div className="flex justify-between border-t border-gray-200 pt-2">
                                                <span className="text-[10px] font-black uppercase text-gray-400">Price/Sack</span>
                                                <span className="font-black text-green-600">₱{Number(item.price_per_sack).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {!item.price_per_sack ? (
                                        <button 
                                            onClick={() => handleListForSale(item.id)}
                                            className="btn-2026 w-full text-center !bg-yellow-600 hover:!bg-yellow-700"
                                        >
                                            💰 List for Sale
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleListForSale(item.id)}
                                            className="btn-2026 w-full text-center !bg-blue-600 hover:!bg-blue-700"
                                        >
                                            ✏️ Update Price
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full glass-card p-12 text-center">
                                <p className="text-emerald-950/40 font-black uppercase tracking-widest text-[10px]">No finished rice in stock. Mill some palay first!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
