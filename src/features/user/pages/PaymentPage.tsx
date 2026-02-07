import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentPage = () => {
    const [searchParams] = useSearchParams();
    const sellerId = searchParams.get("sellerId");
    const initialAmount = searchParams.get("amount");

    const [amount, setAmount] = useState(initialAmount || "");
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        if (!amount || Number(amount) <= 0) return;
        setLoading(true);
        // Simulate Payment
        setTimeout(() => {
            setLoading(false);
            alert(`Payment of ₹${amount} to Seller ${sellerId} Successful!`);
        }, 1500);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-gray-400">
                    S
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">Paying Shop ID: {sellerId?.slice(0, 6)}...</h1>
                <p className="text-sm text-gray-500 mb-8">Verified Merchant</p>

                <div className="w-full max-w-xs relative mb-8">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-400">₹</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        readOnly={!!initialAmount}
                        placeholder="0"
                        className="w-full text-center text-5xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-indigo-600 outline-none pb-2 pl-6 bg-transparent"
                    />
                </div>

                <div className="w-full max-w-xs space-y-3">
                    <button
                        onClick={handlePay}
                        disabled={loading || !amount}
                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>Pay Now</span>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-400">Secured wait 256-bit encryption</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
