import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  CheckCircle as CheckCircleIcon, Mic as MicIcon, Globe as GlobeIcon, Code as CodeIcon,
  FileText as FileTextIcon, Shield as ShieldIcon, Sparkles as SparklesIcon, 
  Brain as BrainIcon, Volume2 as Volume2Icon, Layout as LayoutIcon, 
  ArrowRight as ArrowRightIcon, Layers as LayersIcon, Workflow as WorkflowIcon, 
  Terminal as TerminalIcon, Cpu as CpuIcon, Activity as ActivityIcon, Lock as LockIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Services = () => {
    
  const serviceSections = [
    {
      id: 'ai-training',
      title: 'AI Training & RLHF',
      icon: BrainIcon,
      desc: 'We align AI models with human intent using Reinforcement Learning from Human Feedback (RLHF). Our experts rank, rewrite, and improve model responses to ensure helpfulness and safety.',
      useCases: ['Chatbot Fine-Tuning', 'Instruction Following', 'Code Generation', 'Reasoning & Logic Training'],
      reliability: 'Experience with major LLMs (like Gemini & ChatGPT counterparts) ensuring high-fidelity feedback.',
      color: 'bg-indigo-600',
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 'llm-eval',
      title: 'LLM Evaluation & Safety',
      icon: ShieldIcon,
      desc: 'Rigorous testing of Generative AI models for hallucination, bias, toxicity, and factuality. We stress-test models to ensure they are safe for public deployment.',
      useCases: ['Red Teaming', 'Factuality Checking', 'Safety & Harm Evaluation', 'Tone & Style Analysis'],
      reliability: 'Proven track record with projects like Project Flamingo and Meta LATTE (Safety/Tone).',
      color: 'bg-sky-600',
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 'data-annotation',
      title: 'Data Annotation',
      icon: FileTextIcon,
      desc: 'Pixel-perfect and context-aware labeling for Text, Image, and Video datasets. We handle complex taxonomies and massive volumes with ease.',
      useCases: ['OCR & Document Understanding', 'Entity Extraction (NER)', 'Image Bounding Boxes', 'Video Object Tracking'],
      reliability: 'Millions of tasks completed with >99% acceptance rates for clients like Uber and Google.',
      color: 'bg-cyan-600',
      image: "https://res.cloudinary.com/dikppmyhp/image/upload/v1766218286/Data_Annotation_1_ujl3ga.jpg"
    },
    {
      id: 'transcription',
      title: 'Transcription & Localization',
      icon: GlobeIcon,
      desc: 'Converting speech to text and adapting content for local markets. We go beyond translation to ensure cultural relevance.',
      useCases: ['Audio Transcription', 'Subtitle Creation', 'Cultural Adaptation', 'Machine Translation Post-Editing'],
      reliability: 'Native speakers in 20+ Indian & Global languages (Hindi, Marathi, Tamil, etc.).',
      color: 'bg-emerald-600',
      image: "https://res.cloudinary.com/dikppmyhp/image/upload/v1766045858/0.15_Transcription_tallpr.jpg"
    },
    {
      id: 'audio-voice',
      title: 'Audio Dubbing & Voice',
      icon: Volume2Icon,
      desc: 'High-quality voice collection and evaluation for TTS (Text-to-Speech) and ASR systems. Studio-quality recordings.',
      useCases: ['Voice Data Collection', 'TTS Quality Rating', 'Speaker Verification', 'Audio Segmentation'],
      reliability: 'Experience with Uber AI (ADI & EDU projects) and Google Audio Prompts.',
      color: 'bg-violet-600',
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="bg-black overflow-hidden font-sans">
      <SEO 
        title="Our Services - AI Training & Annotation"
        description="Comprehensive AI services including RLHF, Data Annotation, Content Moderation, and Transcription. Providing high-quality training data for LLMs and Computer Vision."
        keywords="RLHF Services, Data Annotation Company, Image Labeling, Video Annotation, Audio Transcription, Content Moderation India, AI Model Training"
        url="/services"
      />
      
      {/* 1. Modern Hero Section */}
      <section className="relative flex items-center bg-black overflow-hidden pt-24 pb-12 lg:pt-32 lg:pb-24 lg:min-h-[70vh]">
        <div className="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_1920/v1766136646/ChatGPT_Image_Dec_19_2025_03_00_33_PM_sdpumk.png"
            srcSet="
                https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_640/v1766136646/ChatGPT_Image_Dec_19_2025_03_00_33_PM_sdpumk.png 640w,
                https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_1024/v1766136646/ChatGPT_Image_Dec_19_2025_03_00_33_PM_sdpumk.png 1024w,
                https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_1920/v1766136646/ChatGPT_Image_Dec_19_2025_03_00_33_PM_sdpumk.png 1920w
            "
            sizes="100vw"
            alt="Data Services" 
            className="w-full h-full object-cover object-center opacity-30 animate-slow-zoom"
            width="1920"
            height="1080"
            fetchPriority="high"
            decoding="async"
          />

        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            {/* Removed motion.div wrapper from LCP Text */}
            <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-4 lg:mb-6 backdrop-blur-sm">
                    <SparklesIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="text-xs lg:text-sm font-bold uppercase tracking-wider">World-Class Execution</span>
                </div>
                <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight">
                    Data Services That <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Power Intelligence</span>
                </h1>
                <p className="text-sm lg:text-base text-gray-100 leading-relaxed max-w-lg mb-6 lg:mb-8 font-medium">
                    From RLHF to Audio Annotation, we deliver the human intelligence your AI needs to succeed. Scalable, secure, and precise.
                </p>
                <Link to="/contact" className="px-6 py-2.5 lg:px-8 lg:py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/40 inline-flex items-center gap-2 text-sm lg:text-base">
                    Get a Custom Quote <ArrowRightIcon className="w-4 h-4"/>
                </Link>
            </div>
        </div>
      </section>

      {/* 2. Alternating Services List */}
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
              <span className="text-indigo-300 font-bold tracking-widest uppercase text-xs mb-2 block">Our Expertise</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Comprehensive Solutions</h2>
          </div>

          <div className="space-y-16">
            {serviceSections.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12`}
                  id={service.id}
                >
                  {/* Image Side */}
                  <div className="w-full lg:w-5/12 relative group">
                      <div className={`absolute -inset-4 ${service.color} opacity-20 blur-xl rounded-[1.5rem] group-hover:opacity-30 transition-opacity duration-500`}></div>
                      <div className="relative rounded-2xl overflow-hidden shadow-lg transform group-hover:scale-[1.01] transition-transform duration-500 h-[220px] lg:h-[260px]">
                          <img 
                            src={service.image} 
                            alt={service.title} 
                            className="w-full h-full object-cover"
                            width="640"
                            height="360"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className={`absolute inset-0 ${service.color} mix-blend-overlay opacity-20`}></div>
                      </div>
                      
                      {/* Floating Badge - Smaller */}
                      <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute -bottom-3 -right-3 bg-[#0A0F1C] p-2 rounded-lg shadow-md flex items-center gap-2 border border-gray-800 max-w-[150px]"
                      >
                          <div className={`p-1.5 rounded-md ${service.color} bg-opacity-20`}>
                              <Icon className={`w-4 h-4 text-gray-700`} />
                          </div>
                          <span className="text-xs font-bold text-gray-100">Expert Verified</span>
                      </motion.div>
                  </div>

                  {/* Text Side */}
                  <div className="w-full lg:w-7/12">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${service.color} bg-opacity-20 text-gray-100 font-bold text-xs mb-3`}>
                          <Icon className="w-3 h-3" />
                          {service.title}
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                          {service.title.split('&')[0]} <br/>
                          <span className={`${service.color.replace('bg-', 'text-')} bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200`}>
                              & {service.title.split('&')[1] || 'More'}
                          </span>
                      </h3>
                      
                      <p className="text-sm text-gray-200 leading-relaxed mb-4">
                          {service.desc}
                      </p>

                      <div className="bg-[#0A0F1C] rounded-xl p-4 border border-gray-800 mb-4 hover:shadow-sm transition-shadow">
                          <h4 className="font-bold text-white mb-2 flex items-center gap-2 text-xs">
                              <LayersIcon className="w-3 h-3 text-indigo-300" /> Use Cases
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {service.useCases.map((useCase, i) => (
                                  <motion.div 
                                    whileHover={{ x: 5 }}
                                    key={i} 
                                    className="flex items-center gap-2 text-gray-200 text-xs font-medium"
                                  >
                                      <CheckCircleIcon className={`w-3 h-3 ${service.color.replace('bg-', 'text-')} shrink-0`} />
                                      {useCase}
                                  </motion.div>
                              ))}
                          </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-gray-800 pt-4">
                           <div className="text-xs text-gray-300 italic max-w-xs">
                               "{service.reliability}"
                           </div>
                           <Link 
                             to="/contact" 
                             className="text-black bg-white px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
                           >
                               Book Demo <ArrowRightIcon className="w-3 h-3" />
                           </Link>
                      </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
      </div>

      {/* 3. Process Section */}
      <section className="bg-black py-12 lg:py-16 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-0 p-10 opacity-5"
              >
                  <CpuIcon className="w-80 h-80 text-indigo-500" />
              </motion.div>
              
              <div className="text-center mb-10 relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">How We Deliver Excellence</h2>
                  <p className="text-gray-200 text-xs md:text-sm">Our battle-tested workflow for consistent quality.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                  {[
                      { step: "01", title: "Consult", desc: "We define guidelines and edge cases." },
                      { step: "02", title: "Pilot", desc: "Small batch execution to align quality." },
                      { step: "03", title: "Scale", desc: "Ramping up with calibrated experts." },
                      { step: "04", title: "Deliver", desc: "Final QA and structured data export." }
                  ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-gray-800/40 p-5 rounded-xl border border-gray-700 hover:border-indigo-500/50 hover:bg-gray-800/80 transition-all cursor-pointer"
                      >
                          <div className="text-4xl font-bold text-gray-600/50 mb-3">{item.step}</div>
                          <h3 className="text-lg font-bold text-white mb-1.5">{item.title}</h3>
                          <p className="text-gray-200 text-xs leading-relaxed">{item.desc}</p>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* 4. Final CTA */}
      <section className="py-12 bg-black overflow-hidden">
          <div className="max-w-3xl mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative rounded-2xl p-8 md:p-10 text-center text-white shadow-xl overflow-hidden group border border-gray-800"
              >
                  {/* Background Image & Overlay */}
                  <div className="absolute inset-0">
                      <img 
                        src="https://res.cloudinary.com/dikppmyhp/image/upload/v1766164357/WhatsApp_Image_2025-12-19_at_10.25.43_PM_bkrjeh.jpg" 
                        alt="CTA Background" 
                        className="w-full h-full object-cover opacity-100"
                      />
                      <div className="absolute inset-0 bg-[#020617]/60"></div>
                  </div>
                  
                  {/* Grid Pattern Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

                  <div className="relative z-10 max-w-xl mx-auto">
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                          <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 font-semibold text-xs md:text-sm mb-4 shadow-sm">
                             ✨ Start Your AI Journey
                          </span>
                          <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
                              Ready to build something <br/> extraordinary?
                          </h2>
                          <p className="text-white text-sm mb-6 leading-relaxed">
                              Get access to our expert workforce and enterprise-grade platform. 
                              <span className="block mt-1 opacity-80 text-xs">Custom pilot programs available for volume datasets.</span>
                          </p>
                      </motion.div>

                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row justify-center gap-3 mb-6"
                      >
                          <Link to="/contact" className="bg-white text-indigo-700 px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-base">
                              Start Free Pilot <ArrowRightIcon className="w-4 h-4"/>
                          </Link>
                          <Link to="/clients" className="px-6 py-2.5 rounded-full font-bold text-white border border-white/30 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 text-base">
                              See Case Studies
                          </Link>
                      </motion.div>

                      <div className="flex flex-wrap justify-center gap-4 pt-5 border-t border-white/10">
                          {[
                              { text: "NDA Protected", icon: LockIcon },
                              { text: "Free Consultation", icon: CheckCircleIcon },
                              { text: "Global Coverage", icon: GlobeIcon }
                          ].map((item, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-indigo-100/90 font-medium text-xs md:text-sm">
                                  <item.icon className="w-3.5 h-3.5 text-sky-300" />
                                  {item.text}
                              </div>
                          ))}
                      </div>
                  </div>
              </motion.div>
          </div>
      </section>

    </div>
  );
};

export default Services;
