// ExamView.jsx
import { useState } from "react";
import ManageExam from "./ManageExam";
import CreateExam from "./CreateExam";

const ExamView = () => {
  const [activeView, setActiveView] = useState("manage"); // default view

  return (
    <>
      {activeView === "manage" && <ManageExam onCreate={() => setActiveView("create")} />}
      {activeView === "create" && <CreateExam onBack={() => setActiveView("manage")} />}
    </>
  );
};

export default ExamView;
