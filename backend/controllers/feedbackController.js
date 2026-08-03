const Feedback = require('../models/Feedback');

// @desc    Submit rating & feedback
// @route   POST /api/feedback
// @access  Private
const submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment, donationId } = req.body;

    const feedback = await Feedback.create({
      userId: req.user._id,
      donationId: donationId || null,
      rating,
      comment: comment || '',
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's ratings & feedbacks
// @route   GET /api/feedback
// @access  Private
const getFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user._id })
      .populate('donationId', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback logs for admin
// @route   GET /api/feedback/admin-logs
// @access  Private (Admin)
const getAdminFeedbackLogs = async (req, res, next) => {
  try {
    const logs = await Feedback.find()
      .populate('userId', 'name email role')
      .populate('donationId', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitFeedback,
  getFeedbacks,
  getAdminFeedbackLogs,
};
