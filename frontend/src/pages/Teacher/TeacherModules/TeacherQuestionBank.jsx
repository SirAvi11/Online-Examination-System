import React, { useState } from "react";
import { Table, Button, Modal, Form, Row, Col, Collapse, Card, Badge } from "react-bootstrap";

export default function TeacherQuestionBank({ selectedModule, onBack }) {
  const [showModal, setShowModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const [newQuestion, setNewQuestion] = useState({
    question: "",
    image: "",
    options: ["", "", "", ""],
    answer: "",
  });

  const [questions, setQuestions] = useState([
    {
      question: "What is the capital of France?",
      image: "",
      options: ["Paris", "London", "Berlin", "Madrid"],
      answer: "Paris",
    },
    {
      question: "Identify this landmark.",
      image: "https://via.placeholder.com/200x150",
      options: ["Eiffel Tower", "Big Ben", "Colosseum", "Taj Mahal"],
      answer: "Eiffel Tower",
    },
    {
      question: "Which planet is known as the Red Planet?",
      image: "https://via.placeholder.com/200x150",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      answer: "Mars",
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([...questions, newQuestion]);
    setShowModal(false);
    setNewQuestion({ question: "", image: "", options: ["", "", "", ""], answer: "" });
  };

  return (
    <div className="p-3">
      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" onClick={onBack}>
          ← Back to Modules
        </Button>
        <h4 className="m-0">Question Bank - {selectedModule.name}</h4>
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="fa fa-plus me-2"></i>Add New Question
          </Button>
          <Button variant="outline-primary">
            <i className="fa fa-upload me-2"></i>Upload from CSV
          </Button>
        </div>
      </div>

      {/* Table + Expandable Details */}
      <Table bordered hover responsive style={{ borderRadius: "0.75rem", overflow: "hidden" }}>
        <thead className="table-light">
          <tr>
            <th style={{ width: "50px" }}>#</th>
            <th>Question</th>
            <th>Answer</th>
            <th style={{ width: "120px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => (
            <React.Fragment key={i}>
              <tr>
                <td>{i + 1}</td>
                <td>{q.question}</td>
                <td>{q.answer}</td>
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
                          <p className="mb-3">{q.question}</p>
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
                                className={q.answer === opt ? "fw-bold text-success" : ""}
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

            <Form.Group>
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
