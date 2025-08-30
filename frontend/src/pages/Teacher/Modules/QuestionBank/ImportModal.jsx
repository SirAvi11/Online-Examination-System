// ImportModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import TransferList from "../../../../components/TransferList/TransferList";

export default function ImportModal({
  show,
  onHide,
  importedQuestions,   // parsed from Excel
  onImport,            // callback when user confirms import
  addQuestion,         // API hook
}) {
  const [questionsToImport, setQuestionsToImport] = useState([]);

  // Reset when modal opens
  useEffect(() => {
    if (show) {
      setQuestionsToImport([]);
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Import Questions from Excel</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <TransferList
          availableItems={importedQuestions}
          selectedItems={questionsToImport}
          onChange={setQuestionsToImport}
          renderItem={(q) => (
            <div className="question-row">
              <span className="question-text">{q.questionText}</span>
              <span className="question-marks">{q.marks} marks</span>
            </div>
          )}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={questionsToImport.length === 0}
          onClick={async () => {
            for (const q of questionsToImport) {
              await addQuestion(q);
            }
            onImport?.(questionsToImport);
            onHide();
          }}
        >
          Import Selected ({questionsToImport.length})
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
