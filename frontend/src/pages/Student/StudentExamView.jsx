import { useState, useEffect } from "react";
import ExamStatusCard from "../../components/Exam/ExamStatusCard";
import ExamRegistrationModal from "./ExamRegistrationModal";
import ExamDetailsModal from "./ExamDetailsModal";

const StudentExamView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;
  const [showModal, setShowModal] = useState(false);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);

// Fetch exams from API
useEffect(() => {
  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("token"); // assuming you store auth token
      const res = await fetch("/api/exam-registration/my-exams", {
        headers: { "x-auth-token": token }, // 👈 lowercase header key
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json(); // 👈 parse JSON
      setExams(data);
    } catch (err) {
      console.error("Failed to fetch exams:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchExams();
}, []);

  const handleCardClick = (exam) => {
    setSelectedExam(exam);
  };

  const handleRegister = (examCode) => {
    console.log("Registered with exam code:", examCode);
  };

  // Transform API exam object -> card fields
  const formattedExams = exams?.map((exam) => {
    const startDate = new Date(exam.startTime);
    const endDate = new Date(exam.endTime);

    // If start and end are on the same calendar day
    const sameDay =
      startDate.toDateString() === endDate.toDateString();

    const dateOptions = { day: "2-digit", month: "short", year: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };

    const dateRange = sameDay
      ? startDate.toLocaleDateString("en-GB", dateOptions)
      : `${startDate.toLocaleDateString("en-GB", dateOptions)} - ${endDate.toLocaleDateString("en-GB", dateOptions)}`;

    const timeRange = `${startDate.toLocaleTimeString([], timeOptions)} - ${endDate.toLocaleTimeString([], timeOptions)}`;


    return {
      id: exam._id,
      title: exam.title,
      subtitle: `Teacher: ${exam.createdBy?.name || "Unknown"}`,
      dateRange,
      timeRange,
      totalMarks: exam.totalMarks,
      totalQuestions: exam.totalQuestions,
      status:
        exam.status === "In Progress"
          ? "Active"
          : exam.status === "Completed"
          ? "Completed"
          : "Upcoming",
      statusVariant:
        exam.status === "In Progress"
          ? "info"
          : exam.status === "Completed"
          ? "success"
          : "warning",
    };
  });

  // Filter by search
  const filteredExams = formattedExams?.filter((exam) =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredExams?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExams = filteredExams?.slice(
    startIndex,
    startIndex + itemsPerPage
  );


  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container py-4 px-4">
      <h1 className="h3 fw-bold m-0 mb-2">Examinations</h1>

      {/* Search */}
      <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search examinations..."
          style={{ maxWidth: "250px" }}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Exams Layout */}
      <section
        aria-label="Examination cards"
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "0.7rem",
        }}
      >
        <div
          onClick={() => setShowModal(true)}
          style={{
            flex: "1 1 calc(33.333% - 1rem)",
            maxWidth: "15rem",
            minHeight: "8rem",
            border: "2px dashed #aaa",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#555",
            cursor: "pointer",
            background: "#f9f9f9",
          }}
        >
          <div className="text-center">
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>+</div>
            <div>Register for an exam</div>
          </div>
        </div>

        {/* Registration Modal */}
        <ExamRegistrationModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          onRegister={handleRegister}
        />

        {loading ? (
          <div className="text-center py-5" style={{ width: "100%" }}>
            <p className="text-muted">Loading exams...</p>
          </div>
        ) : currentExams?.length > 0 ? (
          currentExams?.map((exam) => (
            <div
              key={exam.id}
              style={{
                flex: "1 1 calc(33.333% - 1rem)",
                maxWidth: "15rem",
              }}
            >
              <ExamStatusCard
                title={exam.title}
                status={exam.status}
                statusVariant={exam.statusVariant}
                dateRange={exam.dateRange}
                timeRange={exam.timeRange}
                totalMarks={exam.totalMarks}
                totalQuestions={exam.totalQuestions}
                onCardClick={() => handleCardClick(exam)}
                maxWidth="20rem"
              />

            </div>
          ))
        ) : (
          <div className="text-center py-5" style={{ width: "100%" }}>
            <p className="text-muted">No exams found matching your search</p>
          </div>
        )}
      </section>

      <ExamDetailsModal
        show={!!selectedExam}
        handleClose={() => setSelectedExam(null)}
        exam={selectedExam}
        onUnregister={(id) => console.log("Unregister:", id)}
        onStartExam={(id) => console.log("Start Exam:", id)}
        onShowInsights={(id) => console.log("Show Insights:", id)}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="d-flex justify-content-center mt-4"
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            backgroundColor: "#fff",
            padding: "0.75rem 0rem 1rem 0.75rem",
            zIndex: 1000,
          }}
        >
          <nav>
            <ul className="pagination mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => goToPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default StudentExamView;
