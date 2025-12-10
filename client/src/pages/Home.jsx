import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Globe, Mic, Code, FileText, CheckCircle, 
  Users, Zap, Award, Sparkles, TrendingUp, Shield, Lock, 
  Server, MapPin, Play, Image as ImageIcon, MessageSquare, Database, Layers,
  Workflow, Target, BarChart3, Repeat, Search, Video, AlertTriangle, Map as MapIcon
} from 'lucide-react';

import SEO from '../components/SEO';

const Home = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Specific text references for Portfolio
  const portfolioText = "Our team members have experience working with companies such as RWS, Outlier, Turing, Uber AI, Soul AI, Telus, LXT.";

  const capabilities = [
    {
      title: "Text & NLP",
      icon: MessageSquare,
      features: ["Sentiment Analysis", "Named Entity Recognition", "Text Summarization", "Translation"],
      color: "bg-blue-500"
    },
    {
      title: "Audio & Speech",
      icon: Mic,
      features: ["Transcription", "Speaker Diarization", "Audio Classification", "Phonetic Annotation"],
      color: "bg-purple-500"
    },
    {
      title: "Computer Vision",
      icon: ImageIcon,
      features: ["Bounding Boxes", "Semantic Segmentation", "Keypoint Annotation", "Video Analysis"],
      color: "bg-teal-500"
    },
    {
      title: "Generative AI",
      icon: Sparkles,
      features: ["RLHF / RLAIF", "Prompt Engineering", "Hallucination Check", "Model Red-Teaming"],
      color: "bg-orange-500"
    },
    {
      title: "Search Relevance",
      icon: Search,
      features: ["Query Understanding", "Result Ranking", "Ads Evaluation", "Semantic Match"],
      color: "bg-indigo-500"
    },
    {
      title: "Trust & Safety",
      icon: AlertTriangle,
      features: ["Hate Speech Detection", "Content Moderation", "Bias Analysis", "Harmful Content"],
      color: "bg-red-500"
    },
    {
      title: "Video Intelligence",
      icon: Video,
      features: ["Action Recognition", "Object Tracking", "Temporal Labeling", "Scene Understanding"],
      color: "bg-pink-500"
    },
    {
      title: "Geospatial Data",
      icon: MapIcon,
      features: ["LiDAR Annotation", "Satellite Imagery", "POI Verification", "Route Analysis"],
      color: "bg-emerald-500"
    }
  ];

  const stats = [
    { label: "Data Points Annotated", value: "50M+" },
    { label: "Qualified Linguists", value: "1,500+" },
    { label: "Accuracy Rate", value: "99.8%" },
    { label: "Languages Supported", value: "20+" }
  ];

  const clients = [
    { name: 'Google', logo: 'https://logo.clearbit.com/google.com' },
    { name: 'Meta', logo: 'https://logo.clearbit.com/meta.com' },
    { name: 'Uber', logo: 'https://logo.clearbit.com/uber.com' },
    { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com' },
    { name: 'OpenAI', logo: 'https://logo.clearbit.com/openai.com' },
    { name: 'RWS', logo: 'https://logo.clearbit.com/rws.com' },
    { name: 'Turing', logo: 'https://logo.clearbit.com/turing.com' },
    { name: 'Telus', logo: 'https://logo.clearbit.com/telusinternational.com' },
  ];

  return (
    <div className="bg-white overflow-hidden font-sans">
      <SEO 
        title="AI Training & Data Annotation Services in India"
        description="Alanxa.ai offers premium human-in-the-loop AI training, RLHF, and data annotation services. Trusted by global innovators for accurate, scalable, and ethically sourced datasets."
        keywords="AI training India, Data Annotation Services, RLHF, Machine Learning Data, Image Annotation, Text Labeling, Audio Transcription, Content Moderation, Outsourcing India"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Alanxa AI",
          "url": "https://alanxa.ai",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://alanxa.ai/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      
      {/* 1. Cinematic Hero Section */}
      <section ref={targetRef} className="relative min-h-[55vh] flex items-center justify-center overflow-hidden bg-gray-900 pt-28 pb-10">
        {/* Background Parallax */}
        <motion.div style={{ opacity, scale, y }} className="absolute inset-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&q=80"
            alt="Global AI Network"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-gray-900 z-10"></div>
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white mb-4 shadow-xl hover:bg-white/20 transition-colors cursor-default"
            >
              <Globe className="w-3 h-3 text-sky-400" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Global AI Solutions Provider</span>
            </motion.div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-tight bg-clip-text">
              Data That Makes <br />
              <motion.span 
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-300 inline-block pb-1"
              >
                AI Human-Like
              </motion.span>
            </h1>

            <p className="text-sm md:text-base text-gray-300 mb-6 max-w-xl mx-auto leading-relaxed font-light">
              Premium AI training, RLHF, and multilingual data annotation services trusted by pioneers like Google, Meta, and Uber.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <Link to="/clients" className="group px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 transform hover:-translate-y-0.5">
                Partner With Us
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/freelancers" 
                className="group px-6 py-2.5 rounded-full font-bold text-xs md:text-sm text-white border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-2 hover:border-indigo-400/50 transform hover:-translate-y-0.5"
              >
                <Users className="w-3.5 h-3.5 text-sky-300 group-hover:text-white transition-colors" />
                Join Our Talent Network
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 8, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 z-20"
        >
          <div className="w-4 h-7 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* 2. Corporate Stats Bar */}
      <section className="bg-gray-900 py-10 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
               <motion.div 
                 key={index}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
                 className="text-center group"
               >
                 <h3 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-300 mb-2 group-hover:scale-105 transition-transform duration-300">{stat.value}</h3>
                 <p className="text-xs md:text-sm uppercase tracking-widest text-gray-400 font-bold group-hover:text-white transition-colors">{stat.label}</p>
               </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Trusted Partners (Marquee) */}
      <section className="py-16 bg-white border-b border-gray-100 overflow-hidden">
        <div className="mb-8 text-center px-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trusted by Innovation Leaders</p>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="flex w-max animate-marquee">
            {[...clients, ...clients, ...clients].map((client, index) => (
              <div key={index} className="mx-8 md:mx-12 flex items-center justify-center min-w-[100px] md:min-w-[140px] grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <img 
                  src={client.logo} 
                  alt={client.name} 
                  className="h-8 md:h-10 object-contain" 
                  onError={(e) => { e.target.style.display='none'; }}
                />
              </div>
            ))}
          </div>
          {/* Fade Edges */}
          <div className="absolute top-0 left-0 w-20 md:w-40 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-20 md:w-40 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
        <div className="text-center mt-10 px-4">
            <p className="text-sm text-gray-500 italic max-w-2xl mx-auto">
               "{portfolioText}"
            </p>
        </div>
      </section>

      {/* 4. Capabilities Ecosystem (Grid) */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs mb-2 block">Our Capabilities</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Multi-Modal Data Solutions</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We handle every data type with domain-specific expertise.
                </p>
            </div>

            <motion.div 
                variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
                {capabilities.map((cap, index) => {
                    const Icon = cap.icon;
                    return (
                        <motion.div 
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group cursor-default transition-shadow"
                        >
                            <div className={`absolute -top-6 -right-6 w-20 h-20 ${cap.color} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
                            <div className={`w-12 h-12 rounded-xl ${cap.color} bg-opacity-10 flex items-center justify-center mb-5 text-${cap.color.split('-')[1]}-600 group-hover:scale-110 transition-transform`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{cap.title}</h3>
                            <ul className="space-y-2">
                                {cap.features.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                                        <div className={`w-1 h-1 rounded-full ${cap.color}`}></div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
      </section>

      {/* 5. Who We Are (Grid Layout) */}
      <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                      <div className="inline-block px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 font-bold text-xs mb-6">
                          OUR MISSION
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                          We believe AI should reflect the <span className="text-indigo-600">diversity</span> of the human experience.
                      </h2>
                      <p className="text-base text-gray-600 mb-8 leading-relaxed">
                          Alanxa.ai was created with a simple idea: AI becomes better only when real people train it with care, skill, and understanding. 
                          Named after Alan Turing, we align technology with humanity.
                      </p>
                      
                      <div className="space-y-4 mb-8">
                          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 mt-1 shrink-0"><CheckCircle className="w-5 h-5"/></div>
                              <div>
                                  <h4 className="font-bold text-gray-900 text-sm">Ethical Sourcing</h4>
                                  <p className="text-gray-500 text-xs mt-1">We ensure fair pay and working conditions for our global annotator community.</p>
                              </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 mt-1 shrink-0"><Shield className="w-5 h-5"/></div>
                              <div>
                                  <h4 className="font-bold text-gray-900 text-sm">Enterprise Security</h4>
                                  <p className="text-gray-500 text-xs mt-1">ISO 27001 compliant workflows with strict NDA and PII protection protocols.</p>
                              </div>
                          </div>
                      </div>

                      <Link to="/about" className="text-indigo-600 font-bold inline-flex items-center gap-2 hover:gap-3 transition-all text-sm">
                          More About Us <ArrowRight className="w-4 h-4" />
                      </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                      <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-teal-500 opacity-20 blur-2xl rounded-full"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=1000&fit=crop&q=80" 
                        alt="Team Meeting" 
                        className="relative rounded-2xl shadow-xl border-4 border-white object-cover h-[450px] md:h-[550px] w-full transform hover:scale-[1.01] transition-transform duration-500"
                      />
                      <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-xl shadow-xl max-w-xs hidden md:block border border-gray-100">
                          <div className="flex items-center gap-4 mb-2">
                              <div className="flex -space-x-3">
                                  {[1,2,3,4].map(i => (
                                      <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold overflow-hidden">
                                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                                      </div>
                                  ))}
                              </div>
                              <span className="font-bold text-gray-900 text-sm">+1.5k Experts</span>
                          </div>
                          <p className="text-xs text-gray-500">
                              Top-tier linguists and domain experts ready to deploy.
                          </p>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>

      {/* 6. Global Reach (Modern Map Viz) */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
             <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1200&fit=crop&q=80" className="w-full h-full object-cover opacity-20 mix-blend-screen" alt="Earth" />
             <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
             >
                 <div className="inline-block px-4 py-1 border border-white/20 rounded-full backdrop-blur-md mb-6 bg-white/5">
                    <span className="flex items-center gap-2 text-xs font-bold"><Globe className="w-3 h-3 text-sky-400"/> GLOBAL COVERAGE</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold mb-6">Speaking the World's Languages</h2>
                 <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                     Our decentralized workforce spans 35+ countries, providing native-level nuance in 20+ languages including Hindi, Spanish, French, and more.
                 </p>
                 
                 <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                    {["Hindi", "Spanish", "French", "German", "Japanese", "Malayalam", "Telugu", "Tamil", "Marathi", "Urdu"].map((lang, i) => (
                        <motion.span 
                            key={i} 
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 transition-all cursor-default text-sm"
                        >
                            {lang}
                        </motion.span>
                    ))}
                    <span className="px-4 py-2 rounded-lg border border-dashed border-white/20 text-gray-400 text-sm">
                        + 15 More
                    </span>
                 </div>
             </motion.div>
        </div>
      </section>

      {/* 6.5. Workflow Engine (Professional Animation) */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs mb-2 block">The Alanxa Standard</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Engineered for Scale</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We turn chaos into structured data through a battle-tested three-phase workflow.
                </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-100 to-transparent"></div>
                
                {[
                    {
                        icon: Target, 
                        step: "01",
                        title: "Calibration", 
                        desc: "We run rapid pilot batches to align with your guidelines and edge-cases.",
                        color: "text-indigo-600"
                    },
                    {
                        icon: Workflow, 
                        step: "02", 
                        title: "Production", 
                        desc: "Automated distribution to qualified domain experts with real-time tracking.",
                        color: "text-sky-600"
                    },
                    {
                        icon: BarChart3, 
                        step: "03", 
                        title: "Validation", 
                        desc: "Multi-tier QA and programmatic checks ensure 99% acceptance rates.",
                        color: "text-teal-600"
                    }
                ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative bg-white pt-6 group"
                        >
                            <div className="relative z-10 w-24 h-24 mx-auto bg-white rounded-full border-4 border-gray-50 flex items-center justify-center mb-6 shadow-lg group-hover:border-indigo-50 transition-all duration-300 group-hover:shadow-xl">
                                <Icon className={`w-10 h-10 ${item.color} group-hover:scale-110 transition-transform`} />
                                <div className="absolute -top-2 -right-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white">
                                    {item.step}
                                </div>
                            </div>
                            <div className="text-center px-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
            
            {/* Trust Signal Strip */}
            <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                    { label: "SOC 2 Type II", sub: "Ready" },
                    { label: "ISO 27001", sub: "Certified" },
                    { label: "GDPR", sub: "Compliant" },
                    { label: "HIPAA", sub: "Aligned" },
                ].map((badge, i) => (
                    <div key={i} className="flex flex-col items-center justify-center group cursor-default">
                        <span className="text-xl font-bold text-gray-300 mb-1 group-hover:text-indigo-900 transition-colors">{badge.label}</span>
                        <span className="text-[10px] uppercase tracking-widest text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded opacity-70 group-hover:opacity-100">{badge.sub}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 7. New CTA with Unsplash Image (Compact & Professional) */}
      <section className="relative py-20 overflow-hidden group">
          {/* Background Image with Zoom Effect */}
          <div className="absolute inset-0 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=600&fit=crop&q=80" 
                alt="Modern Office Team" 
                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[15s] ease-linear"
              />
              {/* Professional Gradient Overlay */}
              <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-[2px]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 mix-blend-overlay"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                      Ready to scale with human-in-the-loop?
                  </h2>
                  <p className="text-base text-gray-300 font-light">
                      Join the leaders building safe, inclusive AI models with Alanxa.
                  </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex gap-4 shrink-0"
              >
                  <Link to="/clients" className="bg-white text-indigo-900 px-8 py-3 rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1">
                      Start Project
                  </Link>
                  <Link to="/contact" className="px-8 py-3 rounded-full border border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm text-sm font-bold transition-all hover:-translate-y-1">
                      Contact Sales
                  </Link>
              </motion.div>
          </div>
      </section>

    </div>
  );
};

export default Home;
