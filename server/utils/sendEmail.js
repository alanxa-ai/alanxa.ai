const nodemailer = require('nodemailer');
const SibApiV3Sdk = require('sib-api-v3-sdk');

/**
 * Send email with Gmail SMTP as primary and Brevo as fallback
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 */
const sendEmail = async (to, subject, htmlContent) => {
    // Priority 1: Try Gmail SMTP first (User Request)
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
            if (brevoError.status === 401 || (brevoError.response && brevoError.response.status === 401)) {
                console.error("👉 ACTION REQUIRED: Your BREVO_API_KEY is invalid or unauthorized. Please check server/.env");
            }
            // In fire-and-forget mode, we throw so the caller's .catch() can log it, 
            // but it won't crash the already-sent HTTP response.
            throw new Error('Email sending failed: Both Gmail and Brevo failed');
        }
    }
};

/**
 * Send email via Gmail SMTP using nodemailer
 */
const sendViaGmail = async (to, subject, htmlContent) => {
    // Common Fix: Remove spaces from the App Password if user copied them
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, '') : '';

    if (!user || !pass) {
        throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD in .env");
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });

    // Verify connection configuration
    await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
            if (error) {
                console.log("---------------------------------------------------");
                console.log("🔴 GMAIL CONNECT ERROR: ", error.response || error.message);
                if (error.response && error.response.includes('535')) {
                    console.log("👉 ACTION REQUIRED: Your GMAIL_APP_PASSWORD in server/.env is incorrect or expired.");
                    console.log("   1. Go to https://myaccount.google.com/apppasswords");
                    console.log("   2. Generate a new App Password.");
                    console.log("   3. Paste it into server/.env (spaces are fine, we remove them).");
                }
                console.log("---------------------------------------------------");
                reject(error);
            } else {
                console.log("🟢 Gmail Server is ready");
                resolve(success);
            }
        });
    });

    const mailOptions = {
        from: `"Alanxa Team" <${user}>`,
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
    if (!process.env.BREVO_API_KEY) {
        throw new Error("BREVO_API_KEY is not set");
    }

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = {
        name: "Alanxa",
        email: "noreply@alanxa.ai"
    };
    sendSmtpEmail.to = [{ email: to }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = sendEmail;
