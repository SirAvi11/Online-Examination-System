import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Clipboard, User, Calendar, Clock, Hash, BookOpen, Edit } from "lucide-react";
import './ExamDetailsModal.css'

const ExamDetailsModal = ({ show, exam, onClose, onSave }) => {
  const [editableExam, setEditableExam] = useState(exam || {});

  useEffect(() => {
    if (exam) setEditableExam(exam);
  }, [exam]);

  if (!exam) return null;

  const handleChange = (e) => {
    setEditableExam({ ...editableExam, [e.target.name]: e.target.value });
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <BookOpen size={20} /> Exam Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Title (editable) */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              <Edit size={16} className="me-1" /> Title
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={editableExam.title || ""}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Description (editable) */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              value={editableExam.description || ""}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Read-only fields */}
          <div className="row g-3">
            <div className="col-md-6">
              <div className="border rounded p-2 d-flex align-items-center gap-2">
                <Clipboard size={18} />
                <span><strong>Exam Code:</strong> {exam.examCode}</span>
              </div>
            </div>

            <div className="col-md-6">
              <div className="border rounded p-2 d-flex align-items-center gap-2">
                <User size={18} />
                <span><strong>Created By:</strong> {exam.createdBy?.name || "N/A"}</span>
              </div>
            </div>

            <div className="col-md-6">
              <div className="border rounded p-2 d-flex align-items-center gap-2">
                <Hash size={18} />
                <span><strong>Total Questions:</strong> {exam.totalQuestions}</span>
              </div>
            </div>

            <div className="col-md-6">
              <div className="border rounded p-2 d-flex align-items-center gap-2">
                <Hash size={18} />
                <span><strong>Total Marks:</strong> {exam.totalMarks}</span>
              </div>
            </div>

            <div className="col-md-6">
              <div className="border rounded p-2 d-flex align-items-center gap-2">
                <Calendar size={18} />
                <span><strong>Date:</strong> {exam.dateRange}</span>
              </div>
            </div>

            <div className="col-md-6">
              <div className="border rounded p-2 d-flex align-items-center gap-2">
                <Clock size={18} />
                <span><strong>Time:</strong> {exam.timeRange}</span>
              </div>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => onSave(editableExam)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExamDetailsModal;
