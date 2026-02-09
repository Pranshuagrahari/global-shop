import { useEffect, useState } from 'react';
import { OrderService } from '../../orders/services/order.service';
import { useAuth } from '../../auth/AuthContext';
import type { IOrder } from '../../../shared/types';

const HistoryPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = OrderService.subscribeToUserOrders(user.uid, (data) => {
            setOrders(data as any);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) {
        return (
            <div className="p-4 space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-white p-4 rounded-xl shadow-sm h-32"></div>
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Orders Yet</h3>
                <p className="text-gray-500 mt-2">Your purchase history will appear here.</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 px-1">Order History</h1>

            {orders.map((order) => (
                <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            {/* Ideally fetch Shop Name via SellerID, mostly mock for now or stored in order */}
                            <h3 className="font-bold text-gray-900">Shop #{order.sellerId.slice(0, 5)}...</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {order.createdAt ? new Date(order.createdAt as any).toLocaleString() : 'Just now'}
                                {/* Casting createdAt because sometimes it might be Timestamp during dev */}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                            order.status === 'created' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {order.status.toUpperCase()}
                        </span>
                    </div>

                    <div className="space-y-3 mb-4">
                        {order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    <span className="font-medium text-gray-900">{item.quantity}x</span> {item.name}
                                </span>
                                <span className="text-gray-900">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                        {order.items.length > 2 && (
                            <div className="text-xs text-gray-400 italic">
                                +{order.items.length - 2} more items...
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Total Paid</span>
                        <span className="text-lg font-bold text-indigo-600">₹{order.totalAmount}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryPage;
