import { useEffect, useState } from "react";
import DashboardLayout from "../../dashboard/layouts/DashboardLayout";
import { useAuth } from "../../auth/AuthContext";
import { SellerService } from "../services/seller.service";
import type { IOrder } from "../../../shared/types";

const OrdersPage = () => {
    const { profile } = useAuth();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // if (!profile?.uid) return; // Allow viewing even if not fully auth'd for dev? No, stricter.
        if (profile?.uid) {
            // Subscribe to real-time updates
            const unsubscribe = SellerService.subscribeToOrders(profile.uid, (data) => {
                setOrders(data);
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [profile]);

    return (
        <DashboardLayout title="Live Orders">
            <div className="p-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
                        <div className="text-gray-500 text-sm mb-1">Today's Orders</div>
                        <div className="text-2xl font-bold text-white">{orders.length}</div>
                    </div>
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
                        <div className="text-gray-500 text-sm mb-1">Pending Processing</div>
                        <div className="text-2xl font-bold text-yellow-400">
                            {orders.filter(o => o.status === 'created').length}
                        </div>
                    </div>
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
                        <div className="text-gray-500 text-sm mb-1">Total Revenue</div>
                        <div className="text-2xl font-bold text-green-400">
                            ₹{orders.reduce((acc, curr) => acc + curr.totalAmount, 0)}
                        </div>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-xs text-green-400 font-medium">Live Feed</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Connecting to order stream...</div>
                    ) : orders.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No orders yet. Share your QR code to get started!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-[#111] text-gray-200 uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Items</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs">{order.id ? order.id.slice(0, 8) : 'N/A'}...</td>
                                            <td className="px-6 py-4">{order.customerName || "Guest"}</td>
                                            <td className="px-6 py-4">
                                                {order.items?.length > 0 ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-white">{order.items[0].name}</span>
                                                        {order.items.length > 1 && <span className="text-xs text-gray-500">+{order.items.length - 1} more</span>}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 italic">Direct Payment</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white">₹{order.totalAmount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold
                                                    ${order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                                                        order.status === 'created' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-gray-700 text-gray-300'}`}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs">
                                                {new Date(order.createdAt).toLocaleTimeString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OrdersPage;
