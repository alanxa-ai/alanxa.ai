import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Globe, ShieldCheck, Zap, Target, ChevronDown, Award, Users 
} from 'lucide-react';
import SEO from '../components/SEO';

const About = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-black min-h-screen font-sans selection:bg-indigo-900 selection:text-white pt-14 md:pt-16 pb-16">
      <SEO 
        title="About Alanxa.ai - Our Mission" 
        description="Alanxa.ai connects global talent to build better AI. A vision of precision, integrity, and trust."
        url="/about"
      />
      
      {/* 1. Vision Header (Moved to Top, Soft White, Small Text) */}
      {/* 1. Vision Header (Moved to Top, Soft White, Small Text) */}
      <div className="max-w-4xl mx-auto text-center mb-10 pt-2">
          <div className="inline-block p-2 rounded-full bg-[#0A0F1C] border border-indigo-900/30 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <h1 className="text-xl md:text-2xl font-light text-gray-200 leading-relaxed mb-6 italic max-w-2xl mx-auto">
              "We are not just preparing datasets. We are shaping the emotional intelligence of tomorrow’s technology. With every project, we move one step closer to a world where AI understands people the way people understand each other."
          </h1>
          
          <div className="h-px w-10 bg-gray-800 mx-auto mb-4"></div>
          
          <h2 className="text-base font-bold text-white uppercase tracking-widest mb-1">
              Welcome to Alanxa.ai
          </h2>
          <p className="text-gray-300 text-sm">
              Where human intelligence teaches artificial intelligence to feel human.
          </p>
      </div>

      {/* 2. Founder's Profile (Circular Image) */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
          <div className="relative inline-block mb-4 group">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <img 
                  src="/founder.jpg" 
                  alt="Aman Shaikh" 
                  className="relative z-10 w-32 h-32 object-cover rounded-full shadow-lg border-2 border-white" 
                  width="128"
                  height="128"
              />
          </div>
          
          <div className="mb-4">
               <h2 className="text-lg font-bold text-white">Aman Shaikh</h2>
               <p className="text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase">Founder & CEO</p>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-3">
              “We don’t just train AI—we give it a soul that understands every language.”
          </h3>
          <p className="text-sm text-gray-200 leading-relaxed font-light max-w-xl mx-auto">
              Alanxa.ai was created with the belief that artificial intelligence should feel human. True intelligence is not just about processing data but understanding people, cultures, emotions, and voices. Our work brings this belief to life.
          </p>
      </div>

      {/* 3. Strategic Pillars (Animated Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 max-w-7xl mx-auto mb-16">
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
            className="bg-[#0A0F1C] p-6 border border-gray-800 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
          >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <Globe className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Global Mission</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                  We specialize in building high-quality datasets across the world’s languages. From widely spoken languages to rare dialects, ensuring every voice has a place in AI.
              </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0A0F1C] p-6 border border-gray-800 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
          >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Accuracy & Fairness</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                  Solving the industry's biggest challenges: inconsistent quality and high pricing. We focus on accuracy, fairness, and affordability.
              </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0A0F1C] p-6 border border-gray-800 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
          >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Expert Network</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                   A network spanning continents with professionals in speech annotation, linguistic evaluation, and advanced AI workflows. Precise, culturally aware data.
              </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0A0F1C] p-6 border border-gray-800 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
          >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <Award className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Our Principles</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                  Training AI in every language, providing best possible quality, exceptional client experience, and delivering complete solutions for every project.
              </p>
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
                 <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                    Why Leaders <br/><span className="text-cyan-400">Trust Alanxa</span>
                 </h2>
                 <p className="text-indigo-200 text-base mb-6">
                    Stripping away complexity for pure quality.
                 </p>
                 <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-md">
                    <Target className="w-8 h-8 text-cyan-400" />
                    <div>
                        <div className="text-2xl font-bold text-white leading-none">10M+</div>
                        <div className="text-xs text-indigo-200 uppercase tracking-wider">Data Points</div>
                    </div>
                 </div>
             </div>

             {/* Right - Animated Grid of Benefits */}
             <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full relative z-10">
                 {[
                     "99% Accuracy Guarantee",
                     "Native Experts (99+ Langs)",
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
                         <span className="font-semibold text-white text-base">{item}</span>
                     </motion.div>
                 ))}
             </div>
         </motion.div>
      </div>

      {/* 3. Company Overview (Compact Cards) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white mb-3">About Alanxa.ai</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-base">Delivering exceptional AI training and data solutions with precision, integrity, and a global mindset.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <motion.div 
               whileHover={{ y: -5 }}
               className="bg-[#0A0F1C] p-6 rounded-xl border border-gray-800 shadow-sm hover:shadow-xl hover:border-indigo-900 transition-all"
             >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-4">
                   <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Uncompromising Quality</h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                   Quality is the heart of Alanxa.ai. Every annotation, transcription, and data label is reviewed through strict internal quality checks to meet global standards.
                </p>
             </motion.div>

             <motion.div 
               whileHover={{ y: -5 }}
               className="bg-[#0A0F1C] p-6 rounded-xl border border-gray-800 shadow-sm hover:shadow-xl hover:border-indigo-900 transition-all"
             >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-4">
                   <Users className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Global Workforce</h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                   Experts across Hindi, Marathi, Gujarati, English, and many more. We support advanced AI systems that need to understand people across regions and cultures.
                </p>
             </motion.div>

             <motion.div 
               whileHover={{ y: -5 }}
               className="bg-[#0A0F1C] p-6 rounded-xl border border-gray-800 shadow-sm hover:shadow-xl hover:border-indigo-900 transition-all"
             >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-4">
                   <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Fair & Accessible</h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                   We combine top-tier expertise with fair pricing. We believe AI development should be accessible and honesty is the best policy for long-term partnerships.
                </p>
             </motion.div>
         </div>
         
         <div className="mt-16 text-center">
             <p className="text-xl font-medium text-white italic mb-2">
                "AI is the language of the future, and our mission is to help build it with clarity and honesty."
             </p>
             <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full mx-auto"></div>
         </div>
      </div>
      
    </div>
  );
};

export default About;
