import { Link } from 'react-router-dom';

function TopBar() {
    return (
        <header className="topbar px-3 px-lg-4 d-flex align-items-center justify-content-between">
            <Link to="/dashboard" className="topbar-brand text-decoration-none">
                SimpleQuiz
            </Link>
            <span className="topbar-user">Quiz workspace</span>
        </header>
    );
}

export default TopBar;
