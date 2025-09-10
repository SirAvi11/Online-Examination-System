const User = require('../models/User');
const Exam = require('../models/Exam');
const StudentAttempt = require('../models/StudentAttempt');
const Module = require('../models/Module');
const Question = require('../models/Question');
const ExamRegistration = require('../models/ExamRegistration');

exports.getDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'Teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const teacherId = req.user.userId;
    const now = new Date();

    // 1) Basic exam counts
    const totalExams = await Exam.countDocuments({ createdBy: teacherId });
    const upcomingExams = await Exam.countDocuments({
      createdBy: teacherId,
      startTime: { $gte: now },
    });

    // 2) Closest upcoming exam and students registered
    const closestUpcomingExam = await Exam.findOne({
      createdBy: teacherId,
      startTime: { $gte: now },
    })
      .sort({ startTime: 1 })
      .select('_id title date')
      .lean();

    let studentsRegisteredForClosestUpcomingExam = 0;
    if (closestUpcomingExam) {
      studentsRegisteredForClosestUpcomingExam = await ExamRegistration.countDocuments({
        examId: closestUpcomingExam._id,
        status: { $in: ['registered', 'attempted', 'completed'] }, // count only valid registrations
      });
    }

    // 3) Average scores in percentage across ALL exams created by this teacher
    const teacherExams = await Exam.find({ createdBy: teacherId })
      .select('_id totalMarks')
      .lean();
    const examIds = teacherExams.map((e) => e._id);

    let averageScoresPercentage = 0;
    if (examIds.length) {
      const avgAgg = await StudentAttempt.aggregate([
        { $match: { examId: { $in: examIds } } },
        {
          $lookup: {
            from: 'exams',
            localField: 'examId',
            foreignField: '_id',
            as: 'exam',
          },
        },
        { $unwind: { path: '$exam', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            score: 1,
            attemptPercentage: '$percentage',
            examTotalMarks: '$exam.totalMarks',
          },
        },
        {
          $addFields: {
            percentageCalculated: {
              $cond: [
                { $and: [{ $ifNull: ['$examTotalMarks', false] }, { $gt: ['$examTotalMarks', 0] }] },
                { $multiply: [{ $divide: ['$score', '$examTotalMarks'] }, 100] },
                '$attemptPercentage',
              ],
            },
          },
        },
        { $match: { percentageCalculated: { $ne: null } } },
        { $group: { _id: null, avgPercentage: { $avg: '$percentageCalculated' } } },
      ]);

      averageScoresPercentage = avgAgg[0] ? Number(avgAgg[0].avgPercentage.toFixed(2)) : 0;
    }

    // 4) Percent increase/decrease in average from last -> previous exam
    const lastTwoExams = await Exam.find({
      createdBy: teacherId,
      date: { $lt: now },
    })
      .sort({ date: -1 })
      .limit(2)
      .select('_id totalMarks title date')
      .lean();

    const computeExamAvgPercent = async (exam) => {
      if (!exam) return 0;
      if (exam.totalMarks && exam.totalMarks > 0) {
        const agg = await StudentAttempt.aggregate([
          { $match: { examId: exam._id } },
          { $group: { _id: null, avgScore: { $avg: '$score' } } },
        ]);
        const avgScore = agg[0] ? agg[0].avgScore : 0;
        return (avgScore / exam.totalMarks) * 100;
      }
      const agg2 = await StudentAttempt.aggregate([
        { $match: { examId: exam._id } },
        { $group: { _id: null, avgPercentage: { $avg: '$percentage' } } },
      ]);
      return agg2[0] && agg2[0].avgPercentage != null ? agg2[0].avgPercentage : 0;
    };

    let percentChangeBetweenLastTwoExams = null;
    if (lastTwoExams.length >= 2) {
      const lastAvg = await computeExamAvgPercent(lastTwoExams[0]);
      const prevAvg = await computeExamAvgPercent(lastTwoExams[1]);
      percentChangeBetweenLastTwoExams = prevAvg === 0
        ? (lastAvg === 0 ? 0 : 100)
        : Number((((lastAvg - prevAvg) / Math.abs(prevAvg)) * 100).toFixed(2));
    }

    // 5) Total modules
    const totalModules = await Module.countDocuments({ teacherId: teacherId });

    // 6) Total questions for all modules
    const moduleIds = await Module.find({ teacherId: teacherId }).distinct('_id');
    let totalQuestions = 0;
    if (moduleIds.length) {
      totalQuestions = await Question.countDocuments({ moduleId: { $in: moduleIds } });
    }

    res.json({
      teacher: { id: teacherId },
      stats: {
        totalExams,
        upcomingExams,
        closestUpcomingExam: closestUpcomingExam
          ? {
              id: closestUpcomingExam._id,
              title: closestUpcomingExam.title,
              date: closestUpcomingExam.date,
              studentsRegistered: studentsRegisteredForClosestUpcomingExam,
            }
          : null,
        averageScoresPercentage,
        percentChangeBetweenLastTwoExams,
        totalModules,
        totalQuestions,
      },
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: err.message });
  }
};
