import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../component/DashboardLayout';
import { useGetAllQuizAdmin } from '../api/generated/queries';

function AdminQuizzes() {
    const navigate = useNavigate();
    const { data: quizzes, isLoading, isError, error } = useGetAllQuizAdmin();

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

                {/* Loading */}
                {isLoading && (
                    <div className="d-flex justify-content-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading…</span>
                        </div>
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="alert alert-danger" role="alert">
                        Failed to load quizzes: {(error as Error)?.message ?? 'Unknown error'}
                    </div>
                )}

                {/* List */}
                {!isLoading && !isError && (
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
                                    {!quizzes || quizzes.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-5">
                                                <p className="text-muted mb-0">
                                                    No quizzes yet. Click <strong>Create Quiz</strong> to add one.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        quizzes.map((quiz, index) => (
                                            <tr key={quiz.id ?? index}>
                                                <td>
                                                    <p className="mb-0 fw-semibold">
                                                        {quiz.quizName ?? '—'}
                                                    </p>
                                                </td>

                                                <td className="d-none d-md-table-cell">
                                                    <span className="text-muted small">
                                                        {quiz.language ?? '—'}
                                                    </span>
                                                </td>

                                                <td className="text-center">
                                                    {quiz.numberOfQuestions ?? 0}
                                                </td>
                                                <td className="text-center">
                                                    {quiz.numberOfAttempts ?? 0}
                                                </td>

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
                                                        disabled={!quiz.id}
                                                        onClick={() =>
                                                            quiz.id && navigate(`/admin/quizzes/${quiz.id}`)
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        disabled={!quiz.id}
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
                )}
            </div>
        </DashboardLayout>
    );
}

export default AdminQuizzes;