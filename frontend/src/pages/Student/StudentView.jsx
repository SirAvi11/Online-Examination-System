import { useState, useEffect } from 'react';
import Dashboard from '../../components/Dashboard/Dashboard';
import Sidebar from '../../components/Dashboard/Sidebar/Sidebar';
import MainContent from '../../components/Dashboard/MainContent';
import Header from '../../components/Header/Header';
import StudentDashboardView from './StudentDashboardView';
import StudentExamView from './StudentExamView';
import { useNavigate } from 'react-router-dom';

const StudentView = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || user?.role !== 'Student') {
      navigate('/login');
    }
    setUser(user);
  }, [navigate]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <StudentDashboardView username={user?.name} />;
      case 'exams':
        return <StudentExamView />;
      // Add more cases as needed
      default:
        return <StudentDashboardView />;
    }
  };

  return (
    <>
      <Header />
      <Dashboard>
        <Sidebar setActiveView={setActiveView} userRole={user?.role} />
        <MainContent>
          {renderView()}
        </MainContent>
      </Dashboard>
    </>
  );
};

export default StudentView;