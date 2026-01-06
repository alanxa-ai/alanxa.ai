require('dotenv').config();
const { sendViaGmail } = require('./utils/sendEmail');
const { getOtpTemplate } = require('./utils/emailTemplates');

const runGmailLoadTest = async () => {
    const TOTAL_EMAILS = 50;
    const targetEmail = process.env.GMAIL_USER;

    console.log(`--- GMAIL LOAD TEST: ${TOTAL_EMAILS} Emails ---`);
    console.log(`Target: ${targetEmail}`);
    console.log('Note: This might be slow because the current implementation verifies the SMTP connection for every single email.');

    if (!targetEmail) {
        console.error("GMAIL_USER not set.");
        return;
    }

    let success = 0;
    let failed = 0;
    const startTime = Date.now();

    // Run in batches of 5 to avoid overwhelming local network/sockets immediately, 
    // but still fast enough to stress test.
    // Or just Promise.all all of them if we want true stress.
    // Let's do all at once to see if it breaks.

    const emailPromises = Array.from({ length: TOTAL_EMAILS }).map(async (_, i) => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const html = getOtpTemplate(otp);
        try {
            await sendViaGmail(targetEmail, `Gmail Load Test ${i + 1}`, html);
            process.stdout.write('.');
            return true;
        } catch (err) {
            process.stdout.write('X');
            // Store error for summary if needed, or just log first few
            return false;
        }
    });

    const results = await Promise.all(emailPromises);

    const duration = (Date.now() - startTime) / 1000;
    success = results.filter(Boolean).length;
    failed = results.length - success;

    console.log('\n\n--- GMAIL RESULTS ---');
    console.log(`Success: ${success}`);
    console.log(`Failed: ${failed}`);
    console.log(`Time: ${duration}s`);
    console.log(`Rate: ${(success / duration).toFixed(2)} emails/sec`);
};

runGmailLoadTest();
