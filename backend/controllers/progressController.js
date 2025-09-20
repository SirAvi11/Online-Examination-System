const StudentAttempt = require('../models/StudentAttempt');
const mongoose = require("mongoose");

exports.getStudentProgress = async (req, res) => {
  try {
    const { examId, studentName, minScore } = req.query;

    // Base match (only examId, percentage is calculated later)
    let matchStage = {};
    if (examId) matchStage.examId = new mongoose.Types.ObjectId(examId);

    const pipeline = [
      { $match: matchStage },

      // Lookup student info
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },

      // Apply student name filter if provided
      ...(studentName
        ? [
            {
              $match: {
                "student.name": { $regex: studentName, $options: "i" },
              },
            },
          ]
        : []),

      // Lookup exam info
      {
        $lookup: {
          from: "exams",
          localField: "examId",
          foreignField: "_id",
          as: "exam",
        },
      },
      { $unwind: "$exam" },

      // Compute percentage
      {
        $addFields: {
          percentage: { $multiply: [{ $divide: ["$score", "$totalMarks"] }, 100] },
        },
      },

      // ✅ Apply minScore filter on percentage (0–100%)
      ...(minScore
        ? [
            {
              $match: {
                percentage: { $gte: Number(minScore) },
              },
            },
          ]
        : []),

      // Project only useful fields
      {
        $project: {
          _id: 0,
          attemptId: "$_id",
          examId: "$exam._id",
          examTitle: "$exam.title",
          studentId: "$student._id",
          studentName: "$student.name",
          score: 1,
          totalMarks: 1,
          percentage: 1,
          status: 1,
          startedAt: 1,
          submittedAt: 1,
          tabSwitchCount: 1,
        },
      },

      // Group by student to create progress array and summary
      {
        $group: {
          _id: "$studentId",
          studentName: { $first: "$studentName" },
          exams: {
            $push: {
              attemptId: "$attemptId",
              examId: "$examId",
              examTitle: "$examTitle",
              score: "$score",
              totalMarks: "$totalMarks",
              percentage: "$percentage",
              status: "$status",
              startedAt: "$startedAt",
              submittedAt: "$submittedAt",
              tabSwitchCount: "$tabSwitchCount",
            },
          },
          totalExamsAttempted: { $sum: 1 },
          averageScore: { $avg: "$score" },
          averagePercentage: { $avg: "$percentage" },
          totalTabSwitches: { $sum: "$tabSwitchCount" },
        },
      },

      {
        $project: {
          _id: 0,
          studentId: "$_id",
          studentName: 1,
          exams: 1,
          totalExamsAttempted: 1,
          averageScore: 1,
          averagePercentage: { $round: ["$averagePercentage", 2] },
          averageTabSwitches: { $round: ["$totalTabSwitches", 2] },
        },
      },
    ];

    const students = await StudentAttempt.aggregate(pipeline);
    res.json({ students });
  } catch (err) {
    console.error("❌ Progress fetch error:", err);
    res.status(500).json({ error: "Server error fetching progress" });
  }
};
