import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';

const FilterModal = ({ show, onHide, onApply, questions }) => {
  const [searchText, setSearchText] = useState('');
  const [minMarks, setMinMarks] = useState('');
  const [maxMarks, setMaxMarks] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const handleApply = () => {
    const filters = {
      searchText,
      minMarks: minMarks ? parseInt(minMarks) : null,
      maxMarks: maxMarks ? parseInt(maxMarks) : null,
      showArchived
    };
    onApply(filters);
  };

  const handleCancel = () => {
    // Reset filters when canceling
    setSearchText('');
    setMinMarks('');
    setMaxMarks('');
    setShowArchived(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Filter Questions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Search Section */}
        <div className="mb-4">
          <h6 className="mb-2 fw-bold">Search</h6>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search questions..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Form.Group>
        </div>

        {/* Filter Section */}
        <div>
          <h6 className="mb-2 fw-bold">Filter by:</h6>
          
          {/* Marks Filter */}
          <Form.Group className="mb-3">
            <Form.Label>Marks Range</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Min"
                value={minMarks}
                onChange={(e) => setMinMarks(e.target.value)}
                min="0"
              />
              <InputGroup.Text>-</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Max"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                min="0"
              />
            </InputGroup>
          </Form.Group>

          {/* Archived Filter */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Show archived questions"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleApply}>
          Apply Filters
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;