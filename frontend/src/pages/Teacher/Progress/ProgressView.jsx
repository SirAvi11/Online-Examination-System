import { useState } from "react";
import { Card, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import StudentTable from "../Results/StudentTable";

const ProgressView = () => {
  const [filters, setFilters] = useState({
    examId: "",
    studentId: "",
    minScore: "",
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilter = async () => {

        // ✅ Ensure at least one filter has a value
    if (!filters.examId && !filters.studentId && !filters.minScore) {
        setError("Please select at least one filter before applying.");
        setShowResults(false);
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams(filters).toString();

      const res = await fetch(
        `http://localhost:5000/api/progress?${query}`,
        {
          headers: { "x-auth-token": token },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch student progress");

      const data = await res.json();
      setStudents(data.students || []);
      setShowResults(true);
    } catch (err) {
      console.error("❌ Progress fetch error:", err);
      setError("Could not load progress data");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      examId: "",
      studentId: "",
      minScore: "",
    });
    setStudents([]);
    setShowResults(false);
    setError(null);
  };

  return (
    <div className="p-4" style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* ✅ Header */}
      <div className="header-container mb-4">
        <h3>Student Progress</h3>
      </div>

      {/* ✅ Filter Card */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Filter Parameters</h5>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Select Exam</Form.Label>
                <Form.Select
                  name="examId"
                  value={filters.examId}
                  onChange={handleFilterChange}
                >
                  <option value="">-- All Exams --</option>
                  <option value="exam1">Math Test 1</option>
                  <option value="exam2">Science Quiz</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Select Student</Form.Label>
                <Form.Control
                  type="text"
                  name="studentId"
                  placeholder="Search by student name"
                  value={filters.studentId}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Min Score (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="minScore"
                  placeholder="e.g. 50"
                  value={filters.minScore}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-3" style={{ gap: "10px" }}>
            <Button variant="outline-secondary" onClick={clearFilters}>
              <i className="fa fa-times me-2"></i>Clear Filters
            </Button>
            <Button variant="primary" onClick={applyFilter}>
              <i className="fa fa-filter me-2"></i>Apply Filter
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* ✅ Results Section */}
      {loading && (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!showResults && !loading && !error && (
        <Card className="shadow-sm h-100">
          <Card.Body className="text-center text-muted d-flex flex-column justify-content-center align-items-center mb-2">
            <i className="fa fa-search fa-2x mb-3"></i>
            <h5>No filters applied</h5>
            <p>
              Use the filter options above to select an exam, student, or minimum score.  
              Then click <strong>Apply Filter</strong> to view student progress.
            </p>
          </Card.Body>
        </Card>
      )}

      {showResults && !loading && !error && (
        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Filtered Student Progress</h5>
            <StudentTable students={students} />
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ProgressView;
