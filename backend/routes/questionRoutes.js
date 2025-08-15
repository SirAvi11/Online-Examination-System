const express = require("express");
const router = express.Router();
const Question = require("../models/Question.js");

// GET questions by moduleId
router.get("/", async (req, res) => {
  const { moduleId } = req.query;
  if (!moduleId) return res.status(400).json({ message: "moduleId is required" });

  try {
    const questions = await Question.find({ moduleId });
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching questions" });
  }
});

// POST new question
router.post("/", async (req, res) => {
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
      marks
    });

    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error saving question" });
  }
});

module.exports = router;
