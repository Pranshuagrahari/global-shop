import React from "react";

interface SidebarProps {
    sidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
    return (
        <div
            className={`${
                sidebarOpen ? "w-64" : "w-20"
            } bg-[#1a1a1a] border-r border-gray-800 flex flex-col transition-all duration-300`}
        >
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
                    <SidebarItem label="Dashboard" active sidebarOpen={sidebarOpen} />
                    <SidebarItem label="View site" sidebarOpen={sidebarOpen} />

                    {sidebarOpen && (
                        <div className="pt-6 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase">
                            Products
                        </div>
                    )}
                    <SidebarItem label="All Products" count="245" sidebarOpen={sidebarOpen} />
                    <SidebarItem label="Add Product" sidebarOpen={sidebarOpen} />

                    {sidebarOpen && (
                        <div className="pt-6 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase">
                            Orders
                        </div>
                    )}
                    <SidebarItem label="All Orders" count="156" sidebarOpen={sidebarOpen} />

                    {sidebarOpen && (
                        <div className="pt-6 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase">
                            Analytics
                        </div>
                    )}
                    <SidebarItem label="Reports" sidebarOpen={sidebarOpen} />
                    <SidebarItem label="Customers" sidebarOpen={sidebarOpen} />

                    {sidebarOpen && (
                        <div className="pt-6 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase">
                            Settings
                        </div>
                    )}
                    <SidebarItem label="Shop Settings" sidebarOpen={sidebarOpen} />
                </div>
            </nav>

            {/* User Profile */}
            <div className="border-t border-gray-800 p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="font-semibold">JD</span>
                    </div>
                    {sidebarOpen && (
                        <div>
                            <div className="font-medium text-sm">John Doe</div>
                            <div className="text-xs text-gray-500">john@example.com</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

/* ---------- Helper ---------- */

interface SidebarItemProps {
    label: string;
    sidebarOpen: boolean;
    active?: boolean;
    count?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
                                                     label,
                                                     sidebarOpen,
                                                     active,
                                                     count,
                                                 }) => {
    return (
        <a
            href="#"
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors
        ${
                active
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
        >
            <div className="w-5 h-5 bg-gray-600 rounded" />
            {sidebarOpen && <span className="font-medium">{label}</span>}
            {sidebarOpen && count && (
                <span className="ml-auto text-xs text-gray-500">{count}</span>
            )}
        </a>
    );
};
