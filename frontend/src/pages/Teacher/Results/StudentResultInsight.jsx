import { Modal, Button, Badge, Card, Row, Col } from "react-bootstrap";
import { Download, CheckCircle, XCircle, Clock, Person } from "react-bootstrap-icons";

const StudentResultInsight = ({ exam, show, onClose }) => {
  if (!exam) return null;

  const handleDownload = () => {
    // 📌 For now use print — later integrate server PDF export
    window.print();
  };

  return (
    <Modal show={show} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>Exam Result - {exam.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-4">
          {/* Exam Info */}
          <Col md={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <h5 className="mb-3">📘 Exam Information</h5>
                <p><Person className="me-2" /> <strong>Teacher:</strong> {exam.createdBy}</p>
                <p><Clock className="me-2" /> <strong>Completed On:</strong> {exam.completedOn}</p>
                <p><strong>Total Marks:</strong> {exam.totalMarks}</p>
                <p><strong>Duration:</strong> {exam.duration || "—"} mins</p>
              </Card.Body>
            </Card>
          </Col>

          {/* Performance */}
          <Col md={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <h5 className="mb-3">📊 Your Performance</h5>
                <p>
                  <strong>Score:</strong>{" "}
                  <Badge bg="primary">{exam.score}/{exam.totalMarks}</Badge>
                </p>
                <p>
                  <strong>Percentage:</strong>{" "}
                  <Badge bg={exam.pass ? "success" : "danger"}>{exam.percentage}%</Badge>
                </p>
                <p>
                  <strong>Grade:</strong>{" "}
                  <Badge bg="secondary">{exam.grade}</Badge>
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {exam.pass ? (
                    <span className="text-success"><CheckCircle className="me-1" /> Passed</span>
                  ) : (
                    <span className="text-danger"><XCircle className="me-1" /> Failed</span>
                  )}
                </p>
                <p><strong>Submitted At:</strong> {exam.submittedAt || "—"}</p>
                <p><strong>Time Spent:</strong> {exam.timeSpent ? `${exam.timeSpent} mins` : "—"}</p>
              </Card.Body>
            </Card>
          </Col>

          {/* Teacher Feedback */}
          {exam.feedback && (
            <Col md={12}>
              <Card className="shadow-sm border-info">
                <Card.Body>
                  <h5 className="text-info">💬 Teacher’s Feedback</h5>
                  <p className="mb-0">{exam.feedback}</p>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="outline-primary" onClick={handleDownload}>
          <Download className="me-2" /> Download Result
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudentResultInsight;
