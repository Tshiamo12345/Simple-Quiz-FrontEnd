import { createContext, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMe } from '../api/generated/queries';

export type AuthUser = {
    userId: string;
    username: string;
    email: string;
    role: string; // normalized to UPPERCASE
};

const normalizeUser = (raw: any): AuthUser | null => {
    if (!raw) return null;
    return {
        userId: raw.userId ?? '',
        username: raw.username ?? '',
        email: raw.email ?? '',
        role: (raw.role ?? '').toUpperCase(),
    };
};

type AuthContextValue = {
    user: AuthUser | null;
    loading: boolean;
    login: () => Promise<AuthUser | null>;   // <-- returns the fresh user
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

    const login = async (): Promise<AuthUser | null> => {
        const result = await refetch();
        return normalizeUser(result.data);
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
                user: normalizeUser(data),
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