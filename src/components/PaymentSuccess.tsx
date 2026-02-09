import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

const PaymentSuccess = ({ amount, shopName, onComplete }: { amount: number, shopName: string, onComplete: () => void }) => {
    // Basic window size fallback
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);

        // Haptic Feedback
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }

        // Auto redirect after 3.5s
        const timer = setTimeout(() => {
            onComplete();
        }, 3500);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-600 overflow-hidden">
            <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={200} recycle={false} />

            <div className="relative flex flex-col items-center justify-center text-white z-10 p-8 text-center">
                {/* Circle Animation */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        duration: 0.5
                    }}
                    className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl"
                >
                    {/* Checkmark Drawing Animation */}
                    <svg className="w-20 h-20 text-green-600" viewBox="0 0 50 50">
                        <motion.path
                            fill="none"
                            strokeWidth="4"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M 10 25 L 22 38 L 40 12"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
                        />
                    </svg>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                >
                    <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                    <p className="text-xl text-green-100">₹{amount} paid to {shopName}</p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.4 }}
                    className="mt-12"
                >
                    <p className="text-sm opacity-80">Redirecting...</p>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
