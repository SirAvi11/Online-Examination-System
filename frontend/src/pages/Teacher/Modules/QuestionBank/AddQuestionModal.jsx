// AddQuestionModal.js
import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col
} from "react-bootstrap";

const AddQuestionModal = ({ show, onHide, onSave, moduleId, isSaving, successInfo }) => {
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    imageFile: null,
    options: ["", "", "", ""],
    answer: "",
    marks: 1,
    paperId: null,
  });
  const [preview, setPreview] = useState(null);

  // Reset form when modal is opened/closed or when question is successfully added
  useEffect(() => {
    if (!show || successInfo?.show) {
      setNewQuestion({
        questionText: "",
        imageFile: null,
        options: ["", "", "", ""],
        answer: "",
        marks: 1,
        paperId: null,
      });
      setPreview(null);
    }
  }, [show, successInfo?.show]);

  const handleAddQuestion = async () => {
    await onSave(newQuestion);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Add New Question</Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        <Form>
          {/* Question Details */}
          <h6 className="fw-bold mb-3">Question Details</h6>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Question Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter the question here..."
              value={newQuestion.questionText}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, questionText: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              Attach Image (optional)
            </Form.Label>
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
                    setPreview(URL.createObjectURL(file));
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
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                  }}
                />
              )}
            </div>
          </Form.Group>

          {/* Options */}
          <h6 className="fw-bold mt-4 mb-3">Options</h6>
          {newQuestion.options.map((opt, idx) => (
            <Form.Group className="mb-3" key={idx}>
              <Form.Label className="fw-semibold">Option {idx + 1}</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Enter option ${idx + 1}`}
                value={opt}
                onChange={(e) => {
                  const updated = [...newQuestion.options];
                  updated[idx] = e.target.value;
                  setNewQuestion({ ...newQuestion, options: updated });
                }}
              />
            </Form.Group>
          ))}

          {/* Add Option button */}
          <div className="mb-4">
            <Button
              variant="outline-success"
              size="sm"
              onClick={() =>
                setNewQuestion({
                  ...newQuestion,
                  options: [...newQuestion.options, ""],
                })
              }
            >
              <i className="bi bi-plus-circle"></i> Add Option
            </Button>
          </div>

          {/* Correct Answer & Marks */}
          <Row className="mt-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Correct Answer</Form.Label>
                <Form.Select
                  value={newQuestion.answer}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, answer: e.target.value })
                  }
                >
                  <option value="">Select correct option</option>
                  {newQuestion.options.map((opt, idx) =>
                    opt ? (
                      <option key={idx} value={opt}>
                        Option {idx + 1}: {opt}
                      </option>
                    ) : null
                  )}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Marks</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={newQuestion.marks}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      marks: Number(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddQuestion}
          disabled={isSaving}
        >
          {isSaving ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            "Save Question"
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddQuestionModal;