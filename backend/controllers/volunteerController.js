const VolunteerTask = require('../models/VolunteerTask');
const Donation = require('../models/Donation');
const Feedback = require('../models/Feedback');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Get volunteer stats from MongoDB
// @route   GET /api/volunteer/stats
// @access  Private (Volunteer)
const getVolunteerStats = async (req, res, next) => {
  try {
    const totalDeliveries = await Donation.countDocuments({
      $or: [{ volunteerId: req.user._id }, { status: 'delivered' }],
      status: 'delivered',
    });

    const activeTasks = await Donation.countDocuments({
      status: { $in: ['accepted', 'picked_up'] },
    });

    const feedbacks = await Feedback.find({ volunteerId: req.user._id });
    let totalScore = 0;
    let count = 0;
    feedbacks.forEach((f) => {
      if (f.volunteerRatings && f.volunteerRatings.overall) {
        totalScore += f.volunteerRatings.overall;
        count++;
      }
    });

    const rating = count > 0 ? (totalScore / count).toFixed(1) : '4.9';

    res.json({
      success: true,
      stats: {
        totalDeliveries,
        activeTasks,
        todayPickups: activeTasks,
        rating,
      },
    });
  } catch (error) {
    next(error);
  }
};

const resolveDonationImages = (d) => {
  if (!d) return d;
  const obj = typeof d.toObject === 'function' ? d.toObject() : { ...d };
  const titleLower = (obj.title || '').toLowerCase();

  let validImgs = Array.isArray(obj.images)
    ? obj.images.filter((img) => img && typeof img === 'string' && img.trim() !== '' && !img.startsWith('blob:'))
    : [];

  if (obj.image && typeof obj.image === 'string' && obj.image.trim() !== '' && !obj.image.startsWith('blob:')) {
    if (!validImgs.includes(obj.image)) validImgs.unshift(obj.image);
  }

  if (validImgs.length === 0) {
    if (titleLower.includes('pizza') && titleLower.includes('sandwich')) {
      validImgs = [
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
      ];
    } else if (titleLower.includes('pizza')) {
      validImgs = ['https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'];
    } else if (titleLower.includes('sandwich')) {
      validImgs = ['https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80'];
    } else {
      validImgs = ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'];
    }
  }

  obj.image = validImgs[0];
  obj.images = validImgs;
  return obj;
};

// @desc    Get assigned volunteer tasks from MongoDB
// @route   GET /api/volunteer/tasks
// @access  Private (Volunteer)
const getAssignedTasks = async (req, res, next) => {
  try {
    const tasks = await VolunteerTask.find({ volunteerId: req.user._id })
      .populate({
        path: 'donationId',
        populate: { path: 'donorId', select: 'name email phone address organizationName' },
      })
      .populate('ngoId', 'name email phone address organizationName')
      .sort({ createdAt: -1 });

    const rawActiveDonations = await Donation.find({
      status: { $in: ['accepted', 'picked_up'] },
    })
      .populate('donorId', 'name email phone address organizationName')
      .populate('ngoId', 'name email phone address organizationName')
      .sort({ updatedAt: -1 });

    const activeDonations = rawActiveDonations.map(resolveDonationImages);

    res.json({
      success: true,
      count: tasks.length || activeDonations.length,
      tasks,
      donations: activeDonations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload pickup verification photo
// @route   POST /api/volunteer/tasks/:id/pickup-verification
// @access  Private (Volunteer)
const uploadPickupVerification = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a pickup photo' });
    }

    const task = await VolunteerTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const pickupPhoto = await uploadToCloudinary(req.file.path, 'foodbridge_pickups');
    task.pickupPhoto = pickupPhoto;
    task.status = 'picked_up';
    task.pickedUpAt = new Date();
    await task.save();

    await Donation.findByIdAndUpdate(task.donationId, { status: 'picked_up' });

    res.json({
      success: true,
      message: 'Pickup verification uploaded successfully',
      pickupPhoto,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery status
// @route   PATCH /api/volunteer/tasks/:id/status
// @access  Private (Volunteer)
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await VolunteerTask.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = status;
    if (status === 'picked_up' && !task.pickedUpAt) {
      task.pickedUpAt = new Date();
    }
    if (status === 'delivered') {
      task.deliveredAt = new Date();
    }

    await task.save();
    await Donation.findByIdAndUpdate(task.donationId, { status, volunteerId: req.user._id });

    res.json({
      success: true,
      message: `Task status updated to ${status}`,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get delivery history from MongoDB
// @route   GET /api/volunteer/history
// @access  Private (Volunteer)
const getDeliveryHistory = async (req, res, next) => {
  try {
    const tasks = await VolunteerTask.find({
      volunteerId: req.user._id,
      status: { $in: ['delivered', 'cancelled'] },
    })
      .populate('donationId')
      .populate('ngoId', 'name organizationName')
      .sort({ updatedAt: -1 });

    const deliveredDonations = await Donation.find({
      status: 'delivered',
    })
      .populate('donorId', 'name organizationName')
      .populate('ngoId', 'name organizationName')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: tasks.length || deliveredDonations.length,
      tasks,
      donations: deliveredDonations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVolunteerStats,
  getAssignedTasks,
  uploadPickupVerification,
  updateTaskStatus,
  getDeliveryHistory,
};
