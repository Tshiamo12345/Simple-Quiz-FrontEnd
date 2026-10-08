import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

    const [answers, setAnswers] = useState<Answers>({});
    const [submitError, setSubmitError] = useState('');

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
                state: { result: body, questions },
                replace: true,
            });
        },
        onError: (err) => {
            console.error('Submit failed:', err);
            setSubmitError('Failed to submit answers. Please try again.');
        },
    });

    if (!quizId) {
        return (
            <DashboardLayout>
                <div className="alert alert-danger">Missing quiz id.</div>
            </DashboardLayout>
        );
    }

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            </DashboardLayout>
        );
    }

    if (isError) {
        return (
            <DashboardLayout>
                <div className="alert alert-danger">
                    Failed to load questions: {(error as Error)?.message ?? 'Unknown error'}
                </div>
            </DashboardLayout>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <DashboardLayout>
                <div className="alert alert-info">This quiz has no questions.</div>
            </DashboardLayout>
        );
    }

    const allAnswered = questions.every((q) => q.questionId && answers[q.questionId]);

    const handleSelect = (questionId: string, option: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = () => {
        if (!quizId) return;
        setSubmitError('');

        submitMutation.mutate({
            path: { quizId },
            body: {
                answers: Object.entries(answers).map(([questionId, chosenAnswer]) => ({
                    questionId,
                    chosenAnswer,
                })),
            },
        });
    };

    return (
        <DashboardLayout>
            <div className="mb-3">
                <button
                    type="button"
                    className="btn btn-link text-decoration-none px-0"
                    onClick={() => navigate('/dashboard')}
                >
                    ← Back
                </button>
            </div>

            <header className="text-center mb-4">
                <p className="text-uppercase text-primary fw-bold small mb-1">Quiz</p>
                <h1 className="fw-bold mb-2">Quiz Questions</h1>
                <div className="mx-auto bg-success rounded" style={{ width: 64, height: 3 }} aria-hidden="true" />
            </header>

            <ol className="list-unstyled d-flex flex-column gap-4">
                {questions.map((q, index) => {
                    const qid = q.questionId ?? `q-${index}`;
                    const options = [
                        { key: 'A', label: q.optionA },
                        { key: 'B', label: q.optionB },
                        { key: 'C', label: q.optionC },
                    ].filter((o) => o.label);

                    return (
                        <li key={qid} className="card shadow-sm">
                            <div className="card-body">
                                <p className="fw-semibold mb-3">
                                    <span className="me-2">{index + 1}.</span>
                                    {q.questionText ?? 'Untitled question'}
                                </p>

                                <div className="d-flex flex-column gap-2">
                                    {options.map((opt) => {
                                        const isChosen = answers[qid] === opt.label;
                                        return (
                                            <label
                                                key={opt.key}
                                                htmlFor={`${qid}-${opt.key}`}
                                                className={`d-flex align-items-start gap-2 p-3 border rounded ${
                                                    isChosen ? 'border-primary bg-primary-subtle' : ''
                                                }`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <input
                                                    className="form-check-input mt-1"
                                                    type="radio"
                                                    name={qid}
                                                    id={`${qid}-${opt.key}`}
                                                    value={opt.label}
                                                    checked={isChosen}
                                                    onChange={() => handleSelect(qid, opt.label!)}
                                                />
                                                <span>
                                                    <strong>{opt.key}.</strong> {opt.label}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>

            {submitError && (
                <p className="text-danger mt-3" role="alert">
                    {submitError}
                </p>
            )}

            <div className="d-flex justify-content-center mt-4">
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!allAnswered || submitMutation.isPending}
                    onClick={handleSubmit}
                >
                    {submitMutation.isPending ? 'Submitting…' : 'Submit Answers'}
                </button>
            </div>
        </DashboardLayout>
    );
}

export default QuizPage;