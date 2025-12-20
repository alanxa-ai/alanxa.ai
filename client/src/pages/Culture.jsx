import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, Zap, Users, Coffee, BookOpen, Smile, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Culture = () => {
  const images = [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=60',
      'https://res.cloudinary.com/dikppmyhp/image/upload/v1766045153/0.30_Alanxa_work_colture_image_5_n8lvn7.jpg',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=60',
      'https://res.cloudinary.com/dikppmyhp/image/upload/v1766045160/0.30_Alanxa_work_colture_image_2_hl3yp2.jpg',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=60',
      'https://res.cloudinary.com/dikppmyhp/image/upload/v1766045153/0.30_Alanxa_work_colture_image_5_n8lvn7.jpg',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=60',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=60',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=60'
  ];
  
  // Duplicate for seamless marquee
  const marqueeImages = [...images, ...images];

  return (
    <div className="bg-black min-h-screen text-white" style={{ scrollBehavior: 'smooth' }}>
      
      {/* 1. Hero Section (Compact with Image) */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-[#0A0F1C] text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
            <img 
               src="https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_1920/v1766045166/0.37_seconds_Careers_backround_ueh07k.jpg" 
               srcSet="
                 https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_640/v1766045166/0.37_seconds_Careers_backround_ueh07k.jpg 640w,
                 https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_1024/v1766045166/0.37_seconds_Careers_backround_ueh07k.jpg 1024w,
                 https://res.cloudinary.com/dikppmyhp/image/upload/f_auto,q_auto,w_1920/v1766045166/0.37_seconds_Careers_backround_ueh07k.jpg 1920w
               "
               sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
               alt="Team Collaboration" 
               className="w-full h-full object-cover opacity-80"
               width="1920"
               height="1080"
               fetchPriority="high"
               decoding="async"
            />
            <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Abstract Background Shapes */}
        <div 
           className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-0 animate-spin-slow"
        />

        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-semibold tracking-wider mb-4">
            OUR DNA
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            More Than Just a <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Workplace.</span>
          </h1>
          <p className="text-base text-gray-200 mb-6 max-w-xl mx-auto">
            Building a community of innovators, dreamers, and doers.
          </p>
        </div>
      </section>

      {/* 2. Our Values (Animated & Compact) */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Our Core Values</h2>
            <p className="text-gray-300 text-sm max-w-lg mx-auto">The principles that guide every decision we make.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Empathy First", desc: "We design for people.", color: "text-white", bg: "bg-blue-600" },
              { icon: Zap, title: "Innovation", desc: "Pushing boundaries daily.", color: "text-white", bg: "bg-blue-600" },
              { icon: Users, title: "Collaboration", desc: "We win together.", color: "text-white", bg: "bg-blue-600" },
              { icon: Globe, title: "Global Mindset", desc: "Diverse perspectives.", color: "text-white", bg: "bg-blue-600" }
            ].map((val, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-[#0A0F1C] p-6 rounded-xl shadow-sm hover:shadow-lg hover:shadow-indigo-900/10 transition-all border border-gray-800 group"
              >
                <div className={`w-10 h-10 ${val.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <val.icon className={`w-5 h-5 ${val.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{val.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Life at Alanxa (Marquee) */}
      <section className="py-16 bg-[#0A0F1C] border-y border-gray-800 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Life at Alanxa</h2>
            <p className="text-gray-300 text-sm">Peek inside our world.</p>
          </div>
          <a href="https://www.instagram.com/alanxa.ai/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors">Instagram &rarr;</a>
        </div>

        {/* Moving Marquee */}
        <div className="flex gap-4 overflow-hidden relative">
             <div 
               className="flex gap-4 w-max animate-marquee"
             >
                {marqueeImages.map((imgSrc, i) => (
                    <div key={i} className="w-60 h-72 rounded-xl overflow-hidden relative group shrink-0 shadow-lg border border-gray-800">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                        <img 
                          src={imgSrc.includes('cloudinary') ? imgSrc.replace('/upload/', '/upload/f_auto,q_auto,w_400/') : imgSrc} 
                          alt="Culture" 
                          loading="lazy"
                          decoding="async"
                          width="240"
                          height="288"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </div>
                ))}
             </div>
        </div>
      </section>

      {/* 4. Perks & Benefits (Compact Grid) */}
      <section className="py-16 bg-black text-white relative">
         <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center mb-10">
               <h2 className="text-2xl font-bold mb-2">We Take Care of You</h2>
               <p className="text-gray-300 text-sm">Holistic benefits for a balanced life.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                   { icon: Globe, label: "Remote-First"},
                   { icon: Coffee, label: "Flexible Hours"},
                   { icon: BookOpen, label: "Learning Budget"},
                   { icon: Smile, label: "Health & Wellness"},
                   { icon: Award, label: "Stock Options"},
                   { icon: Users, label: "Team Retreats"},
                   { icon: Zap, label: "Top Gear"},
                   { icon: Heart, label: "Parental Leave"},
                ].map((perk, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.05 }}
                     whileHover={{ scale: 1.05 }}
                     className="bg-[#1E293B]/50 p-4 rounded-lg border border-gray-800 hover:bg-[#1E293B] transition-colors text-center flex flex-col items-center justify-center h-32"
                   >
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <perk.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-base text-gray-200">{perk.label}</h3>
                   </motion.div>
                ))}
            </div>
         </div>
      </section>

      {/* 5. CTA (With Image & Animation) */}
      <section className="relative py-20 bg-[#0A0F1C] overflow-hidden flex items-center justify-center">
         {/* Background Image */}
         <div className="absolute inset-0 z-0">
             <img 
                src="https://images.unsplash.com/photo-1556761175-5973ac0f96fc?auto=format&fit=crop&w=1920&q=80" 
                alt="Team Success" 
                className="w-full h-full object-cover opacity-20"
                width="1920"
                height="1080"
                loading="lazy"
                decoding="async"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
         </div>

         <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready to join us?</h2>
             <p className="text-gray-300 text-base mb-8">
                 Challenge yourself. Grow with us. Create the future of AI.
             </p>
             <Link 
               to="/freelancers" 
               className="inline-block bg-indigo-600 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:bg-indigo-500 hover:shadow-indigo-500/25 hover:scale-105 transition-all text-base"
             >
                 View Open Roles
             </Link>
         </div>
      </section>

    </div>
  );
};

export default Culture;
