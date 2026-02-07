import { useEffect, useState } from "react";
import DashboardLayout from "../../dashboard/layouts/DashboardLayout";
import { AdminService } from "../services/admin.service";
import type { ISellerProfile } from "../services/admin.service";
import { AuthService } from "../../auth/services/auth.service";

const ManageSellers = () => {
    const [sellers, setSellers] = useState<ISellerProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeller, setSelectedSeller] = useState<ISellerProfile | null>(null);

    useEffect(() => {
        const loadSellers = async () => {
            try {
                const data = await AdminService.getSellers();
                setSellers(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadSellers();
    }, []);

    const updateStatus = async (uid: string, status: 'active' | 'rejected') => {
        try {
            if (status === 'active') {
                await AuthService.approveSeller(uid);
            } else {
                await AuthService.rejectSeller(uid);
            }
            // Optimistic update
            setSellers(sellers.map(s => s.uid === uid ? { ...s, status } : s));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    if (loading) return <DashboardLayout title="Manage Sellers"><div className="p-8 text-white">Loading...</div></DashboardLayout>;

    return (
        <DashboardLayout title="Manage Sellers">
            <div className="p-8">
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-[#111] text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Shop Name</th>
                                <th className="px-6 py-4">Owner Email</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Razorpay ID</th>
                                <th className="px-6 py-4">Joined Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {sellers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">No sellers found.</td>
                                </tr>
                            ) : (
                                sellers.map((seller) => (
                                    <tr key={seller.uid} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-900/50 text-indigo-400 flex items-center justify-center font-bold">
                                                    {seller.shopName?.charAt(0).toUpperCase() || "S"}
                                                </div>
                                                <div>
                                                    <div>{seller.shopName}</div>
                                                    <div className="text-xs text-gray-500 font-mono">UID: {seller.uid.slice(0, 6)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{seller.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                                ${seller.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                                                    seller.status === 'active' ? 'bg-green-500/10 text-green-400' :
                                                        'bg-yellow-500/10 text-yellow-400'}`}>
                                                {seller.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">{seller.razorpayAccountId || "Pending"}</td>
                                        <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                                            {new Date(seller.createdAt || Date.now()).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {seller.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(seller.uid, 'active')}
                                                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(seller.uid, 'rejected')}
                                                            className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 rounded text-xs font-medium transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => setSelectedSeller(seller)}
                                                    className="text-gray-400 hover:text-white"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            {selectedSeller && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg max-w-md w-full p-6 relative">
                        <button
                            onClick={() => setSelectedSeller(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold mb-4">Seller Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Shop Name</label>
                                <div className="text-white">{selectedSeller.shopName}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Email</label>
                                <div className="text-white">{selectedSeller.email}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Razorpay Account</label>
                                <div className="text-white font-mono">{selectedSeller.razorpayAccountId || "Not Connected"}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Status</label>
                                <div className="text-white">{selectedSeller.status}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Joined</label>
                                <div className="text-white">{new Date(selectedSeller.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setSelectedSeller(null)}
                                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ManageSellers;
