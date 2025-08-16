import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col, Collapse, Card, Badge } from "react-bootstrap";
import './TeacherQuestionBank.css';

export default function TeacherQuestionBank({ selectedModule, onBack }) {
  const [showModal, setShowModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    image: "",
    options: ["", "", "", ""],
    answer: "",
    marks: 1,
    paperId: "" // optional
  });

  // Fetch questions by moduleId on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/questions?moduleId=${selectedModule._id}`);
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };
    fetchQuestions();
  }, [selectedModule._id]);

  // Add new question
  const handleAddQuestion = async () => {
    if (!newQuestion.question.trim() || !newQuestion.answer) return;

    const correctOptionIndex = newQuestion.options.findIndex(opt => opt === newQuestion.answer);
    if (correctOptionIndex === -1) return alert("Correct answer must match one of the options");

    try {
      const res = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newQuestion,
          moduleId: selectedModule._id,
          correctOptionIndex
        })
      });
      const savedQuestion = await res.json();
      setQuestions(prev => [...prev, savedQuestion]);
      setShowModal(false);
      setNewQuestion({ question: "", image: "", options: ["", "", "", ""], answer: "", marks: 1, paperId: "" });
    } catch (err) {
      console.error("Failed to save question:", err);
    }
  };

  const toggleSelectQuestion = (questionId) => {
    setSelectedQuestionIds(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedQuestionIds.length === questions.length) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(questions.map(m => m._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedQuestionIds.length === 0) return;
    try {
      const res = await fetch("http://localhost:5000/api/questions/bulk-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedQuestionIds }),
      });

      if (res.ok) {
        setQuestions((prev) =>
          prev.filter((q) => !selectedQuestionIds.includes(q._id))
        );
        setSelectedQuestionIds([]);
      } else {
        const error = await res.json();
        alert(error.message || "Error deleting questions");
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-3">
      {/* Toolbar */}
      <div className="header-container" style={{ position: "relative" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="outline-secondary" onClick={onBack}>
            ← Back to Modules
          </Button>

          <div className="text-center">
            <h5 className="mb-1 fw-bold" style={{ letterSpacing: "1px", fontSize: "1.2rem" }}>
              Question Bank ({questions.length})
            </h5>
            <h6 className="mb-0 text-secondary" style={{ letterSpacing: "0.5px", fontSize: "1rem" }}>
              {selectedModule.name}
            </h6>
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => setShowModal(true)}
              disabled={selectedQuestionIds.length > 0} // ✅ disable when bulk delete active
            >
              <i className="fa fa-plus me-2"></i>Add New Question
            </Button>
            <Button variant="outline-secondary" disabled={selectedQuestionIds.length > 0}>
              <i className="fa fa-upload me-2"></i>Upload from CSV
            </Button>
          </div>
        </div>

        {/* ✅ Overlay to replace header */}
        {selectedQuestionIds.length > 0 && (
          <div className="overlay show">
            <Button variant="danger" onClick={handleDeleteSelected}>
              <i className="fa fa-trash" /> Delete
            </Button>
            <button
              className="btn-close-selection"
              onClick={() => setSelectedQuestionIds([])}
            />
          </div>
        )}
      </div>


      {/* Table + Expandable Details */}
      <Table bordered hover responsive style={{ borderRadius: "0.75rem", overflow: "hidden" }}>
        <thead className="table-light">
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                checked={selectedQuestionIds.length === questions.length && questions.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th style={{ width: "50px" }}>#</th>
            <th>Question</th>
            <th>Answer</th>
            <th style={{ width: "120px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => (
            <React.Fragment key={q._id}>
              <tr>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedQuestionIds.includes(q._id)}
                    onChange={() => toggleSelectQuestion(q._id)}
                  />
                </td>
                <td>{i + 1}</td>
                <td>{q.questionText}</td>
                <td>{q.options[q.correctOptionIndex]}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-info"
                    onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                  >
                    {expandedRow === i ? "Hide" : "View"}
                  </Button>
                </td>
              </tr>
              <tr>
                <td colSpan="4" className="p-0">
                  <Collapse in={expandedRow === i}>
                    <div className="p-3 bg-light">
                      <Card className="border-0 shadow-sm">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="fw-bold mb-0">Q{i + 1}</h6>
                            {q.image && <Badge bg="secondary">Has Image</Badge>}
                          </div>
                          <p className="mb-3">{q.questionText}</p>
                          {q.image && (
                            <img
                              src={q.image}
                              alt="question"
                              className="img-fluid rounded mb-3"
                              style={{ maxHeight: "200px", objectFit: "cover" }}
                            />
                          )}
                          <h6>Options:</h6>
                          <ul>
                            {q.options.map((opt, idx) => (
                              <li
                                key={idx}
                                className={q.correctOptionIndex === idx ? "fw-bold text-success" : ""}
                              >
                                {opt}
                              </li>
                            ))}
                          </ul>
                        </Card.Body>
                      </Card>
                    </div>
                  </Collapse>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      {/* Add Question Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Add New Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Question Text</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL (optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={newQuestion.image}
                onChange={(e) => setNewQuestion({ ...newQuestion, image: e.target.value })}
              />
            </Form.Group>

            <Row>
              {newQuestion.options.map((opt, idx) => (
                <Col md={6} key={idx} className="mb-3">
                  <Form.Label>Option {idx + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newQuestion.options];
                      updated[idx] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: updated });
                    }}
                  />
                </Col>
              ))}
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Correct Answer</Form.Label>
              <Form.Select
                value={newQuestion.answer}
                onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
              >
                <option value="">Select answer</option>
                {newQuestion.options.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Marks</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={newQuestion.marks}
                onChange={(e) => setNewQuestion({ ...newQuestion, marks: Number(e.target.value) })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddQuestion}>
            Save Question
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
