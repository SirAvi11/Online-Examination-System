const Module = require('../models/Module.js');
const Question = require('../models/Question.js')

// GET all modules for logged-in teacher
exports.getAllModules = async (req, res) => {
  try {
    const teacherId = req.user.userId; // Get teacher ID from auth middleware
    const modules = await Module.find({ teacherId }).sort({ date: -1 });
    res.json(modules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
};

// GET module by ID (only for the authenticated teacher)
exports.getModuleById = async (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.userId;
  
  try {
    const module = await Module.findOne({ _id: id, teacherId });
    if (!module) return res.status(404).json({ error: 'Module not found' });
    res.json(module);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
};

// CREATE module for authenticated teacher
exports.createModule = async (req, res) => {
  const { name, description, color } = req.body;
  const teacherId = req.user.userId;
  
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const module = new Module({ 
      name, 
      description, 
      teacherId, 
      color, 
      questionCount: 0 
    });
    const savedModule = await module.save();
    res.status(201).json(savedModule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create module' });
  }
};

// UPDATE module (only for the authenticated teacher)
exports.updateModule = async (req, res) => {
  const { id } = req.params;
  const { name, description, color } = req.body;
  const teacherId = req.user.userId;

  try {
    const updatedModule = await Module.findOneAndUpdate(
      { _id: id, teacherId },
      { ...(name && { name }), ...(description && { description }), ...(color && { color }) },
      { new: true, runValidators: true }
    );
    if (!updatedModule) return res.status(404).json({ error: 'Module not found' });
    res.json(updatedModule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update module' });
  }
};

// DELETE module (only for the authenticated teacher)
exports.deleteModule = async (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.userId;
  
  try {
    const deletedModule = await Module.findOneAndDelete({ _id: id, teacherId });
    if (!deletedModule) return res.status(404).json({ error: 'Module not found' });
    res.json({ message: 'Module deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete module' });
  }
};

// DELETE multiple modules (only for the authenticated teacher)
exports.deleteModulesBulk = async (req, res) => {
  const { ids } = req.body;
  const teacherId = req.user.userId;
  
  if (!ids || !Array.isArray(ids)) return res.status(400).json({ error: "Invalid ids array" });

  try {
    const result = await Module.deleteMany({ 
      _id: { $in: ids }, 
      teacherId 
    });
    res.json({ message: `Deleted ${result.deletedCount} module(s)` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete modules' });
  }
};

// GET questions by module (only for the authenticated teacher)
exports.getQuestionsByModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const teacherId = req.user.userId;

    // Verify the module belongs to the teacher
    const module = await Module.findOne({ _id: moduleId, teacherId });
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Fetch questions for this module
    const questions = await Question.find({ moduleId: moduleId });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "No questions found for this module" });
    }

    res.json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Server error fetching questions" });
  }
};