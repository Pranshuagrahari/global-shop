import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase/firebase";
import { useAuth } from "../features/auth/AuthContext";

const DevTools = () => {
    const { user, profile } = useAuth();
    const [loading, setLoading] = useState(false);

    const switchRole = async (newRole: 'user' | 'seller' | 'admin') => {
        if (!user) return;
        setLoading(true);
        try {
            await updateDoc(doc(db, "users", user.uid), {
                role: newRole
            });
            alert(`Role updated to ${newRole}. Please refresh the page.`);
        } catch (err) {
            console.error(err);
            alert("Failed to update role");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-2xl z-50 text-white">
            <h3 className="font-bold mb-2">Dev Tools (Current: {profile?.role})</h3>
            <div className="flex space-x-2">
                <button
                    onClick={() => switchRole('user')}
                    disabled={loading}
                    className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-xs"
                >
                    User
                </button>
                <button
                    onClick={() => switchRole('seller')}
                    disabled={loading}
                    className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-700 text-xs"
                >
                    Seller
                </button>
                <button
                    onClick={() => switchRole('admin')}
                    disabled={loading}
                    className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-xs"
                >
                    Admin
                </button>
            </div>
        </div>
    );
};

export default DevTools;
