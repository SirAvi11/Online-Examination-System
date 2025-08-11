import { useState } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";

export default function TeacherModulesView() {
  const [modules, setModules] = useState([
    { id: 1, name: "Mathematics", questions: 25, date: "2025-08-10" },
    { id: 2, name: "Physics", questions: 18, date: "2025-08-05" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newModule, setNewModule] = useState({ name: "", description: "" });

  const [selectedModule, setSelectedModule] = useState(null);
  const [questionBank, setQuestionBank] = useState({});
  const [newQuestion, setNewQuestion] = useState({ question: "", options: ["", "", "", ""], answer: "" });

  // Save new module
  const handleSaveModule = () => {
    if (!newModule.name.trim()) return;
    setModules([
      ...modules,
      {
        id: modules.length + 1,
        name: newModule.name,
        questions: 0,
        date: new Date().toISOString().split("T")[0],
      },
    ]);
    setNewModule({ name: "", description: "" });
    setShowModal(false);
  };

  // Open question bank for a module
  const handleOpenQuestionBank = (module) => {
    setSelectedModule(module);
    if (!questionBank[module.id]) {
      setQuestionBank({ ...questionBank, [module.id]: [] });
    }
  };

  // Save new MCQ
  const handleAddQuestion = () => {
    if (!newQuestion.question.trim()) return;
    const updatedBank = {
      ...questionBank,
      [selectedModule.id]: [
        ...(questionBank[selectedModule.id] || []),
        { ...newQuestion }
      ]
    };
    setQuestionBank(updatedBank);
    setModules(modules.map(m => m.id === selectedModule.id ? { ...m, questions: updatedBank[selectedModule.id].length } : m));
    setNewQuestion({ question: "", options: ["", "", "", ""], answer: "" });
  };

  // Back to modules
  const handleBack = () => setSelectedModule(null);

  return (
    <div className="p-4" style={{width: "100%"}}>
      {!selectedModule ? (
        <>
          {/* Modules Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Modules</h3>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              + New Module
            </Button>
          </div>

          {/* Modules Table */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Module Name</th>
                <th>Questions</th>
                <th>Created On</th>
                <th style={{ width: "200px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module.id}>
                  <td>{module.name}</td>
                  <td>{module.questions}</td>
                  <td>{module.date}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-2" onClick={() => handleOpenQuestionBank(module)}>
                      Question Bank
                    </Button>
                    <Button variant="warning" size="sm" className="me-2">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Add Module Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Module</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="moduleName" className="mb-3">
                  <Form.Label>Module Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter module name"
                    value={newModule.name}
                    onChange={(e) =>
                      setNewModule({ ...newModule, name: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="moduleDesc" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter module description"
                    value={newModule.description}
                    onChange={(e) =>
                      setNewModule({ ...newModule, description: e.target.value })
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveModule}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <>
          {/* Question Bank Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Question Bank - {selectedModule.name}</h3>
            <Button variant="secondary" onClick={handleBack}>← Back to Modules</Button>
          </div>

          {/* Add New Question */}
          <div className="mb-4 p-3 border rounded">
            <h5>Add New Question</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the question"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                />
              </Form.Group>
              {newQuestion.options.map((opt, idx) => (
                <Form.Group key={idx} className="mb-2">
                  <Form.Label>Option {idx + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Enter option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updatedOptions = [...newQuestion.options];
                      updatedOptions[idx] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: updatedOptions });
                    }}
                  />
                </Form.Group>
              ))}
              <Form.Group className="mb-3">
                <Form.Label>Correct Answer</Form.Label>
                <Form.Select
                  value={newQuestion.answer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                >
                  <option value="">Select correct answer</option>
                  {newQuestion.options.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt || `Option ${idx + 1}`}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button variant="success" onClick={handleAddQuestion}>Add Question</Button>
            </Form>
          </div>

          {/* Question List */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Question</th>
                <th>Options</th>
                <th>Answer</th>
              </tr>
            </thead>
            <tbody>
              {(questionBank[selectedModule.id] || []).map((q, i) => (
                <tr key={i}>
                  <td>{q.question}</td>
                  <td>{q.options.join(", ")}</td>
                  <td>{q.answer}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
}
