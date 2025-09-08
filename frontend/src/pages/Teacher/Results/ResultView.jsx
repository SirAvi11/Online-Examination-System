import { useState,useRef } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { Search, Funnel } from "react-bootstrap-icons";
import StudentResultView from "./StudentResultView";
import TeacherResultView from "./TeacherResultView";
import ResultViewFilterPane from "./ResultViewFilterPane";

import "./ResultView.css";

const ResultView = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  const [searchTerm, setSearchTerm] = useState("");
  const filterButtonRef = useRef();
  const [showFilterPane, setShowFilterPane] = useState(false);
  const [filters, setFilters] = useState({});

  // Handle applying filters
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilterPane(false);
  };

  return (
    <div className="container p-4" style={{position: "relative"}}>
      {/* 🏷️ Shared Header */}
      <div className="mb-4 d-flex flex-row gap-2 justify-content-between align-items-start" style={{position: "relative"}}>
        <div className="left-header">
          <h3>Exam Results</h3>
          <p className="text-muted">
            {role === "Student"
              ? "View your attempted exams and result insights."
              : "View completed exams you have conducted."}
          </p>
        </div>

        {/* Filter Button - Updated */}
        <div className='d-flex' style={{position: "relative"}}>
          <div ref={filterButtonRef}>
            <Button
              variant={Object.keys(filters).length > 0 ? "primary" : "outline-secondary"}
              onClick={() => setShowFilterPane(!showFilterPane)}
            >
              <i className="fa fa-filter me-2"></i>
              Filter
              {Object.keys(filters).length > 0 && (
                <span className="ms-1">•</span>
              )}
            </Button>
          </div>
        </div>
        
        {/* (Optional) Right-side buttons in future */}

        {/* Filter Pane */}
        {showFilterPane && (
          <ResultViewFilterPane
            onApply={handleApplyFilters}
            onClose={() => setShowFilterPane(false)}
          />
        )}
      </div>

      {/* 🔄 Role-specific Views */}
      {role === "Student" ? (
        <StudentResultView searchTerm={searchTerm} />
      ) : (
        <TeacherResultView searchTerm={searchTerm} />
      )}
    </div>
  );
};

export default ResultView;
