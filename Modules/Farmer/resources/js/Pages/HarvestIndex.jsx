import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function HarvestIndex({ batches }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        My Harvest Batches
                    </h2>
                    <Link
                        href={route('farmer.harvest.create')}
                        className="flex items-center gap-3 rounded-[1.5rem] border border-[#c3a153]/20 bg-[rgba(255,248,230,0.86)] px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-[1.1rem] bg-[#103227] text-sm font-black text-[#f6ecd1]">+</div>
                        <span className="text-sm font-semibold text-[#17362b]">Log New Harvest</span>
                    </Link>
                </div>
            }
        >
            <Head title="Farmer Harvest" />

            <div className="py-12 rc-harvest-bg">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {batches.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No harvests found</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by logging your first harvest batch.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <caption className="sr-only">Harvest batches table</caption>
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variety</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {batches.map((batch) => (
                                                <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{batch.rice_variety}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.total_weight} kg</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                            ${batch.status === 'unsold' ? 'bg-blue-100 text-blue-800' : 
                                                              batch.status === 'sold' ? 'bg-green-100 text-green-800' : 
                                                              'bg-gray-100 text-gray-800'}`}>
                                                            {batch.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.harvest_date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link href={route('farmer.harvest.edit', batch.id)} className="text-indigo-600 hover:text-indigo-900 mr-4" aria-label={`Edit harvest ${batch.id}`}>Edit</Link>
                                                        {batch.status === 'pending' && (
                                                            <button className="text-green-600 hover:text-green-900" aria-label={`Accept order for harvest ${batch.id}`}>Accept Order</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
