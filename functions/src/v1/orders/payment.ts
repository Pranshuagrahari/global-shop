import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Ensure admin is initialized (usually done in index.ts, but good practice to be safe or rely on global init)
if (!admin.apps.length) {
    admin.initializeApp();
}

export const verifyPayment = onCall({ cors: true }, async (request) => {
    const { orderId, paymentId } = request.data;

    if (!orderId || !paymentId) {
        throw new HttpsError('invalid-argument', 'Missing orderId or paymentId');
    }

    try {
        // 1. Verify with Razorpay (Mocked for now)
        // const isValid = await RazorpayClient.verify(paymentId);
        const isValid = true; // Simulating success

        if (!isValid) {
            throw new HttpsError('permission-denied', 'Payment verification failed');
        }

        // 2. Update Firestore Order
        const orderRef = admin.firestore().collection('orders').doc(orderId);

        await orderRef.update({
            status: 'PAID',
            paymentId: paymentId,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, message: "Order verified and updated" };

    } catch (error) {
        console.error("Payment Verification Error", error);
        throw new HttpsError('internal', 'Failed to verify payment');
    }
});
