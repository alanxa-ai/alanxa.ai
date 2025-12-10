import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Settings, LogOut, Clock, Upload, List, CheckCircle, FileText, Menu, X } from 'lucide-react';
import axios from 'axios';

const FreelancerDashboard = () => {
    const [activeTab, setActiveTab] = useState('tasks');
    const [projects, setProjects] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/freelancer/projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data);
        } catch (error) {
            console.error("Error fetching projects", error);
        }
    };

    const handleUpdateProgress = async (projectId, newProgress, completedItems) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/freelancer/projects/${projectId}/progress`, 
                { progress: newProgress, completedItems },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchProjects(); // Refresh
        } catch (error) {
            alert('Error updating progress');
        }
    };

    const navItems = [
        { id: 'tasks', label: 'My Tasks', icon: List },
        { id: 'completed', label: 'Completed', icon: CheckSquare },
        { id: 'settings', label: 'Profile', icon: Settings },
    ];

    const [selectedProject, setSelectedProject] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [submissionLink, setSubmissionLink] = useState('');

    const openModal = (project, type) => {
        setSelectedProject(project);
        setModalType(type);
        setSubmissionLink(''); // Reset link
    };

    const closeModal = () => {
        setSelectedProject(null);
        setModalType(null);
    };

    const submitWork = async () => {
        if (!submissionLink) return alert('Please enter a work link');
        
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/freelancer/projects/${selectedProject._id}/submit`, 
                { description: 'Work Submission', fileUrl: submissionLink },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Work submitted successfully!');
            fetchProjects(); 
            closeModal();
        } catch (err) {
            console.error(err);
            alert('Error submitting work: ' + (err.response?.data?.message || err.message));
        }
    };
    
    // ... inside return ...
    
                            {modalType === 'upload' && (
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Submit Work</h2>
                                        <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full"><span className="text-xl">×</span></button>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <p className="text-gray-600">Upload your completed files or provide a link to your work for <strong>{selectedProject.title}</strong>.</p>
                                        
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Work Link (Google Drive / GitHub / etc)</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-3 border rounded-xl" 
                                                placeholder="https://..." 
                                                value={submissionLink}
                                                onChange={(e) => setSubmissionLink(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Or Upload Files</label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500 font-bold">Click to upload or drag and drop</p>
                                                <p className="text-xs text-gray-400">ZIP, CSV, JSON, PNG (Max 50MB)</p>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={submitWork} 
                                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-900/20"
                                        >
                                            Submit for Review
                                        </button>
                                    </div>
                                </div>
                            )}



    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white text-xl">A</div>
                        <span className="text-xl font-bold">Alanxa <span className="text-xs opacity-50 font-normal block">Freelancer</span></span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <nav className="p-4 space-y-2 mt-4 flex-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-6 md:p-10 relative overflow-y-auto">
                <header className="mb-10 flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-white rounded-lg shadow-sm text-gray-600">
                        <Menu size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
                        <p className="text-gray-500">Manage your assigned tasks and track progress</p>
                    </div>
                </header>

                <div className="grid gap-6">
                    {projects.map(project => (
                        <div key={project._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{project.title}</h3>
                                    <p className="text-sm text-gray-500">{project.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase">
                                        {project.status}
                                    </span>
                                    {project.serviceType && <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold">
                                        {project.serviceType}
                                    </span>}
                                </div>
                            </div>
                            
                            <div className="p-6 bg-gray-50/50">
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                                        <span>Current Progress</span>
                                        <span>
                                            {project.totalItems > 0 
                                                ? `${project.completedItems || 0} / ${project.totalItems} ${project.unit || ''}`
                                                : `${project.progress}%`
                                            }
                                        </span>
                                    </div>
                                    
                                    {project.totalItems > 0 ? (
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="number" 
                                                min="0" 
                                                max={project.totalItems} 
                                                value={project.completedItems || 0} 
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    if (val <= project.totalItems) {
                                                        const newProgress = Math.round((val / project.totalItems) * 100);
                                                        handleUpdateProgress(project._id, newProgress, val);
                                                    }
                                                }}
                                                className="w-full p-2 border rounded-lg bg-gray-50 font-mono text-sm"
                                            />
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex-1">
                                                <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${(project.completedItems / project.totalItems) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="100" 
                                            value={project.progress} 
                                            onChange={(e) => handleUpdateProgress(project._id, e.target.value)}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    {/* Action Buttons */}
                                    <button onClick={() => openModal(project, 'details')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
                                        <FileText size={16} /> View Details
                                    </button>
                                    <button onClick={() => openModal(project, 'upload')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm">
                                        <Upload size={16} /> Upload Work
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {projects.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                             <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                             <h3>No tasks assigned yet.</h3>
                        </div>
                    )}
                </div>

                {/* Modals */}
                {selectedProject && (
                    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                            {modalType === 'details' && (
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.title}</h2>
                                             <div className="flex gap-2">
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">{selectedProject.serviceType || 'General Task'}</span>
                                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{selectedProject.category || 'Uncategorized'}</span>
                                             </div>
                                        </div>
                                        <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full"><span className="text-xl">×</span></button>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Instructions</h3>
                                            <p className="text-gray-700 admin-text bg-gray-50 p-4 rounded-xl">{selectedProject.description}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Service Guidelines ({selectedProject.serviceType})</h3>
                                            <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl text-sm text-blue-800">
                                                <p><strong>Standard Protocol:</strong> Please ensure all data points are annotated according to the specific guidelines for <strong>{selectedProject.serviceType}</strong>.</p>
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                    <li>Maintain high accuracy (&gt;98%).</li>
                                                    <li>Flag ambiguous data points.</li>
                                                    <li>Follow the specific output format required by the client.</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Placeholder for specific tool integration */}
                                        <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center">
                                            <p className="text-gray-400 font-bold mb-2">Annotation Tool Placeholder</p>
                                            <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold">Launch {selectedProject.serviceType} Tool</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'upload' && (
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Submit Work</h2>
                                        <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full"><span className="text-xl">×</span></button>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <p className="text-gray-600">Upload your completed files or provide a link to your work for <strong>{selectedProject.title}</strong>.</p>
                                        
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Work Link (Google Drive / GitHub / etc)</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-3 border rounded-xl" 
                                                placeholder="https://..." 
                                                value={submissionLink}
                                                onChange={(e) => setSubmissionLink(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Or Upload Files</label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500 font-bold">Click to upload or drag and drop</p>
                                                <p className="text-xs text-gray-400">ZIP, CSV, JSON, PNG (Max 50MB)</p>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={submitWork} 
                                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-900/20"
                                        >
                                            Submit for Review
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FreelancerDashboard;
