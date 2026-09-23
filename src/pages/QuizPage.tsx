import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../component/DashboardLayout';
import { useGetAllQuizQuestions } from '../api/generated/queries';

type Answers = Record<string, string>;

function QuizPage() {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();

    const [answers, setAnswers] = useState<Answers>({});
    const [submitted, setSubmitted] = useState(false);

    const { data: questions, isLoading, isError, error } = useGetAllQuizQuestions(
        { path: { quizId: quizId! } },
        undefined,
        { enabled: !!quizId }
    );

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
        setSubmitted(true);
        console.log('Answers:', answers);
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
                                {options.map((opt) => (
                                    <label
                                        key={opt.key}
                                        htmlFor={`${qid}-${opt.key}`}
                                        className={`quiz-option ${
                                            answers[qid] === opt.label ? 'is-selected' : ''
                                        }`}
                                    >
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={qid}
                                            id={`${qid}-${opt.key}`}
                                            value={opt.label}
                                            checked={answers[qid] === opt.label}
                                            onChange={() => handleSelect(qid, opt.label!)}
                                            disabled={submitted}
                                        />
                                        <span className="quiz-option-label">
                                            <strong>{opt.key}.</strong> {opt.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </li>
                    );
                })}
            </ol>

            <div className="quiz-submit-row">
                <button
                    type="button"
                    className="btn btn-brand"
                    disabled={!allAnswered || submitted}
                    onClick={handleSubmit}
                >
                    {submitted ? 'Submitted' : 'Submit Answers'}
                </button>
            </div>
        </DashboardLayout>
    );
}

export default QuizPage;