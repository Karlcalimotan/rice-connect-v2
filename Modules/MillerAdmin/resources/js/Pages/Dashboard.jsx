import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function Dashboard({ auth, users, batches, orders, municipalities }) {
    const { delete: destroy } = useForm();

    const deleteBatch = (id) => {
        if (confirm('Permanently delete this record? This action is only allowed for processed records hidden by the farmer for 30+ days.')) {
            destroy(route('admin.harvest_batches.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Admin Logistics Hub" />

            <div className="p-6 bg-gray-50 min-h-screen font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-8 bg-emerald-600 rounded-full"></div>
                                <h1 className="text-6xl font-black uppercase tracking-tighter text-emerald-950 leading-none">
                                    Admin Hub
                                </h1>
                            </div>
                            <p className="text-emerald-900/40 font-bold uppercase tracking-widest text-[10px]">System-Wide Logistics & User Management</p>
                        </div>
                        
                        <div className="flex gap-4">
                            <Link 
                                href={route('admin.municipalities.index')}
                                className="bg-white border-4 border-black px-6 py-3 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 transition-all active:scale-95"
                            >
                                Manage Geography
                            </Link>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: 'Active Users', value: users?.length || 0, color: 'bg-blue-400' },
                            { label: 'Harvest Batches', value: batches?.length || 0, color: 'bg-yellow-400' },
                            { label: 'Retailer Orders', value: orders?.length || 0, color: 'bg-green-400' },
                            { label: 'Municipalities', value: municipalities?.length || 0, color: 'bg-purple-400' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">{stat.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-black">{stat.value}</p>
                                    <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Users Hub */}
                        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                            <div className="bg-black p-4 flex justify-between items-center">
                                <h3 className="text-white font-black uppercase tracking-widest text-xs">User Directory</h3>
                                <span className="text-[10px] text-white/50 font-bold uppercase">Latest Onboarded</span>
                            </div>
                            <div className="divide-y-2 divide-gray-100 max-h-[500px] overflow-y-auto">
                                {users?.map(user => (
                                    <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-black text-sm uppercase">{user.first_name} {user.last_name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">{user.email}</p>
                                            </div>
                                            <span className="px-2 py-0.5 border-2 border-black text-[9px] font-black uppercase bg-gray-100">
                                                {user.role}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-3">
                                            <p className="text-[9px] font-black text-emerald-600 uppercase">{user.municipality || 'N/A'}</p>
                                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase italic">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Harvest Logs Hub */}
                        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                            <div className="bg-black p-4 flex justify-between items-center">
                                <h3 className="text-white font-black uppercase tracking-widest text-xs">Palay Flow Control</h3>
                                <span className="text-[10px] text-white/50 font-bold uppercase">Recent Batches</span>
                            </div>
                            <div className="divide-y-2 divide-gray-100 max-h-[500px] overflow-y-auto">
                                {batches?.map(batch => (
                                    <div key={batch.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[9px] font-black bg-black text-white px-1">#{batch.id}</span>
                                                    <p className="font-black text-sm uppercase">{batch.rice_variety}</p>
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-bold">Farmer: {batch.user?.first_name} {batch.user?.last_name}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-2 py-0.5 border-2 border-black text-[9px] font-black uppercase ${
                                                    batch.status === 'milled' ? 'bg-green-400' : 'bg-yellow-400'
                                                }`}>
                                                    {batch.status.replace('_', ' ')}
                                                </span>
                                                
                                                {batch.status === 'milled' && (
                                                    <button 
                                                        onClick={() => deleteBatch(batch.id)}
                                                        className="text-[9px] font-black text-red-500 uppercase underline hover:text-red-700"
                                                    >
                                                        Delete Record
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
