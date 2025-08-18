const express = require("express");
const router = express.Router();
const { getExamsByTeacher } = require("../controllers/examController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/exams
router.get("/", authMiddleware, getExamsByTeacher);

module.exports = router;
