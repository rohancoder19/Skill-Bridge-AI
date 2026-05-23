const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/jobController');
const { protect, recruiter } = require('../middleware/auth');

router.route('/')
  .get(protect, getJobs)
  .post(protect, recruiter, createJob);

router.get('/recruiter/dashboard', protect, recruiter, getRecruiterDashboard);
router.route('/applications/:id')
  .put(protect, recruiter, updateApplicationStatus)
  .delete(protect, deleteApplication);

router.get('/saved', protect, getSavedJobs);
router.get('/applications', protect, getUserApplications);
router.get('/:id', protect, getJobById);
router.post('/:id/save', protect, toggleSaveJob);
router.post('/:id/apply', protect, applyToJob);

module.exports = router;
