const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  logo: {
    type: String, // SVG or text abbreviation
    default: '',
  },
  location: {
    type: String,
    required: true,
  },
  experience: {
    type: String, // e.g. "2-5 Years"
    required: true,
  },
  salary: {
    type: String, // e.g. "18 - 28 LPA"
    required: true,
  },
  jobType: {
    type: String, // Full-time, Part-time, Contract, Internship, Hybrid, Remote
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  requirements: {
    type: [String],
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Job', JobSchema);
