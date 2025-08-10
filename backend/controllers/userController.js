const User = require('../models/User');

const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

const addUser = async (req, res) => {
  const { name, email } = req.body;
  const newUser = await User.create({ name, email });
  res.status(201).json(newUser);
};

module.exports = { getUsers, addUser };