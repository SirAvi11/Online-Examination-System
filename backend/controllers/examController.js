const Exam = require("../models/Exam");
const Question = require("../models/Question");

// GET exams for logged-in teacher
const getExamsByTeacher = async (req, res) => {
  try {
    const teacherId = req.user.userId; 
    const exams = await Exam.find({ createdBy: teacherId })
      .populate('questions.questionRef')
      .sort({ startTime: 1 });

    res.status(200).json(exams);
  } catch (err) {
    console.error("❌ Error fetching exams:", err.message);
    res.status(500).json({ error: "Server error while fetching exams" });
  }
};

// CREATE a new exam
const createExam = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    
    // Validate required fields
    const { title, startTime, endTime, duration, questions } = req.body;
    
    if (!title || !startTime || !endTime || !duration) {
      return res.status(400).json({ 
        error: "Title, start time, end time, and duration are required" 
      });
    }

    // Validate questions array
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ 
        error: "At least one question is required" 
      });
    }

    // Calculate total marks and questions
    let totalMarks = 0;
    let totalQuestions = questions.length;

    // For existing questions, verify they exist and get their marks
    for (const question of questions) {
      if (question.type === "existing") {
        const existingQuestion = await Question.findById(question.questionRef);
        if (!existingQuestion) {
          return res.status(400).json({ 
            error: `Question with ID ${question.questionRef} not found` 
          });
        }
        totalMarks += existingQuestion.marks;
      } else if (question.type === "custom") {
        if (!question.customQuestion || !question.customQuestion.marks) {
          return res.status(400).json({ 
            error: "Custom questions must have marks specified" 
          });
        }
        totalMarks += question.customQuestion.marks;
      }
    }

    // Generate unique exam code if not provided
    const examCode = req.body.examCode || generateExamCode();

    // Create exam object
    const examData = {
      ...req.body,
      createdBy: teacherId,
      totalMarks,
      totalQuestions,
      examCode,
    };

    // Save exam to database
    const newExam = new Exam(examData);
    const savedExam = await newExam.save();

    // Populate the saved exam with question details for response
    await savedExam.populate([
      { path: 'questions.questionRef', model: 'Question' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.status(201).json({
      message: "Exam created successfully",
      exam: savedExam
    });

  } catch (err) {
    console.error("❌ Error creating exam:", err.message);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: Object.values(err.errors).map(e => e.message).join(', ') 
      });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: "Exam code already exists" 
      });
    }
    
    res.status(500).json({ error: "Server error while creating exam" });
  }
};

// Helper function to generate unique exam code
const generateExamCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

module.exports = { getExamsByTeacher, createExam };