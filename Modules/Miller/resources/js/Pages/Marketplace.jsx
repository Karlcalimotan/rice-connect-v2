import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Marketplace({ batches = [] }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Palay Marketplace
                </h2>
            }
        >
            <Head title="Miller Marketplace" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {!batches || batches.length === 0 ? (
                            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
                                <p className="text-gray-500">No palay listings available right now.</p>
                            </div>
                        ) : (
                            batches.map((item) => (
                                <div key={item.id} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{item.rice_variety}</h3>
                                                <p className="text-sm text-gray-500">From: {item.user?.first_name} {item.user?.last_name}</p>
                                            </div>
                                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase">
                                                {item.condition}
                                            </span>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500 block">Weight</span>
                                                <span className="font-semibold text-gray-900">{item.total_weight} kg</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Harvested</span>
                                                <span className="font-semibold text-gray-900">{item.harvest_date}</span>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <button 
                                                className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                                            >
                                                Express Interest
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
