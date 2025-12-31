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
    console.log(`[Upload Debug] Processing file: ${file.originalname} | Mime: ${file.mimetype}`);

    const allowedExtensions = /pdf|doc|docx/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

    // Expanded Mime Types for better compatibility
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.google-apps.document', // Google Docs
        'application/wps-office.doc', // WPS
        'application/octet-stream' // Binary fallback (risky but needed sometimes)
    ];

    const mimetype = allowedMimeTypes.includes(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        console.error(`[Upload Error] Invalid file type. Ext: ${extname}, MimeValid: ${mimetype} (${file.mimetype})`);
        cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

module.exports = upload;
