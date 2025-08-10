const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getUsers, addUser } = require('../controllers/userController');
const { registerUser, loginUser } = require('../controllers/authController');

// Public routes
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], registerUser);

router.post('/login', loginUser);

// Basic user routes (you might want to protect these later)
router.get('/', getUsers);
router.post('/', addUser);

module.exports = router;