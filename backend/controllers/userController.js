// controllers/userController.js
const User = require('../models/User');

// GET all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new user
const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const newUser = new User({
      name,
      email,
      passwordHash: password,
      role
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Approve teacher
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = 'Active';
    user.rejectionReason = null;
    await user.save();

    res.json({ message: 'User approved successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject teacher
const rejectUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = 'Rejected';
    user.rejectionReason = reason || 'No reason provided';
    await user.save();

    res.json({ message: 'User rejected successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers, addUser, approveUser, rejectUser };
