import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, Settings, LogOut, Clock, CheckCircle, Upload, Menu, X } from 'lucide-react';
import api from '../utils/api';

const ClientDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({ active: 0, completed: 0, totalSpent: 0 });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/api/clients/projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data);
            
            const active = res.data.filter(p => p.status !== 'Completed').length;
            const completed = res.data.filter(p => p.status === 'Completed').length;
            setStats({ active, completed, totalSpent: 0 });
        } catch (error) {
            console.error("Error fetching projects", error);
        }
    };

    const navItems = [
        { id: 'projects', label: 'My Projects', icon: LayoutDashboard },
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-black font-sans text-white">
            <aside className={`flex flex-col fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0F1C] border-r border-gray-800 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/Alanxa.ai_Logo.png" 
                            alt="Alanxa AI" 
                            className="h-6 object-contain brightness-0 invert"
                        />
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2 mt-4 flex-1 overflow-y-auto">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                activeTab === item.id 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                                : 'text-white hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium text-base">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/20">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-base font-bold text-white truncate">{user?.name}</p>
                            <p className="text-sm text-white truncate">Client Account</p>
                        </div>
                    </div>
                    <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/10 rounded-xl transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto h-screen p-4 md:p-10 relative">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-[#0A0F1C] border border-gray-800 rounded-lg shadow-sm text-white">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Client Dashboard</h1>
                            <p className="text-white mt-1 text-base">Track your AI training projects</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-[#0A0F1C] p-6 rounded-2xl shadow-sm border border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-900/20 text-indigo-400 rounded-xl"><Clock size={24}/></div>
                            <div>
                                <h3 className="text-3xl font-bold text-white">{stats.active}</h3>
                                <p className="text-base text-white">Active Projects</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#0A0F1C] p-6 rounded-2xl shadow-sm border border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-sky-900/20 text-sky-400 rounded-xl"><CheckCircle size={24}/></div>
                            <div>
                                <h3 className="text-3xl font-bold text-white">{stats.completed}</h3>
                                <p className="text-base text-white">Completed</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-6">Your Projects</h3>
                <div className="grid gap-6">
                    {projects.length > 0 ? projects.map(project => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={project._id} 
                            className="bg-[#0A0F1C] p-6 rounded-2xl shadow-sm border border-gray-800 flex flex-col md:flex-row gap-6 hover:shadow-md hover:shadow-indigo-900/10 transition-shadow"
                        >
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-2xl font-bold text-white">{project.title}</h4>
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
                                            project.status === 'Completed' ? 'bg-sky-900/20 text-sky-400' : 'bg-indigo-900/20 text-indigo-400'
                                        }`}>{project.status}</span>
                                        {project.serviceType && <span className="px-3 py-1 rounded-full text-sm font-bold bg-purple-900/20 text-purple-400">{project.serviceType}</span>}
                                    </div>
                                </div>
                                <p className="text-white mb-4 text-base">{project.description}</p>
                                <div className="flex items-center gap-4 text-base text-white">
                                    <span className="flex items-center gap-1"><Clock size={16} /> Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No Deadline'}</span>
                                </div>
                            </div>
                            <div className="w-full md:w-64 bg-black border border-gray-800 rounded-xl p-5 flex flex-col justify-center">
                                <div className="flex justify-between text-sm font-bold text-white uppercase mb-2">
                                    <span>Progress</span>
                                    <span>{project.totalItems > 0 ? `${project.completedItems || 0}/${project.totalItems} ${project.unit || ''}` : `${project.progress}%`}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${project.totalItems > 0 ? ((project.completedItems || 0) / project.totalItems) * 100 : project.progress}%` }}></div>
                                </div>
                                <div className="text-right font-bold text-indigo-400">{project.totalItems > 0 ? Math.round(((project.completedItems || 0) / project.totalItems) * 100) : project.progress}%</div>
                                
                                {(project.status === 'Approved' || project.status === 'Completed') && project.submissions && project.submissions.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-800">
                                        <a 
                                            href={project.submissions[project.submissions.length-1].fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="w-full block text-center py-2 bg-indigo-600 text-white rounded-lg text-base font-bold hover:bg-indigo-700 shadow-sm transition-all"
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                 <Upload className="rotate-180" size={16} /> 
                                                 Download Work
                                            </div>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )) : (
                        <div className="text-center py-20 bg-[#0A0F1C] rounded-2xl border border-dashed border-gray-800">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                                <LayoutDashboard size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">No Projects Yet</h3>
                            <p className="text-white text-base">Contact admin to start a new project.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ClientDashboard;
