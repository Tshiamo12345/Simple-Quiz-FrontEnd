import DashboardLayout from '../component/DashboardLayout';

type Stat = {
    label: string;
    value: string | number;
    icon: string;      // bootstrap-icons class or emoji
    accent: string;    // css color
};

const stats: Stat[] = [
    { label: 'Total Users',     value: 100, icon: '👥', accent: '#4f46e5' },
    { label: 'Total Quizzes',   value: 50,  icon: '📝', accent: '#0891b2' },
    { label: 'Total Questions', value: 500, icon: '❓', accent: '#059669' },
];

function AdminDashBoard() {
    return (
        <DashboardLayout>
            <div className="admin-dashboard">
                {/* Header */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                    <div>
                        <h1 className="admin-title mb-1">Admin Dashboard</h1>
                        <p className="admin-subtitle mb-0">
                            Overview of your quiz platform
                        </p>
                    </div>
                    <span className="badge admin-badge">ADMIN</span>
                </div>

                {/* Stat cards */}
                <div className="row g-3 mb-4">
                    {stats.map((stat) => (
                        <div className="col-12 col-md-4" key={stat.label}>
                            <div className="stat-card h-100">
                                <div
                                    className="stat-icon"
                                    style={{ backgroundColor: `${stat.accent}1a`, color: stat.accent }}
                                >
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="stat-label mb-1">{stat.label}</p>
                                    <p className="stat-value mb-0">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info panels */}
                <div className="row g-3">
                    <div className="col-12 col-lg-6">
                        <div className="info-card h-100">
                            <h2 className="info-card-title">User Registrations</h2>
                            <p className="info-card-text mb-0">
                                Number of people who have registered on the
                                platform. Use this to track growth over time and
                                identify spikes in new sign-ups.
                            </p>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="info-card h-100">
                            <h2 className="info-card-title">Most Popular Language</h2>
                            <p className="info-card-text mb-0">
                                The programming language with the most quiz
                                attempts. Useful for deciding which topics to
                                expand next.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default AdminDashBoard;