import { useState } from "react";
import { Button} from "react-bootstrap";
import TransferList from "../../../components/TransferList/TransferList";
import "./QuestionSelector.css";
import AddQuestionModal from "../Modules/QuestionBank/AddQuestionModal";
import useQuestion from '../Modules/QuestionBank/hooks/useQuestion';

const QuestionSelector = ({ modules, examQuestions, onChange }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedExam, setSelectedExam] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const {isSaving, successInfo, addQuestion} = useQuestion("");
  
  const handleModuleChange = async (moduleId) => {
    setSelectedModule(moduleId);
    try {
      const res = await fetch(`/api/modules/${moduleId}/questions`, {
          headers: {
            "x-auth-token": localStorage.getItem("token")
          }
        });
      const data = await res.json();

      if (res.ok) {
        // Filter out questions that are already in examQuestions AND are not archived
        // Using !q.isArchived will handle both false and undefined values
        const filteredQuestions = data.filter(
          (q) => !examQuestions.some((eq) => eq._id === q._id) && !q.isArchived
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

  const handleAddQuestion = async (questionData) => {
    const savedQuestion = await addQuestion(questionData);

    //addQuestion does not return newly saved question id, so no id is given to new question in exam, thus cannot compare with available list
    
    if (savedQuestion) {
      // Add the newly saved question to exam questions
      onChange([...examQuestions, questionData]);
      return savedQuestion;
    }
    
    return null;
  };

  const moveToExam = () => {
    onChange([...examQuestions, ...selectedAvailable]);
    setAvailableQuestions(
      availableQuestions.filter((q) => !selectedAvailable.includes(q))
    );
    setSelectedAvailable([]);
  };

  const moveToAvailable = () => {
    setAvailableQuestions([...availableQuestions, ...selectedExam]);
    onChange(examQuestions.filter((q) => !selectedExam.includes(q)));
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

      <TransferList
        availableItems={availableQuestions} 
        setAvailableItems={setAvailableQuestions}
        selectedItems={selectedExam}
        setSelectedItems={setSelectedExam}
        showMarks
      />

      {/* Modals */}
      <AddQuestionModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleAddQuestion}
        isSaving={isSaving}
        successInfo={successInfo}
        modules={modules}
      />
    </div>
  );
};

export default QuestionSelector;
