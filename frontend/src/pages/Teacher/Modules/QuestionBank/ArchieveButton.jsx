import React, { useRef } from "react";
import { Button } from "react-bootstrap";

const ArchiveButton = ({ selectedQuestionIds }) => {

  const buttonRef = useRef();

  const handleArchiveClick = () =>{
    
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
