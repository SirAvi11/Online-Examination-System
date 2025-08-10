const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paperId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionPaper', required: true },
  startedAt: Date,
  submittedAt: Date,
  score: Number,
  tabSwitchCount: { type: Number, default: 0 },
  status: { type: String, enum: ['in_progress', 'submitted', 'cheated'], default: 'in_progress' }
}, { timestamps: true });

module.exports = mongoose.model('StudentAttempt', attemptSchema);
