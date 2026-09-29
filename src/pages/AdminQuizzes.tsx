import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../component/DashboardLayout';

type QuizStatus = 'PUBLISHED' | 'DRAFT';

type Quiz = {
    id: string;
    title: string;
    language: string;
    questions: number;
    attempts: number;
    status: QuizStatus;
    createdAt: string;
};

// TODO: replace with GET /api/admin/quizzes
const mockQuizzes: Quiz[] = [
    {
        id: 'q_01',
        title: 'Java Basics',
        language: 'Java',
        questions: 12,
        attempts: 82,
        status: 'PUBLISHED',
        createdAt: '2025-04-02',
    },
    {
        id: 'q_02',
        title: 'React Hooks',
        language: 'JavaScript',
        questions: 10,
        attempts: 67,
        status: 'PUBLISHED',
        createdAt: '2025-04-05',
    },
    {
        id: 'q_03',
        title: 'SQL Joins',
        language: 'SQL',
        questions: 8,
        attempts: 54,
        status: 'PUBLISHED',
        createdAt: '2025-04-07',
    },
    {
        id: 'q_04',
        title: 'Spring Security',
        language: 'Java',
        questions: 15,
        attempts: 41,
        status: 'DRAFT',
        createdAt: '2025-04-10',
    },
    {
        id: 'q_05',
        title: 'TypeScript Generics',
        language: 'TypeScript',
        questions: 9,
        attempts: 33,
        status: 'PUBLISHED',
        createdAt: '2025-04-12',
    },
    {
        id: 'q_06',
        title: 'Docker 101',
        language: 'DevOps',
        questions: 6,
        attempts: 21,
        status: 'DRAFT',
        createdAt: '2025-04-14',
    },
];

function AdminQuizzes() {
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div className="admin-quizzes">
                {/* Header: centered title, right-aligned action */}
                <div className="row align-items-center mb-4 g-2">
                    <div className="col-md-2 d-none d-md-block" />

                    <div className="col-12 col-md-8 text-center">
                        <h1 className="admin-title mb-1">Manage Quizzes</h1>
                        <p className="admin-subtitle mb-0">
                            Create, edit and remove quizzes.
                        </p>
                    </div>

                    <div className="col-12 col-md-2 d-flex justify-content-center justify-content-md-end">
                        <button
                            type="button"
                            className="btn btn-brand"
                            onClick={() => navigate('/admin/quizzes/create')}
                        >
                            + Create Quiz
                        </button>
                    </div>
                </div>

                {/* Quiz list */}
                <div className="info-card p-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table admin-table mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th scope="col">Quiz</th>
                                    <th scope="col" className="d-none d-md-table-cell">Language</th>
                                    <th scope="col" className="text-center">Questions</th>
                                    <th scope="col" className="text-center">Attempts</th>
                                    <th scope="col" className="text-center">Status</th>
                                    <th scope="col" className="text-end">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {mockQuizzes.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-5">
                                            <p className="text-muted mb-0">
                                                No quizzes yet. Click <strong>Create Quiz</strong> to add one.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    mockQuizzes.map((quiz) => (
                                        <tr key={quiz.id}>
                                            <td>
                                                <p className="mb-0 fw-semibold">{quiz.title}</p>
                                                <p className="mb-0 text-muted small">
                                                    Created {quiz.createdAt}
                                                </p>
                                            </td>

                                            <td className="d-none d-md-table-cell">
                                                <span className="text-muted small">{quiz.language}</span>
                                            </td>

                                            <td className="text-center">{quiz.questions}</td>
                                            <td className="text-center">{quiz.attempts}</td>

                                            <td className="text-center">
                                                <span
                                                    className={
                                                        quiz.status === 'PUBLISHED'
                                                            ? 'badge status-badge status-published'
                                                            : 'badge status-badge status-draft'
                                                    }
                                                >
                                                    {quiz.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                                                </span>
                                            </td>

                                            <td className="text-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary me-2"
                                                    onClick={() => navigate(`/admin/quizzes/${quiz.id}`)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => {
                                                        // TODO: hook up delete
                                                        console.log('delete', quiz.id);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default AdminQuizzes;