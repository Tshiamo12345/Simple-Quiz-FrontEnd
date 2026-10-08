import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import DashboardLayout from '../component/DashboardLayout';

type Stat = {
    label: string;
    value: string | number;
    icon: string;
    accent: string;
};

type QuizAttempt = {
    quiz: string;
    attempts: number;
};

type SignupPoint = {
    date: string;
    signups: number;
};

const stats: Stat[] = [
    { label: 'Total Users',     value: 100, icon: '👥', accent: '#0d6efd' },
    { label: 'Total Quizzes',   value: 50,  icon: '📝', accent: '#0dcaf0' },
    { label: 'Total Questions', value: 500, icon: '❓', accent: '#198754' },
];

const signups: SignupPoint[] = [
    { date: 'Apr 01', signups: 2 },
    { date: 'Apr 02', signups: 5 },
    { date: 'Apr 03', signups: 3 },
    { date: 'Apr 04', signups: 8 },
    { date: 'Apr 05', signups: 1 },
    { date: 'Apr 06', signups: 4 },
    { date: 'Apr 07', signups: 6 },
    { date: 'Apr 08', signups: 12 },
    { date: 'Apr 09', signups: 3 },
    { date: 'Apr 10', signups: 5 },
    { date: 'Apr 11', signups: 7 },
    { date: 'Apr 12', signups: 4 },
    { date: 'Apr 13', signups: 9 },
    { date: 'Apr 14', signups: 6 },
];

const quizAttempts: QuizAttempt[] = [
    { quiz: 'Java Basics',     attempts: 82 },
    { quiz: 'React Hooks',     attempts: 67 },
    { quiz: 'SQL Joins',       attempts: 54 },
    { quiz: 'Spring Security', attempts: 41 },
    { quiz: 'TS Generics',     attempts: 33 },
    { quiz: 'Docker 101',      attempts: 21 },
];

function AdminDashBoard() {
    return (
        <DashboardLayout>
            <div className="text-center mb-4">
                <h1 className="fw-bold mb-1">Admin Dashboard</h1>
                <p className="text-secondary mb-0">Overview of your quiz platform</p>
            </div>

            {/* Stat cards */}
            <div className="row g-3 mb-4">
                {stats.map((stat) => (
                    <div className="col-12 col-md-4" key={stat.label}>
                        <div className="card shadow-sm h-100">
                            <div className="card-body d-flex align-items-center gap-3">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-circle fs-4"
                                    style={{
                                        width: 48,
                                        height: 48,
                                        backgroundColor: `${stat.accent}1a`,
                                        color: stat.accent,
                                    }}
                                >
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-secondary small mb-1">{stat.label}</p>
                                    <p className="fs-3 fw-bold mb-0">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info panels */}
            <div className="row g-3">
                {/* LEFT — User Registrations */}
                <div className="col-12 col-lg-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                            <h2 className="h5 fw-bold">User Registrations</h2>
                            <p className="text-secondary small">
                                Number of people who have registered on the platform.
                                Use this to track growth over time and identify
                                spikes in new sign-ups.
                            </p>

                            <div className="mt-2">
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart
                                        data={signups}
                                        margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 11, fill: '#6c757d' }}
                                            interval={1}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 11, fill: '#6c757d' }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(25, 135, 84, 0.06)' }}
                                            contentStyle={{
                                                borderRadius: 8,
                                                border: '1px solid #dee2e6',
                                                fontSize: 12,
                                            }}
                                        />
                                        <Bar
                                            dataKey="signups"
                                            fill="#198754"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Most Popular Language */}
                <div className="col-12 col-lg-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                            <h2 className="h5 fw-bold">Most Popular Language</h2>
                            <p className="text-secondary small">
                                The programming language with the most quiz attempts.
                                Useful for deciding which topics to expand next.
                            </p>

                            <div className="mt-2">
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart
                                        data={quizAttempts}
                                        margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
                                        <XAxis
                                            dataKey="quiz"
                                            tick={{ fontSize: 11, fill: '#6c757d' }}
                                            interval={0}
                                            angle={-20}
                                            textAnchor="end"
                                            height={50}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 11, fill: '#6c757d' }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(13, 110, 253, 0.06)' }}
                                            contentStyle={{
                                                borderRadius: 8,
                                                border: '1px solid #dee2e6',
                                                fontSize: 12,
                                            }}
                                        />
                                        <Bar
                                            dataKey="attempts"
                                            fill="#0d6efd"
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default AdminDashBoard;