import React, { useRef } from "react";
import { Button } from "react-bootstrap";

const ArchiveButton = ({ selectedQuestionIds }) => {

  const handleArchiveClick = () =>{
    
  }
  return (
    <Button
      variant={selectedQuestionIds?.length > 0 ? "outline-secondary" : "outline-light"}
      className="archive-btn"
      onClick={handleArchiveClick}
    >
      <i className="fa fa-folder me-2"></i>
      Archive
    </Button>
  );
};

export default ArchiveButton;
