const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileStrength: {
    type: Number,
    default: 75, // Matches the dashboard preview in image 2 (75%)
  },
  targetTitle: {
    type: String,
    default: 'Product Designer',
  },
  skills: {
    type: [String],
    default: ['Figma', 'UI Design', 'UX Design', 'Prototyping', 'User Research', 'Wireframing'],
  },
  summary: {
    type: String,
    default: 'Creative and detail-oriented Product Designer with 4+ years of experience in designing user-centered digital products. Skilled in UX/UI design, prototyping, and collaborating with cross-functional teams to deliver exceptional user experiences.',
  },
  profilePicture: {
    type: String,
    default: '',
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  }],
  role: {
    type: String,
    enum: ['candidate', 'recruiter'],
    default: 'candidate',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
