import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import SignUp from './pages/SignUp.tsx';
import QuizDashboard from './pages/QuizDashboard.tsx';
import StatsQuiz from './pages/StatsQuiz.tsx';
import QuizPage from './pages/QuizPage.tsx';
import QuizResultPage from './pages/QuizResultPage.tsx';
import ProtectedRoute from './component/ProtectedRoute.tsx';
import RequireRole from './component/RequireRole.tsx';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Logged-in routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RequireRole allow={['user']} />}>


          <Route path="/dashboard" element={<QuizDashboard />} />
          <Route path="/stats" element={<StatsQuiz />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/quiz/:quizId/result" element={<QuizResultPage />} />
        </Route>
        
        
      </Route>
    </Routes>
  );
}

export default App;