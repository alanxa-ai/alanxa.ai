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
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 'transcription',
      title: 'Transcription & Localization',
      icon: GlobeIcon,
      desc: 'Converting speech to text and adapting content for local markets. We go beyond translation to ensure cultural relevance.',
      useCases: ['Audio Transcription', 'Subtitle Creation', 'Cultural Adaptation', 'Machine Translation Post-Editing'],
      reliability: 'Native speakers in 20+ Indian & Global languages (Hindi, Marathi, Tamil, etc.).',
      color: 'bg-emerald-600',
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
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
    <div className="bg-white overflow-hidden font-sans">
      <SEO 
        title="Our Services - AI Training & Annotation"
        description="Comprehensive AI services including RLHF, Data Annotation, Content Moderation, and Transcription. Providing high-quality training data for LLMs and Computer Vision."
        keywords="RLHF Services, Data Annotation Company, Image Labeling, Video Annotation, Audio Transcription, Content Moderation India, AI Model Training"
        url="/services"
      />
      
      {/* 1. Modern Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center bg-gray-900 overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1920&h=1080&fit=crop&q=80" 
            alt="Data Services" 
            className="w-full h-full object-cover opacity-30 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <motion.div 
               initial={{ opacity: 0, x: -30 }} 
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               className="max-w-3xl"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6 backdrop-blur-sm">
                    <SparklesIcon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">World-Class Execution</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Data Services That <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Power Intelligence</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-lg mb-8">
                    From RLHF to Audio Annotation, we deliver the human intelligence your AI needs to succeed. Scalable, secure, and precise.
                </p>
                <Link to="/contact" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/40 inline-flex items-center gap-2 text-base">
                    Get a Custom Quote <ArrowRightIcon className="w-5 h-5"/>
                </Link>
            </motion.div>
        </div>
      </section>

      {/* 2. Alternating Services List */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
              <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-2 block">Our Expertise</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Comprehensive Solutions</h2>
          </div>

          <div className="space-y-24">
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
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-16`}
                  id={service.id}
                >
                  {/* Image Side */}
                  <div className="w-full lg:w-1/2 relative group">
                      <div className={`absolute -inset-4 ${service.color} opacity-20 blur-2xl rounded-[2rem] group-hover:opacity-30 transition-opacity duration-500`}></div>
                      <div className="relative rounded-3xl overflow-hidden shadow-xl transform group-hover:scale-[1.01] transition-transform duration-500 h-[280px] lg:h-[320px]">
                          <img 
                            src={service.image} 
                            alt={service.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className={`absolute inset-0 ${service.color} mix-blend-overlay opacity-20`}></div>
                      </div>
                      
                      {/* Floating Badge */}
                      <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute -bottom-4 -right-4 bg-white p-3 rounded-xl shadow-lg flex items-center gap-3 border border-gray-100 max-w-[180px]"
                      >
                          <div className={`p-2 rounded-lg ${service.color} bg-opacity-10`}>
                              <Icon className={`w-5 h-5 text-gray-700`} />
                          </div>
                          <span className="text-xs font-bold text-gray-800">Expert Verified</span>
                      </motion.div>
                  </div>

                  {/* Text Side */}
                  <div className="w-full lg:w-1/2">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${service.color} bg-opacity-10 text-gray-800 font-bold text-xs mb-4`}>
                          <Icon className="w-3 h-3" />
                          {service.title}
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                          {service.title.split('&')[0]} <br/>
                          <span className={`${service.color.replace('bg-', 'text-')} bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600`}>
                              & {service.title.split('&')[1] || 'More'}
                          </span>
                      </h3>
                      
                      <p className="text-base text-gray-600 leading-relaxed mb-6">
                          {service.desc}
                      </p>

                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6 hover:shadow-md transition-shadow">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                              <LayersIcon className="w-4 h-4 text-indigo-500" /> Use Cases
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {service.useCases.map((useCase, i) => (
                                  <motion.div 
                                    whileHover={{ x: 5 }}
                                    key={i} 
                                    className="flex items-center gap-2 text-gray-600 text-xs font-medium"
                                  >
                                      <CheckCircleIcon className={`w-3 h-3 ${service.color.replace('bg-', 'text-')} shrink-0`} />
                                      {useCase}
                                  </motion.div>
                              ))}
                          </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-gray-100 pt-5">
                           <div className="text-xs text-gray-500 italic max-w-xs">
                               "{service.reliability}"
                           </div>
                           <Link 
                             to="/contact" 
                             className="text-white bg-gray-900 px-5 py-2.5 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
                           >
                               Book Demo <ArrowRightIcon className="w-4 h-4" />
                           </Link>
                      </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
      </div>

      {/* 3. Process Section */}
      <section className="bg-gray-900 py-16 lg:py-24 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-0 p-10 opacity-5"
              >
                  <CpuIcon className="w-80 h-80 text-indigo-500" />
              </motion.div>
              
              <div className="text-center mb-16 relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">How We Deliver Excellence</h2>
                  <p className="text-gray-400 text-sm md:text-base">Our battle-tested workflow for consistent quality.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
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
                        className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700 hover:border-indigo-500/50 hover:bg-gray-800/80 transition-all cursor-pointer"
                      >
                          <div className="text-4xl font-bold text-gray-700/50 mb-4">{item.step}</div>
                          <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                          <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* 4. Final CTA */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
          <div className="max-w-5xl mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative rounded-[2rem] p-10 md:p-16 text-center text-white shadow-2xl overflow-hidden group bg-indigo-600"
              >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-sky-600 animate-gradient-xy"></div>
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                  
                  {/* Grid Pattern Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

                  <div className="relative z-10 max-w-2xl mx-auto">
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 font-semibold text-xs mb-6 shadow-sm">
                             ✨ Start Your AI Journey
                          </span>
                          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                              Ready to build something <br/> extraordinary?
                          </h2>
                          <p className="text-indigo-100 text-base md:text-lg mb-8 leading-relaxed">
                              Get access to our expert workforce and enterprise-grade platform. 
                              <span className="block mt-2 opacity-80 text-sm">Custom pilot programs available for volume datasets.</span>
                          </p>
                      </motion.div>

                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
                      >
                          <Link to="/contact" className="bg-white text-indigo-700 px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-base">
                              Start Free Pilot <ArrowRightIcon className="w-5 h-5"/>
                          </Link>
                          <Link to="/clients" className="px-8 py-3.5 rounded-full font-bold text-white border border-white/30 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                              See Case Studies
                          </Link>
                      </motion.div>

                      <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-6 border-t border-white/10">
                          {[
                              { text: "NDA Protected", icon: LockIcon },
                              { text: "Free Consultation", icon: CheckCircleIcon },
                              { text: "Global Coverage", icon: GlobeIcon }
                          ].map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-indigo-100/90 font-medium text-xs md:text-sm">
                                  <item.icon className="w-4 h-4 text-sky-300" />
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
