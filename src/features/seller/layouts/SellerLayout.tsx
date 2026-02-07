import { useState } from "react";
import { Outlet } from "react-router-dom";
// import { useAuth } from "../../auth/AuthContext";
import Sidebar from "../../../components/layout/Sidebar";

const SellerLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    // const { profile } = useAuth();

    return (
        <div className="flex h-screen bg-[#0f0f13] text-gray-100 font-sans overflow-hidden">
            {/* Reuse the main sidebar, which we will update to include Seller items */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-[#141418] border-b border-gray-800 flex items-center justify-between px-6 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-semibold text-white">Seller Console</h1>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;
