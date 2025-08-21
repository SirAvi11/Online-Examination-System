import { useState } from "react";
import "./QuestionSelector.css";

const QuestionSelector = ({ modules, onChange }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [examQuestions, setExamQuestions] = useState([]);
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedExam, setSelectedExam] = useState([]);

  const handleModuleChange = async (moduleId) => {
  setSelectedModule(moduleId);
  try {
    const res = await fetch(`/api/modules/${moduleId}/questions`);
    const data = await res.json();

    if (res.ok) {
      // filter out questions that are already in examQuestions
      const filteredQuestions = data.filter(
        (q) => !examQuestions.some((eq) => eq._id === q._id)
      );
      setAvailableQuestions(filteredQuestions);
    } else {
      setAvailableQuestions([]);
    }
  } catch (err) {
    console.error("Error fetching questions:", err);
    setAvailableQuestions([]);
  }
};


  const moveToExam = () => {
    setExamQuestions([...examQuestions, ...selectedAvailable]);
    setAvailableQuestions(
      availableQuestions.filter((q) => !selectedAvailable.includes(q))
    );
    setSelectedAvailable([]);
  };

  const moveToAvailable = () => {
    setAvailableQuestions([...availableQuestions, ...selectedExam]);
    setExamQuestions(examQuestions.filter((q) => !selectedExam.includes(q)));
    setSelectedExam([]);
  };

  return (
    <div className="question-selector">
      {/* Module Dropdown */}
      <label>
        Choose from existing modules:{" "}
        <select onChange={(e) => handleModuleChange(e.target.value)}>
          <option value="">Select Module</option>
          {modules.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
      </label>

      <div className="transfer-container">
        {/* Available List */}
        <div className="list">
          <div className="questions-fixed">
            <h4 className="listbox-title">Available Questions</h4>
            {/* Header Row */}
            <div className="list-header">
              <label className="question select-all">
                <input
                  type="checkbox"
                  checked={
                    availableQuestions.length > 0 &&
                    selectedAvailable.length === availableQuestions.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAvailable(availableQuestions);
                    } else {
                      setSelectedAvailable([]);
                    }
                  }}
                />
                Select All
              </label>
              <span className="marks-label">Marks</span>
            </div>
          </div>
          <div className="questions-scroll">
            {availableQuestions.map((q) => (
              <div key={q.id} className="question-row">
                <label className="question">
                  <input
                    type="checkbox"
                    checked={selectedAvailable.includes(q)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAvailable([...selectedAvailable, q]);
                      } else {
                        setSelectedAvailable(
                          selectedAvailable.filter((item) => item !== q)
                        );
                      }
                    }}
                  />
                  <span className="question-text">{q.questionText}</span>
                </label>
                <span className="question-marks">{q.marks}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Buttons */}
        <div className="buttons">
          <button onClick={moveToExam} disabled={selectedAvailable.length === 0}>
            →
          </button>
          <button onClick={moveToAvailable} disabled={selectedExam.length === 0}>
            ←
          </button>
        </div>

        {/* Exam List */}
        <div className="list">
          <div className="questions-fixed">
            <h4 className="listbox-title">Exam Questions</h4>
            {/* Header Row */}
            <div className="list-header">
              <label className="question select-all">
                <input
                  type="checkbox"
                  checked={
                    examQuestions.length > 0 &&
                    selectedExam.length === examQuestions.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedExam(examQuestions);
                    } else {
                      setSelectedExam([]);
                    }
                  }}
                />
                Select All
              </label>
              <span className="marks-label">Marks</span>
            </div>
          </div>
          <div className="questions-scroll">
            {examQuestions.map((q) => (
              <div key={q.id} className="question-row">
                <label className="question">
                  <input
                    type="checkbox"
                    checked={selectedExam.includes(q)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedExam([...selectedExam, q]);
                      } else {
                        setSelectedExam(
                          selectedExam.filter((item) => item !== q)
                        );
                      }
                    }}
                  />
                  <span className="question-text">{q.questionText}</span>
                </label>
                <span className="question-marks">{q.marks}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionSelector;
