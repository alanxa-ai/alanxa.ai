require('dotenv').config();

if (process.env.BREVO_API_KEY) {
    console.log("BREVO_KEY_PRESENT");
} else {
    console.log("BREVO_KEY_MISSING");
}

if (process.env.GMAIL_USER) {
    console.log("GMAIL_USER_PRESENT");
} else {
    console.log("GMAIL_USER_MISSING");
}
