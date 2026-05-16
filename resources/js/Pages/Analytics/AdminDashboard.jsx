import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AdminAnalyticsDashboard() {
    const [supplyChain, setSupplyChain] = useState([]);
    const [volumeData, setVolumeData] = useState({});
    const [bottlenecks, setBottlenecks] = useState([]);
    const [deliveryPerf, setDeliveryPerf] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('/api/analytics/data')
            .then(res => res.json())
            .then(data => {
                setSupplyChain(data.supplyChain || []);
                setVolumeData(data.volumeData || {});
                setBottlenecks(data.bottlenecks || []);
                setDeliveryPerf(data.deliveryPerf || []);
                setSummary(data.summary || {});
            })
            .catch(e => console.error('Failed to fetch admin analytics:', e))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-6 text-center">Loading analytics...</div>;

    const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    const severityColor = {
        critical: '#ef4444',
        high: '#f59e0b',
        medium: '#eab308',
        low: '#22c55e',
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Analytics
                </h2>
            }
        >
            <Head title="Admin Analytics Dashboard" />
            
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

                <h1 className="text-3xl font-bold mb-2 text-slate-900">Supply Chain Analytics - Admin Dashboard</h1>
                <p className="text-slate-600 mb-8">Bird's eye view of the entire Rice Connect supply chain</p>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                        <h3 className="text-slate-600 text-sm font-medium">Total Volume</h3>
                        <p className="text-3xl font-bold text-slate-900">{(summary.total_volume_kg / 1000 / 1000).toFixed(1)}</p>
                        <p className="text-xs text-slate-500 mt-1">Million kg</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <h3 className="text-slate-600 text-sm font-medium">Active Regions</h3>
                        <p className="text-3xl font-bold text-slate-900">{summary.regions_active || 0}</p>
                        <p className="text-xs text-slate-500 mt-1">Municipalities</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                        <h3 className="text-slate-600 text-sm font-medium">Total Actors</h3>
                        <p className="text-3xl font-bold text-slate-900">{(summary.total_actors || 0).toLocaleString()}</p>
                        <p className="text-xs text-slate-500 mt-1">Users</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                        <h3 className="text-slate-600 text-sm font-medium">Bottleneck Score</h3>
                        <p className="text-3xl font-bold text-slate-900">{(summary.avg_bottleneck_score || 0).toFixed(1)}</p>
                        <p className="text-xs text-slate-500 mt-1">Average</p>
                    </div>
                </div>

                {/* Volume Moved Trend */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Rice Volume Moved (30-day trend)</h2>
                    {volumeData.trend_30d && (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={volumeData.trend_30d}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => (value / 1000).toFixed(1) + ' tons'} />
                                <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} name="Volume (kg)" />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                    {volumeData.summary && (
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            <div className="bg-slate-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-slate-600">Today</p>
                                <p className="text-lg font-bold text-slate-900">{(volumeData.summary.today / 1000).toFixed(0)}</p>
                                <p className="text-xs text-slate-500">tons</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-slate-600">This Week</p>
                                <p className="text-lg font-bold text-slate-900">{(volumeData.summary.week / 1000).toFixed(0)}</p>
                                <p className="text-xs text-slate-500">tons</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-slate-600">This Month</p>
                                <p className="text-lg font-bold text-slate-900">{(volumeData.summary.month / 1000).toFixed(0)}</p>
                                <p className="text-xs text-slate-500">tons</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-slate-600">This Year</p>
                                <p className="text-lg font-bold text-slate-900">{(volumeData.summary.year / 1000 / 1000).toFixed(1)}</p>
                                <p className="text-xs text-slate-500">M tons</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Regional Overview and Supply Chain Health */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Supply Chain Health */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Regional Supply Chain Health</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {supplyChain.map((region) => (
                                <div key={region.region} className="border border-slate-200 rounded-lg p-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{region.region}</h4>
                                            <p className="text-xs text-slate-600">
                                                F: {region.actors.farmers} | M: {region.actors.millers} | R: {region.actors.retailers}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold text-white`} style={{backgroundColor: severityColor[region.health]}}>
                                            {region.health.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Volume: {(region.total_volume_kg / 1000).toFixed(0)} tons | Bottleneck: {region.bottleneck_score}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Performance */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Delivery Performance (60 days)</h3>
                        {deliveryPerf && deliveryPerf.length > 0 && (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={deliveryPerf}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis yAxisId="left" label={{ value: 'Delivery Rate (%)', angle: -90, position: 'insideLeft' }} />
                                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Delay (hours)', angle: 90, position: 'insideRight' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line yAxisId="left" type="monotone" dataKey="delivery_rate" stroke="#22c55e" name="Delivery Rate (%)" strokeWidth={2} />
                                    <Line yAxisId="right" type="monotone" dataKey="avg_delay_hours" stroke="#ef4444" name="Avg Delay (hours)" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Regional Bottlenecks */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Regional Distribution Bottlenecks</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <caption className="sr-only">Regional distribution bottlenecks</caption>
                            <thead>
                                <tr className="bg-slate-50">
                                    <th scope="col" className="px-4 py-2 text-left font-semibold text-slate-900">Region</th>
                                    <th scope="col" className="px-4 py-2 text-center font-semibold text-slate-900">Avg Delay (hrs)</th>
                                    <th scope="col" className="px-4 py-2 text-center font-semibold text-slate-900">Delay Rate</th>
                                    <th scope="col" className="px-4 py-2 text-center font-semibold text-slate-900">Shipments</th>
                                    <th scope="col" className="px-4 py-2 text-center font-semibold text-slate-900">Volume</th>
                                    <th scope="col" className="px-4 py-2 text-center font-semibold text-slate-900">Severity</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bottlenecks.map((bottleneck) => (
                                    <tr key={bottleneck.region} className="hover:bg-slate-50">
                                        <td className="px-4 py-2 font-semibold text-slate-900">{bottleneck.region}</td>
                                        <td className="px-4 py-2 text-center">{bottleneck.avg_delay_hours.toFixed(1)}</td>
                                        <td className="px-4 py-2 text-center">{bottleneck.delay_rate_percentage.toFixed(1)}%</td>
                                        <td className="px-4 py-2 text-center">{bottleneck.total_shipments}</td>
                                        <td className="px-4 py-2 text-center">{(bottleneck.volume_kg / 1000).toFixed(0)} tons</td>
                                        <td className="px-4 py-2 text-center">
                                            <span className="px-2 py-1 rounded text-xs font-semibold text-white" style={{backgroundColor: severityColor[bottleneck.severity]}}>
                                                {bottleneck.severity.toUpperCase()}
                                            </span>
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
