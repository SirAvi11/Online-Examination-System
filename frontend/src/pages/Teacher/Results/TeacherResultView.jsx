import { useEffect, useState } from "react";
import ResultInsight from "./ResultInsight";
import ExamStatusCard from "../../../components/Exam/ExamStatusCard";

const TeacherResultView = ({searchTerm}) => {
  const [rawExamData, setRawExamData] = useState([]);
  const [uiExamData, setUiExamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/exams/completed", {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch completed exams");
      }

      const data = await response.json();
      setRawExamData(data);

      const mappedExams = data.map((exam) => {
        const { status, statusVariant } = getExamStatus(
          exam.startTime,
          exam.endTime
        );

        const start = new Date(exam.startTime);
        const end = new Date(exam.endTime);

        const startDateStr = start.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const endDateStr = end.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const dateRange =
          startDateStr === endDateStr
            ? startDateStr
            : `${startDateStr} - ${endDateStr}`;

        const startTimeStr = start.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const endTimeStr = end.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const timeRange = `${startTimeStr} - ${endTimeStr}`;

        return {
          id: exam._id,
          title: exam.title,
          totalMarks: exam.totalMarks,
          dateRange,
          timeRange,
          status,
          statusVariant,
        };
      });

      setUiExamData(mappedExams);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const getExamStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return { status: "Upcoming", statusVariant: "warning" };
    if (now >= start && now <= end)
      return { status: "In Progress", statusVariant: "primary" };
    return { status: "Completed", statusVariant: "success" };
  };

  const handleCardClick = (examId) => {
    const exam = rawExamData.find((e) => e._id === examId);
    setSelectedExam(exam);
  };

  const filteredExams = uiExamData.filter((exam) => {
    const lower = searchTerm.toLowerCase();
    return (
      exam.title.toLowerCase().includes(lower) ||
      String(exam.totalMarks).includes(lower) ||
      exam.status.toLowerCase().includes(lower)
    );
  });

  if (loading) return <p className="text-center py-5">Loading completed exams...</p>;
  if (error) return <p className="text-center text-danger py-5">{error}</p>;

  return (
    <>
      {selectedExam ? (
        <ResultInsight examId={selectedExam._id} onBack={() => setSelectedExam(null)} />
      ) : (
        <>
          <section className="d-flex flex-wrap gap-3">
            {filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  style={{
                    flex: "1 1 calc(25% - 1rem)",
                    minWidth: "16rem",
                    maxWidth: "20rem",
                  }}
                >
                  <ExamStatusCard
                    title={exam.title}
                    dateRange={exam.dateRange}
                    timeRange={exam.timeRange}
                    totalMarks={exam.totalMarks}
                    status={exam.status}
                    statusVariant={exam.statusVariant}
                    onCardClick={() => handleCardClick(exam.id)}
                    maxWidth="100%"
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-5" style={{ width: "100%" }}>
                <h5 className="text-muted mb-2">No completed exams available</h5>
                <p className="text-muted small">
                  Once you’ve conducted exams, they will appear here for review.
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
};

export default TeacherResultView;
