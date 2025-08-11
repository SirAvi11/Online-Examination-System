import { useState } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import "./TeacherModulesView.css"; // <-- New CSS file

export default function TeacherModulesView() {
  const [modules, setModules] = useState([
    { id: 1, name: "Mathematics", description: "Algebra, calculus basics", questions: 25, date: "2025-08-10", color:"#ff0000" },
    { id: 2, name: "Physics", description: "Mechanics & Thermodynamics", questions: 18, date: "2025-08-05", color:"#0000ff" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newModule, setNewModule] = useState({ name: "", description: "" });

  const [selectedModule, setSelectedModule] = useState(null);
  const [questionBank, setQuestionBank] = useState({});
  const [newQuestion, setNewQuestion] = useState({ question: "", options: ["", "", "", ""], answer: "" });

  const [editing, setEditing] = useState({});
  const [editingValues, setEditingValues] = useState({});


  const handleSaveModule = () => {
    if (!newModule.name.trim()) return;
    const newId = modules.length ? Math.max(...modules.map(m => m.id)) + 1 : 1;
    setModules([
      ...modules,
      {
        id: newId,
        name: newModule.name,
        description: newModule.description || "",
        questions: 0,
        date: new Date().toISOString().split("T")[0],
      },
    ]);
    setNewModule({ name: "", description: "" });
    setShowModal(false);
  };

  const handleOpenQuestionBank = (module) => {
    setSelectedModule(module);
    if (!questionBank[module.id]) {
      setQuestionBank({ ...questionBank, [module.id]: [] });
    }
  };

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

  const startEditing = (moduleId, field) => {
    const key = `${moduleId}-${field}`;
    const module = modules.find(m => m.id === moduleId) || {};
    setEditing(prev => ({ ...prev, [key]: true }));
    setEditingValues(prev => ({ ...prev, [key]: module[field] ?? "" }));
  };

  const changeEditingValue = (moduleId, field, value) => {
    const key = `${moduleId}-${field}`;
    setEditingValues(prev => ({ ...prev, [key]: value }));
  };

  const saveEditing = (moduleId, field) => {
    const key = `${moduleId}-${field}`;
    const newVal = (editingValues[key] ?? "").trim();
    if (field === "name" && newVal === "") return;
    if (field === "name") {
      const newName = (editingValues[`${moduleId}-name`] ?? "").trim();
      const newColor = editingValues[`${moduleId}-color`] ?? modules.find(m => m.id === moduleId)?.color;

      if (newName === "") return;

      setModules(prev => prev.map(m =>
        m.id === moduleId ? { ...m, name: newName, color: newColor } : m
      ));

      // Clear both editing states
      setEditing(prev => {
        const copy = { ...prev };
        delete copy[`${moduleId}-name`];
        delete copy[`${moduleId}-color`];
        return copy;
      });
      
      setEditingValues(prev => {
        const copy = { ...prev };
        delete copy[`${moduleId}-name`];
        delete copy[`${moduleId}-color`];
        return copy;
      });

        return;
    }

  };

  const handleBack = () => setSelectedModule(null);

  return (
    <div className="p-4" style={{ width: "100%" }}>
      {!selectedModule ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Modules</h3>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              + New Module
            </Button>
          </div>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th style={{ minWidth: 320 }}>Module Name</th>
                <th>Description</th>
                <th>Questions</th>
                <th style={{ width: "180px" }}>Created On</th>
                <th style={{ width: "200px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => {
                const nameKey = `${module.id}-name`;
                const descKey = `${module.id}-description`;
                const isEditingName = !!editing[nameKey];
                const isEditingDesc = !!editing[descKey];

                return (
                  <tr key={module.id}>
                    <td className="editable-cell">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {isEditingName ? (
                          <input
                            type="color"
                            value={module.color ?? editingValues[`${module.id}-color`] ?? "#000000"}
                            onChange={(e) => changeEditingValue(module.id, "color", e.target.value)}
                            style={{ width: "24px", height: "24px", border: "none", padding: 0 }}
                          />
                        ) : (
                          <span
                            style={{
                              display: "inline-block",
                              width: "12px",
                              height: "24px",
                              borderRadius: "6px",
                              backgroundColor: module.color || "#000000"
                            }}
                          />
                        )}

                        {isEditingName ? (
                          <Form.Control
                            type="text"
                            value={editingValues[nameKey] ?? ""}
                            onChange={(e) => changeEditingValue(module.id, "name", e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") saveEditing(module.id, "name"); }}
                            autoFocus
                          />
                        ) : (
                          <strong>{module.name}</strong>
                        )}

                        <Button
                          variant="link"
                          size="sm"
                          className="cell-edit-btn"
                          onClick={() => isEditingName ? saveEditing(module.id, "name") : startEditing(module.id, "name")}
                        >
                          <i className={`fa ${isEditingName ? "fa-save" : "fa-edit"}`} />
                        </Button>
                      </div>
                    </td>


                    <td className="editable-cell">
                      {isEditingDesc ? (
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={editingValues[descKey] ?? ""}
                          onChange={(e) => changeEditingValue(module.id, "description", e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) saveEditing(module.id, "description"); }}
                          autoFocus
                        />
                      ) : (
                        module.description || <span className="text-muted">No description</span>
                      )}
                      <Button
                        variant="link"
                        size="sm"
                        className="cell-edit-btn"
                        onClick={() => isEditingDesc ? saveEditing(module.id, "description") : startEditing(module.id, "description")}
                      >
                        <i className={`fa ${isEditingDesc ? "fa-save" : "fa-edit"}`} />
                      </Button>
                    </td>

                    <td>{module.questions}</td>
                    <td>{module.date}</td>
                    <td>
                      <Button variant="info" size="sm" onClick={() => handleOpenQuestionBank(module)}>
                        See question bank
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Question Bank - {selectedModule.name}</h3>
            <Button variant="secondary" onClick={handleBack}>← Back to Modules</Button>
          </div>

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
