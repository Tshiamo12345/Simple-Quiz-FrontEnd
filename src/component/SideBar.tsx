import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SideBar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/', { replace: true });
    };

    return (
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

            <div className="mt-auto pt-3">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="sidebar-link logout-btn w-100 text-start"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default SideBar;