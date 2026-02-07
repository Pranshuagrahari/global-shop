import DashboardLayout from "../../dashboard/layouts/DashboardLayout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', revenue: 4000, commission: 2400 },
    { name: 'Feb', revenue: 3000, commission: 1398 },
    { name: 'Mar', revenue: 2000, commission: 9800 },
    { name: 'Apr', revenue: 2780, commission: 3908 },
    { name: 'May', revenue: 1890, commission: 4800 },
    { name: 'Jun', revenue: 2390, commission: 3800 },
    { name: 'Jul', revenue: 3490, commission: 4300 },
];

const FinancePage = () => {
    return (
        <DashboardLayout title="Financial Overview">
            <div className="p-8">
                {/* Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                        <div className="text-gray-400 text-sm mb-1">Total Platform Volume</div>
                        <div className="text-3xl font-bold text-white">$1,245,300</div>
                        <div className="text-green-500 text-xs mt-2">↑ 12% vs last month</div>
                    </div>
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                        <div className="text-gray-400 text-sm mb-1">Net Commissions</div>
                        <div className="text-3xl font-bold text-green-400">$124,530</div>
                        <div className="text-green-500 text-xs mt-2">10% Take Rate</div>
                    </div>
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                        <div className="text-gray-400 text-sm mb-1">Pending Payouts</div>
                        <div className="text-3xl font-bold text-orange-400">$12,400</div>
                        <div className="text-gray-500 text-xs mt-2">45 Sellers Waiting</div>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Revenue Trends
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorCm" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#4b5563" />
                                <YAxis stroke="#4b5563" />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                                    itemStyle={{ color: '#e5e7eb' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRv)" />
                                <Area type="monotone" dataKey="commission" stroke="#82ca9d" fillOpacity={1} fill="url(#colorCm)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800">
                        <h3 className="text-lg font-medium text-white">Global Ledger</h3>
                    </div>
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-[#111111] text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">Transaction ID</th>
                                <th className="px-6 py-3">Seller</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-mono text-xs">TXN-{1000 + i}</td>
                                    <td className="px-6 py-4">TechStore Inc.</td>
                                    <td className="px-6 py-4">Commission Credit</td>
                                    <td className="px-6 py-4 text-right font-medium text-green-400">+$124.50</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-full text-xs">Completed</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FinancePage;
