const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true }, // Slug for URL friendly links
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    author: {
        name: { type: String, required: true },
        role: { type: String },
        avatar: { type: String }
    },
    featuredImage: { type: String },
    readTime: { type: String, default: '5 min read' },
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
