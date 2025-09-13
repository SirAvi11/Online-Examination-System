import { useState, useEffect } from "react";
import { Dropdown, DropdownButton, Table, Button, Nav } from "react-bootstrap";
import SuccessNotification from "../../Teacher/Modules/QuestionBank/SuccessNotification";
import "./SystemUsersView.css";

const SystemUsersView = () => {
  const [roleFilter, setRoleFilter] = useState("Teachers");
  const [statusTab, setStatusTab] = useState("Active");
  const [users, setUsers] = useState([]);   // <-- fetched data
  const [loading, setLoading] = useState(true);
  const [successInfo, setSuccessInfo] = useState({ show: false, message: "" });


  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users");
        const data = await res.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on role + status
  const filteredUsers = users.filter((u) => {
    if (roleFilter === "Teachers") {
      return u.role === "Teacher" && u.status === statusTab;
    }
    if (roleFilter === "Students") {
      return u.role === "Student" && u.status === "Active";
    }
    return false;
  });

  const counts = {
    activeTeachers: users.filter((u) => u.role === "Teacher" && u.status === "Active").length,
    underReviewTeachers: users.filter((u) => u.role === "Teacher" && u.status === "Under Review").length,
    rejectedTeachers: users.filter((u) => u.role === "Teacher" && u.status === "Rejected").length,
    activeStudents: users.filter((u) => u.role === "Student" && u.status === "Active").length,
  };

 const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });

      // Show notification
      setSuccessInfo({ show: true, message: "Teacher approved successfully!" });

      // Refresh users after short delay (optional)
      setTimeout(async () => {
        const res = await fetch("http://localhost:5000/api/users");
        setUsers(await res.json());
      }, 500); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await fetch(`http://localhost:5000/api/users/${id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      });

      // Show notification
      setSuccessInfo({ show: true, message: "Teacher rejected successfully!" });

      setTimeout(async () => {
        const res = await fetch("http://localhost:5000/api/users");
        setUsers(await res.json());
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="teacher-dashboard container-fluid flex-grow-1">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold m-0">System Users</h1>
        <DropdownButton
          id="role-filter"
          title={roleFilter}
          onSelect={(val) => {
            if (val) {
              setRoleFilter(val);
              setStatusTab("Active");
            }
          }}
        >
          <Dropdown.Item eventKey="Teachers">Teachers</Dropdown.Item>
          <Dropdown.Item eventKey="Students">Students</Dropdown.Item>
        </DropdownButton>
      </div>

      {/* Status Tabs */}
      <div className="mb-3">
        {roleFilter === "Teachers" ? (
          <Nav
            variant="tabs"
            activeKey={statusTab}
            onSelect={(k) => setStatusTab(k)}
          >
            <Nav.Item>
              <Nav.Link eventKey="Active">Active ({counts.activeTeachers})</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Under Review">Under Review ({counts.underReviewTeachers})</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Rejected">Rejected ({counts.rejectedTeachers})</Nav.Link>
            </Nav.Item>
          </Nav>
        ) : (
          <Nav variant="tabs" activeKey="Active">
            <Nav.Item>
              <Nav.Link eventKey="Active">Active ({counts.activeStudents})</Nav.Link>
            </Nav.Item>
          </Nav>
        )}
      </div>

      {/* Users Table */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="table-container">
          <Table bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th style={{ position: "sticky", top: 0, background: "#f8f9fa", zIndex: 1 }}>Name</th>
                <th style={{ position: "sticky", top: 0, background: "#f8f9fa", zIndex: 1 }}>Email</th>
                <th style={{ position: "sticky", top: 0, background: "#f8f9fa", zIndex: 1 }}>Role</th>
                <th style={{ position: "sticky", top: 0, background: "#f8f9fa", zIndex: 1 }}>Status</th>
                <th style={{ position: "sticky", top: 0, background: "#f8f9fa", zIndex: 1 }}>Registered On</th>
                <th style={{ position: "sticky", top: 0, background: "#f8f9fa", zIndex: 1, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        {user.status || "Under Review"}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString("en-GB")}</td>
                    <td style={{ textAlign: "center" }}>
                      {roleFilter === "Teachers" &&
                      (user.status === "Under Review" || !user.status) ? (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            className="me-2"
                            onClick={() => handleApprove(user._id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleReject(user._id)}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline-primary">
                          View
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      <SuccessNotification 
        successInfo={successInfo} 
        onClose={() => setSuccessInfo({ show: false, message: "" })} 
      />

    </div>
  );
};

export default SystemUsersView;
