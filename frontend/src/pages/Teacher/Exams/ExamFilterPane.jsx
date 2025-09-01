// ExamFilterPane.js
import React, { useState, useRef } from "react";
import { Form, InputGroup, Button, ButtonGroup } from "react-bootstrap";
import useClickOutside from "../Modules/QuestionBank/hooks/useClickOutside";

const ExamFilterPane = ({ onApply, onClose }) => {
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [examStatus, setExamStatus] = useState("active"); // active, completed, upcoming

  const filterPaneRef = useRef();
  useClickOutside(filterPaneRef, onClose);

  const handleApply = () => {
    const filters = {
      searchText,
      startDate: startDate || null,
      endDate: endDate || null,
      examStatus,
    };
    onApply(filters);
  };

  const handleCancel = () => {
    setSearchText("");
    setStartDate("");
    setEndDate("");
    setExamStatus("active");
    onClose();
  };

  return (
    <div className="filter-pane" ref={filterPaneRef}>
      <div className="filter-pane-content">
        {/* Search Section */}
        <div className="mb-3">
          <h6 className="mb-2 fw-bold">Search</h6>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search exams..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Form.Group>
        </div>

        {/* Filter Section */}
        <div>
          <h6 className="mb-2 fw-bold">Filter by:</h6>

          {/* Date Range Filter */}
          <Form.Group className="mb-3">
            <Form.Label>Date Range</Form.Label>
            <InputGroup className="mb-2">
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <InputGroup.Text>to</InputGroup.Text>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          {/* Exam Status Filter */}
          <Form.Group className="mb-3">
            <Form.Label>Exam Status</Form.Label>
            <div>
              <ButtonGroup>
                <Button
                  variant={examStatus === "active" ? "primary" : "outline-primary"}
                  onClick={() => setExamStatus("active")}
                >
                  Active
                </Button>
                <Button
                  variant={examStatus === "completed" ? "primary" : "outline-primary"}
                  onClick={() => setExamStatus("completed")}
                >
                  Completed
                </Button>
                <Button
                  variant={examStatus === "upcoming" ? "primary" : "outline-primary"}
                  onClick={() => setExamStatus("upcoming")}
                >
                  Upcoming
                </Button>
              </ButtonGroup>
            </div>
          </Form.Group>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2 justify-content-end">
          <Button variant="outline-secondary" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamFilterPane;
