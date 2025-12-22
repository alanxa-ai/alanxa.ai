import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Check, Globe, Clock, DollarSign, User, Mail, 
  Phone, Languages, Briefcase, Send, Sparkles, Laptop, 
  BookOpen, FileText, Linkedin, Facebook, Twitter, Instagram, AtSign, X, Heart
} from 'lucide-react';
import api from '../utils/api';
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
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaq, setOpenFaq] = useState(null);

  // Dynamic Category Extraction
  const categories = React.useMemo(() => {
    const uniqueCats = [...new Set(jobs.map(job => job.category).filter(Boolean))];
    const baseCats = ['All', ...uniqueCats.sort()];
    
    return baseCats.map(cat => {
      let icon = Sparkles;
      const lower = cat.toLowerCase();
      if (lower.includes('annotation')) icon = Check;
      else if (lower.includes('coding') || lower.includes('software') || lower.includes('developer')) icon = Laptop;
      else if (lower.includes('linguistics') || lower.includes('translate') || lower.includes('language')) icon = Languages;
      else if (lower.includes('specialist') || lower.includes('content') || lower.includes('write')) icon = FileText;
      
      return { id: cat, label: cat, icon };
    });
  }, [jobs]);

  const filteredJobs = activeCategory === 'All' 
    ? jobs 
    : jobs.filter(job => job.category === activeCategory || job.category?.includes(activeCategory));


  useEffect(() => {
    const fetchJobs = async () => {
        try {
            const res = await api.get('/api/jobs');
            setJobs(res.data);
        } catch (e) {
            console.error('Error fetching jobs', e);
        }
    }
    fetchJobs();
  }, []);

  useEffect(() => {
     if (selectedJob) {
        setTimeout(() => {
           const formElement = document.getElementById('apply-form');
           if (formElement) {
               formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
           }
        }, 400);
     }
  }, [selectedJob]);

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
      if (selectedJob) data.append('position', selectedJob.title);

      await api.post('/api/freelancers', data, {
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
    { icon: Globe, title: "Work Anywhere", desc: "100% remote.", color: "text-blue-400 bg-blue-900/20" },
    { icon: Clock, title: "Flexible Time", desc: "Your schedule.", color: "text-green-400 bg-green-900/20" },
    { icon: DollarSign, title: "Weekly Pay", desc: "Reliable payout.", color: "text-yellow-400 bg-yellow-900/20" },
    { icon: BookOpen, title: "Free Training", desc: "Get certified.", color: "text-purple-400 bg-purple-900/20" }
  ];

  return (
    <div className="bg-black min-h-screen font-sans relative text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-[-20%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-[-20%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>
      <SEO 
        title="Freelance with Alanxa"
        description="Join our global AI training community."
        keywords="Freelance, Remote, AI Jobs"
        url="/freelancers"
      />
      
      {/* 1. Hero Section (Premium SaaS Style) */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden bg-[#0A0F1C]">
        {/* Abstract Grid & Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              {/* Removed motion.div for LCP */}
              <div 
                className="w-full lg:w-1/2 text-center lg:text-left pt-8 lg:pt-0"
              >
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-6 backdrop-blur-md shadow-lg shadow-indigo-500/10 mx-auto lg:mx-0">
                    <Laptop className="w-3 h-3" />
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Global Remote Workforce</span>
                 </div>
                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                    Power the Next Era of <br className="hidden md:block"/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 animate-gradient">Artificial Intelligence</span>
                 </h1>
                 <p className="text-sm md:text-lg text-white mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light px-2 md:px-0">
                    Join an elite community of data experts. Earn competitive rates, work on your schedule, and help shape the future of Generative AI models.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto px-4 sm:px-0">
                    <button onClick={() => setSelectedJob({ title: 'General Application', type: 'Freelance', location: 'Remote' })} className="w-full sm:w-auto px-8 py-3.5 bg-[#6366F1] text-white rounded-full text-sm font-bold hover:bg-[#5558E3] transition-all shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2 uppercase tracking-wide order-2 sm:order-1">
                       Start Earning <Sparkles className="w-4 h-4 text-white" />
                    </button>
                    <button onClick={() => document.getElementById('positions').scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/20 text-white rounded-full text-sm font-bold hover:bg-white/5 transition-all uppercase tracking-wide backdrop-blur-sm order-1 sm:order-2">
                       Explore Roles
                    </button>
                 </div>
              </div>

              <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0 px-4 md:px-0">
                 <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group max-w-lg mx-auto lg:max-w-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent z-10 opacity-60"></div>
                    <img 
                        src="https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_800/v1766045858/0.30_Alanxa_work_colture_image_4_x5jfxx.jpg" 
                        alt="Remote Team" 
                        className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700" 
                        width="600"
                        height="500"
                        fetchPriority="high"
                        decoding="async"
                    />
                    
                    {/* Floating Stats Card - Responsive positioning */}
                    <div className="absolute bottom-4 left-4 md:auto right-auto md:bottom-8 md:left-8 z-20 bg-black/60 backdrop-blur-xl border border-white/10 p-2 md:p-6 rounded-xl flex flex-row justify-between items-center shadow-lg gap-3 md:gap-4">
                        <div>
                            <p className="text-white font-bold text-xs md:text-xl">20k+ Freelancers</p>
                            <p className="text-indigo-300 text-[9px] md:text-sm">Active globally</p>
                        </div>
                        <div className="flex -space-x-2 md:-space-x-3">
                            {[
                                "1534528741775-53994a69daeb",
                                "1506794778202-cad84cf45f1d", 
                                "1507003211169-0a1dd7228f2d",
                                "1500648767791-00dcc994a43e"
                            ].map((id, i) =>(
                                <img 
                                    key={i} 
                                    src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=100&q=80`} 
                                    alt="User" 
                                    className="w-6 h-6 md:w-10 md:h-10 rounded-full border border-gray-800 md:border-2 md:border-[#0A0F1C] object-cover" 
                                />
                            ))}
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 1.5 Open Positions Section */}
      {jobs.length > 0 && (
      <section id="positions" className="py-24 relative z-10 bg-black">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 px-4">
               <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Opportunities</h2>
               <p className="text-white max-w-2xl mx-auto text-sm md:text-base">Explore flexible, remote opportunities and shape the future of AI, all at your own pace.</p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 px-4">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
                            activeCategory === cat.id 
                            ? 'bg-[#6366F1] text-white shadow-lg shadow-indigo-500/20' 
                            : 'bg-black text-white border border-gray-800 hover:bg-[#1E293B] hover:text-white'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                {filteredJobs.map(job => (
                    <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={job._id} 
                        className="bg-[#0A0F1C] p-6 rounded-2xl border border-gray-800 shadow-sm hover:shadow-xl hover:shadow-indigo-900/10 transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full"
                    >
                        <div className="mb-4">
                             <h3 onClick={() => setViewingJob(job)} className="text-xl font-bold text-white mb-1.5 hover:text-indigo-400 cursor-pointer transition-colors">{job.title}</h3>
                             <div className="flex flex-wrap gap-1.5 text-xs font-semibold text-white">
                                <span className="bg-[#1E293B] px-2 py-0.5 rounded border border-gray-700 text-white">{job.type}</span>
                                <span className="bg-[#1E293B] px-2 py-0.5 rounded border border-gray-700 text-white">{job.category}</span>
                             </div>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                             <div className="text-indigo-400 bg-indigo-900/20 px-2 py-0.5 rounded text-xs font-bold">
                                Starts at <span className="text-sm">{job.salary}</span>
                             </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-800 grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => setViewingJob(job)} 
                                className="px-3 py-2 bg-black border border-gray-700 text-white rounded-lg text-xs font-bold hover:border-gray-500 hover:bg-[#1E293B] transition-all uppercase tracking-wide"
                            >
                                View Details
                            </button>
                            <button 
                                onClick={() => { 
                                    setSelectedJob(job); 
                                }} 
                                className="px-3 py-2 bg-[#6366F1] text-white rounded-lg text-xs font-bold hover:bg-[#4F46E5] transition-all uppercase tracking-wide shadow-md hover:shadow-lg"
                            >
                                Apply Now
                            </button>
                        </div>
                    </motion.div>
                ))}
                </AnimatePresence>
            </div>
            
            {filteredJobs.length === 0 && (
                <div className="text-center py-20 text-white">
                    <p>No jobs found in this category.</p>
                </div>
            )}
         </div>
      </section>
      )}

      {/* 2. Benefits & Form Section */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
         
         {/* Work Environment Section */}
         <div className="mb-20 md:mb-32">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                 <div className="relative rounded-3xl overflow-hidden shadow-2xl group order-2 lg:order-1">
                     <div className="absolute inset-0 bg-indigo-900/10 mix-blend-overlay z-10"></div>
                     <img 
                       src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80" 
                       alt="Work Environment" 
                       className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                       width="800"
                       height="500"
                       loading="lazy"
                       decoding="async"
                     />
                 </div>
                 <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
                     <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6 leading-tight">Work Environment</h2>
                        <p className="text-white text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                            We operate like an early-stage startup, even at our scale. Our environment is fast-paced and high-intensity, focusing relentlessly on impact over process. We empower you to solve complex problems from day one.
                        </p>
                        <p className="text-white text-sm md:text-base leading-relaxed">
                            For those who thrive in autonomy, the opportunities are immense. You'll take on expanded responsibilities quickly, collaborating closely with industry leaders shaping the future of AI.
                        </p>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 md:gap-6">
                        <div className="p-4 rounded-xl bg-[#1E293B]/50 border border-gray-800 text-center md:text-left">
                             <div className="text-2xl md:text-3xl font-bold text-indigo-400 mb-1">100%</div>
                             <div className="text-xs md:text-sm text-white">Remote Freedom</div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#1E293B]/50 border border-gray-800 text-center md:text-left">
                             <div className="text-2xl md:text-3xl font-bold text-indigo-400 mb-1">Top 1%</div>
                             <div className="text-xs md:text-sm text-white">Talent Pool</div>
                        </div>
                     </div>
                 </div>
             </div>
         </div>

         {/* Benefits Grid */}
         <div className="mb-16 md:mb-24">
            <div className="text-center mb-10 md:mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Perks and Benefits</h2>
               <p className="text-white text-sm md:text-base max-w-2xl mx-auto px-4">We believe in taking care of our community with professional-grade benefits.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                   { icon: Globe, label: "Work From Anywhere", desc: "No location limits.", color: "text-white", bg: "bg-blue-600" },
                   { icon: DollarSign, label: "Weekly Payouts", desc: "Direct to bank.", color: "text-white", bg: "bg-blue-600" },
                   { icon: Clock, label: "Flexible Schedule", desc: "You choose when.", color: "text-white", bg: "bg-blue-600" },
                   { icon: BookOpen, label: "Skill Certification", desc: "Free AI training.", color: "text-white", bg: "bg-blue-600" },
                   { icon: User, label: "Career Growth", desc: "Full-time path.", color: "text-white", bg: "bg-blue-600" },
                   { icon: Heart, label: "Community Support", desc: "24/7 assistance.", color: "text-white", bg: "bg-blue-600" },
                   { icon: Sparkles, label: "Performance Bonus", desc: "Earn extra.", color: "text-white", bg: "bg-blue-600" },
                   { icon: Laptop, label: "Tech Stipend", desc: "For top performers.", color: "text-white", bg: "bg-blue-600" },
                ].map((perk, i) => (
                   <div key={i} className="bg-[#0A0F1C] border border-gray-800 p-5 md:p-6 rounded-xl flex items-center gap-4 hover:border-indigo-500/30 hover:bg-[#1E293B] transition-all group">
                       <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${perk.bg} flex items-center justify-center shrink-0`}>
                           <perk.icon className={`w-5 h-5 md:w-6 md:h-6 ${perk.color}`} />
                       </div>
                       <div>
                           <h3 className="text-white font-bold text-sm mb-0.5 md:mb-1">{perk.label}</h3>
                           <p className="text-white text-xs">{perk.desc}</p>
                       </div>
                   </div>
                ))}
            </div>
         </div>

         {/* FAQ Section */}
         <div className="mb-24 max-w-3xl mx-auto">
             <div className="text-center mb-12">
                 <h2 className="text-4xl font-bold text-white">Frequently Asked Questions</h2>
             </div>
             <div className="space-y-4">
                 {[
                     { q: "Do I need prior experience in AI?", a: "Not necessarily. While some roles require specific expertise, many of our annotation and content tasks are open to beginners with good language skills." },
                     { q: "How do payments work?", a: "We process payments bi-weekly via direct bank transfer or PayPal, depending on your region. You are paid for every accepted task." },
                     { q: "Can I work from my phone?", a: "Yes! Many of our tasks are mobile-friendly, allowing you to work anytime, anywhere. However, coding tasks are best done on a desktop." },
                     { q: "Is this a full-time commitment?", a: "No, you can work as much or as little as you want. There are no minimum hour requirements." }
                 ].map((faq, i) => (
                     <div key={i} className="border border-gray-800 rounded-2xl bg-[#0A0F1C] overflow-hidden">
                         <button 
                             onClick={() => setOpenFaq(openFaq === i ? null : i)}
                             className="w-full flex justify-between items-center p-6 text-left hover:bg-[#1E293B] transition-colors"
                         >
                             <span className="font-bold text-white">{faq.q}</span>
                             {openFaq === i ? <X className="w-5 h-5 text-white"/> : <Check className="w-5 h-5 text-white rotate-45 transform origin-center transition-transform"/>} 
                         </button>
                         <AnimatePresence>
                             {openFaq === i && (
                                 <motion.div
                                     initial={{ height: 0, opacity: 0 }}
                                     animate={{ height: 'auto', opacity: 1 }}
                                     exit={{ height: 0, opacity: 0 }}
                                     className="px-6 pb-6 text-white text-base leading-relaxed"
                                 >
                                     {faq.a}
                                 </motion.div>
                             )}
                         </AnimatePresence>
                     </div>
                 ))}
             </div>
         </div>

         {/* Application Form - Conditionally Rendered */}
         <AnimatePresence>
            {selectedJob && (
                <motion.div 
                    id="apply-form"
                    initial={{ opacity: 0, height: 0, y: 40 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 40 }}
                    className="overflow-hidden"
                >
                    <div className="max-w-2xl mx-auto bg-[#0A0F1C] rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
                        <div className="bg-[#0A0F1C] p-6 text-center text-white relative overflow-hidden border-b border-gray-800">
                             <div className="absolute top-0 left-0 w-full h-full bg-indigo-900/20 blur-3xl"></div>
                             <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-1">Complete Your Application</h3>
                                <p className="text-white text-sm">You are applying for <span className="text-white font-bold underline decoration-indigo-500">{selectedJob.title}</span></p>
                             </div>
                             <button onClick={() => setSelectedJob(null)} className="absolute top-3 right-3 p-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white">
                                <X className="w-4 h-4" />
                             </button>
                        </div>
                        
                        <div className="p-8 md:p-12">
                             <form onSubmit={handleSubmit} className="space-y-6">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2">
                                       <label className="text-xs font-bold text-white uppercase tracking-wider">Full Name</label>
                                       <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3.5 text-sm rounded-xl bg-black border border-gray-700 text-white focus:bg-[#0A0F1C] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-gray-600" placeholder="Jane Doe" />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-xs font-bold text-white uppercase tracking-wider">Email</label>
                                       <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3.5 text-sm rounded-xl bg-black border border-gray-700 text-white focus:bg-[#0A0F1C] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-gray-600" placeholder="jane@example.com" />
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2">
                                       <label className="text-xs font-bold text-white uppercase tracking-wider">Language</label>
                                       <input type="text" name="languages" required value={formData.languages} onChange={handleChange} className="w-full px-4 py-3.5 text-sm rounded-xl bg-black border border-gray-700 text-white focus:bg-[#0A0F1C] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-gray-600" placeholder="e.g. Spanish" />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-xs font-bold text-white uppercase tracking-wider">Phone</label>
                                       <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3.5 text-sm rounded-xl bg-black border border-gray-700 text-white focus:bg-[#0A0F1C] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-gray-600" placeholder="+1..." />
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2">
                                       <label className="text-xs font-bold text-white uppercase tracking-wider">Experience</label>
                                       <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full px-4 py-3.5 text-sm rounded-xl bg-black border border-gray-700 text-white focus:bg-[#0A0F1C] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-gray-600" placeholder="e.g. 2 years" />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-xs font-bold text-white uppercase tracking-wider">Availability</label>
                                       <input type="text" name="availability" value={formData.availability} onChange={handleChange} className="w-full px-4 py-3.5 text-sm rounded-xl bg-black border border-gray-700 text-white focus:bg-[#0A0F1C] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-gray-600" placeholder="e.g. 20 hrs/wk" />
                                    </div>
                                 </div>

                                 <div className="space-y-3">
                                    <label className="text-xs font-bold text-white uppercase tracking-wider">Skills</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                       {['Annotation', 'Transcription', 'Translation', 'Coding', 'Content', 'Review'].map((skill) => (
                                          <label key={skill} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.interests.includes(skill) ? 'bg-indigo-900/20 text-indigo-400 border-indigo-500' : 'bg-black border-gray-700 hover:bg-[#1E293B] text-white'}`}>
                                             <input 
                                                type="checkbox" 
                                                name="interests" 
                                                value={skill} 
                                                checked={formData.interests.includes(skill)} 
                                                onChange={handleChange}
                                                className="accent-indigo-600 w-4 h-4 cursor-pointer bg-black" 
                                             />
                                             <span className="text-xs font-bold">{skill}</span>
                                          </label>
                                       ))}
                                    </div>
                                 </div>

                                 <div className="space-y-3">
                                    <label className="text-xs font-bold text-white uppercase tracking-wider">Resume</label>
                                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all bg-black ${resumeFile ? 'border-indigo-500 bg-indigo-900/10' : 'border-gray-700 hover:border-indigo-500 hover:bg-[#1E293B]'}`}>
                                          <input 
                                             id="resume-upload"
                                             type="file" 
                                             accept=".pdf,.doc,.docx"
                                             onChange={handleFileChange}
                                             className="hidden"
                                          />
                                          <label htmlFor="resume-upload" className="cursor-pointer block group">
                                             {resumeFile ? (
                                                <div className="flex flex-col items-center">
                                                   <div className="w-12 h-12 bg-green-900/20 text-green-400 rounded-full flex items-center justify-center mb-3">
                                                        <Check className="w-6 h-6" />
                                                   </div>
                                                   <span className="font-bold text-white text-sm">{resumeFile.name}</span>
                                                   <span className="text-xs text-green-400 mt-1">Ready to upload</span>
                                                </div>
                                             ) : (
                                                <div className="flex flex-col items-center">
                                                   <div className="w-12 h-12 bg-[#1E293B] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                                        <Upload className="w-6 h-6 text-indigo-400" />
                                                   </div>
                                                   <span className="text-base font-bold text-white">Click to upload Resume</span>
                                                   <span className="text-xs text-white mt-1">PDF, DOCX up to 5MB</span>
                                                </div>
                                             )}
                                          </label>
                                    </div>
                                 </div>

                                 <button type="submit" disabled={loading} className="w-full py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                                    {loading ? 'Sending Application...' : <>Submit Application <Send className="w-4 h-4" /></>}
                                 </button>
                             </form>
                        </div>
                    </div>
                </motion.div>
            )}
         </AnimatePresence>
      </div>
      
      {/* Compact Footer Strip */}
      <div className="border-t border-gray-800 bg-[#0A0F1C] py-8">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
            <span className="text-xs font-semibold text-white uppercase">Connect with us</span>
            <div className="flex gap-3">
                <a href="https://www.linkedin.com/company/alanxa-ai" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1E293B] rounded-full shadow-sm text-white hover:text-indigo-400 transition-all">
                    <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://x.com/alanxa_ai" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1E293B] rounded-full shadow-sm text-white hover:text-indigo-400 transition-all">
                    <Twitter className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/alanxa.ai/" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1E293B] rounded-full shadow-sm text-white hover:text-indigo-400 transition-all">
                    <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/alanxa07" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1E293B] rounded-full shadow-sm text-white hover:text-indigo-400 transition-all">
                    <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.threads.com/@alanxa.ai" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1E293B] rounded-full shadow-sm text-white hover:text-indigo-400 transition-all">
                    <AtSign className="w-4 h-4" />
                </a>
            </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <AnimatePresence>
        {viewingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setViewingJob(null)}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative bg-[#0A0F1C] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            >
               <div className="sticky top-0 bg-[#0A0F1C] border-b border-gray-800 p-6 flex justify-between items-center z-10">
                   <div>
                       <h3 className="text-3xl font-bold text-white">{viewingJob.title}</h3>
                       <div className="flex gap-3 text-base text-white mt-1">
                          <span className="px-2 py-0.5 rounded bg-blue-900/20 text-blue-400 font-bold uppercase text-xs">{viewingJob.type}</span>
                          <span className="flex items-center gap-1"><Globe className="w-3 h-3"/> {viewingJob.location}</span>
                       </div>
                   </div>
                   <button onClick={() => setViewingJob(null)} className="p-2 hover:text-white text-white rounded-full transition-colors">
                       <X className="w-6 h-6" />
                   </button>
               </div>
               
                <div className="p-8"> 
                     <div className="prose prose-sm md:prose-lg max-w-none mb-8 text-white [&_*]:!text-white" dangerouslySetInnerHTML={{ __html: viewingJob.description }}></div>
                    
                    {viewingJob.skills && viewingJob.skills.length > 0 && (
                         <div className="mb-8">
                             <h4 className="font-bold text-white mb-3 text-base uppercase">Required Skills</h4>
                             <div className="flex flex-wrap gap-2">
                                 {viewingJob.skills.map((skill, i) => (
                                     <span key={i} className="px-3 py-1 bg-[#1E293B] text-white rounded-lg text-sm font-semibold">{skill}</span>
                                 ))}
                             </div>
                         </div>
                    )}

                     <div className="bg-indigo-900/20 border border-indigo-500/10 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                         <div>
                              <span className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Compensation</span>
                              <span className="text-2xl font-bold text-indigo-300">{viewingJob.salary}</span>
                         </div>
                        <button 
                            onClick={() => {
                                setSelectedJob(viewingJob);
                                setViewingJob(null);
                            }}
                            className="w-full md:w-auto px-8 py-3 bg-[#6366F1] text-white font-bold rounded-lg shadow-lg hover:bg-[#4F46E5] transition-all flex items-center justify-center gap-2"
                        >
                            Apply for this Role <div className="p-1 bg-white/20 rounded-full"><Sparkles className="w-3 h-3"/></div>
                        </button>
                    </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Freelancers;
