import { createContext, useContext, useState, useEffect } from 'react';
import { registerRequest, loginRequest } from '../api/auth';

// Crea un contexto para la autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // Corregido: ahora es un estado válido
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Verifica si el usuario ya está autenticado al cargar la app
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            // Opcional: podrías decodificar el token para establecer el usuario
        }
        setLoading(false);
    }, []);

    const signup = async (userData) => {
        try {
            const res = await registerRequest(userData);
            const token = res.data.token; // Extraemos el token de la respuesta
            localStorage.setItem('token', token); // Guardamos el token en localStorage
            setUser(res.data); // Actualizamos el estado del usuario
            setIsAuthenticated(true); // Marcamos al usuario como autenticado
            return res;
        } catch (error) {
            console.error("Error during registration:", error);
            throw new Error('Registration failed');
        }
    };

    const login = async (loginData) => {
        try {
            const res = await loginRequest(loginData); // Llamamos a loginRequest
            const token = res.data.token; // Suponiendo que el token viene en la respuesta
            localStorage.setItem('token', token); // Guardamos el token en localStorage
            setIsAuthenticated(true); // Marcamos al usuario como autenticado
            // Opcional: podrías establecer el usuario aquí también si viene en la respuesta
            setUser(res.data.user); // Suponiendo que la API devuelve un usuario en res.data.user
            return res;
        } catch (error) {
            console.error("Error during login:", error);
            throw new Error('Login failed');
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem('token'); // Eliminamos el token al cerrar sesión
        setIsAuthenticated(false); // Marcamos al usuario como no autenticado
        setUser(null); // Limpiamos el estado del usuario
    };

    // Si aún se está verificando la autenticación, no renderizar nada
    if (loading) {
        return null; // Podrías mostrar un spinner aquí si es necesario
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook para usar el contexto
export function useAuth() {
    return useContext(AuthContext);
}