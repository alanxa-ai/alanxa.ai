const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/submissions';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/submissions/');
    },
    filename: function (req, file, cb) {
        // Create unique filename: submission-timestamp-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'submission-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Allow ZIP, Images, Docs, CSV, JSON
    const allowedExtensions = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|csv|zip|rar|json|txt/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    // Mimetype check is tricky for generic files, relying mostly on extension for now or broad types
    // We can loosen strict mimetype check for diverse project files

    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error('File type not allowed! Allowed: Images, PDF, Docs, CSV, JSON, ZIP'));
    }
};

const projectUpload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: fileFilter
});

module.exports = projectUpload;
