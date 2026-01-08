const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/resumes';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes/');
    },
    filename: function (req, file, cb) {
        // Create unique filename: fieldname-timestamp-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Debugging: exact file details
    // Debugging: exact file details
    // console.log(`[Upload Debug] Processing file: ${file.originalname} | Mime: ${file.mimetype}`);

    // Handle potential encoding issues in originalname
    const originalName = file.originalname || '';
    const fileExtension = path.extname(originalName).toLowerCase().replace('.', '');

    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const hasValidExtension = allowedExtensions.includes(fileExtension);

    // Known safe MIME types (not including octet-stream as it's too generic)
    const safeMimeTypes = [
        'application/pdf',
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.google-apps.document', // Google Docs
        'application/wps-office.doc', // WPS
    ];

    // Fallback MIME types (risky, only allow if extension is also valid)
    const fallbackMimeTypes = [
        'application/octet-stream' // Binary fallback
    ];

    const hasSafeMime = safeMimeTypes.includes(file.mimetype);
    const hasFallbackMime = fallbackMimeTypes.includes(file.mimetype);

    // Allow if:
    // 1. Has a known safe MIME type (regardless of extension), OR
    // 2. Has a valid extension AND the MIME is either safe or a fallback
    if (hasSafeMime || (hasValidExtension && (hasSafeMime || hasFallbackMime))) {
        return cb(null, true);
    } else {
        console.error(`[Upload Error] Invalid file type. Ext: ${fileExtension} (valid: ${hasValidExtension}), SafeMime: ${hasSafeMime}, FallbackMime: ${hasFallbackMime} (${file.mimetype})`);
        cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

module.exports = upload;
