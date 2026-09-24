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
            // hey-api returns { data, error, response, request }
            const body = (raw as unknown as { data?: QuizResultResponse })?.data ?? null;

            // navigate to the dedicated result page, passing the grade along
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
            <div className="page-back-row">
                <button
                    type="button"
                    className="btn-back"
                    onClick={() => navigate('/dashboard')}
                >
                    ← Back
                </button>
            </div>

            <header className="page-heading">
                <p className="eyebrow">Quiz</p>
                <h1>Quiz Questions</h1>
                <div className="heading-rule" aria-hidden="true" />
            </header>

            <ol className="quiz-questions">
                {questions.map((q, index) => {
                    const qid = q.questionId ?? `q-${index}`;
                    const options = [
                        { key: 'A', label: q.optionA },
                        { key: 'B', label: q.optionB },
                        { key: 'C', label: q.optionC },
                    ].filter((o) => o.label);

                    return (
                        <li key={qid} className="quiz-question">
                            <p className="quiz-question-text">
                                <span className="quiz-question-number">{index + 1}.</span>{' '}
                                {q.questionText ?? 'Untitled question'}
                            </p>

                            <div className="quiz-options">
                                {options.map((opt) => {
                                    const isChosen = answers[qid] === opt.label;
                                    const classes = ['quiz-option'];
                                    if (isChosen) classes.push('is-selected');

                                    return (
                                        <label
                                            key={opt.key}
                                            htmlFor={`${qid}-${opt.key}`}
                                            className={classes.join(' ')}
                                        >
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name={qid}
                                                id={`${qid}-${opt.key}`}
                                                value={opt.label}
                                                checked={isChosen}
                                                onChange={() => handleSelect(qid, opt.label!)}
                                            />
                                            <span className="quiz-option-label">
                                                <strong>{opt.key}.</strong> {opt.label}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </li>
                    );
                })}
            </ol>

            {submitError && (
                <p className="quiz-submit-error" role="alert">
                    {submitError}
                </p>
            )}

            <div className="quiz-submit-row">
                <button
                    type="button"
                    className="btn btn-brand"
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