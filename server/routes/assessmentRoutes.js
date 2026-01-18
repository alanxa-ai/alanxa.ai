const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const assessmentController = require('../controllers/assessmentController');
const sebConfig = require('../utils/sebConfig');

// Ensure SOP upload directory exists
const sopUploadDir = path.join(__dirname, '..', 'uploads', 'sop');
if (!fs.existsSync(sopUploadDir)) {
    fs.mkdirSync(sopUploadDir, { recursive: true });
}

// Configure multer for SOP uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, sopUploadDir),
    filename: (req, file, cb) => {
        const uniqueName = `sop-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Allowed: PDF, DOC, DOCX, TXT, PPT, PPTX'));
        }
    }
});

// ============ ADMIN ROUTES ============

// CRUD operations
router.post('/', authMiddleware.protect, assessmentController.createAssessment);
router.get('/admin', authMiddleware.protect, assessmentController.getAdminAssessments);
router.put('/:id', authMiddleware.protect, assessmentController.updateAssessment);
router.delete('/:id', authMiddleware.protect, assessmentController.deleteAssessment);

// Assignment
router.post('/:id/assign', authMiddleware.protect, assessmentController.assignAssessment);

// Submissions management
router.get('/:id/submissions', authMiddleware.protect, assessmentController.getAssessmentSubmissions);
router.put('/submission/:id/grade', authMiddleware.protect, assessmentController.gradeSubmission);
router.post('/submission/:id/reassign', authMiddleware.protect, assessmentController.reassignSubmission);

// File upload
router.post('/upload-sop', authMiddleware.protect, upload.single('sop'), assessmentController.uploadSOP);

// ============ SEB INTEGRATION ROUTES ============

// Generate and download SEB config file for an assessment
router.get('/:id/seb-config', authMiddleware.protect, async (req, res) => {
    try {
        const Assessment = require('../models/Assessment');
        const assessment = await Assessment.findById(req.params.id);

        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        // Build the assessment URL
        const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host').replace(':5000', ':5173')}`;
        const assessmentUrl = `${baseUrl}/assessment/${assessment._id}`;

        // Generate SEB config
        const config = sebConfig.generateSEBConfig({
            assessmentUrl,
            assessmentTitle: assessment.title,
            timeLimit: assessment.timeLimit,
            allowQuit: false,
            enableCamera: assessment.proctoring?.requireCamera || true,
            allowVirtualMachine: false,
            allowScreenCapture: false
        });

        // Generate SEB file
        const sebFile = sebConfig.generateSEBFile(config);

        // Set headers for download
        const filename = `${assessment.title.replace(/[^a-z0-9]/gi, '_')}_SEB.seb`;
        res.setHeader('Content-Type', 'application/x-seb');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(sebFile);

    } catch (error) {
        console.error('Error generating SEB config:', error);
        res.status(500).json({ message: 'Error generating SEB configuration' });
    }
});

// Check if request is from SEB browser
router.get('/check-seb', (req, res) => {
    const isSEB = sebConfig.isSEBBrowser(req);
    res.json({
        isSEB,
        userAgent: req.headers['user-agent'],
        message: isSEB ? 'Safe Exam Browser detected' : 'Not using Safe Exam Browser'
    });
});

// Get SEB launch link for an assessment
router.get('/:id/seb-link', authMiddleware.protect, async (req, res) => {
    try {
        const Assessment = require('../models/Assessment');
        const assessment = await Assessment.findById(req.params.id);

        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
        const configUrl = `${baseUrl}/api/assessments/${assessment._id}/seb-config`;
        const sebLink = sebConfig.getSEBLaunchLink(configUrl);

        res.json({
            sebLink,
            configUrl,
            downloadInstructions: 'Download Safe Exam Browser from https://safeexambrowser.org/download_en.html'
        });

    } catch (error) {
        console.error('Error generating SEB link:', error);
        res.status(500).json({ message: 'Error generating SEB link' });
    }
});

// ============ FREELANCER ROUTES ============

router.get('/my-assessments', authMiddleware.protect, assessmentController.getFreelancerAssessments);
router.post('/submission/:id/start', authMiddleware.protect, assessmentController.startAssessment);
router.post('/submission/:id/submit', authMiddleware.protect, assessmentController.submitAssessment);
router.post('/submission/:id/violation', authMiddleware.protect, assessmentController.logViolation);

module.exports = router;


