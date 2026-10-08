import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/useRole';

function TopBar() {
    const { user } = useAuth();
    const { isAdmin } = useRole();

    return (
        <header className="d-flex align-items-center justify-content-between bg-white border-bottom border-2 border-secondary px-4 py-3 flex-shrink-0">
            <span className="fw-bold fs-5 text-primary">Quiz Platform</span>

            <div className="d-flex align-items-center gap-2">
                <span className="text-secondary small d-none d-sm-inline">
                    {user?.username ?? 'Guest'}
                </span>
                <span className={`badge ${isAdmin ? 'text-bg-danger' : 'text-bg-secondary'}`}>
                    {isAdmin ? 'Admin' : 'User'}
                </span>
            </div>
        </header>
    );
}

export default TopBar;