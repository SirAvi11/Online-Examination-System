const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();
const {
  getQuestions,
  createQuestion,
  bulkDeleteQuestions,
} = require("../controllers/questionController.js");

// Routes
router.get("/", getQuestions);
router.post("/", upload.single("image"), createQuestion);
router.delete("/bulk-delete", bulkDeleteQuestions);

module.exports = router;
