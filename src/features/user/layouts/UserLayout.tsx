import { Outlet, Link, useLocation } from "react-router-dom";

const UserLayout = () => {
    const location = useLocation();

    return (
        <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative">
            {/* Top Bar - Simplified for User App */}
            <div className="h-14 bg-white border-b flex items-center justify-between px-4 z-10 sticky top-0">
                <span className="font-bold text-lg text-indigo-600">GlobalPay</span>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pb-20">
                <Outlet />
            </div>

            {/* Bottom Navigation */}
            <nav className="h-16 bg-white border-t fixed bottom-0 w-full max-w-md flex justify-around items-center z-20 pb-safe">
                <Link to="/history" className={`flex flex-col items-center gap-1 ${location.pathname === '/history' ? 'text-indigo-600' : 'text-gray-400'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-medium">History</span>
                </Link>

                <Link to="/scan" className="flex flex-col items-center -mt-6">
                    <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/40 text-white transform transition-transform active:scale-95">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4c1 0 2 1 2 2v2h4m-6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 mt-1">Scan</span>
                </Link>

                <Link to="/profile" className={`flex flex-col items-center gap-1 ${location.pathname === '/profile' ? 'text-indigo-600' : 'text-gray-400'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-medium">Profile</span>
                </Link>
            </nav>
        </div>
    );
};

export default UserLayout;
