import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function EditHarvest({ batch }) {
    const { data, setData, patch, processing, errors } = useForm({
        rice_variety: batch?.rice_variety || '',
        harvest_date: batch?.harvest_date || '',
        condition: batch?.condition || 'fresh',
    });

    function submit(e) {
        e.preventDefault();
        patch(route('farmer.harvest.update', batch.id));
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Harvest #{batch.id}</h2>}
        >
            <Head title="Edit Harvest" />

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

                                <div className="flex items-center gap-3">
                                    <button type="submit" disabled={processing} className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md">
                                        {processing ? 'Saving…' : 'Save Changes'}
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
