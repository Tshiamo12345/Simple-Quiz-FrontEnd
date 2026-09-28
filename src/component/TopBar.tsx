import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // adjust path

function TopBar() {
    const { user, loading } = useAuth();

    // Try a few common shapes the API might return the name in.
    // Remove the ones that don't apply once you know your API shape.
    const displayName =
        (user as any)?.name ??
        (user as any)?.username ??
        null;

    return (
        <header className="topbar px-3 px-lg-4 d-flex align-items-center justify-content-between">
            <Link to="/dashboard" className="topbar-brand text-decoration-none">
                SimpleQuiz
            </Link>

            <span className="topbar-user">
                {loading
                    ? 'Loading…'
                    : displayName
                        ? `Hi, ${displayName}`
                        : 'Quiz workspace'}
            </span>
        </header>
    );
}

export default TopBar;