import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, CheckSquare, Settings, LogOut, Clock, Upload, List, 
    CheckCircle, FileText, Menu, X, Bell, User, Briefcase, TrendingUp,
    Eye, ChevronRight, Calendar, AlertCircle, Send, ExternalLink, Globe, DollarSign, ClipboardCheck, Home
} from 'lucide-react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import DynamicFormRenderer from '../components/DynamicFormRenderer';
import AssessmentSection from '../components/AssessmentSection';

const FreelancerDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [projects, setProjects] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [jobs, setJobs] = useState([]);
    const [viewingJob, setViewingJob] = useState(null);
    const [applyingJob, setApplyingJob] = useState(null);
    const [appFormData, setAppFormData] = useState({ 
        name: '', email: '', phone: '', languages: '', 
        experience: '', availability: '', country: '', 
        countryOther: '', mobileDevice: '', desktopDevice: '', interests: [], otherSkill: '' 
    });
    const [appResumeFile, setAppResumeFile] = useState(null);
    const [appLoading, setAppLoading] = useState(false);
    const [formTemplate, setFormTemplate] = useState(null);
    const [dynamicFormData, setDynamicFormData] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchDashboardData();
    }, [navigate]);

    const fetchDashboardData = async () => {
        setLoading(true);
        await Promise.all([
            fetchProjects(),
            fetchNotifications(),
            fetchUnreadCount(),
            fetchJobs()
        ]);
        setLoading(false);
    };

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await api.get('/api/freelancer/projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data);
        } catch (error) {
            console.error("Error fetching projects", error);
        }
    };

    const fetchJobs = async () => {
        try {
            const res = await api.get('/api/jobs');
            setJobs(res.data);
        } catch (error) {
            console.error("Error fetching jobs", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await api.get('/api/freelancer/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await api.get('/api/freelancer/notifications/unread-count', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnreadCount(res.data.unreadCount);
        } catch (error) {
            console.error("Error fetching unread count", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/api/freelancer/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            console.error("Error marking as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await api.put('/api/freelancer/notifications/read-all', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('All notifications marked as read');
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            console.error("Error marking all as read", error);
        }
    };

    const handleUpdateProgress = async (projectId, newProgress, completedItems) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/api/freelancer/projects/${projectId}/progress`, 
                { progress: newProgress, completedItems },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchProjects();
            toast.success('Progress updated!');
        } catch (error) {
            toast.error('Error updating progress');
        }
    };

    // Fetch form template when job is selected for application
    useEffect(() => {
        if (applyingJob && applyingJob._id) {
            const fetchFormTemplate = async () => {
                setFormLoading(true);
                try {
                    const res = await api.get(`/api/jobs/${applyingJob._id}/form`);
                    if (res.data.formTemplate) {
                        setFormTemplate(res.data.formTemplate);
                        const initialData = {};
                        res.data.formTemplate.fields?.forEach(field => {
                            if (field.type === 'checkbox-group') {
                                initialData[field.fieldId] = [];
                            } else {
                                initialData[field.fieldId] = '';
                            }
                        });
                        setDynamicFormData(initialData);
                    } else {
                        setFormTemplate(null);
                    }
                } catch (e) {
                    console.error('Error fetching form template', e);
                    setFormTemplate(null);
                } finally {
                    setFormLoading(false);
                }
            };
            fetchFormTemplate();
        } else {
            setFormTemplate(null);
            setDynamicFormData({});
        }
    }, [applyingJob]);

    const handleJobApplication = async (e) => {
        e.preventDefault();
        setAppLoading(true);
        try {
            const data = new FormData();
            
            if (formTemplate) {
                // Dynamic form submission
                data.append('jobId', applyingJob._id);
                data.append('formTemplateId', formTemplate._id);
                data.append('formData', JSON.stringify(dynamicFormData));
                if (appResumeFile) data.append('resume', appResumeFile);
                
                await api.post('/api/applications', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Legacy form submission
                if (!appResumeFile) {
                    toast.error('Please upload your resume');
                    setAppLoading(false);
                    return;
                }
                data.append('name', appFormData.name);
                data.append('email', appFormData.email);
                data.append('phone', appFormData.phone);
                data.append('languages', appFormData.languages);
                data.append('experience', appFormData.experience);
                data.append('availability', appFormData.availability);
                data.append('country', appFormData.country === 'Other' ? appFormData.countryOther : appFormData.country);
                data.append('device', appFormData.device);
                data.append('interests', JSON.stringify(appFormData.interests || []));
                if (appFormData.otherSkill) data.append('otherSkill', appFormData.otherSkill);
                data.append('resume', appResumeFile);
                data.append('position', applyingJob.title);
                
                await api.post('/api/freelancers', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            
            toast.success('Application submitted!');
            setApplyingJob(null);
            setAppFormData({ 
                name: '', email: '', phone: '', languages: '', 
                experience: '', availability: '', country: '', 
                countryOther: '', mobileDevice: '', desktopDevice: '', interests: [], otherSkill: '' 
            });
            setDynamicFormData({});
            setAppResumeFile(null);
            setFormTemplate(null);
        } catch (err) {
            console.error(err);
            toast.error('Failed to submit application');
        } finally {
            setAppLoading(false);
        }
    };

    const navItems = [
        { id: 'home', label: 'Home', icon: Home, path: '/' },
        { id: 'careers', label: 'Careers', icon: Briefcase, path: '/freelancers' },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'tasks', label: 'My Tasks', icon: List },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
        { id: 'assessments', label: 'Assessments', icon: ClipboardCheck },
        { id: 'apply', label: 'Apply Now', icon: Send },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    const [selectedProject, setSelectedProject] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [submissionLink, setSubmissionLink] = useState('');
    const [submissionFile, setSubmissionFile] = useState(null);
    const fileInputRef = React.useRef(null);

    const openModal = (project, type) => {
        setSelectedProject(project);
        setModalType(type);
        setSubmissionLink('');
        setSubmissionFile(null);
    };

    const closeModal = () => {
        setSelectedProject(null);
        setModalType(null);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSubmissionFile(e.target.files[0]);
            setSubmissionLink('');
        }
    };

    const submitWork = async () => {
        if (!submissionLink && !submissionFile) {
            toast.error('Please enter a work link or upload a file');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('description', 'Work Submission');

            if (submissionFile) {
                formData.append('file', submissionFile);
            } else {
                formData.append('fileUrl', submissionLink);
            }

            await api.post(`/api/freelancer/projects/${selectedProject._id}/submit`, 
                formData,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
            );
            toast.success('Work submitted successfully!');
            fetchProjects(); 
            closeModal();
        } catch (err) {
            console.error(err);
            toast.error('Error submitting work: ' + (err.response?.data?.message || err.message));
        }
    };

    // Stats calculation
    const stats = {
        totalProjects: projects.length,
        inProgress: projects.filter(p => p.status === 'In Progress').length,
        completed: projects.filter(p => p.status === 'Completed' || p.progress === 100).length,
        pending: projects.filter(p => p.status === 'Pending').length
    };

    return (
        <div className="flex h-screen bg-black font-sans overflow-hidden text-white relative">
            <Toaster position="top-right" />
            
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`flex flex-col fixed inset-y-0 left-0 z-50 w-52 bg-[#0A0F1C] border-r border-gray-800 text-white transform transition-all duration-300 ease-in-out md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Section - Clean Alanxa Logo Only */}
                <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center">
                            <img src="/Alanxa.ai_Logo.png" alt="Alanxa" className="h-6 object-contain brightness-0 invert" />
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-white/5 rounded transition">
                            <X size={14} />
                        </button>
                    </div>
                </div>
                
                {/* User Profile Card */}
                <div className="p-2 mx-2 mt-2 rounded-lg bg-[#1E293B]/50 border border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-semibold">
                            {user?.name?.charAt(0) || 'F'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-[10px] text-white truncate">{user?.name || 'Freelancer'}</h3>
                            <p className="text-[8px] text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-2 space-y-0.5 mt-2 flex-1 overflow-y-auto">
                    {navItems.map(item => (
                        item.path ? (
                            <Link
                                key={item.id}
                                to={item.path}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-200 text-[10px] text-gray-400 hover:bg-white/5 hover:text-white"
                            >
                                <item.icon size={12} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ) : (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-200 text-[10px] ${
                                    activeTab === item.id 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <item.icon size={12} />
                                <span className="font-medium">{item.label}</span>
                                {item.badge > 0 && (
                                    <span className="ml-auto w-3.5 h-3.5 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center font-bold">
                                        {item.badge}
                                    </span>
                                )}
                                {activeTab === item.id && (
                                    <ChevronRight size={10} className="ml-auto opacity-60" />
                                )}
                            </button>
                        )
                    ))}
                </nav>

                {/* Sign Out */}
                <div className="p-2 border-t border-gray-800">
                    <button 
                        onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/login'; }} 
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-[10px]"
                    >
                        <LogOut size={12} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative bg-black">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800 px-3 md:px-5 py-2.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setSidebarOpen(true)} 
                                className="md:hidden p-1.5 bg-[#1E293B] border border-gray-700 rounded-lg transition"
                            >
                                <Menu size={14} />
                            </button>
                            <div>
                                <h1 className="text-sm md:text-base font-semibold text-white">
                                    {navItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
                                </h1>
                                <p className="text-[10px] text-gray-400 hidden sm:block">Welcome back, {user?.name?.split(' ')[0] || 'Freelancer'}!</p>
                            </div>
                        </div>
                        
                        {/* Notification Bell */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-1.5 bg-[#1E293B] border border-gray-700 rounded-lg transition relative"
                            >
                                <Bell size={14} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] flex items-center justify-center font-bold">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>
                            
                            {/* Notifications Dropdown */}
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-64 bg-[#0A0F1C] border border-gray-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                                    >
                                        <div className="p-2.5 border-b border-gray-800 flex items-center justify-between">
                                            <h3 className="font-semibold text-[10px] text-white">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button 
                                                    onClick={markAllAsRead}
                                                    className="text-[8px] text-indigo-400 hover:text-indigo-300 transition"
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-52 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-4 text-center">
                                                    <Bell size={18} className="mx-auto text-gray-600 mb-1" />
                                                    <p className="text-gray-500 text-[8px]">No notifications</p>
                                                </div>
                                            ) : (
                                                notifications.slice(0, 5).map(notif => (
                                                    <div 
                                                        key={notif._id} 
                                                        onClick={() => markAsRead(notif._id)}
                                                        className={`p-2 border-b border-gray-800/50 hover:bg-[#1E293B] cursor-pointer transition ${!notif.isRead ? 'bg-indigo-600/10' : ''}`}
                                                    >
                                                        <div className="flex items-start gap-1.5">
                                                            <div className={`w-1 h-1 rounded-full mt-1 ${notif.isRead ? 'bg-gray-600' : 'bg-indigo-500'}`} />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-medium text-white text-[9px] truncate">{notif.title}</h4>
                                                                <p className="text-[8px] text-gray-400 mt-0.5 line-clamp-2">{notif.message}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-3 md:p-5">
                    <AnimatePresence mode="wait">
                        {/* Dashboard Overview */}
                        {activeTab === 'dashboard' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-3"
                            >
                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                    <StatCard icon={Briefcase} label="Total Projects" value={stats.totalProjects} />
                                    <StatCard icon={TrendingUp} label="In Progress" value={stats.inProgress} />
                                    <StatCard icon={CheckCircle} label="Completed" value={stats.completed} />
                                    <StatCard icon={Clock} label="Pending" value={stats.pending} />
                                </div>

                                {/* Recent Projects */}
                                <div className="bg-[#0A0F1C] rounded-xl border border-gray-800 overflow-hidden">
                                    <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                                        <h2 className="text-[11px] font-semibold text-white">Recent Projects</h2>
                                        <button 
                                            onClick={() => setActiveTab('tasks')}
                                            className="text-[9px] text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
                                        >
                                            View all <ChevronRight size={10} />
                                        </button>
                                    </div>
                                    <div className="divide-y divide-gray-800">
                                        {projects.slice(0, 3).map(project => (
                                            <ProjectRow 
                                                key={project._id} 
                                                project={project} 
                                                onViewDetails={() => openModal(project, 'details')}
                                            />
                                        ))}
                                        {projects.length === 0 && (
                                            <div className="p-6 text-center">
                                                <Briefcase size={24} className="mx-auto text-gray-600 mb-2" />
                                                <h3 className="text-white font-medium text-[10px] mb-1">No projects yet</h3>
                                                <p className="text-gray-500 text-[8px]">Projects assigned to you will appear here</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Notifications */}
                                {notifications.length > 0 && (
                                    <div className="bg-[#0A0F1C] rounded-xl border border-gray-800 overflow-hidden">
                                        <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                                            <h2 className="text-[11px] font-semibold text-white flex items-center gap-1.5">
                                                <Bell size={12} className="text-indigo-400" />
                                                Recent Announcements
                                            </h2>
                                        </div>
                                        <div className="divide-y divide-gray-800">
                                            {notifications.filter(n => !n.isRead).slice(0, 2).map(notif => (
                                                <div key={notif._id} className="p-2.5 hover:bg-[#1E293B] transition">
                                                    <h4 className="font-medium text-white text-[10px]">{notif.title}</h4>
                                                    <p className="text-[8px] text-gray-400 mt-0.5 line-clamp-2">{notif.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Tasks View */}
                        {activeTab === 'tasks' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-2"
                            >
                                {projects.map(project => (
                                    <ProjectCard 
                                        key={project._id} 
                                        project={project}
                                        onUpdateProgress={handleUpdateProgress}
                                        onViewDetails={() => openModal(project, 'details')}
                                        onUploadWork={() => openModal(project, 'upload')}
                                    />
                                ))}
                                
                                {projects.length === 0 && (
                                    <div className="bg-[#0A0F1C] rounded-xl border border-dashed border-gray-700 p-6 text-center">
                                        <CheckCircle size={24} className="mx-auto text-gray-600 mb-2" />
                                        <h3 className="text-white font-medium text-[10px] mb-1">No tasks assigned yet</h3>
                                        <p className="text-gray-500 text-[8px]">Tasks will appear here when assigned by admin</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Apply Now - Jobs View (Matching Freelancers.jsx style) */}
                        {activeTab === 'apply' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-3"
                            >
                                <div className="text-center mb-4">
                                    <h2 className="text-base font-bold text-white mb-1">Open Positions</h2>
                                    <p className="text-[10px] text-gray-400">{jobs.length} active openings available</p>
                                </div>

                                {jobs.length === 0 ? (
                                    <div className="bg-[#0A0F1C] rounded-xl border border-gray-800 p-8 text-center">
                                        <Briefcase size={32} className="mx-auto text-gray-600 mb-3" />
                                        <h3 className="text-white font-medium text-sm mb-1">No openings</h3>
                                        <p className="text-gray-500 text-xs">Check back later for new opportunities</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {jobs.map(job => (
                                            <div 
                                                key={job._id} 
                                                className="bg-[#0A0F1C] p-4 rounded-xl border border-gray-800 hover:shadow-lg hover:shadow-indigo-900/10 transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full"
                                            >
                                                <div className="mb-3">
                                                    <h3 
                                                        onClick={() => setViewingJob(job)} 
                                                        className="text-sm font-bold text-white mb-1 hover:text-indigo-400 cursor-pointer transition-colors"
                                                    >
                                                        {job.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-1 text-[9px] font-semibold text-white">
                                                        <span className="bg-[#1E293B] px-1.5 py-0.5 rounded border border-gray-700">{job.type}</span>
                                                        <span className="bg-[#1E293B] px-1.5 py-0.5 rounded border border-gray-700">{job.category}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 mb-4">
                                                    <div className="text-indigo-400 bg-indigo-900/20 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                                        Starts at <span className="text-[10px]">{job.salary}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-3 border-t border-gray-800 grid grid-cols-2 gap-1.5">
                                                    <button 
                                                        onClick={() => setViewingJob(job)} 
                                                        className="px-2 py-1.5 bg-black border border-gray-700 text-white rounded-lg text-[9px] font-bold hover:border-gray-500 hover:bg-[#1E293B] transition-all uppercase tracking-wide"
                                                    >
                                                        View Details
                                                    </button>
                                                    <button 
                                                        onClick={() => setApplyingJob(job)}
                                                        className="px-2 py-1.5 bg-[#6366F1] text-white rounded-lg text-[9px] font-bold hover:bg-[#4F46E5] transition-all uppercase tracking-wide shadow-md hover:shadow-lg text-center"
                                                    >
                                                        Apply Now
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Notifications View */}
                        {activeTab === 'notifications' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-3"
                            >
                                <div className="bg-[#0A0F1C] rounded-xl border border-gray-800 overflow-hidden">
                                    <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-[11px] font-semibold text-white">All Notifications</h2>
                                            <p className="text-[9px] text-gray-400">{unreadCount} unread</p>
                                        </div>
                                        {unreadCount > 0 && (
                                            <button 
                                                onClick={markAllAsRead}
                                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] rounded-lg transition"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="divide-y divide-gray-800">
                                        {notifications.length === 0 ? (
                                            <div className="p-6 text-center">
                                                <Bell size={24} className="mx-auto text-gray-600 mb-2" />
                                                <h3 className="text-white font-medium text-[10px] mb-1">No notifications</h3>
                                                <p className="text-gray-500 text-[8px]">You're all caught up!</p>
                                            </div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div 
                                                    key={notif._id} 
                                                    onClick={() => markAsRead(notif._id)}
                                                    className={`p-3 hover:bg-[#1E293B] cursor-pointer transition ${!notif.isRead ? 'bg-indigo-600/5 border-l-2 border-indigo-500' : ''}`}
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${notif.isRead ? 'bg-gray-800' : 'bg-indigo-600'}`}>
                                                            <Bell size={10} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                                <h4 className="font-medium text-white text-[10px]">{notif.title}</h4>
                                                                {!notif.isRead && (
                                                                    <span className="px-1 py-0.5 bg-indigo-500 text-[7px] rounded">New</span>
                                                                )}
                                                            </div>
                                                            <p className="text-gray-400 text-[9px] whitespace-pre-wrap">{notif.message}</p>
                                                            <div className="flex items-center gap-2 mt-1 text-[8px] text-gray-500">
                                                                <span className="flex items-center gap-0.5">
                                                                    <Calendar size={8} />
                                                                    {new Date(notif.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Profile View */}
                        {activeTab === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-sm mx-auto"
                            >
                                <div className="bg-[#0A0F1C] rounded-xl border border-gray-800 overflow-hidden">
                                    <div className="p-5 text-center border-b border-gray-800 bg-[#1E293B]/30">
                                        <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-xl font-bold mx-auto mb-2">
                                            {user?.name?.charAt(0) || 'F'}
                                        </div>
                                        <h2 className="text-sm font-semibold text-white">{user?.name || 'Freelancer'}</h2>
                                        <p className="text-gray-400 text-[10px] mt-0.5">{user?.email}</p>
                                        <span className="inline-block mt-2 px-2.5 py-0.5 bg-indigo-600/20 text-indigo-400 rounded-full text-[9px] font-medium">
                                            Freelancer
                                        </span>
                                    </div>
                                    <div className="p-3">
                                        <div className="grid grid-cols-3 gap-1.5 text-center">
                                            <div className="p-2 bg-[#1E293B]/50 rounded-lg">
                                                <p className="text-base font-bold text-white">{stats.totalProjects}</p>
                                                <p className="text-[8px] text-gray-400">Projects</p>
                                            </div>
                                            <div className="p-2 bg-[#1E293B]/50 rounded-lg">
                                                <p className="text-base font-bold text-indigo-400">{stats.completed}</p>
                                                <p className="text-[8px] text-gray-400">Completed</p>
                                            </div>
                                            <div className="p-2 bg-[#1E293B]/50 rounded-lg">
                                                <p className="text-base font-bold text-indigo-400">{stats.inProgress}</p>
                                                <p className="text-[8px] text-gray-400">In Progress</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Project Modals */}
                <AnimatePresence>
                    {selectedProject && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-3">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#0A0F1C] rounded-xl w-full max-w-md max-h-[85vh] overflow-y-auto border border-gray-800"
                            >
                                {modalType === 'details' && (
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h2 className="text-sm font-semibold text-white mb-1">{selectedProject.title}</h2>
                                                 <div className="flex flex-wrap gap-1">
                                                    <span className="px-1.5 py-0.5 bg-[#1E293B] text-gray-300 rounded text-[8px]">{selectedProject.serviceType || 'General'}</span>
                                                    <span className="px-1.5 py-0.5 bg-[#1E293B] text-gray-300 rounded text-[8px]">{selectedProject.category || 'Uncategorized'}</span>
                                                 </div>
                                            </div>
                                            <button onClick={closeModal} className="p-1 hover:bg-white/10 rounded-lg transition">
                                                <X size={14} />
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="text-[8px] font-semibold text-gray-400 uppercase mb-1">Instructions</h3>
                                                <p className="text-gray-300 text-[10px] bg-[#1E293B] p-2.5 rounded-lg border border-gray-700">{selectedProject.description}</p>
                                            </div>

                                            <div className="p-2.5 border border-indigo-600/30 bg-indigo-600/10 rounded-lg">
                                                <h3 className="text-[8px] font-semibold text-indigo-400 uppercase mb-1 flex items-center gap-1">
                                                    <AlertCircle size={9} />
                                                    Guidelines
                                                </h3>
                                                <ul className="list-disc pl-3 space-y-0.5 text-[9px] text-gray-300">
                                                    <li>Maintain high accuracy (&gt;98%)</li>
                                                    <li>Flag ambiguous data points</li>
                                                    <li>Follow the output format required</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalType === 'upload' && (
                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h2 className="text-sm font-semibold text-white">Submit Work</h2>
                                            <button onClick={closeModal} className="p-1 hover:bg-white/10 rounded-lg transition">
                                                <X size={14} />
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <p className="text-gray-400 text-[10px]">Upload files or provide a link for <strong className="text-white">{selectedProject.title}</strong>.</p>
                                            
                                            <div>
                                                <label className="block text-[9px] font-medium text-gray-400 mb-1">Work Link</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-gray-700 rounded-lg bg-black text-white text-[10px] focus:outline-none focus:border-indigo-500 transition" 
                                                    placeholder="https://..." 
                                                    value={submissionLink}
                                                    onChange={(e) => {
                                                        setSubmissionLink(e.target.value);
                                                        setSubmissionFile(null);
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[9px] font-medium text-gray-400 mb-1">Or Upload Files</label>
                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <div 
                                                    onClick={() => fileInputRef.current.click()}
                                                    className={`border border-dashed ${submissionFile ? 'border-indigo-500 bg-indigo-600/10' : 'border-gray-700 bg-black'} rounded-lg p-4 text-center hover:bg-[#1E293B] transition-colors cursor-pointer`}
                                                >
                                                    {submissionFile ? (
                                                        <>
                                                            <CheckCircle className="mx-auto h-5 w-5 text-indigo-500 mb-1" />
                                                            <p className="text-[9px] text-indigo-400 font-medium">{submissionFile.name}</p>
                                                            <p className="text-[8px] text-gray-400">{(submissionFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="mx-auto h-5 w-5 text-gray-500 mb-1" />
                                                            <p className="text-[9px] text-gray-400 font-medium">Click to upload</p>
                                                            <p className="text-[8px] text-gray-500">ZIP, CSV, JSON, PNG (Max 50MB)</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <button 
                                                onClick={submitWork} 
                                                className="w-full py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-semibold hover:bg-indigo-700 transition-all"
                                            >
                                                Submit for Review
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Job Details Modal */}
                <AnimatePresence>
                    {viewingJob && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setViewingJob(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-[#0A0F1C] border border-gray-800 rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col"
                            >
                                <div className="sticky top-0 bg-[#0A0F1C] border-b border-gray-800 p-4 flex justify-between items-center z-10">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{viewingJob.title}</h3>
                                        <div className="flex gap-2 text-[10px] text-white mt-1">
                                            <span className="px-1.5 py-0.5 rounded bg-blue-900/20 text-blue-400 font-bold uppercase">{viewingJob.type}</span>
                                            <span className="flex items-center gap-0.5"><Globe className="w-2.5 h-2.5"/>{viewingJob.location}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setViewingJob(null)} className="p-1.5 hover:text-white text-gray-400 rounded-full transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="p-5"> 
                                    <div className="prose prose-sm max-w-none mb-5 text-gray-300 text-[11px] [&_*]:!text-gray-300" dangerouslySetInnerHTML={{ __html: viewingJob.description }}></div>
                                    
                                    {viewingJob.skills && viewingJob.skills.length > 0 && (
                                        <div className="mb-5">
                                            <h4 className="font-bold text-white mb-2 text-[10px] uppercase">Required Skills</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {viewingJob.skills.map((skill, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-[#1E293B] text-white rounded text-[9px] font-medium">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-indigo-900/20 border border-indigo-500/10 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                                        <div>
                                            <span className="block text-[8px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5">Compensation</span>
                                            <span className="text-base font-bold text-indigo-300">{viewingJob.salary}</span>
                                        </div>
                                        <button 
                                            onClick={() => { setApplyingJob(viewingJob); setViewingJob(null); }}
                                            className="w-full sm:w-auto px-5 py-2 bg-[#6366F1] text-white font-bold rounded-lg shadow-lg hover:bg-[#4F46E5] transition-all flex items-center justify-center gap-1.5 text-[10px]"
                                        >
                                            Apply for this Role <Send className="w-3 h-3"/>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Application Form Modal */}
                <AnimatePresence>
                    {applyingJob && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setApplyingJob(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-[#0A0F1C] border border-gray-800 rounded-xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl"
                            >
                                <div className="sticky top-0 bg-[#0A0F1C] border-b border-gray-800 p-4 flex justify-between items-center z-10">
                                    <div>
                                        <h3 className="text-sm font-bold text-white">Apply for Position</h3>
                                        <p className="text-[9px] text-indigo-400">{applyingJob.title}</p>
                                    </div>
                                    <button onClick={() => setApplyingJob(null)} className="p-1.5 hover:bg-white/10 rounded text-gray-400">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleJobApplication} className="p-4 space-y-3">
                                    {formLoading ? (
                                        <div className="text-center py-8 text-gray-400">
                                            <div className="animate-pulse text-[10px]">Loading form...</div>
                                        </div>
                                    ) : formTemplate ? (
                                        <>
                                            <DynamicFormRenderer 
                                                fields={formTemplate.fields || []}
                                                formData={dynamicFormData}
                                                setFormData={setDynamicFormData}
                                                resumeFile={appResumeFile}
                                                setResumeFile={setAppResumeFile}
                                            />
                                            <button 
                                                type="submit"
                                                disabled={appLoading}
                                                className="w-full py-2.5 bg-[#6366F1] text-white rounded-lg text-[10px] font-bold hover:bg-[#4F46E5] transition-all uppercase tracking-wide disabled:opacity-50"
                                            >
                                                {appLoading ? 'Submitting...' : 'Submit Application'}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                    {/* Row 1: Name & Email */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Full Name *</label>
                                            <input 
                                                type="text" required
                                                value={appFormData.name}
                                                onChange={(e) => setAppFormData({...appFormData, name: e.target.value})}
                                                className="w-full p-2 bg-black border border-gray-700 rounded-lg text-white text-[10px] focus:border-indigo-500 focus:outline-none"
                                                placeholder="Jane Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Email *</label>
                                            <input 
                                                type="email" required
                                                value={appFormData.email}
                                                onChange={(e) => setAppFormData({...appFormData, email: e.target.value})}
                                                className="w-full p-2 bg-black border border-gray-700 rounded-lg text-white text-[10px] focus:border-indigo-500 focus:outline-none"
                                                placeholder="jane@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 2: Language & Phone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Language *</label>
                                            <input 
                                                type="text" required
                                                value={appFormData.languages}
                                                onChange={(e) => setAppFormData({...appFormData, languages: e.target.value})}
                                                className="w-full p-2 bg-black border border-gray-700 rounded-lg text-white text-[10px] focus:border-indigo-500 focus:outline-none"
                                                placeholder="e.g. English, Spanish"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Phone *</label>
                                            <input 
                                                type="tel" required
                                                value={appFormData.phone}
                                                onChange={(e) => setAppFormData({...appFormData, phone: e.target.value})}
                                                className="w-full p-2 bg-black border border-gray-700 rounded-lg text-white text-[10px] focus:border-indigo-500 focus:outline-none"
                                                placeholder="+1..."
                                            />
                                        </div>
                                    </div>

                                    {/* Row 3: Experience & Availability */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Experience</label>
                                            <input 
                                                type="text"
                                                value={appFormData.experience}
                                                onChange={(e) => setAppFormData({...appFormData, experience: e.target.value})}
                                                className="w-full p-2 bg-black border border-gray-700 rounded-lg text-white text-[10px] focus:border-indigo-500 focus:outline-none"
                                                placeholder="e.g. 2 years"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Availability</label>
                                            <input 
                                                type="text"
                                                value={appFormData.availability}
                                                onChange={(e) => setAppFormData({...appFormData, availability: e.target.value})}
                                                className="w-full p-2 bg-black border border-gray-700 rounded-lg text-white text-[10px] focus:border-indigo-500 focus:outline-none"
                                                placeholder="e.g. 20 hrs/wk"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 4: Country & Device */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Location / Region</label>
                                            <select 
                                                value={appFormData.country}
                                                onChange={(e) => setAppFormData({...appFormData, country: e.target.value})}
                                                className="w-full p-2 bg-black border border-gray-700 rounded-lg text-white text-[10px] focus:border-indigo-500 focus:outline-none"
                                            >
                                                <option value="">Select Country...</option>
                                                {['United States', 'India', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Brazil', 'Mexico', 'Japan', 'China', 'South Korea', 'Philippines', 'Pakistan', 'Bangladesh', 'Indonesia', 'Nigeria', 'Egypt', 'South Africa', 'Kenya', 'UAE', 'Saudi Arabia', 'Russia', 'Ukraine', 'Poland', 'Netherlands', 'Other'].map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                            {appFormData.country === 'Other' && (
                                                <input 
                                                    type="text"
                                                    value={appFormData.countryOther}
                                                    onChange={(e) => setAppFormData({...appFormData, countryOther: e.target.value})}
                                                    className="w-full mt-1 p-2 bg-black border border-gray-700 rounded-lg text-white text-[10px] focus:border-indigo-500 focus:outline-none"
                                                    placeholder="Enter your country"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Mobile Device</label>
                                            <select 
                                                value={appFormData.mobileDevice || ''}
                                                onChange={(e) => setAppFormData({...appFormData, mobileDevice: e.target.value})}
                                                className="w-full p-2 bg-black border border-gray-700 rounded-lg text-white text-[10px] focus:border-indigo-500 focus:outline-none"
                                            >
                                                <option value="">Select Mobile...</option>
                                                <option value="Android">Android</option>
                                                <option value="iOS">iOS</option>
                                                <option value="Both Mobile">Both (Android & iOS)</option>
                                                <option value="None">None</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Desktop Device</label>
                                            <select 
                                                value={appFormData.desktopDevice || ''}
                                                onChange={(e) => setAppFormData({...appFormData, desktopDevice: e.target.value})}
                                                className="w-full p-2 bg-black border border-gray-700 rounded-lg text-white text-[10px] focus:border-indigo-500 focus:outline-none"
                                            >
                                                <option value="">Select Desktop...</option>
                                                <option value="Windows">Windows</option>
                                                <option value="Mac">Mac</option>
                                                <option value="Both Desktop">Both (Windows & Mac)</option>
                                                <option value="Linux">Linux</option>
                                                <option value="Ryzen">Ryzen</option>
                                                <option value="None">None</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div>
                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Skills</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                                            {['Annotation', 'Transcription', 'Translation', 'Coding', 'Content', 'Review', 'Other'].map((skill) => (
                                                <label key={skill} className={`flex items-center gap-1 p-1.5 rounded-lg border cursor-pointer transition-all text-[9px] ${(appFormData.interests || []).includes(skill) ? 'bg-indigo-900/20 text-indigo-400 border-indigo-500' : 'bg-black border-gray-700 hover:bg-[#1E293B] text-white'}`}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={(appFormData.interests || []).includes(skill)} 
                                                        onChange={(e) => {
                                                            const currentInterests = appFormData.interests || [];
                                                            const updatedInterests = e.target.checked 
                                                                ? [...currentInterests, skill]
                                                                : currentInterests.filter(i => i !== skill);
                                                            setAppFormData({...appFormData, interests: updatedInterests});
                                                        }}
                                                        className="accent-indigo-600 w-3 h-3 cursor-pointer" 
                                                    />
                                                    <span className="font-medium">{skill}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {(appFormData.interests || []).includes('Other') && (
                                            <input 
                                                type="text"
                                                value={appFormData.otherSkill}
                                                onChange={(e) => setAppFormData({...appFormData, otherSkill: e.target.value})}
                                                className="w-full mt-1 p-2 bg-black border border-gray-700 rounded-lg text-white text-[10px] focus:border-indigo-500 focus:outline-none"
                                                placeholder="Enter your skill (e.g. Data Entry, Research)"
                                            />
                                        )}
                                    </div>

                                    {/* Resume Upload */}
                                    <div>
                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Resume *</label>
                                        <input 
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setAppResumeFile(e.target.files[0])}
                                            className="hidden"
                                            id="app-resume-upload"
                                        />
                                        <label 
                                            htmlFor="app-resume-upload"
                                            className={`block border border-dashed ${appResumeFile ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-700'} rounded-lg p-3 text-center cursor-pointer hover:bg-[#1E293B] transition`}
                                        >
                                            {appResumeFile ? (
                                                <>
                                                    <CheckCircle className="mx-auto h-4 w-4 text-indigo-500 mb-1" />
                                                    <p className="text-[9px] text-indigo-400 font-medium">{appResumeFile.name}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="mx-auto h-4 w-4 text-gray-500 mb-1" />
                                                    <p className="text-[9px] text-gray-400">Click to upload resume (PDF, DOC)</p>
                                                </>
                                            )}
                                        </label>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={appLoading}
                                        className="w-full py-2.5 bg-[#6366F1] text-white rounded-lg text-[10px] font-bold hover:bg-[#4F46E5] transition-all uppercase tracking-wide disabled:opacity-50"
                                    >
                                        {appLoading ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                        </>
                                    )}
                                </form>
                            </motion.div>
                        </div>
                    )}

                    {/* Assessments Tab */}
                    {activeTab === 'assessments' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <AssessmentSection />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

// Sub Components - Small sizes
const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-[#0A0F1C] rounded-lg border border-gray-800 p-2.5 md:p-3 hover:border-gray-700 transition-all duration-300">
        <div className="w-6 h-6 rounded-lg bg-[#1E293B] flex items-center justify-center mb-1.5">
            <Icon size={12} className="text-indigo-400" />
        </div>
        <p className="text-base font-bold text-white">{value}</p>
        <p className="text-[8px] text-gray-400 mt-0.5">{label}</p>
    </div>
);

const ProjectRow = ({ project, onViewDetails }) => (
    <div className="p-2.5 flex items-center justify-between gap-2 hover:bg-[#1E293B] transition cursor-pointer" onClick={onViewDetails}>
        <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-[#1E293B] flex items-center justify-center flex-shrink-0">
                <Briefcase size={10} className="text-indigo-400" />
            </div>
            <div className="min-w-0">
                <h4 className="font-medium text-white text-[10px] truncate">{project.title}</h4>
                <p className="text-[8px] text-gray-400">{project.serviceType || 'General'}</p>
            </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="px-1.5 py-0.5 rounded bg-[#1E293B] text-indigo-400 text-[8px] font-medium">
                {project.progress}%
            </span>
            <ChevronRight size={10} className="text-gray-500" />
        </div>
    </div>
);

const ProjectCard = ({ project, onUpdateProgress, onViewDetails, onUploadWork }) => (
    <div className="bg-[#0A0F1C] rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300">
        <div className="p-3 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
                <h3 className="text-[11px] font-semibold text-white mb-0.5">{project.title}</h3>
                <p className="text-[9px] text-gray-400 line-clamp-1">{project.description}</p>
            </div>
            <div className="flex flex-wrap gap-1">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${
                    project.status === 'Completed' ? 'bg-[#1E293B] text-indigo-400' :
                    project.status === 'In Progress' ? 'bg-[#1E293B] text-indigo-400' :
                    'bg-[#1E293B] text-gray-400'
                }`}>
                    {project.status}
                </span>
            </div>
        </div>
        
        <div className="p-3">
            <div className="mb-3">
                <div className="flex justify-between text-[9px] font-medium text-gray-400 mb-1">
                    <span>Progress</span>
                    <span className="text-white">
                        {project.totalItems > 0 
                            ? `${project.completedItems || 0} / ${project.totalItems}`
                            : `${project.progress}%`
                        }
                    </span>
                </div>
                
                {project.totalItems > 0 ? (
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            min="0" 
                            max={project.totalItems} 
                            value={project.completedItems || 0} 
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (val <= project.totalItems) {
                                    const newProgress = Math.round((val / project.totalItems) * 100);
                                    onUpdateProgress(project._id, newProgress, val);
                                }
                            }}
                            className="w-12 p-1 border border-gray-700 rounded bg-black text-white font-mono text-[9px] focus:outline-none focus:border-indigo-500"
                        />
                        <div className="flex-1 h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-indigo-600 transition-all duration-500 rounded-full" 
                                style={{ width: `${(project.completedItems / project.totalItems) * 100}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-indigo-600 transition-all duration-500 rounded-full" 
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={project.progress} 
                            onChange={(e) => onUpdateProgress(project._id, e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                )}
            </div>

            <div className="flex gap-1.5">
                <button 
                    onClick={onViewDetails} 
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-black border border-gray-700 rounded-lg text-[9px] font-medium text-white hover:bg-[#1E293B] transition"
                >
                    <Eye size={10} /> Details
                </button>
                <button 
                    onClick={onUploadWork} 
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-medium hover:bg-indigo-700 transition"
                >
                    <Upload size={10} /> Upload
                </button>
            </div>
        </div>
    </div>
);

export default FreelancerDashboard;
