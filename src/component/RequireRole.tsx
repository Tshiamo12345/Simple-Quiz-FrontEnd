import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/useRole';

type RequireRoleProps = {
    allow: Role[];
    redirectTo?: string;
};

export default function RequireRole({
    allow,
    redirectTo = '/dashboard',
}: RequireRoleProps) {
    const { user, loading } = useAuth();

    if (loading) return <div className="p-4">Loading…</div>;

    const role = user?.role as Role | undefined;

    if (!role || !allow.includes(role)) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
}