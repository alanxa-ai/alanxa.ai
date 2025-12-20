const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }, // Rich text or long text
    shortDescription: { type: String },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance'], default: 'Freelance' },
    category: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    salary: { type: String }, // e.g., "$20/hr" or "Competitive"
    skills: [String], // Array of skill strings
    requirements: [String], // Array of requirement strings
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
