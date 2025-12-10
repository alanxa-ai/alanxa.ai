const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');

// Get projects for logged-in freelancer
router.get('/projects', protect, async (req, res) => {
    try {
        console.log('Freelancer Dashboard Request for User ID:', req.user.id);

        // Find projects where user is in 'freelancers' array OR is the 'freelancer' (legacy/single)
        const projects = await Project.find({
            $or: [
                { freelancers: { $in: [req.user.id] } },
                { freelancer: req.user.id }
            ]
        }).sort({ createdAt: -1 });

        console.log(`Found ${projects.length} projects for user ${req.user.id}`);
        res.json(projects);
    } catch (error) {
        console.error('Error fetching freelancer projects:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update progress
router.put('/projects/:id/progress', protect, async (req, res) => {
    try {
        const { progress, completedItems } = req.body;
        const updateData = { progress };
        if (completedItems !== undefined) updateData.completedItems = completedItems;

        const project = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                $or: [
                    { freelancers: { $in: [req.user.id] } },
                    { freelancer: req.user.id }
                ]
            },
            updateData,
            { new: true }
        );
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit Work
router.post('/projects/:id/submit', protect, async (req, res) => {
    try {
        console.log('Submission received for project:', req.params.id, 'User:', req.user.id);
        console.log('Body:', req.body);
        const { description, fileUrl } = req.body;
        const project = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                $or: [
                    { freelancers: { $in: [req.user.id] } },
                    { freelancer: req.user.id }
                ]
            },
            {
                $push: { submissions: { description, fileUrl } },
                status: 'For Review' // Auto-update status
            },
            { new: true }
        );
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
