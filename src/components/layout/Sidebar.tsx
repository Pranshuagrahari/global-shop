import React from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { Link } from "react-router-dom";

interface SidebarProps {
    sidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
    const { profile } = useAuth();

    const getInitial = () => {
        if (profile?.name) {
            return profile.name.charAt(0).toUpperCase();
        }
        return "?";
    };

    return (
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1a1a1a] border-r border-gray-800 flex flex-col transition-all duration-300`}>
            {/* Logo */}
            <div className="h-20 flex items-center px-6 border-b border-gray-800">
                {sidebarOpen ? (
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-black font-bold">G</span>
                        </div>
                        <span className="text-xl font-bold">GlobalShop</span>
                    </div>
                ) : (
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mx-auto">
                        <span className="text-black font-bold">G</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 overflow-y-auto">
                <div className="px-3 space-y-1">
                    <Link to="/dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {sidebarOpen && <span className="font-medium">Dashboard</span>}
                    </Link>

                    <Link to="/" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {sidebarOpen && <span className="font-medium">View site</span>}
                    </Link>

                    {sidebarOpen && <div className="pt-6 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase">Products</div>}

                    <Link to="/allproduct" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {sidebarOpen && <span className="font-medium">All Products</span>}
                        {sidebarOpen && <span className="ml-auto text-xs text-gray-500">245</span>}
                    </Link>

                    <Link to="/addproduct" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {sidebarOpen && <span className="font-medium">Add Product</span>}
                    </Link>

                    <Link to="/qrcodes" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {sidebarOpen && <span className="font-medium">QR Codes</span>}
                        {sidebarOpen && <span className="ml-auto text-xs text-gray-500">245</span>}
                    </Link>

                    {sidebarOpen && <div className="pt-6 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase">Orders</div>}

                    <Link to="/orders" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {sidebarOpen && <span className="font-medium">All Orders</span>}
                        {sidebarOpen && <span className="ml-auto text-xs text-gray-500">156</span>}
                    </Link>

                    {sidebarOpen && <div className="pt-6 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase">Analytics</div>}

                    <Link to="/reports" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {sidebarOpen && <span className="font-medium">Reports</span>}
                    </Link>

                    <Link to="/customers" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {sidebarOpen && <span className="font-medium">Customers</span>}
                    </Link>

                    {sidebarOpen && <div className="pt-6 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase">Settings</div>}

                    <Link to="/settings" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {sidebarOpen && <span className="font-medium">Shop Settings</span>}
                    </Link>
                </div>
            </nav>

            {/* User Profile */}
            <div className="border-t border-gray-800 p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="font-semibold">{getInitial()}</span>
                    </div>
                    {sidebarOpen && (
                        <div className="flex-1">
                            <div className="font-medium text-sm">{profile?.name}</div>
                            <div className="text-xs text-gray-500">{profile?.email}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;