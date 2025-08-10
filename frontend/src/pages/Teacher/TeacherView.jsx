import { useState, useEffect } from 'react';
import Dashboard from '../../components/Dashboard/Dashboard';
import Sidebar from '../../components/Dashboard/Sidebar/Sidebar';
import MainContent from '../../components/Dashboard/MainContent';
import Header from '../../components/Header/Header';
import TeacherDashboardView from './TeacherDashboardView';
import TeacherExamView from './TeacherExamView';
import TeacherScheduleView from './TeacherScheduleView';
import TeacherInsightsView from './TeacherInsightsView';
import TeacherModulesView from './TeacherModulesView';
import { useNavigate } from 'react-router-dom';

const TeacherView = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || user?.role !== 'Teacher') {
      navigate('/login');
    }
    setUser(user);
  }, [navigate]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <TeacherDashboardView username={user?.name} />;
      case 'exams':
        return <TeacherExamView />;
      case 'modules':
        return <TeacherModulesView />;
      case 'schedules':
        return <TeacherScheduleView />;
      case 'insights':
        return <TeacherInsightsView />;
      // Add more cases as needed
      default:
        return <TeacherDashboardView />;
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

export default TeacherView;