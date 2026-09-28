import { createContext, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMe } from '../api/generated/queries';

// Shape of GET /api/auth/me
export type AuthUser = {
    userId: string;
    username: string;
    email: string;
    role: string; // "USER" | "ADMIN" | ...
};

type AuthContextValue = {
    user: AuthUser | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    const { data, isLoading, refetch } = useMe(
        {},
        undefined,
        {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
        }
    );

    const login = async () => {
        await refetch();
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } finally {
            queryClient.clear();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user: (data as AuthUser | undefined) ?? null,
                loading: isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};