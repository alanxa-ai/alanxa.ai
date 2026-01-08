const mongoose = require('mongoose');

const dynamicApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    formTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'FormTemplate' },
    jobTitle: { type: String }, // Denormalized for easy display
    formData: { type: Map, of: mongoose.Schema.Types.Mixed }, // { fieldId: value }
    resumeUrl: { type: String },
    status: { type: String, enum: ['Pending', 'Reviewing', 'Approved', 'Rejected'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DynamicApplication', dynamicApplicationSchema);
