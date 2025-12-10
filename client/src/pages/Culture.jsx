import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, Zap, Users, Coffee, BookOpen, Smile, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Culture = () => {
  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. Hero Section (Compact with Image) */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-gray-900 text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
            <img 
               src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80" 
               alt="Team Collaboration" 
               className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-indigo-900/80 to-gray-900/90"></div>
        </div>

        {/* Abstract Background Shapes */}
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
           className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-0"
        />

        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-indigo-300 text-xs font-semibold tracking-wider mb-4"
          >
            OUR DNA
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
          >
            More Than Just a <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Workplace.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-200 mb-6 max-w-xl mx-auto"
          >
            Building a community of innovators, dreamers, and doers.
          </motion.p>
        </div>
      </section>

      {/* 2. Our Values (Animated & Compact) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Core Values</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">The principles that guide every decision we make.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Empathy First", desc: "We design for people.", color: "text-red-500", bg: "bg-red-50" },
              { icon: Zap, title: "Innovation", desc: "Pushing boundaries daily.", color: "text-yellow-500", bg: "bg-yellow-50" },
              { icon: Users, title: "Collaboration", desc: "We win together.", color: "text-blue-500", bg: "bg-blue-50" },
              { icon: Globe, title: "Global Mindset", desc: "Diverse perspectives.", color: "text-green-500", bg: "bg-green-50" }
            ].map((val, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 group"
              >
                <div className={`w-10 h-10 ${val.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <val.icon className={`w-5 h-5 ${val.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{val.title}</h3>
                <p className="text-gray-600 leading-relaxed text-xs">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Life at Alanxa (Marquee) */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Life at Alanxa</h2>
            <p className="text-gray-500 text-sm">Peek inside our world.</p>
          </div>
          <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 transition-colors">Instagram &rarr;</button>
        </div>

        {/* Moving Marquee */}
        <div className="flex gap-4 overflow-hidden relative">
             <motion.div 
               animate={{ x: "-50%" }}
               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               className="flex gap-4 w-max"
             >
                {[1,2,3,4,5,6].map((item, i) => {
                   const images = [
                      '1522071820081-009f0129c71c', // Team
                      '1600880292205-07f73d56b53b', // Modern office
                      '1556761175-5973ac0f96fc',   // Collaboration
                      '1517048676732-d65bc937f952', // Meeting
                      '1522202176988-66273c2fd55f', // Planning
                      '1531482615713-2afd69097998'  // Code
                   ];
                   return (
                    <div key={i} className="w-60 h-72 rounded-xl overflow-hidden relative group shrink-0 shadow-md">
                        <img 
                          src={`https://images.unsplash.com/photo-${images[i % images.length]}?auto=format&fit=crop&w=600&q=80`} 
                          alt="Culture" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                   );
                })}
             </motion.div>
        </div>
      </section>

      {/* 4. Perks & Benefits (Compact Grid) */}
      <section className="py-16 bg-gray-900 text-white relative">
         <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center mb-10">
               <h2 className="text-2xl font-bold mb-2">We Take Care of You</h2>
               <p className="text-gray-400 text-sm">Holistic benefits for a balanced life.</p>
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
                     className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-center flex flex-col items-center justify-center h-32"
                   >
                      <perk.icon className="w-6 h-6 text-indigo-400 mb-3" />
                      <h3 className="font-semibold text-sm">{perk.label}</h3>
                   </motion.div>
                ))}
            </div>
         </div>
      </section>

      {/* 5. CTA (With Image & Animation) */}
      <section className="relative py-20 bg-indigo-900 overflow-hidden flex items-center justify-center">
         {/* Background Image */}
         <div className="absolute inset-0 z-0">
             <img 
                src="https://images.unsplash.com/photo-1556761175-5973ac0f96fc?auto=format&fit=crop&w=1920&q=80" 
                alt="Team Success" 
                className="w-full h-full object-cover opacity-30"
             />
             <div className="absolute inset-0 bg-indigo-900/90"></div>
         </div>

         <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-2xl mx-auto px-4 text-center"
         >
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to join us?</h2>
             <p className="text-indigo-100 text-lg mb-8">
                 Challenge yourself. Grow with us. Create the future of AI.
             </p>
             <Link 
               to="/freelancers" 
               className="inline-block bg-white text-indigo-600 font-bold py-3 px-10 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all text-base"
             >
                 View Open Roles
             </Link>
         </motion.div>
      </section>

    </div>
  );
};

export default Culture;
