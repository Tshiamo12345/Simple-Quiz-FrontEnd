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

    const allQuizzes = quizzes ?? [];
    const total = allQuizzes.length;
    const completedCount = allQuizzes.filter((q) => q.taken).length;
    const remainingCount = total - completedCount;

    const filteredQuizzes = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return allQuizzes;
        return allQuizzes.filter((quiz) =>
            (quiz.title ?? '').toLowerCase().includes(term)
        );
    }, [allQuizzes, search]);

    return (
        <DashboardLayout>
            {/* ── Page header with summary ── */}
            <header className="pb-4 mb-5 border-bottom">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-4">
                    <div>
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
                            Quiz Dashboard
                        </h1>
                        <p className="text-secondary mb-0" style={{ maxWidth: 520 }}>
                            {remainingCount > 0 ? (
                                <>
                                    You have{' '}
                                    <strong className="text-dark">
                                        {remainingCount}{' '}
                                        {remainingCount === 1 ? 'quiz' : 'quizzes'}
                                    </strong>{' '}
                                    left to complete.
                                </>
                            ) : total > 0 ? (
                                <>
                                    You've completed{' '}
                                    <strong className="text-success">
                                        every quiz
                                    </strong>
                                    . Nice work.
                                </>
                            ) : (
                                'No quizzes assigned yet.'
                            )}
                        </p>
                    </div>

                    {/* Search */}
                    <div style={{ minWidth: 300 }}>
                        <label
                            htmlFor="quiz-search"
                            className="text-uppercase text-secondary small fw-semibold ls-wide mb-2 d-block"
                        >
                            Search
                        </label>
                        <input
                            id="quiz-search"
                            type="search"
                            className="form-control form-control-lg border-0 border-bottom rounded-0 bg-transparent px-0"
                            placeholder="Filter by title…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Stat strip */}
                {total > 0 && (
                    <div className="d-flex flex-wrap gap-4 mt-4">
                        <div>
                            <div
                                className="fs-3 fw-bold text-dark"
                                style={{ fontFamily: 'Georgia, serif' }}
                            >
                                {total}
                            </div>
                            <div className="text-uppercase text-secondary small fw-semibold ls-wide">
                                Total
                            </div>
                        </div>
                        <div className="vr d-none d-md-block" />
                        <div>
                            <div
                                className="fs-3 fw-bold text-success"
                                style={{ fontFamily: 'Georgia, serif' }}
                            >
                                {completedCount}
                            </div>
                            <div className="text-uppercase text-secondary small fw-semibold ls-wide">
                                Completed
                            </div>
                        </div>
                        <div className="vr d-none d-md-block" />
                        <div>
                            <div
                                className="fs-3 fw-bold text-primary"
                                style={{ fontFamily: 'Georgia, serif' }}
                            >
                                {remainingCount}
                            </div>
                            <div className="text-uppercase text-secondary small fw-semibold ls-wide">
                                Remaining
                            </div>
                        </div>
                    </div>
                )}
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
                    Failed to load quizzes: {(error as Error)?.message ?? 'Unknown error'}
                </div>
            )}

            {!isLoading && !isError && total === 0 && (
                <div className="alert alert-info">No quizzes yet.</div>
            )}

            {!isLoading && !isError && total > 0 && filteredQuizzes.length === 0 && (
                <div className="alert alert-warning">
                    No quizzes match "{search}".
                </div>
            )}

            {/* ── Grid ── */}
            {!isLoading && !isError && filteredQuizzes.length > 0 && (
                <div className="row g-4">
                    {filteredQuizzes.map((quiz, index) => {
                        const num = String(index + 1).padStart(2, '0');

                        return (
                            <div className="col-12 col-md-6 col-lg-4" key={quiz.id ?? index}>
                                <article
                                    className="card h-100 border-0 rounded-4 quiz-card"
                                    style={{
                                        borderLeft: quiz.taken
                                            ? '4px solid var(--bs-success)'
                                            : '4px solid var(--bs-primary)',
                                    }}
                                >
                                    <div className="card-body d-flex flex-column p-4">
                                        {/* Number + status */}
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

                                            <span
                                                className={`badge rounded-pill ${
                                                    quiz.taken
                                                        ? 'text-bg-success'
                                                        : 'text-bg-primary'
                                                }`}
                                            >
                                                {quiz.taken ? 'Completed' : 'New'}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3
                                            className="h5 fw-bold mb-1"
                                            style={{
                                                fontFamily: 'Georgia, "Times New Roman", serif',
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {quiz.title ?? '—'}
                                        </h3>

                                        {/* Author as subline */}
                                        <p className="text-secondary small mb-4">
                                            by {quiz.author ?? 'Unknown'}
                                        </p>

                                        {/* Meta */}
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

                                        {/* CTA */}
                                        <button
                                            type="button"
                                            className={`btn mt-auto w-100 fw-semibold ${
                                                quiz.taken
                                                    ? 'btn-outline-primary'
                                                    : 'btn-primary'
                                            }`}
                                            onClick={() => setSelectedQuiz(quiz)}
                                        >
                                            {quiz.taken ? 'Review' : 'Start Quiz'}
                                        </button>
                                    </div>
                                </article>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Modal ── */}
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
                                <div className="modal-content border-0 rounded-3">
                                    <div className="modal-header border-bottom">
                                        <div>
                                            <p className="text-uppercase text-secondary small fw-semibold mb-1 ls-wide">
                                                {selectedQuiz.taken ? 'Completed' : 'Not started'}
                                            </p>
                                            <h5
                                                className="modal-title fw-bold mb-0"
                                                style={{
                                                    fontFamily: 'Georgia, "Times New Roman", serif',
                                                }}
                                            >
                                                {selectedQuiz.title ?? 'Quiz'}
                                            </h5>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            aria-label="Close"
                                            onClick={() => setSelectedQuiz(null)}
                                        />
                                    </div>

                                    <div className="modal-body py-4">
                                        <p className="text-secondary mb-4">
                                            {selectedQuiz.description ?? 'No description available.'}
                                        </p>

                                        <ul className="list-unstyled mb-0">
                                            <li className="d-flex justify-content-between py-2 border-bottom">
                                                <span className="text-secondary small">Author</span>
                                                <span className="fw-semibold small">
                                                    {selectedQuiz.author ?? '—'}
                                                </span>
                                            </li>
                                            <li className="d-flex justify-content-between py-2 border-bottom">
                                                <span className="text-secondary small">Language</span>
                                                <span className="fw-semibold small">
                                                    {selectedQuiz.language ?? '—'}
                                                </span>
                                            </li>
                                            <li className="d-flex justify-content-between py-2">
                                                <span className="text-secondary small">Questions</span>
                                                <span className="fw-semibold small">
                                                    {selectedQuiz.numberOfQuestions ?? 0}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="modal-footer border-top bg-white">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setSelectedQuiz(null)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary px-4 fw-semibold"
                                            disabled={!selectedQuiz.id}
                                            onClick={() => {
                                                if (!selectedQuiz.id) return;
                                                setSelectedQuiz(null);
                                                navigate(`/quiz/${selectedQuiz.id}`, {
                                                    state: { quizTitle: selectedQuiz.title },
                                                });
                                            }}
                                        >
                                            {selectedQuiz.taken ? 'Retake Quiz' : 'Start Quiz'}
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