const Blog = require('../models/Blog');
const Subscriber = require('../models/Subscriber');
const sendEmail = require('../utils/sendEmail');
const mongoose = require('mongoose');

// Helper to create slug
const createSlug = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
};

// ... existing functions ...

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        // Send Welcome Email
        const subject = 'Welcome to Alanxa AI Newsletter';
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #4F46E5;">Alanxa</h1>
                </div>
                <h2 style="color: #333;">Welcome to our community!</h2>
                <p style="color: #666; line-height: 1.6;">Hi there,</p>
                <p style="color: #666; line-height: 1.6;">Thank you for subscribing to the Alanxa newsletter. You'll now receive the latest updates on AI trends, our new case studies, and industry insights directly in your inbox.</p>
                <p style="color: #666; line-height: 1.6;">Stay tuned for our next update!</p>
                <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999;">
                    <p>&copy; ${new Date().getFullYear()} Alanxa AI. All rights reserved.</p>
                    <p>You can unsubscribe at any time.</p>
                </div>
            </div>
        `;

        // Don't block response on email sending
        sendEmail(email, subject, htmlContent).catch(err => console.error("Welcome email failed", err));

        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        console.error("Subscription error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single blog by ID or Slug
exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        let query = {};

        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            query = { slug: id };
        }

        const blog = await Blog.findOne(query);

        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        // Increment views
        blog.views += 1;
        await blog.save();

        res.status(200).json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create blog (Admin only)
exports.createBlog = async (req, res) => {
    try {
        let blogData = req.body;

        // Auto-generate slug if not provided
        if (!blogData.slug || blogData.slug.trim() === '') {
            blogData.slug = createSlug(blogData.title);
        } else {
            blogData.slug = createSlug(blogData.slug);
        }

        // Check for duplicate slug
        const existingBlog = await Blog.findOne({ slug: blogData.slug });
        if (existingBlog) {
            blogData.slug = `${blogData.slug}-${Date.now()}`; // Ensure uniqueness
        }

        const newBlog = new Blog(blogData);
        await newBlog.save();
        res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Slug must be unique based on title' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Update blog (Admin only)
exports.updateBlog = async (req, res) => {
    try {
        let updateData = req.body;
        if (updateData.slug) {
            updateData.slug = createSlug(updateData.slug);
        }

        const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete blog (Admin only)
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
