const express = require('express');
const { 
  getAllModules, 
  createModule, 
  updateModule, 
  deleteModule, 
  deleteModulesBulk, 
  getQuestionsByModule 
} = require('../controllers/moduleController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// All routes now require authentication
router.get('/', authMiddleware, getAllModules);
router.post('/', authMiddleware, createModule);
router.put('/:id', authMiddleware, updateModule);
router.delete('/:id', authMiddleware, deleteModule);
router.delete('/', authMiddleware, deleteModulesBulk); 
router.get("/:id/questions", authMiddleware, getQuestionsByModule);

module.exports = router;