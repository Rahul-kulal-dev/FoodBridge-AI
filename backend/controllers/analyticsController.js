const Donation = require('../models/Donation');
const User = require('../models/User');

// @desc    Get impact analytics metrics (Meals Saved, People Fed, Waste Reduced, CO2 Saved)
// @route   GET /api/analytics/impact
// @access  Public
const getImpactMetrics = async (req, res, next) => {
  try {
    const allDonations = await Donation.find();
    
    // Delivered donations count & quantity
    const deliveredDonations = allDonations.filter(
      (d) => d.status === 'delivered' || d.status === 'completed'
    );
    const deliveredQty = deliveredDonations.reduce(
      (acc, d) => acc + (Number(d.quantity) || 0),
      0
    );

    // Total donated quantity across all valid donations
    const totalDonatedQty = allDonations.reduce(
      (acc, d) => acc + (Number(d.quantity) || 0),
      0
    );

    // Use deliveredQty if available, otherwise totalDonatedQty to reflect live database donations
    const activeQty = deliveredQty > 0 ? deliveredQty : totalDonatedQty;

    // Metrics calculations (approx. 3 meals per kg)
    const mealsSaved = Math.round(activeQty * 3);
    const peopleFed = Math.round(activeQty * 2.5);
    const wasteReducedKg = Math.round(activeQty);
    const co2SavedKg = Math.round(wasteReducedKg * 2.5);

    // Dynamic counts from User model in MongoDB
    const activeDonors = await User.countDocuments({
      $or: [{ role: 'donor' }, { user_role: 'donor' }],
    });
    const activeNGOs = await User.countDocuments({
      $or: [{ role: 'ngo' }, { user_role: 'ngo' }],
    });
    const activeVolunteers = await User.countDocuments({
      $or: [{ role: 'volunteer' }, { user_role: 'volunteer' }],
    });

    const successfulDeliveries = deliveredDonations.length;
    const totalDonationsCount = allDonations.length;

    res.json({
      success: true,
      metrics: {
        mealsSaved,
        peopleFed,
        wasteReducedKg,
        co2SavedKg,
        activeDonors,
        activeNGOs,
        activeVolunteers,
        successfulDeliveries,
        totalDonationsCount,
        totalFoodKg: activeQty,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getImpactMetrics,
};
