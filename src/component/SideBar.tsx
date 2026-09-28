import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout as logoutApi } from '../api/generated/requests/sdk.gen';

function SideBar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [error, setError] = useState('');

    const confirmLogout = async () => {
        setIsLoggingOut(true);
        setError('');

        try {
            // 1. Tell the server to clear the jwt cookie
            await logoutApi();

            // 2. Clear client-side auth state (user, isAuthenticated, etc.)
            await logout();

            // 3. Send them home
            navigate('/', { replace: true });
        } catch (err) {
            console.error('Logout failed:', err);
            setError('Could not log you out. Please try again.');
        } finally {
            setIsLoggingOut(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <aside className="sidebar p-3 d-flex flex-column">
                <p className="sidebar-label">Workspace</p>

                <nav className="nav flex-column gap-2" aria-label="Main navigation">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        Quiz Dashboard
                    </NavLink>
                    <NavLink
                        to="/stats"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        Quiz Stats
                    </NavLink>
                </nav>

                <div className="mt-auto pt-3 sidebar-footer">
                    <button
                        type="button"
                        onClick={() => setShowConfirm(true)}
                        className="sidebar-link logout-btn w-100 text-start"
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