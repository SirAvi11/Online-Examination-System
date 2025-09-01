// controllers/questionController.js
const Question = require("../models/Question.js");
const Module = require("../models/Module.js");

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
  try {
    console.log("Full request body:", req.body);
    console.log("Request file:", req.file);

    const { paperId, moduleId, questionText, options, correctOptionIndex, marks } = req.body;

    // Handle different representations of null/empty values
    let validatedModuleId = null;
    if (moduleId && moduleId !== "null" && moduleId !== "undefined" && moduleId !== "") {
      validatedModuleId = moduleId;
    }

    // Check if options is provided
    if (!options) {
      return res.status(400).json({ error: "Options field is required" });
    }

    // Parse options safely
    let parsedOptions;
    try {
      parsedOptions = JSON.parse(options);
    } catch (parseError) {
      console.error("Error parsing options:", parseError);
      return res.status(400).json({ error: "Invalid options format. Must be valid JSON." });
    }

    // Validate that parsedOptions is an array
    if (!Array.isArray(parsedOptions)) {
      return res.status(400).json({ error: "Options must be an array" });
    }

    const question = new Question({
      paperId: paperId || null,
      moduleId: validatedModuleId,
      questionText,
      options: parsedOptions,
      correctOptionIndex: parseInt(correctOptionIndex) || 0,
      marks: parseInt(marks) || 1,
      isArchived: false,
      imageUrl: req.file ? `/uploads/questions/${req.file.filename}` : null
    });

    const saved = await question.save();

    if (validatedModuleId) {
      await Module.findByIdAndUpdate(
        validatedModuleId,
        { $inc: { questionCount: 1 } }
      );
    }

    res.json(saved);
  } catch (err) {
    console.error("Error saving question:", err);
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    
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
    // Decrement counts per module
    const moduleCounts = {};
    questions.forEach(q => {
      if (q.moduleId) {
        moduleCounts[q.moduleId] = (moduleCounts[q.moduleId] || 0) + 1;
      }
    });

    // Bulk update each module
    for (const [moduleId, count] of Object.entries(moduleCounts)) {
      await Module.findByIdAndUpdate(moduleId, { $inc: { questionCount: -count } });
    }
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
