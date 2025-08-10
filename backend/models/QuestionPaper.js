const mongoose = require('mongoose');

const questionPaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timeLimit: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  isPublished: { type: Boolean, default: false },
  maxAttempts: { type: Number, default: 1 }
}, { timestamps: true });


module.exports = mongoose.model('QuestionPaper', questionPaperSchema);
