import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-black text-white">
            <Sidebar sidebarOpen={sidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="h-20 border-b border-gray-800 flex items-center justify-between px-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-800 rounded-lg"
                        >
                            ☰
                        </button>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                    </div>
                    <span className="text-sm text-gray-500">Past 30 days</span>
                </div>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        {[
                            { label: "Total Revenue", value: "$21,879", rate: "↑ 3.8%" },
                            { label: "Total Orders", value: "3,207", rate: "↑ 1.1%" },
                            { label: "Active Products", value: "245", rate: "↑ 8.2%" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6"
                            >
                                <div className="text-sm text-gray-500 mb-2">{item.label}</div>
                                <div className="flex items-baseline space-x-3">
                                    <div className="text-4xl font-bold">{item.value}</div>
                                    <div className="text-green-500 text-sm font-medium">
                                        {item.rate}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chart */}
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
                        <div className="h-64 bg-gradient-to-t from-purple-900/20 to-transparent rounded-lg border border-purple-500/20 flex items-center justify-center">
              <span className="text-gray-600 text-sm">
                Chart visualization area
              </span>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {[
                                "New order from Alice Johnson",
                                'Product "Summer Collection" updated',
                            ].map((text, i) => (
                                <div
                                    key={i}
                                    className="py-3 border-b border-gray-800 text-sm text-gray-300"
                                >
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
