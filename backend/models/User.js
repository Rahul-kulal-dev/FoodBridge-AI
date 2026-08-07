const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['donor', 'ngo', 'volunteer', 'admin'],
      default: 'donor',
    },
    user_role: {
      type: String,
      enum: ['donor', 'ngo', 'volunteer', 'admin'],
      default: 'donor',
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: function () {
        const assignedRole = this.user_role || this.role;
        return assignedRole === 'admin' ? 'approved' : 'pending';
      },
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    locationName: {
      type: String,
      default: '',
    },
    formattedAddress: {
      type: String,
      default: '',
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    locationUpdatedAt: {
      type: Date,
    },
    currentLocation: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      heading: { type: Number, default: null },
      speed: { type: Number, default: null },
      updatedAt: { type: Date, default: Date.now },
    },
    verificationDocs: [
      {
        docType: { type: String, default: '' },
        docUrl: { type: String, required: true },
        publicId: { type: String, default: '' },
        resourceType: { type: String, default: 'auto' },
        format: { type: String, default: '' },
        bytes: { type: Number, default: 0 },
        fileName: { type: String, default: '' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    organizationName: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    vehicleType: {
      type: String,
      default: '',
    },
    vehicleNumber: {
      type: String,
      default: '',
    },
    emergencyContact: {
      type: String,
      default: '',
    },
    deliveryRadius: {
      type: String,
      default: '',
    },
    availability: {
      type: String,
      default: '',
    },
    servingCapacity: {
      type: String,
      default: '',
    },
    operatingHours: {
      type: String,
      default: '',
    },
    foodCategories: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password and sync user_role/role
userSchema.pre('save', async function (next) {
  if (this.user_role && !this.role) {
    this.role = this.user_role;
  } else if (this.role && !this.user_role) {
    this.user_role = this.role;
  }

  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
