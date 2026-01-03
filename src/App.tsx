import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

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
        </Routes>
    );
}

export default App;
