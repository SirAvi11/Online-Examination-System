// controllers/questionController.js
const Question = require("../models/Question.js");

// GET questions by moduleId
const getQuestions = async (req, res) => {
  const { moduleId } = req.query;
  if (!moduleId) return res.status(400).json({ message: "moduleId is required" });

  try {
    const questions = await Question.find({ moduleId, isArchived: false }); // default only active
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching questions" });
  }
};

// POST new question
const createQuestion = async (req, res) => {
  try {
    const { paperId, moduleId, questionText, options, correctOptionIndex, marks } = req.body;

    const question = new Question({
      paperId: paperId || null,
      moduleId,
      questionText,
      options: JSON.parse(options), // comes as stringified array in FormData
      correctOptionIndex,
      marks,
      imageUrl: req.file ? `/uploads/questions/${req.file.filename}` : null
    });

    const saved = await question.save();
    res.json(saved);
  } catch (err) {
    console.error("Error saving question:", err);
    res.status(500).json({ error: "Failed to save question" });
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

const toggleArchiveQuestions = async (req, res) => {
  try {
    const { questionIds, archive } = req.body;

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: "No questionIds provided" });
    }

    await Question.updateMany(
      { _id: { $in: questionIds } },
      { $set: { isArchived: archive } }
    );

    res.json({
      message: `Questions ${archive ? "archived" : "unarchived"} successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch with archived filter
const getArchivedQuestions = async (req, res) => {
  try {
    const { archived } = req.query; // ?archived=true or ?archived=false
    const filter = {};

    if (archived === "true") filter.isArchived = true;
    if (archived === "false") filter.isArchived = false;

    const questions = await Question.find(filter);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getQuestions,
  createQuestion,
  bulkDeleteQuestions,
  toggleArchiveQuestions,
  getArchivedQuestions
};
