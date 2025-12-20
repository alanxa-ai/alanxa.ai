import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Share2, Tag, BookOpen } from 'lucide-react';
import api from '../utils/api';
import 'react-quill-new/dist/quill.snow.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/api/blogs/${id}`);
      setBlog(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center pt-24 text-center px-4">
        <div className="bg-[#0A0F1C] p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-800">
            <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Article Not Found</h2>
            <p className="text-gray-300 mb-6">The article you are looking for does not exist or has been removed.</p>
            <Link to="/blog" className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Intelligence Hub
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-20 pb-16 font-sans selection:bg-indigo-900 selection:text-white">
      <article className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Navigation */}
        <Link to="/blog" className="inline-flex items-center text-gray-300 hover:text-indigo-400 mb-6 transition-colors group font-bold text-sm uppercase tracking-wide">
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
          Back to Articles
        </Link>

        {/* Header */}
        <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
        >
           <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-2.5 py-0.5 bg-indigo-900/30 text-indigo-300 rounded-md text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
                {blog.category}
              </span>
           </div>

           <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
             {blog.title}
           </h1>

           <div className="flex items-center justify-center gap-4 text-sm text-gray-300 border-b border-gray-800 pb-6 mb-6">
              <div className="flex items-center">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold mr-2">
                    {blog.author.name.charAt(0)}
                 </div>
                 <span className="font-bold text-white">{blog.author.name}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-600"></div>
              <div className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {new Date(blog.createdAt).toLocaleDateString()}
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-600"></div>
              <div className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {blog.readTime || '5 min'}
              </div>
           </div>
        </motion.header>

        {/* Featured Image - Compact */}
        {blog.featuredImage && (
            <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 relative rounded-xl overflow-hidden shadow-sm border border-gray-800"
            >
            <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-[250px] md:h-[320px] object-cover"
            />
            </motion.div>
        )}

        {/* Content */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
          {/* Excerpt */}
          <div className="text-base md:text-lg text-gray-300 font-medium mb-8 leading-relaxed italic border-l-4 border-indigo-500 pl-4 bg-[#0A0F1C] py-3 pr-3 rounded-r-lg">
            {blog.excerpt}
          </div>
          
          {/* Main Content (Rich Text with Prose) */}
          <div className="prose prose-invert prose-indigo prose-sm md:prose-base mx-auto bg-transparent focus:outline-none max-w-none">
             <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </motion.div>

        {/* Footer / Tags */}
        <div className="mt-10 pt-6 border-t border-gray-800">
           <div className="flex flex-wrap items-center gap-2">
             <Tag className="w-4 h-4 text-gray-400 mr-1" />
             {blog.tags && blog.tags.length > 0 ? (
                blog.tags.map((tag, index) => (
                  <Link 
                    to={`/blog?tag=${tag}`}
                    key={index} 
                    className="px-2.5 py-1 bg-[#1E293B] hover:bg-indigo-900/30 text-gray-300 hover:text-indigo-400 rounded-md text-xs font-bold uppercase transition-colors border border-gray-700 hover:border-indigo-500/30"
                  >
                    #{tag}
                  </Link>
                ))
             ) : (
                <span className="text-gray-300 text-sm italic">No tags</span>
             )}
           </div>
        </div>

      </article>
      
      {/* Newsletter - Very Compact */}
      <div className="max-w-2xl mx-auto px-4 mt-16">
        <div className="bg-[#0A0F1C] border border-gray-800 rounded-xl p-6 md:p-8 text-center relative overflow-hidden shadow-lg">
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left">
                    <h3 className="text-xl font-bold text-white mb-1">Join the newsletter</h3>
                    <p className="text-slate-300 text-sm">Get insights delivered weekly.</p>
                </div>
                <div className="flex w-full md:w-auto gap-2">
                    <input type="email" placeholder="Email address" className="flex-1 px-3 py-2 rounded-lg border-0 bg-white/10 text-white placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 outline-none text-sm w-full md:w-48" />
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition-colors shadow-lg text-sm whitespace-nowrap">
                        Subscribe
                    </button>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
