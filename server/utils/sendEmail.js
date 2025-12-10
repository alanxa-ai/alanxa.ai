const nodemailer = require('nodemailer');
const SibApiV3Sdk = require('sib-api-v3-sdk');

/**
 * Send email with Gmail SMTP as primary and Brevo as fallback
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 */
const sendEmail = async (to, subject, htmlContent) => {
    // Priority 1: Try Gmail SMTP first
    try {
        console.log('Attempting to send email via Gmail SMTP...');
        await sendViaGmail(to, subject, htmlContent);
        console.log('✓ Email sent successfully via Gmail SMTP');
        return;
    } catch (gmailError) {
        console.error('✗ Gmail SMTP failed:', gmailError.message);
        console.log('Falling back to Brevo...');

        // Priority 2: Fallback to Brevo
        try {
            await sendViaBrevo(to, subject, htmlContent);
            console.log('✓ Email sent successfully via Brevo (fallback)');
            return;
        } catch (brevoError) {
            console.error('✗ Brevo also failed:', brevoError.message);
            throw new Error('Email sending failed: Both Gmail SMTP and Brevo failed');
        }
    }
};

/**
 * Send email via Gmail SMTP using nodemailer
 */
const sendViaGmail = async (to, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    const mailOptions = {
        from: `"Alanxa Team" <${process.env.GMAIL_USER}>`,
        to: to,
        subject: subject,
        html: htmlContent
    };

    await transporter.sendMail(mailOptions);
};

/**
 * Send email via Brevo API
 */
const sendViaBrevo = async (to, subject, htmlContent) => {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = {
        name: "Alanxa Team",
        email: process.env.GMAIL_USER || "noreply@alanxa.ai"
    };
    sendSmtpEmail.to = [{ email: to }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = sendEmail;
