import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, ArrowRight as ArrowRightIcon, BookOpen as BookOpenIcon, 
  Lightbulb as LightbulbIcon, MessageSquare as MessageSquareIcon, Sparkles as SparklesIcon,
  Clock as ClockIcon, Search as SearchIcon
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubscribe = async (e) => {
      e.preventDefault();
      setSubscribing(true);
      try {
          await axios.post('http://localhost:5000/api/blogs/subscribe', { email });
          toast.success('Successfully subscribed!');
          setEmail('');
      } catch (error) {
          toast.error(error.response?.data?.message || 'Subscription failed');
      } finally {
          setSubscribing(false);
      }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      setArticles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  };

  const resources = [
    {
      icon: BookOpenIcon,
      title: 'Annotation Guidelines',
      desc: 'Standardized protocols for bounding boxes, NER, and sentiment analysis.',
      color: "bg-blue-500"
    },
    {
      icon: LightbulbIcon,
      title: 'AI Training Insights',
      desc: 'Expert whitepapers on RLHF, hallucination mitigation, and model safety.',
      color: "bg-yellow-500"
    },
    {
      icon: CalendarIcon,
      title: 'Monthly Webinars',
      desc: 'Join our live sessions with industry leaders.',
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* 1. Compact Hero */}
      <section className="relative pt-32 pb-12 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/90 to-slate-900/95 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80" 
            alt="Background" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 mb-4">
                 <SparklesIcon className="w-3.5 h-3.5 text-indigo-300" />
                 <span className="text-xs font-bold tracking-wider uppercase text-indigo-100">Alanxa Intelligence Hub</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">
                 Insights for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI Era</span>
              </h1>
              <p className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
                 Expert perspectives on data annotation, RLHF, and the future of human-in-the-loop AI.
              </p>
            </motion.div>
        </div>
      </section>

      {/* 2. Content Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto -mt-8 relative z-30">
         {/* Resources Strip */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {resources.map((res, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-5 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 flex items-start gap-4 hover:-translate-y-1 transition-transform"
              >
                 <div className={`p-2.5 rounded-lg ${res.color} bg-opacity-10 shrink-0`}>
                    <res.icon className={`w-5 h-5 text-${res.color.replace('bg-', '').replace('-500', '-600')}`} />
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{res.title}</h3>
                    <p className="text-xs text-gray-500 leading-snug">{res.desc}</p>
                 </div>
              </motion.div>
            ))}
         </div>

         {/* Blog Controls */}
         <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            
            <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search insights..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
            </div>
         </div>

         {/* Grid */}
         {loading ? (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
         ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {articles.map((article, index) => (
                 <motion.div 
                   key={article._id}
                   initial={{ opacity: 0, scale: 0.98 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.05 }}
                   className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 border border-gray-100 flex flex-col h-full hover:border-indigo-100"
                 >
                    <div className="h-48 overflow-hidden relative">
                       <img 
                          src={article.featuredImage || `https://source.unsplash.com/800x600/?ai,code,${article.category}`} 
                          alt={article.title} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                       />
                       <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
                          {article.category || 'Technology'}
                       </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-3 font-semibold uppercase tracking-wide">
                            <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3"/> {new Date(article.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3"/> {article.readTime || '5 min'} read</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                           {article.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow">
                           {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                            <span className="text-xs font-semibold text-gray-600">{article.author?.name || 'Alanxa Team'}</span>
                            <Link to={`/blog/${article.slug || article._id}`} className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-1">
                                Read More <ArrowRightIcon className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         ) : (
             <div className="text-center py-16 bg-white rounded-xl border border-gray-100 border-dashed">
                 <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquareIcon className="w-6 h-6 text-gray-300" />
                 </div>
                 <h3 className="text-base font-bold text-gray-900">No articles found</h3>
                 <p className="text-sm text-gray-500">Check back later for updates.</p>
             </div>
         )}
      </section>

      {/* 4. Compact Newsletter */}
      <section className="bg-slate-900 py-12 px-4 relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-2">Subscribe to our newsletter</h2>
                  <p className="text-slate-400 text-sm">Latest AI trends & insights, delivered weekly.</p>
              </div>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm" 
                  />
                  <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg" disabled={subscribing}>
                      {subscribing ? '...' : 'Subscribe'}
                  </button>
              </form>
          </div>
      </section>

    </div>
  );
};

export default Blog;
