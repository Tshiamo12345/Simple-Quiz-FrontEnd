import './App.css'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Login from './pages/Login.tsx'
import SignUp from './pages/SignUp.tsx'
import QuizDashboard from './pages/QuizDashboard.tsx'
import StatsQuiz from './pages/StatsQuiz.tsx'
import QuizPage from './pages/QuizPage.tsx'
function App() {

  return (
    <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='/signup' element={<SignUp />}/>
      <Route path='/dashboard' element={<QuizDashboard />}/>
      <Route path='/stats' element={<StatsQuiz />}/>
      <Route path="/quiz/:quizId" element={<QuizPage />} />
    </Routes>
  )
}

export default App
