import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import DashboardLayout from '../component/DashboardLayout';
import { useGetQuizzes } from '../api/generated/queries';
import type { QuizRequest } from '../api/generated/requests/types.gen';
import { useNavigate } from 'react-router-dom';

function QuizDashboard() {
    const [selectedQuiz, setSelectedQuiz] = useState<QuizRequest | null>(null);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { data: quizzes, isLoading, isError, error } = useGetQuizzes();

    // Filter by title only, case-insensitive
    const filteredQuizzes = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return quizzes ?? [];
        return (quizzes ?? []).filter((quiz) =>
            (quiz.title ?? '').toLowerCase().includes(term)
        );
    }, [quizzes, search]);

    return (
        <DashboardLayout>
            <header className="page-heading text-center">
                <p className="eyebrow">Workspace</p>
                <h1>Quiz Dashboard</h1>
                <div className="heading-rule" aria-hidden="true" />
            </header>

            {/* Search — filters by title only */}
            <div className="dashboard-toolbar">
                <input
                    type="search"
                    className="form-control search-input"
                    placeholder="Search quizzes by title…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search quizzes by title"
                />
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

            {/* Empty — no quizzes at all */}
            {!isLoading && !isError && (quizzes?.length ?? 0) === 0 && (
                <div className="alert alert-info">No quizzes yet.</div>
            )}

            {/* Empty — search matched nothing */}
            {!isLoading && !isError && (quizzes?.length ?? 0) > 0 && filteredQuizzes.length === 0 && (
                <div className="alert alert-warning">
                    No quizzes match "{search}".
                </div>
            )}

            {/* List */}
            {!isLoading && !isError && filteredQuizzes.length > 0 && (
                <section className="row g-3" aria-label="Quiz overview">
                    {filteredQuizzes.map((quiz, index) => (
                        <div className="col-md-4" key={quiz.id ?? index}>
                            <article className="quiz-card h-100 d-flex flex-column">
                                <div className="quiz-card-header">
                                    <span
                                        className={`quiz-card-badge ${
                                            quiz.taken ? 'is-completed' : 'is-pending'
                                        }`}
                                    >
                                        {quiz.taken ? 'Completed' : 'Not started'}
                                    </span>
                                    <h3 className="quiz-card-title">{quiz.title ?? '—'}</h3>
                                </div>

                                <ul className="quiz-card-meta">
                                    <li>
                                        <span className="meta-label">Questions</span>
                                        <span className="meta-value">{quiz.numberOfQuestions ?? 0}</span>
                                    </li>
                                    <li>
                                        <span className="meta-label">Author</span>
                                        <span className="meta-value">{quiz.author ?? '—'}</span>
                                    </li>
                                </ul>

                                <button
                                    type="button"
                                    className="btn btn-brand mt-auto w-100"
                                    onClick={() => setSelectedQuiz(quiz)}
                                >
                                    View
                                </button>
                            </article>
                        </div>
                    ))}
                </section>
            )}

            {/* Modal */}
            {selectedQuiz &&
                createPortal(
                    <>
                        <div
                            className="modal fade show d-block"
                            tabIndex={-1}
                            role="dialog"
                            aria-modal="true"
                            onClick={() => setSelectedQuiz(null)}
                        >
                            <div
                                className="modal-dialog modal-dialog-centered"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">{selectedQuiz.title ?? 'Quiz'}</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            aria-label="Close"
                                            onClick={() => setSelectedQuiz(null)}
                                        />
                                    </div>

                                    <div className="modal-body">
                                        <p className="mb-2">
                                            <strong>Author:</strong> {selectedQuiz.author ?? '—'}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Questions:</strong> {selectedQuiz.numberOfQuestions ?? 0}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Status:</strong>{' '}
                                            {selectedQuiz.taken ? 'Completed' : 'Not started'}
                                        </p>
                                        <p className="mb-0">
                                            <strong>Description:</strong> {selectedQuiz.description ?? '—'}
                                        </p>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setSelectedQuiz(null)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-brand"
                                            disabled={!selectedQuiz.id}
                                            onClick={() => {
                                                if (!selectedQuiz.id) return;
                                                setSelectedQuiz(null);
                                                navigate(`/quiz/${selectedQuiz.id}`);
                                            }}
                                        >
                                            Start Quiz
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-backdrop fade show" />
                    </>,
                    document.body
                )}
        </DashboardLayout>
    );
}

export default QuizDashboard;