import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function MunicipalitiesManager({ auth, municipalities }) {
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, patch, delete: destroy, reset, processing, errors } = useForm({
        name: '',
        distance_index: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            patch(route('milleradmin.municipalities.update', editingId), {
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                }
            });
        } else {
            post(route('milleradmin.municipalities.store'), {
                onSuccess: () => reset()
            });
        }
    };

    const startEdit = (m) => {
        setEditingId(m.id);
        setData({
            name: m.name,
            distance_index: m.distance_index.toString(),
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Municipality Management" />
            <div className="p-6 bg-transparent min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-6 bg-rose-600 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.4)]"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-800/60">Logistics Index</p>
                            </div>
                            <h2 className="text-5xl font-black uppercase tracking-tighter text-emerald-950 leading-none">
                                Municipality Hubs
                            </h2>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="glass-card mb-12 p-2">
                        <div className="bg-white/40 rounded-[2.5rem] p-10 border border-white/60">
                            <h3 className="text-[10px] font-black uppercase mb-8 tracking-[0.3em] text-rose-600">
                                {editingId ? 'Configuration Patch' : 'Register New Hub'}
                            </h3>
                            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">Hub Primary Name</label>
                                    <input 
                                        type="text"
                                        className="input-2026"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Hub Name (e.g. Passi City)"
                                    />
                                    {errors.name && <p className="text-rose-500 text-[9px] font-black uppercase tracking-widest mt-2">{errors.name}</p>}
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">Distance Indexing</label>
                                    <input 
                                        type="number"
                                        className="input-2026"
                                        value={data.distance_index}
                                        onChange={e => setData('distance_index', e.target.value)}
                                        placeholder="Index Number"
                                    />
                                    {errors.distance_index && <p className="text-rose-500 text-[9px] font-black uppercase tracking-widest mt-2">{errors.distance_index}</p>}
                                </div>
                                <div className="flex items-end gap-3">
                                    <button 
                                        disabled={processing}
                                        className="btn-2026 flex-1 !rounded-2xl"
                                    >
                                        {editingId ? 'Push Update' : 'Register Hub'}
                                    </button>
                                    {editingId && (
                                        <button 
                                            type="button"
                                            onClick={cancelEdit}
                                            className="px-6 py-4 rounded-2xl bg-white/60 text-emerald-950/40 border border-white/80 font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all"
                                        >
                                            Abort
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="glass-card shadow-2xl p-2 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <caption className="sr-only">List of registered municipalities</caption>
                            <thead className="bg-emerald-950/90 text-white">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-black uppercase tracking-widest">Index</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-black uppercase tracking-widest">Municipality</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-black uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {municipalities.map(m => (
                                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 align-middle font-black text-2xl tracking-tighter text-rose-600">#{m.distance_index}</td>
                                        <td className="px-6 py-4 align-middle font-extrabold uppercase text-emerald-950 text-sm">{m.name}</td>
                                        <td className="px-6 py-4 align-middle text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <button 
                                                    onClick={() => startEdit(m)}
                                                    aria-label={`Edit ${m.name}`}
                                                    title={`Edit ${m.name}`}
                                                    className="w-10 h-10 inline-flex items-center justify-center bg-white/60 text-emerald-950 border border-white/80 rounded-xl shadow-sm hover:bg-white transition-all duration-300"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2.5"/></svg>
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if(confirm('Delete this municipality? This will fail if users are assigned to it.')) {
                                                            destroy(route('milleradmin.municipalities.destroy', m.id));
                                                        }
                                                    }}
                                                    aria-label={`Delete ${m.name}`}
                                                    title={`Delete ${m.name}`}
                                                    className="w-10 h-10 inline-flex items-center justify-center bg-rose-50 text-rose-700 border border-rose-200 rounded-xl shadow-sm hover:bg-rose-100 transition-all duration-300"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5"/></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
