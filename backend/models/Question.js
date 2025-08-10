const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  paperId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionPaper', required: true },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  marks: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
