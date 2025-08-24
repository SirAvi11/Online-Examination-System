import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import useQuestion from "./hooks/useQuestion";

const ArchiveButton = ({ selectedQuestionIds, toggleArchiveQuestions, setSelectedQuestionIds }) => {

  const buttonRef = useRef();

  const handleArchiveClick = () =>{
    toggleArchiveQuestions(selectedQuestionIds, true);
    setSelectedQuestionIds([]);
  }

  return (
    <Button
      ref={buttonRef}
      variant={selectedQuestionIds?.length > 0 ? "outline-secondary" : "outline-secondary d-none"}
      onClick={handleArchiveClick}
    >
      <i className="fa fa-folder me-2"></i>
      Archive
    </Button>
  );
};

export default ArchiveButton;
