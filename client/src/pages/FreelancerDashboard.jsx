import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Settings, LogOut, Clock, Upload, List, CheckCircle, FileText, Menu, X } from 'lucide-react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const FreelancerDashboard = () => {
    const [activeTab, setActiveTab] = useState('tasks');
    const [projects, setProjects] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchProjects();
    }, [navigate]);

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

    const handleUpdateProgress = async (projectId, newProgress, completedItems) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/api/freelancer/projects/${projectId}/progress`, 
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
    const [submissionFile, setSubmissionFile] = useState(null);
    const fileInputRef = React.useRef(null);

    const openModal = (project, type) => {
        setSelectedProject(project);
        setModalType(type);
        setSubmissionLink(''); // Reset link
        setSubmissionFile(null); // Reset file
    };

    const closeModal = () => {
        setSelectedProject(null);
        setModalType(null);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSubmissionFile(e.target.files[0]);
            setSubmissionLink(''); // Clear link preference
        }
    };

    const submitWork = async () => {
        if (!submissionLink && !submissionFile) return alert('Please enter a work link or upload a file');
        
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
            alert('Work submitted successfully!');
            fetchProjects(); 
            closeModal();
        } catch (err) {
            console.error(err);
            alert('Error submitting work: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="flex h-screen bg-black font-sans overflow-hidden text-white">
            {/* Sidebar */}
            <aside className={`flex flex-col fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0F1C] border-r border-gray-800 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                        <img src="/Alanxa.ai_Logo.png" alt="Alanxa AI" className="h-6 object-contain brightness-0 invert" />
                        <span className="text-[10px] uppercase tracking-wider opacity-50 bg-gray-800 px-1.5 py-0.5 rounded">Freelancer</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <nav className="p-4 space-y-2 mt-4 flex-1 overflow-y-auto">
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
                    <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/10 rounded-xl transition-colors">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-4 md:p-10 relative overflow-y-auto">
                <header className="mb-10 flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-[#0A0F1C] border border-gray-800 rounded-lg shadow-sm text-gray-400">
                        <Menu size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Task Board</h1>
                        <p className="text-gray-400">Manage your assigned tasks and track progress</p>
                    </div>
                </header>

                <div className="grid gap-6">
                    {projects.map(project => (
                        <div key={project._id} className="bg-[#0A0F1C] rounded-2xl shadow-sm border border-gray-800 overflow-hidden">
                            <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-[#0A0F1C]">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                                    <p className="text-sm text-gray-400">{project.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-green-900/20 text-green-400 rounded-full text-xs font-bold uppercase">
                                        {project.status}
                                    </span>
                                    {project.serviceType && <span className="px-3 py-1 bg-purple-900/20 text-purple-400 rounded-full text-xs font-bold">
                                        {project.serviceType}
                                    </span>}
                                </div>
                            </div>
                            
                            <div className="p-6 bg-black">
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm font-bold text-gray-400 mb-2">
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
                                                className="w-full p-2 border border-gray-700 rounded-lg bg-[#0A0F1C] text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                                            />
                                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden flex-1">
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
                                            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    {/* Action Buttons */}
                                    <button onClick={() => openModal(project, 'details')} className="flex items-center gap-2 px-4 py-2 bg-[#1E293B] border border-gray-700 rounded-lg text-sm font-bold text-gray-300 hover:bg-gray-700 transition">
                                        <FileText size={16} /> View Details
                                    </button>
                                    <button onClick={() => openModal(project, 'upload')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition">
                                        <Upload size={16} /> Upload Work
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {projects.length === 0 && (
                        <div className="text-center py-20 text-gray-500 bg-[#0A0F1C] rounded-2xl border border-dashed border-gray-800">
                             <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                             <h3>No tasks assigned yet.</h3>
                        </div>
                    )}
                </div>

                {/* Modals */}
                {selectedProject && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0A0F1C] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-800">
                            {modalType === 'details' && (
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-2">{selectedProject.title}</h2>
                                             <div className="flex gap-2">
                                                <span className="px-3 py-1 bg-purple-900/20 text-purple-400 rounded-full text-xs font-bold">{selectedProject.serviceType || 'General Task'}</span>
                                                <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-bold">{selectedProject.category || 'Uncategorized'}</span>
                                             </div>
                                        </div>
                                        <button onClick={closeModal} className="p-2 hover:text-gray-300 text-gray-500 rounded-full"><X size={24} /></button>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Instructions</h3>
                                            <p className="text-gray-300 admin-text bg-black p-4 rounded-xl border border-gray-800">{selectedProject.description}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Service Guidelines ({selectedProject.serviceType})</h3>
                                            <div className="p-4 border border-blue-900/30 bg-blue-900/10 rounded-xl text-sm text-blue-300">
                                                <p><strong>Standard Protocol:</strong> Please ensure all data points are annotated according to the specific guidelines for <strong>{selectedProject.serviceType}</strong>.</p>
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                    <li>Maintain high accuracy (&gt;98%).</li>
                                                    <li>Flag ambiguous data points.</li>
                                                    <li>Follow the specific output format required by the client.</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Placeholder for specific tool integration */}
                                        <div className="p-6 border-2 border-dashed border-gray-800 rounded-xl text-center bg-black/50">
                                            <p className="text-gray-400 font-bold mb-2">Annotation Tool Placeholder</p>
                                            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition">Launch {selectedProject.serviceType} Tool</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'upload' && (
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-white">Submit Work</h2>
                                        <button onClick={closeModal} className="p-2 hover:text-gray-300 text-gray-500 rounded-full"><X size={24} /></button>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <p className="text-gray-400">Upload your completed files or provide a link to your work for <strong>{selectedProject.title}</strong>.</p>
                                        
                                        <div>
                                            <label className="block text-sm font-bold text-gray-400 mb-2">Work Link (Google Drive / GitHub / etc)</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-3 border border-gray-700 rounded-xl bg-black text-white focus:outline-none focus:border-indigo-500" 
                                                placeholder="https://..." 
                                                value={submissionLink}
                                                onChange={(e) => {
                                                    setSubmissionLink(e.target.value);
                                                    setSubmissionFile(null); // clear file if typing link
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-400 mb-2">Or Upload Files</label>
                                            <input 
                                                type="file" 
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <div 
                                                onClick={() => fileInputRef.current.click()}
                                                className={`border-2 border-dashed ${submissionFile ? 'border-green-500 bg-green-900/10' : 'border-gray-700 bg-black'} rounded-xl p-8 text-center hover:bg-[#1E293B] transition-colors cursor-pointer`}
                                            >
                                                {submissionFile ? (
                                                    <>
                                                        <CheckCircle className="mx-auto h-10 w-10 text-green-500 mb-2" />
                                                        <p className="text-sm text-green-400 font-bold">{submissionFile.name}</p>
                                                        <p className="text-xs text-gray-500">{(submissionFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="mx-auto h-10 w-10 text-gray-500 mb-2" />
                                                        <p className="text-sm text-gray-400 font-bold">Click to upload or drag and drop</p>
                                                        <p className="text-xs text-gray-500">ZIP, CSV, JSON, PNG (Max 50MB)</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <button 
                                            onClick={submitWork} 
                                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-900/20 transition-colors"
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
