import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';

const ProfilePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const auth = getAuth();

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.displayName || '');
    const [saving, setSaving] = useState(false);

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/login');
    };

    const handleSaveProfile = async () => {
        if (!auth.currentUser || !newName.trim()) return;
        setSaving(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: newName
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 px-1">My Profile</h1>

            {/* Profile Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col items-center">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold mb-4">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                </div>

                {isEditing ? (
                    <div className="w-full space-y-3">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Full Name"
                        />
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-gray-900">{user?.displayName || "User"}</h2>
                        <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-sm text-indigo-600 font-medium hover:underline"
                        >
                            Edit Profile
                        </button>
                    </>
                )}
            </div>

            {/* Account Actions */}
            <div className="space-y-3">
                <button className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between text-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                        <span className="font-medium">Help & Support</span>
                    </div>
                    <span className="text-gray-400">›</span>
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between text-red-600"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <span className="font-medium">Log Out</span>
                    </div>
                </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">Version 1.0.0</p>
        </div>
    );
};

export default ProfilePage;
