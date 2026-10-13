import { useMemo } from 'react';
import DashboardLayout from '../component/DashboardLayout';
import { useGetQuizzes } from '../api/generated/queries';

function StatsPage() {
    const { data: quizzes, isLoading, isError, error } = useGetQuizzes();

    const stats = useMemo(() => {
        const all = quizzes ?? [];
        const total = all.length;
        const completed = all.filter((q) => q.taken).length;
        const remaining = total - completed;
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

        // Total questions across all quizzes.
        const totalQuestions = all.reduce(
            (sum, q) => sum + (q.numberOfQuestions ?? 0),
            0
        );

        // Group by language.
        const byLanguage = all.reduce<Record<string, number>>((acc, q) => {
            const lang = q.language ?? 'Unknown';
            acc[lang] = (acc[lang] ?? 0) + 1;
            return acc;
        }, {});

        return {
            total,
            completed,
            remaining,
            completionRate,
            totalQuestions,
            byLanguage,
        };
    }, [quizzes]);

    return (
        <DashboardLayout>
            {/* ── Page header ── */}
            <header className="pb-4 mb-4 border-bottom">
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
                    Stats
                </h1>
                <p className="text-secondary mb-0" style={{ maxWidth: 520 }}>
                    A snapshot of your quiz activity.
                </p>
            </header>

            {isLoading && (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading…</span>
                    </div>
                </div>
            )}

            {isError && (
                <div className="alert alert-danger" role="alert">
                    Failed to load stats:{' '}
                    {(error as Error)?.message ?? 'Unknown error'}
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    {/* ── Top-line numbers ── */}
                    <section className="mb-5" aria-label="Overview">
                        <h2 className="h6 fw-bold text-uppercase text-secondary ls-wide mb-3">
                            Overview
                        </h2>

                        <div className="row g-3">
                            <div className="col-12 col-md-3">
                                <div className="card border-0 rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <span className="text-uppercase text-secondary small fw-semibold ls-wide">
                                            Total
                                        </span>
                                        <strong
                                            className="d-block fs-2 fw-bold text-dark"
                                            style={{ fontFamily: 'Georgia, serif' }}
                                        >
                                            {stats.total}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-3">
                                <div className="card border-0 rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <span className="text-uppercase text-secondary small fw-semibold ls-wide">
                                            Completed
                                        </span>
                                        <strong
                                            className="d-block fs-2 fw-bold text-success"
                                            style={{ fontFamily: 'Georgia, serif' }}
                                        >
                                            {stats.completed}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-3">
                                <div className="card border-0 rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <span className="text-uppercase text-secondary small fw-semibold ls-wide">
                                            Remaining
                                        </span>
                                        <strong
                                            className="d-block fs-2 fw-bold text-primary"
                                            style={{ fontFamily: 'Georgia, serif' }}
                                        >
                                            {stats.remaining}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-3">
                                <div className="card border-0 rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <span className="text-uppercase text-secondary small fw-semibold ls-wide">
                                            Completion
                                        </span>
                                        <strong
                                            className="d-block fs-2 fw-bold text-dark"
                                            style={{ fontFamily: 'Georgia, serif' }}
                                        >
                                            {stats.completionRate}%
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Completion bar ── */}
                    <section className="mb-5" aria-label="Completion progress">
                        <h2 className="h6 fw-bold text-uppercase text-secondary ls-wide mb-3">
                            Completion progress
                        </h2>

                        <div
                            className="progress"
                            role="progressbar"
                            aria-label="Quizzes completed"
                            aria-valuenow={stats.completionRate}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            style={{ height: 10 }}
                        >
                            <div
                                className="progress-bar bg-success"
                                style={{ width: `${stats.completionRate}%` }}
                            />
                        </div>

                        <p className="text-secondary small mt-2 mb-0">
                            {stats.completed} of {stats.total} quizzes completed
                            · {stats.totalQuestions} total questions across all
                            quizzes
                        </p>
                    </section>

                    {/* ── By language ── */}
                    {Object.keys(stats.byLanguage).length > 0 && (
                        <section aria-label="Quizzes by language">
                            <h2 className="h6 fw-bold text-uppercase text-secondary ls-wide mb-3">
                                By language
                            </h2>

                            <ul className="list-unstyled mb-0">
                                {Object.entries(stats.byLanguage).map(
                                    ([lang, count]) => (
                                        <li
                                            key={lang}
                                            className="d-flex justify-content-between py-2 border-bottom"
                                        >
                                            <span className="fw-semibold">
                                                {lang}
                                            </span>
                                            <span className="text-secondary">
                                                {count}{' '}
                                                {count === 1 ? 'quiz' : 'quizzes'}
                                            </span>
                                        </li>
                                    )
                                )}
                            </ul>
                        </section>
                    )}
                </>
            )}
        </DashboardLayout>
    );
}

export default StatsPage;