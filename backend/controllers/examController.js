const Exam = require("../models/Exam");

// GET exams for logged-in teacher
const getExamsByTeacher = async (req, res) => {
  try {
    const teacherId = req.user.userId; 
    const exams = await Exam.find({ createdBy: teacherId })
      .sort({ startTime: 1 });

    res.status(200).json(exams);
  } catch (err) {
    console.error("❌ Error fetching exams:", err.message);
    res.status(500).json({ error: "Server error while fetching exams" });
  }
};

module.exports = { getExamsByTeacher };
