import type { ReactNode } from "react";
import { useState } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import { useAuth } from "../../auth/AuthContext";

interface DashboardLayoutProps {
    children: ReactNode;
    title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
    const { profile } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const role = profile?.role || "user";

    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar Component with RBAC logic internal to it */}
            <Sidebar sidebarOpen={sidebarOpen} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-[#1a1a1a] border-b border-gray-800 h-16 flex items-center justify-between px-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-400 hover:text-white mr-4 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-white tracking-wide">{title}</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-600/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                            {role} Account
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-black p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
