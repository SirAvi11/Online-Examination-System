import React, { useRef } from "react";
import { Button } from "react-bootstrap";

const ArchiveButton = ({ selectedQuestionIds }) => {
  const btnRef = useRef(null);

  const handleMouseEnter = () => {
    if (!selectedQuestionIds?.length && btnRef.current) {
      btnRef.current.classList.remove("btn-outline-light");
      btnRef.current.classList.add("btn-outline-secondary");
    }
  };

  const handleMouseLeave = () => {
    if (!selectedQuestionIds?.length && btnRef.current) {
      btnRef.current.classList.remove("btn-outline-secondary");
      btnRef.current.classList.add("btn-outline-light");
    }
  };

  return (
    <Button
      ref={btnRef}
      variant={selectedQuestionIds?.length > 0 ? "outline-secondary" : "outline-light"}
      className="archive-btn"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => console.log("Hidden button clicked")}
    >
      <i className="fa fa-folder me-2"></i>
      Archive
    </Button>
  );
};

export default ArchiveButton;
