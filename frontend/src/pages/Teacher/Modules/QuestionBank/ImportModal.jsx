// ImportModal.js
import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Alert, ButtonGroup, Dropdown } from "react-bootstrap";
import QuestionTable from "./QuestionTable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./ImportModal.css";

export default function ImportModal({
  disabled,
  selectedModule,
  onImport,            // callback when user confirms import
  addQuestion,         // API hook
}) {
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [importedQuestions, setImportedQuestions] = useState([]);
  const [invalidQuestions, setInvalidQuestions] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [successInfo, setSuccessInfo] = useState({show: false, message: "", questionCount: 0});
  
  const [alert, setAlert] = useState(null); // { type: 'success' | 'danger' | 'warning', message: string }

    // For file input ref
  const fileInputRef = useRef(null);

  // Reset when modal opens
  useEffect(() => {
    if (showImportModal) {
      setSelectedQuestionIds([]);
      setExpandedRow(null);
      // Show alert with summary
      if (invalidQuestions.length > 0) {
        setAlert({
          type: "warning",
          message: (
            <div>
              <p>
                ✅ {importedQuestions.length} question(s) loaded successfully<br />
                ❌ {invalidQuestions.length} question(s) failed:
              </p>
              <ul style={{ marginBottom: 0 }}>
                {invalidQuestions.map((err, i) => (
                  <li key={i}>
                    Row {err.row}: {err.errors.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          )
        });
      } else {
        setAlert({
          type: "success",
          message: `✅ Successfully loaded ${importedQuestions.length} question(s) from Excel`
        });
      }
    }
  }, [showImportModal]);



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
    const validQuestions = [];
    const invalidQuestions = [];

    questions.forEach((q, idx) => {
      const rowErrors = [];
      if (!q.questionText || q.questionText.trim() === "") {
        rowErrors.push("Missing question text");
      }
      if (q.correctOptionIndex === null) {
        rowErrors.push("Invalid or missing correct option");
      }
      if (!q.options || q.options.filter(opt => opt && opt.trim() !== "").length < 2) {
        rowErrors.push("At least 2 options required");
      }

      if (rowErrors.length > 0) {
        invalidQuestions.push({ row: idx + 2, errors: rowErrors }); // +2 = account for header row + 1-based index
      } else {
        validQuestions.push(q);
      }
    });

    return {validQuestions, invalidQuestions}
  };

  const handleImport = async () => {
    
    try {
      for (const q of selectedQuestions) {
        await addQuestion(q);
      }
      onImport?.(selectedQuestions);

      // Auto-dismiss success after 3s
      setTimeout(() => {
        setAlert(null);
        setShowImportModal(false);
      }, 3000);
    } catch (err) {
      setAlert({
        type: "danger",
        message: "An unexpected error occurred while importing questions."
      });
    }
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

    // Use the 2nd sheet (index 1) since the first is instructions
    const sheet = workbook.Sheets[workbook.SheetNames[1]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // Map rows to Question objects
    const parsedQuestions = rows.map((row, idx) => {
      const options = [
        row["Option A"] || "",
        row["Option B"] || "",
        row["Option C"] || "",
        row["Option D"] || "",
      ];

      const correctOptionIndex = (() => {
        const letter = (row["Correct Option"] || "").toString().trim().toUpperCase();
        switch (letter) {
          case "A": return 0;
          case "B": return 1;
          case "C": return 2;
          case "D": return 3;
          default: return 0; // fallback
        }
      })();

      const correctAnswer = correctOptionIndex >= 0 ? options[correctOptionIndex] : "";


      return {
        _id: idx, // temp ID for UI
        questionText: row["Question Text"] || "",
        options,
        answer: correctAnswer,
        marks: Number(row["Marks"]) || 1,
        imageUrl: row["Image URL"] || "",
        moduleId: selectedModule._id,
      };
    });

    const validatedQuestions = validateQuestions(parsedQuestions);

    setImportedQuestions(validatedQuestions.validQuestions);
    setInvalidQuestions(validatedQuestions.invalidQuestions);
    setShowImportModal(true);
  };

  return (
    <>
      <Dropdown as={ButtonGroup}>
        {/* Upload button */}
        <Button
          variant="outline-secondary"
          onClick={() => fileInputRef.current.click()}
          disabled={disabled}
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
        onChange={(e) => {
          handleFileChange(e);
          // Reset input so onChange will trigger even if same file is picked again
          e.target.value = "";
        }}
      />
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)} size="xl">
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
          <Button variant="secondary" onClick={() => setShowImportModal(false)}>
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

    </>
    
  );
}
