import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../component/DashboardLayout';
import { useGetAllQuizQuestions } from '../api/generated/queries';
import type { QuizQuestionsRequest } from '../api/generated/requests/types.gen';

type Answers = Record<string, string>; // { questionId: chosenOption }

function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);

  const {
    data: questions,
    isLoading,
    isError,
    error,
  } = useGetAllQuizQuestions(
    { path: { quizId: quizId! } },
    undefined,
    { enabled: !!quizId } // don't fire until quizId exists
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
    // later: submitAnswersMutation.mutate({
    //   path: { quizId },
    //   body: {
    //     answers: Object.entries(answers).map(([questionId, chosenAnswer]) => ({
    //       questionId,
    //       chosenAnswer,
    //     })),
    //   },
    // });
  };

  return (
    <DashboardLayout>
      <div className="page-heading d-flex justify-content-between align-items-center mb-4">
        <h3>Quiz Questions</h3>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate('/dashboard')}
        >
          ← Back
        </button>
      </div>

      <ol className="list-group list-group-numbered">
        {questions.map((q, index) => {
          const qid = q.questionId ?? `q-${index}`;
          const options = [
            { key: 'A', label: q.optionA },
            { key: 'B', label: q.optionB },
            { key: 'C', label: q.optionC },
          ].filter((o) => o.label);

          return (
            <li key={qid} className="list-group-item">
              <p className="mb-3 fw-semibold">{q.questionText ?? 'Untitled question'}</p>

              {options.map((opt) => (
                <div className="form-check" key={opt.key}>
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
                  <label className="form-check-label" htmlFor={`${qid}-${opt.key}`}>
                    <strong>{opt.key}.</strong> {opt.label}
                  </label>
                </div>
              ))}
            </li>
          );
        })}
      </ol>

      <div className="d-flex justify-content-end mt-4">
        <button
          type="button"
          className="btn btn-primary"
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