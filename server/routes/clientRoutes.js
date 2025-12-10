const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');

// Get projects for logged-in client
router.get('/projects', protect, async (req, res) => {
    try {
        const projects = await Project.find({ client: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
