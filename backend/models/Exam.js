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
      }
    },
  ],

  // Derived fields (optional for quick queries)
  totalQuestions: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },

  // Access & Control
  examCode: { type: String, unique: true }, // if join code needed
  maxAttempts: { type: Number, default: 1 },
  tabSwitchLimit: { type: Number, default: 3 },

  // Exam Status
  status: {
    type: String,
    enum: ["Upcoming", "In Progress", "Completed", "Canceled"],
    default: "Upcoming"
  },

  createdAt: { type: Date, default: Date.now },
});

// Add a pre-save middleware to automatically update status based on current time
examSchema.pre('save', function(next) {
  const now = new Date();
  
  if (now < this.startTime) {
    this.status = "Upcoming";
  } else if (now >= this.startTime && now <= this.endTime) {
    this.status = "In Progress";
  } else if (now > this.endTime) {
    this.status = "Completed";
  }
  
  next();
});

// Add a static method to update status for all exams (useful for batch updates)
examSchema.statics.updateAllStatuses = async function() {
  const now = new Date();
  const exams = await this.find();
  
  for (const exam of exams) {
    if (now < exam.startTime) {
      exam.status = "Upcoming";
    } else if (now >= exam.startTime && now <= exam.endTime) {
      exam.status = "In Progress";
    } else if (now > exam.endTime) {
      exam.status = "Completed";
    }
    await exam.save();
  }
};

// Add a virtual for checking if exam is active
examSchema.virtual('isActive').get(function() {
  const now = new Date();
  return now >= this.startTime && now <= this.endTime;
});

// Add a virtual for checking if exam is upcoming
examSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  return now < this.startTime;
});

// Add a virtual for checking if exam is completed
examSchema.virtual('isCompleted').get(function() {
  const now = new Date();
  return now > this.endTime;
});

// Ensure virtual fields are serialized
examSchema.set('toJSON', { virtuals: true });
examSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Exam", examSchema);