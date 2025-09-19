const Exam = require('../models/Exam');
const Module = require('../models/Module');
const Question = require('../models/Question');
const ExamRegistration = require('../models/ExamRegistration');
const Subscription = require('../models/Subscription'); 

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
      .select('_id title startTime totalMarks examCode')
      .lean();

    let studentsRegisteredForClosestUpcomingExam = 0;
    if (closestUpcomingExam) {
      studentsRegisteredForClosestUpcomingExam = await ExamRegistration.countDocuments({
        examId: closestUpcomingExam._id,
        status: { $in: ['registered', 'attempted', 'completed'] },
      });
    }

    // 3) Pending evaluations instead of average score
    // (assuming `resultPublished` is a boolean field on Exam model)
    const pendingEvaluations = await Exam.countDocuments({
      createdBy: teacherId,
      resultPublished: false,
      endTime: { $lt: now }, // only exams that have already happened
    });

    let pendingEvaluationsPercentage = 0;
    if (totalExams > 0) {
      pendingEvaluationsPercentage = Number(
        ((pendingEvaluations / totalExams) * 100).toFixed(2)
      );
    }

    // 4) Total modules
    const totalModules = await Module.countDocuments({ teacherId: teacherId });

    // 5) Total questions for all modules
    const moduleIds = await Module.find({ teacherId: teacherId }).distinct('_id');
    let totalQuestions = 0;
    if (moduleIds.length) {
      totalQuestions = await Question.countDocuments({ moduleId: { $in: moduleIds } });
    }

    // 6) Active subscription (if any)
    const hasActiveSubscription = await Subscription.exists({
      user: teacherId,
      status: 'Active',
    }); // latest active subscription

    res.json({
      teacher: { id: teacherId },
      stats: {
        totalExams,
        upcomingExams,
        closestUpcomingExam: closestUpcomingExam
          ? {
              id: closestUpcomingExam._id,
              title: closestUpcomingExam.title,
              date: closestUpcomingExam.startTime,
              totalMarks: closestUpcomingExam.totalMarks,
              examCode: closestUpcomingExam.examCode,
              studentsRegistered: studentsRegisteredForClosestUpcomingExam,
            }
          : null,
        pendingEvaluations,
        pendingEvaluationsPercentage,
        totalModules,
        totalQuestions,
        hasActiveSubscription: !!hasActiveSubscription
      },
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: err.message });
  }
};
