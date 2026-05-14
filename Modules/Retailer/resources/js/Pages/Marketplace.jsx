import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Marketplace({ available_rice = [], retailer_municipality = '' }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Rice Store
                </h2>
            }
        >
            <Head title="Retailer Marketplace" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {available_rice.length === 0 ? (
                            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
                                <p className="text-gray-500">The rice store is currently empty. Check back later!</p>
                            </div>
                        ) : (
                            available_rice.map((item, index) => (
                                <div key={index} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-gray-900">{item.rice_variety}</h3>
                                            <span className="text-lg font-bold text-green-600">
                                                ₱{item.price_per_sack}/sack
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Processed by: {item.miller_first_name} {item.miller_last_name}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Location: {item.miller_location || 'N/A'}
                                        </p>
                                        
                                        <div className="mt-4 flex items-center text-sm text-gray-600">
                                            <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            Available: {item.total_sacks} sacks
                                        </div>

                                        <div className="mt-6">
                                            <button 
                                                className="w-full inline-flex justify-center items-center px-4 py-2 bg-orange-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-700 active:bg-orange-900 focus:outline-none focus:border-orange-900 focus:ring ring-orange-300 transition ease-in-out duration-150"
                                            >
                                                Order Now
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
