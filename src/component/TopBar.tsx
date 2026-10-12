function TopBar() {
    return (
        <header className="bg-white border-bottom">
            <div className="d-flex justify-content-between align-items-center px-4 py-3">
                <span
                    className="fw-bold fs-5 text-primary"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    Quiz Platform
                </span>

                <div className="d-flex align-items-center gap-3">
                    <span className="text-secondary small">Tshiamo</span>
                    <span className="badge text-bg-secondary rounded-pill">User</span>
                </div>
            </div>
        </header>
    );
}

export default TopBar;