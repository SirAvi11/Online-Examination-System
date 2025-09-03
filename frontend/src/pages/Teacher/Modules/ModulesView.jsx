import { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import "./ModulesView.css";
import "./QuestionBank/QuestionTable.css";
import QuestionBank from "./QuestionBank/QuestionBank";

export default function ModulesView({ teacherId }) {
  const [modules, setModules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newModule, setNewModule] = useState({ name: "", description: "" });
  const [selectedModule, setSelectedModule] = useState(null);
  const [editing, setEditing] = useState({});
  const [editingValues, setEditingValues] = useState({});
  const [selectedModuleIds, setSelectedModuleIds] = useState([]);

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    if (!teacherId) return;
    fetchModules();
  }, [teacherId]);

  const fetchModules = async () => {
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:5000/api/modules`, {
        headers: {
          'x-auth-token': token
        }
      });
      if (!res.ok) throw new Error('Failed to fetch modules');
      const data = await res.json();
      setModules(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      console.error("Error fetching modules:", err);
      alert("Failed to fetch modules. Please check your authentication.");
    }
  };

  const handleSaveModule = async () => {
    if (!newModule.name.trim()) return;
    try {
      const token = getToken();
      const res = await fetch("http://localhost:5000/api/modules", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'x-auth-token': token
        },
        body: JSON.stringify({ ...newModule, teacherId })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save module');
      }
      
      const savedModule = await res.json();
      setModules(prev => [savedModule, ...prev]);
      setNewModule({ name: "", description: "" });
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save module:", err);
      alert(err.message || "Failed to save module");
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
    
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:5000/api/modules/${moduleId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'x-auth-token': token
        },
        body: JSON.stringify(updatedModule)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update module');
      }
      
      const data = await res.json();
      setModules(prev => prev.map(m => m._id === moduleId ? data : m));
      // Clear editing states
      setEditing(prev => { 
        const copy = { ...prev }; 
        delete copy[`${moduleId}-name`]; 
        delete copy[`${moduleId}-description`]; 
        return copy; 
      });
      setEditingValues(prev => { 
        const copy = { ...prev }; 
        delete copy[`${moduleId}-name`]; 
        delete copy[`${moduleId}-description`]; 
        return copy; 
      });
    } catch (err) {
      console.error("Failed to update module:", err);
      alert(err.message || "Failed to update module");
    }
  };

  const handleBack = () => {
    setSelectedModule(null)
    fetchModules()
  };

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
      const token = getToken();
      const res = await fetch("http://localhost:5000/api/modules", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          'x-auth-token': token
        },
        body: JSON.stringify({ ids: selectedModuleIds })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete modules');
      }
      
      setModules(prev => prev.filter(m => !selectedModuleIds.includes(m._id)));
      setSelectedModuleIds([]);
    } catch (err) {
      console.error("Failed to delete modules:", err);
      alert(err.message || "Failed to delete modules");
    }
  };

  return (
    <div className="p-4" style={{ width: "100%", position: "relative", display:"flex", flexDirection:"column" }}>
      {!selectedModule ? (
        <>
          <div className="header-container" style={{ position: "relative" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Modules ({modules.length})</h3>
              <Button variant="outline-secondary" onClick={() => setShowModal(true)} disabled={selectedModuleIds.length > 0} data-cy="new-module-btn">+ New Module</Button>
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

            <div className="table-scroll-container h-100">
              <table className="h-100 custom-table">
                <thead>
                  <tr>
                    <th>
                      <Form.Check
                        type="checkbox"
                        checked={selectedModuleIds.length === modules.length && modules.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th style={{ width: "40px", textAlign:"center" }}>#</th>
                    <th style={{ minWidth: 320 }}>Module Name</th>
                    <th>Description</th>
                    <th style={{textAlign:"center" }}>Questions</th>
                    <th style={{ width: "180px", textAlign:"center" }}>Created On</th>
                    <th style={{ width: "200px", textAlign:"center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody data-cy="module-list">
                  {modules.map((module, index) => {
                    const nameKey = `${module._id}-name`;
                    const descKey = `${module._id}-description`;
                    const isEditingName = !!editing[nameKey];
                    const isEditingDesc = !!editing[descKey];
                    const isSelected = selectedModuleIds.includes(module._id);

                    return (
                      <tr key={module._id} >
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectModule(module._id)}
                          />
                        </td>
                        <td style={{ textAlign:"center" }}>{index + 1}</td>
                        <td className="editable-cell">
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {isEditingName ? (
                              <Form.Control
                                type="text"
                                value={editingValues[nameKey] ?? ""}
                                onChange={(e) => changeEditingValue(module._id, "name", e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") saveEditing(module._id, "name"); }}
                                autoFocus
                              />
                            ) : (
                              module.name
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

                        <td style={{textAlign:"center" }}>{module.questionCount ?? 0}</td>
                        <td style={{textAlign:"center" }}>{new Date(module.date).toLocaleDateString()}</td>
                        <td style={{textAlign:"center" }}>
                          <Button variant="outline-info" size="sm" onClick={() => handleOpenQuestionBank(module)}>
                            See question bank
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          

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
                    data-cy="module-name-input"
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
                    data-cy="module-description-input"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveModule} data-cy="create-module-submit">Save</Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <QuestionBank
          onBack={handleBack}
          selectedModule={selectedModule}
        />
      )}
    </div>
  );
}