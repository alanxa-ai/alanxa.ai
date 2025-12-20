const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    Get all active jobs
// @route   GET /api/jobs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find({ active: true }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Get all jobs (Admin - includes inactive)
// @route   GET /api/jobs/admin
// @access  Private/Admin
router.get('/admin', protect, adminOnly, async (req, res) => {
    try {
        const jobs = await Job.find({}).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const job = new Job(req.body);
        const newJob = await job.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        await Job.deleteOne({ _id: req.params.id });
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
