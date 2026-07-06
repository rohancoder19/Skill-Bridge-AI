const Resume = require('../models/Resume');
const User = require('../models/User');
const { analyzeResumeAsync, parseResumeTextAsync, parseResumeBufferAsync } = require('../utils/geminiAnalyzer');

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

async function parseResume(fileBuffer) {
  try {
    const data = await pdfParse(fileBuffer);
    
    // Check if text was successfully extracted
    if (!data.text || data.text.trim().length === 0) {
      throw new Error("No readable text found in this PDF file.");
    }
    
    return data.text;
  } catch (error) {
    // This print statement is crucial for your Cloud Run logs
    console.error("PDF Parsing Error detail:", error.message);
    throw error; // Pass it to your router to trigger fallback or return 400
  }
}

// @desc    Analyze uploaded resume file (simulation)
// @route   POST /api/resumes/upload
// @access  Private
const uploadAndAnalyzeResume = async (req, res) => {
  try {
    const { targetRole } = req.body;
    console.log('uploadAndAnalyzeResume triggered. targetRole:', targetRole, 'File:', req.file ? req.file.originalname : 'None');
    let fileName = 'Uploaded_Resume.pdf';
    let textContent = '';
    let parsedData = null;
    let isParsedDirectly = false;

    if (req.file) {
      fileName = req.file.originalname;
      const fileExt = fileName.split('.').pop().toLowerCase();
      console.log('File extension:', fileExt, 'Buffer size:', req.file.buffer.length);
      
      if (fileExt === 'pdf') {
        try {
          console.log('Attempting Gemini Multimodal PDF parser directly...');
          parsedData = await parseResumeBufferAsync(req.file.buffer, 'application/pdf', targetRole || 'product designer');
          console.log('Gemini Multimodal PDF parse successful!');
          isParsedDirectly = true;
        } catch (multimodalErr) {
          console.warn('Gemini Multimodal PDF parse failed, trying local pdf-parse fallback:', multimodalErr.message);
          textContent = await parseResume(req.file.buffer);
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
        throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
      }
    } else {
      textContent = req.body.text || '';
    }

    if (!isParsedDirectly) {
      if (!textContent || textContent.trim().length < 100) {
        throw new Error(`Could not extract sufficient text from the uploaded file (extracted ${textContent ? textContent.trim().length : 0} characters). The file might be scanned, image-only, or encrypted. Please upload a text-based PDF/DOCX file, or manually enter your details.`);
      }

      console.log('Extracted textContent length:', textContent.length, 'Preview:', textContent.substring(0, 100).replace(/\n/g, ' '));
      console.log('Invoking parseResumeTextAsync...');
      parsedData = await parseResumeTextAsync(textContent, targetRole || 'product designer');
      console.log('parseResumeTextAsync successfully completed. Result keys:', Object.keys(parsedData));
    }
    
    // Save to database
    let resume = await Resume.findOne({ user: req.user._id });
    const resumeData = {
      user: req.user._id,
      personalInfo: parsedData.personalInfo,
      education: parsedData.education || [],
      workExperience: parsedData.workExperience || [],
      internships: parsedData.internships || [],
      projects: parsedData.projects || [],
      achievements: parsedData.achievements || [],
      certificates: parsedData.certificates || [],
      skills: parsedData.skills || [],
      atsScore: parsedData.atsScore,
      scoreMetrics: parsedData.scoreMetrics,
      strengths: parsedData.strengths || [],
      improvements: parsedData.improvements || [],
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

    // Update User model targetTitle, skills, and profileStrength
    const user = await User.findById(req.user._id);
    if (user) {
      user.targetTitle = parsedData.personalInfo?.title || targetRole || user.targetTitle;
      if (parsedData.skills && parsedData.skills.length > 0) {
        user.skills = parsedData.skills.map(s => typeof s === 'string' ? s : s.name).filter(Boolean);
      }
      user.profileStrength = parsedData.atsScore;
      await user.save();
    }

    res.json({
      fileName,
      parsedData,
      resume,
      user
    });
  } catch (error) {
    console.error('Error in uploadAndAnalyzeResume:', error);
    res.status(500).json({ message: error.message || error });
  }
};

// @desc    Improve user's resume using AI/rules
// @route   POST /api/resumes/improve
// @access  Private
const improveResume = async (req, res) => {
  try {
    const { targetRole } = req.body;
    let resume = await Resume.findOne({ user: req.user._id });
    
    if (!resume) {
      return res.status(404).json({ message: 'No resume found to improve. Please upload or create one first.' });
    }

    const role = targetRole || resume.personalInfo?.title || req.user.targetTitle || 'product designer';
    
    // Call optimizer
    const { improveResumeAsync } = require('../utils/resumeImprover');
    const improvedData = await improveResumeAsync(resume, role);

    // Save optimized resume to database
    resume.personalInfo = improvedData.personalInfo;
    resume.skills = improvedData.skills;
    resume.education = improvedData.education || [];
    resume.workExperience = improvedData.workExperience || [];
    resume.internships = improvedData.internships || [];
    resume.projects = improvedData.projects || [];
    resume.achievements = improvedData.achievements || [];
    resume.certificates = improvedData.certificates || [];
    if (improvedData.additionalInfo) {
      resume.additionalInfo = improvedData.additionalInfo;
    }
    resume.atsScore = improvedData.atsScore;
    resume.scoreMetrics = improvedData.scoreMetrics;
    resume.strengths = improvedData.strengths || [];
    resume.improvements = improvedData.improvements || [];
    
    await resume.save();

    // Also update User profile targetTitle, skills, and profileStrength
    const user = await User.findById(req.user._id);
    if (user) {
      user.targetTitle = improvedData.personalInfo?.title || role;
      if (improvedData.skills && improvedData.skills.length > 0) {
        user.skills = improvedData.skills.map(s => typeof s === 'string' ? s : s.name).filter(Boolean);
      }
      user.profileStrength = improvedData.atsScore;
      await user.save();
    }

    res.json(resume);
  } catch (error) {
    console.error('Error in improveResume controller:', error);
    res.status(500).json({ message: error.message || 'Failed to improve resume.' });
  }
};

module.exports = {
  getUserResume,
  createOrUpdateResume,
  uploadAndAnalyzeResume,
  improveResume
};

