import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import { logoutUser } from "../../firebase/auth.service";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, profile } = useAuth();

    const getInitial = () => {
        if (profile?.name) {
            return profile.name.charAt(0).toUpperCase();
        }
        return "?";
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                            G
                        </div>
                        <span className="text-xl font-bold text-gray-900">
              Global<span className="text-indigo-600">Shop</span>
            </span>
                    </div>

                    {/* Auth Section */}
                    <div className="hidden md:flex items-center space-x-3">
                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow"
                                >
                                    Signup
                                </Link>
                            </>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 transition"
                                >
                                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                        {getInitial()}
                                    </div>
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-3 w-60 rounded-xl bg-white shadow-xl border overflow-hidden animate-fade-in">
                                        <div className="px-4 py-3">
                                            <p className="text-sm font-semibold text-gray-800">
                                                {profile?.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {profile?.email}
                                            </p>
                                        </div>
                                        <div className="border-t">
                                            <button
                                                onClick={logoutUser}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden rounded-lg p-2 hover:bg-gray-100 transition"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t shadow-lg">
                    <div className="flex flex-col space-y-4 px-4 py-6">
                        <NavLink label="Home" />
                        <NavLink label="Dashboard" />
                        <NavLink label="Orders" />
                        <NavLink label="Profile" />

                        {!user && (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white text-center"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

/* ---------------- NavLink Component ---------------- */

interface NavLinkProps {
    label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ label }) => {
    return (
        <a
            href="#"
            className="relative text-sm font-medium text-gray-700 hover:text-indigo-600 transition after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-indigo-600 hover:after:w-full after:transition-all"
        >
            {label}
        </a>
    );
};
