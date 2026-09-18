import DashboardLayout from '../component/DashboardLayout';

function StatsQuiz() {
    return (
        <DashboardLayout>
            <div className="page-heading">
                <p className="eyebrow">Performance</p>
                <h1>Quiz Stats</h1>
                <p className="text-secondary">Review your results and see how your scores are changing.</p>
            </div>

            <section className="stats-panel" aria-label="Quiz statistics">
                <div>
                    <span className="summary-label">Best score</span>
                    <strong className="summary-value">92%</strong>
                </div>
                <div>
                    <span className="summary-label">Quizzes completed</span>
                    <strong className="summary-value">8</strong>
                </div>
                <div>
                    <span className="summary-label">Current streak</span>
                    <strong className="summary-value">4 days</strong>
                </div>
            </section>
        </DashboardLayout>
    );
}

export default StatsQuiz;
