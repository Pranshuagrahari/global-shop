import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard.tsx";
import ProtectedRoute from "./routes/ProductedRoute.tsx";
import AddProduct from "./pages/AddProduct.tsx";
import AllProduct from "./pages/AllProduct.tsx";
import QrCodes from "./pages/QrCode.tsx";

function App() {
    return (
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
            <Route element={<ProtectedRoute />}>
                <Route element={<AuthLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/addproduct" element={<AddProduct/>} />
                    <Route path="/allproduct" element={<AllProduct/>} />
                    <Route path="/qrcodes" element={<QrCodes/>} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
