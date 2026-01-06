require('dotenv').config();
const { sendEmail } = require('./utils/sendEmail');
const { getOtpTemplate } = require('./utils/emailTemplates');

const testDelivery = async () => {
    console.log('--- STARTING DELIVERY DIAGNOSTIC ---');
    console.log('Timestamp:', new Date().toISOString());

    // Check Env
    console.log('Check BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'Present (' + process.env.BREVO_API_KEY.substring(0, 5) + '...)' : 'MISSING');
    console.log('Check GMAIL_USER:', process.env.GMAIL_USER);

    // Test Email
    const targetEmail = process.env.GMAIL_USER; // Send to self
    console.log(`Target Recipient: ${targetEmail}`);

    try {
        const otp = '999888';
        const html = getOtpTemplate(otp);

        console.log('Calling sendEmail()...');
        await sendEmail(targetEmail, `DIAGNOSTIC TEST: ${otp}`, html);
        console.log('--- sendEmail() COMPLETED SUCCESSFULLY ---');
        console.log('If you see this, the code thinks it sent the email.');
    } catch (error) {
        console.error('--- sendEmail() FAILED ---');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        if (error.response) {
            console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
};

testDelivery();
