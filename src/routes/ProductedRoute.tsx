import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

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

    // If logged in → allow access
    return <Outlet />;
};

export default ProtectedRoute;
