import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook as FacebookIcon, Twitter as TwitterIcon, Linkedin as LinkedinIcon, 
  Instagram as InstagramIcon, Send as SendIcon, CheckCircle as CheckCircleIcon,
  AtSign as ThreadsIcon 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
           
           {/* Brand Column */}
           <div className="lg:col-span-2">
              <Link to="/" className="mb-6 inline-block">
                <img 
                  src="/Alanxa.ai_Logo.png" 
                  alt="Alanxa" 
                  className="h-5 w-auto object-contain brightness-0 invert" 
                  width="120"
                  height="20"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
                Professional AI Training & Data Annotation services powering the next generation of intelligent systems. Accurate, scalable, and human-verified.
              </p>
              <div className="flex space-x-4">
                  <a href="https://www.linkedin.com/company/alanxa-ai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors text-gray-400 hover:text-white">
                      <LinkedinIcon className="w-5 h-5" />
                  </a>
                  <a href="https://x.com/alanxa_ai" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2 bg-gray-800 rounded-full hover:bg-black transition-colors text-gray-400 hover:text-white">
                      <TwitterIcon className="w-5 h-5" />
                  </a>
                  <a href="https://www.instagram.com/alanxa.ai/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 transition-colors text-gray-400 hover:text-white">
                      <InstagramIcon className="w-5 h-5" />
                  </a>
                  <a href="https://www.facebook.com/alanxa07" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 bg-gray-800 rounded-full hover:bg-blue-700 transition-colors text-gray-400 hover:text-white">
                      <FacebookIcon className="w-5 h-5" />
                  </a>
                  <a href="https://www.threads.com/@alanxa.ai" target="_blank" rel="noopener noreferrer" aria-label="Threads" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white">
                      <ThreadsIcon className="w-5 h-5" />
                  </a>
              </div>
           </div>

           {/* Quick Links */}
           <div>
              <h4 className="text-lg font-bold mb-6 text-white">Company</h4>
              <ul className="space-y-4 text-gray-400">
                 <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                 <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Insights & Blog</Link></li>
                 <li><Link to="/freelancers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
                 <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
           </div>

           {/* Services */}
           <div>
              <h4 className="text-lg font-bold mb-6 text-white">Services</h4>
              <ul className="space-y-4 text-gray-400">
                 <li><Link to="/services" className="hover:text-blue-400 transition-colors">AI Training</Link></li>
                 <li><Link to="/services" className="hover:text-blue-400 transition-colors">Data Annotation</Link></li>
                 <li><Link to="/services" className="hover:text-blue-400 transition-colors">Transcription</Link></li>
                 <li><Link to="/services" className="hover:text-blue-400 transition-colors">Content Moderation</Link></li>
              </ul>
           </div>

           {/* Legal & Newsletter */}
           <div>
              <h4 className="text-lg font-bold mb-6 text-white">Legal</h4>
              <ul className="space-y-4 text-gray-400 mb-8">
                 <li><Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                 <li><Link to="/terms-of-service" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                 <li><Link to="/cookie-policy" className="hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
              </ul>
           </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-gray-500 text-sm">
             &copy; {new Date().getFullYear()} Alanxa Inc. All rights reserved.
           </p>
           <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><CheckCircleIcon className="w-3 h-3 text-green-500" /> ISO 27001 Certified</span>
              <span className="mx-2">|</span>
              <span className="flex items-center gap-1"><CheckCircleIcon className="w-3 h-3 text-green-500" /> GDPR Compliant</span>
           </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
