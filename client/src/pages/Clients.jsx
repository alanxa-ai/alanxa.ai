import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Building2, User, Mail, Globe, Settings, Database, 
  Send, CheckCircle, Shield, Briefcase, Linkedin, 
  Facebook, Twitter, Instagram, AtSign
} from 'lucide-react';

const Clients = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    country: '',
    service: '',
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
      await axios.post('http://localhost:5000/api/clients', formData);
      toast.success('Request received! We will contact you shortly.');
      setFormData({
        companyName: '', contactPerson: '', email: '', country: '',
        service: '', volume: '', notes: ''
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
    <div className="bg-white min-h-screen font-sans">
      
      {/* 1. Hero Section (Compact) */}
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=800&fit=crop&q=80"
            alt="Enterprise" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-slate-900/90" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-10">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
               className="lg:w-1/2"
             >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 mb-4 backdrop-blur-md">
                    <Briefcase className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Enterprise</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                   Scale AI with <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Human Intelligence</span>
                </h1>
                <p className="text-base text-gray-300 leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
                   The essential human layer for top-tier AI models. Reliable, secure, and infinitely scalable data solutions.
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                   <button onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 bg-white text-slate-900 rounded-full text-sm font-bold hover:bg-gray-100 transition-all shadow-lg transform hover:-translate-y-0.5">
                      Start Project
                   </button>
                   <button className="px-6 py-3 bg-transparent border border-white/20 text-white rounded-full text-sm font-bold hover:bg-white/10 transition-all">
                      Case Studies
                   </button>
                </div>
             </motion.div>
             
             {/* Abstract Visual Right */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2 }}
               className="lg:w-1/2 relative hidden lg:block"
             >
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl skew-y-3 transform rotate-2">
                   <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Dashboard" className="opacity-80" />
                   <div className="absolute inset-0 bg-indigo-900/40"></div>
                </div>
             </motion.div>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Precision Workflow</h2>
              
              <div className="space-y-6 pl-4 border-l-2 border-indigo-100">
                  {steps.map((step, i) => (
                      <div key={i} className="relative pl-6">
                          <span className="absolute -left-[17px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-indigo-600 text-indigo-600 font-bold text-xs shadow-sm z-10">
                              {step.step}
                          </span>
                          <h3 className="text-base font-bold text-gray-900 mb-1">{step.title}</h3>
                          <p className="text-sm text-gray-500">{step.desc}</p>
                      </div>
                  ))}
              </div>
            </motion.div>

            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2 text-base">
                    <Shield className="w-4 h-4 text-indigo-600" /> The Alanxa Standard
                </h3>
                <div className="space-y-3">
                    {[
                        "ISO 27001 Compliant",
                        "Strict NDA Protection",
                        "Dedicated PMs"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-700 font-medium text-xs">
                            <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0" />
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
               className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 relative overflow-hidden"
             >
                 <div className="relative z-10">
                     <div className="mb-6 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Request a Proposal</h2>
                        <p className="text-xs text-gray-500">We typically respond within 2 hours.</p>
                     </div>

                     <form onSubmit={handleSubmit} className="space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Company</label>
                           <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Acme Inc." />
                         </div>
                         <div>
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Name</label>
                           <input type="text" name="contactPerson" required value={formData.contactPerson} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="John Doe" />
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
                           <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="john@company.com" />
                         </div>
                         <div>
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Country</label>
                           <input type="text" name="country" required value={formData.country} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="USA" />
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Service</label>
                           <select name="service" value={formData.service} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none">
                              <option value="" disabled>Select Service</option>
                              <option>AI Training</option>
                              <option>Annotation</option>
                              <option>Transcription</option>
                              <option>Translation</option>
                           </select>
                         </div>
                         <div>
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Volume</label>
                           <input type="text" name="volume" value={formData.volume} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g. 50k items" />
                         </div>
                       </div>

                       <div>
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Details</label>
                         <textarea name="notes" rows={3} required value={formData.notes} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none resize-none" placeholder="Project requirements..."></textarea>
                       </div>

                       <button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-sm">
                          {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Submit Request</>}
                       </button>
                     </form>
                 </div>
             </motion.div>
          </div>
        </div>
      </div>
      
      {/* Compact Footer Strip */}
      <div className="border-t border-gray-100 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase">Connect with us</span>
            <div className="flex gap-3">
                {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                    <a key={i} href="#" className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-indigo-600 transition-all">
                        <Icon className="w-4 h-4" />
                    </a>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;
