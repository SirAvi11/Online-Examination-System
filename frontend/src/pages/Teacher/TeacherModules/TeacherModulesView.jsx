import { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import "./TeacherModulesView.css";
import TeacherQuestionBank from "./TeacherQuestionBank";

export default function TeacherModulesView({ teacherId }) {
  const [modules, setModules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newModule, setNewModule] = useState({ name: "", description: "" });
  const [selectedModule, setSelectedModule] = useState(null);
  const [editing, setEditing] = useState({});
  const [editingValues, setEditingValues] = useState({});
  const [selectedModuleIds, setSelectedModuleIds] = useState([]);

  useEffect(() => {
    if (!teacherId) return;
    fetchModules();
  }, [teacherId]);

  const fetchModules = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/modules?teacherId=${teacherId}`);
      const data = await res.json();
      setModules(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleSaveModule = async () => {
    if (!newModule.name.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newModule, teacherId, color: getRandomColor() })
      });
      const savedModule = await res.json();
      setModules(prev => [savedModule, ...prev]);
      setNewModule({ name: "", description: "" });
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save module:", err);
    }
  };

  const handleOpenQuestionBank = (module) => {
    setSelectedModule(module);
  };

  // --- Editing Functions ---
  const startEditing = (moduleId, field) => {
    const key = `${moduleId}-${field}`;
    const module = modules.find(m => m._id === moduleId) || {};
    setEditing(prev => ({ ...prev, [key]: true }));
    setEditingValues(prev => ({ ...prev, [key]: module[field] ?? "" }));
  };

  const changeEditingValue = (moduleId, field, value) => {
    const key = `${moduleId}-${field}`;
    setEditingValues(prev => ({ ...prev, [key]: value }));
  };

  const saveEditing = async (moduleId, field) => {
    const key = `${moduleId}-${field}`;
    const newVal = (editingValues[key] ?? "").trim();
    if (field === "name" && newVal === "") return;
    const updatedModule = { [field]: newVal };
    if (field === "name") {
      const colorKey = `${moduleId}-color`;
      updatedModule.color = editingValues[colorKey] ?? modules.find(m => m._id === moduleId)?.color;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/modules/${moduleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedModule)
      });
      const data = await res.json();
      setModules(prev => prev.map(m => m._id === moduleId ? data : m));
      // Clear editing states
      setEditing(prev => { const copy = { ...prev }; delete copy[`${moduleId}-name`]; delete copy[`${moduleId}-description`]; delete copy[`${moduleId}-color`]; return copy; });
      setEditingValues(prev => { const copy = { ...prev }; delete copy[`${moduleId}-name`]; delete copy[`${moduleId}-description`]; delete copy[`${moduleId}-color`]; return copy; });
    } catch (err) {
      console.error("Failed to update module:", err);
    }
  };

  const handleBack = () => setSelectedModule(null);

  // --- Selection Functions ---
  const toggleSelectModule = (moduleId) => {
    setSelectedModuleIds(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedModuleIds.length === modules.length) {
      setSelectedModuleIds([]);
    } else {
      setSelectedModuleIds(modules.map(m => m._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedModuleIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedModuleIds.length} module(s)?`)) return;

    try {
      await fetch("http://localhost:5000/api/modules", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedModuleIds })
      });
      setModules(prev => prev.filter(m => !selectedModuleIds.includes(m._id)));
      setSelectedModuleIds([]);
    } catch (err) {
      console.error("Failed to delete modules:", err);
    }
  };

  return (
    <div className="p-4" style={{ width: "100%", position: "relative" }}>
      {!selectedModule ? (
        <>
          <div className="header-container" style={{ position: "relative" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Modules ({modules.length})</h3>
              <Button variant="outline-secondary" onClick={() => setShowModal(true)} disabled={selectedModuleIds.length > 0}>+ New Module</Button>
            </div>

            {/* Overlay for bulk delete */}
            {selectedModuleIds.length > 0 && (
              <div className="overlay show">
                <Button variant="danger" onClick={handleDeleteSelected}>
                  <i className="fa fa-trash" /> Delete
                </Button>
                <button
                  className="btn-close-selection"
                  onClick={() => setSelectedModuleIds([])}
                >
                </button>
              </div>
            )}


          </div>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    checked={selectedModuleIds.length === modules.length && modules.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th style={{ minWidth: 320 }}>Module Name</th>
                <th>Description</th>
                <th>Questions</th>
                <th style={{ width: "180px" }}>Created On</th>
                <th style={{ width: "200px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map(module => {
                const nameKey = `${module._id}-name`;
                const descKey = `${module._id}-description`;
                const isEditingName = !!editing[nameKey];
                const isEditingDesc = !!editing[descKey];
                const isSelected = selectedModuleIds.includes(module._id);

                return (
                  <tr key={module._id} style={{ backgroundColor: module.color || "#fff" }}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectModule(module._id)}
                      />
                    </td>
                    <td className="editable-cell">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {isEditingName && (
                          <input
                            type="color"
                            value={editingValues[`${module._id}-color`] ?? module.color ?? "#000000"}
                            onChange={(e) => changeEditingValue(module._id, "color", e.target.value)}
                            style={{ width: "24px", height: "24px", border: "none", padding: 0 }}
                          />
                        )}
                        {!isEditingName && (
                          <span style={{ display: "inline-block", width: "12px", height: "24px", borderRadius: "6px", backgroundColor: module.color || "#000000" }} />
                        )}
                        {isEditingName ? (
                          <Form.Control
                            type="text"
                            value={editingValues[nameKey] ?? ""}
                            onChange={(e) => changeEditingValue(module._id, "name", e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") saveEditing(module._id, "name"); }}
                            autoFocus
                          />
                        ) : (
                          <strong>{module.name}</strong>
                        )}
                        <Button
                          variant="link"
                          size="sm"
                          className="cell-edit-btn"
                          onClick={() => isEditingName ? saveEditing(module._id, "name") : startEditing(module._id, "name")}
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
                          onChange={(e) => changeEditingValue(module._id, "description", e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) saveEditing(module._id, "description"); }}
                          autoFocus
                        />
                      ) : (
                        module.description || <span className="text-muted">No description</span>
                      )}
                      <Button
                        variant="link"
                        size="sm"
                        className="cell-edit-btn"
                        onClick={() => isEditingDesc ? saveEditing(module._id, "description") : startEditing(module._id, "description")}
                      >
                        <i className={`fa ${isEditingDesc ? "fa-save" : "fa-edit"}`} />
                      </Button>
                    </td>

                    <td>{module.questionCount ?? 0}</td>
                    <td>{new Date(module.date).toLocaleDateString()}</td>
                    <td>
                      <Button variant="outline-info" size="sm" onClick={() => handleOpenQuestionBank(module)}>
                        See question bank
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {/* New Module Modal */}
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
                    onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="moduleDesc" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter module description"
                    value={newModule.description}
                    onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveModule}>Save</Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <TeacherQuestionBank
          onBack={handleBack}
          selectedModule={selectedModule}
        />
      )}
    </div>
  );
}
