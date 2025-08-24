// QuestionBank.js
import React, { useState } from 'react';
import QuestionTable from './QuestionTable';
import AddQuestionModal from './AddQuestionModal';
import DuplicateWarningModal from './DuplicateWarningModal';
import SuccessNotification from './SuccessNotification'; // Add this import
import useQuestion from './hooks/useQuestion';
import ArchiveButton from './ArchieveButton';
import { AccordionHeader, Button } from "react-bootstrap";

export default function QuestionBank({ selectedModule, onBack }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { 
    questions, 
    loading, 
    error, 
    isSaving,
    duplicateInfo,  
    successInfo,
    addQuestion, 
    deleteQuestions,
    resetDuplicateInfo, 
    resetSuccessInfo
  } = useQuestion(selectedModule?._id);

  console.log("QuestionBank successInfo:", successInfo);
  {successInfo.show && (
  <div style={{
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    backgroundColor: 'green',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px'
  }}>
    TEST: Question #{successInfo.questionNumber} added successfully.
  </div>
)}

  
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
      setSelectedQuestionIds(questions.map(q => q._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedQuestionIds.length === 0) return;
    const success = await deleteQuestions(selectedQuestionIds);
    if (success) {
      setSelectedQuestionIds([]);
    }
  };

  const handleAddQuestion = async (questionData) => {
    return await addQuestion(questionData);
  };

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-3">
      {/* Success Notification */}
      <SuccessNotification 
        successInfo={successInfo} 
        onClose={resetSuccessInfo} 
      />
      
      {/* Header and controls */}
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

          {console.log("selectedQuestionIds",selectedQuestionIds)}

          <div className="d-flex gap-2">
            {/* Toggle Button (shows only when questions are selected) */}
            {(selectedQuestionIds.length > 0 || true) && (
              <ArchiveButton selectedQuestionIds ={selectedQuestionIds} />
            )}
            <Button
              variant="outline-secondary"
              disabled={selectedQuestionIds.length > 0}
            >
              <i className="fa fa-cog me-2"></i>Filter
            </Button>
            
            <Button
              variant="outline-secondary"
              onClick={() => setShowModal(true)}
              disabled={selectedQuestionIds.length > 0}
            >
              <i className="fa fa-plus me-2"></i>New
            </Button>

            <Button
              variant="outline-secondary"
              disabled={selectedQuestionIds.length > 0}
            >
              <i className="fa fa-upload me-2"></i>Upload
            </Button>
          </div>
        </div>

        {selectedQuestionIds.length > 0 && (
          <div className="overlay">
            <Button variant="danger" onClick={handleDeleteSelected}>
              <i className="fa fa-trash" /> Delete Selected
            </Button>
            <button
              className="btn-close-selection"
              onClick={() => setSelectedQuestionIds([])}
              aria-label="Clear selection"
            />
          </div>
        )}
      </div>

      {/* Question table */}
      <QuestionTable
        questions={questions}
        selectedQuestionIds={selectedQuestionIds}
        expandedRow={expandedRow}
        onSelect={toggleSelectQuestion}
        onSelectAll={toggleSelectAll}
        onExpand={setExpandedRow}
      />

      {/* Modals */}
      <AddQuestionModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleAddQuestion}
        moduleId={selectedModule._id}
        isSaving={isSaving}
        successInfo={successInfo}
      />

      <DuplicateWarningModal
        duplicateInfo={duplicateInfo}
        onHide={resetDuplicateInfo}
      
      />
    </div>
  );
}