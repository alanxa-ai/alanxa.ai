const mongoose = require('mongoose');

const FreelancerApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    languages: { type: String, required: true },
    experience: { type: String }, // Projects worked on
    resume: { type: String }, // URL or path
    interests: [{ type: String }], // Annotation, QA, etc.
    otherSkill: { type: String }, // If "Other" is selected in interests
    position: { type: String },
    availability: { type: String },
    country: { type: String }, // Location/Region
    countryOther: { type: String }, // If "Other" is selected in country
    device: { type: String }, // Android, iOS, Both, Laptop/PC
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FreelancerApplication', FreelancerApplicationSchema);

