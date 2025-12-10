const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Legacy support
    freelancers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'For Review', 'Approved', 'Completed'],
        default: 'Pending'
    },
    category: { type: String, required: true }, // e.g. "Text & NLP"
    serviceType: { type: String, required: true }, // e.g. "Sentiment Analysis"
    progress: { type: Number, default: 0 },

    // Detailed Task Tracking
    totalItems: { type: Number, default: 0 }, // e.g. 1000
    completedItems: { type: Number, default: 0 }, // e.g. 500
    unit: { type: String, default: 'Task' }, // e.g. "Images", "Rows", "Seconds"

    deadline: { type: Date },
    freelancerNotes: { type: String },
    adminNotes: { type: String },
    taskData: { type: mongoose.Schema.Types.Mixed }, // Flexible for "data annotation" details
    submissions: [{
        description: String,
        fileUrl: String,
        submittedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
