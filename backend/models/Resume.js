const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  personalInfo: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    title: { type: String, default: '' },
    summary: { type: String, default: '' },
  },
  education: [{
    degree: { type: String, default: '' },
    school: { type: String, default: '' },
    year: { type: String, default: '' },
    grade: { type: String, default: '' },
  }],
  workExperience: [{
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    location: { type: String, default: '' },
    duration: { type: String, default: '' },
    description: { type: String, default: '' },
  }],
  internships: [{
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    location: { type: String, default: '' },
    duration: { type: String, default: '' },
    description: { type: String, default: '' },
  }],
  projects: [{
    title: { type: String, default: '' },
    technologies: { type: String, default: '' },
    description: { type: String, default: '' },
    link: { type: String, default: '' },
  }],
  achievements: [{
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  }],
  certificates: [{
    title: { type: String, default: '' },
    issuer: { type: String, default: '' },
    date: { type: String, default: '' },
  }],
  skills: [{
    name: { type: String, default: '' },
    level: { type: Number, default: 80 }, // 0 to 100
  }],
  additionalInfo: {
    languages: { type: String, default: '' },
    interests: { type: String, default: '' },
  },
  templateStyle: {
    templateId: { type: String, default: 'modern' }, // modern, dark, light-left, compact
    primaryColor: { type: String, default: '#6366f1' },
    fontFamily: { type: String, default: 'Inter' },
    fontSize: { type: Number, default: 10 },
  },
  atsScore: { type: Number, default: 0 },
  scoreMetrics: {
    contentQuality: { type: Number, default: 0 },
    keywordOptimization: { type: Number, default: 0 },
    formatStructure: { type: Number, default: 0 },
    relevance: { type: Number, default: 0 },
  },
  strengths: [String],
  improvements: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resume', ResumeSchema);
