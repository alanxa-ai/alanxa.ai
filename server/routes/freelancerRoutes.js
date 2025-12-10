const express = require('express');
const router = express.Router();
const { createApplication, getAllApplications } = require('../controllers/freelancerController');
const { protect, adminOnly } = require('../middleware/authMiddleware'); // Fixed import

const upload = require('../middleware/uploadMiddleware');

router.post('/', upload.single('resume'), createApplication);
router.get('/', protect, adminOnly, getAllApplications); // Protect getting list

module.exports = router;
