import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/useRole';
import { logout as logoutApi } from '../api/generated/requests/sdk.gen';

function SideBar() {
    const { logout } = useAuth();
    const { isAdmin } = useRole();
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [error, setError] = useState('');

    const confirmLogout = async () => {
        setIsLoggingOut(true);
        setError('');
        try {
            await logoutApi();
            await logout();
            navigate('/', { replace: true });
        } catch (err) {
            console.error('Logout failed:', err);
            setError('Could not log you out. Please try again.');
        } finally {
            setIsLoggingOut(false);
            setShowConfirm(false);
        }
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        [
            'sidebar-link d-block py-2 px-3 rounded text-decoration-none',
            isActive
                ? 'bg-primary text-white fw-semibold'
                : 'text-primary',
        ].join(' ');

    return (
        <>
            <aside
                className="d-flex flex-column flex-shrink-0 p-3 bg-body border-end"
                style={{ width: 230 }}
            >
                <p className="text-uppercase text-secondary fw-bold small mb-3">
                    {isAdmin ? 'Administration' : 'Workspace'}
                </p>

                <nav className="nav flex-column gap-1" aria-label="Main navigation">
                    {isAdmin ? (
                        <>
                            <NavLink to="/admin" end className={linkClass}>
                                Admin Dashboard
                            </NavLink>
                            <NavLink to="/admin/users" className={linkClass}>
                                Manage Users
                            </NavLink>
                            <NavLink to="/admin/quizzes" className={linkClass}>
                                Manage Quizzes
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/dashboard" className={linkClass}>
                                Quiz Dashboard
                            </NavLink>
                            <NavLink to="/stats" className={linkClass}>
                                Quiz Stats
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="mt-auto pt-3 border-top">
                    <button
                        type="button"
                        onClick={() => setShowConfirm(true)}
                        className="sidebar-link d-block py-2 px-3 rounded text-decoration-none text-primary w-100 text-start bg-transparent border-0"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {showConfirm && (
                <div
                    className="modal fade show d-block"
                    tabIndex={-1}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="logout-confirm-title"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                    onClick={() => !isLoggingOut && setShowConfirm(false)}
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="logout-confirm-title">
                                    Log out?
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setShowConfirm(false)}
                                    disabled={isLoggingOut}
                                />
                            </div>
                            <div className="modal-body">
                                <p className="mb-0">
                                    Are you sure you want to log out of your account?
                                </p>
                                {error && (
                                    <div className="alert alert-danger mt-3 mb-0" role="alert">
                                        {error}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowConfirm(false)}
                                    disabled={isLoggingOut}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmLogout}
                                    disabled={isLoggingOut}
                                >
                                    {isLoggingOut ? 'Logging out...' : 'Yes, log out'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SideBar;