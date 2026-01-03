import {useState} from 'react';
import {Link} from 'react-router-dom'
import {useAuth} from "../../context/AuthContext.tsx";
import {logoutUser} from "../../firebase/auth.service";


const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const {user,profile} = useAuth();
    console.log(user);
    const getInitial = () => {
        if (profile?.name) {
            return profile.name.charAt(0).toUpperCase();
        }
        return "?";
    };

    return (
        <nav className="bg-white border-b shadow-sm">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
            <span className="text-xl font-bold text-indigo-600">
              GlobalShop
            </span>
                    </div>
                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6">
                        <NavLink label="Home"/>
                        <NavLink label="Dashboard"/>
                        <NavLink label="Orders"/>
                        <NavLink label="Profile"/>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                >
                                    Signup
                                </Link>
                            </>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-gray-100"
                                >
                                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                        {getInitial()}
                                    </div>
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg border">
                                        <div className="px-4 py-3 text-sm">
                                            <p className="font-medium">{profile?.name}</p>
                                            <p className="font-medium">{profile?.email}</p>
                                            <p className="text-gray-500 text-xs">
                                                Logged in
                                            </p>
                                        </div>
                                        <div className="border-t">
                                            <button
                                                onClick={logoutUser}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
                        className="md:hidden rounded-md p-2 hover:bg-gray-100"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t bg-white px-4 pb-4">
                    <div className="flex flex-col space-y-3 pt-4">
                        <NavLink label="Home"/>
                        <NavLink label="Dashboard"/>
                        <NavLink label="Orders"/>
                        <NavLink label="Profile"/>
                        <button className="text-left text-sm font-medium text-gray-700">
                            Login
                        </button>
                        <button className="rounded-md bg-indigo-600 py-2 text-sm font-medium text-white">
                            Sign Up
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar

/* ---------------- Sub Component ---------------- */

interface NavLinkProps {
    label: string;
}

const NavLink: React.FC<NavLinkProps> = ({label}) => {
    return (
        <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-indigo-600"
        >
            {label}
        </a>
    );
};