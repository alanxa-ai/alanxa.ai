import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { 
  Building2, User, Mail, Globe, Settings, Database, 
  Send, CheckCircle, Shield, Briefcase, Linkedin, 
  Facebook, Twitter, Instagram, AtSign
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const Clients = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    country: '',
    service: '',
    otherService: '',
    volume: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/clients', formData);
      toast.success('Request received! We will contact you shortly.');
      setFormData({
        companyName: '', contactPerson: '', email: '', country: '',
        service: '', otherService: '', volume: '', notes: ''
      });
    } catch (error) {
      console.error(error);
      toast.error('Submission failed. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const steps = [
    { step: '01', title: 'Consultation', desc: 'Deep-dive into your data needs.' },
    { step: '02', title: 'Calibration', desc: 'Rapid pilot phase to set benchmarks.' },
    { step: '03', title: 'Production', desc: 'Deploying our trained workforce.' },
    { step: '04', title: 'Validation', desc: 'Multi-tier QA for 99% accuracy.' }
  ];

  return (
    <div className="bg-black min-h-screen font-sans">
      
      {/* 1. Hero Section (Compact) */}
      {/* 1. Hero Section (Professional SaaS Style) */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center overflow-hidden bg-black">
        {/* Background Image - Full Coverage - Optimized */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_640/v1766045865/0.20_second_Scale_AI_with_cczzbi.jpg"
            srcSet="
              https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_640/v1766045865/0.20_second_Scale_AI_with_cczzbi.jpg 640w,
              https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_1024/v1766045865/0.20_second_Scale_AI_with_cczzbi.jpg 1024w,
              https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_1920/v1766045865/0.20_second_Scale_AI_with_cczzbi.jpg 1920w
            "
            sizes="100vw"
            alt="Enterprise AI" 
            className="w-full h-full object-cover opacity-90"
            width="1920"
            height="1080"
            fetchPriority="high"
            decoding="async"
          />
          {/* Professional Overlay: Darker on right for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/50 to-black/90" />
        </div>

        {/* Content Container - Right Aligned */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full flex flex-col justify-center items-center text-center md:items-end md:text-right">
             {/* Removed motion.div for LCP */}
             <div className="max-w-2xl w-full">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A0F1C]/80 border border-gray-700/50 text-indigo-300 mb-6 backdrop-blur-xl hover:border-indigo-500/50 transition-colors cursor-default mx-auto md:ml-auto md:mr-0">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold">Enterprise Solutions</span>
                </div>
                
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                   Scale AI with <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-400">
                       Human Precision
                   </span>
                </h1>
                
                <p className="text-sm sm:text-lg text-white mb-8 leading-relaxed font-medium max-w-lg mx-auto md:ml-auto md:mr-0">
                   The essential human layer for top-tier AI models. Reliable, secure, and infinitely scalable data solutions tailored for the enterprise.
                </p>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                   <button 
                        onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })} 
                        className="min-w-[160px] justify-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-1 hover:shadow-indigo-500/40 flex items-center gap-2"
                   >
                      Let's Talk <CheckCircle className="w-3.5 h-3.5" />
                   </button>
                   <button 
                        onClick={() => navigate('/blog')}
                        className="min-w-[160px] justify-center px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs sm:text-sm font-bold backdrop-blur-sm transition-all flex items-center gap-2 group"
                   >
                      Case Studies <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
        </div>
      </section>

      {/* 2. Main Content Grid (Compact) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Value Prop (5 cols) */}
          <div className="lg:col-span-5 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-white mb-6">Precision Workflow</h2>
              
              <div className="space-y-6 pl-4 border-l-2 border-indigo-900">
                  {steps.map((step, i) => (
                      <div key={i} className="relative pl-6">
                          <span className="absolute -left-[17px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#0A0F1C] border-2 border-indigo-600 text-indigo-400 font-bold text-sm shadow-sm z-10">
                              {step.step}
                          </span>
                          <h3 className="text-base font-bold text-white mb-1">{step.title}</h3>
                          <p className="text-xs text-white">{step.desc}</p>
                      </div>
                  ))}
              </div>
            </motion.div>

            <div className="bg-[#0A0F1C] rounded-xl p-6 border border-indigo-900/30">
                <h3 className="font-bold text-indigo-300 mb-4 flex items-center gap-2 text-base">
                    <Shield className="w-4 h-4 text-indigo-400" /> The Alanxa Standard
                </h3>
                <div className="space-y-3">
                    {[
                        "ISO 27001 Compliant",
                        "Strict NDA Protection",
                        "Dedicated PMs"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-white font-medium text-xs">
                            <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Right Column: Compact Form (7 cols) */}
          <div className="lg:col-span-7">
             <motion.div 
               id="contact-form"
               initial={{ opacity: 0, y: 15 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-[#0A0F1C] rounded-2xl shadow-xl border border-gray-800 p-6 md:p-8 relative overflow-hidden"
             >
                 <div className="relative z-10">
                     <div className="mb-6 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white mb-1">Request a Proposal</h2>
                        <p className="text-xs text-white">We typically respond within 2 hours.</p>
                     </div>

                     <form onSubmit={handleSubmit} className="space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                           <label className="text-xs font-bold text-white uppercase tracking-wider mb-1 block">Company</label>
                           <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full px-3 py-2 text-base rounded-lg bg-black border border-gray-700 text-white focus:ring-1 focus:ring-indigo-500 outline-none placeholder-gray-500" placeholder="Acme Inc." />
                         </div>
                         <div>
                           <label className="text-xs font-bold text-white uppercase tracking-wider mb-1 block">Name</label>
                           <input type="text" name="contactPerson" required value={formData.contactPerson} onChange={handleChange} className="w-full px-3 py-2 text-base rounded-lg bg-black border border-gray-700 text-white focus:ring-1 focus:ring-indigo-500 outline-none placeholder-gray-500" placeholder="John Doe" />
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                           <label className="text-xs font-bold text-white uppercase tracking-wider mb-1 block">Email</label>
                           <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 text-base rounded-lg bg-black border border-gray-700 text-white focus:ring-1 focus:ring-indigo-500 outline-none placeholder-gray-500" placeholder="john@company.com" />
                         </div>
                         <div>
                           <label className="text-xs font-bold text-white uppercase tracking-wider mb-1 block">Country</label>
                           <input type="text" name="country" required value={formData.country} onChange={handleChange} className="w-full px-3 py-2 text-base rounded-lg bg-black border border-gray-700 text-white focus:ring-1 focus:ring-indigo-500 outline-none placeholder-gray-500" placeholder="USA" />
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                           <label className="text-xs font-bold text-white uppercase tracking-wider mb-1 block">Service</label>
                           <select name="service" value={formData.service} onChange={handleChange} className="w-full px-3 py-2 text-base rounded-lg bg-black border border-gray-700 text-white focus:ring-1 focus:ring-indigo-500 outline-none">
                              <option value="" disabled className="text-white">Select Service</option>
                              <option>AI Training</option>
                              <option>Annotation</option>
                              <option>Transcription</option>
                              <option>Translation</option>
                               <option>Other</option>
                           </select>
                         </div>
                         <div>
                           <label className="text-xs font-bold text-white uppercase tracking-wider mb-1 block">Volume</label>
                           <input type="text" name="volume" value={formData.volume} onChange={handleChange} className="w-full px-3 py-2 text-base rounded-lg bg-black border border-gray-700 text-white focus:ring-1 focus:ring-indigo-500 outline-none placeholder-gray-500" placeholder="e.g. 50k items" />
                         </div>
                       </div>

                       {formData.service === 'Other' && (
                         <div>
                           <label className="text-xs font-bold text-white uppercase tracking-wider mb-1 block">Specify Other Service</label>
                           <input type="text" name="otherService" required value={formData.otherService} onChange={handleChange} className="w-full px-3 py-2 text-base rounded-lg bg-black border border-gray-700 text-white focus:ring-1 focus:ring-indigo-500 outline-none placeholder-gray-500" placeholder="e.g. Data Labeling" />
                         </div>
                       )}

                       <div>
                         <label className="text-xs font-bold text-white uppercase tracking-wider mb-1 block">Details</label>
                         <textarea name="notes" rows={3} required value={formData.notes} onChange={handleChange} className="w-full px-3 py-2 text-base rounded-lg bg-black border border-gray-700 text-white focus:ring-1 focus:ring-indigo-500 outline-none resize-none placeholder-gray-500" placeholder="Project requirements..."></textarea>
                       </div>

                       <button type="submit" disabled={loading} className="w-auto mx-auto sm:mx-0 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-sm">
                          {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Submit Request</>}
                       </button>
                     </form>
                 </div>
             </motion.div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 bg-black py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
            <span className="text-[10px] font-semibold text-white uppercase">Connect with us</span>
            <div className="flex gap-3">
                <a href="https://www.linkedin.com/company/alanxa-ai" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1E293B] rounded-full shadow-sm text-white hover:text-white hover:bg-black transition-all">
                    <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://x.com/alanxa_ai" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1E293B] rounded-full shadow-sm text-white hover:text-white hover:bg-black transition-all">
                    <Twitter className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/alanxa.ai/" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1E293B] rounded-full shadow-sm text-white hover:text-white hover:bg-black transition-all">
                    <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/alanxa07" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1E293B] rounded-full shadow-sm text-white hover:text-white hover:bg-black transition-all">
                    <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.threads.com/@alanxa.ai" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1E293B] rounded-full shadow-sm text-white hover:text-white hover:bg-black transition-all">
                    <AtSign className="w-4 h-4" />
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;
