import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../component/DashboardLayout';
import { useCreateQuiz } from '../api/generated/queries';
import * as Common from '../api/generated/queries/common';
import type {
    CreateQuizRequestDto,
    CreateQuestionRequestDto,
} from '../api/generated/requests/types.gen';

type CorrectKey = 'A' | 'B' | 'C';

type QuestionForm = {
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    correctKey: CorrectKey;
};

function emptyQuestion(): QuestionForm {
    return {
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        correctKey: 'A',
    };
}

const LANGUAGES = [
    'Java',
    'JavaScript',
    'TypeScript',
    'Python',
    'C#',
    'C++',
    'Go',
    'SQL',
    'HTML/CSS',
    'Other',
];

function AdminQuizCreate() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion()]);
    const [formError, setFormError] = useState<string | null>(null);

    const createMutation = useCreateQuiz(undefined, {
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: Common.UseGetAllQuizAdminKeyFn(),
            });
            navigate('/admin/quizzes');
        },
        onError: (err: unknown) => {
            setFormError(
                err instanceof Error ? err.message : 'Could not create quiz.'
            );
        },
    });

    const isSaving = createMutation.isPending;

    function updateQuestion(index: number, patch: Partial<QuestionForm>) {
        setQuestions((prev) =>
            prev.map((q, i) => (i === index ? { ...q, ...patch } : q))
        );
    }

    function addQuestion() {
        setQuestions((prev) => [...prev, emptyQuestion()]);
    }

    function removeQuestion(index: number) {
        setQuestions((prev) => prev.filter((_, i) => i !== index));
    }

    function validate(): string | null {
        if (!title.trim()) return 'Title is required.';
        if (!language.trim()) return 'Language is required.';
        if (!description.trim()) return 'Description is required.';
        if (questions.length === 0) return 'Add at least one question.';

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText.trim()) return `Question ${i + 1}: text is required.`;
            if (!q.optionA.trim()) return `Question ${i + 1}: Option A is required.`;
            if (!q.optionB.trim()) return `Question ${i + 1}: Option B is required.`;
            if (!q.optionC.trim()) return `Question ${i + 1}: Option C is required.`;
        }
        return null;
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (isSaving) return;

        const validationError = validate();
        if (validationError) {
            setFormError(validationError);
            return;
        }
        setFormError(null);

        const payload: CreateQuizRequestDto = {
            title: title.trim(),
            language: language.trim(),
            description: description.trim(),
            questions: questions.map<CreateQuestionRequestDto>((q) => {
                const correctAnswer =
                    q.correctKey === 'A'
                        ? q.optionA
                        : q.correctKey === 'B'
                          ? q.optionB
                          : q.optionC;

                return {
                    questionText: q.questionText.trim(),
                    optionA: q.optionA.trim(),
                    optionB: q.optionB.trim(),
                    optionC: q.optionC.trim(),
                    correctAnswer: correctAnswer.trim(),
                };
            }),
        };

        createMutation.mutate({ body: payload });
    }

    function handleCancel() {
        if (isSaving) return;
        navigate('/admin/quizzes');
    }

    return (
        <DashboardLayout>
            <div className="row align-items-center mb-4 g-2">
                <div className="col-md-2 d-none d-md-block" />
                <div className="col-12 col-md-8 text-center">
                    <h1 className="fw-bold mb-1">Create Quiz</h1>
                    <p className="text-secondary mb-0">Add a new quiz and its questions.</p>
                </div>
                <div className="col-md-2 d-none d-md-block" />
            </div>

            {formError && (
                <div className="alert alert-danger" role="alert">
                    {formError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Quiz details */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body p-4">
                        <h2 className="h5 mb-3">Quiz details</h2>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="quiz-title">
                                Title
                            </label>
                            <input
                                id="quiz-title"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isSaving}
                                required
                                maxLength={120}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="quiz-language">
                                Language
                            </label>
                            <input
                                id="quiz-language"
                                className="form-control"
                                list="quiz-languages"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                disabled={isSaving}
                                required
                                maxLength={60}
                            />
                            <datalist id="quiz-languages">
                                {LANGUAGES.map((lang) => (
                                    <option key={lang} value={lang} />
                                ))}
                            </datalist>
                        </div>

                        <div className="mb-0">
                            <label className="form-label" htmlFor="quiz-description">
                                Description
                            </label>
                            <textarea
                                id="quiz-description"
                                className="form-control"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isSaving}
                                required
                                maxLength={500}
                            />
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="h5 mb-0">Questions ({questions.length})</h2>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={addQuestion}
                                disabled={isSaving}
                            >
                                + Add question
                            </button>
                        </div>

                        {questions.length === 0 && (
                            <p className="text-secondary mb-0">
                                No questions yet. Click <strong>Add question</strong> to start.
                            </p>
                        )}

                        {questions.map((q, i) => (
                            <div key={i} className="border rounded p-3 mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h3 className="h6 mb-0">Question {i + 1}</h3>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removeQuestion(i)}
                                        disabled={isSaving || questions.length === 1}
                                        title={
                                            questions.length === 1
                                                ? 'A quiz needs at least one question'
                                                : 'Remove question'
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor={`q-${i}-text`}>
                                        Question text
                                    </label>
                                    <input
                                        id={`q-${i}-text`}
                                        className="form-control"
                                        value={q.questionText}
                                        onChange={(e) =>
                                            updateQuestion(i, { questionText: e.target.value })
                                        }
                                        disabled={isSaving}
                                        required
                                        maxLength={500}
                                    />
                                </div>

                                {(['A', 'B', 'C'] as const).map((key) => {
                                    const optionField =
                                        `option${key}` as 'optionA' | 'optionB' | 'optionC';
                                    const isCorrect = q.correctKey === key;
                                    return (
                                        <div className="input-group mb-2" key={key}>
                                            <span className="input-group-text">
                                                <input
                                                    type="radio"
                                                    name={`q-${i}-correct`}
                                                    checked={isCorrect}
                                                    onChange={() =>
                                                        updateQuestion(i, { correctKey: key })
                                                    }
                                                    disabled={isSaving}
                                                    aria-label={`Mark option ${key} as correct`}
                                                />
                                            </span>
                                            <span className="input-group-text">{key}</span>
                                            <input
                                                id={`q-${i}-option-${key}`}
                                                className="form-control"
                                                value={q[optionField]}
                                                onChange={(e) =>
                                                    updateQuestion(i, {
                                                        [optionField]: e.target.value,
                                                    } as Partial<QuestionForm>)
                                                }
                                                disabled={isSaving}
                                                placeholder={`Option ${key}`}
                                                required
                                            />
                                            {isCorrect && (
                                                <span className="input-group-text text-success">
                                                    Correct
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}

                                <div className="form-text">
                                    Select the radio button next to the correct option.
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                        {isSaving ? 'Creating…' : 'Create quiz'}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}

export default AdminQuizCreate;