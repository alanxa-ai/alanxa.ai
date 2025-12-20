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
    { name: 'RWS', logo: '/brandslogo/rws.png' },
    { name: 'Outlier', logo: '/brandslogo/outlier.png' },
    { name: 'Turing', logo: '/brandslogo/Turing.jpeg' },
    { name: 'Uber AI', logo: '/brandslogo/uber.jpeg' },
    { name: 'Soul Machines', logo: '/brandslogo/soul.ai.jpeg' },
    { name: 'Telus', logo: '/brandslogo/telus.png' },
    { name: 'LXT', logo: '/brandslogo/lxt.png' },
    { name: 'ChatGPT', logo: '/brandslogo/chatgpt.png' },
    { name: 'Google', logo: '/brandslogo/google.png' },
    { name: 'Meta', logo: '/brandslogo/meta.png' },
  ];

  return (
    <div className="bg-black overflow-hidden font-sans text-white">
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
      <section ref={targetRef} className="relative min-h-[50vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-black pt-24 pb-12 md:pt-32 md:pb-20">
        {/* Background Image - Optimized for LCP (No JS Parallax on Mobile/Initial Load) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src="https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_1920/v1766143052/WhatsApp_Image_2025-12-19_at_4.46.30_PM_tejjwi.jpg"
            srcSet="
              https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_640/v1766143052/WhatsApp_Image_2025-12-19_at_4.46.30_PM_tejjwi.jpg 640w,
              https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_1024/v1766143052/WhatsApp_Image_2025-12-19_at_4.46.30_PM_tejjwi.jpg 1024w,
              https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_1920/v1766143052/WhatsApp_Image_2025-12-19_at_4.46.30_PM_tejjwi.jpg 1920w
            "
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
            alt="Global AI Network"
            className="w-full h-full object-cover object-center"
            width="1920"
            height="1080"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-gray-900 z-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center w-full">
          {/* Removed motion.div initial opacity=0 to prevent High LCP */}
          <div>
            <div 
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white mb-2 shadow-xl hover:bg-white/20 transition-colors cursor-default"
            >
              <Globe className="w-2 h-2 md:w-3 md:h-3 text-sky-400" />
              <span className="text-[8px] md:text-sm font-bold tracking-widest uppercase">Global AI Solutions Provider</span>
            </div>

            <h1 className="text-xl md:text-6xl lg:text-7xl font-bold text-white mb-3 tracking-tight leading-tight bg-clip-text">
              Data That Makes <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-300 inline-block pb-1">
                AI Human-Like
              </span>
            </h1>

            <p className="text-[10px] md:text-lg lg:text-xl text-gray-300 mb-5 max-w-2xl mx-auto leading-relaxed font-light px-4">
              Premium AI training, RLHF, and multilingual data annotation services trusted by pioneers like Google, Meta, and Uber.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full sm:w-auto px-6">
              <Link to="/clients" aria-label="Partner With Us" className="group w-[180px] sm:w-auto px-4 py-1.5 md:px-6 md:py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] md:text-base flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 transform hover:-translate-y-0.5">
                Partner With Us
                <ArrowRight className="w-2.5 h-2.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/freelancers" 
                aria-label="Join Our Talent Network"
                className="group w-[180px] sm:w-auto px-4 py-1.5 md:px-6 md:py-3 rounded-full font-bold text-[10px] md:text-base text-white border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-1.5 hover:border-indigo-400/50 transform hover:-translate-y-0.5"
              >
                <Users className="w-2.5 h-2.5 md:w-4 md:h-4 text-sky-300 group-hover:text-white transition-colors" />
                Join Our Talent Network
              </Link>
            </div>
          </div>
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
      <section className="bg-black py-10 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
               <div 
                 key={index}
                 className="text-center group"
               >
                 <h3 className="text-base md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-300 mb-0.5 md:mb-2 group-hover:scale-105 transition-transform duration-300">{stat.value}</h3>
                 <p className="text-[8px] md:text-sm uppercase tracking-widest text-gray-200 font-bold group-hover:text-white transition-colors">{stat.label}</p>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Trusted Partners (Marquee) */}
      <section className="py-16 bg-black border-b border-gray-800 overflow-hidden">
        <div className="mb-8 text-center px-4">
            <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">Trusted by Innovation Leaders</p>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="flex w-max animate-marquee">
            {[...clients, ...clients, ...clients].map((client, index) => (
              <div key={index} className="mx-8 md:mx-12 flex items-center justify-center min-w-[100px] md:min-w-[140px] transition-all duration-300">
                <img 
                  src={client.logo} 
                  alt={client.name} 
                  className="h-8 md:h-10 object-contain" 
                  width="150"
                  height="40"
                  loading="lazy"
                  onError={(e) => { 
                      e.target.style.display='none'; 
                      e.target.nextSibling.style.display='block';
                  }}
                />
                <span style={{display: 'none'}} className="text-lg md:text-xl font-black text-gray-300 uppercase tracking-tighter hover:text-gray-500 transition-colors cursor-default whitespace-nowrap">
                    {client.name}
                </span>
              </div>
            ))}
          </div>
          {/* Fade Edges */}
          <div className="absolute top-0 left-0 w-20 md:w-40 h-full bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-20 md:w-40 h-full bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
        </div>
        <div className="text-center mt-10 px-4">
            <p className="text-sm text-gray-300 italic max-w-2xl mx-auto">
               "{portfolioText}"
            </p>
        </div>
      </section>

      {/* 4. Capabilities Ecosystem (Grid) */}
      <section className="py-20 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm mb-2 block">Our Capabilities</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Multi-Modal Data Solutions</h2>
                <p className="text-base text-gray-200 max-w-2xl mx-auto">
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
                            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}
                            className="bg-[#0A0F1C] rounded-xl p-6 shadow-sm border border-gray-800 relative overflow-hidden group cursor-default transition-shadow"
                        >
                            <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-600 opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="w-12 h-12 rounded-xl bg-[#2563EB] flex items-center justify-center mb-5 text-white group-hover:scale-110 transition-transform">
                                <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-white mb-3">{cap.title}</h3>
                            <ul className="space-y-2">
                                {cap.features.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs text-white">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
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
      <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                      <div className="inline-block px-3 py-1 bg-indigo-50 rounded-full text-indigo-400 font-bold text-sm mb-6">
                          OUR MISSION
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                          We believe AI should reflect the <span className="text-indigo-400">diversity</span> of the human experience.
                      </h2>
                      <p className="text-sm text-gray-300 mb-8 leading-relaxed">
                          Alanxa.ai was created with a simple idea: AI becomes better only when real people train it with care, skill, and understanding. 
                          Named after Alan Turing, we align technology with humanity.
                      </p>
                      
                      <div className="space-y-4 mb-8">
                          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 mt-1 shrink-0"><CheckCircle className="w-5 h-5"/></div>
                              <div>
                                  <h4 className="font-bold text-white text-sm">Ethical Sourcing</h4>
                                  <p className="text-gray-300 text-xs mt-1">We ensure fair pay and working conditions for our global annotator community.</p>
                              </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 mt-1 shrink-0"><Shield className="w-5 h-5"/></div>
                              <div>
                                  <h4 className="font-bold text-white text-sm">Enterprise Security</h4>
                                  <p className="text-gray-300 text-xs mt-1">ISO 27001 compliant workflows with strict NDA and PII protection protocols.</p>
                              </div>
                          </div>
                      </div>

                      <Link to="/about" aria-label="More About Us" className="text-indigo-400 font-bold inline-flex items-center gap-2 hover:gap-3 transition-all text-base">
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
                        src="https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto/v1766045862/Our_mission_image_ytxpkx.jpg" 
                        alt="Team Meeting" 
                        className="relative rounded-2xl shadow-xl border-4 border-white object-cover h-[450px] md:h-[550px] w-full transform hover:scale-[1.01] transition-transform duration-500"
                        width="600"
                        height="550"
                        loading="lazy"
                      />
                      <div className="absolute -bottom-6 -left-6 bg-[#0A0F1C] p-5 rounded-xl shadow-xl max-w-xs hidden md:block border border-gray-800">
                          <div className="flex items-center gap-4 mb-2">
                              <div className="flex -space-x-3">
                                  {[1,2,3,4].map(i => (
                                      <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#0A0F1C] flex items-center justify-center text-xs font-bold overflow-hidden">
                                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" width="32" height="32" loading="lazy" />
                                      </div>
                                  ))}
                              </div>
                              <span className="font-bold text-white text-base">+1.5k Experts</span>
                          </div>
                          <p className="text-sm text-gray-200">
                              Top-tier linguists and domain experts ready to deploy.
                          </p>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>

      {/* 6. Global Reach (Modern Map Viz) */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
             <img 
                src="https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto/v1766136113/ChatGPT_Image_Dec_19_2025_02_51_16_PM_wrefxa.png" 
                className="w-full h-full object-cover opacity-20 mix-blend-screen" 
                alt="Global Map" 
                width="1920"
                height="1080"
                loading="lazy"
            />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
             >
                 <div className="inline-block px-4 py-1 border border-white/20 rounded-full backdrop-blur-md mb-6 bg-white/5">
                    <span className="flex items-center gap-2 text-sm font-bold"><Globe className="w-3 h-3 text-sky-400"/> GLOBAL COVERAGE</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold mb-6">Speaking the World's Languages</h2>
                 <p className="text-base text-blue-50 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                     Our decentralized workforce spans 35+ countries, providing native-level nuance in 99+ languages including Hindi, Spanish, French, and more.
                 </p>
                 
                 <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
                    {["Hindi", "Spanish", "French", "German", "Japanese", "Arabic", "Portuguese", "Russian", "Chinese", "Italian", "Korean", "Turkish", "Vietnamese", "Malayalam", "Telugu", "Tamil", "Marathi", "Urdu", "Bengali", "Gujarati", "Kannada", "Punjabi", "Polish", "Dutch", "Thai", "Indonesian"].map((lang, i) => (
                        <motion.span 
                            key={i} 
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 transition-all cursor-default text-sm"
                        >
                            {lang}
                        </motion.span>
                    ))}
                    <span className="px-4 py-2 rounded-lg border border-dashed border-white/20 text-gray-400 text-sm flex items-center">
                        + 50 More Dialects
                    </span>
                 </div>
             </motion.div>
        </div>
      </section>

      {/* 6.5. Workflow Engine (Professional Animation) */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="text-indigo-400 font-bold tracking-wider uppercase text-base mb-2 block">The Alanxa Standard</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Engineered for Scale</h2>
                <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                    We turn chaos into structured data through a battle-tested three-phase workflow.
                </p>
            </div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-900 to-transparent"></div>
                
                {[
                    {
                        icon: Target, 
                        step: "01",
                        title: "Calibration", 
                        desc: "We run rapid pilot batches to align with your guidelines and edge-cases.",
                        color: "text-indigo-400"
                    },
                    {
                        icon: Workflow, 
                        step: "02", 
                        title: "Production", 
                        desc: "Automated distribution to qualified domain experts with real-time tracking.",
                        color: "text-sky-400"
                    },
                    {
                        icon: BarChart3, 
                        step: "03", 
                        title: "Validation", 
                        desc: "Multi-tier QA and programmatic checks ensure 99% acceptance rates.",
                        color: "text-teal-400"
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
                            className="relative bg-[#0A0F1C] pt-6 group rounded-xl px-2"
                        >
                            <div className="relative z-10 w-24 h-24 mx-auto bg-[#0A0F1C] rounded-full border-4 border-gray-800 flex items-center justify-center mb-6 shadow-lg group-hover:border-indigo-900 transition-all duration-300 group-hover:shadow-xl">
                                <Icon className={`w-10 h-10 ${item.color} group-hover:scale-110 transition-transform`} />
                                <div className="absolute -top-2 -right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-base border-4 border-[#0A0F1C]">
                                    {item.step}
                                </div>
                            </div>
                            <div className="text-center px-4">
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-200 leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
            
            {/* Trust Signal Strip */}
            <div className="mt-16 pt-8 border-t border-gray-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                    { label: "SOC 2 Type II", sub: "Ready" },
                    { label: "ISO 27001", sub: "Certified" },
                    { label: "GDPR", sub: "Compliant" },
                    { label: "HIPAA", sub: "Aligned" },
                ].map((badge, i) => (
                    <div key={i} className="flex flex-col items-center justify-center group cursor-default">
                        <span className="text-lg md:text-xl font-bold text-gray-100 mb-1 group-hover:text-indigo-900 transition-colors">{badge.label}</span>
                        <span className="text-[10px] md:text-xs uppercase tracking-widest text-indigo-300 font-bold bg-indigo-900/30 px-2 py-0.5 rounded opacity-70 group-hover:opacity-100">{badge.sub}</span>
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
                src="https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto/v1766045150/0.08_seconds_h3poas.jpg" 
                alt="Modern Office Team" 
                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[15s] ease-linear"
                width="1920"
                height="1080"
                loading="lazy"
              />
              {/* Professional Gradient Overlay */}
              <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left h-full">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl relative"
              >
                  {/* Subtle Glow Behind Text */}
                  <div className="absolute -inset-10 bg-indigo-500/20 blur-3xl rounded-full opacity-50 pointer-events-none"></div>
                  
                  <h2 className="relative text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-3 tracking-tight leading-tight">
                      Ready to scale with human-in-the-loop?
                  </h2>
                  <p className="relative text-sm text-gray-300 font-light max-w-xl mx-auto md:mx-0">
                      Join the leaders building safe, inclusive AI models with Alanxa.
                  </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
               <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <Link to="/clients" className=" text-white-950 px-6 py-3 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all hover:-translate-y-1 flex items-center justify-center">
                      Start Project
                  </Link>
                  <Link to="/contact" className="px-6 py-3 rounded-full border border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-md text-sm font-bold transition-all hover:-translate-y-1 flex items-center justify-center">
                      Contact Sales
                  </Link>
              </div>
              </motion.div>
          </div>
      </section>

    </div>
  );
};

export default Home;
