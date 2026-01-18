const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
    type: { type: String, enum: ['tab_switch', 'window_blur', 'fullscreen_exit', 'camera_blocked'], required: true },
    timestamp: { type: Date, default: Date.now }
});

const answerSchema = new mongoose.Schema({
    questionIndex: { type: Number, required: true },
    answer: mongoose.Schema.Types.Mixed, // String for subjective, Number for MCQ
    isCorrect: Boolean, // Set after grading
    pointsEarned: { type: Number, default: 0 }
});

const submissionSchema = new mongoose.Schema({
    assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [answerSchema],
    score: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    status: { type: String, enum: ['assigned', 'in_progress', 'completed', 'failed', 'disqualified'], default: 'assigned' },
    startedAt: Date,
    submittedAt: Date,
    timeSpent: Number, // Seconds
    violations: [violationSchema],
    violationCount: { type: Number, default: 0 }
}, { timestamps: true });

// Compound index to prevent duplicate submissions
submissionSchema.index({ assessment: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model('AssessmentSubmission', submissionSchema);
