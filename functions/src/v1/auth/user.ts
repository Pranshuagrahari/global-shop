import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import type { UserRecord } from "firebase-admin/auth";
import { IUser } from "../../shared/types";

// Trigger when a new user is created in Firebase Auth
export const onUserCreate = functions.auth.user().onCreate(async (user: UserRecord) => {
    try {
        const { uid, email, displayName, photoURL } = user;
        const createdAt = Date.now();

        // 1. Set default custom claims (role = 'user')
        await admin.auth().setCustomUserClaims(uid, { role: "user" });

        // 2. Create user profile in Firestore
        const userProfile: IUser = {
            uid,
            email: email || null,
            role: "user",
            displayName: displayName || null,
            photoURL: photoURL || null,
            createdAt,
        };

        await admin.firestore().collection("users").doc(uid).set(userProfile);

        console.log(`User created: ${uid} with role 'user'`);
    } catch (error) {
        console.error("Error creating user profile:", error);
    }
});

/**
 * Assign roles (Admin only)
 */
import { onCall, HttpsError } from "firebase-functions/v2/https";

export const setCustomClaims = onCall({ cors: true }, async (request) => {
    // 1. Auth Check
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "User must be logged in.");
    }

    // 2. Admin Check
    const callerToken = request.auth.token;

    // Allow if caller is admin OR if it's a dev environment (optional: remove dev check in prod)
    if (callerToken.role !== 'admin') {
        throw new HttpsError("permission-denied", "Only admins can set claims.");
    }

    const { uid, role } = request.data;

    if (!['admin', 'seller', 'user'].includes(role)) {
        throw new HttpsError("invalid-argument", "Invalid role");
    }

    try {
        await admin.auth().setCustomUserClaims(uid, { role });
        await admin.firestore().collection("users").doc(uid).update({ role });
        return { success: true, message: `Role ${role} assigned to ${uid}` };
    } catch (error) {
        console.error("Set claims failed", error);
        throw new HttpsError("internal", "Failed to set claims");
    }
});

/**
 * Approve Seller Application (Admin only)
 */
export const processSellerApplication = onCall({ cors: true }, async (request) => {
    if (!request.auth || request.auth.token.role !== 'admin') {
        throw new HttpsError("permission-denied", "Only admins can approve sellers.");
    }

    const { uid, status } = request.data; // status: 'approved' | 'rejected'

    if (!uid || !['approved', 'rejected'].includes(status)) {
        throw new HttpsError("invalid-argument", "Invalid arguments");
    }

    try {
        if (status === 'approved') {
            // Promote to seller
            await admin.auth().setCustomUserClaims(uid, { role: 'seller' });
            await admin.firestore().collection("users").doc(uid).update({
                role: 'seller',
                sellerStatus: 'active',
                isVerified: true
            });
        } else {
            await admin.firestore().collection("users").doc(uid).update({
                sellerStatus: 'rejected'
            });
        }

        return { success: true, status };
    } catch (error) {
        throw new HttpsError("internal", "Failed to process application");
    }
});
