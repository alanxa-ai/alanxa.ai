const mongoose = require('mongoose');

const clientRequestSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    service: { type: String, required: true },
    otherService: { type: String },
    languages: { type: String },
    volume: { type: String },
    notes: { type: String },
    status: { type: String, default: 'Pending' } // Pending, Contacted, Closed
}, { timestamps: true });

module.exports = mongoose.model('ClientRequest', clientRequestSchema);
