const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  name: String,
  description: String,
  questionCount: Number,
  color: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Module', moduleSchema);
