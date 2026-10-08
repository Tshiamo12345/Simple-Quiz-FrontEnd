import DashboardLayout from '../component/DashboardLayout';

function StatsQuiz() {
    return (
        <DashboardLayout>
            <div className="text-center mb-4">
                <p className="text-uppercase text-primary fw-bold small mb-1">
                    Performance
                </p>
                <h1 className="fw-bold mb-2">Quiz Stats</h1>
                <p className="text-secondary mb-3">
                    Review your results and see how your scores are changing.
                </p>
                <div className="mx-auto bg-success rounded" style={{ width: 64, height: 3 }} />
            </div>

            <section className="row g-3" aria-label="Quiz statistics">
                <div className="col-12 col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column gap-2">
                            <span className="text-secondary small">Best score</span>
                            <strong className="fs-3">92%</strong>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column gap-2">
                            <span className="text-secondary small">Quizzes completed</span>
                            <strong className="fs-3">8</strong>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column gap-2">
                            <span className="text-secondary small">Current streak</span>
                            <strong className="fs-3">4 days</strong>
                        </div>
                    </div>
                </div>
            </section>
        </DashboardLayout>
    );
}

export default StatsQuiz;