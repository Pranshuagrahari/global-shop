import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AuthProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </AuthProvider>
    </BrowserRouter>,
)
