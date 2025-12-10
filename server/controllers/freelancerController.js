const FreelancerApplication = require('../models/FreelancerApplication');

// Create new application
exports.createApplication = async (req, res) => {
    try {
        const { name, email, phone, languages, experience, interests, availability } = req.body;

        let resumeUrl = '';
        if (req.file) {
            // Convert backslashes to forward slashes for URL path
            resumeUrl = `${req.protocol}://${req.get('host')}/uploads/resumes/${req.file.filename}`;
        }

        const newApplication = new FreelancerApplication({
            name,
            email,
            phone,
            languages,
            experience,
            resume: resumeUrl,
            interests: JSON.parse(interests || '[]'), // Multer sends arrays/objects as strings
            availability
        });

        await newApplication.save();
        res.status(201).json({ message: 'Application submitted successfully', result: newApplication });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get all applications
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await FreelancerApplication.find().sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
