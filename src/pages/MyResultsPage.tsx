import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../component/DashboardLayout';
import { useGetQuizzes } from '../api/generated/queries';

function MyResultsPage() {
    const navigate = useNavigate();
    const { data: quizzes, isLoading, isError, error } = useGetQuizzes();

    const takenQuizzes = useMemo(
        () => (quizzes ?? []).filter((q) => q.taken),
        [quizzes]
    );

    const completedCount = takenQuizzes.length;
    const totalCount = quizzes?.length ?? 0;

    return (
        <DashboardLayout>
            {/* ── Page header ── */}
            <header className="pb-4 mb-4 border-bottom">
                <p className="text-uppercase text-secondary small fw-semibold mb-2 ls-wide">
                    Workspace
                </p>
                <h1
                    className="fw-bold mb-2"
                    style={{
                        fontFamily: 'Georgia, "Times New Roman", serif',
                        fontSize: '2.25rem',
                        letterSpacing: '-0.01em',
                    }}
                >
                    My Results
                </h1>
                <p className="text-secondary mb-0" style={{ maxWidth: 520 }}>
                    {completedCount > 0 ? (
                        <>
                            You've completed{' '}
                            <strong className="text-dark">
                                {completedCount}{' '}
                                {completedCount === 1 ? 'quiz' : 'quizzes'}
                            </strong>
                            . Review your answers below.
                        </>
                    ) : (
                        'Your past quiz attempts and scores will appear here.'
                    )}
                </p>
            </header>

            {/* ── States ── */}
            {isLoading && (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading…</span>
                    </div>
                </div>
            )}

            {isError && (
                <div className="alert alert-danger" role="alert">
                    Failed to load results:{' '}
                    {(error as Error)?.message ?? 'Unknown error'}
                </div>
            )}

            {!isLoading && !isError && completedCount === 0 && (
                <div className="alert alert-info">
                    No results yet. Complete a quiz to see it here.
                </div>
            )}

            {/* ── Results list ── */}
            {!isLoading && !isError && completedCount > 0 && (
                <div className="row g-4">
                    {takenQuizzes.map((quiz, index) => {
                        const num = String(index + 1).padStart(2, '0');

                        return (
                            <div
                                className="col-12 col-md-6 col-lg-4"
                                key={quiz.id ?? index}
                            >
                                <article
                                    className="card h-100 border-0 rounded-4 quiz-card"
                                    style={{
                                        borderLeft:
                                            '4px solid var(--bs-success)',
                                    }}
                                >
                                    <div className="card-body d-flex flex-column p-4">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <span
                                                className="text-secondary fw-bold"
                                                style={{
                                                    fontFamily: 'Georgia, serif',
                                                    fontSize: '0.95rem',
                                                }}
                                            >
                                                {num}
                                            </span>
                                            <span className="badge rounded-pill text-bg-success">
                                                Completed
                                            </span>
                                        </div>

                                        <h3
                                            className="h5 fw-bold mb-1"
                                            style={{
                                                fontFamily:
                                                    'Georgia, "Times New Roman", serif',
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {quiz.title ?? '—'}
                                        </h3>

                                        <p className="text-secondary small mb-4">
                                            by {quiz.author ?? 'Unknown'}
                                        </p>

                                        <div className="d-flex align-items-center gap-3 mb-4 small text-secondary">
                                            <span>
                                                <strong className="text-dark">
                                                    {quiz.numberOfQuestions ?? 0}
                                                </strong>{' '}
                                                questions
                                            </span>
                                            <span aria-hidden="true">·</span>
                                            <span>{quiz.language ?? 'EN'}</span>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-outline-primary mt-auto w-100 fw-semibold"
                                            onClick={() =>
                                                quiz.id &&
                                                navigate(`/quiz/${quiz.id}`, {
                                                    state: {
                                                        quizTitle: quiz.title,
                                                    },
                                                })
                                            }
                                        >
                                            Review Answers
                                        </button>
                                    </div>
                                </article>
                            </div>
                        );
                    })}
                </div>
            )}
        </DashboardLayout>
    );
}

export default MyResultsPage;