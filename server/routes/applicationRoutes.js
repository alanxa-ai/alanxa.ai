const express = require('express');
const router = express.Router();
const DynamicApplication = require('../models/DynamicApplication');
const Job = require('../models/Job');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer disk storage for local file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'resume-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOC, DOCX allowed.'));
        }
    }
});

// @desc    Submit a dynamic application
// @route   POST /api/applications
// @access  Public
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const { jobId, formTemplateId, formData } = req.body;

        let resumeUrl = '';

        // Handle file upload if present - use local path
        if (req.file) {
            resumeUrl = `/uploads/resumes/${req.file.filename}`;
        }

        // Parse formData if it's a string (from FormData submission)
        let parsedFormData = formData;
        if (typeof formData === 'string') {
            parsedFormData = JSON.parse(formData);
        }

        // Get job title for denormalization
        let jobTitle = '';
        if (jobId) {
            const job = await Job.findById(jobId);
            if (job) jobTitle = job.title;
        }

        const application = new DynamicApplication({
            jobId: jobId || null,
            formTemplateId: formTemplateId || null,
            jobTitle,
            formData: parsedFormData,
            resumeUrl,
            status: 'Pending'
        });

        await application.save();

        res.status(201).json({
            message: 'Application submitted successfully',
            applicationId: application._id
        });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ message: 'Error submitting application', error: error.message });
    }
});

module.exports = router;
