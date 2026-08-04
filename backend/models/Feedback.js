const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      required: true,
      unique: true, // Only one feedback per completed donation allowed
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // NGO rates Donor for: Food Quality, Packaging, Freshness, Hygiene
    donorRatings: {
      foodQuality: { type: Number, min: 1, max: 5, default: 5 },
      packaging: { type: Number, min: 1, max: 5, default: 5 },
      freshness: { type: Number, min: 1, max: 5, default: 5 },
      hygiene: { type: Number, min: 1, max: 5, default: 5 },
      overall: { type: Number, min: 1, max: 5, default: 5 },
    },
    donorComment: {
      type: String,
      default: '',
    },
    // NGO rates Volunteer for: Punctuality, Food Handling, Professionalism
    volunteerRatings: {
      punctuality: { type: Number, min: 1, max: 5, default: 5 },
      foodHandling: { type: Number, min: 1, max: 5, default: 5 },
      professionalism: { type: Number, min: 1, max: 5, default: 5 },
      overall: { type: Number, min: 1, max: 5, default: 5 },
    },
    volunteerComment: {
      type: String,
      default: '',
    },
    overallComment: {
      type: String,
      default: '',
    },
    // Backward compatibility fields
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      default: '',
    },
    isReadOnly: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);

