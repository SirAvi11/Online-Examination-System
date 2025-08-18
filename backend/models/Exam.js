const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Exam Schedule
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // minutes

  // Questions: flexible design
  questions: [
    {
      type: {
        type: String,
        enum: ["existing", "custom"], // existing → from Question bank, custom → created inline
        required: true,
      },
      questionRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question", // only used if type = "existing"
      },
      customQuestion: {
        questionText: String,
        options: [String],
        correctAnswer: Number, // index of correct option
        marks: { type: Number, default: 1 },
        module: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Module", // optional for categorization
        },
      },
    },
  ],

  // Derived fields (optional for quick queries)
  totalQuestions: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },

  // Access & Control
  examCode: { type: String, unique: true }, // if join code needed
  maxAttempts: { type: Number, default: 1 },
  tabSwitchLimit: { type: Number, default: 3 },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Exam", examSchema);
