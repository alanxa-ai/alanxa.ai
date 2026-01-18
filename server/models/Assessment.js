const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    type: { type: String, enum: ['mcq', 'subjective'], required: true },
    question: { type: String, required: true },
    options: [String], // For MCQ questions
    correctAnswer: Number, // Index of correct option for MCQ
    points: { type: Number, default: 1 }
});

const assessmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
    sopDocuments: [String], // File URLs
    timeLimit: { type: Number, default: 30 }, // Minutes
    passingScore: { type: Number, default: 70 }, // Percentage
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['draft', 'active', 'archived'], default: 'draft' },
    proctoring: {
        enabled: { type: Boolean, default: true },
        allowTabSwitch: { type: Boolean, default: false },
        maxViolations: { type: Number, default: 3 },
        requireCamera: { type: Boolean, default: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
