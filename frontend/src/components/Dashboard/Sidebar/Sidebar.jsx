import SidebarLink from './SidebarLink';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = ({ setActiveView, userRole }) => {
  const navigate = useNavigate();

  // Track currently active view
  const [activeView, setActiveViewState] = useState('dashboard');

  // Common links for all roles
  const commonLinks = [
    { icon: 'fa-th-large', label: 'Dashboard', view: 'dashboard' },
    { icon: 'fa-file-alt', label: 'Exams', view: 'exams' }
  ];

  // Teacher-specific links
  const teacherLinks = [
    { icon: 'fa-layer-group', label: 'Modules', view: 'modules' },
    { icon: 'fa-calendar-alt', label: 'Schedules', view: 'schedules' },
    { icon: 'fa-chart-bar', label: 'Insights', view: 'insights' }
  ];

  const secondaryLinks = [
    { icon: 'fa-cog', label: 'Settings', view: 'settings' },
    { icon: 'fa-sign-out-alt', label: 'Log out', action: 'logout' }
  ];

  // Determine which main links to show based on role
  const mainLinks = userRole === 'Teacher' 
    ? [...commonLinks, ...teacherLinks] 
    : commonLinks;

  const handleLinkClick = (view) => {
    if (view === 'logout') {
      handleLogout();
    } else {
      setActiveViewState(view);
      setActiveView(view);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <aside className="d-flex flex-column justify-content-between bg-white border-end" 
           style={{ width: '14rem', minWidth: '14rem' }}>
      <nav className="pt-4 pb-3 d-flex flex-column gap-2 px-3 border-bottom">
        {mainLinks.map((link, index) => (
          <SidebarLink 
            key={`main-${index}`} 
            {...link} 
            active={activeView === link.view}
            onClick={() => handleLinkClick(link.view)}
          />
        ))}
      </nav>
      <nav className="pb-4 px-3 pt-3 d-flex flex-column gap-2 border-top">
        {secondaryLinks.map((link, index) => (
          <SidebarLink 
            key={`secondary-${index}`} 
            {...link} 
            active={activeView === link.view}
            onClick={() => handleLinkClick(link.view || link.action)}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
