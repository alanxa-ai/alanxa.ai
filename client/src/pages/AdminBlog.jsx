import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Link as LinkIcon, X } from 'lucide-react';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'AI Training',
    author: {
      name: '',
      role: '',
      avatar: ''
    },
    featuredImage: '',
    readTime: '5 min read',
    published: false,
    tags: []
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const createSlug = (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('author.')) {
      const authorField = name.split('.')[1];
      setFormData({
        ...formData,
        author: { ...formData.author, [authorField]: value }
      });
    } else if (name === 'tags') {
      setFormData({ ...formData, tags: value.split(',').map(tag => tag.trim()) });
    } else if (name === 'title') {
       // Auto-generate slug if not editing an existing specific slug
       const newSlug = createSlug(value);
       setFormData({ 
           ...formData, 
           title: value,
           slug: (!editingBlog) ? newSlug : formData.slug // Only auto-update if creating
       });
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleEditorChange = (content) => {
      setFormData({ ...formData, content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await axios.put(`http://localhost:5000/api/blogs/${editingBlog._id}`, formData);
        alert('Blog updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/blogs', formData);
        alert('Blog created successfully!');
      }
      setShowForm(false);
      setEditingBlog(null);
      resetForm();
      fetchBlogs();
    } catch (error) {
      alert('Error saving blog: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      ...blog,
      slug: blog.slug || '',
      tags: blog.tags || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`);
        alert('Blog deleted successfully!');
        fetchBlogs();
      } catch (error) {
        alert('Error deleting blog: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'AI Training',
      author: { name: '', role: '', avatar: '' },
      featuredImage: '',
      readTime: '5 min read',
      published: false,
      tags: []
    });
  };

  const modules = {
      toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          ['link', 'image'],
          ['clean']
      ],
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Blog Posts</h1>
          <button
            onClick={() => { setShowForm(!showForm); setEditingBlog(null); resetForm(); }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Blog
          </button>
        </div>

        {/* Blog Form - Compact */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl mb-6 border border-gray-200 shadow-lg"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                {editingBlog ? 'Edit Blog' : 'Create New Blog'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none"
                    placeholder="Enter title"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug</label>
                  <div className="flex items-center">
                    <span className="bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg px-3 py-2 text-gray-500 text-xs text-nowrap">/blog/</span>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded-r-lg border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <input 
                     type="text" 
                     name="category"
                     value={formData.category}
                     onChange={handleChange}
                     className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Read Time</label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    placeholder="e.g., 5 min read"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Excerpt</label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Short summary..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Content</label>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <ReactQuill 
                        theme="snow"
                        value={formData.content}
                        onChange={handleEditorChange}
                        modules={modules}
                        className="h-48 mb-10"
                      />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Author Name</label>
                  <input
                    type="text"
                    name="author.name"
                    value={formData.author.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Author Role</label>
                  <input
                    type="text"
                    name="author.role"
                    value={formData.author.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                  <input
                    type="text"
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="published"
                      checked={formData.published}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-bold text-gray-700">Publish Immediately</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow transition-colors"
                >
                  {editingBlog ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingBlog(null); resetForm(); }}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 border border-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Blogs List Compact */}
        <div className="grid grid-cols-1 gap-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow flex items-center justify-between group">
              <div className="flex-1 min-w-0 pr-4">
                 <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${blog.published ? 'bg-green-500' : 'bg-yellow-400'}`}></span>
                    <h3 className="text-base font-bold text-gray-900 truncate">{blog.title}</h3>
                 </div>
                 <p className="text-xs text-slate-500 truncate mb-2">{blog.excerpt}</p>
                 <div className="flex gap-2">
                     <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">{blog.category}</span>
                     <span className="text-[10px] text-gray-400 py-0.5">{new Date(blog.createdAt).toLocaleDateString()}</span>
                 </div>
              </div>
              
              <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(blog)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {blogs.length === 0 && (
              <div className="text-center py-12 text-gray-400">No blog posts found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
