import { useAuth } from './AuthContext';

export const ROLES = {
    ADMIN: 'ADMIN',
    TEACHER: 'TEACHER',
    USER: 'USER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function useRole() {
    const { user } = useAuth();
    const role = user?.role ?? null;

    return {
        role,
        isAdmin: role === ROLES.ADMIN,
        isTeacher: role === ROLES.TEACHER,
        isUser: role === ROLES.USER,
        hasRole: (allowed: Role[]) => (role ? allowed.includes(role as Role) : false),
    };
}