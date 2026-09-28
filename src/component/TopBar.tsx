import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/useRole';

function TopBar() {
    const { user, loading } = useAuth();
    const { role } = useRole();

    const displayName = user?.username ?? user?.email ?? null;

    return (
        <header className="topbar px-3 px-lg-4 d-flex align-items-center justify-content-between">
            <Link to="/dashboard" className="topbar-brand text-decoration-none">
                SimpleQuiz
            </Link>

            <span className="topbar-user d-flex align-items-center gap-2">
                {loading ? (
                    'Loading…'
                ) : displayName ? (
                    <>
                        <span>Hi, {displayName}</span>
                        {role && (
                            <span className="badge text-bg-secondary">{role}</span>
                        )}
                    </>
                ) : (
                    'Quiz workspace'
                )}
            </span>
        </header>
    );
}

export default TopBar;