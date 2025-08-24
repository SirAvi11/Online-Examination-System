// QuestionBank.js
import React, { useState, useMemo, useRef } from 'react';
import QuestionTable from './QuestionTable';
import AddQuestionModal from './AddQuestionModal';
import DuplicateWarningModal from './DuplicateWarningModal';
import SuccessNotification from './SuccessNotification';
import FilterPane from './FilterPane';
import useQuestion from './hooks/useQuestion';
import ArchiveButton from './ArchieveButton';
import { Button } from "react-bootstrap";
import './QuestionBank.css';

export default function QuestionBank({ selectedModule, onBack }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFilterPane, setShowFilterPane] = useState(false); 
  const [filters, setFilters] = useState({});
  const filterButtonRef = useRef(null);

  const { 
    questions, 
    loading, 
    error, 
    isSaving,
    duplicateInfo,  
    successInfo,
    toggleArchieveQuestions,
    addQuestion, 
    deleteQuestions,
    resetDuplicateInfo, 
    resetSuccessInfo
  } = useQuestion(selectedModule?._id);
  
  // Filter questions based on applied filters
  const filteredQuestions = useMemo(() => {
    // Default: show only active questions when no filters are applied
    if (!filters || Object.keys(filters).length === 0) {
      return questions.filter(q => !q.isArchived);
    }
    
    return questions.filter(question => {
      // Filter by search text
      if (filters.searchText && !question.questionText.toLowerCase().includes(filters.searchText.toLowerCase())) {
        return false;
      }
      
      // Filter by marks range
      if (filters.minMarks !== null && question.marks < filters.minMarks) {
        return false;
      }
      
      if (filters.maxMarks !== null && question.marks > filters.maxMarks) {
        return false;
      }
      
      // Filter by question status (either archived or active, not both)
      if (filters.questionStatus === 'active' && question.isArchived) {
        return false;
      }
      
      if (filters.questionStatus === 'archived' && !question.isArchived) {
        return false;
      }
      
      return true;
    });
  }, [questions, filters]);

  const toggleSelectQuestion = (questionId) => {
    setSelectedQuestionIds(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedQuestionIds.length === filteredQuestions.length) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(filteredQuestions.map(q => q._id));
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

  // Handle applying filters
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilterPane(false);
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setFilters({});
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
              Question Bank ({filteredQuestions.length})
            </h5>
            <h6 className="mb-0 text-secondary" style={{ letterSpacing: "0.5px", fontSize: "1rem" }}>
              {selectedModule.name}
            </h6>
          </div>

          <div className="d-flex gap-2 position-relative">
            {/* Toggle Button (shows only when questions are selected) */}
            {(selectedQuestionIds.length > 0 || true) && (
              <ArchiveButton 
                selectedQuestionIds={selectedQuestionIds} 
                toggleArchiveQuestions={toggleArchieveQuestions}
                setSelectedQuestionIds={setSelectedQuestionIds}
              />
            )}
            
            {/* Filter Button - Updated */}
            <div ref={filterButtonRef}>
              <Button
                variant={Object.keys(filters).length > 0 ? "primary" : "outline-secondary"}
                onClick={() => setShowFilterPane(!showFilterPane)}
                disabled={selectedQuestionIds.length > 0}
              >
                <i className="fa fa-filter me-2"></i>
                Filter
                {Object.keys(filters).length > 0 && (
                  <span className="ms-1">•</span>
                )}
              </Button>
            </div>

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

            {/* Filter Pane */}
            {showFilterPane && (
              <FilterPane
                onApply={handleApplyFilters}
                onClose={() => setShowFilterPane(false)}
                questions={questions}
              />
            )}
          </div>
        </div>

        {/* Show active filters and clear option */}
        {Object.keys(filters).length > 0 && (
          <div className="filter-badges p-2 bg-light rounded d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <small className="text-muted me-2">Active filters:</small>
              {filters.searchText && (
                <span className="badge bg-secondary filter-badge">
                  Search: {filters.searchText}
                </span>
              )}
              {(filters.minMarks !== null || filters.maxMarks !== null) && (
                <span className="badge bg-secondary filter-badge">
                  Marks: {filters.minMarks || 0}-{filters.maxMarks || '∞'}
                </span>
              )}
              {filters.questionStatus && (
                <span className="badge bg-secondary filter-badge">
                  {filters.questionStatus === 'active' ? 'Active Questions' : 'Archived Questions'}
                </span>
              )}
            </div>
            <Button variant="outline-danger" size="sm" onClick={handleClearFilters}>
              Clear all
            </Button>
          </div>
        )}

        {selectedQuestionIds.length > 0 && (
          <div className="overlay">
            <Button variant="danger" onClick={handleDeleteSelected}>
              <i className="fa fa-trash" /> Delete Selected ({selectedQuestionIds.length})
            </Button>
            <button
              className="btn-close-selection"
              onClick={() => setSelectedQuestionIds([])}
              aria-label="Clear selection"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Question table */}
      <QuestionTable
        questions={filteredQuestions}
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