import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Head } from '@inertiajs/react';

export default function MillerAnalyticsDashboard() {
    const [efficiencyData, setEfficiencyData] = useState([]);
    const [recoveryData, setRecoveryData] = useState([]);
    const [storageData, setStorageData] = useState(null);
    const [queueData, setQueueData] = useState({});
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const endpoints = {
            efficiency: '/api/analytics/miller/processing-efficiency',
            recovery: '/api/analytics/miller/recovery-rates',
            storage: '/api/analytics/miller/storage-utilization',
            queue: '/api/analytics/miller/milling-queue',
            summary: '/api/analytics/miller/summary',
        };

        const fetchJson = async (url) => {
            const res = await fetch(url);
            return res.json();
        };

        Promise.allSettled([
            fetchJson(endpoints.efficiency).catch((e) => {
                console.error('Efficiency endpoint failed:', endpoints.efficiency, e);
                throw e;
            }),
            fetchJson(endpoints.recovery).catch((e) => {
                console.error('Recovery endpoint failed:', endpoints.recovery, e);
                throw e;
            }),
            fetchJson(endpoints.storage).catch((e) => {
                console.error('Storage endpoint failed:', endpoints.storage, e);
                throw e;
            }),
            fetchJson(endpoints.queue).catch((e) => {
                console.error('Queue endpoint failed:', endpoints.queue, e);
                throw e;
            }),
            fetchJson(endpoints.summary).catch((e) => {
                console.error('Summary endpoint failed:', endpoints.summary, e);
                throw e;
            }),
        ])
            .then((results) => {
                const [eff, rec, storage, queue, sum] = results;

                setEfficiencyData(eff.status === 'fulfilled' ? (eff.value?.data || []) : []);
                setRecoveryData(rec.status === 'fulfilled' ? (rec.value?.data || []) : []);
                setStorageData(storage.status === 'fulfilled' ? storage.value?.data : null);
                setQueueData(queue.status === 'fulfilled' ? (queue.value?.data || {}) : {});
                setSummary(sum.status === 'fulfilled' ? (sum.value?.data || {}) : {});
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    if (loading) return <div className="p-6 text-center">Loading analytics...</div>;

    const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];
    const storageStatus = {
        critical: '#ef4444',
        warning: '#f59e0b',
        normal: '#22c55e',
    };

    return (
        <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
            <Head title="Miller Analytics Dashboard" />
            
            <h1 className="text-3xl font-bold mb-2 text-slate-900">Miller Analytics Dashboard</h1>
            <p className="text-slate-600 mb-8">Monitor processing efficiency, recovery rates, and milling queues</p>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                    <h3 className="text-slate-600 text-sm font-medium">Total Processed</h3>
                    <p className="text-3xl font-bold text-slate-900">{(summary.total_processed_kg || 0).toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">kg</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <h3 className="text-slate-600 text-sm font-medium">Avg Recovery Rate</h3>
                    <p className="text-3xl font-bold text-slate-900">{(summary.avg_recovery_rate || 0).toFixed(1)}%</p>
                    <p className="text-xs text-slate-500 mt-1">Efficiency</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                    <h3 className="text-slate-600 text-sm font-medium">Queued Batches</h3>
                    <p className="text-3xl font-bold text-slate-900">{summary.queued_batches || 0}</p>
                    <p className="text-xs text-slate-500 mt-1">Pending</p>
                </div>
            </div>

            {/* Processing Efficiency Chart */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Processing Efficiency Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={efficiencyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="recovery_rate" stroke="#22c55e" name="Recovery Rate (%)" />
                        <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#3b82f6" name="Efficiency Score" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Recovery Rates and Storage Utilization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Recovery Rates */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Recovery Rate Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={recoveryData}
                                dataKey="batch_count"
                                nameKey="recovery_rate"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {recoveryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Storage Utilization */}
                {storageData && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Storage Capacity</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-slate-600 text-sm mb-2">Utilization Rate</p>
                                <div className="w-full bg-slate-200 rounded-full h-4">
                                    <div
                                        className="h-4 rounded-full transition-all"
                                        style={{
                                            width: `${storageData.utilization_rate}%`,
                                            backgroundColor: storageStatus[storageData.status],
                                        }}
                                    />
                                </div>
                                <p className="text-right text-sm text-slate-600 mt-1">{storageData.utilization_rate}%</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-600 text-xs">Total Capacity</p>
                                    <p className="text-xl font-bold text-slate-900">{(storageData.total_capacity_kg / 1000).toFixed(1)}</p>
                                    <p className="text-xs text-slate-500">tons</p>
                                </div>
                                <div>
                                    <p className="text-slate-600 text-xs">Current Stock</p>
                                    <p className="text-xl font-bold text-slate-900">{(storageData.current_stock_kg / 1000).toFixed(1)}</p>
                                    <p className="text-xs text-slate-500">tons</p>
                                </div>
                            </div>
                            <div className={`text-center p-3 rounded-lg text-white font-semibold ${storageStatus[storageData.status]}`}>
                                Status: {storageData.status.toUpperCase()}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Milling Queue */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Milling Queue</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-slate-600 text-sm">Pending</p>
                        <p className="text-2xl font-bold text-blue-600">{queueData.summary?.pending || 0}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                        <p className="text-slate-600 text-sm">Processing</p>
                        <p className="text-2xl font-bold text-yellow-600">{queueData.summary?.processing || 0}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                        <p className="text-slate-600 text-sm">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{queueData.summary?.completed || 0}</p>
                    </div>
                </div>
                {queueData.pending_queue && queueData.pending_queue.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Next in Queue</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {queueData.pending_queue.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-slate-900">{item.palay_kg} kg</p>
                                        <p className="text-xs text-slate-600">Priority: {item.priority} | Waiting: {item.hours_waiting}h</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
