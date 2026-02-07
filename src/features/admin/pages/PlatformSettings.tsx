import { useState } from "react";
import DashboardLayout from "../../dashboard/layouts/DashboardLayout";

const PlatformSettings = () => {
    const [platformFee, setPlatformFee] = useState(10);
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    return (
        <DashboardLayout title="Platform Settings">
            <div className="p-8 max-w-4xl mx-auto">
                <div className="space-y-6">
                    {/* General Config */}
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-800 pb-4">General Configuration</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Platform Name</label>
                                <input type="text" value="GlobalShop" className="w-full bg-[#111] border border-gray-700 rounded px-4 py-2 text-white focus:border-indigo-500 outline-none" disabled />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Support Email</label>
                                <input type="email" defaultValue="support@globalshop.com" className="w-full bg-[#111] border border-gray-700 rounded px-4 py-2 text-white focus:border-indigo-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Financial Config */}
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-800 pb-4">Financial Settings</h2>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Platform Fee (%)</label>
                            <p className="text-xs text-gray-500 mb-3">Percentage taken from every successful transaction.</p>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    value={platformFee}
                                    onChange={(e) => setPlatformFee(Number(e.target.value))}
                                    className="w-32 bg-[#111] border border-gray-700 rounded px-4 py-2 text-white focus:border-indigo-500 outline-none"
                                />
                                <span className="text-gray-500">% per transaction</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Minimum Payout Amount</label>
                            <input type="number" defaultValue={50} className="w-full bg-[#111] border border-gray-700 rounded px-4 py-2 text-white focus:border-indigo-500 outline-none" />
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-red-500 mb-6 border-b border-red-900/30 pb-4">Danger Zone</h2>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-medium">Maintenance Mode</h3>
                                <p className="text-sm text-red-400/70">Disable all transactions and logins temporarily.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PlatformSettings;
