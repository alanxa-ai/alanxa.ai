import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check, Shield, Settings, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('alanxa_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('alanxa_cookie_consent', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[450px] z-[100]"
                >
                    {/* Main Container with Glassmorphism and Gradient Border */}
                    <div className="relative group">
                        {/* Gradient Glow Effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
                        
                        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8">
                            
                            {/* Background Texture */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100"></div>
                            
                            <div className="relative z-10 flex flex-col gap-6">
                                
                                {/* Header Section */}
                                <div className="flex items-start gap-4">
                                    <motion.div 
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20"
                                    >
                                        <Cookie className="w-6 h-6 text-white" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                                            We value your privacy
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            We use cookies to deliver a personalized experience and analyze traffic. Control your data with our transparent policies.
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                {/* <div className="h-px w-full bg-gray-800" /> */}

                                {/* Actions */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => setIsVisible(false)}
                                        className="order-2 sm:order-1 px-4 py-3 rounded-xl border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        Decline
                                    </button>
                                    <button 
                                        onClick={handleAccept}
                                        className="order-1 sm:order-2 px-4 py-3 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-100 hover:scale-[1.02] transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2"
                                    >
                                        Accept All <Check className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Detailed Links Toggle */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-800/50">
                                    <button 
                                        onClick={() => setDetailsOpen(!detailsOpen)}
                                        className="text-xs font-medium text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1"
                                    >
                                        <Settings className="w-3 h-3" /> Manage Preferences
                                    </button>
                                    <div className="flex gap-4">
                                        <Link to="/privacy-policy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy</Link>
                                        <Link to="/cookie-policy" className="text-xs text-gray-500 hover:text-white transition-colors">Cookies</Link>
                                    </div>
                                </div>
                                
                                {/* Expanded Preferences (Animation) */}
                                <AnimatePresence>
                                    {detailsOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 space-y-3">
                                                {['Essential', 'Analytics', 'Marketing'].map((item) => (
                                                    <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                                                        <span className="text-sm text-gray-300 font-medium">{item} Cookies</span>
                                                        <div className={`w-10 h-5 rounded-full relative cursor-pointer ${item === 'Essential' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${item === 'Essential' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button onClick={handleAccept} className="w-full py-2 bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-600/30 transition-colors mt-2">
                                                    Save Preferences
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
