const express = require('express');
const { getAllModules, createModule, updateModule, deleteModule, deleteModulesBulk, getQuestionsByModule } = require('../controllers/moduleController');
const router = express.Router();

router.get('/', getAllModules);
router.post('/', createModule);
router.put('/:id', updateModule);
router.delete('/:id', deleteModule);
router.delete('/', deleteModulesBulk); 
router.get("/:id/questions", getQuestionsByModule);


module.exports = router;