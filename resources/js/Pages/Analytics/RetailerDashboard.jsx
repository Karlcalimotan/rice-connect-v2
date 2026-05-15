import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Head } from '@inertiajs/react';

export default function RetailerAnalyticsDashboard() {
    const [turnoverData, setTurnoverData] = useState([]);
    const [heatmapData, setHeatmapData] = useState({});
    const [profitsData, setProfitsData] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/analytics/retailer/stock-turnover').then(r => r.json()),
            fetch('/api/analytics/retailer/demand-heatmap').then(r => r.json()),
            fetch('/api/analytics/retailer/profit-margins').then(r => r.json()),
            fetch('/api/analytics/retailer/summary').then(r => r.json()),
        ]).then(([turnover, heatmap, profits, sum]) => {
            setTurnoverData(turnover.data || []);
            setHeatmapData(heatmap.data || {});
            setProfitsData(profits.data || []);
            setSummary(sum.data || {});
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-6 text-center">Loading analytics...</div>;

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
            <Head title="Retailer Analytics Dashboard" />
            
            <h1 className="text-3xl font-bold mb-2 text-slate-900">Retailer Analytics Dashboard</h1>
            <p className="text-slate-600 mb-8">Monitor stock turnover, consumer demand, and profit margins</p>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                    <h3 className="text-slate-600 text-sm font-medium">Avg Turnover Rate</h3>
                    <p className="text-3xl font-bold text-slate-900">{(summary.avg_turnover_rate || 0).toFixed(1)}x</p>
                    <p className="text-xs text-slate-500 mt-1">Times per month</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <h3 className="text-slate-600 text-sm font-medium">Total Profit</h3>
                    <p className="text-3xl font-bold text-slate-900">₱{(summary.total_profit || 0).toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Monthly</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                    <h3 className="text-slate-600 text-sm font-medium">Varieties Stocked</h3>
                    <p className="text-3xl font-bold text-slate-900">{summary.varieties_stocked || 0}</p>
                    <p className="text-xs text-slate-500 mt-1">Active</p>
                </div>
            </div>

            {/* Stock Turnover */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Stock Turnover by Variety</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={turnoverData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="variety" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="turnover_rate" fill="#3b82f6" name="Turnover Rate (x/month)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Consumer Demand Heatmap */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Consumer Demand Heatmap</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-4 py-2 text-left font-semibold text-slate-900">Day / Time</th>
                                <th className="px-4 py-2 text-center font-semibold text-slate-900">Morning</th>
                                <th className="px-4 py-2 text-center font-semibold text-slate-900">Afternoon</th>
                                <th className="px-4 py-2 text-center font-semibold text-slate-900">Evening</th>
                                <th className="px-4 py-2 text-center font-semibold text-slate-900">Night</th>
                            </tr>
                        </thead>
                        <tbody>
                            {daysOrder.map((day) => (
                                <tr key={day} className="border-t">
                                    <td className="px-4 py-2 font-semibold text-slate-900">{day}</td>
                                    {['morning', 'afternoon', 'evening', 'night'].map((slot) => {
                                        const slotData = heatmapData[day]?.find(s => s.time_slot === slot);
                                        const intensity = slotData?.intensity || 'low';
                                        const intensityColor = {
                                            high: 'bg-red-500',
                                            medium: 'bg-yellow-500',
                                            low: 'bg-green-500',
                                        };
                                        return (
                                            <td key={slot} className="px-4 py-2 text-center">
                                                <div className={`${intensityColor[intensity]} text-white rounded py-1 px-2 inline-block text-xs font-semibold`}>
                                                    {slotData?.demand || 0}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Profit Margins */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Profit Margins by Variety</h2>
                <div className="space-y-3">
                    {profitsData.map((item) => (
                        <div key={item.variety} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-semibold text-slate-900">{item.variety}</h4>
                                    <p className="text-sm text-slate-600">
                                        Cost: ₱{item.cost_per_unit.toFixed(2)} → Sell: ₱{item.selling_price.toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-green-600">{item.margin_percentage.toFixed(1)}%</p>
                                    <p className="text-xs text-slate-600">Margin</p>
                                </div>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className="h-2 bg-green-500 rounded-full"
                                    style={{ width: `${Math.min(item.margin_percentage, 100)}%` }}
                                />
                            </div>
                            <div className="mt-2 text-sm text-slate-600">
                                <p>Units Sold: {item.total_units_sold.toLocaleString()} | Total Profit: ₱{item.total_profit.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
