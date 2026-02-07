import React from "react";
import { useAuth } from "../../features/auth/AuthContext";
import { Link, useLocation } from "react-router-dom";
import type { UserRole } from "../../shared/types";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen?: (open: boolean) => void;
}

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    roles: UserRole[];
    badge?: string | number;
}

const NAV_ITEMS: NavItem[] = [
    // Common
    {
        label: "Home",
        path: "/",
        roles: ["user", "seller"], // Admin has their own dashboard
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )
    },
    // Seller
    {
        label: "Overview",
        path: "/seller",
        roles: ["seller"],
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )
    },
    {
        label: "Products",
        path: "/seller/products",
        roles: ["seller"],
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        )
    },
    {
        label: "QR Manager",
        path: "/seller/qr",
        roles: ["seller"],
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4c1 0 2 1 2 2v2h4m-6 0a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        )
    },
    {
        label: "Orders",
        path: "/seller/orders",
        roles: ["seller"],
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        )
    },
    {
        label: "Payouts",
        path: "/seller/payouts",
        roles: ["seller"],
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        )
    },
    // User
    {
        label: "My Orders",
        path: "/history",
        roles: ["user"],
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        )
    },
    // Admin
    {
        label: "Overview",
        path: "/admin",
        roles: ["admin"],
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        )
    },
    {
        label: "Manage Sellers",
        path: "/admin/sellers",
        roles: ["admin"],
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        )
    },
    {
        label: "Finance",
        path: "/admin/finance",
        roles: ["admin"],
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        label: "Risk & Audit",
        path: "/admin/risk",
        roles: ["admin"],
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        )
    },
    {
        label: "Settings",
        path: "/admin/settings",
        roles: ["admin"],
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    },
    {
        label: "Scan QR",
        path: "/scan",
        roles: ["user"],
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4c1 0 2 1 2 2v2h4m-6 0a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        )
    }
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
    const { profile, loading } = useAuth();
    const location = useLocation();

    // Default to 'user' if no role found, or maybe 'seller' for dev convenience if needed.
    // Ideally strictly follow profile.role
    const userRole = profile?.role || "user";

    // Filter items based on role
    // OR if userRole is missing, show nothing or public items?
    const filteredItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));

    const getInitial = () => {
        if (profile?.displayName) {
            return profile.displayName.charAt(0).toUpperCase();
        }
        return "?";
    };

    if (loading) {
        return <div className="w-20 bg-[#0f0f13] border-r border-gray-800 h-screen"></div>;
    }

    return (
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#0f0f13] border-r border-gray-800 flex flex-col transition-all duration-300 h-screen sticky top-0`}>
            {/* Logo */}
            <div className="h-20 flex items-center px-6 border-b border-gray-800">
                {sidebarOpen ? (
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <span className="text-white font-bold">G</span>
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">GlobalShop</span>
                    </div>
                ) : (
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
                        <span className="text-white font-bold">G</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
                <div className="px-3 space-y-1">
                    {filteredItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path + item.label}
                                to={item.path}
                                className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-indigo-600/10 text-indigo-400"
                                    : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                                    }`}
                            >
                                <div className={`${isActive ? "text-indigo-500" : "text-gray-500 group-hover:text-gray-300"}`}>
                                    {item.icon}
                                </div>
                                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                                {sidebarOpen && item.badge && (
                                    <span className="ml-auto text-xs font-semibold bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User Profile */}
            <div className="border-t border-gray-800 p-4 bg-[#141418]">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white ring-2 ring-[#1a1a1a]">
                        <span className="font-semibold">{getInitial()}</span>
                    </div>
                    {sidebarOpen && (
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-white truncate">{profile?.displayName || 'User'}</div>
                            <div className="text-xs text-gray-400 truncate">{profile?.email}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;