import { useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import DashboardLayout from '../component/DashboardLayout';
import type {
    QuizResultResponse,
    QuizQuestionsRequest,
} from '../api/generated/requests/types.gen';

type ResultLocationState = {
    result: QuizResultResponse | null;
    questions: QuizQuestionsRequest[] | null;
};

const PASS_THRESHOLD = 50;
const GOOD_THRESHOLD = 75;

function QuizResultPage() {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as ResultLocationState | null;

    const result = state?.result ?? null;
    const questions = state?.questions ?? [];

    // All hooks must run before any conditional return.
    const [showAnswers, setShowAnswers] = useState(false);

    // Stable lookup: questionId → question text.
    const questionTextById = useMemo(() => {
        const map = new Map<string, string>();
        questions.forEach((q, i) => {
            if (q.questionId) {
                map.set(q.questionId, q.questionText ?? `Question ${i + 1}`);
            }
        });
        return map;
    }, [questions]);

    // ── No result guard ───────────────────────────────────────
    if (!result) {
        return (
            <DashboardLayout hideSidebar>
                <header className="text-center mb-4">
                    <p className="text-uppercase text-primary fw-bold small mb-1">
                        Results
                    </p>
                    <h1 className="fw-bold mb-2">No Results Yet</h1>
                    <div
                        className="mx-auto bg-success rounded"
                        style={{ width: 64, height: 3 }}
                        aria-hidden="true"
                    />
                </header>

                <div className="alert alert-info">
                    You haven't submitted this quiz yet.
                </div>
            </DashboardLayout>
        );
    }

    // ── Derived data ──────────────────────────────────────────
    const score = result.score ?? 0;
    const correct = result.correct ?? 0;
    const total = result.total ?? questions.length;

    const passed = score >= PASS_THRESHOLD;
    const tone =
        score >= GOOD_THRESHOLD
            ? 'success'
            : score >= PASS_THRESHOLD
              ? 'warning'
              : 'danger';
    const barClass = `bg-${tone}`;

    const hasDetails = !!result.details && result.details.length > 0;

    return (
        <DashboardLayout hideSidebar>
            <div className="d-flex justify-content-center">
                <div
                    className="card shadow-sm border-0 overflow-hidden w-100"
                    style={{ maxWidth: 720 }}
                >
                    <div className="card-body p-3 p-md-4">
                        {/* ── Header ── */}
                        <div className="text-center mb-3 pb-3 border-bottom">
                            <p className="text-uppercase text-muted small fw-semibold mb-1">
                                Results
                            </p>
                            <h2 className="h5 fw-bold mb-0 text-dark">
                                Quiz Results
                            </h2>
                        </div>

                        {/* ── Score ── */}
                        <section
                            className={`text-center mb-4 p-3 rounded-3 bg-${tone}-subtle`}
                            aria-live="polite"
                        >
                            <p className="text-secondary small text-uppercase fw-bold mb-1">
                                Your Score
                            </p>
                            <p className={`display-4 fw-bold text-${tone} mb-2`}>
                                {score}%
                            </p>
                            <p className="text-secondary mb-2">
                                {correct} correct out of {total}
                            </p>

                            <p
                                className={`fw-bold text-${tone} mb-3`}
                                style={{ fontSize: '1.05rem' }}
                            >
                                {passed ? (
                                    <>
                                        <span aria-hidden="true">🎉 </span>
                                        Congratulations — you passed!
                                    </>
                                ) : (
                                    <>
                                        <span aria-hidden="true">📚 </span>
                                        Sorry, you didn't pass. Keep trying!
                                    </>
                                )}
                            </p>

                            <div
                                className="progress"
                                role="progressbar"
                                aria-hidden="true"
                                style={{ height: 6 }}
                            >
                                <div
                                    className={`progress-bar ${barClass}`}
                                    style={{
                                        width: `${Math.max(
                                            0,
                                            Math.min(100, score)
                                        )}%`,
                                    }}
                                />
                            </div>
                        </section>

                        {/* ── Breakdown (toggled by View Answers) ── */}
                        {showAnswers && hasDetails && (
                            <section className="mb-3">
                                <h3 className="h6 fw-bold mb-3">
                                    Answer Breakdown
                                </h3>

                                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                                    {result.details!.map((d, index) => {
                                        const qid =
                                            d.questionId ?? `q-${index}`;
                                        const questionText =
                                            questionTextById.get(qid) ??
                                            `Question ${index + 1}`;

                                        return (
                                            <li
                                                key={qid}
                                                className={`card border-${
                                                    d.correct
                                                        ? 'success'
                                                        : 'danger'
                                                }`}
                                            >
                                                <div className="card-body p-3">
                                                    <div className="d-flex align-items-start gap-2 mb-2">
                                                        <span className="fw-bold">
                                                            {index + 1}.
                                                        </span>
                                                        <span className="flex-grow-1 fw-semibold">
                                                            {questionText}
                                                        </span>
                                                        <span
                                                            className={`fw-bold ${
                                                                d.correct
                                                                    ? 'text-success'
                                                                    : 'text-danger'
                                                            }`}
                                                        >
                                                            <span aria-hidden="true">
                                                                {d.correct
                                                                    ? '✓'
                                                                    : '✕'}
                                                            </span>
                                                            <span className="visually-hidden">
                                                                {d.correct
                                                                    ? 'Correct'
                                                                    : 'Incorrect'}
                                                            </span>
                                                        </span>
                                                    </div>

                                                    <div className="d-flex flex-column gap-1">
                                                        <p className="d-flex justify-content-between mb-0">
                                                            <span className="text-secondary small">
                                                                Your answer
                                                            </span>
                                                            <span
                                                                className={`fw-semibold ${
                                                                    d.correct
                                                                        ? 'text-success'
                                                                        : 'text-danger'
                                                                }`}
                                                            >
                                                                {d.chosenAnswer ??
                                                                    '—'}
                                                            </span>
                                                        </p>

                                                        {!d.correct && (
                                                            <p className="d-flex justify-content-between mb-0">
                                                                <span className="text-secondary small">
                                                                    Correct
                                                                    answer
                                                                </span>
                                                                <span className="fw-semibold text-success">
                                                                    {d.correctAnswer ??
                                                                        '—'}
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        )}
                    </div>

                    {/* ── Footer with the two buttons ── */}
                    <div className="card-footer bg-body-tertiary border-top py-3 px-3 px-md-4">
                        <div className="d-flex justify-content-between align-items-center gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowAnswers((v) => !v)}
                                disabled={!hasDetails}
                            >
                                {showAnswers ? 'Hide Answers' : 'View Answers'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary px-4"
                                onClick={() => navigate('/quizzes')}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default QuizResultPage;