const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    mealsSaved: {
      type: Number,
      default: 0,
    },
    peopleFed: {
      type: Number,
      default: 0,
    },
    wasteReducedKg: {
      type: Number,
      default: 0,
    },
    co2SavedKg: {
      type: Number,
      default: 0,
    },
    totalDonations: {
      type: Number,
      default: 0,
    },
    activeNgos: {
      type: Number,
      default: 0,
    },
    activeVolunteers: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analytics', analyticsSchema);
