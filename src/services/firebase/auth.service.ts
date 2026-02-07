import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Register a new user
 */
export const signupUser = async (
    email: string,
    password: string
): Promise<User> => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return res.user;
};

/**
 * Login existing user
 */
export const loginUser = async (
    email: string,
    password: string
): Promise<User> => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
    await signOut(auth);
};

const googleProvider = new GoogleAuthProvider();


export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        return {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
        };
    } catch (error) {
        console.error("Google login error:", error);
        throw error;
    }
};