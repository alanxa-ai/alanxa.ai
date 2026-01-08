import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, ArrowLeft, Mail, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccessRestricted = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 relative overflow-hidden font-sans">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-[128px]"></div>
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-800/10 rounded-full blur-[128px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[#0A0F1C] border border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50"></div>

          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* Icon */}
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
                <div className="relative w-16 h-16 bg-black border border-gray-700 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                </div>
            </div>

            {/* Headings */}
            <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Access Restricted</h1>
                <p className="text-white font-medium text-base md:text-lg">This platform is available by invitation only</p>
            </div>

            {/* Explanation */}
            <div className="space-y-4 text-left bg-black/40 p-6 rounded-xl border border-gray-800/50 w-full">
                <p className="text-white text-base leading-relaxed">
                    Alanxa is an enterprise-grade AI training platform protected by strict security protocols. Access is currently limited to authorized Professional only.
                </p>
                
                {/* Access List */}
                <div className="space-y-3 pt-2">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-white">Authorized Access For:</h3>
                    <ul className="space-y-2">
                        {[
                            "Enterprise Clients (Contracted)",
                            "Verified Linguists & Annotators",
                            "System Administrators"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-base text-white">
                                <Shield className="w-4 h-4 text-indigo-500/70" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* How to get access */}
            <div className="text-sm text-white max-w-xs mx-auto">
                <p className="flex items-start gap-2 justify-center">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    If you believe you should have access, please contact your project manager or organization admin.
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                <Link to="/contact" className="flex-1 px-6 py-3 bg-white text-black font-bold text-base rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" /> Contact Support
                </Link>
                <Link to="/" className="flex-1 px-6 py-3 bg-transparent border border-gray-700 text-white font-bold text-base rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Back Home
                </Link>
            </div>

          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center">
            <p className="text-white text-sm uppercase tracking-widest font-bold">
                Alanxa Enterprise Security
            </p>
        </div>
      </div>
    </div>
  );
};

export default AccessRestricted;
