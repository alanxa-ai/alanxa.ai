const nodemailer = require('nodemailer');
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Brevo API key rotation tracking
const QUOTA_LIMIT = 290; // Switch before hitting 300 limit
let brevoKeyCounters = {
    key1: 0,
    key2: 0
};
let currentKeyIndex = 0; // 0 = key1, 1 = key2

// Reset counters daily (at midnight)
const resetCountersDaily = () => {
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;

    setTimeout(() => {
        console.log('🔄 Resetting Brevo API key counters (daily reset)');
        brevoKeyCounters = { key1: 0, key2: 0 };
        currentKeyIndex = 0;
        resetCountersDaily(); // Schedule next reset
    }, msUntilMidnight);
};
resetCountersDaily();

/**
 * Send general emails via Gmail SMTP ONLY
 * Used for: confirmations, notifications, newsletters, etc.
 */
const sendEmail = async (to, subject, htmlContent) => {
    console.log('Sending email via Gmail SMTP...');
    await sendViaGmail(to, subject, htmlContent);
    console.log('✓ Email sent successfully via Gmail SMTP');
};

/**
 * Send OTP emails via Brevo API with automatic key rotation
 * Reserved ONLY for OTP/verification emails
 */
const sendOtpEmail = async (to, subject, htmlContent) => {
    console.log('Sending OTP email via Brevo...');
    await sendViaBrevo(to, subject, htmlContent);
    console.log('✓ OTP Email sent successfully via Brevo');
};

/**
 * Send email via Gmail SMTP using nodemailer
 */
const sendViaGmail = async (to, subject, htmlContent) => {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, '') : '';

    if (!user || !pass) {
        throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD in .env");
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
    });

    await new Promise((resolve, reject) => {
        transporter.verify((error, success) => {
            if (error) {
                console.log("🔴 GMAIL CONNECT ERROR:", error.message);
                reject(error);
            } else {
                console.log("🟢 Gmail Server is ready");
                resolve(success);
            }
        });
    });

    const mailOptions = {
        from: `"Alanxa Team" <${user}>`,
        to,
        subject,
        html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Gmail Send Info:", info.response);
};

/**
 * Send email via Brevo API with automatic key rotation (290 emails per key)
 * RESERVED FOR OTP ONLY
 */
const sendViaBrevo = async (to, subject, htmlContent) => {
    const apiKeys = [];

    // Load available Brevo API keys - Key 2 first (Key 1 limit already reached today)
    if (process.env.BREVO_API_KEY_2) {
        apiKeys.push({ key: process.env.BREVO_API_KEY_2, name: 'key2' });
    }
    if (process.env.BREVO_API_KEY) {
        apiKeys.push({ key: process.env.BREVO_API_KEY, name: 'key1' });
    }

    if (apiKeys.length === 0) {
        throw new Error("No BREVO_API_KEY is set in environment variables");
    }

    // Determine which key to use based on counters
    const getNextKeyIndex = () => {
        const counters = [brevoKeyCounters.key1, brevoKeyCounters.key2];

        // If current key is under limit, use it
        if (counters[currentKeyIndex] < QUOTA_LIMIT) {
            return currentKeyIndex;
        }

        // Find a key that's under limit
        for (let i = 0; i < apiKeys.length; i++) {
            const idx = (currentKeyIndex + 1 + i) % apiKeys.length;
            const keyName = apiKeys[idx].name;
            if (brevoKeyCounters[keyName] < QUOTA_LIMIT) {
                currentKeyIndex = idx;
                return idx;
            }
        }

        // All keys exhausted - use first key anyway (will fail or Brevo might have reset)
        currentKeyIndex = 0;
        return 0;
    };

    let lastError = null;
    const startIndex = getNextKeyIndex();

    // Try keys starting from the selected one
    for (let attempt = 0; attempt < apiKeys.length; attempt++) {
        const idx = (startIndex + attempt) % apiKeys.length;
        const { key: currentKey, name: keyName } = apiKeys[idx];
        const keyLabel = idx === 0 ? 'Key 1' : `Key 2`;
        const count = brevoKeyCounters[keyName];

        try {
            console.log(`Trying Brevo ${keyLabel} (${count}/${QUOTA_LIMIT} used)...`);

            const defaultClient = SibApiV3Sdk.ApiClient.instance;
            const apiKeyAuth = defaultClient.authentications['api-key'];
            apiKeyAuth.apiKey = currentKey;

            const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
            const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

            sendSmtpEmail.subject = subject;
            sendSmtpEmail.htmlContent = htmlContent;
            sendSmtpEmail.sender = {
                name: "Alanxa",
                email: "founder@alanxa.com"
            };
            sendSmtpEmail.to = [{ email: to }];

            await apiInstance.sendTransacEmail(sendSmtpEmail);

            // Success! Increment counter
            brevoKeyCounters[keyName]++;
            console.log(`✓ Email sent via Brevo ${keyLabel} (${brevoKeyCounters[keyName]}/${QUOTA_LIMIT})`);

            // Check if we should switch for next request
            if (brevoKeyCounters[keyName] >= QUOTA_LIMIT) {
                console.log(`⚠️ ${keyLabel} reached limit. Will use next key for future requests.`);
                currentKeyIndex = (idx + 1) % apiKeys.length;
            }

            return; // Success!

        } catch (error) {
            lastError = error;
            const status = error.status || (error.response && error.response.status);
            console.error(`✗ Brevo ${keyLabel} failed: ${error.message} (Status: ${status})`);

            // Mark this key as exhausted if rate limited
            if (status === 429 || status === 402) {
                brevoKeyCounters[keyName] = QUOTA_LIMIT; // Mark as full
            }
            continue;
        }
    }

    throw lastError || new Error('All Brevo API keys failed');
};

module.exports = { sendEmail, sendOtpEmail, sendViaGmail, sendViaBrevo };
