import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api';
import CloudinaryImageUpload from '../components/CloudinaryImageUpload';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const quillRef = React.useRef(null);

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
    published: true,
    tags: []
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const getAuthHeaders = () => {
      const token = localStorage.getItem('token');
      return {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      };
  };

  const fetchBlogs = async () => {
    try {
      // Use Admin API to see all blogs including drafts
      const response = await api.get('/api/admin/blogs', getAuthHeaders());
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Fallback to public API if admin fails (though unlikely for admin user)
      if (error.response && error.response.status === 401) {
          alert("Unauthorized. Please login again.");
      }
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
        await api.put(`/api/blogs/${editingBlog._id}`, formData);
        alert('Blog updated successfully!');
      } else {
        await api.post('/api/blogs', formData, getAuthHeaders());
        alert('Blog created successfully!');
      }
      setShowForm(false);
      setEditingBlog(null);
      resetForm();
      fetchBlogs(); // This will now fetch from Admin API
    } catch (error) {
      console.error(error);
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
        await api.delete(`/api/blogs/${id}`);
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

      published: true, // Default to true
      tags: []
    });
  };

  const imageHandler = React.useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
             alert("File is too big! Max 5MB.");
             return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'alanxa');

        try {
           // Show some loading indicator if possible, or just wait
           const res = await api.post('https://api.cloudinary.com/v1_1/dikppmnyhp/image/upload', formData);
           const url = res.data.secure_url;
           
           const editor = quillRef.current.getEditor();
           const range = editor.getSelection();
           editor.insertEmbed(range ? range.index : 0, 'image', url);
        } catch (err) {
           console.error('Error uploading image', err);
           alert('Image upload failed');
        }
      }
    };
  }, []);

  const modules = React.useMemo(() => ({
      toolbar: {
          container: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              ['link', 'image'],
              ['clean']
          ],
          handlers: {
              image: imageHandler
          }
      }
  }), [imageHandler]);

  return (
    <div className="bg-black min-h-screen pt-20 pb-12 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">Blog Posts</h1>
          <button
            onClick={() => { setShowForm(!showForm); setEditingBlog(null); resetForm(); }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-base font-bold hover:bg-indigo-700 shadow-md flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" /> New Blog
          </button>
        </div>

        {/* Blog Form - Compact */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0F1C] p-6 rounded-xl mb-6 border border-gray-800 shadow-lg"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">
                {editingBlog ? 'Edit Blog' : 'Create New Blog'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-300 hover:text-gray-200"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-base text-white rounded-lg border border-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none bg-black placeholder-gray-500"
                    placeholder="Enter title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-300 uppercase mb-1">Slug</label>
                  <div className="flex items-center">
                    <span className="bg-gray-800 border border-r-0 border-gray-700 rounded-l-lg px-3 py-2 text-gray-300 text-sm text-nowrap">/blog/</span>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-base text-white rounded-r-lg border border-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none font-mono text-sm bg-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 uppercase mb-1">Category</label>
                   <input 
                     type="text" 
                     name="category"
                     value={formData.category}
                     onChange={handleChange}
                     className="w-full px-3 py-2 text-base text-white rounded-lg border border-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none bg-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 uppercase mb-1">Read Time</label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    placeholder="e.g., 5 min read"
                    className="w-full px-3 py-2 text-base text-white rounded-lg border border-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none bg-black placeholder-gray-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 uppercase mb-1">Excerpt</label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="w-full px-3 py-2 text-base text-white rounded-lg border border-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none resize-none bg-black placeholder-gray-500"
                    placeholder="Short summary..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 uppercase mb-1">Content</label>
                  <div className="bg-black rounded-lg border border-gray-700">
                      <ReactQuill 
                        ref={quillRef}
                        theme="snow"
                        value={formData.content}
                        onChange={handleEditorChange}
                        modules={modules}
                        className="h-64 mb-12"
                      />
                      <style>{`
                        .ql-editor {
                            min-height: 200px;
                            font-size: 18px;
                            color: #e2e8f0; 
                            background-color: #000;
                            border: 1px solid #374151;
                            border-radius: 0.5rem;
                        }
                        .ql-container {
                            font-family: 'Inter', sans-serif;
                            font-size: 18px;
                        }
                        .ql-editor.ql-blank::before {
                            color: #64748b;
                            font-style: normal;
                        }
                        .ql-toolbar.ql-snow {
                            border: 1px solid #374151;
                            background-color: #000;
                            color: #fff;
                            border-radius: 0.5rem 0.5rem 0 0;
                        }
                        .ql-toolbar.ql-snow .ql-stroke {
                            stroke: #e2e8f0;
                        }
                        .ql-toolbar.ql-snow .ql-fill {
                            fill: #e2e8f0;
                        }
                        .ql-toolbar.ql-snow .ql-picker {
                            color: #e2e8f0;
                        }
                      `}</style>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 uppercase mb-1">Author Name</label>
                  <input
                    type="text"
                    name="author.name"
                    value={formData.author.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-base text-white rounded-lg border border-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none bg-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 uppercase mb-1">Author Role</label>
                  <input
                    type="text"
                    name="author.role"
                    value={formData.author.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-base text-white rounded-lg border border-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none bg-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Featured Image</label>
                  {/* Current Image Preview */}
                  {formData.featuredImage && (
                    <div className="mb-3 relative group w-fit">
                        <img src={formData.featuredImage} alt="Current" className="h-24 w-auto rounded-lg border border-gray-700 object-cover" />
                        <button 
                            type="button" 
                            onClick={() => setFormData({...formData, featuredImage: ''})}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 focus:outline-none"
                        >
                            <X size={12} />
                        </button>
                    </div>
                  )}
                  {/* Upload Component */}
                  {!formData.featuredImage && (
                    <CloudinaryImageUpload 
                        folder="alanxa/blogs"
                        onUploadSuccess={(url) => setFormData({...formData, featuredImage: url})}
                    />
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="published"
                      checked={formData.published}
                      onChange={handleChange}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded"
                    />
                    <span className="text-base font-bold text-gray-200">Publish Immediately</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-base font-bold hover:bg-indigo-700 shadow transition-colors"
                >
                  {editingBlog ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingBlog(null); resetForm(); }}
                  className="px-6 py-2.5 bg-gray-800 text-gray-300 rounded-lg text-base font-bold hover:bg-gray-700 border border-gray-700 transition-colors"
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
            <div key={blog._id} className="bg-[#0A0F1C] border border-gray-800 rounded-xl p-4 hover:shadow-md transition-shadow flex items-center justify-between group">
              <div className="flex-1 min-w-0 pr-4">
                 <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${blog.published ? 'bg-green-500' : 'bg-yellow-400'}`}></span>
                    <h3 className="text-xl font-bold text-white truncate">{blog.title}</h3>
                 </div>
                 <p className="text-sm text-gray-300 truncate mb-2">{blog.excerpt}</p>
                 <div className="flex gap-2">
                     <span className="px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 text-xs font-bold uppercase">{blog.category}</span>
                     <span className="text-xs text-gray-400 py-1">{new Date(blog.createdAt).toLocaleDateString()}</span>
                 </div>
              </div>
              
              <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(blog)}
                  className="p-2 text-indigo-400 hover:bg-indigo-900/30 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="p-2 text-red-500 hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {blogs.length === 0 && (
              <div className="text-center py-12 text-gray-300 text-lg">No blog posts found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
