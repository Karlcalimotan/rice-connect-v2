import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ palayAssignments = [], riceAssignments = [], history = {} }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Logistics Dashboard
                </h2>
            }
        >
            <Head title="Driver Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    {/* Active Pickups (Farmer -> Miller) */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Palay Pickup Assignments</h3>
                        </div>
                        <div className="p-6">
                            {palayAssignments.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No pending palay pickups assigned.</p>
                            ) : (
                                <div className="space-y-4">
                                    {palayAssignments.map(p => (
                                        <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg border-blue-100 bg-blue-50">
                                            <div>
                                                <p className="font-bold text-blue-900">{p.rice_variety}</p>
                                                <p className="text-sm text-blue-700">
                                                    From: {p.user?.first_name} {p.user?.last_name} (Farmer) → Miller
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">Status: {p.delivery_status}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-200 text-blue-800 text-xs rounded-full font-semibold">
                                                {p.delivery_status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Active Deliveries (Miller -> Retailer) */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Rice Delivery Assignments</h3>
                        </div>
                        <div className="p-6">
                            {riceAssignments.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No pending rice deliveries assigned.</p>
                            ) : (
                                <div className="space-y-4">
                                    {riceAssignments.map(d => (
                                        <div key={d.id} className="flex items-center justify-between p-4 border rounded-lg border-purple-100 bg-purple-50">
                                            <div>
                                                <p className="font-bold text-purple-900">{d.rice_variety} ({d.sacks} sacks)</p>
                                                <p className="text-sm text-purple-700">
                                                    To: {d.retailer?.first_name} {d.retailer?.last_name} (Retailer)
                                                </p>
                                                <p className="text-xs text-purple-600 mt-1">Status: {d.delivery_status}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-purple-200 text-purple-800 text-xs rounded-full font-semibold">
                                                {d.delivery_status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
