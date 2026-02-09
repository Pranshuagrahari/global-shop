import { useState } from 'react';
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../auth/AuthContext";
import DashboardLayout from "../../dashboard/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import PaymentSuccess from "../../../components/PaymentSuccess.tsx";
import { OrderService } from "../../orders/services/order.service.ts";

const CheckoutPage = () => {
    const { itemsBySeller, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const { user, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastOrderDetails, setLastOrderDetails] = useState<{ amount: number, shopName: string } | null>(null);

    const handleCheckout = async () => {
        if (!user) {
            // Lazy Auth Trigger
            const confirmLogin = window.confirm("You need to login to complete the purchase. Login now?");
            if (confirmLogin) {
                try {
                    await loginWithGoogle();
                    // AuthContext should handle redirect or state update
                } catch (error) {
                    console.error("Login failed", error);
                }
            }
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Create Order in Backend (PENDING)
            // For MVP, we likely have one seller per checkout or split orders.
            // Simplified: Take first seller for demo.
            const sellerId = Object.keys(itemsBySeller)[0];
            const items = itemsBySeller[sellerId];
            const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const orderId = await OrderService.createOrder({
                sellerId,
                userId: user.uid,
                items,
                totalAmount: total,
                status: 'PENDING'
            });

            // 2. Simulate Payment Gateway (Razorpay)
            // In real app, open Razorpay logic here.
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating network
            const mockPaymentId = `pay_${Date.now()}`;

            // 3. Verify Payment with Backend (Sync)
            await OrderService.verifyPayment(orderId, mockPaymentId);

            // 4. Trigger Success Animation
            setLastOrderDetails({ amount: total, shopName: "Global Shop" }); // ideally fetch shop name
            setShowSuccess(true);
            clearCart();

        } catch (error) {
            console.error("Checkout Failed", error);
            alert("Checkout failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAnimationComplete = () => {
        setShowSuccess(false);
        navigate('/history'); // or /dashboard
    };

    const sellerIds = Object.keys(itemsBySeller);

    if (showSuccess && lastOrderDetails) {
        return (
            <PaymentSuccess
                amount={lastOrderDetails.amount}
                shopName={lastOrderDetails.shopName}
                onComplete={handleAnimationComplete}
            />
        );
    }

    if (sellerIds.length === 0) {
        return (
            <DashboardLayout title="Checkout">
                <div className="p-8 text-center text-gray-400">
                    Your cart is empty. <br />
                    <button onClick={() => navigate('/scan')} className="mt-4 text-indigo-400 hover:text-white">Scan Items</button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Checkout">
            <div className="p-4 max-w-2xl mx-auto pb-32">
                <h2 className="text-xl font-bold text-white mb-6">Review your Cart</h2>

                <div className="space-y-6">
                    {sellerIds.map(sellerId => (
                        <div key={sellerId} className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                            <h3 className="text-xs uppercase text-gray-500 font-bold mb-3">Seller ID: {sellerId.slice(0, 6)}...</h3>
                            <div className="space-y-3">
                                {itemsBySeller[sellerId].map(item => (
                                    <div key={item.productId} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500 overflow-hidden">
                                                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : 'IMG'}
                                            </div>
                                            <div>
                                                <div className="text-white text-sm font-medium">{item.name}</div>
                                                <div className="text-gray-500 text-xs">₹{item.price} x {item.quantity}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center bg-gray-800 rounded">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, -1)}
                                                    className="px-2 py-1 text-gray-400 hover:text-white"
                                                >-</button>
                                                <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, 1)}
                                                    className="px-2 py-1 text-gray-400 hover:text-white"
                                                >+</button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.productId)}
                                                className="text-red-400 hover:text-red-300 text-xs"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Bill */}
                <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-gray-800 p-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex justify-between text-gray-400 text-sm mb-2">
                            <span>Subtotal</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <div className="flex justify-between text-white font-bold text-lg mb-4">
                            <span>Total</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            {isProcessing ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Processing...
                                </span>
                            ) : `Pay ₹${cartTotal}`}
                            {!user && <span className="text-xs bg-black/20 px-2 py-0.5 rounded">Guest</span>}
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CheckoutPage;
