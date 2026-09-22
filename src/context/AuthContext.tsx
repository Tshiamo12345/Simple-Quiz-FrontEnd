import { createContext, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMe } from '../api/generated/queries';


import type { MeDefaultResponse } from '../api/generated/queries/common';
//         ^^^ adjust the path + type name to whatever your generated common.ts exports

type User = MeDefaultResponse | Record<string, unknown>;

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    const { data, isLoading, refetch } = useMe(
        {},     // clientOptions
        undefined, // queryKey suffix (optional)
        {
            // 401 is expected when not logged in — don't retry it
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 min
        }
    );

    // Called by AuthPage's onSuccess, after login sets the cookie
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
            // Wipe all cached queries so nothing stale sticks around
            queryClient.clear();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user: (data as User) ?? null,
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