import { useState } from "react";

const QuestionSelector = ({ modules, onChange }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [examQuestions, setExamQuestions] = useState([]);

    const handleModuleChange = async (moduleId) => {
    setSelectedModule(moduleId);

    try {
        const res = await fetch(`/api/modules/${moduleId}/questions`);
        const data = await res.json();

        if (res.ok) {
        setAvailableQuestions(data);
        } else {
        setAvailableQuestions([]);
        }
    } catch (err) {
        console.error("Error fetching questions:", err);
        setAvailableQuestions([]);
    }
    };


  const addToExam = (question) => {
    setExamQuestions([...examQuestions, question]);
    setAvailableQuestions(availableQuestions.filter(q => q.id !== question.id));
  };

  const removeFromExam = (question) => {
    setAvailableQuestions([...availableQuestions, question]);
    setExamQuestions(examQuestions.filter(q => q.id !== question.id));
  };

  const addCustomQuestion = (custom) => {
    const newQuestion = { id: Date.now(), ...custom, type: "custom" };
    setExamQuestions([...examQuestions, newQuestion]);
  };

  return (
    <div className="question-selector">
      {/* Module Dropdown */}
      <select onChange={(e) => handleModuleChange(e.target.value)}>
        <option value="">Select Module</option>
        {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
      </select>

      <div className="transfer-list">
        <div className="list">
          <h4>Available Questions</h4>
          {availableQuestions.map(q => (
            <div key={q.id} className="question">
              <span>{q.text}</span>
              <button onClick={() => addToExam(q)}>Add →</button>
            </div>
          ))}
        </div>

        <div className="list">
          <h4>Exam Questions</h4>
          {examQuestions.map(q => (
            <div key={q.id} className="question">
              <span>{q.text}</span>
              <button onClick={() => removeFromExam(q)}>← Remove</button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => addCustomQuestion({
        text: "New Custom Question",
        options: ["A","B","C","D"],
        correct: 1,
        marks: 2
      })}>
        + Add Custom Question
      </button>
    </div>
  );
};

export default QuestionSelector;
