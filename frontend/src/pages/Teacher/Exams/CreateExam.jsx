import { useState, useEffect } from "react";
import QuestionSelector from "./QuestionSelector"; // Import the transfer-list component

const CreateExam = ({ onBack }) => {
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    duration: 60,
    totalMarks: 100,
    startTime: "",
    endTime: "",
    selectedQuestions: [],
  });

  const [modules, setModules] = useState([]); // store modules from backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch modules from backend
    const fetchModules = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/modules"); // adjust URL if needed
        if (!res.ok) throw new Error("Failed to fetch modules");
        const data = await res.json();
        setModules(data); // assuming backend returns array of modules
      } catch (err) {
        console.error("Error fetching modules:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionsChange = (questions) => {
    setExamData((prev) => ({ ...prev, selectedQuestions: questions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Exam Created:", examData);
    // TODO: API call to backend with examData
  };

  return (
    <div className="container py-4 px-4">
      <div className="d-flex align-items-center mb-3">
        <button className="btn btn-outline-secondary me-3" onClick={onBack}>
          <i
            className="fa fa-arrow-left me-2"
            style={{ cursor: "pointer", fontSize: "1.2rem" }}
          ></i>
        </button>
        <h1 className="h3 fw-bold m-0">Create Exam</h1>
      </div>

      {loading && <p>Loading modules...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="card p-4 shadow-sm mb-2">
          {/* Exam Title */}
          <div className="mb-3">
            <label className="form-label">Exam Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={examData.title}
              onChange={handleChange}
              placeholder="Enter exam title"
              required
            />
          </div>

          {/* Exam Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={examData.description}
              onChange={handleChange}
              placeholder="Enter exam description"
              rows="3"
            />
          </div>

          {/* Duration & Total Marks */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Duration (minutes)</label>
              <input
                type="number"
                className="form-control"
                name="duration"
                value={examData.duration}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Total Marks</label>
              <input
                type="number"
                className="form-control"
                name="totalMarks"
                value={examData.totalMarks}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          {/* Start & End Time */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Start Time</label>
              <input
                type="datetime-local"
                className="form-control"
                name="startTime"
                value={examData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">End Time</label>
              <input
                type="datetime-local"
                className="form-control"
                name="endTime"
                value={examData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          </div>
          <div className="card p-4 shadow-sm">
            {/* Question Selector Section */}
            <div>
              <h5 className="fw-bold mb-3">Select Questions</h5>
              <QuestionSelector onChange={handleQuestionsChange} modules={modules} />
            </div>
          </div>
          {/* Submit */}
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-primary px-4">
              Create Exam
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateExam;
