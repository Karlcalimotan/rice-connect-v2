import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateHarvest() {
    const { data, setData, post, processing, errors, reset } = useForm({
        rice_variety: '',
        harvest_date: '',
        condition: 'fresh',
        location: '',
        total_sacks: 1,
    });

    function submit(e) {
        e.preventDefault();
        post(route('farmer.harvest.store'));
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Log New Harvest</h2>}
        >
            <Head title="Log Harvest" />

            <div className="py-6">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Rice variety</label>
                                    <input
                                        value={data.rice_variety}
                                        onChange={(e) => setData('rice_variety', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.rice_variety && <p className="text-sm text-red-600">{errors.rice_variety}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Harvest date</label>
                                    <input
                                        type="date"
                                        value={data.harvest_date}
                                        onChange={(e) => setData('harvest_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.harvest_date && <p className="text-sm text-red-600">{errors.harvest_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Condition</label>
                                    <select
                                        value={data.condition}
                                        onChange={(e) => setData('condition', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    >
                                        <option value="fresh">Fresh</option>
                                        <option value="ready">Ready</option>
                                    </select>
                                    {errors.condition && <p className="text-sm text-red-600">{errors.condition}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Total sacks</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={data.total_sacks}
                                        onChange={(e) => setData('total_sacks', parseInt(e.target.value || 1))}
                                        className="mt-1 block w-36 rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.total_sacks && <p className="text-sm text-red-600">{errors.total_sacks}</p>}
                                </div>

                                <div className="flex items-center gap-3">
                                    <button type="submit" disabled={processing} className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md">
                                        {processing ? 'Logging…' : 'Log Harvest'}
                                    </button>
                                    <Link href={route('farmer.harvest')} className="text-sm text-gray-600">Back</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
