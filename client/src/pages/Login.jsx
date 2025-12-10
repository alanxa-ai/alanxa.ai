import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowRight, Loader2, Sparkles, User, Key, Shield } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate UX delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else if (res.data.user.role === 'client') {
        navigate('/client-dashboard');
      } else if (res.data.user.role === 'freelancer') {
        navigate('/freelancer-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#f8fafc] overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-900">
      
      {/* 1. Dynamic Background Elements (Soft Pastels) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Noise Texture */}
          <div className="absolute inset-0 z-20 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          {/* Moving Orbs - Adjusted for Light Theme */}
          <motion.div 
            animate={{ 
               opacity: [0.5, 0.8, 0.5], 
               scale: [1, 1.2, 1], 
               rotate: [0, 90, 0] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-blue-100/80 blur-[100px]"
          />
          <motion.div 
            animate={{ 
               opacity: [0.4, 0.6, 0.4], 
               scale: [1, 1.1, 1], 
               x: [0, 50, 0] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-100/80 blur-[100px]"
          />
          <div className="absolute top-[20%] right-[30%] w-[400px] h-[400px] rounded-full bg-cyan-50/80 blur-[80px]" />
      </div>

      {/* 2. Glassmorphism Card (Light Version) */}
      <div className="relative z-10 w-full max-w-md p-6">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="relative"
        >
          {/* Glowing Border Wrap */}
          <div className="absolute -inset-[1px] bg-gradient-to-b from-white to-white/50 rounded-[2rem] pointer-events-none shadow-sm"></div>
          
          <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-12 relative overflow-hidden group">
             
             {/* Header */}
             <div className="text-center mb-10 relative">

                <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
                <p className="text-gray-500 text-sm">Sign in to manage your AI training workflow</p>
             </div>

             {/* Form */}
             <form onSubmit={handleLogin} className="space-y-5 px-1">
                {error && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }} 
                     animate={{ opacity: 1, height: 'auto' }}
                     className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium flex items-center gap-2"
                   >
                     <Shield className="w-3 h-3 shrink-0" /> {error}
                   </motion.div>
                )}

                {/* Email Input */}
                <div className="space-y-1.5">
                   <label className="text-xs font-semibold text-gray-700 ml-1">Email Address</label>
                   <div className={`relative group transition-all duration-300 ${focusedInput === 'email' ? 'scale-[1.02]' : ''}`}>
                      <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-xl blur opacity-0 transition duration-500 ${focusedInput === 'email' ? 'opacity-20' : ''}`}></div>
                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-gray-500 transition-colors">
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
                            className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm shadow-sm"
                            placeholder="name@company.com"
                         />
                      </div>
                   </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                   <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-semibold text-gray-700">Password</label>
                      <Link to="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors font-medium">Forgot password?</Link>
                   </div>
                   <div className={`relative group transition-all duration-300 ${focusedInput === 'password' ? 'scale-[1.02]' : ''}`}>
                      <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-xl blur opacity-0 transition duration-500 ${focusedInput === 'password' ? 'opacity-20' : ''}`}></div>
                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-gray-500 transition-colors">
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
                            className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm shadow-sm"
                            placeholder="••••••••"
                         />
                      </div>
                   </div>
                </div>

                {/* Submit Button */}
                <button 
                   type="submit" 
                   disabled={isLoading}
                   className="mt-2 w-full relative group overflow-hidden rounded-xl p-[1px] shadow-md hover:shadow-lg transition-shadow"
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl group-hover:opacity-90 transition-opacity"></div>
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-500"></div>
                   <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl py-3.5 flex items-center justify-center gap-2 group-hover:bg-opacity-0 transition-all">
                      {isLoading ? (
                        <>
                           <Loader2 className="w-5 h-5 animate-spin text-white" />
                           <span className="text-white font-bold text-sm">Accessing...</span>
                        </>
                      ) : (
                        <>
                           <span className="text-white font-bold text-sm">Sign In</span>
                           <ArrowRight className="w-4 h-4 text-blue-100 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                   </div>
                </button>
             </form>

             {/* Footer */}
             <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                   Don't have an account?{' '}
                   <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors relative inline-block group">
                      Create account
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                   </Link>
                </p>
             </div>
          </div>
        </motion.div>
        
        {/* Footer Text */}
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
           <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
             <Shield className="w-3 h-3" /> Secure Enterprise Login
           </p>
        </div>
      </div>

    </div>
  );
};

export default Login;
