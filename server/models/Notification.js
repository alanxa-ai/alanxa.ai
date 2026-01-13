const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['announcement', 'project_update', 'system'],
        default: 'announcement'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Recipients - if empty, means all freelancers
    recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Optional project reference for project-specific announcements
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    // Track who has read the notification
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // For targeting: 'all' means all freelancers, 'project' means project freelancers
    targetType: {
        type: String,
        enum: ['all', 'project'],
        default: 'all'
    }
}, { timestamps: true });

// Index for efficient querying
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ recipients: 1 });
notificationSchema.index({ sender: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
