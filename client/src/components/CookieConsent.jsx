import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Check, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

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
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 right-4 z-[100] max-w-sm w-[calc(100%-2rem)]"
                >
                    <div className="bg-black border border-gray-800 rounded-lg p-4 shadow-2xl flex flex-col gap-3">
                        <div className="flex gap-3">
                            <div className="p-2 bg-indigo-900/30 rounded-md shrink-0 h-fit">
                                <Cookie className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div className="text-xs text-gray-400 leading-relaxed">
                                <p>
                                    We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                                    <Link to="/privacy-policy" className="ml-1 text-white hover:underline">Privacy Policy</Link>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button 
                                onClick={() => setIsVisible(false)}
                                className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-white transition-colors"
                            >
                                Decline
                            </button>
                            <button 
                                onClick={handleAccept}
                                className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded hover:bg-gray-200 transition-colors"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
