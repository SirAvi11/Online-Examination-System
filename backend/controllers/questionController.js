// controllers/questionController.js
const Question = require("../models/Question.js");

// GET questions by moduleId
const getQuestions = async (req, res) => {
  const { moduleId } = req.query;
  if (!moduleId) return res.status(400).json({ message: "moduleId is required" });

  try {
    const questions = await Question.find({ moduleId });
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching questions" });
  }
};

// POST new question
const createQuestion = async (req, res) => {
  const { moduleId, paperId, questionText, options, correctOptionIndex, marks } = req.body;

  if (!moduleId || !questionText || !options || correctOptionIndex === undefined || !marks) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newQuestion = new Question({
      moduleId,
      paperId,
      questionText,
      options,
      correctOptionIndex,
      marks,
    });

    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error saving question" });
  }
};

// BULK DELETE questions
const bulkDeleteQuestions = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }
    await Question.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Questions deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getQuestions,
  createQuestion,
  bulkDeleteQuestions,
};
