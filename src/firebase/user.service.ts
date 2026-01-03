import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface AppUser {
    uid: string;
    email: string | null;
    role: "customer" | "shopOwner";
    createdAt: number;
}

/**
 * Create user profile in Firestore
 */
export const createUserProfile = async (uid: string, data: any) => {
    await setDoc(doc(db, "users", uid), data);
};

/**
 * Get user profile
 */
export const getUserProfile = async (uid: string) => {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
    uid: string,
    data: Partial<AppUser>
) => {
    await updateDoc(doc(db, "users", uid), data);
};
