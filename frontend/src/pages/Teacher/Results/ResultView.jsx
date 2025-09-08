import StudentResultView from "./StudentResultView";
import TeacherResultView from "./TeacherResultView";

import "./ResultView.css";

const ResultView = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  
  return (
    <div className="container p-4" style={{position: "relative"}}>

      {/* 🔄 Role-specific Views */}
      {role === "Student" ? (
        <StudentResultView />
      ) : (
        <TeacherResultView />
      )}
    </div>
  );
};

export default ResultView;
