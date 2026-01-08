const mongoose = require('mongoose');

const formFieldSchema = new mongoose.Schema({
    fieldId: { type: String, required: true },
    label: { type: String, required: true },
    type: {
        type: String,
        enum: ['text', 'email', 'phone', 'textarea', 'select', 'checkbox-group', 'file', 'country', 'device'],
        required: true
    },
    placeholder: { type: String, default: '' },
    required: { type: Boolean, default: false },
    options: [{ type: String }] // For select and checkbox-group
}, { _id: false });

const formTemplateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    fields: [formFieldSchema],
    isDefault: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

formTemplateSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('FormTemplate', formTemplateSchema);
