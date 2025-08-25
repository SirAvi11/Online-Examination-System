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
const upload = require("../middleware/uploadMiddleware.js"); 


// Basic
router.get("/", getQuestions); // ?moduleId=xxx
router.post("/", upload.single('image'), createQuestion); // Add multer middleware here
router.delete("/bulk", bulkDeleteQuestions);

// Archive management
router.put("/archive-toggle", toggleArchiveQuestions);
router.get("/archived", getArchivedQuestions);

module.exports = router;
