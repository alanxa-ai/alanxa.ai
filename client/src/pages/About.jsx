import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Globe, ShieldCheck, Zap, Target, ChevronDown, Award, Users 
} from 'lucide-react';
import SEO from '../components/SEO';

const About = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-50/50 min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 pt-24 pb-16">
      <SEO 
        title="About Alanxa.ai - Our Mission" 
        description="Alanxa.ai connects global talent to build better AI. A vision of precision, integrity, and trust."
        url="/about"
      />
      
      {/* 1. Founder Profile - Top Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden flex flex-col md:flex-row"
        >
           {/* Image Side */}
           <div className="md:w-1/3 bg-slate-900 relative min-h-[300px] md:min-h-0 flex flex-col items-center justify-center p-8 text-center group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500 rounded-full blur-[80px] opacity-40"></div>
              
              <div className="relative z-10 w-full flex flex-col items-center">
                 <motion.div 
                   whileHover={{ scale: 1.05 }}
                   transition={{ type: "spring", stiffness: 300 }}
                   className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-indigo-500 to-cyan-400 mb-6 shadow-2xl"
                 >
                   <img 
                     src="/founder.jpg" 
                     alt="Aman Shaikh" 
                     className="w-full h-full object-cover rounded-full border-4 border-slate-900" 
                   />
                 </motion.div>
                 <h2 className="text-2xl font-bold text-white mb-1">Aman Shaikh</h2>
                 <p className="text-indigo-300 text-sm font-medium tracking-wider uppercase mb-6">Founder & CEO</p>
                 <div className="flex gap-4 opacity-50 text-white/50 text-xs">
                    <span>Visionary</span> • <span>Leader</span> • <span>Innovator</span>
                 </div>
              </div>
           </div>

           {/* Content Side */}
           <div className="md:w-2/3 p-8 md:p-12 relative flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6">
                 <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Sparkles className="w-5 h-5" />
                 </div>
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Founding Vision</h3>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                 "AI becomes truly powerful only when every language and voice is represented with respect."
              </h1>

              <div className={`prose prose-lg text-gray-600 transition-all duration-500 ${isExpanded ? '' : 'max-h-[180px] overflow-hidden relative'}`}>
                 <p className="mb-4">
                    Welcome to Alanxa.ai. We began with a simple belief: <strong>Quality and Affordability can co-exist.</strong>
                 </p>
                 <p className="mb-4">
                    The AI industry is plagued by inconsistent data and overpriced vendors. We saw talented people worldwide denied opportunities, and companies struggling to find reliable partners. I wanted to build something different. Something fair. Something strong.
                 </p>
                 <p className="mb-4">
                    Inspired by Alan Turing, Alanxa.ai is a platform where skilled experts train better AI systems. We stand on three values: <strong>Quality, Honesty, and Trust</strong>. 
                 </p>
                 <p className="font-medium text-indigo-900 italic">
                    We don't just label data; we shape the future of intelligent systems with dedication and purpose.
                 </p>
                 
                 {!isExpanded && (
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/90 to-transparent flex items-end justify-center"></div>
                 )}
              </div>
              
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="mt-6 text-indigo-600 text-sm font-bold flex items-center gap-2 hover:text-indigo-800 transition-colors group"
              >
                {isExpanded ? 'Read Less' : 'Read Full Message'} 
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-1'}`} />
              </button>
           </div>
        </motion.div>
      </div>

      {/* 2. Client Impression Section (Compact & Animated) */}
      <div className="max-w-5xl mx-auto px-4 mb-20">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
           className="bg-indigo-900 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10"
         >
             {/* Background Effects */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
             
             {/* Left - Title & Main Stat */}
             <div className="md:w-1/3 text-center md:text-left relative z-10">
                 <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                    Why Leaders <br/><span className="text-cyan-400">Trust Alanxa</span>
                 </h2>
                 <p className="text-indigo-200 text-sm mb-6">
                    Stripping away complexity for pure quality.
                 </p>
                 <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-md">
                    <Target className="w-8 h-8 text-cyan-400" />
                    <div>
                        <div className="text-xl font-bold text-white leading-none">10M+</div>
                        <div className="text-[10px] text-indigo-200 uppercase tracking-wider">Data Points</div>
                    </div>
                 </div>
             </div>

             {/* Right - Animated Grid of Benefits */}
             <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full relative z-10">
                 {[
                     "99% Accuracy Guarantee",
                     "Native Experts (35+ Langs)",
                     "Transparent Flat Pricing",
                     "< 24h Project Kickoff"
                 ].map((item, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, x: 20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
                       className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 cursor-default transition-colors"
                     >
                         <div className="bg-green-500/20 p-1.5 rounded-full text-green-400">
                             <Award className="w-4 h-4" />
                         </div>
                         <span className="font-semibold text-white text-sm">{item}</span>
                     </motion.div>
                 ))}
             </div>
         </motion.div>
      </div>

      {/* 3. Company Overview (Compact Cards) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">About Alanxa.ai</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Delivering exceptional AI training and data solutions with precision, integrity, and a global mindset.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <motion.div 
               whileHover={{ y: -5 }}
               className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all"
             >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Uncompromising Quality</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                   Quality is the heart of Alanxa.ai. Every annotation, transcription, and data label is reviewed through strict internal quality checks to meet global standards.
                </p>
             </motion.div>

             <motion.div 
               whileHover={{ y: -5 }}
               className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all"
             >
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                   <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Global Workforce</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                   Experts across Hindi, Marathi, Gujarati, English, and many more. We support advanced AI systems that need to understand people across regions and cultures.
                </p>
             </motion.div>

             <motion.div 
               whileHover={{ y: -5 }}
               className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all"
             >
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                   <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Fair & Accessible</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                   We combine top-tier expertise with fair pricing. We believe AI development should be accessible and honesty is the best policy for long-term partnerships.
                </p>
             </motion.div>
         </div>
         
         <div className="mt-16 text-center">
             <p className="text-lg font-medium text-gray-900 italic mb-2">
                "AI is the language of the future, and our mission is to help build it with clarity and honesty."
             </p>
             <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full mx-auto"></div>
         </div>
      </div>
      
    </div>
  );
};

export default About;
