const Resume = require('../models/Resume');
const { analyzeResumeAsync, parseResumeTextAsync } = require('../utils/geminiAnalyzer');

// @desc    Get user's resume
// @route   GET /api/resumes
// @access  Private
const getUserResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({ user: req.user._id });
    
    // If user has no resume, create a default blank one
    if (!resume) {
      resume = await Resume.create({
        user: req.user._id,
        personalInfo: {
          fullName: req.user.name,
          email: req.user.email,
          title: req.user.targetTitle,
          summary: req.user.summary
        },
        skills: req.user.skills.map(s => ({ name: s, level: 85 })),
        education: [],
        workExperience: [],
        projects: [],
        achievements: [],
        certificates: []
      });
      
      // Calculate initial ATS score
      const analysis = await analyzeResumeAsync(resume, req.user.targetTitle);
      resume.atsScore = analysis.atsScore;
      resume.scoreMetrics = analysis.scoreMetrics;
      resume.strengths = analysis.strengths;
      resume.improvements = analysis.improvements;
      await resume.save();
    }
    
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update user's resume
// @route   POST /api/resumes
// @access  Private
const createOrUpdateResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({ user: req.user._id });
    
    // Run ATS analysis on the submitted resume data
    const targetTitle = req.body.personalInfo?.title || req.user.targetTitle || 'product designer';
    const analysis = await analyzeResumeAsync(req.body, targetTitle);

    const resumeData = {
      user: req.user._id,
      personalInfo: req.body.personalInfo,
      education: req.body.education,
      workExperience: req.body.workExperience,
      internships: req.body.internships,
      projects: req.body.projects,
      achievements: req.body.achievements,
      certificates: req.body.certificates,
      skills: req.body.skills,
      additionalInfo: req.body.additionalInfo,
      templateStyle: req.body.templateStyle,
      atsScore: analysis.atsScore,
      scoreMetrics: analysis.scoreMetrics,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
    };

    if (resume) {
      resume = await Resume.findOneAndUpdate(
        { user: req.user._id },
        { $set: resumeData },
        { new: true }
      );
    } else {
      resume = new Resume(resumeData);
      await resume.save();
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// @desc    Analyze uploaded resume file (simulation)
// @route   POST /api/resumes/upload
// @access  Private
const uploadAndAnalyzeResume = async (req, res) => {
  try {
    const { targetRole } = req.body;
    let fileName = 'Uploaded_Resume.pdf';
    let textContent = '';

    if (req.file) {
      fileName = req.file.originalname;
      const fileExt = fileName.split('.').pop().toLowerCase();
      
      if (fileExt === 'pdf') {
        try {
          const data = await pdfParse(req.file.buffer);
          textContent = data.text;
        } catch (pdfErr) {
          console.warn('pdf-parse failed, attempting raw ASCII extraction fallback:', pdfErr.message);
          const bufferStr = req.file.buffer.toString('binary');
          const matches = bufferStr.match(/[\x20-\x7E\s]{4,}/g);
          textContent = matches ? matches.join(' ') : '';
          if (!textContent || textContent.trim().length < 50) {
            throw pdfErr; // Rethrow if we couldn't extract any meaningful text
          }
        }
      } else if (fileExt === 'docx') {
        try {
          const result = await mammoth.extractRawText({ buffer: req.file.buffer });
          textContent = result.value;
        } catch (docxErr) {
          console.warn('mammoth failed, attempting raw text extraction fallback:', docxErr.message);
          const bufferStr = req.file.buffer.toString('utf8');
          textContent = bufferStr.replace(/[^\x20-\x7E\s]/g, ' ');
          if (!textContent || textContent.trim().length < 50) {
            throw docxErr; // Rethrow if we couldn't extract any meaningful text
          }
        }
      } else if (fileExt === 'txt') {
        textContent = req.file.buffer.toString('utf8');
      } else {
        // Fallback for unsupported formats
        throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
      }
    } else {
      textContent = req.body.text || '';
    }

    if (!textContent || textContent.trim() === '') {
      throw new Error('Could not extract text from the uploaded file.');
    }

    const parsedData = await parseResumeTextAsync(textContent, targetRole || 'product designer');
    
    res.json({
      fileName,
      parsedData
    });
  } catch (error) {
    console.error('Error in uploadAndAnalyzeResume:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserResume,
  createOrUpdateResume,
  uploadAndAnalyzeResume
};

