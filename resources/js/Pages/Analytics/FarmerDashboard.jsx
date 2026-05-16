import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function FarmerAnalyticsDashboard() {
    const [yieldData, setYieldData] = useState([]);
    const [healthData, setHealthData] = useState({});
    const [pricesData, setPricesData] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('/api/analytics/data')
            .then((res) => res.json())
            .then((data) => {
                setYieldData(data.yieldData || []);
                setHealthData(data.healthData || {});
                setPricesData(data.pricesData || []);
                setSummary(data.summary || {});
            })
            .catch((e) => console.error('Failed to fetch analytics:', e))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-6 text-center">Loading analytics...</div>;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Farmer Analytics
                </h2>
            }
        >
            <Head title="Farmer Analytics Dashboard" />
            
            <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
                <Link
                    href={route('dashboard')}
                    className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6 transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold mb-2 text-slate-900">Farmer Analytics Dashboard</h1>
                <p className="text-slate-600 mb-8">Track your yield performance, crop health, and market prices</p>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                        <h3 className="text-slate-600 text-sm font-medium">Total Yield</h3>
                        <p className="text-3xl font-bold text-slate-900">{(summary.total_yield_kg || 0).toLocaleString()}</p>
                        <p className="text-xs text-slate-500 mt-1">kg</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <h3 className="text-slate-600 text-sm font-medium">Avg Crop Health</h3>
                        <p className="text-3xl font-bold text-slate-900">{(summary.avg_crop_health || 0).toFixed(1)}%</p>
                        <p className="text-xs text-slate-500 mt-1">Score</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                        <h3 className="text-slate-600 text-sm font-medium">Varieties</h3>
                        <p className="text-3xl font-bold text-slate-900">{summary.varieties_grown || 0}</p>
                        <p className="text-xs text-slate-500 mt-1">Growing</p>
                    </div>
                </div>

                {/* Yield vs Target Chart */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Yield vs Target Performance</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={yieldData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="variety" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="target" fill="#94a3b8" name="Target (kg)" />
                            <Bar dataKey="actual" fill="#22c55e" name="Actual (kg)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Crop Health Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {Object.entries(healthData).map(([variety, trends]) => (
                        <div key={variety} className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">{variety} Health Trend</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={trends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="health" stroke="#3b82f6" strokeWidth={2} name="Health Score" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ))}

                    {Object.keys(healthData).length === 0 && (
                        <div className="col-span-1 lg:col-span-2 text-center text-slate-500 py-10">
                            No crop health data found.
                        </div>
                    )}
                </div>

                {/* Market Prices */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Market Prices (30-day comparison)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {pricesData.map((price) => (
                            <div key={price.variety} className="border border-slate-200 rounded-lg p-4">
                                <h4 className="font-semibold text-slate-900">{price.variety}</h4>
                                <p className="text-2xl font-bold text-green-600 mt-2">₱{price.current_price.toFixed(2)}</p>
                                <div className="text-xs text-slate-600 mt-2">
                                    <p>Avg (30d): ₱{price.avg_price_30d.toFixed(2)}</p>
                                    <p>
                                        Min: ₱{price.min_price.toFixed(2)} | Max: ₱{price.max_price.toFixed(2)}
                                    </p>
                                    <p
                                        className={`mt-1 font-semibold ${price.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        Trend: {price.trend === 'up' ? '📈 Up' : '📉 Down'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pricesData.length === 0 && (
                        <div className="text-center text-slate-500 mt-6">No market prices found.</div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

