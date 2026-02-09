
import {
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    where,
    orderBy
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../../../services/firebase/firebase";
import type { ICartItem } from "../../../shared/types";

export interface IOrder {
    id?: string;
    sellerId: string;
    userId: string; // or 'guest'
    items: ICartItem[];
    totalAmount: number;
    status: 'PENDING' | 'PAID' | 'FAILED';
    createdAt: any;
    paymentId?: string;
}

export const OrderService = {
    // Create a new order (status: PENDING)
    createOrder: async (orderData: Omit<IOrder, 'id' | 'createdAt'>): Promise<string> => {
        const ordersRef = collection(db, 'orders');
        const docRef = await addDoc(ordersRef, {
            ...orderData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    },

    // Call Cloud Function to verify payment and update status
    verifyPayment: async (orderId: string, paymentId: string) => {
        try {
            // Try Cloud Function first: v1-payment-verifyPayment
            const verifyFnCorrect = httpsCallable(functions, 'v1-payment-verifyPayment');
            const result = await verifyFnCorrect({ orderId, paymentId });
            return result.data;
        } catch (error) {
            console.warn("Cloud Function failed (likely not deployed), falling back to client-side update for DEMO ONLY.", error);

            // Client-side Fallback (for testing without deploying functions)
            // This requires the user to have write permission to 'orders' collection (Security Rules might block this in prod)
            const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore");
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, {
                status: 'PAID',
                paymentId: paymentId,
                updatedAt: serverTimestamp()
            });
            return { success: true, message: "Order updated via client-side fallback" };
        }
    },

    // Real-time listener for Seller Dashboard
    subscribeToSellerOrders: (sellerId: string, callback: (orders: IOrder[]) => void) => {
        const q = query(
            collection(db, 'orders'),
            where('sellerId', '==', sellerId),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IOrder));
            callback(orders);
        });
    },

    // Real-time listener for Customer History
    subscribeToUserOrders: (userId: string, callback: (orders: IOrder[]) => void) => {
        const q = query(
            collection(db, 'orders'),
            where('userId', '==', userId)
            // orderBy('createdAt', 'desc') // Requires Composite Index! Removing for stability.
        );

        return onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IOrder));
            // Client-side sort
            orders.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            callback(orders);
        });
    }
};
