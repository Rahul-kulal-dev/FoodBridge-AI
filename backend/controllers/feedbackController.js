const Feedback = require('../models/Feedback');
const Donation = require('../models/Donation');

// @desc    Get eligible delivered donations for logged-in NGO
// @route   GET /api/feedback/eligible-donations
// @access  Private (NGO)
const getEligibleDonationsForNgo = async (req, res, next) => {
  try {
    const ngoId = req.user._id;

    // Find all donations assigned to this NGO with status 'delivered'
    const donations = await Donation.find({
      ngoId,
      status: { $regex: /^delivered$/i },
    })
      .populate('donorId', 'name email phone address organizationName')
      .populate('volunteerId', 'name email phone')
      .sort({ updatedAt: -1 });

    // Check which donations already have feedback submitted
    const donationIds = donations.map((d) => d._id);
    const existingFeedbacks = await Feedback.find({
      donationId: { $in: donationIds },
    }).select('donationId');

    const submittedDonationSet = new Set(
      existingFeedbacks.map((f) => f.donationId.toString())
    );

    const eligibleDonations = donations.map((donation) => ({
      _id: donation._id,
      title: donation.title,
      foodType: donation.foodType,
      quantity: donation.quantity,
      unit: donation.unit,
      donor: donation.donorId,
      volunteer: donation.volunteerId || null,
      deliveredAt: donation.updatedAt,
      hasFeedback: submittedDonationSet.has(donation._id.toString()),
    }));

    res.json({
      success: true,
      count: eligibleDonations.length,
      donations: eligibleDonations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit rating & feedback for a delivered donation
// @route   POST /api/feedback
// @access  Private (NGO)
const submitFeedback = async (req, res, next) => {
  try {
    const {
      donationId,
      donorRatings,
      donorComment,
      volunteerRatings,
      volunteerComment,
      overallComment,
    } = req.body;

    if (!donationId) {
      return res.status(400).json({
        success: false,
        message: 'Donation ID is required to submit feedback',
      });
    }

    // 1. Fetch donation details
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    // Authorization check
    if (donation.ngoId && donation.ngoId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to submit feedback for this donation',
      });
    }

    // 2. BUSINESS RULE 1: NGO can submit feedback ONLY after donation status is Delivered
    if (!donation.status || donation.status.toLowerCase() !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: `Feedback can only be submitted after the donation status is Delivered. Current status: ${donation.status}`,
      });
    }

    // 3. BUSINESS RULE 5: Only one feedback per completed donation is allowed
    const existingFeedback = await Feedback.findOne({ donationId });
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback has already been submitted for this completed donation.',
      });
    }

    // Extract involved donor and volunteer
    const donorId = donation.donorId;
    const volunteerId = donation.volunteerId || null;

    if (!donorId) {
      return res.status(400).json({
        success: false,
        message: 'No donor associated with this donation',
      });
    }

    // Parse Donor Ratings: Food Quality, Packaging, Freshness, Hygiene
    const foodQuality = Number(donorRatings?.foodQuality) || 5;
    const packaging = Number(donorRatings?.packaging) || 5;
    const freshness = Number(donorRatings?.freshness) || 5;
    const hygiene = Number(donorRatings?.hygiene) || 5;

    const donorOverall = Number(
      ((foodQuality + packaging + freshness + hygiene) / 4).toFixed(1)
    );

    // Parse Volunteer Ratings (if volunteer involved): Punctuality, Food Handling, Professionalism
    let volData = undefined;
    let volOverall = 5;
    if (volunteerId && volunteerRatings) {
      const punctuality = Number(volunteerRatings?.punctuality) || 5;
      const foodHandling = Number(volunteerRatings?.foodHandling) || 5;
      const professionalism = Number(volunteerRatings?.professionalism) || 5;

      volOverall = Number(
        ((punctuality + foodHandling + professionalism) / 3).toFixed(1)
      );

      volData = {
        punctuality,
        foodHandling,
        professionalism,
        overall: volOverall,
      };
    }

    // 4. BUSINESS RULE 6: Store in MongoDB as read-only feedback
    const feedback = await Feedback.create({
      ngoId: req.user._id,
      donationId: donation._id,
      donorId,
      volunteerId,
      donorRatings: {
        foodQuality,
        packaging,
        freshness,
        hygiene,
        overall: donorOverall,
      },
      donorComment: donorComment || '',
      volunteerRatings: volData,
      volunteerComment: volunteerComment || '',
      overallComment: overallComment || donorComment || '',

      // Backwards compatibility fields
      userId: req.user._id,
      rating: donorOverall,
      comment: overallComment || donorComment || '',
      isReadOnly: true,
    });

    // Populate saved document for client response
    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('donationId', 'title foodType quantity unit status')
      .populate('donorId', 'name email organizationName')
      .populate('volunteerId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully and saved to database.',
      feedback: populatedFeedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedbacks submitted by logged-in NGO
// @route   GET /api/feedback/ngo
// @access  Private (NGO)
const getNgoFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({
      $or: [{ ngoId: req.user._id }, { userId: req.user._id }],
    })
      .populate('donationId', 'title foodType quantity unit status')
      .populate('donorId', 'name email organizationName phone')
      .populate('volunteerId', 'name email phone')
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

// @desc    Get ratings & feedback for logged-in Donor (displayed on Donor Feedback page)
// @route   GET /api/feedback/donor
// @access  Private (Donor)
const getDonorFeedbacks = async (req, res, next) => {
  try {
    const donorId = req.user._id;

    const feedbacks = await Feedback.find({ donorId })
      .populate('ngoId', 'name email organizationName')
      .populate('donationId', 'title foodType quantity unit createdAt')
      .sort({ createdAt: -1 });

    // Calculate category averages
    let avgFoodQuality = 5;
    let avgPackaging = 5;
    let avgFreshness = 5;
    let avgHygiene = 5;
    let avgOverall = 5;

    if (feedbacks.length > 0) {
      let sumFQ = 0, sumPkg = 0, sumFr = 0, sumHyg = 0, sumOvr = 0;

      feedbacks.forEach((f) => {
        const d = f.donorRatings || {};
        sumFQ += d.foodQuality || f.rating || 5;
        sumPkg += d.packaging || f.rating || 5;
        sumFr += d.freshness || f.rating || 5;
        sumHyg += d.hygiene || f.rating || 5;
        sumOvr += d.overall || f.rating || 5;
      });

      avgFoodQuality = Number((sumFQ / feedbacks.length).toFixed(1));
      avgPackaging = Number((sumPkg / feedbacks.length).toFixed(1));
      avgFreshness = Number((sumFr / feedbacks.length).toFixed(1));
      avgHygiene = Number((sumHyg / feedbacks.length).toFixed(1));
      avgOverall = Number((sumOvr / feedbacks.length).toFixed(1));
    }

    res.json({
      success: true,
      count: feedbacks.length,
      averages: {
        foodQuality: avgFoodQuality,
        packaging: avgPackaging,
        freshness: avgFreshness,
        hygiene: avgHygiene,
        overall: avgOverall,
      },
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ratings & feedback for logged-in Volunteer (displayed on Volunteer Profile/Dashboard)
// @route   GET /api/feedback/volunteer
// @access  Private (Volunteer)
const getVolunteerFeedbacks = async (req, res, next) => {
  try {
    const volunteerId = req.user._id;

    const feedbacks = await Feedback.find({ volunteerId })
      .populate('ngoId', 'name email organizationName')
      .populate('donationId', 'title foodType quantity unit createdAt')
      .sort({ createdAt: -1 });

    // Calculate category averages for Volunteer
    let avgPunctuality = 5;
    let avgFoodHandling = 5;
    let avgProfessionalism = 5;
    let avgOverall = 5;

    if (feedbacks.length > 0) {
      let sumPunc = 0, sumHndl = 0, sumProf = 0, sumOvr = 0;

      feedbacks.forEach((f) => {
        const v = f.volunteerRatings || {};
        sumPunc += v.punctuality || 5;
        sumHndl += v.foodHandling || 5;
        sumProf += v.professionalism || 5;
        sumOvr += v.overall || 5;
      });

      avgPunctuality = Number((sumPunc / feedbacks.length).toFixed(1));
      avgFoodHandling = Number((sumHndl / feedbacks.length).toFixed(1));
      avgProfessionalism = Number((sumProf / feedbacks.length).toFixed(1));
      avgOverall = Number((sumOvr / feedbacks.length).toFixed(1));
    }

    res.json({
      success: true,
      count: feedbacks.length,
      averages: {
        punctuality: avgPunctuality,
        foodHandling: avgFoodHandling,
        professionalism: avgProfessionalism,
        overall: avgOverall,
      },
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback logs for Admin (Trust and Safety Monitoring)
// @route   GET /api/feedback/admin-logs
// @access  Private (Admin)
const getAdminFeedbackLogs = async (req, res, next) => {
  try {
    const logs = await Feedback.find()
      .populate('ngoId', 'name email role organizationName')
      .populate('donorId', 'name email role organizationName')
      .populate('volunteerId', 'name email role phone')
      .populate('donationId', 'title foodType status')
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    // Trust & Safety Metrics
    let totalLogs = logs.length;
    let avgDonorRating = 5;
    let avgVolunteerRating = 5;
    let lowRatingCount = 0;

    if (totalLogs > 0) {
      let sumDonor = 0;
      let sumVol = 0;
      let volCount = 0;

      logs.forEach((log) => {
        const dScore = log.donorRatings?.overall || log.rating || 5;
        sumDonor += dScore;

        if (log.volunteerId && log.volunteerRatings) {
          sumVol += log.volunteerRatings.overall || 5;
          volCount++;
        }

        if (dScore < 3.0 || (log.volunteerRatings && log.volunteerRatings.overall < 3.0)) {
          lowRatingCount++;
        }
      });

      avgDonorRating = Number((sumDonor / totalLogs).toFixed(1));
      avgVolunteerRating = volCount > 0 ? Number((sumVol / volCount).toFixed(1)) : 5.0;
    }

    res.json({
      success: true,
      count: totalLogs,
      stats: {
        totalLogs,
        avgDonorRating,
        avgVolunteerRating,
        lowRatingCount,
      },
      logs,
    });
  } catch (error) {
    next(error);
  }
};

// Generic get Feedbacks endpoint for backwards compatibility
const getFeedbacks = async (req, res, next) => {
  if (req.user.role === 'ngo') return getNgoFeedbacks(req, res, next);
  if (req.user.role === 'donor') return getDonorFeedbacks(req, res, next);
  if (req.user.role === 'volunteer') return getVolunteerFeedbacks(req, res, next);
  return getAdminFeedbackLogs(req, res, next);
};

module.exports = {
  getEligibleDonationsForNgo,
  submitFeedback,
  getFeedbacks,
  getNgoFeedbacks,
  getDonorFeedbacks,
  getVolunteerFeedbacks,
  getAdminFeedbackLogs,
};

