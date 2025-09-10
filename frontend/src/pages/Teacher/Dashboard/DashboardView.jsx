import { useMemo, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DashboardCard from "../../../components/DashboardCard/DashboardCard";
import DashboardInfoPane from "../../../components/DashboardInfoPane/DashboardInfoPane";
import DashboardCalendar from "../../../components/DashboardCalendar/DashboardCalendar";
import "./DashboardView.css";

// Register ChartJS components once
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardView = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const metricCards = useMemo(() => {
    if (!dashboardData) return [];

    const stats = dashboardData.stats;

    return [
      {
        title: "Upcoming Exams",
        value: stats.upcomingExams,
        subtitle: `Total Exams: ${stats.totalExams}`,
        icon: "fa-file-alt",
      },
      {
        title: "Students Registered",
        value: stats.closestUpcomingExam
          ? stats.closestUpcomingExam.studentsRegistered
          : 0,
        subtitle: "In upcoming exams",
        icon: "fa-users",
      },
      {
        title: "Average Scores",
        value: `${stats.averageScoresPercentage || 0}%`,
        subtitle:
          stats.percentChangeBetweenLastTwoExams != null
            ? `${stats.percentChangeBetweenLastTwoExams > 0 ? "+" : ""}${stats.percentChangeBetweenLastTwoExams}% from last exam`
            : "No previous data",
        icon: "fa-chart-line",
      },
      {
        title: "Modules",
        value: stats.totalModules,
        subtitle: `Total Questions: ${stats.totalQuestions}`,
        icon: "fa-layer-group",
      },
    ];
  }, [dashboardData]);

  const upcomingEvents = useMemo(() => {
    if (!dashboardData) return [];

    // Map closest upcoming exam (or all exams if you extend API)
    const events = [];
    if (dashboardData.stats.closestUpcomingExam) {
      events.push({
        title: dashboardData.stats.closestUpcomingExam.title,
        start: new Date(dashboardData.stats.closestUpcomingExam.date),
        end: new Date(dashboardData.stats.closestUpcomingExam.date),
      });
    }

    // If API provides multiple upcoming exams, map them here
    // dashboardData.stats.upcomingExamsList?.forEach(exam => { ... });

    return events;
  }, [dashboardData]);

  // Fetch teacher dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true); // make sure we set loading at start

        const response = await fetch(
          "http://localhost:5000/api/teachers/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem("token"),
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Failed to fetch dashboard data"
          );
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setDashboardData(null); // reset if error
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Memoized data to prevent unnecessary recalculations
  const modulesData = useMemo(
    () => ({
      labels: ["DB Systems", "OOP", "Algorithms", "Networking"],
      datasets: [
        {
          label: "Average Scores",
          data: [72, 65, 68, 60],
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    }),
    []
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true, max: 100 } },
    }),
    []
  );

  const activities = useMemo(
    () => [
      {
        id: 1,
        action: "created",
        type: "exam",
        title: "Midterm Exam - SFSD",
        time: "just now",
      },
      {
        id: 2,
        action: "edited",
        type: "module",
        title: "Advanced Database Systems",
        time: "just now",
      },
      {
        id: 3,
        action: "deleted",
        type: "exam",
        title: "Quiz 1 - OOP",
        time: "just now",
      },
    ],
    []
  );

  return (
    <div className="teacher-dashboard container-fluid flex-grow-1">
      {/* Header with clear separation */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold m-0" data-cy="welcome-message">
          Welcome back {username} 👋
        </h1>
        {/* Add any header actions here if needed */}
      </div>

      {/* Metrics Grid - Left-aligned cards */}
      <div className="dashboard-main-body">
        <div className="main-left-side">
          <div className="metrics-cards">
            {metricCards.map((card, index) => (
              <div key={index}>
                <DashboardCard {...card} className="w-100" />
              </div>
            ))}
          </div>
          <div className="main-columns">
            <DashboardInfoPane
              title="Average Exam Scores By Module"
              subtitle="January - June 2024"
            >
              <div style={{ height: "250px" }}>
                <Bar data={modulesData} options={chartOptions} />
              </div>
            </DashboardInfoPane>
            <div className="main-right">
              <DashboardInfoPane
                title="Recent Activities"
                subtitle="January - June 2024"
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
                          You {activity.action} the {activity.type}: "
                          {activity.title}"
                        </span>
                        <span className="text-muted small">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardInfoPane>
              <DashboardInfoPane
                title="Quick Actions"
                containerClassName="flex-grow-1"
                subtitle=""
              >
                <div
                  className="quick-action-buttons"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  <div className="action-buttons">
                    <button type="button" class="btn btn-outline-secondary">
                      Generate Exam With AI<i class="fa fa-star ms-2"></i>
                    </button>
                    <button type="button" class="btn btn-outline-secondary">
                      Generate Reports
                      <i class="fa-solid fa-chart-area ms-2"></i>
                    </button>
                  </div>
                  <div className="action-buttons">
                    <button type="button" class="btn btn-outline-secondary">
                      View Modules<i class="fa-solid fa-book ms-2"></i>
                    </button>
                    <button type="button" class="btn btn-outline-secondary">
                      Create Exams<i class="fa-solid fa-user-graduate ms-2"></i>
                    </button>
                  </div>
                </div>
              </DashboardInfoPane>
            </div>
          </div>
        </div>
        <div className="main-right-side">
          <DashboardInfoPane title="Upcoming Exams" subtitle="Interactive Calendar">
            <DashboardCalendar events={upcomingEvents} />
          </DashboardInfoPane>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
