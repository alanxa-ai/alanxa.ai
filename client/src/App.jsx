import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import SplashScreen from "./components/SplashScreen";
import CookieConsent from "./components/CookieConsent";
import { Toaster } from 'react-hot-toast';

// Direct imports for Critical Path (Home/Culture) to avoid CLS drift from Shell
import Home from "./pages/Home";
import Culture from "./pages/Culture";

// Lazy Load Pages for Performance
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Clients = lazy(() => import("./pages/Clients"));
const Freelancers = lazy(() => import("./pages/Freelancers"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const AccessRestricted = lazy(() => import("./pages/AccessRestricted"));

// Dashboard Pages
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));
const FreelancerDashboard = lazy(() => import("./pages/FreelancerDashboard"));
const AdminBlog = lazy(() => import("./pages/AdminBlog"));

// Legal Pages
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Layout = ({ children }) => {
  const location = useLocation();

  // Hide Navbar/Footer for all dashboard routes
  const isDashboard = location.pathname.startsWith('/admin') || 
                      location.pathname.startsWith('/client-dashboard') || 
                      location.pathname.startsWith('/freelancer-dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-bg-light font-sans text-text-primary">
      <Toaster position="top-right" />
      <CookieConsent />
      {!isDashboard && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};


const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AnimatePresence>
        {isLoading && <SplashScreen key="splash" />}
      </AnimatePresence>
      <Layout>
        <Suspense fallback={null}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/culture" element={<Culture />} />
            <Route path="/services" element={<Services />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/freelancers" element={<Freelancers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} /> {/* Handles both ID and Slug */}
            <Route path="/contact" element={<Contact />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Dashboard Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/blogs" element={<AdminBlog />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />

            {/* Legal Routes */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/access-restricted" element={<AccessRestricted />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;
