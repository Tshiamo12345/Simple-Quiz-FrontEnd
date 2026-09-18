import { NavLink } from 'react-router-dom';

function SideBar() {
    return (
        <aside className="sidebar p-3">
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
        </aside>
    );
}

export default SideBar;
