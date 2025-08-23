import {
  Card,
  Badge
} from "react-bootstrap";

const QuestionDetailRow = ({ question, index }) => {
  return (
    <tr>
      <td colSpan="5" className="p-0">
        <div className="p-3 bg-light">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">Q{index + 1}</h6>
                {question.image && <Badge bg="secondary">Has Image</Badge>}
              </div>
              <p className="mb-3">{question.questionText}</p>
              {question.imageUrl && (
                <img
                  src={`http://localhost:5000${question.imageUrl}`}
                  className="img-fluid rounded mb-3"
                  alt="Question illustration"
                  style={{
                    maxHeight: "200px",
                    width: "300px",
                    objectFit: "cover",
                  }}
                />
              )}
              <h6>Options:</h6>
              <ul>
                {question.options.map((opt, idx) => (
                  <li
                    key={idx}
                    className={
                      question.correctOptionIndex === idx
                        ? "fw-bold text-success"
                        : ""
                    }
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </div>
      </td>
    </tr>
  );
};

export default QuestionDetailRow;