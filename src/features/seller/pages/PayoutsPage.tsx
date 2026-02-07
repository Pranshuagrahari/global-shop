import { useState, useEffect } from "react";
import DashboardLayout from "../../dashboard/layouts/DashboardLayout";
import { useAuth } from "../../auth/AuthContext";
import { SellerService } from "../services/seller.service";
import type { ISellerProfile } from "../../../shared/types";

const PayoutsPage = () => {
    const { profile } = useAuth();
    const [sellerProfile, setSellerProfile] = useState<ISellerProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            if (profile?.uid) {
                const data = await SellerService.getProfile(profile.uid);
                setSellerProfile(data);
                setLoading(false);
            }
        };
        loadProfile();
    }, [profile]);

    const handleConnectRazorpay = async () => {
        if (!profile?.uid) return;
        setLoading(true);
        // Simulate connection delay
        setTimeout(async () => {
            await SellerService.connectRazorpay(profile.uid);
            const data = await SellerService.getProfile(profile.uid);
            setSellerProfile(data);
            setLoading(false);
            alert("Razorpay Setup Complete!");
        }, 1500);
    };

    return (
        <DashboardLayout title="Payouts & Settings">
            <div className="p-8">
                <div className="max-w-3xl mx-auto space-y-6">

                    {/* Razorpay Status Card */}
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-blue-500">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                            </span>
                            Payment Gateway
                        </h3>

                        {loading ? (
                            <div className="animate-pulse h-20 bg-gray-800 rounded"></div>
                        ) : sellerProfile?.razorpayAccountId ? (
                            <div className="bg-green-500/10 border border-green-500/20 rounded p-4 flex items-center justify-between">
                                <div>
                                    <div className="text-green-400 font-semibold flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Razorpay Connected
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1 font-mono">Account ID: {sellerProfile.razorpayAccountId}</div>
                                </div>
                                <button className="text-gray-500 hover:text-white text-sm">Manage</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-200 text-sm">
                                    ⚠️ You cannot receive payments until you connect your Razorpay account.
                                </div>
                                <button
                                    onClick={handleConnectRazorpay}
                                    className="w-full py-3 bg-[#3395ff] hover:bg-[#287acc] text-white font-bold rounded flex items-center justify-center gap-2 transition-colors"
                                >
                                    Connect with Razorpay
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Simple Profile View */}
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Business Info</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="text-gray-500">Business Name</label>
                                <div className="text-white font-medium">{sellerProfile?.businessName || profile?.displayName || "N/A"}</div>
                            </div>
                            <div>
                                <label className="text-gray-500">Email</label>
                                <div className="text-white font-medium">{profile?.email}</div>
                            </div>
                            <div>
                                <label className="text-gray-500">Status</label>
                                <div className="text-white font-medium capitalize">{sellerProfile?.status || "Pending"}</div>
                            </div>
                            <div>
                                <label className="text-gray-500">Joined</label>
                                <div className="text-white font-medium">
                                    {new Date(sellerProfile?.createdAt || 0).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default PayoutsPage;
