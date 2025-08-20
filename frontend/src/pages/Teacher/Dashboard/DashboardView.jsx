import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DashboardCard from '../../../components/DashboardCard/DashboardCard';
import DashboardInfoPane from '../../../components/DashboardInfoPane/DashboardInfoPane';
import './DashboardView.css';

// Register ChartJS components once
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Constants for data that doesn't change
const METRIC_CARDS = [
  { title: 'Total Exams', value: '12', subtitle: '10% of total', icon: 'fa-file-alt' },
  { title: 'Students', value: '+320', subtitle: 'In 8 groups', icon: 'fa-users' },
  { title: 'Average Scores', value: '64.3%', subtitle: '20% of total', icon: 'fa-chart-line' },
  { title: 'Modules', value: '4', subtitle: '+31 topics', icon: 'fa-layer-group' },
];

const CALENDAR_WEEKS = [
  [28, 29, 30, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, 1]
];

const DashboardView = ({username}) => {
  // Memoized data to prevent unnecessary recalculations
  const modulesData = useMemo(() => ({
    labels: ['DB Systems', 'OOP', 'Algorithms', 'Networking'],
    datasets: [{
      label: 'Average Scores',
      data: [72, 65, 68, 60],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  }), []);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true, max: 100 } },
  }), []);

  const activities = useMemo(() => [
    { id: 1, action: 'created', type: 'exam', title: 'Midterm Exam - SFSD', time: 'just now' },
    { id: 2, action: 'edited', type: 'module', title: 'Advanced Database Systems', time: 'just now' },
    { id: 3, action: 'deleted', type: 'exam', title: 'Quiz 1 - OOP', time: 'just now' },
  ], []);

  const upcomingEvents = useMemo(() => [
    { id: 1, title: 'Midterm Exam - OOP', date: 'January 22', time: '14:00 - 16:00' }
  ], []);

  return (
    <div className="teacher-dashboard container-fluid flex-grow-1">
      {/* Header with clear separation */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold m-0">Welcome back {username} 👋</h1>
        {/* Add any header actions here if needed */}
      </div>

      {/* Metrics Grid - Left-aligned cards */}
      <div className='dashboard-main-body'>
        <div className='main-left-side'>
          <div className='metrics-cards'> 
              {METRIC_CARDS.map((card, index) => (
                <div key={index} className="">
                  <DashboardCard {...card} className="w-100" />
                </div>
              ))}
          </div>
          <div className='main-columns'>
            <DashboardInfoPane 
              title="Average Exam Scores By Module" 
              subtitle="January - June 2024"
            >
              <div style={{ height: '250px' }}>
                <Bar data={modulesData} options={chartOptions} />
              </div>
            </DashboardInfoPane>
            <DashboardInfoPane 
              title="Recent Activities" 
              subtitle="January - June 2024"
            >
              <div className="activity-feed" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {activities.map(activity => (
                  <div key={activity.id} className="activity-item border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="fw-semibold">
                        You {activity.action} the {activity.type}: "{activity.title}"
                      </span>
                      <span className="text-muted small">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardInfoPane>

          </div>
        </div>
        <div className='main-right-side'>
          <DashboardInfoPane 
            title="Upcoming Events" 
            subtitle="March 2024"
          >
            <div className="d-flex flex-column" style={{ gap: '1.5rem' }}>
              <div className="calendar">
                <table className="table table-bordered m-0">
                  <thead>
                    <tr>
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <th key={day} className="text-center p-2">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CALENDAR_WEEKS.map((week, weekIndex) => (
                      <tr key={weekIndex}>
                        {week.map((day, dayIndex) => (
                          <td 
                            key={dayIndex} 
                            className={`text-center p-2 ${day === 22 ? 'bg-primary text-white rounded' : ''}`}
                          >
                            {day}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="events-list">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="event-item p-3 bg-light rounded">
                    <div className="fw-semibold">{event.title}</div>
                    <div className="text-muted small">
                      {event.date}, {event.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DashboardInfoPane>
        </div>
      </div>
     

      {/* Main Content Area - 3 Column Layout */}
      {/* <div className="row g-4">
        <div className="col-md-6 col-lg-4">
          <DashboardInfoPane 
            title="Average Exam Scores By Module" 
            subtitle="January - June 2024"
          >
            <div style={{ height: '250px' }}>
              <Bar data={modulesData} options={chartOptions} />
            </div>
          </DashboardInfoPane>
        </div>

        <div className="col-md-6 col-lg-4">
          <DashboardInfoPane 
            title="Recent Activities" 
            subtitle="January - June 2024"
          >
            <div className="activity-feed" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {activities.map(activity => (
                <div key={activity.id} className="activity-item border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between">
                    <span className="fw-semibold">
                      You {activity.action} the {activity.type}: "{activity.title}"
                    </span>
                    <span className="text-muted small">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardInfoPane>
        </div>

        <div className="col-md-12 col-lg-4">
          <DashboardInfoPane 
            title="Upcoming Events" 
            subtitle="March 2024"
          >
            <div className="d-flex flex-column" style={{ gap: '1.5rem' }}>
              <div className="calendar">
                <table className="table table-bordered m-0">
                  <thead>
                    <tr>
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <th key={day} className="text-center p-2">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CALENDAR_WEEKS.map((week, weekIndex) => (
                      <tr key={weekIndex}>
                        {week.map((day, dayIndex) => (
                          <td 
                            key={dayIndex} 
                            className={`text-center p-2 ${day === 22 ? 'bg-primary text-white rounded' : ''}`}
                          >
                            {day}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="events-list">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="event-item p-3 bg-light rounded">
                    <div className="fw-semibold">{event.title}</div>
                    <div className="text-muted small">
                      {event.date}, {event.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DashboardInfoPane>
        </div>
      </div> */}

    </div>
  );
};

export default DashboardView;