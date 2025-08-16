const express = require("express");
const router = express.Router();
const {
  getQuestions,
  createQuestion,
  bulkDeleteQuestions,
} = require("../controllers/questionController.js");

// Routes
router.get("/", getQuestions);
router.post("/", createQuestion);
router.delete("/bulk-delete", bulkDeleteQuestions);

module.exports = router;
