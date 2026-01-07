const FreelancerApplication = require('../models/FreelancerApplication');
const { sendEmail } = require('../utils/sendEmail');
const { SERVER_URL, CLIENT_URL } = require('../config/constants'); // Centralized Config

// Create new application
exports.createApplication = async (req, res) => {
    try {
        const { name, email, phone, languages, experience, interests, availability } = req.body;

        let resumeUrl = '';
        if (req.file) {
            // Use centralized SERVER_URL
            const baseUrl = SERVER_URL || `${req.protocol}://${req.get('host')}`;
            resumeUrl = `${baseUrl}/uploads/resumes/${req.file.filename}`;
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

        // 1. Send Notification to Admin (Non-blocking)
        /* 
        sendEmail(
            process.env.GMAIL_USER,
            `New Freelancer Application: ${name}`,
            `<h1>New Application Received</h1>
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Role:</b> ${interests}</p>
                <p><b>Resume:</b> <a href="${resumeUrl}">${resumeUrl}</a></p>
                <br/><a href="${CLIENT_URL}/admin">Login to review</a>`
        ).catch(err => console.error("Background Admin Email Failed:", err.message));
        */

        // 2. Send Confirmation to Freelancer (Non-blocking)
        sendEmail(
            email,
            'Application Received - Alanxa AI',
            `<div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Hi ${name},</h2>
                <p>Thanks for applying to join the Alanxa AI freelancer network.</p>
                <p>We have received your application and our team is currently reviewing your profile.</p>
                <p>If your skills match our current projects, we will be in touch shortly for an interview/test.</p>
                <br/>
                <p>Best Regards,</p>
                <p><b>The Alanxa Team</b></p>
            </div>`
        ).catch(err => console.error("Background User Email Failed:", err.message));

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
