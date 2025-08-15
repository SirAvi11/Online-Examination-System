const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  paperId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionPaper', required: false },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true }, // <-- new field
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  marks: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
