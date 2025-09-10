const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');

// Teacher Dashboard Route
router.get('/dashboard', authMiddleware, studentController.getDashboard);

module.exports = router;