import QuestionDetailRow from './QuestionDetailRow'; 
import React from 'react';
import {
  Button,
  Form
} from "react-bootstrap";

const QuestionRow = ({ question, index, isSelected, onSelect, onExpand, isExpanded }) => {
  return (
    <React.Fragment key={question._id}>
      <tr>
        <td>
          <Form.Check
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(question._id)}
          />
        </td>
        <td>{index + 1}</td>
        <td>{question.questionText}</td>
        <td>{question.options[question.correctOptionIndex]}</td>
        <td>
          <Button
            size="sm"
            variant="outline-info"
            onClick={() => onExpand(isExpanded ? null : index)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Hide" : "View"} Details
          </Button>
        </td>
      </tr>
      {isExpanded && (
        <QuestionDetailRow question={question} index={index} />
      )}
    </React.Fragment>
  );
};

export default QuestionRow;