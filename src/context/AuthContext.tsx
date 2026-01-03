import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { getUserProfile } from "../firebase/user.service";

interface UserProfile {
    name: string;
    email: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
});

export const AuthProvider = ({
                                 children,
                             }: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);

                const userProfile:any = await getUserProfile(firebaseUser.uid);
                setProfile(userProfile);
            } else {
                setUser(null);
                setProfile(null);
            }

            setLoading(false);
        });

        return () => unsub();
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
