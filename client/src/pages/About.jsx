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
        title="About Alanxa AI - Enterprise AI Data Partner" 
        description="Secure, scalable, and confidential AI data annotation services. Your trusted Enterprise AI data partner in India for high-quality training datasets."
        keywords="Enterprise AI data partner, Scalable AI data annotation, Secure AI data services, Confidential AI data annotation, AI outsourcing company India, AI services for startups"
        url="/about"
      />
      
      {/* 1. Hero Section with Banner */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_1920/v1766429166/ChatGPT_Image_Dec_23_2025_12_15_18_AM_1_dq3jzu.png" 
            srcSet="
              https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_640/v1766429166/ChatGPT_Image_Dec_23_2025_12_15_18_AM_1_dq3jzu.png 640w,
              https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_1024/v1766429166/ChatGPT_Image_Dec_23_2025_12_15_18_AM_1_dq3jzu.png 1024w,
              https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_1920/v1766429166/ChatGPT_Image_Dec_23_2025_12_15_18_AM_1_dq3jzu.png 1920w
            "
            sizes="100vw"
            alt="" 
            className="w-full h-full object-cover"
            width="1920"
            height="1080"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span className="text-xs font-bold tracking-wider uppercase text-white">About Alanxa</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Shaping the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Future of AI</span>
          </h1>
          
          <p className="text-base sm:text-lg text-white max-w-2xl mx-auto leading-relaxed mb-10">
            Where human intelligence teaches artificial intelligence to understand people, cultures, emotions, and voices.
          </p>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { value: '10M+', label: 'Data Points' },
              { value: '99+', label: 'Languages' },
              { value: '99%', label: 'Accuracy' },
              { value: '<24h', label: 'Kickoff Time' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-colors">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Founder Section */}
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <div className="relative inline-block mb-4 group">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <img 
                  src="/founder.jpg" 
                  alt="Aman Shaikh" 
                  className="relative z-10 w-28 h-28 object-cover rounded-full shadow-lg border-2 border-white" 
                  width="112"
                  height="112"
                  loading="lazy"
              />
          </div>
          
          <div className="mb-4">
               <h2 className="text-lg font-bold text-white">Aman Shaikh</h2>
               <p className="text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase">Founder & CEO</p>
          </div>

          <p className="text-xl md:text-2xl font-bold text-white leading-tight mb-3 italic">
              "We don't just train AI—we give it a soul that understands every language."
          </p>
          <p className="text-sm text-white leading-relaxed max-w-xl mx-auto">
              Alanxa.ai was created with the belief that artificial intelligence should feel human. True intelligence is not just about processing data but understanding people, cultures, emotions, and voices.
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
              <p className="text-white text-xs leading-relaxed">
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
              <p className="text-white text-xs leading-relaxed">
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
              <p className="text-white text-xs leading-relaxed">
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
              <p className="text-white text-xs leading-relaxed">
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
            <p className="text-white max-w-2xl mx-auto text-base">Delivering exceptional AI training and data solutions with precision, integrity, and a global mindset.</p>
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
                <p className="text-sm text-white leading-relaxed">
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
                <p className="text-sm text-white leading-relaxed">
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
                <p className="text-sm text-white leading-relaxed">
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
