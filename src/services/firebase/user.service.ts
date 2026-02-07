import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

import type { IUser } from "../../shared/types";

// Re-export for compatibility if needed, or just use IUser
export type AppUser = IUser;


/**
 * Create user profile in Firestore
 */
export const createUserProfile = async (uid: string, data: any) => {
    await setDoc(doc(db, "users", uid), data);
};

/**
 * Get user profile
 */
export const getUserProfile = async (uid: string): Promise<IUser | null> => {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    return { uid: snap.id, ...data } as IUser;
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
