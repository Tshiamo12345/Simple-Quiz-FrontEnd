import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../component/DashboardLayout';
import type {
    QuizResultResponse,
    QuizQuestionsRequest,
} from '../api/generated/requests/types.gen';

type ResultLocationState = {
    result: QuizResultResponse | null;
    questions: QuizQuestionsRequest[] | null;
};

function QuizResultPage() {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as ResultLocationState | null;

    const result = state?.result ?? null;
    const questions = state?.questions ?? [];

    if (!result) {
        return (
            <DashboardLayout>
                <div className="mb-3">
                    <button
                        type="button"
                        className="btn btn-link text-decoration-none px-0"
                        onClick={() => navigate(`/quiz/${quizId}`)}
                    >
                        ← Back to Quiz
                    </button>
                </div>

                <header className="text-center mb-4">
                    <p className="text-uppercase text-primary fw-bold small mb-1">Results</p>
                    <h1 className="fw-bold mb-2">No Results Yet</h1>
                    <div className="mx-auto bg-success rounded" style={{ width: 64, height: 3 }} aria-hidden="true" />
                </header>

                <div className="alert alert-info">
                    You haven't submitted this quiz yet.
                </div>
            </DashboardLayout>
        );
    }

    const questionTextById = new Map<string, string>();
    questions.forEach((q, i) => {
        if (q.questionId) {
            questionTextById.set(q.questionId, q.questionText ?? `Question ${i + 1}`);
        }
    });

    const score = result.score ?? 0;
    const correct = result.correct ?? 0;
    const total = result.total ?? questions.length;

    const tone = score >= 75 ? 'success' : score >= 50 ? 'warning' : 'danger';
    const barClass =
        score >= 75 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-danger';

    return (
        <DashboardLayout>
            <div className="mb-3">
                <button
                    type="button"
                    className="btn btn-link text-decoration-none px-0"
                    onClick={() => navigate('/dashboard')}
                >
                    ← Back to Dashboard
                </button>
            </div>

            <header className="text-center mb-4">
                <p className="text-uppercase text-primary fw-bold small mb-1">Results</p>
                <h1 className="fw-bold mb-2">Quiz Results</h1>
                <div className="mx-auto bg-success rounded" style={{ width: 64, height: 3 }} aria-hidden="true" />
            </header>

            {/* Score card */}
            <section className={`card shadow-sm border-${tone} mb-4`} aria-live="polite">
                <div className="card-body text-center">
                    <p className="text-secondary small text-uppercase fw-bold mb-1">
                        Your Score
                    </p>
                    <p className={`display-4 fw-bold text-${tone} mb-2`}>{score}%</p>
                    <p className="text-secondary mb-3">
                        {correct} correct out of {total}
                    </p>

                    <div className="progress" role="progressbar" aria-hidden="true">
                        <div
                            className={`progress-bar ${barClass}`}
                            style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                        />
                    </div>
                </div>
            </section>

            {/* Per-question breakdown */}
            {result.details && result.details.length > 0 && (
                <section className="mb-4">
                    <h2 className="h5 fw-bold mb-3">Breakdown</h2>

                    <ul className="list-unstyled d-flex flex-column gap-3">
                        {result.details.map((d, index) => {
                            const qid = d.questionId ?? `q-${index}`;
                            const questionText =
                                questionTextById.get(qid) ?? `Question ${index + 1}`;

                            return (
                                <li
                                    key={qid}
                                    className={`card shadow-sm border-${
                                        d.correct ? 'success' : 'danger'
                                    }`}
                                >
                                    <div className="card-body">
                                        <div className="d-flex align-items-start gap-2 mb-2">
                                            <span className="fw-bold">{index + 1}.</span>
                                            <span className="flex-grow-1 fw-semibold">
                                                {questionText}
                                            </span>
                                            <span
                                                className={`fw-bold ${
                                                    d.correct ? 'text-success' : 'text-danger'
                                                }`}
                                            >
                                                {d.correct ? '✓' : '✕'}
                                            </span>
                                        </div>

                                        <div className="d-flex flex-column gap-1">
                                            <p className="d-flex justify-content-between mb-0">
                                                <span className="text-secondary small">
                                                    Your answer
                                                </span>
                                                <span
                                                    className={`fw-semibold ${
                                                        d.correct ? 'text-success' : 'text-danger'
                                                    }`}
                                                >
                                                    {d.chosenAnswer ?? '—'}
                                                </span>
                                            </p>

                                            {!d.correct && (
                                                <p className="d-flex justify-content-between mb-0">
                                                    <span className="text-secondary small">
                                                        Correct answer
                                                    </span>
                                                    <span className="fw-semibold text-success">
                                                        {d.correctAnswer ?? '—'}
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

            <div className="d-flex justify-content-center gap-2">
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(`/quiz/${quizId}`)}
                >
                    Retake Quiz
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate('/dashboard')}
                >
                    Back to Dashboard
                </button>
            </div>
        </DashboardLayout>
    );
}

export default QuizResultPage;