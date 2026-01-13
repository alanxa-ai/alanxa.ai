import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../utils/api';
import { Mail, Lock, ArrowRight, Loader2, Sparkles, User, Key, Shield } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const res = await api.post('/api/auth/google', { 
        tokenId: credentialResponse.credential 
      });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Redirect based on role - freelancer dashboard is default
      if (res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.user.role === 'client') navigate('/client-dashboard');
      else navigate('/freelancer-dashboard'); // Default for all other users
      
    } catch (err) {
      setError(err.response?.data?.message || 'Google Login Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate UX delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const res = await api.post('/api/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else if (res.data.user.role === 'client') {
        navigate('/client-dashboard');
      } else {
        navigate('/freelancer-dashboard'); // Default for all other users
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* 1. Dynamic Background Elements (Deep Space - Optimized) */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          {/* Static Gradients instead of Motion Divs */}
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-indigo-900/20 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[120px]"></div>
          <div className="absolute top-[20%] right-[30%] w-[400px] h-[400px] rounded-full bg-blue-900/10 blur-[100px]"></div>
      </div>

      {/* 2. Glassmorphism Card (Dark Version) */}
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="relative">
          {/* Glowing Border Wrap */}
          <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2rem] pointer-events-none"></div>
          
          <div className="bg-[#0A0F1C]/80 backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-8 sm:p-12 relative overflow-hidden group">
             
             {/* Header */}
             <div className="text-center mb-10 relative">
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome to Alanxa</h2>
                <p className="text-white text-base">Sign in to continue</p>
             </div>

             {/* Form */}
             <form onSubmit={handleLogin} className="space-y-5 px-1">
                {error && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }} 
                     animate={{ opacity: 1, height: 'auto' }}
                     className="p-3 rounded-lg bg-red-900/20 border border-red-900/40 text-red-300 text-xs font-medium flex items-center gap-2"
                   >
                     <Shield className="w-3 h-3 shrink-0" /> {error}
                   </motion.div>
                )}

                {/* Email Input */}
                <div className="space-y-1.5">
                   <label className="text-sm font-semibold text-white ml-1">Email Address</label>
                   <div className={`relative group transition-all duration-300 ${focusedInput === 'email' ? 'scale-[1.02]' : ''}`}>
                      <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-sky-600 rounded-xl blur opacity-0 transition duration-500 ${focusedInput === 'email' ? 'opacity-30' : ''}`}></div>
                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white group-hover:text-white transition-colors">
                            <Mail size={18} />
                         </div>
                         <input 
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedInput('email')}
                            onBlur={() => setFocusedInput(null)}
                            className="block w-full pl-11 pr-4 py-3.5 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-medium text-base shadow-inner"
                            placeholder="name@company.com"
                         />
                      </div>
                   </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                   <div className="flex justify-between items-center ml-1">
                      <label className="text-sm font-semibold text-white">Password</label>
                      <Link to="/forgot-password" className="text-sm text-indigo-300 hover:text-indigo-200 transition-colors font-medium">Forgot password?</Link>
                   </div>
                   <div className={`relative group transition-all duration-300 ${focusedInput === 'password' ? 'scale-[1.02]' : ''}`}>
                      <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-sky-600 rounded-xl blur opacity-0 transition duration-500 ${focusedInput === 'password' ? 'opacity-30' : ''}`}></div>
                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white group-hover:text-white transition-colors">
                            <Key size={18} />
                         </div>
                         <input 
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={() => setFocusedInput('password')}
                            onBlur={() => setFocusedInput(null)}
                            className="block w-full pl-11 pr-4 py-3.5 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-medium text-base shadow-inner"
                            placeholder="••••••••"
                         />
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-between gap-4 my-2">
                    <div className="h-[1px] bg-gray-700 flex-1"></div>
                    <span className="text-gray-500 text-sm">OR</span>
                    <div className="h-[1px] bg-gray-700 flex-1"></div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Login Failed')}
                        theme="filled_black"
                        shape="circle"
                        size="large"
                        width="100%"
                    />
                </div>

                {/* Submit Button */}
                <button 
                   type="submit" 
                   disabled={isLoading}
                   className="mt-2 w-full relative group overflow-hidden rounded-xl p-[1px] shadow-lg hover:shadow-indigo-500/20 transition-shadow"
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl group-hover:opacity-100 transition-opacity"></div>
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500"></div>
                   <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl py-3.5 flex items-center justify-center gap-2 group-hover:scale-[0.99] transition-transform">
                      {isLoading ? (
                        <>
                           <Loader2 className="w-5 h-5 animate-spin text-white" />
                           <span className="text-white font-bold text-base">Accessing...</span>
                        </>
                      ) : (
                        <>
                           <span className="text-white font-bold text-base">Sign In</span>
                           <ArrowRight className="w-4 h-4 text-indigo-100 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                   </div>
                </button>
             </form>

             {/* Footer */}
             <div className="mt-8 text-center">
                <p className="text-white text-base">
                   Don't have an account?{' '}
                   <Link to="/register" className="text-indigo-300 font-bold hover:text-indigo-200 transition-colors relative inline-block group">
                      Create account
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-indigo-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                   </Link>
                </p>
             </div>
          </div>
        </div>
        
        {/* Footer Text */}
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
           <p className="text-xs text-white uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
             <Shield className="w-3 h-3" /> Secure Enterprise Login
           </p>
        </div>
      </div>

    </div>
  );
};

export default Login;
