'use client';
import {
    createContext,
    useState,
    useContext,
    ReactNode,
    useCallback,
    useMemo,
    useEffect
} from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await fetch('/api/auth/verify');
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error verifying user:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

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

    // --- FUNCIÓN LOGOUT ACTUALIZADA ---
    const logout = useCallback(async () => {
        try {
            // 1. Llama a la API para destruir la cookie
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            // 2. Limpia el estado y redirige sin importar el resultado de la API
            setUser(null);
            router.push('/login');
        }
    }, [router]);

    const contextValue = useMemo(() => ({
        user,
        loading,
        login,
        logout
    }), [user, loading, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}