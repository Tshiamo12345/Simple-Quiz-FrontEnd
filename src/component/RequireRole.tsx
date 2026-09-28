import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/useRole';

type RequireRoleProps = {
    allow: Role[];
    redirectTo?: string;
};

const landingFor = (role: string | undefined) =>
    role === 'ADMIN' ? '/admin' : '/dashboard';

export default function RequireRole({
    allow,
    redirectTo,
}: RequireRoleProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="p-4">Loading…</div>;

    const role = (user?.role ?? '') as Role | '';

    if (!role || !allow.includes(role as Role)) {
        const dest = redirectTo ?? landingFor(user?.role);

        // Never redirect to where we already are — that causes an infinite loop.
        if (location.pathname === dest) {
            return (
                <div className="p-4">
                    You don't have access to this page.
                </div>
            );
        }
        return <Navigate to={dest} replace />;
    }

    return <Outlet />;
}