// StudentTable.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./StudentTable.css"; // your custom CSS extracted from <style>

const StudentTable = ({ students }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "Passed" && s.status === "Passed") ||
      (statusFilter === "Failed" && s.status === "Failed");

    const matchesGrade =
      gradeFilter === "all" || gradeFilter === s.grade;

    return matchesSearch && matchesStatus && matchesGrade;
  });

  return (
    <div className="container-fluid px-0">
      {/* Tabs */}
      <div className="d-flex align-items-center gap-3 mb-4 nav-fake">
        <div className="active d-flex align-items-center gap-1">
          <span>Attended</span>
          <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
            ({students.filter((s) => s.attended).length})
          </span>
        </div>
        <div className="inactive d-flex align-items-center gap-1">
          <span>Absent</span>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
            ({students.filter((s) => !s.attended).length})
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
              <th scope="col" className="ps-4">
                Student name <i className="fas fa-chevron-down"></i>
              </th>
              <th scope="col">
                Passed / Failed <i className="fas fa-chevron-down"></i>
              </th>
              <th scope="col">
                Score <i className="fas fa-chevron-down"></i>
              </th>
              <th scope="col">
                Grade <i className="fas fa-chevron-down"></i>
              </th>
              <th scope="col">
                Time Spent <i className="fas fa-chevron-down"></i>
              </th>
              <th scope="col">
                Submitted / Timeout <i className="fas fa-chevron-down"></i>
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
                  <span
                    className={
                      student.scoreColor === "green"
                        ? "score-green"
                        : student.scoreColor === "blue"
                        ? "score-blue"
                        : "score-red"
                    }
                  >
                    {student.score}
                  </span>
                </td>
                <td>
                  <span
                    className={
                      student.gradeColor === "green"
                        ? "grade-green"
                        : student.gradeColor === "blue"
                        ? "grade-blue"
                        : "grade-red"
                    }
                  >
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
