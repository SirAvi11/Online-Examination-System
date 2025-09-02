import ExamResultCard from "./ExamResultCard";
import StudentTable from "./StudentTable";
import {Button} from "react-bootstrap";
const ResultsView = () => {
  const sampleStudents = [
  {
    name: "Anaru Hakopa",
    img: "https://storage.googleapis.com/a1aa/image/3a4aaca0-0578-4531-7e7a-755920e3d856.jpg",
    status: "Passed",
    score: "45/50 (85%)",
    scoreColor: "green",
    grade: "Excellent",
    gradeColor: "green",
    timeSpent: "22 MIN",
    submittedAt: "09 Nov 2019, 9:00 AM",
    attended: true,
  },
  {
    name: "Tua Manuera",
    img: "https://storage.googleapis.com/a1aa/image/2be09f7c-3ca5-47a7-23f2-8e4bf958f073.jpg",
    status: "Failed",
    score: "15/50 (28%)",
    scoreColor: "red",
    grade: "Poor",
    gradeColor: "red",
    timeSpent: "22 MIN",
    submittedAt: "09 Nov 2019, 9:00 AM",
    attended: true,
  },
  ];

  const examData = {
    examTitle: "Unit 6 Final Exam",
    courseName: "English Lv 6",
    questionInfo: "20 Questions: MCQ Based",
    startDate: "21 Oct 2020 9:00 AM",
    endDate: "21 Oct 2020 12:00 AM",
    duration: "30 Min",
    totalMarks: 50,
    passMarks: 40,
    stats: {
      totalStudents: 400,
      averageScore: 100,
      totalAbsent: 12,
      totalFinished: 365,
      totalPassed: 365,
      totalFailed: 35
    }
  };

  const onBack = () =>{

  }

  return (
    <div className="App p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-secondary me-3" onClick={onBack}>
            <i className="fa fa-arrow-left me-2" style={{ cursor: "pointer", fontSize: "1rem" }}></i>
          </button>
          <h3>Exam Result</h3>
        </div>
        <Button variant="outline-secondary" onClick={() => console.log("Printing Report")}>Generate Report</Button>
      </div>
      <ExamResultCard {...examData} />
      <div class="alert alert-warning d-flex justify-content-between align-items-center" role="alert">
        <div class="d-flex align-items-center">
          <i class="bi bi-exclamation-circle-fill me-2"></i>
          <span>Exam results aren’t published yet.</span>
        </div>
        <div class="d-flex">
          <button type="button" class="btn btn-outline-primary btn-sm me-2">Publish without Feedback</button>
          <button type="button" class="btn btn-primary btn-sm">Publish with Feedback</button>
        </div>
      </div>
      <StudentTable students={sampleStudents} />
    </div>
  );
};

export default ResultsView;