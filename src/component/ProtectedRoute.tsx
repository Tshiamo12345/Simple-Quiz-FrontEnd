import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type ProtectedRouteProps = {
    children: ReactElement;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children;
}

export default ProtectedRoute;
