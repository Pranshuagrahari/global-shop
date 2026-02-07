
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import MainLayout from "./shared/layouts/MainLayout";
import AuthLayout from "./features/auth/layouts/AuthLayout";
import Home from "./pages/Home";
import Login from "./features/auth/pages/Login";
import Signup from "./features/auth/pages/Signup";
import Dashboard from "./features/dashboard/pages/Dashboard.tsx";
import ProtectedRoute from "./features/auth/components/ProtectedRoute.tsx";
import AddProduct from "./features/product/pages/AddProduct.tsx";
import AllProduct from "./features/product/pages/AllProduct.tsx";
import QrCodes from "./features/product/pages/QrCodes.tsx";
import AdminDashboard from "./features/admin/pages/AdminDashboard.tsx";
import ManageSellers from "./features/admin/pages/ManageSellers.tsx";
import FinancePage from "./features/admin/pages/FinancePage.tsx";
import AuditLogsPage from "./features/admin/pages/AuditLogsPage.tsx";
import PlatformSettings from "./features/admin/pages/PlatformSettings.tsx";
import ProductsPage from "./features/seller/pages/ProductsPage.tsx";
import PayoutsPage from "./features/seller/pages/PayoutsPage.tsx";
import QRManager from "./features/seller/pages/QRManager.tsx";
import OrdersPage from "./features/seller/pages/OrdersPage.tsx";
import PaymentPage from "./features/user/pages/PaymentPage.tsx";
import UserLayout from "./features/user/layouts/UserLayout.tsx";
import DevTools from "./components/DevTools";
import Scanner from "./components/Scanner.tsx";
import CheckoutPage from "./features/customer/pages/CheckoutPage.tsx";
import { useAuth } from "./features/auth/AuthContext.tsx";
import { useEffect } from "react";

function App() {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Auto-redirect 'user' role to /scan
    useEffect(() => {
        if (!loading && user && profile?.role === 'user') {
            // If they are on the root or dashboard, send them to scan
            if (location.pathname === '/' || location.pathname === '/dashboard') {
                navigate('/scan');
            }
        }
    }, [user, profile, loading, location.pathname, navigate]);

    return (
        <>
            <Routes>
                {/* Routes WITH navbar */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                </Route>

                {/* Routes WITHOUT navbar */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>

                {/* Customer Routes (Guest Allowed) */}
                <Route path="/scan" element={<Scanner />} />
                <Route path="/checkout" element={<CheckoutPage />} />

                {/* Legacy / Shared Routes (migrating to specific roles) */}
                <Route element={<ProtectedRoute allowedRoles={['seller', 'admin']} />}>
                    <Route path="/addproduct" element={<AddProduct />} />
                    <Route path="/allproduct" element={<AllProduct />} />
                    <Route path="/qrcodes" element={<QrCodes />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/sellers" element={<ManageSellers />} />
                    <Route path="/admin/finance" element={<FinancePage />} />
                    <Route path="/admin/risk" element={<AuditLogsPage />} />
                    <Route path="/admin/settings" element={<PlatformSettings />} />
                </Route>

                {/* Seller Routes */}
                <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
                    <Route path="/seller" element={<Dashboard />} />
                    <Route path="/seller/products" element={<ProductsPage />} />
                    <Route path="/seller/events" element={<div className="p-8 text-white">Events (Coming Soon)</div>} />
                    <Route path="/seller/qr" element={<QRManager />} />
                    <Route path="/seller/orders" element={<OrdersPage />} />
                    <Route path="/seller/payouts" element={<PayoutsPage />} />
                </Route>

                {/* User/Shared Routes */}
                <Route element={<ProtectedRoute allowedRoles={['user', 'seller']} />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                {/* User Mobile Flow */}
                <Route element={<UserLayout />}>
                    {/* /scan is handled above as standalone full-screen */}
                    <Route path="/pay" element={<PaymentPage />} />
                    <Route path="/history" element={<div className="p-4 text-center">History Coming Soon</div>} />
                    <Route path="/profile" element={<div className="p-4 text-center">Profile Coming Soon</div>} />
                </Route>
            </Routes>
            <DevTools />
        </>
    );
}


export default App;
