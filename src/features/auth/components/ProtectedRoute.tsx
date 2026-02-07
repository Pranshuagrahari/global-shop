import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

import type { UserRole } from "../../../shared/types";

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user, profile, loading } = useAuth();

    // Optional: show loader while checking auth
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <span className="text-lg font-medium">Checking authentication...</span>
            </div>
        );
    }

    // If NOT logged in → redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If roles are specified, check if user has required role
    if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        // Validation: If Admin tries to access User/Seller routes, redirect to Admin Dashboard
        if (profile.role === 'admin' && !allowedRoles.includes('admin')) {
            return <Navigate to="/admin" replace />;
        }

        // Validation: If Seller/User tries to access Admin routes, redirect to Dashboard
        if (profile.role !== 'admin' && allowedRoles.includes('admin')) {
            return <Navigate to="/dashboard" replace />;
        }

        return <div className="p-8 text-center text-red-500">Unauthorized Access. Required Role: {allowedRoles.join(', ')}</div>;
    }

    // If logged in → allow access
    return <Outlet />;
};

export default ProtectedRoute;
