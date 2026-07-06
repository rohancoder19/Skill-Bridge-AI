const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getUserResume,
  createOrUpdateResume,
  uploadAndAnalyzeResume,
  improveResume
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

// Setup multer in-memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.route('/')
  .get(protect, getUserResume)
  .post(protect, createOrUpdateResume);

router.post('/upload', protect, upload.single('resume'), uploadAndAnalyzeResume);
router.post('/improve', protect, improveResume);

module.exports = router;
