import { useMemo } from "react";
import DashboardCard from "../../../components/DashboardCard/DashboardCard";
import DashboardInfoPane from "../../../components/DashboardInfoPane/DashboardInfoPane";
import DashboardCalendar from "../../../components/DashboardCalendar/DashboardCalendar";

import "./DashboardView.css";

const DashboardView = ({ username }) => {
  // Static metric cards
  const metricCards = useMemo(() => {
    return [
      {
        title: "Total Exams Attempted",
        value: 8,
        subtitle: "All-time attempts",
        icon: "fa-file-alt",
      },
      {
        title: "Average Score (%)",
        value: "72%",
        subtitle: "Across all exams",
        icon: "fa-chart-line",
      },
      {
        title: "Pass Rate (%)",
        value: "85%",
        subtitle: "Exams passed vs attempted",
        icon: "fa-check-circle",
      },
      {
        title: "Best Subject",
        value: "Algorithms",
        subtitle: "Highest average: 78%",
        icon: "fa-star",
      },
    ];
  }, []);

  // Static upcoming events (student exams)
  const upcomingEvents = useMemo(
    () => [
      {
        title: "OOP Final Exam",
        start: new Date("2025-09-15T10:00:00"),
        end: new Date("2025-09-15T12:00:00"),
      },
      {
        title: "Networking Quiz",
        start: new Date("2025-09-20T09:00:00"),
        end: new Date("2025-09-20T10:00:00"),
      },
    ],
    []
  );

  // Static recent activities (exam-related for student)
  const activities = useMemo(
    () => [
      {
        id: 1,
        action: "completed",
        type: "exam",
        title: "Midterm - DB Systems",
        time: "2 days ago",
      },
      {
        id: 2,
        action: "scored 75%",
        type: "exam",
        title: "Quiz - OOP",
        time: "1 week ago",
      },
      {
        id: 3,
        action: "registered for",
        type: "exam",
        title: "Final Exam - Algorithms",
        time: "just now",
      },
    ],
    []
  );

  return (
    <div className="student-dashboard container-fluid flex-grow-1">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold m-0" data-cy="welcome-message">
          Welcome back {username} 👋
        </h1>
      </div>

      {/* Dashboard Body */}
      <div className="dashboard-main-body">
        <div className="main-left-side">
          {/* Metric Cards */}
          <div className="metrics-cards">
            {metricCards.map((card, index) => (
              <div key={index}>
                <DashboardCard {...card} className="w-100" />
              </div>
            ))}
          </div>

          <div className="main-columns">
            {/* Activities */}
            <DashboardInfoPane
              title="Recent Activities"
              subtitle="Your latest exam updates"
            >
              <div
                className="activity-feed"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="activity-item border-bottom pb-3 mb-3"
                  >
                    <div className="d-flex justify-content-between">
                      <span className="fw-semibold">
                        You {activity.action} {activity.type}: "{activity.title}"
                      </span>
                      <span className="text-muted small">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardInfoPane>
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="main-right-side">
          <DashboardInfoPane title="Upcoming Exams" subtitle="Exam Calendar">
            <DashboardCalendar events={upcomingEvents} />
          </DashboardInfoPane>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
