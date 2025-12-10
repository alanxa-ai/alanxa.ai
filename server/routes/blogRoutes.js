const express = require('express');
const router = express.Router();
const { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog, subscribe } = require('../controllers/blogController');

// Public routes
router.post('/subscribe', subscribe);
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Admin routes (should add auth middleware later)
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
