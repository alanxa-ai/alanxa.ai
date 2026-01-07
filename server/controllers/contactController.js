const { sendEmail } = require('../utils/sendEmail');
const { getContactFormAdminTemplate } = require('../utils/emailTemplates');

exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const emailSubject = `New Contact Form Submission: ${subject || 'General Inquiry'}`;
        const emailContent = getContactFormAdminTemplate({ name, email, subject, message });

        // Send to admin
        await sendEmail('aman.shaikh@alanxa.ai', emailSubject, emailContent);

        // Optional: Send auto-reply to user?
        // For now, just confirming to the user that we got it is enough via the UI.

        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
};
