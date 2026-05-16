import React from 'react';
import { router } from '@inertiajs/react';

const FleetManagement = ({ allDrivers, myFleet }) => {
    
    const handleLinkDriver = (id) => {
        router.post(route('miller.transport.link_driver', id));
    };

    const availableDrivers = (allDrivers || []).filter(d => !(myFleet || []).find(f => f.id === d.id));

    return (
        <div className="mt-12 space-y-8">
            <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-red-600 border border-black"></div>
                <h3 className="text-2xl font-black uppercase text-gray-900 tracking-tighter">Fleet Management</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-emerald-900/40 tracking-[0.3em] px-4">Authorized Drivers ({myFleet?.length || 0})</h4>
                    <div className="glass-card p-6 shadow-[10px_10px_0_0_rgba(6,95,70,0.1)] rounded-none">
                        {!myFleet || myFleet.length === 0 ? (
                            <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-emerald-900/10">
                                <span className="text-4xl mb-4 opacity-50">🚚</span>
                                <p className="text-emerald-950/40 font-black uppercase tracking-widest text-[10px]">No drivers in your fleet yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y-2 divide-gray-100/50">
                                {myFleet.map((driver) => (
                                    <div key={driver.id} className="py-4 flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-white font-black text-xs">
                                                {driver.first_name[0]}{driver.last_name[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-sm uppercase text-gray-900 leading-none mb-1">{driver.first_name} {driver.last_name}</p>
                                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{driver.vehicle_type || 'Unknown Vehicle'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-black bg-emerald-500 text-white px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">Verified</span>
                                            <p className="text-[10px] font-bold text-gray-400 mt-2">{driver.contact}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-emerald-900/40 tracking-[0.3em] px-4">Available Network ({availableDrivers.length})</h4>
                    <div className="glass-card p-6">
                        {availableDrivers.length === 0 ? (
                            <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-emerald-900/10">
                                <span className="text-4xl mb-4 opacity-50">🔍</span>
                                <p className="text-emerald-950/40 font-black uppercase tracking-widest text-[10px]">No other available drivers in the region.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {availableDrivers.map((driver) => (
                                    <div key={driver.id} className="bg-white/40 backdrop-blur-sm border-2 border-black p-4 flex justify-between items-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-black text-[10px]">
                                                {driver.first_name[0]}{driver.last_name[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-xs uppercase text-gray-900 leading-none mb-1">{driver.first_name} {driver.last_name}</p>
                                                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{driver.vehicle_type}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleLinkDriver(driver.id)}
                                            className="btn-2026 !px-6 !py-2"
                                        >
                                            Verify & Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FleetManagement;
