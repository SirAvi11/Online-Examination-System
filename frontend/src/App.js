import logo from './logo.svg';
import './App.css';
import AuthPage from './pages/AuthPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeacherView from './pages/Teacher/TeacherView';
import StudentView from './pages/Student/StudentView';
import ExamStatusCard from './components/Exam/ExamStatusCard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/teacher-dashboard" element={<TeacherView />} />
        <Route path="/student-dashboard" element={<StudentView />} />
        <Route path="/status-card" element={<ExamStatusCard/>} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
