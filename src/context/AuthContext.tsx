'use client';
import {
    createContext,
    useState,
    useContext,
    ReactNode,
    useCallback,
    useMemo
} from 'react';
import { useRouter } from 'next/navigation';

// 1. Define la estructura de los datos que manejará el contexto
interface User {
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

// 2. Crea el Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Crea el Componente "Proveedor"
export function AuthProvider({ children }: { readonly children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const login = useCallback(async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                router.push('/dashboard');
            } else {
                throw new Error('Las credenciales son inválidas');
            }
        } catch (error) {
            console.error("Error en el login:", error);
            throw error;
        }
    }, [router]);

    const logout = useCallback(() => {
        // Aquí iría la llamada a una API de logout que invalide la cookie
        setUser(null);
        router.push('/login');
    }, [router]);

    const contextValue = useMemo(() => ({
        user,
        login,
        logout
    }), [user, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// 4. Crea un Hook personalizado para consumir el contexto fácilmente
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}