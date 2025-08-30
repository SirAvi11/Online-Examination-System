// ImportModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import QuestionTable from "./QuestionTable";
import "./ImportModal.css";

export default function ImportModal({
  show,
  onHide,
  importedQuestions,   // parsed from Excel
  onImport,            // callback when user confirms import
  addQuestion,         // API hook
}) {
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'danger' | 'warning', message: string }

  // Reset when modal opens
  useEffect(() => {
    if (show) {
      setSelectedQuestionIds([]);
      setExpandedRow(null);
      setAlert(null);
    }
  }, [show]);

  // ✅ Select/deselect a single question
  const toggleSelectQuestion = (questionId) => {
    setSelectedQuestionIds(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  // ✅ Select/deselect all questions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedQuestionIds(importedQuestions.map((q) => q._id));
    } else {
      setSelectedQuestionIds([]);
    }
  };

  const handleExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const selectedQuestions = importedQuestions.filter((q) =>
    selectedQuestionIds.includes(q._id)
  );

  // ✅ Validation logic before import
  const validateQuestions = (questions) => {
    const errors = [];

    questions.forEach((q, idx) => {
      if (!q.questionText || q.questionText.trim() === "") {
        errors.push(`Missing question text for row ${idx + 1}`);
      }
      if (!q.correctOptionIndex) {
        errors.push(`Missing answer for row ${idx + 1}`);
      }
      if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
        errors.push(`At least 2 options required for question ${idx + 1}`);
      }
    });

    return errors;
  };

  const handleImport = async () => {
    const errors = validateQuestions(selectedQuestions);

    if (errors.length > 0) {
      setAlert({
        type: "danger",
        message: (
          <ul style={{ marginBottom: 0 }}>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )
      });
      return;
    }

    try {
      for (const q of selectedQuestions) {
        await addQuestion(q);
      }

      setAlert({
        type: "success",
        message: `Successfully uploaded ${selectedQuestions.length} question(s).`
      });

      onImport?.(selectedQuestions);

      // Auto-dismiss success after 3s
      setTimeout(() => {
        setAlert(null);
        onHide();
      }, 3000);
    } catch (err) {
      setAlert({
        type: "danger",
        message: "An unexpected error occurred while importing questions."
      });
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Import Questions from Excel</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {alert && (
          <Alert
            variant={alert.type}
            onClose={() => setAlert(null)}
            dismissible
            className="mb-3"
          >
            {alert.message}
          </Alert>
        )}

        <QuestionTable
          questions={importedQuestions}
          selectedQuestionIds={selectedQuestionIds}
          onSelect={toggleSelectQuestion}
          onSelectAll={handleSelectAll}
          onExpand={handleExpand}
          expandedRow={expandedRow}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={selectedQuestionIds.length === 0}
          onClick={handleImport}
        >
          Import Selected ({selectedQuestionIds.length})
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
