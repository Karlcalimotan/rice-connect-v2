import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

export default function ShippingSettings({ auth, settings, municipalities, current_municipality_id }) {
    const { data, setData, patch, processing, errors } = useForm({
        base_delivery_fee: settings?.base_delivery_fee || 0,
        extra_fee_per_municipality: settings?.extra_fee_per_municipality || 0,
        municipality_id: current_municipality_id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('miller.shipping_settings.update'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Logistics Settings
                </h2>
            }
        >
            <Head title="Miller Logistics Settings" />

            <div className="p-6 bg-gray-50 min-h-screen font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-2 h-8 bg-emerald-600 rounded-full"></div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-none">
                            Logistics Configuration
                        </h2>
                    </div>

                    <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
                        <form onSubmit={submit} className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-3">
                                    Base Station (Miller Location)
                                </label>
                                <select
                                    value={data.municipality_id}
                                    onChange={(e) => setData('municipality_id', e.target.value)}
                                    className="w-full border-4 border-black p-4 text-lg font-bold focus:ring-0 focus:border-emerald-500 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                >
                                    <option value="">Select Municipality</option>
                                    {municipalities.map((muni) => (
                                        <option key={muni.id} value={muni.id}>
                                            {muni.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.municipality_id && <p className="text-red-500 text-xs mt-2 font-bold">{errors.municipality_id}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-3">
                                        Base Delivery Fee (₱)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.base_delivery_fee}
                                        onChange={(e) => setData('base_delivery_fee', e.target.value)}
                                        className="w-full border-4 border-black p-4 text-2xl font-black focus:ring-0 focus:border-emerald-500 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    />
                                    <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase italic">Initial fee for any delivery</p>
                                    {errors.base_delivery_fee && <p className="text-red-500 text-xs mt-2 font-bold">{errors.base_delivery_fee}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-3">
                                        Distance Adder (₱ / KM)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.extra_fee_per_municipality}
                                        onChange={(e) => setData('extra_fee_per_municipality', e.target.value)}
                                        className="w-full border-4 border-black p-4 text-2xl font-black focus:ring-0 focus:border-emerald-500 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    />
                                    <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase italic">Added fee per regional distance index</p>
                                    {errors.extra_fee_per_municipality && <p className="text-red-500 text-xs mt-2 font-bold">{errors.extra_fee_per_municipality}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#064e3b] text-white py-6 px-4 text-xl font-black uppercase tracking-widest hover:bg-[#053a2c] transition-all active:scale-95 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 mt-10 block border-4 border-black"
                            >
                                {processing ? 'Saving...' : 'Update Logistics Engine'}
                            </button>
                        </form>
                    </div>

                    <div className="mt-12 bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex gap-4">
                            <span className="text-3xl">💡</span>
                            <div>
                                <h4 className="font-black uppercase text-sm mb-1 text-black">Calculation Tip</h4>
                                <p className="text-xs font-bold text-black/70 leading-relaxed uppercase">
                                    Delivery Price = Base Fee + (Distance Index * Adder). <br />
                                    This ensures fair pricing for far-flung retailers while maintaining baseline profitability.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
