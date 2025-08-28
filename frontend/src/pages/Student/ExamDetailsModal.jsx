import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ExamDetailsModal = ({ show, handleClose, exam, onUnregister, onStartExam, onShowInsights }) => {
  const [confirmUnregister, setConfirmUnregister] = useState(false);

  if (!exam) return null;
  const { title, description, status, id } = exam;

  // Footer buttons
  const renderFooter = () => {
    if (status === "Upcoming") {
      if (confirmUnregister) {
        return (
          <div className="d-flex justify-content-between w-100">
            <span className="text-danger fw-semibold">Are you sure you want to unregister?</span>
            <div>
              <Button variant="outline-secondary" onClick={() => setConfirmUnregister(false)}>
                Cancel
              </Button>
              <Button variant="danger" className="ms-2" onClick={() => { onUnregister?.(id); setConfirmUnregister(false); }}>
                Yes, Unregister
              </Button>
            </div>
          </div>
        );
      }

      return (
        <div className="d-flex w-100 justify-content-between">
          <div>
            <Button variant="outline-danger" onClick={() => setConfirmUnregister(true)}>
              Unregister
            </Button>
            <Button variant="secondary" className="ms-2" onClick={handleClose}>
              Close
            </Button>
          </div>
          <Button variant="primary" onClick={() => onStartExam?.(id)}>
            Start
          </Button>
        </div>
      );
    }

    if (status === "Active") {
      return (
        <div className="d-flex justify-content-end w-100">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </div>
      );
    }

    if (status === "Completed" || status === "Cancelled") {
      return (
        <div className="d-flex justify-content-between w-100">
          <Button variant="primary" onClick={() => onShowInsights?.(id)}>
            Show Insights
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </div>
      );
    }

    return (
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
    );
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {status === "Active" ? (
          <p className="text-warning fw-semibold">This exam is currently in progress. Actions are disabled.</p>
        ) : (
          <p>{description || "No description available for this exam."}</p>
        )}
      </Modal.Body>

      <Modal.Footer>{renderFooter()}</Modal.Footer>
    </Modal>
  );
};

export default ExamDetailsModal;
