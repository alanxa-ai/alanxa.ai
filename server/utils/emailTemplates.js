/**
 * Alanxa Email Templates
 * Professional, consistently styled email templates
 */

const { CLIENT_URL } = require('../config/constants');

const LOGO_URL = "https://res.cloudinary.com/dikppmyhp/image/upload/v1766079716/logo-white-2025-12-07_l8o3v6.png";
const COMPANY_NAME = "Alanxa";
const SUPPORT_EMAIL = "support@alanxa.ai";
const WEBSITE_URL = CLIENT_URL; // Using centralized config

// Common Email Wrapper
const wrapEmail = (content, title) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { font-family: 'Inter', Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding-bottom: 40px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .header { background-color: #000000; padding: 32px 0; text-align: center; background-image: linear-gradient(to right, #000000, #111827); }
        .logo { height: 32px; width: auto; }
        .content { padding: 40px 48px; }
        .footer { background-color: #f9fafb; padding: 32px 20px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        .button { display: inline-block; background-color: #4F46E5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; font-size: 16px; margin-top: 24px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2); transition: background-color 0.2s; }
        .button:hover { background-color: #4338CA; }
        
        /* Specific Component Styles */
        .otp-box { background-color: #eff6ff; border: 1px dashed #3b82f6; padding: 20px; font-size: 32px; letter-spacing: 8px; font-weight: 700; text-align: center; margin: 30px 0; color: #1e40af; border-radius: 8px; font-family: monospace; }
        
        .credentials-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 24px 0; }
        .credential-row { margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        .credential-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 700; display: block; margin-bottom: 4px; letter-spacing: 0.05em; }
        .value { font-size: 16px; color: #0f172a; font-family: 'Courier New', monospace; font-weight: 600; }
        
        h1 { color: #111827; margin-top: 0; margin-bottom: 24px; font-size: 26px; font-weight: 700; letter-spacing: -0.025em; }
        p { margin-bottom: 16px; font-size: 16px; color: #374151; }
        
        .social-links { margin-top: 20px; }
        .social-link { display: inline-block; margin: 0 8px; color: #9ca3af; text-decoration: none; font-weight: 500; }
        .social-link:hover { color: #4F46E5; }
        
        .highlight-box { background-color: #f5f3ff; border-left: 4px solid #7c3aed; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0; }
        
        /* Mobile Responsiveness */
        @media only screen and (max-width: 620px) {
            .container { width: 100% !important; border-radius: 0; }
            .content { padding: 30px 20px; }
            .header { padding: 24px 0; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div style="padding: 20px;">
            <div class="container">
                <div class="header">
                     <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Alanxa</h1>
                </div>
                <div class="content">
                    ${content}
                </div>
                <div class="footer">
                    <p style="margin: 0; font-size: 14px;">&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
                    <div class="social-links" style="margin-top: 16px;">
                        <a href="${WEBSITE_URL}" class="social-link">Website</a> &bull; 
                        <a href="mailto:${SUPPORT_EMAIL}" class="social-link">Support</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

// 1. OTP Template
const getOtpTemplate = (otp) => {
    const content = `
        <h1>Verify Your Email</h1>
        <p>Thank you for choosing ${COMPANY_NAME}. To complete your registration or login request, please use the following One-Time Password (OTP).</p>
        
        <div class="otp-box">${otp}</div>
        
        <p>This code is valid for 10 minutes. Do not share this code with anyone.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
    `;
    return wrapEmail(content, "Your Verification Code");
};

// 2. Confirmation Template (Welcome/Verified)
const getConfirmationTemplate = (name, action = "account verification") => {
    const content = `
        <h1>Success!</h1>
        <p>Hello ${name},</p>
        <p>We are pleased to inform you that your ${action} was successful.</p> 
        <p>You can now access your account and explore all the features of the ${COMPANY_NAME} platform.</p>
        
        <div style="text-align: center;">
            <a href="${WEBSITE_URL}/login" class="button" style="display: inline-block; background-color: #4F46E5; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; font-size: 16px;">Go to Dashboard</a>
        </div>
        
        <p style="margin-top: 30px;">Need help? Reply to this email or contact support.</p>
    `;
    return wrapEmail(content, "Confirmation: Action Successful");
};

// 3. Newsletter Template
const getNewsletterTemplate = (title, mainContent, linkUrl) => {
    const content = `
        <span style="display:inline-block; background:#EEF2FF; color:#4F46E5; padding:4px 12px; border-radius:100px; font-size:12px; font-weight:bold; margin-bottom:15px;">Latest Update</span>
        <h1>${title}</h1>
        <div style="color: #4b5563; font-size: 16px;">
            ${mainContent}
        </div>
        
        ${linkUrl ? `
        <div style="text-align: center; margin-top: 30px;">
            <a href="${linkUrl}" class="button" style="display: inline-block; background-color: #4F46E5; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; font-size: 16px;">Read More</a>
        </div>
        ` : ''}
    `;
    return wrapEmail(content, `Newsletter: ${title}`);
};

// 4. Credentials Template (Client/Freelancer)
const getCredentialsTemplate = (name, email, password, role) => {
    const content = `
        <h1>Welcome to ${COMPANY_NAME}</h1>
        <p>Hello ${name},</p>
        <p>Your account has been successfully created as a <strong>${role}</strong>. Below are your temporary login credentials.</p>
        
        <div class="credentials-box">
            <div class="credential-row">
                <span class="label">Username / Email</span>
                <span class="value">${email}</span>
            </div>
            <div class="credential-row">
                <span class="label">Temporary Password</span>
                <span class="value">${password}</span>
            </div>
            <div class="credential-row">
                <span class="label">Role</span>
                <span class="value" style="text-transform: capitalize;">${role}</span>
            </div>
        </div>
        
        <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 15px; margin-bottom: 20px; font-size: 14px; color: #be123c;">
            <strong>Security Notice:</strong> Please login immediately and change your password to secure your account.
        </div>
        
        <div style="text-align: center;">
            <a href="${WEBSITE_URL}/login" class="button" style="display: inline-block; background-color: #4F46E5; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; font-size: 16px;">Login Now</a>
        </div>
    `;
    return wrapEmail(content, `Your New ${COMPANY_NAME} Account`);
};

// 5. Contact Form Admin Notification
const getContactFormAdminTemplate = (data) => {
    const content = `
        <h1>New Contact Inquiry</h1>
        <p>A new message has been submitted via the website contact form.</p>
        
        <div class="credentials-box">
            <div class="credential-row">
                <span class="label">Sender Name</span>
                <span class="value" style="font-family: inherit; font-weight: bold;">${data.name}</span>
            </div>
            <div class="credential-row">
                <span class="label">Email Address</span>
                <span class="value" style="font-family: inherit;">
                    <a href="mailto:${data.email}" style="color: #6366F1;">${data.email}</a>
                </span>
            </div>
            <div class="credential-row">
                <span class="label">Subject</span>
                <span class="value" style="font-family: inherit;">${data.subject || 'No Subject'}</span>
            </div>
        </div>
        
        <p style="font-weight: bold; margin-bottom: 5px;">Message Content:</p>
        <div class="highlight-box">
            ${data.message.replace(/\n/g, '<br>')}
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <a href="mailto:${data.email}?subject=Re: ${data.subject || 'Your Inquiry'}" class="button" style="display: inline-block; background-color: #4F46E5; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; font-size: 16px;">Reply to User</a>
        </div>
    `;
    return wrapEmail(content, `New Contact: ${data.subject || 'Inquiry'}`);
};

module.exports = {
    getOtpTemplate,
    getConfirmationTemplate,
    getNewsletterTemplate,
    getCredentialsTemplate,
    getContactFormAdminTemplate
};
