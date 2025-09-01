// Define la estructura de un objeto de usuario
export interface User {
  email: string;
  role: string;
}

// Define la estructura del valor que provee nuestro AuthContext
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}