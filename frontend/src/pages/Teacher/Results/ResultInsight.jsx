import { useEffect, useState } from "react";
import ExamResultCard from "./ExamResultCard";
import StudentTable from "./StudentTable";
import { Button, Spinner, Alert } from "react-bootstrap";

const ResultInsight = ({ examId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [attemptedStudents, setAttemptedStudents] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/exams/${examId}/report-card`, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch report: ${res.status}`);
        }

        const data = await res.json();
        console.log("Data", data);
        setRawData(data);
        setAttemptedStudents(data.attemptedStudents || []);
        setAbsentStudents(data.absentStudents || []);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching report card:", err);
        setError("Failed to load report card");
        setLoading(false);
      }
    };

    if (examId) {
      fetchReport();
    }
  }, [examId]);

  
  // calculate average score
  const avgScore =
    attemptedStudents && attemptedStudents.length > 0
      ? (
          attemptedStudents.reduce((sum, s) => sum + (s.score || 0), 0) /
          attemptedStudents.length
        ).toFixed(2)
      : 0;


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="report-card">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center" style={{gap:"12px"}}>
          <Button variant="outline-secondary" onClick={onBack} className='d-flex justify-contents-center align-items-center'>
            <i className="fa fa-caret-left"></i> Back
          </Button>
          <h3>Report Card</h3>
        </div>
        <Button variant="outline-secondary" onClick={() => window.print()}>
          <i class="fa fa-file-alt me-2"></i>Generate Report
        </Button>
      </div>

      {/* ✅ Pass exam metadata */}
      {rawData && <ExamResultCard exam={rawData.exam} counts={rawData.counts} attemptedStudents={attemptedStudents} avgScore={avgScore}/>}

      {/* Alert to publish results */}
      <div className="alert alert-warning d-flex justify-content-between align-items-center" role="alert">
        <div className="d-flex align-items-center">
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          <span>Exam results aren’t published yet.</span>
        </div>
        <div className="d-flex">
          <button type="button" className="btn btn-outline-primary btn-sm me-2">Publish without Feedback</button>
          <button type="button" className="btn btn-primary btn-sm">Publish with Feedback</button>
        </div>
      </div>

      {/* ✅ Pass student lists */}
      <StudentTable students={[...attemptedStudents, ...absentStudents]} examId={examId} avgScore={avgScore} />
    </div>
  );
};

export default ResultInsight;
