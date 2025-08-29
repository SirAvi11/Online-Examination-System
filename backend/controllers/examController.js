const Exam = require("../models/Exam");
const Question = require("../models/Question");
const ExamRegistration = require('../models/ExamRegistration');
const StudentAttempt = require('../models/StudentAttempt');

// GET exams for logged-in teacher
const getExamsByTeacher = async (req, res) => {
  try {
    const teacherId = req.user.userId; 
    const exams = await Exam.find({ createdBy: teacherId })
      .populate('questions.questionRef')
      .sort({ startTime: 1 });

    // Manually update status for each exam to ensure it's current
    const now = new Date();
    const updatedExams = exams.map(exam => {
      // Create a plain object to avoid mongoose document issues
      const examObj = exam.toObject();
      
      if (now < exam.startTime) {
        examObj.status = "Upcoming";
      } else if (now >= exam.startTime && now <= exam.endTime) {
        examObj.status = "In Progress";
      } else if (now > exam.endTime) {
        examObj.status = "Completed";
      }
      
      return examObj;
    });

    // Define the sorting order for statuses
    const statusOrder = {
      "In Progress": 1,
      "Upcoming": 2,
      "Completed": 3,
      "Canceled": 4
    };

    // Sort exams by status priority and then by start time
    const sortedExams = updatedExams.sort((a, b) => {
      // First, sort by status priority
      const statusComparison = statusOrder[a.status] - statusOrder[b.status];
      
      if (statusComparison !== 0) {
        return statusComparison;
      }
      
      // If same status, sort by start time
      // For "In Progress" and "Upcoming", sort ascending (earliest first)
      // For "Completed" and "Canceled", sort descending (most recent first)
      if (a.status === "In Progress" || a.status === "Upcoming") {
        return new Date(a.startTime) - new Date(b.startTime);
      } else {
        return new Date(b.startTime) - new Date(a.startTime);
      }
    });

    res.status(200).json(sortedExams);
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

    // Validate dates
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const now = new Date();

    if (startDate >= endDate) {
      return res.status(400).json({ 
        error: "End time must be after start time" 
      });
    }

    if (endDate <= now) {
      return res.status(400).json({ 
        error: "End time must be in the future" 
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

    // Determine initial status based on current time
    let status = "Upcoming";
    const nowTime = new Date();
    if (nowTime >= startDate && nowTime <= endDate) {
      status = "In Progress";
    } else if (nowTime > endDate) {
      status = "Completed";
    }

    // Create exam object
    const examData = {
      ...req.body,
      createdBy: teacherId,
      totalMarks,
      totalQuestions,
      examCode,
      status, // Add the status field
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

// GET single exam by ID
const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findOne({ _id: id})
      .populate('questions.questionRef')
      .populate('createdBy', 'name email');

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Update status in real-time
    const now = new Date();
    if (now < exam.startTime) {
      exam.status = "Upcoming";
    } else if (now >= exam.startTime && now <= exam.endTime) {
      exam.status = "In Progress";
    } else if (now > exam.endTime) {
      exam.status = "Completed";
    }

    // Save the updated status if it changed
    if (exam.isModified('status')) {
      await exam.save();
    }

    res.status(200).json(exam);
  } catch (err) {
    console.error("❌ Error fetching exam:", err.message);
    res.status(500).json({ error: "Server error while fetching exam" });
  }
};

// UPDATE exam
const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.userId;
    const updateData = { ...req.body };

    // Find the exam first
    const exam = await Exam.findOne({ _id: id, createdBy: teacherId });
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // If dates are being updated, recalculate status
    if (updateData.startTime || updateData.endTime) {
      const startTime = updateData.startTime ? new Date(updateData.startTime) : exam.startTime;
      const endTime = updateData.endTime ? new Date(updateData.endTime) : exam.endTime;
      const now = new Date();

      if (now < startTime) {
        updateData.status = "Upcoming";
      } else if (now >= startTime && now <= endTime) {
        updateData.status = "In Progress";
      } else if (now > endTime) {
        updateData.status = "Completed";
      }
    }

    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('questions.questionRef');

    res.status(200).json({
      message: "Exam updated successfully",
      exam: updatedExam
    });
  } catch (err) {
    console.error("❌ Error updating exam:", err.message);
    res.status(500).json({ error: "Server error while updating exam" });
  }
};

// DELETE exam
const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.userId;

    const exam = await Exam.findOneAndDelete({ _id: id, createdBy: teacherId });
    
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting exam:", err.message);
    res.status(500).json({ error: "Server error while deleting exam" });
  }
};

// Helper function to generate unique exam code
const generateExamCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const startExamAttempt = async (req, res) => {
  try {
    const { examId } = req.params;
    const studentId = req.user.userId;
    
    // Check if registered
    const registration = await ExamRegistration.findOne({
      studentId,
      examId
    });
    
    if (!registration) {
      return res.status(404).json({ error: 'Not registered for this exam' });
    }
    
    // Check if already attempted
    if (registration.status === 'attempted' || registration.status === 'completed') {
      return res.status(400).json({ error: 'Already attempted this exam' });
    }
    
    // Get exam details
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    // Check if exam is available
    const now = new Date();
    if (now < exam.startTime || now > exam.endTime) {
      return res.status(400).json({ error: 'Exam is not currently available' });
    }
    
    // Create new attempt
    const attempt = new StudentAttempt({
      studentId,
      examId,
      totalMarks: exam.totalMarks,
      duration: exam.duration,
      status: 'in_progress'
    });
    
    await attempt.save();
    
    // Update registration with attempt reference
    registration.attemptId = attempt._id;
    registration.status = 'attempted';
    await registration.save();
    
    res.status(200).json({ attempt, exam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  getExamsByTeacher, 
  createExam, 
  getExamById, 
  updateExam, 
  deleteExam,
  startExamAttempt
};