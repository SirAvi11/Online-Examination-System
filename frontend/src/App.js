import logo from './logo.svg';
import './App.css';
import AuthPage from './pages/AuthPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeacherView from './pages/Teacher/TeacherView';
import StudentView from './pages/Student/StudentView';
import AdminView from './pages/Admin/AdminView';
import ExamStatusCard from './components/Exam/ExamStatusCard';
import Question from './components/Question/Question';
import ExamWindow from './pages/Student/ExamWindow';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/teacher-dashboard" element={<TeacherView />} />
        <Route path="/student-dashboard" element={<StudentView />} />
        <Route path="/admin-dashboard" element={<AdminView />} />
        <Route path="/status-card" element={<ExamStatusCard/>} />
        <Route path="/question-bank" element={<Question/>} />
        <Route path="/exam-window" element={<ExamWindow />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
