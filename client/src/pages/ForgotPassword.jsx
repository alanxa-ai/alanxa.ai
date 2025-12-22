import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { KeyRound, Mail, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP + New Password
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/api/auth/forgot-password', { email });
      setStep(2);
      setMessage('OTP sent code securely to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/api/auth/reset-password', { email, otp, newPassword });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Check your OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
       {/* Ambient Background - Optimized */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]"></div>
       </div>

      <div className="max-w-md w-full bg-[#0A0F1C]/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/5 relative z-10">
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 ring-1 ring-indigo-500/20">
              <KeyRound className="w-6 h-6" />
           </div>
           <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
           </h2>
           <p className="mt-2 text-base text-white">
             {step === 1 ? "Enter your email and we'll send you a recovery code." : "Create a strong new password for your account."}
           </p>
        </div>

        <AnimatePresence mode='wait'>
            {error && (
                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mb-4 text-sm text-red-300 bg-red-900/20 border border-red-900/50 p-3 rounded-lg flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> {error}
                </motion.div>
            )}
            {message && (
                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mb-4 text-base text-green-300 bg-green-900/20 border border-green-900/50 p-3 rounded-lg flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> {message}
                </motion.div>
            )}
        </AnimatePresence>
        
        {step === 1 ? (
          <form className="space-y-6" onSubmit={handleSendOtp}>
            <div>
              <label htmlFor="email-address" className="block text-base font-bold text-white mb-2">Email address</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <input 
                    id="email-address" 
                    name="email" 
                    type="email" 
                    required 
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-black/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-base transition-all shadow-inner" 
                    placeholder="name@company.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
              </div>
            </div>
            <button 
                type="submit" 
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Send Recovery Code'}
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleResetPassword}>
             <div className="space-y-4">
              <div>
                <label className="block text-base font-bold text-white mb-2">OTP Code</label>
                <input 
                    type="text" 
                    required 
                    className="block w-full px-4 py-3 border border-gray-700 rounded-xl bg-black/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-base transition-all text-center tracking-widest font-mono shadow-inner" 
                    placeholder="Enter 6-digit code" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-base font-bold text-white mb-2">New Password</label>
                <input 
                    type="password" 
                    required 
                    className="block w-full px-4 py-3 border border-gray-700 rounded-xl bg-black/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-base transition-all shadow-inner" 
                    placeholder="••••••••" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                />
              </div>
            </div>
            <button 
                type="submit" 
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Reset Password'}
            </button>
          </form>
        )}
        <div className="mt-8 text-center bg-white/5 mx-[-2rem] mb-[-2rem] p-4 rounded-b-2xl border-t border-white/5">
          <Link to="/login" className="font-bold text-base text-white hover:text-white flex items-center justify-center gap-2 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
