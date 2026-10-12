import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../component/DashboardLayout';
import {
    useGetAllQuizQuestions,
    useSubmitAnswers,
} from '../api/generated/queries';
import type { QuizResultResponse } from '../api/generated/requests/types.gen';

type Answers = Record<string, string>;

function QuizPage() {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const quizTitle =
        (location.state as { quizTitle?: string } | null)?.quizTitle ??
        `Quiz #${quizId?.slice(0, 6) ?? ''}`;

    const [answers, setAnswers] = useState<Answers>({});
    const [submitError, setSubmitError] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMissing, setShowMissing] = useState(false);

    useEffect(() => {
        setAnswers({});
        setCurrentIndex(0);
        setShowMissing(false);
        setSubmitError('');
    }, [quizId]);

    const {
        data: questions,
        isLoading,
        isError,
        error,
    } = useGetAllQuizQuestions(
        { path: { quizId: quizId! } },
        undefined,
        { enabled: !!quizId }
    );

    const submitMutation = useSubmitAnswers([], {
        onSuccess: (raw) => {
            const body = (raw as unknown as { data?: QuizResultResponse })?.data ?? null;
            navigate(`/quiz/${quizId}/result`, {
                state: { result: body, questions, quizTitle },
                replace: true,
            });
        },
        onError: (err) => {
            console.error('Submit failed:', err);
            setSubmitError('Failed to submit answers. Please try again.');
        },
    });

    const total = questions?.length ?? 0;

    const answeredCount = useMemo(() => {
        if (!questions) return 0;
        return questions.filter((q, i) => {
            const qid = q.questionId ?? `q-${i}`;
            return !!answers[qid];
        }).length;
    }, [questions, answers]);

    const missingIndexes = useMemo(() => {
        if (!questions) return [];
        return questions
            .map((q, i) => {
                const qid = q.questionId ?? `q-${i}`;
                return answers[qid] ? -1 : i;
            })
            .filter((i) => i !== -1);
    }, [questions, answers]);

    // ── Guards ────────────────────────────────────────────────
    if (!quizId) {
        return (
            <DashboardLayout hideSidebar>
                <div className="alert alert-danger">Missing quiz id.</div>
            </DashboardLayout>
        );
    }

    if (isLoading) {
        return (
            <DashboardLayout hideSidebar>
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            </DashboardLayout>
        );
    }

    if (isError) {
        return (
            <DashboardLayout hideSidebar>
                <div className="alert alert-danger">
                    Failed to load questions: {(error as Error)?.message ?? 'Unknown error'}
                </div>
            </DashboardLayout>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <DashboardLayout hideSidebar>
                <div className="alert alert-info">This quiz has no questions.</div>
            </DashboardLayout>
        );
    }

    // ── Current question ──────────────────────────────────────
    const q = questions[currentIndex];
    const qid = q.questionId ?? `q-${currentIndex}`;
    const isLast = currentIndex === total - 1;
    const isFirst = currentIndex === 0;

    const options = [
        { key: 'A', label: q.optionA },
        { key: 'B', label: q.optionB },
        { key: 'C', label: q.optionC },
    ].filter((o) => o.label);

    const handleSelect = (option: string) => {
        setAnswers((prev) => ({ ...prev, [qid]: option }));
        setShowMissing(false);
    };

    const goNext = () => {
        if (!isLast) setCurrentIndex((i) => i + 1);
    };

    const goPrev = () => {
        if (!isFirst) setCurrentIndex((i) => i - 1);
    };

    const handleSubmit = () => {
        if (!quizId) return;

        if (missingIndexes.length > 0) {
            setShowMissing(true);
            setSubmitError('');
            return;
        }

        const payload = Object.entries(answers)
            .filter(([questionId]) => !questionId.startsWith('q-'))
            .map(([questionId, chosenAnswer]) => ({ questionId, chosenAnswer }));

        if (payload.length !== total) {
            setSubmitError(
                'Some questions are missing a server ID. This is a backend bug — ' +
                'please report it. Answers were not submitted.'
            );
            return;
        }

        setSubmitError('');
        submitMutation.mutate({
            path: { quizId },
            body: { answers: payload },
        });
    };

    const progressPct = Math.round(((currentIndex + 1) / total) * 100);

    return (
        <DashboardLayout hideSidebar>
            {/* ── Back link (top-left corner) ── */}
            <div className="position-fixed" style={{ top: '5rem', left: '1.25rem' }}>
                <button
                    type="button"
                    className="btn btn-link text-decoration-none px-0 text-secondary"
                    onClick={() => navigate('/dashboard')}
                >
                    ← Back to dashboard
                </button>
            </div>

            {/* ── Card (centered, narrower) ── */}
            <div className="d-flex justify-content-center">
                <div
                    className="card shadow-sm border-0 overflow-hidden w-100"
                    style={{ maxWidth: 720 }}
                >
                    {/* Card body */}
                    <div className="card-body p-3 p-md-4">

                        {/* ── Quiz title ── */}
                        <div className="text-center mb-3 pb-3 border-bottom">
                            <p className="text-uppercase text-muted small fw-semibold mb-1">
                                Now taking
                            </p>
                            <h2 className="h5 fw-bold mb-0 text-dark">{quizTitle}</h2>
                        </div>

                        {/* Progress */}
                        <div className="mb-3">
                            <div className="d-flex justify-content-between small text-muted mb-2">
                                <span className="fw-semibold">
                                    Question {currentIndex + 1} of {total}
                                </span>
                                <span>
                                    {answeredCount} / {total} answered
                                </span>
                            </div>
                            <div
                                className="progress"
                                role="progressbar"
                                aria-valuenow={progressPct}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                style={{ height: 6 }}
                            >
                                <div
                                    className="progress-bar bg-primary"
                                    style={{ width: `${progressPct}%`, transition: 'width .3s ease' }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <div className="mb-3">
                            <div className="d-flex align-items-start mb-3">
                                <span
                                    className="badge rounded-pill bg-primary-subtle text-primary-emphasis me-2 flex-shrink-0"
                                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.7rem' }}
                                >
                                    {currentIndex + 1}
                                </span>
                                <p className="fw-semibold mb-0">
                                    {q.questionText ?? 'Untitled question'}
                                </p>
                            </div>

                            <div className="d-flex flex-column gap-2">
                                {options.map((opt) => {
                                    const isChosen = answers[qid] === opt.label;
                                    return (
                                        <label
                                            key={`${qid}-${opt.key}`}
                                            htmlFor={`${qid}-${opt.key}`}
                                            className={`d-flex align-items-start gap-3 p-3 border rounded-3 ${
                                                isChosen
                                                    ? 'border-primary bg-primary-subtle'
                                                    : 'border-light-subtle bg-body-tertiary'
                                            }`}
                                            style={{
                                                cursor: 'pointer',
                                                transition: 'all .15s ease',
                                            }}
                                        >
                                            <input
                                                className="form-check-input mt-1 flex-shrink-0"
                                                type="radio"
                                                name={`quiz-${quizId}-${qid}`}
                                                id={`${qid}-${opt.key}`}
                                                value={opt.label}
                                                checked={isChosen}
                                                onChange={() => handleSelect(opt.label!)}
                                            />
                                            <span className="d-flex align-items-baseline">
                                                <strong className="me-2 text-secondary">
                                                    {opt.key}.
                                                </strong>
                                                <span>{opt.label}</span>
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Missing-questions warning */}
                        {showMissing && missingIndexes.length > 0 && (
                            <div className="alert alert-warning border-0 rounded-3" role="alert">
                                <strong>
                                    You haven't answered {missingIndexes.length} question
                                    {missingIndexes.length > 1 ? 's' : ''}:
                                </strong>
                                <div className="mt-2 d-flex flex-wrap gap-2">
                                    {missingIndexes.map((idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className="btn btn-sm btn-outline-dark"
                                            onClick={() => {
                                                setCurrentIndex(idx);
                                                setShowMissing(false);
                                            }}
                                        >
                                            Question {idx + 1}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-2 small text-muted">
                                    Click one to jump to it, or keep navigating with Next / Previous.
                                </div>
                            </div>
                        )}

                        {submitError && (
                            <div className="alert alert-danger border-0 rounded-3 mt-3" role="alert">
                                {submitError}
                            </div>
                        )}
                    </div>

                    {/* ── Footer inside the card ── */}
                    <div className="card-footer bg-body-tertiary border-top py-3 px-3 px-md-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={goPrev}
                                disabled={isFirst}
                            >
                                ← Previous
                            </button>

                            <div className="d-flex gap-2">
                                {!isLast && (
                                    <button
                                        type="button"
                                        className="btn btn-primary px-4"
                                        onClick={goNext}
                                    >
                                        Next →
                                    </button>
                                )}

                                {isLast && (
                                    <button
                                        type="button"
                                        className="btn btn-success px-4"
                                        onClick={handleSubmit}
                                        disabled={submitMutation.isPending}
                                    >
                                        {submitMutation.isPending ? 'Submitting…' : 'Submit Answers'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default QuizPage;