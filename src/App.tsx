import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.tsx';
import SignUp from './pages/SignUp.tsx';
import QuizDashboard from './pages/QuizzesPage.tsx';
import StatsQuiz from './pages/StatsQuiz.tsx';
import QuizPage from './pages/QuizPage.tsx';
import QuizResultPage from './pages/QuizResultPage.tsx';
import ProtectedRoute from './component/ProtectedRoute.tsx';
import RequireRole from './component/RequireRole.tsx';
import AdminDashBoard from './pages/AdminDashBoard.tsx';
// Create these two — placeholder is fine for now
import AdminUsers from './pages/AdminUsers.tsx';
import AdminQuizzes from './pages/AdminQuizzes.tsx';
import AdminQuizCreate from './pages/AdminQuizCreate.tsx';
import QuizzesPage from './pages/QuizzesPage.tsx';
import MyResultsPage from './pages/MyResultsPage.tsx';
import StatsPage from './pages/StatsPage.tsx';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route element={<ProtectedRoute />}>
        {/* User-only */}
        <Route element={<RequireRole allow={['USER']} />}>
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/results" element={<MyResultsPage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/quiz/:quizId/result" element={<QuizResultPage />} />
        </Route>

        {/* Admin-only */}
        <Route element={<RequireRole allow={['ADMIN']} />}>
          <Route path="/admin" element={<AdminDashBoard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/quizzes" element={<AdminQuizzes />} />
          <Route path="/admin/quizzes/create" element={<AdminQuizCreate />} />
        </Route>

        {/* Unknown route for logged-in users */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;