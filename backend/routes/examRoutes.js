const express = require("express");
const router = express.Router();
const { 
  getExamsByTeacher, 
  createExam, 
  getExamById, 
  updateExam, 
  deleteExam 
} = require("../controllers/examController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/exams - Get all exams for logged-in teacher
router.get("/", authMiddleware, getExamsByTeacher);

// POST /api/exams - Create a new exam
router.post("/", authMiddleware, createExam);

// GET /api/exams/:id - Get single exam by ID
router.get("/:id", authMiddleware, getExamById);

// PUT /api/exams/:id - Update an exam
router.put("/:id", authMiddleware, updateExam);

// DELETE /api/exams/:id - Delete an exam
router.delete("/:id", authMiddleware, deleteExam);

module.exports = router;