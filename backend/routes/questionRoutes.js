// routes/questionRoutes.js
const express = require("express");
const router = express.Router();
const {
  getQuestions,
  createQuestion,
  bulkDeleteQuestions,
  toggleArchiveQuestions,
  getArchivedQuestions
} = require("../controllers/questionController.js");

// Basic
router.get("/", getQuestions); // ?moduleId=xxx
router.post("/", createQuestion);
router.delete("/bulk", bulkDeleteQuestions);

// Archive management
router.put("/archive-toggle", toggleArchiveQuestions);
router.get("/archived", getArchivedQuestions);

module.exports = router;
