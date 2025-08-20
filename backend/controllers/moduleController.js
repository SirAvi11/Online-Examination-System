const Module = require('../models/Module.js');
const Question = require('../models/Question.js')

// GET all modules (optionally filtered by teacherId)
exports.getAllModules = async (req, res) => {
  const { teacherId } = req.query;
  try {
    const filter = teacherId ? { teacherId } : {};
    const modules = await Module.find(filter).sort({ date: -1 });
    res.json(modules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
};

// GET module by ID
exports.getModuleById = async (req, res) => {
  const { id } = req.params;
  try {
    const module = await Module.findById(id);
    if (!module) return res.status(404).json({ error: 'Module not found' });
    res.json(module);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
};

// CREATE module
exports.createModule = async (req, res) => {
  const { name, description, teacherId, color } = req.body;
  if (!name || !teacherId) return res.status(400).json({ error: 'Name and teacherId are required' });

  try {
    const module = new Module({ name, description, teacherId, color, questionCount: 0 });
    const savedModule = await module.save();
    res.status(201).json(savedModule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create module' });
  }
};

// UPDATE module
exports.updateModule = async (req, res) => {
  const { id } = req.params;
  const { name, description, color } = req.body;

  try {
    const updatedModule = await Module.findByIdAndUpdate(
      id,
      { ...(name && { name }), ...(description && { description }), ...(color && { color }) },
      { new: true }
    );
    if (!updatedModule) return res.status(404).json({ error: 'Module not found' });
    res.json(updatedModule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update module' });
  }
};

// DELETE module
exports.deleteModule = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedModule = await Module.findByIdAndDelete(id);
    if (!deletedModule) return res.status(404).json({ error: 'Module not found' });
    res.json({ message: 'Module deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete module' });
  }
};

// DELETE multiple modules
exports.deleteModulesBulk = async (req, res) => {
  const { ids } = req.body; // array of IDs
  if (!ids || !Array.isArray(ids)) return res.status(400).json({ error: "Invalid ids array" });

  try {
    const result = await Module.deleteMany({ _id: { $in: ids } });
    res.json({ message: `Deleted ${result.deletedCount} module(s)` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete modules' });
  }
};

exports.getQuestionsByModule = async (req, res) => {
  try {
    const moduleId = req.params.id;

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
