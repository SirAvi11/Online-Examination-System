// StudentTable.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./StudentTable.css";

const StudentTable = ({ students }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("attended"); // attended | absent
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }
    return 0;
  });

  // Filtering
  const filteredStudents = sortedStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "Passed" && s.status === "Passed") ||
      (statusFilter === "Failed" && s.status === "Failed");

    const matchesGrade =
      gradeFilter === "all" || gradeFilter === s.grade;

    const matchesTab =
      activeTab === "attended" ? s.attended === true : s.attended === false;

    return matchesSearch && matchesStatus && matchesGrade && matchesTab;
  });

  const attendedCount = students.filter((s) => s.attended).length;
  const absentCount = students.filter((s) => !s.attended).length;

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <i className="fas fa-chevron-down ms-1"></i>;
    return sortConfig.direction === "asc" ? (
      <i className="fas fa-chevron-up ms-1 text-primary"></i>
    ) : (
      <i className="fas fa-chevron-down ms-1 text-primary"></i>
    );
  };

  return (
    <div className="container-fluid px-0">
      {/* Tabs */}
      <div className="d-flex align-items-center gap-4 mb-4 nav-fake">
        <div
          className={`d-flex align-items-center gap-1 ${
            activeTab === "attended" ? "active-tab" : "inactive"
          }`}
          onClick={() => setActiveTab("attended")}
        >
          <span>Attended</span>
          <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
            ({attendedCount})
          </span>
        </div>
        <div
          className={`d-flex align-items-center gap-1 ${
            activeTab === "absent" ? "active-tab" : "inactive"
          }`}
          onClick={() => setActiveTab("absent")}
        >
          <span>Absent</span>
          <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
            ({absentCount})
          </span>
        </div>
      </div>

      {/* Filters */}
      <form
        className="row g-3 align-items-center mb-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="col-auto">
          <div className="input-group search-input">
            <input
              type="text"
              className="form-control"
              placeholder="Search name or e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="submit">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div className="col-auto">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Status: all</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        <div className="col-auto">
          <select
            className="form-select"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
          >
            <option value="all">Grade: all</option>
            <option value="Excellent">Excellent</option>
            <option value="Average">Average</option>
            <option value="Poor">Poor</option>
          </select>
        </div>
      </form>

      {/* Table */}
      <div className="table-responsive">
        <table className="table align-middle text-nowrap">
          <thead>
            <tr
              className="text-secondary fw-semibold"
              style={{ fontSize: "0.875rem" }}
            >
              <th scope="col" className="ps-4" onClick={() => handleSort("name")}>
                Student name {renderSortIcon("name")}
              </th>
              <th scope="col" onClick={() => handleSort("status")}>
                Passed / Failed {renderSortIcon("status")}
              </th>
              <th scope="col" onClick={() => handleSort("scoreValue")}>
                Score {renderSortIcon("scoreValue")}
              </th>
              <th scope="col" onClick={() => handleSort("grade")}>
                Grade {renderSortIcon("grade")}
              </th>
              <th scope="col" onClick={() => handleSort("timeSpentValue")}>
                Time Spent {renderSortIcon("timeSpentValue")}
              </th>
              <th scope="col" onClick={() => handleSort("submittedAt")}>
                Submitted / Timeout {renderSortIcon("submittedAt")}
              </th>
              <th scope="col" className="pe-4">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td className="ps-4 d-flex align-items-center">
                  <img
                    src={student.img}
                    alt={student.name}
                    className="student-img"
                  />
                  {student.name}
                </td>
                <td>
                  <span
                    className={
                      student.status === "Passed"
                        ? "badge-passed"
                        : "badge-failed"
                    }
                  >
                    {student.status}
                  </span>
                </td>
                <td>
                  <span className={`score-${student.scoreColor}`}>
                    {student.score}
                  </span>
                </td>
                <td>
                  <span className={`grade-${student.gradeColor}`}>
                    {student.grade}
                  </span>
                </td>
                <td>{student.timeSpent}</td>
                <td>{student.submittedAt}</td>
                <td className="pe-4">
                  <a
                    href="#"
                    className="text-primary text-decoration-none fw-semibold"
                  >
                    See Detail
                  </a>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
