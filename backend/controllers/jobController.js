const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const Resume = require('../models/Resume');

// @desc    Get all jobs with filters and matching percentage
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const { keyword, location, experience, jobType } = req.query;
    
    // Build query object
    const query = {};
    
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { overview: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (experience) {
      // mapping experience levels e.g. "2-5 Years"
      query.experience = { $regex: experience, $options: 'i' };
    }
    
    if (jobType && jobType !== 'All') {
      query.jobType = { $regex: jobType, $options: 'i' };
    }

    const jobs = await Job.find(query);
    
    // Calculate dynamic match percentage based on user's profile skills
    const user = await User.findById(req.user._id);
    const userSkills = (user.skills || []).map(s => s.toLowerCase());

    const jobsWithMatch = jobs.map(job => {
      const jobSkills = (job.skills || []).map(s => s.toLowerCase());
      
      let matchCount = 0;
      jobSkills.forEach(skill => {
        if (userSkills.includes(skill) || userSkills.some(us => us.includes(skill) || skill.includes(us))) {
          matchCount++;
        }
      });

      // Calculate score
      let matchPercentage = 0;
      if (jobSkills.length > 0) {
        matchPercentage = Math.round((matchCount / jobSkills.length) * 90); 
      } else {
        matchPercentage = 50; // fallback if no skills are listed on the job
      }
      
      // Fine-tune title matching
      const userTitle = (user.targetTitle || '').toLowerCase();
      const jobTitle = job.title.toLowerCase();
      if (jobTitle.includes(userTitle) || userTitle.split(' ').some(w => jobTitle.includes(w))) {
        matchPercentage = Math.min(100, matchPercentage + 10);
      }

      return {
        ...job.toObject(),
        matchPercentage: Math.min(100, matchPercentage)
      };
    });

    // Sort by match percentage descending
    jobsWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json(jobsWithMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job by ID with detailed match statistics
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    const user = await User.findById(req.user._id);
    const userSkills = (user.skills || []).map(s => s.toLowerCase());
    
    // Determine detailed match checks
    const jobSkills = (job.skills || []).map(s => s.toLowerCase());
    
    const skillChecks = job.skills.map(skill => {
      const sLower = skill.toLowerCase();
      const isMatched = userSkills.includes(sLower) || userSkills.some(us => us.includes(sLower) || sLower.includes(us));
      return {
        name: skill,
        status: isMatched ? 'Match' : 'Missing'
      };
    });

    const matchCount = skillChecks.filter(c => c.status === 'Match').length;
    let matchPercentage = 0;
    if (jobSkills.length > 0) {
      matchPercentage = Math.round((matchCount / jobSkills.length) * 90);
    } else {
      matchPercentage = 50;
    }

    const userTitle = (user.targetTitle || '').toLowerCase();
    const jobTitle = job.title.toLowerCase();
    const titleMatch = jobTitle.includes(userTitle) || userTitle.split(' ').some(w => jobTitle.includes(w));
    if (titleMatch) {
      matchPercentage = Math.min(100, matchPercentage + 10);
    }

    // Dynamic "Why you're a good fit" checks
    const whyFit = [];
    if (titleMatch) {
      whyFit.push('Your experience matches the required role');
    } else {
      whyFit.push('Your profile aligns with similar engineering/design roles');
    }

    if (matchPercentage >= 80) {
      whyFit.push('You have the right skills and tools for this job');
    } else {
      whyFit.push('You possess several core capabilities needed');
    }

    if (user.profileStrength >= 70) {
      whyFit.push('Your profile is highly relevant to this job');
    }

    res.json({
      job,
      matchPercentage,
      skillChecks,
      whyFit
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle save/bookmark job
// @route   POST /api/jobs/:id/save
// @access  Private
const toggleSaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.id;

    if (!user.savedJobs) {
      user.savedJobs = [];
    }

    const isSaved = user.savedJobs.includes(jobId);
    
    if (isSaved) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();
    
    res.json({
      isSaved: !isSaved,
      savedJobs: user.savedJobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's saved/bookmarked jobs
// @route   GET /api/jobs/saved
// @access  Private
const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json(user.savedJobs || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Private
const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user has already applied
    const alreadyApplied = await Application.findOne({
      user: req.user._id,
      job: req.params.id
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Set a dynamic mock status (e.g. Google puts it under review, Zoho is Applied, Microsoft is Interview)
    let status = 'Applied';
    if (job.company === 'Google') status = 'Under Review';
    if (job.company === 'Microsoft') status = 'Interview';

    // Get user's current ATS score from Resume
    const resume = await Resume.findOne({ user: req.user._id });
    const atsScore = resume ? resume.atsScore : (req.user.profileStrength || 75);

    const application = await Application.create({
      user: req.user._id,
      job: req.params.id,
      status,
      atsScore
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's job applications
// @route   GET /api/jobs/applications
// @access  Private
const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new job (Recruiter only)
// @route   POST /api/jobs
// @access  Private/Recruiter
const createJob = async (req, res) => {
  try {
    const { title, company, location, experience, salary, jobType, overview, requirements, skills } = req.body;

    const reqsArray = Array.isArray(requirements)
      ? requirements
      : (typeof requirements === 'string' ? requirements.split(',').map(s => s.trim()).filter(Boolean) : []);

    const skillsArray = Array.isArray(skills)
      ? skills
      : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []);

    const newJob = await Job.create({
      title,
      company,
      location,
      experience,
      salary,
      jobType,
      overview,
      requirements: reqsArray,
      skills: skillsArray,
      logo: company ? company.charAt(0).toUpperCase() : 'J',
      recruiter: req.user._id
    });

    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recruiter dashboard data (jobs and applications)
// @route   GET /api/jobs/recruiter/dashboard
// @access  Private/Recruiter
const getRecruiterDashboard = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ postedAt: -1 });
    const jobIds = jobs.map(j => j._id);
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('user', 'name email skills targetTitle profileStrength')
      .populate('job', 'title company location');
    
    // Fetch resumes for these users to get their actual resume ATS scores
    const userIds = applications.map(app => app.user._id);
    const resumes = await Resume.find({ user: { $in: userIds } });
    
    // Create a map of userId -> atsScore
    const resumeMap = {};
    resumes.forEach(r => {
      resumeMap[r.user.toString()] = r.atsScore;
    });

    // Add atsScore to each application object
    const appsWithScore = applications.map(app => {
      const appObj = app.toObject();
      appObj.atsScore = appObj.atsScore || resumeMap[app.user?._id?.toString()] || app.user?.profileStrength || 75; // fallback
      return appObj;
    });

    // Sort applications by atsScore descending
    appsWithScore.sort((a, b) => b.atsScore - a.atsScore);

    res.json({ jobs, applications: appsWithScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status (Recruiter only)
// @route   PUT /api/jobs/applications/:id
// @access  Private/Recruiter
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Applied', 'Under Review', 'Interview', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.job._id);
    if (!job || job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to manage this application' });
    }

    application.status = status;
    await application.save();

    // Populate user and job before returning
    const updatedApplication = await Application.findById(application._id)
      .populate('user', 'name email skills targetTitle profileStrength')
      .populate('job', 'title company location');

    const resume = await Resume.findOne({ user: updatedApplication.user._id });
    const appObj = updatedApplication.toObject();
    appObj.atsScore = resume ? resume.atsScore : (updatedApplication.user.profileStrength || 75);

    res.json(appObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete/Withdraw application (Candidate only)
// @route   DELETE /api/jobs/applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to withdraw this application' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  toggleSaveJob,
  getSavedJobs,
  applyToJob,
  getUserApplications,
  createJob,
  getRecruiterDashboard,
  updateApplicationStatus,
  deleteApplication
};
