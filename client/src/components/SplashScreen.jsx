import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <motion.div
      // Exit animation for the container
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full opacity-50"></div>

        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="relative z-10"
        >
           <img 
             src="/uns.jpg" 
             alt="Alanxa" 
             className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-2xl shadow-2xl shadow-indigo-500/10 border border-gray-800 bg-[#0A0F1C] p-2"
           />
        </motion.div>

        {/* Loading Bar / Brand Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 text-center"
        >

           <div className="h-1 w-32 bg-gray-900 rounded-full overflow-hidden mx-auto border border-gray-800">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                   duration: 1.5, 
                   ease: "easeInOut", 
                   repeat: Infinity 
                }}
                className="h-full w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
              />
           </div>
           
           <p className="text-gray-500 text-xs mt-3 tracking-[0.2em] font-medium uppercase">Initializing</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
