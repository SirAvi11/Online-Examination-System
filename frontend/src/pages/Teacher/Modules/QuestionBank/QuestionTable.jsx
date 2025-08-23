import QuestionRow from './QuestionRow';
import {
  Table,
  Form,
} from "react-bootstrap";

const QuestionTable = ({ questions, selectedQuestionIds, onSelect, onSelectAll, onExpand, expandedRow }) => {
  return (
    <Table striped bordered hover responsive>
      <thead className="table-light">
        <tr>
          <th style={{ width: "40px" }}>
            <Form.Check
              type="checkbox"
              checked={selectedQuestionIds.length === questions.length && questions.length > 0}
              onChange={onSelectAll}
            />
          </th>
          <th style={{ width: "50px" }}>#</th>
          <th>Question</th>
          <th>Answer</th>
          <th style={{ width: "120px" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((q, i) => (
          <QuestionRow 
            key={q._id} 
            question={q} 
            index={i}
            isSelected={selectedQuestionIds.includes(q._id)}
            onSelect={onSelect}
            onExpand={onExpand}
            isExpanded={expandedRow === i}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default QuestionTable;