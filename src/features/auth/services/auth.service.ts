import { auth, functions } from "../../../services/firebase/firebase";
import { httpsCallable } from "firebase/functions";
import { getIdTokenResult } from "firebase/auth";

export const AuthService = {
    /**
     * Get the current user's role from custom claims
     */
    getUserRole: async (): Promise<'admin' | 'seller' | 'user' | null> => {
        if (!auth.currentUser) return null;
        // Force refresh token to get latest claims
        const tokenResult = await getIdTokenResult(auth.currentUser, true);
        return (tokenResult.claims.role as 'admin' | 'seller' | 'user') || null;
    },

    /**
     * Set Custom Claims (Admin Only)
     */
    setRole: async (uid: string, role: 'admin' | 'seller' | 'user') => {
        const setCustomClaims = httpsCallable(functions, 'v1-auth-user-setCustomClaims');
        await setCustomClaims({ uid, role });
    },

    /**
     * Approve Seller Application (Admin Only)
     */
    approveSeller: async (uid: string) => {
        const processSellerApplication = httpsCallable(functions, 'v1-auth-user-processSellerApplication');
        await processSellerApplication({ uid, status: 'approved' });
    },

    /**
     * Reject Seller Application (Admin Only)
     */
    rejectSeller: async (uid: string) => {
        const processSellerApplication = httpsCallable(functions, 'v1-auth-user-processSellerApplication');
        await processSellerApplication({ uid, status: 'rejected' });
    }
};
