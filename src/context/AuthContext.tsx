import { createContext, useContext, useState, type ReactNode } from 'react';

type AuthContextValue = {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
};

const authStorageKey = 'simplequiz-authenticated';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() =>
        sessionStorage.getItem(authStorageKey) === 'true'
    );

    const login = () => {
        sessionStorage.setItem(authStorageKey, 'true');
        setIsAuthenticated(true);
    };

    const logout = () => {
        sessionStorage.removeItem(authStorageKey);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside an AuthProvider');
    }

    return context;
}

export { AuthProvider, useAuth };
