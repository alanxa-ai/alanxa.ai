import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail as MailIcon, Phone as PhoneIcon, Send as SendIcon, 
  Sparkles as SparklesIcon, MessageSquare as MessageSquareIcon, 
  Linkedin as LinkedinIcon, ExternalLink as ExternalLinkIcon,
  MapPin as MapPinIcon, Clock as ClockIcon, Twitter as TwitterIcon, 
  Instagram as InstagramIcon, Facebook as FacebookIcon, AtSign as ThreadsIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // In a real app, this would hit /api/contact
    toast.success('Message sent! We usually reply within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* 1. Contact Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=800&fit=crop&q=80"
            alt="Contact Us"
            className="w-full h-full object-cover opacity-40 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-50"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block p-3 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
               <MessageSquareIcon className="w-6 h-6 text-blue-300" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light">
              Have questions about our services, pricing, or custom projects? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Cards (Left) */}
          <div className="lg:col-span-1 space-y-6">
             {/* General Inquiry */}
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
             >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <MailIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Email Us</h3>
                        <p className="text-xs text-gray-400">For general inquiries</p>
                    </div>
                </div>
                <a href="mailto:contact@alanxa.com" className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors block">
                    contact@alanxa.com
                </a>
             </motion.div>

             {/* WhatsApp / Phone */}
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
             >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <PhoneIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">WhatsApp</h3>
                        <p className="text-xs text-gray-400">Quick chat support</p>
                    </div>
                </div>
                <a href="https://wa.me/916392525639" className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors block">
                    +91 6392 525 639
                </a>
             </motion.div>

             {/* Social */}
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3 }}
               className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
             >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <LinkedinIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Follow Us</h3>
                        <p className="text-xs text-gray-400">Join our community</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <a href="https://www.linkedin.com/company/alanxa" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded-lg hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-colors">
                        <LinkedinIcon className="w-5 h-5" />
                    </a>
                    <a href="https://x.com/alanxa_ai" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded-lg hover:bg-black/5 text-gray-500 hover:text-black transition-colors">
                        <TwitterIcon className="w-5 h-5" />
                    </a>
                    <a href="https://www.instagram.com/alanxa.ai/" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded-lg hover:bg-pink-50 text-gray-500 hover:text-pink-600 transition-colors">
                        <InstagramIcon className="w-5 h-5" />
                    </a>
                    <a href="https://www.facebook.com/alanxa.ai" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors">
                        <FacebookIcon className="w-5 h-5" />
                    </a>
                    <a href="https://www.threads.net/@alanxa.ai" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
                        <ThreadsIcon className="w-5 h-5" />
                    </a>
                </div>
             </motion.div>
          </div>

          {/* Contact Form (Right - Main) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10"
          >
             <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
             
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-600">Your Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="John Doe"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-600">Email Address</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="john@example.com"
                      />
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-sm font-semibold text-gray-600">Subject</label>
                   <input 
                     type="text" 
                     name="subject" 
                     required 
                     value={formData.subject}
                     onChange={handleChange}
                     className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                     placeholder="Project Inquiry / Support"
                   />
                </div>

                <div className="space-y-1">
                   <label className="text-sm font-semibold text-gray-600">Message</label>
                   <textarea 
                     name="message" 
                     rows={6} 
                     required 
                     value={formData.message}
                     onChange={handleChange}
                     className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                     placeholder="Tell us how we can help..."
                   ></textarea>
                </div>

                <button type="submit" className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                   <SendIcon className="w-5 h-5" /> Send Message
                </button>
             </form>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default Contact;
