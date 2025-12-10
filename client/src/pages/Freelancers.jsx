import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, Check, Globe, Clock, DollarSign, User, Mail, 
  Phone, Languages, Briefcase, Send, Sparkles, Laptop, 
  BookOpen, FileText, Linkedin, Facebook, Twitter, Instagram
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import SEO from '../components/SEO';

const Freelancers = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    languages: '',
    experience: '',
    resume: '',
    interests: [],
    availability: ''
  });

  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const updatedInterests = checked 
        ? [...formData.interests, value]
        : formData.interests.filter(i => i !== value);
      setFormData({ ...formData, interests: updatedInterests });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please upload resume.');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'interests') data.append(key, JSON.stringify(formData[key]));
        else if (key !== 'resume') data.append(key, formData[key]);
      });
      data.append('resume', resumeFile);

      await axios.post('http://localhost:5000/api/freelancers', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Application submitted!');
      setFormData({
        name: '', email: '', phone: '', languages: '',
        experience: '', resume: '', interests: [], availability: ''
      });
      setResumeFile(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Globe, title: "Work Anywhere", desc: "100% remote.", color: "text-blue-600 bg-blue-50" },
    { icon: Clock, title: "Flexible Time", desc: "Your schedule.", color: "text-green-600 bg-green-50" },
    { icon: DollarSign, title: "Weekly Pay", desc: "Reliable payout.", color: "text-yellow-600 bg-yellow-50" },
    { icon: BookOpen, title: "Free Training", desc: "Get certified.", color: "text-purple-600 bg-purple-50" }
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <SEO 
        title="Freelance with Alanxa"
        description="Join our global AI training community."
        keywords="Freelance, Remote, AI Jobs"
        url="/freelancers"
      />
      
      {/* 1. Hero Section (Compact) */}
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 overflow-hidden">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
           <div className="flex flex-col lg:flex-row items-center gap-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:w-1/2"
              >
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-indigo-200 mb-4 backdrop-blur">
                    <Laptop className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Remote Work</span>
                 </div>
                 <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Shape <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Generative AI</span>
                 </h1>
                 <p className="text-base text-gray-400 mb-6 max-w-lg mx-auto lg:mx-0">
                    Join thousands earning money by training next-gen AI models.
                 </p>
                 <div className="flex gap-3 justify-center lg:justify-start">
                    <button onClick={() => document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg flex items-center justify-center gap-2">
                       Apply Now <Sparkles className="w-3 h-3" />
                    </button>
                    <button className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full text-sm font-bold hover:bg-white/10 transition-all">
                       Learn More
                    </button>
                 </div>
              </motion.div>

              <div className="lg:w-1/2 relative hidden lg:block">
                 <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" alt="Remote" className="rounded-xl shadow-2xl opacity-70 w-full object-cover h-[350px] border border-white/10" />
              </div>
           </div>
        </div>
      </section>

      {/* 2. Content & Form (Compact) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Col: Benefits (5 cols) */}
            <div className="lg:col-span-5">
               <div className="sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Join Us?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                     {benefits.map((b, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${b.color}`}>
                              <b.icon className="w-5 h-5" />
                           </div>
                           <div>
                              <h3 className="font-bold text-gray-900 text-sm mb-1">{b.title}</h3>
                              <p className="text-gray-500 text-xs">{b.desc}</p>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Right Col: Application Form (7 cols) */}
            <div className="lg:col-span-7">
               <motion.div 
                 id="apply-form"
                 initial={{ opacity: 0, x: 15 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="bg-white rounded-2xl shadow-lg border border-gray-200/60 p-6 md:p-8"
               >
                  <div className="mb-6 border-b border-gray-100 pb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <User className="w-4 h-4" />
                         </div>
                         Application Form
                      </h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold text-gray-500 uppercase">Full Name</label>
                           <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Jane Doe" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold text-gray-500 uppercase">Email</label>
                           <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="jane@example.com" />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold text-gray-500 uppercase">Language</label>
                           <input type="text" name="languages" required value={formData.languages} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g. Spanish" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold text-gray-500 uppercase">Phone</label>
                           <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="+1..." />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold text-gray-500 uppercase">Experience</label>
                           <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g. 2 years" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold text-gray-500 uppercase">Availability</label>
                           <input type="text" name="availability" value={formData.availability} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g. 20 hrs/wk" />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Skills</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                           {['Annotation', 'Transcription', 'Translation', 'Coding', 'Content', 'Review'].map((skill) => (
                              <label key={skill} className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${formData.interests.includes(skill) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                                 <input 
                                    type="checkbox" 
                                    name="interests" 
                                    value={skill} 
                                    checked={formData.interests.includes(skill)} 
                                    onChange={handleChange}
                                    className="accent-indigo-600 w-3 h-3 cursor-pointer" 
                                 />
                                 <span className="text-xs font-medium">{skill}</span>
                              </label>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Resume</label>
                        <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${resumeFile ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400'}`}>
                              <input 
                                 id="resume-upload"
                                 type="file" 
                                 accept=".pdf,.doc,.docx"
                                 onChange={handleFileChange}
                                 className="hidden"
                              />
                              <label htmlFor="resume-upload" className="cursor-pointer block">
                                 {resumeFile ? (
                                    <div className="flex flex-col items-center">
                                       <FileText className="w-6 h-6 text-indigo-600 mb-1" />
                                       <span className="font-semibold text-gray-900 text-sm">{resumeFile.name}</span>
                                    </div>
                                 ) : (
                                    <div className="flex flex-col items-center">
                                       <Upload className="w-5 h-5 text-gray-400 mb-1" />
                                       <span className="text-xs text-gray-500">Upload PDF/DOCX</span>
                                    </div>
                                 )}
                              </label>
                        </div>
                     </div>

                     <button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
                        {loading ? 'Sending...' : <>Apply Now <Send className="w-4 h-4" /></>}
                     </button>
                  </form>
               </motion.div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Freelancers;
