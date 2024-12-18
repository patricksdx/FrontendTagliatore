import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";

import Login from "./pages/login";
import Register from "./pages/register";
import HomePage from "./pages/HomePage";
import Ordenes from "./pages/Ordenes";
import Meseros from "./pages/Meseros";
import Clientes from "./pages/Clientes";
import Platillos from "./pages/Platillos";
import Chat from "./pages/Chat";

import SidebarNavigation from "./components/sidebar_navegation";
import { useEffect } from "react";

function ProtectedRoute({ element }) {
    const { isAuthenticated } = useAuth();

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return element;
}

function Layout() {
    const location = useLocation();
    const { isAuthenticated } = useAuth(); // Obtén el estado de autenticación

    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

    // Si no está autenticado y no estamos en una página de autenticación, redirigir al login
    if (!isAuthenticated && !isAuthPage) {
        return <Navigate to="/login" />;
    }

    return (
        <div style={{ display: "flex" }}>
            {/* Si no estamos en login ni register, mostrar Sidebar */}
            {!isAuthPage && <SidebarNavigation />}
            <div style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/Ordenes" element={<ProtectedRoute element={<Ordenes />} />} />
                    <Route path="/Meseros" element={<ProtectedRoute element={<Meseros />} />} />
                    <Route path="/Clientes" element={<ProtectedRoute element={<Clientes />} />} />
                    <Route path="/Platillos" element={<ProtectedRoute element={<Platillos />} />} />
                    <Route path="/Chat" element={<ProtectedRoute element={<Chat />} />} />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Rutas de login y register sin sidebar */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Rutas con Sidebar */}
                    <Route path="*" element={<Layout />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;