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

    // If someone hits this route directly without going through submit,
    // send them back to the quiz.
    if (!result) {
        return (
            <DashboardLayout>
                <div className="page-back-row">
                    <button
                        type="button"
                        className="btn-back"
                        onClick={() => navigate(`/quiz/${quizId}`)}
                    >
                        ← Back to Quiz
                    </button>
                </div>

                <header className="page-heading">
                    <p className="eyebrow">Results</p>
                    <h1>No Results Yet</h1>
                    <div className="heading-rule" aria-hidden="true" />
                </header>

                <div className="alert alert-info">
                    You haven't submitted this quiz yet.
                </div>
            </DashboardLayout>
        );
    }

    // Question text lookup by id
    const questionTextById = new Map<string, string>();
    questions.forEach((q, i) => {
        if (q.questionId) {
            questionTextById.set(q.questionId, q.questionText ?? `Question ${i + 1}`);
        }
    });

    const score = result.score ?? 0;
    const correct = result.correct ?? 0;
    const total = result.total ?? questions.length;

    // Score tone — just for the ring color
    const tone = score >= 75 ? 'is-high' : score >= 50 ? 'is-mid' : 'is-low';

    return (
        <DashboardLayout>
            <div className="page-back-row">
                <button
                    type="button"
                    className="btn-back"
                    onClick={() => navigate('/dashboard')}
                >
                    ← Back to Dashboard
                </button>
            </div>

            <header className="page-heading">
                <p className="eyebrow">Results</p>
                <h1>Quiz Results</h1>
                <div className="heading-rule" aria-hidden="true" />
            </header>

            {/* Score card */}
            <section className={`result-card ${tone}`} aria-live="polite">
                <p className="result-card-label">Your Score</p>
                <p className="result-card-score">{score}%</p>
                <p className="result-card-meta">
                    {correct} correct out of {total}
                </p>

                {/* progress bar */}
                <div className="result-bar" aria-hidden="true">
                    <div
                        className="result-bar-fill"
                        style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                    />
                </div>
            </section>

            {/* Per-question breakdown */}
            {result.details && result.details.length > 0 && (
                <section className="result-breakdown">
                    <h2 className="result-breakdown-title">Breakdown</h2>

                    <ul className="result-list">
                        {result.details.map((d, index) => {
                            const qid = d.questionId ?? `q-${index}`;
                            const questionText =
                                questionTextById.get(qid) ?? `Question ${index + 1}`;

                            return (
                                <li
                                    key={qid}
                                    className={`result-item ${
                                        d.correct ? 'is-correct' : 'is-wrong'
                                    }`}
                                >
                                    <div className="result-item-header">
                                        <span className="result-item-number">
                                            {index + 1}.
                                        </span>
                                        <span className="result-item-question">
                                            {questionText}
                                        </span>
                                        <span className="result-item-mark">
                                            {d.correct ? '✓' : '✕'}
                                        </span>
                                    </div>

                                    <div className="result-item-answers">
                                        <p className="result-item-line">
                                            <span className="result-item-label">Your answer</span>
                                            <span
                                                className={
                                                    d.correct
                                                        ? 'result-item-value is-correct'
                                                        : 'result-item-value is-wrong'
                                                }
                                            >
                                                {d.chosenAnswer ?? '—'}
                                            </span>
                                        </p>

                                        {!d.correct && (
                                            <p className="result-item-line">
                                                <span className="result-item-label">
                                                    Correct answer
                                                </span>
                                                <span className="result-item-value is-correct">
                                                    {d.correctAnswer ?? '—'}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}

            <div className="result-actions">
                <button
                    type="button"
                    className="btn-back"
                    onClick={() => navigate(`/quiz/${quizId}`)}
                >
                    Retake Quiz
                </button>
                <button
                    type="button"
                    className="btn btn-brand"
                    onClick={() => navigate('/dashboard')}
                >
                    Back to Dashboard
                </button>
            </div>
        </DashboardLayout>
    );
}

export default QuizResultPage;