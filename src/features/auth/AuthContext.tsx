import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, type User } from "firebase/auth";
import { auth } from "../../services/firebase/firebase";
import { getUserProfile } from "../../services/firebase/user.service";
import type { IUser } from "../../shared/types";

interface AuthContextType {
    user: User | null;
    profile: IUser | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    loginWithGoogle: async () => { },
});

export const AuthProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<IUser | null>(null); // Use IUser type
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                // Fetch profile separately
                try {
                    const userProfile = await getUserProfile(firebaseUser.uid);
                    // Force cast or ensure getUserProfile returns IUser compatible
                    setProfile(userProfile as IUser);
                } catch (e) {
                    console.error("Failed to fetch profile", e);
                }
            } else {
                setUser(null);
                setProfile(null);
            }

            setLoading(false);
        });

        return () => unsub();
    }, []);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
