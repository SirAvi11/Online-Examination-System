import { useRef } from "react";
import { Button } from "react-bootstrap";
import ResultViewFilterPane from "./ResultViewFilterPane";

const ResultHeader = ({
  role,
  filters,
  showFilterPane,
  setShowFilterPane,
  handleApplyFilters,
}) => {
  const filterButtonRef = useRef(null);

  return (
    <div
      className="mb-4 d-flex flex-row gap-2 justify-content-between align-items-start"
      style={{ position: "relative" }}
    >
      {/* Left Header */}
      <div className="left-header">
        <h3>Exam Results</h3>
        <p className="text-muted">
          {role === "Student"
            ? "View your attempted exams and result insights."
            : "View completed exams you have conducted."}
        </p>
      </div>

      {/* Filter Button */}
      <div className="d-flex" style={{ position: "relative" }}>
        <div ref={filterButtonRef}>
          <Button
            variant={Object.keys(filters).length > 0 ? "primary" : "outline-secondary"}
            onClick={() => setShowFilterPane(!showFilterPane)}
          >
            <i className="fa fa-filter me-2"></i>
            Filter
            {Object.keys(filters).length > 0 && <span className="ms-1">•</span>}
          </Button>
        </div>
      </div>

      {/* Filter Pane */}
      {showFilterPane && (
        <ResultViewFilterPane
          onApply={handleApplyFilters}
          onClose={() => setShowFilterPane(false)}
        />
      )}
    </div>
  );
};

export default ResultHeader;
