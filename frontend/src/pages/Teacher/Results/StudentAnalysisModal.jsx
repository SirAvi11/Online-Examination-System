import { Modal, Button, Row, Col, Card, Table, Spinner } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#28a745", "#dc3545", "#ffc107"]; // correct, incorrect, unanswered

const StudentAnalysisModal = ({ show, handleClose, student, exam, loading, classAverage }) => {
  return (
    <Modal size="xl" show={show} onHide={handleClose} centered>
      {/* Header */}
      <Modal.Header closeButton>
        <Modal.Title>
          {loading
            ? "Loading Student Report..."
            : student
            ? `${student.name} – ${exam?.title}`
            : "Student Report"}
          {student && (
            <span
              className={`badge ms-2 ${
                student.pass
                  ? "bg-success"
                  : student.status === "absent"
                  ? "bg-secondary"
                  : "bg-danger"
              }`}
            >
              {student.status === "absent"
                ? "Absent"
                : student.pass
                ? "Passed"
                : "Failed"}
            </span>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Loading spinner */}
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-3">Fetching student details...</p>
          </div>
        )}

        {/* Render content only if we have student data */}
        {!loading && student && (
          <>
            {/* 2. Attempt Summary */}
            <Row className="mb-4">
              <Col md={2}>
                <Card className="p-3 text-center">
                  <h6>Score</h6>
                  <p className="h5">
                    {student.score}/{student.totalMarks}
                  </p>
                  <small>{student.percentage}%</small>
                </Card>
              </Col>
              <Col md={2}>
                <Card className="p-3 text-center">
                  <h6>Time Spent</h6>
                  <p className="h5">{student.timeSpentMinutes} min</p>
                  <small>of {exam?.duration} min</small>
                </Card>
              </Col>
              <Col md={2}>
                <Card className="p-3 text-center">
                  <h6>Grade</h6>
                  <p className="h5">{student.grade}</p>
                </Card>
              </Col>
              <Col md={2}>
                <Card className="p-3 text-center">
                  <h6>Tab Switches</h6>
                  <p className="h5">{student.tabSwitchCount || 0}</p>
                  <small>limit {exam?.tabSwitchLimit}</small>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="p-3 text-center">
                  <h6>Device Info</h6>
                  <p className="small mb-0">
                    {student.deviceInfo?.browser} / {student.deviceInfo?.os}
                  </p>
                  <small>
                    {student.deviceInfo?.deviceType} ({student.ipAddress})
                  </small>
                </Card>
              </Col>
            </Row>

            {/* Attempt window */}
            <Row className="mb-4">
              <Col>
                <Card className="p-3">
                  <h6>Attempt Window</h6>
                  <p className="mb-0">
                    {student.startedAt
                      ? new Date(student.startedAt).toLocaleString()
                      : "-"}{" "}
                    →{" "}
                    {student.submittedAt
                      ? new Date(student.submittedAt).toLocaleString()
                      : "-"}
                  </p>
                </Card>
              </Col>
            </Row>

            {/* 3. Charts */}
            <Row className="mb-4">
              <Col md={6}>
                <Card className="p-3">
                  <h6>Answer Distribution</h6>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Correct",
                            value: student.answers.filter((a) => a.isCorrect)
                              .length,
                          },
                          {
                            name: "Incorrect",
                            value: student.answers.filter(
                              (a) => a.isCorrect === false
                            ).length,
                          },
                          {
                            name: "Unanswered",
                            value: student.answers.filter(
                              (a) => !a.selectedOption
                            ).length,
                          },
                        ]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {COLORS.map((color, i) => (
                          <Cell key={i} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="p-3">
                  <h6>Student vs Class Average</h6>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={[
                        {
                          label: "Student",
                          score: student.score,
                        },
                        {
                          label: "Class Avg",
                          score: classAverage || 0,
                        },
                      ]}
                    >
                      <XAxis dataKey="label" />
                      <YAxis domain={[0, student.totalMarks]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#007bff" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            {/* 4. Question Breakdown */}
            <h5 className="mb-3">Question Breakdown</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Selected</th>
                  <th>Correct</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {student.answers.map((ans, idx) => (
                  <tr
                    key={idx}
                    className={
                      !ans.selectedOption
                        ? "table-warning"
                        : ans.isCorrect
                        ? "table-success"
                        : "table-danger"
                    }
                  >
                    <td>{idx + 1}</td>
                    <td>{ans.questionText || ans.questionId}</td>
                    <td>{ans.selectedOption || "—"}</td>
                    <td>{ans.isCorrect ? "Yes" : "No"}</td>
                    <td>{ans.marksObtained}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* 5. Behavioral Insights */}
            <h5 className="mt-4">Behavioral Insights</h5>
            <ul>
              <li>
                Tab switches: {student.tabSwitchCount || 0} (limit{" "}
                {exam?.tabSwitchLimit})
              </li>
              <li>
                Status:{" "}
                {student.status === "cheated"
                  ? "⚠️ Possible cheating detected"
                  : student.status}
              </li>
              <li>
                Time usage: {student.timeSpentMinutes} min out of{" "}
                {exam?.duration} min
              </li>
            </ul>
          </>
        )}
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {!loading && student && (
          <>
            <Button variant="outline-primary">Give Feedback</Button>
            <Button variant="primary">Download Report</Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default StudentAnalysisModal;
