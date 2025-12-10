import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, Settings, LogOut, Clock, CheckCircle, Upload, Menu, X } from 'lucide-react';
import axios from 'axios';

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
            const res = await axios.get('http://localhost:5000/api/clients/projects', {
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
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white text-xl">A</div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-400">Alanxa</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2 mt-4">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                activeTab === item.id 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">Client Account</p>
                        </div>
                    </div>
                    <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto h-screen p-6 md:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-white rounded-lg shadow-sm text-gray-600">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
                            <p className="text-gray-500 mt-1">Track your AI training projects</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Clock size={24}/></div>
                            <div>
                                <h3 className="text-2xl font-bold">{stats.active}</h3>
                                <p className="text-sm text-gray-500">Active Projects</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl"><CheckCircle size={24}/></div>
                            <div>
                                <h3 className="text-2xl font-bold">{stats.completed}</h3>
                                <p className="text-sm text-gray-500">Completed</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-6">Your Projects</h3>
                <div className="grid gap-6">
                    {projects.length > 0 ? projects.map(project => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={project._id} 
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-xl font-bold text-gray-900">{project.title}</h4>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                        project.status === 'Completed' ? 'bg-sky-100 text-sky-700' : 'bg-indigo-100 text-indigo-700'
                                    }`}>{project.status}</span>
                                    {project.serviceType && <span className="ml-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">{project.serviceType}</span>}
                                </div>
                                <p className="text-gray-500 mb-4">{project.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-1"><Clock size={14} /> Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No Deadline'}</span>
                                </div>
                            </div>
                            <div className="w-full md:w-64 bg-gray-50 rounded-xl p-5 flex flex-col justify-center">
                                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-2">
                                    <span>Progress</span>
                                    <span>{project.totalItems > 0 ? `${project.completedItems || 0}/${project.totalItems} ${project.unit || ''}` : `${project.progress}%`}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${project.totalItems > 0 ? ((project.completedItems || 0) / project.totalItems) * 100 : project.progress}%` }}></div>
                                </div>
                                <div className="text-right font-bold text-indigo-600">{project.totalItems > 0 ? Math.round(((project.completedItems || 0) / project.totalItems) * 100) : project.progress}%</div>
                                
                                {(project.status === 'Approved' || project.status === 'Completed') && project.submissions && project.submissions.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <a 
                                            href={project.submissions[project.submissions.length-1].fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="w-full block text-center py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-all"
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
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <LayoutDashboard size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No Projects Yet</h3>
                            <p className="text-gray-500">Contact admin to start a new project.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ClientDashboard;
