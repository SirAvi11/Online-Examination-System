const express = require('express');
const { getAllModules, createModule, updateModule, deleteModule, deleteModulesBulk } = require('../controllers/moduleController');
const router = express.Router();

router.get('/', getAllModules);
router.post('/', createModule);
router.put('/:id', updateModule);
router.delete('/:id', deleteModule);
router.delete('/', deleteModulesBulk); 


module.exports = router;