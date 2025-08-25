const express = require("express");
const router = express.Router();
const { getExamsByTeacher, createExam } = require("../controllers/examController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/exams - Get exams for logged-in teacher
router.get("/", authMiddleware, getExamsByTeacher);

// POST /api/exams - Create a new exam
router.post("/", authMiddleware, createExam);

module.exports = router;