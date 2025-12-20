import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { 
      name: 'Work with Us', 
      path: '#',
      dropdown: [
        { name: 'Clients', path: '/clients' },
        { name: 'Freelancers', path: '/freelancers' },
        { name: 'Culture', path: '/culture' }
      ]
    },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Determine if we should show the dark navbar background
  // We show it if we are scrolled OR if we are NOT on the home page (e.g. About, Services)
  const isHomePage = location.pathname === '/';
  const showDarkNav = scrolled || !isHomePage;

  return (
    <>
      <nav 
        className={`fixed w-full top-0 z-50 transition-all duration-300 border-b ${
          showDarkNav 
            ? 'bg-black/95 backdrop-blur-md border-gray-800 py-2 shadow-lg' 
            : 'bg-transparent border-transparent py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <Link to="/" className="flex items-center gap-2">
                 <img 
                    src="/Alanxa.ai_Logo.png" 
                    alt="Alanxa AI" 
                    className={`transition-all duration-300 object-contain brightness-0 invert ${
                      scrolled ? 'h-4' : 'h-5'
                    }`}
                 />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((item) => (
                <div 
                  key={item.name} 
                  className="relative group h-full flex items-center"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
                >
                  <Link 
                    to={item.path} 
                    className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                      activeDropdown === item.name || location.pathname === item.path
                        ? 'text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={(e) => item.dropdown && e.preventDefault()}
                  >
                    {item.name}
                    {item.dropdown && (
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.dropdown && (
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-gray-900 rounded-xl shadow-xl border border-gray-800 overflow-hidden py-2 ring-1 ring-white/5"
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="block px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white font-medium transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
              
              <div className="pl-6 border-l border-gray-700 mx-2">
                <Link to="/login" className={`px-6 py-2 rounded-full font-bold text-xs transition-all hover:scale-105 shadow-lg shadow-indigo-500/20 ${
                    showDarkNav 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-indigo-600/90 backdrop-blur-sm text-white hover:bg-indigo-600'
                }`}>
                  Login
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(true)} 
                className="text-white hover:text-gray-300 transition-colors focus:outline-none"
              >
                <Menu className="h-6 w-6" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-black border-l border-gray-800 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-10">
                  <img 
                    src="/Alanxa.ai_Logo.png" 
                    alt="Alanxa AI" 
                    className="h-4 w-auto brightness-0 invert"
                  />
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-1 flex-1">
                  {navLinks.map((item) => (
                    <div key={item.name} className="border-b border-gray-800/50 last:border-0">
                      {item.dropdown ? (
                        <div className="py-2">
                           <button 
                             onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === item.name ? null : item.name)}
                             className="w-full px-4 py-3 text-white font-semibold text-base flex justify-between items-center hover:bg-white/5 transition-colors rounded-lg"
                           >
                             {item.name}
                             <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${mobileSubmenuOpen === item.name ? 'rotate-180' : ''}`} />
                           </button>
                           <AnimatePresence>
                             {mobileSubmenuOpen === item.name && (
                               <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 className="overflow-hidden"
                               >
                                 <div className="pl-4 space-y-1 bg-white/5 rounded-lg mx-2 mb-2 pt-1 pb-2 border-l-2 border-indigo-500/30">
                                   {item.dropdown.map(subItem => (
                                     <Link
                                       key={subItem.name}
                                       to={subItem.path}
                                       className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm rounded-md"
                                       onClick={() => setIsOpen(false)}
                                     >
                                       <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                                       {subItem.name}
                                     </Link>
                                   ))}
                                 </div>
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className="block px-4 py-4 text-gray-300 font-medium hover:bg-white/5 hover:text-white transition-all rounded-lg"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                  <Link 
                    to="/login"
                    className="block w-full py-3 rounded-lg bg-indigo-600 text-white font-bold text-center hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <p className="mt-6 text-center text-xs text-gray-600">
                    &copy; {new Date().getFullYear()} Alanxa AI Inc.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
