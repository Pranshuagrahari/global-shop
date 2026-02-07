import { useEffect, useState } from "react";
import DashboardLayout from "../../dashboard/layouts/DashboardLayout";
import { BarChart, Bar, LineChart, Line, XAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { AdminService } from "../services/admin.service";
import type { IAdminStats } from "../services/admin.service";

const AdminDashboard = () => {
    const [stats, setStats] = useState<IAdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await AdminService.getStats();
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) return <DashboardLayout title="Admin Overview"><div className="p-8 text-white">Loading stats...</div></DashboardLayout>;
    if (!stats) return <DashboardLayout title="Admin Overview"><div className="p-8 text-red-500">Failed to load stats.</div></DashboardLayout>;

    return (
        <DashboardLayout title="Admin Overview">
            <div className="p-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Total Platform Volume", value: "$1,245,300", color: "text-blue-500" },
                        { label: "Net Revenue", value: `$${stats.platformRevenue.toLocaleString()} `, color: "text-green-500" },
                        { label: "Active Sellers", value: stats.activeSellers, color: "text-purple-500" },
                        { label: "Pending Approvals", value: stats.pendingApprovals, color: "text-orange-500" },
                    ].map((item, i) => (
                        <div key={i} className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                            <div className="text-sm text-gray-500 mb-2 uppercase tracking-wider">{item.label}</div>
                            <div className={`text - 3xl font - bold ${item.color} `}>{item.value}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Daily Volume (Line Chart) */}
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center justify-between">
                            <span>Daily Volume</span>
                            <span className="text-xs text-gray-500 font-normal">Last 30 Days</span>
                        </h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.dailyVolume}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', borderColor: '#374151', color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* New vs Approved (Bar Chart) */}
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-6">Seller Status</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.sellerStatusDistribution}>
                                    <XAxis dataKey="name" stroke="#4b5563" fontSize={12} />
                                    <Tooltip
                                        cursor={{ fill: '#1f2937' }}
                                        contentStyle={{ backgroundColor: '#111', borderColor: '#374151', color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                                        {stats.sellerStatusDistribution.map((_, index) => (
                                            <Cell key={`cell - ${index} `} fill={['#f59e0b', '#10b981', '#ef4444'][index % 3]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8">
                    {/* System Health / Alerts */}
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-6">System Health</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-green-400 text-sm font-medium">All Systems Operational</span>
                                </div>
                                <span className="text-xs text-green-500/80">100% Uptime</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <span className="text-yellow-400 text-sm font-medium">High Traffic Warning</span>
                                </div>
                                <span className="text-xs text-yellow-500/80">Load &gt; 80%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
