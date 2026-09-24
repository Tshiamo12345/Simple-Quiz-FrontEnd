import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import SignUp from './pages/SignUp.tsx';
import QuizDashboard from './pages/QuizDashboard.tsx';
import StatsQuiz from './pages/StatsQuiz.tsx';
import QuizPage from './pages/QuizPage.tsx';
import ProtectedRoute from './component/ProtectedRoute.tsx';
import QuizResultPage from './pages/QuizResultPage.tsx';
function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<QuizDashboard />} />
                <Route path="/stats" element={<StatsQuiz />} />
                <Route path="/quiz/:quizId" element={<QuizPage />} />
                <Route path="/quiz/:quizId/result" element={<QuizResultPage />} />
            </Route>
        </Routes>
    );
}

export default App;