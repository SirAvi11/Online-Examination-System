import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ExamSubmissionModal from "./ExamSubmissionModal";
import './ExamWindow.css'

// Utility to parse query params
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ExamWindow = () => {
  const query = useQuery();
  const examId = query.get("examId");
  const token = query.get("token");

  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // ✅ Track answers and statuses
  const [answers, setAnswers] = useState([]);

  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 30,
    seconds: 0
  });

  // Fetch exam data
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/exams/${examId}`, {
          headers: { 'x-auth-token': token },
        });
        if (!res.ok) throw new Error("Failed to load exam");
        const data = await res.json();
        setExam(data);

        // ✅ Initialize states: Q1 active, rest not-attempted
        const initialAnswers = data.questions.map((q, i) => ({
          answer: '',
          state: i === 0 ? 'active' : 'not-attempted'
        }));
        setAnswers(initialAnswers);
      } catch (err) {
        console.error(err);
        setExam(null);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId, token]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            } else {
              clearInterval(timer);
              alert("Time is up! Your exam will be submitted automatically.");
              return { hours: 0, minutes: 0, seconds: 0 };
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
        <span className="visually-hidden">Loading exam...</span>
      </div>
    </div>
  );
  
  if (!exam) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <div className="alert alert-danger" style={{fontSize: '1.2rem', padding: '1.5rem'}}>
        Failed to load exam. Please try again.
      </div>
    </div>
  );

  const question = exam.questions[currentQ].questionRef;

  // ✅ Selecting an option (preserves review state)
  const handleAnswer = (index, option) => {
    setAnswers(prev => {
      const updated = [...prev];
      // Toggle the answer if the same option is clicked again
      const newAnswer = updated[index].answer === option ? '' : option;
      
      // Preserve the review state if it exists
      const currentState = updated[index].state;
      const newState = newAnswer 
        ? (currentState === 'review' ? 'review' : 'answered') 
        : (currentState === 'review' ? 'review' : 'not-answered');
      
      updated[index] = { 
        ...updated[index], 
        answer: newAnswer,
        state: newState
      };
      return updated;
    });
  };

  // ✅ Toggle Mark for Review - now toggles between review and answered states
  const handleMarkReview = (index) => {
    setAnswers(prev => {
      const updated = [...prev];
      // Toggle between review and answered states
      if (updated[index].state === 'review') {
        updated[index] = {
          ...updated[index],
          state: updated[index].answer ? 'answered' : 'not-answered'
        };
      } else {
        updated[index] = {
          ...updated[index],
          state: 'review'
        };
      }
      return updated;
    });
  };

  // ✅ Check if mark for review should be disabled
  const isMarkReviewDisabled = () => {
    return !answers[currentQ]?.answer;
  };

  // ✅ Get button text based on current state
  const getMarkReviewButtonText = () => {
    return answers[currentQ]?.state === 'review' ? 'Unmark Review' : 'Mark for Review';
  };

  // ✅ Navigation button colors - active state takes priority
  const getButtonColor = (idx) => {
    const state = answers[idx]?.state;
    
    // If this is the current question, always show as active (blue)
    if (idx === currentQ) {
      return 'legend-current';
    }
    
    // For other questions, use their actual state
    switch (state) {
      case 'answered': return 'legend-answered';
      case 'not-answered': return 'legend-not-answered';
      case 'review': return 'legend-review';
      case 'not-attempted': return 'legend-not-attempted';
      default: return 'legend-not-attempted';
    }
  };

  const formatTime = (value) => value < 10 ? `0${value}` : value;

  // ✅ Handle clicking a question box (preserves review state)
  const handleQuestionNavigation = (index) => {
    setAnswers(prev => {
      const updated = prev.map((ans, i) => {
        if (i === currentQ) {
          // Update state based on whether an answer is selected, but preserve review state
          if (ans.state !== 'review') {
            ans.state = ans.answer ? 'answered' : 'not-answered';
          }
        }
        if (i === index && ans.state != 'review') {
          ans.state = 'active';
        }
        return ans;
      });
      return [...updated];
    });
    setCurrentQ(index);
  };

  // ✅ Next / Prev buttons (preserves review state)
  const handleNextQuestion = () => {
    if (currentQ < exam.questions.length - 1) {
      // Update the current question state before moving
      setAnswers(prev => {
        const updated = [...prev];
        if (updated[currentQ].state !== 'review') {
          updated[currentQ] = {
            ...updated[currentQ],
            state: updated[currentQ].answer ? 'answered' : 'not-answered'
          };
        }
        return updated;
      });
      
      // Move to next question and set it as active
      setCurrentQ(currentQ + 1);
      setAnswers(prev => {
        const updated = [...prev];
        if(updated[currentQ + 1].state != 'review'){
          updated[currentQ + 1].state = 'active';
        }
        return updated;
      });
    }
  };

  const handlePrevQuestion = () => {
    if (currentQ > 0) {
      // Update the current question state before moving
      setAnswers(prev => {
        const updated = [...prev];
        if (updated[currentQ].state !== 'review') {
          updated[currentQ] = {
            ...updated[currentQ],
            state: updated[currentQ].answer ? 'answered' : 'not-answered'
          };
        }
        return updated;
      });
      
      // Move to previous question and set it as active
      setCurrentQ(currentQ - 1);
      setAnswers(prev => {
        const updated = [...prev];
        if(updated[currentQ - 1].state != 'review'){
          updated[currentQ - 1].state = 'active';
        }
        return updated;
      });
    }
  };

  const handleSubmitTest = () => {
    setShowSubmitModal(true);
  };

  return (
    <div className="d-flex flex-column vh-100 bg-secondary">
      <div className="container-fluid flex-grow-1 p-0 bg-white d-flex flex-column flex-md-row" style={{maxWidth: '100%'}}>
        
        {/* Left main content */}
        <div className="flex-grow-1 d-flex flex-column">
          {/* Header */}
          <div className="header border-bottom text-center py-3">
            <h4 className="m-0">{exam.title} - CAT Preparation</h4>
          </div>
          
          {/* Question content */}
          <div className="p-4 flex-grow-1">
            <h2 className="question-title">Question {currentQ + 1} of {exam.questions.length}</h2>
            <p className="question-text">{question.questionText}</p>
            
            <form className="d-flex flex-column gap-4" style={{ maxWidth: '700px' }}>
              {question?.options?.map((opt, idx) => (
                <label key={idx} className="option-label d-flex align-items-center">
                  <input
                    type="radio"
                    className="option-checkbox me-3"
                    name={question.id}
                    value={opt}
                    checked={answers[currentQ]?.answer === opt}
                    onChange={() => handleAnswer(currentQ, opt)}
                  />
                  <span className="fs-6">{String.fromCharCode(65 + idx)}. {opt}</span>
                </label>
              ))}
            </form>
          </div>
          
          {/* Footer buttons and legend */}
          <div className="footer border-top d-flex flex-column flex-md-row align-items-center justify-content-between px-4 py-4 gap-3 gap-md-0">
            <div className="d-flex gap-3">
              {/* Disable mark for review if no option is selected */}
              <button 
                type="button" 
                className="btn-mark-review" 
                onClick={() => handleMarkReview(currentQ)}
                disabled={isMarkReviewDisabled()}
              >
                {getMarkReviewButtonText()}
              </button>
              <button type="button" className="btn-prev-next" disabled={currentQ === 0} onClick={handlePrevQuestion}>
                Previous
              </button>
              <button type="button" className="btn-prev-next" disabled={currentQ === exam.questions.length - 1} onClick={handleNextQuestion}>
                Next
              </button>
            </div>
            <button type="button" className="btn-submit" onClick={handleSubmitTest}>
              Submit Test
            </button>
          </div>
          
          {/* Legend */}
          <div className="legend border-top d-flex flex-wrap justify-content-center gap-5 py-3 px-4 text-center text-nowrap">
            <div className="legend-item d-flex align-items-center gap-2">
              <span className="legend-color legend-current"></span>Current
            </div>
            <div className="legend-item d-flex align-items-center gap-2">
              <span className="legend-color legend-not-attempted"></span>Not Attempted
            </div>
            <div className="legend-item d-flex align-items-center gap-2">
              <span className="legend-color legend-answered"></span>Answered
            </div>
            <div className="legend-item d-flex align-items-center gap-2">
              <span className="legend-color legend-not-answered"></span>Not Answered
            </div>
            <div className="legend-item d-flex align-items-center gap-2">
              <span className="legend-color legend-review"></span>Review
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="d-flex flex-column border-start" style={{ width: '320px', backgroundColor: 'white' }}>
          {/* Time Left */}
          <div className="time-left border-bottom p-4">
  <div className="fs-5 mb-2">
    Time Left <i className="fas fa-clock ms-2"></i>
  </div>
  <div className="d-flex justify-content-end align-items-center gap-3 text-black fs-3">
    
    {/* Hours */}
    <div className="text-center">
      <div className="time-values">{formatTime(timeLeft.hours)}</div>
      <div className="time-label fs-6">hours</div>
    </div>

    {/* Colon */}
    <div className="fw-bold mb-3">:</div>

    {/* Minutes */}
    <div className="text-center">
      <div className="time-values">{formatTime(timeLeft.minutes)}</div>
      <div className="time-label fs-6">minutes</div>
    </div>

    {/* Colon */}
    <div className="fw-bold mb-3">:</div>

    {/* Seconds */}
    <div className="text-center">
      <div className="time-values">{formatTime(timeLeft.seconds)}</div>
      <div className="time-label fs-6">seconds</div>
    </div>
  </div>
</div>


          {/* Questions section */}
          <div>
            <div className="sidebar-header border-bottom py-3">
              <h5 className="m-0">Questions</h5>
            </div>
            <div className="p-4 d-grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)', fontSize: '14px', userSelect: 'none' }}>
              {exam.questions.map((q, idx) => {
                const colorClass = getButtonColor(idx);
                return (
                  <button
                    key={q.id}
                    type="button"
                    className={`btn-quant ${colorClass}`}
                    onClick={() => handleQuestionNavigation(idx)}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <ExamSubmissionModal 
          show={showSubmitModal} 
          exam={exam}
          answers={answers} 
          onClose={() => setShowSubmitModal(false)} 
        />
      </div>
    </div>
  );
};

export default ExamWindow;