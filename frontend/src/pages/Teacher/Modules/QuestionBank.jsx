import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col, Collapse, Card, Badge } from "react-bootstrap";
import './QuestionBank.css';

export default function QuestionBank({ selectedModule, onBack }) {
  const [showModal, setShowModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [preview, setPreview] = useState(null);

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    imageFile: null,
    options: ["", "", "", ""],
    answer: "",
    marks: 1,
    paperId: null
  });
  const [duplicateInfo, setDuplicateInfo] = useState({ show: false, questionNumber: null });

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

  // Utility function to normalize question text
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")        // collapse multiple spaces
      .replace(/[?!.]+$/, "");     // remove ending punctuation like ?, !, .
  };

  // Add new question
  const handleAddQuestion = async () => {
    if (!newQuestion.questionText.trim() || !newQuestion.answer) {
      return setDuplicateInfo({ show: true, questionNumber: "Please provide a valid question and answer." });
    }

    // ✅ Normalize both texts before comparison
    const newNormalized = normalizeText(newQuestion.questionText);

    const duplicateIndex = questions.findIndex(
      (q) => normalizeText(q.questionText) === newNormalized
    );

    if (duplicateIndex !== -1) {
      return setDuplicateInfo({ show: true, questionNumber: duplicateIndex + 1 });
    }

    const correctOptionIndex = newQuestion.options.findIndex(opt => opt === newQuestion.answer);
    if (correctOptionIndex === -1) {
      return setDuplicateInfo({ show: true, questionNumber: "Correct answer must match one of the options." });
    }

    try {
      const formData = new FormData();
      formData.append("questionText", newQuestion.questionText);
      formData.append("moduleId", selectedModule._id);
      formData.append("marks", newQuestion.marks);
      formData.append("correctOptionIndex", correctOptionIndex);
      formData.append("options", JSON.stringify(newQuestion.options));
      if (newQuestion.paperId) formData.append("paperId", newQuestion.paperId);
      if (newQuestion.imageFile) formData.append("image", newQuestion.imageFile);

      const res = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        body: formData
      });

      const savedQuestion = await res.json();
      setQuestions(prev => [...prev, savedQuestion]);

      setShowModal(false);
      setNewQuestion({ questionText: "", imageFile: null, options: ["", "", "", ""], answer: "", marks: 1, paperId: "" });
      setPreview(null);
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
      <Table striped bordered hover responsiv>
        <thead className="table-light">
          <tr>
            <th style={{ width: "40px" }}>
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
                <td style={{ width: "40px" }}>
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
                          {q.imageUrl ? <img src={`http://localhost:5000${q.imageUrl}`} className="img-fluid rounded mb-3" alt="Question" style={{ maxHeight: "200px", width:"300px", objectFit: "cover" }} /> : "No image"}
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Add New Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Question Details */}
            <Form.Group className="mb-3">
              <Form.Label><strong>Question Text</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter the question here..."
                value={newQuestion.questionText}
                onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
  <Form.Label><strong>Attach Image (optional)</strong></Form.Label>
  <div className="d-flex align-items-center gap-3">
    {/* Hidden file input */}
    <input
      type="file"
      accept="image/*"
      id="imageUpload"
      style={{ display: "none" }}
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          setNewQuestion({ ...newQuestion, imageFile: file });
          setPreview(URL.createObjectURL(file)); // preview state
        }
      }}
    />

    {/* Upload button */}
    <Button
      variant="outline-primary"
      onClick={() => document.getElementById("imageUpload").click()}
    >
      <i className="bi bi-upload"></i> Upload
    </Button>

    {/* Show preview if available */}
    {preview && (
      <img
        src={preview}
        alt="Preview"
        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }}
      />
    )}
  </div>
</Form.Group>


            {/* Options */}
            <h6 className="mt-4">Options</h6>
            <Row>
              {newQuestion.options.map((opt, idx) => (
                <Col md={6} key={idx} className="mb-3">
                  <Form.Check
                    type="radio"
                    name="correctOption"
                    id={`option-${idx}`}
                    label={
                      <Form.Control
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newQuestion.options];
                          updated[idx] = e.target.value;
                          setNewQuestion({ ...newQuestion, options: updated });
                        }}
                      />
                    }
                    checked={newQuestion.answer === opt}
                    onChange={() => setNewQuestion({ ...newQuestion, answer: opt })}
                  />
                </Col>
              ))}
            </Row>

            {/* Marks */}
            <Form.Group className="mb-3 mt-3">
              <Form.Label><strong>Marks</strong></Form.Label>
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

      {/* Duplicate Warning Modal */}
      <Modal show={duplicateInfo.show} onHide={() => setDuplicateInfo({ show: false, questionNumber: null })} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Duplicate Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {typeof duplicateInfo.questionNumber === "number" ? (
            <p>
              ❌ This question already exists in your bank as <strong>Question {duplicateInfo.questionNumber}</strong>.  
              Duplicate questions are not allowed.
            </p>
          ) : (
            <p>⚠️ {duplicateInfo.questionNumber}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDuplicateInfo({ show: false, questionNumber: null })}>
            Okay, Got it
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
