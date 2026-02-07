import { db } from "../../../services/firebase/firebase";
import { collection, query, where, getDocs, getCountFromServer, limit } from "firebase/firestore";

// Types
export interface ISellerProfile {
    uid: string;
    email: string | null;
    status: 'pending' | 'active' | 'rejected' | 'suspended';
    role: 'seller';
    shopName?: string;
    razorpayAccountId?: string;
    createdAt: number;
    displayName?: string | null;
}

// Types specific to Admin Dashboard
export interface IAdminStats {
    totalUsers: number;
    activeSellers: number;
    pendingApprovals: number;
    platformRevenue: number;
    dailyVolume: { date: string; amount: number }[];
    sellerStatusDistribution: { name: string; value: number }[];
}

export const AdminService = {
    // Fetch Global Stats
    getStats: async (): Promise<IAdminStats> => {
        try {
            // 1. Counts
            const usersColl = collection(db, "users");
            const sellersColl = query(usersColl, where("role", "==", "seller"));
            // Efficiently count pending users (assuming role='user' implies pending seller for this context, 
            // OR we should query based on status if it exists. For now using role strategy as per previous implementation)
            const pendingColl = query(usersColl, where("role", "==", "user"));

            const totalUsersSnap = await getCountFromServer(usersColl);
            const activeSellersSnap = await getCountFromServer(sellersColl);
            const pendingSnap = await getCountFromServer(pendingColl);

            // Mocking revenue for now as we don't have a transaction history yet
            const platformRevenue = 45200;

            // Mocking Chart Data
            const dailyVolume = Array.from({ length: 30 }, (_, i) => ({
                date: `Day ${i + 1}`,
                amount: Math.floor(Math.random() * 5000) + 1000
            }));

            const sellerStatusDistribution = [
                { name: "New", value: 120 },
                { name: "Approved", value: 842 },
                { name: "Rejected", value: 45 }
            ];

            return {
                totalUsers: totalUsersSnap.data().count,
                activeSellers: activeSellersSnap.data().count,
                pendingApprovals: pendingSnap.data().count,
                platformRevenue,
                dailyVolume,
                sellerStatusDistribution
            };
        } catch (error) {
            console.error("Error fetching admin stats:", error);
            throw error;
        }
    },

    // Fetch Sellers with Pagination
    getSellers: async (): Promise<ISellerProfile[]> => {
        // In a real app we would use startAfter(lastId)
        const q = query(collection(db, "users"), limit(20));
        const snap = await getDocs(q);
        return snap.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id,
                email: data.email,
                role: 'seller', // Mocking for now as we fetch all users
                status: data.role === 'seller' ? 'active' : 'pending',
                createdAt: data.createdAt,
                displayName: data.displayName,
                // These fields might not exist on user doc yet, so we mock or optional catch them
                shopName: data.displayName || "Unknown Shop",
                razorpayAccountId: data.razorpayAccountId || "N/A"
            } as ISellerProfile;
        });
    }
};
