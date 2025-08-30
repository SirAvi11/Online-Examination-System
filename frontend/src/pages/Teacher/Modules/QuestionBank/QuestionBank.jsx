// QuestionBank.js
import React, { useState, useMemo, useRef } from 'react';
import { Dropdown, ButtonGroup, Modal, Button } from "react-bootstrap";
import QuestionTable from './QuestionTable';
import AddQuestionModal from './AddQuestionModal';
import DuplicateWarningModal from './DuplicateWarningModal';
import SuccessNotification from './SuccessNotification';
import FilterPane from './FilterPane';
import useQuestion from './hooks/useQuestion';
import ArchiveButton from './ArchiveButton';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import './QuestionBank.css';

export default function QuestionBank({ selectedModule, onBack }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFilterPane, setShowFilterPane] = useState(false); 
  const [filters, setFilters] = useState({});
  const [archiveState, setArchiveState] = useState(false);
  const filterButtonRef = useRef(null);

  // For file input ref
  const fileInputRef = useRef(null);

  // For Excel import
  const [importedQuestions, setImportedQuestions] = useState([]);   // raw parsed from Excel
  const [questionsToImport, setQuestionsToImport] = useState([]);   // user-selected in transfer list
  const [showImportModal, setShowImportModal] = useState(false);    // control modal visibility


  const { 
    questions, 
    loading, 
    error, 
    isSaving,
    duplicateInfo,  
    successInfo,
    toggleArchiveQuestions,
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
    setArchiveState(newFilters.questionStatus == 'active' ? false : true)
    setShowFilterPane(false);
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setArchiveState(false)
    setFilters({});
  };

const handleDownloadTemplate = () => {
  // --- Instructions Sheet Data ---
  const instructionsData = [
    ["Column Name", "Description", "Example"],
    ["Question Text", "The text of the question. (Required)", "What is 2+2?"],
    ["Option A", "First answer choice. (Required and Unique)", "2"],
    ["Option B", "Second answer choice. (Required and Unique)", "4"],
    ["Option C", "Third answer choice. (Optional)", "5 / blank"],
    ["Option D", "Fourth answer choice. (Optional)", "2 / blank"],
    [
      "Correct Option",
      "Correct option (starting from A for the first option). (Required)",
      "B (means '4' is correct from options above)"
    ],
    ["Marks", "Marks awarded for this question. Must be a number. (Required)", "2"],
    [
      "ImageUrl",
      "Optional. URL to an image for the question. Leave blank if none.",
      "https://example.com/image.png"
    ]
  ];
  const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);

  // Set column widths for readability
  wsInstructions["!cols"] = [
    { wch: 20 }, // Column Name
    { wch: 60 }, // Description
    { wch: 40 }  // Example
  ];

  // --- Template Sheet Data ---
  const templateHeaders = [
    ["Question Text", "Option A", "Option B", "Option C", "Option D", "Correct Option", "Marks", "ImageUrl"]
  ];

  const wsTemplate = XLSX.utils.aoa_to_sheet(templateHeaders);

  // Set column widths
  wsTemplate["!cols"] = [
    { wch: 40 }, // Question Text
    { wch: 20 }, // Option A
    { wch: 20 }, // Option B
    { wch: 20 }, // Option C
    { wch: 20 }, // Option D
    { wch: 20 }, // Correct Option
    { wch: 10 }, // Marks
    { wch: 40 }  // ImageUrl
  ];

  // --- Workbook ---
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsInstructions, "Instructions");
  XLSX.utils.book_append_sheet(wb, wsTemplate, "Template");

  // --- Export File ---
  const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), "QuestionTemplate.xlsx");
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  // Map rows to Question objects
  const parsedQuestions = rows.map((row, idx) => ({
    id: idx, // temp ID for UI
    questionText: row.questionText || "",
    options: row.options ? row.options.split(",").map(o => o.trim()) : [],
    correctOptionIndex: Number(row.correctOptionIndex) || 0,
    marks: Number(row.marks) || 1,
    imageUrl: row.imageUrl || "",
    moduleId: selectedModule._id,
  }));

  setImportedQuestions(parsedQuestions);
  setShowImportModal(true);
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
                state={archiveState}
                selectedQuestionIds={selectedQuestionIds} 
                toggleArchiveQuestions={toggleArchiveQuestions}
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

            <Dropdown as={ButtonGroup}>
              {/* Upload button */}
              <Button
                variant="outline-secondary"
                onClick={() => fileInputRef.current.click()}
                disabled={selectedQuestionIds.length > 0}
              >
                <i className="fa fa-upload me-2"></i>Upload
              </Button>

              {/* Dropdown arrow */}
              <Dropdown.Toggle split variant="outline-secondary" id="upload-dropdown" />

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleDownloadTemplate}>
                  <i className="fa fa-download me-2"></i>Download Template
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Hidden file input */}
            <input
              type="file"
              accept=".xlsx"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

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
        isSaving={isSaving}
        successInfo={successInfo}
      />

      <DuplicateWarningModal
        duplicateInfo={duplicateInfo}
        onHide={resetDuplicateInfo}
      />

      <Modal show={showImportModal} onHide={() => setShowImportModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Import Questions from Excel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <QuestionSelector
            modules={[selectedModule]}
            examQuestions={questionsToImport}   // right list
            onChange={setQuestionsToImport}     // updates selection
            importedQuestions={importedQuestions} // left list (parsed from excel)
          /> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImportModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              for (const q of questionsToImport) {
                await addQuestion(q);
              }
              setShowImportModal(false);
            }}
          >
            Import Selected
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}