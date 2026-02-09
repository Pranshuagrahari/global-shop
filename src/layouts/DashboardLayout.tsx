// DashboardLayout.tsx
import { useState, type ReactNode } from "react";
import Sidebar from "../components/layout/Sidebar";

interface DashboardLayoutProps {
    children: ReactNode;
    title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex w-full h-screen bg-black text-white">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="h-20 border-b border-gray-800 flex items-center justify-between px-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-3xl font-bold">{title}</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Past 30 days</span>
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;