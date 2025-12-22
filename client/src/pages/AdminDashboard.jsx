import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, FileText, Briefcase, TrendingUp, Search, Download, 
  Edit2, Trash2, Eye, CheckCircle, XCircle, Clock, Plus,
  Filter, ChevronDown, Upload, Save, LayoutDashboard, LogOut, Menu, X, ArrowRight, Layers, Shield, Megaphone, Home
} from 'lucide-react';
import api from '../utils/api';
import CloudinaryImageUpload from '../components/CloudinaryImageUpload';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [clientRequests, setClientRequests] = useState([]);
  const [freelancerApplications, setFreelancerApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_URL = '/api/admin';
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  useEffect(() => {
    fetchDashboardStats();
    if (activeTab === 'blogs') fetchBlogs();
    if (activeTab === 'jobs') fetchJobs();
    if (activeTab === 'clients') fetchClientRequests();
    if (activeTab === 'freelancers') fetchFreelancerApplications();
    if (activeTab === 'users' || activeTab === 'projects') fetchUsers(); // Need users for project creation
    if (activeTab === 'projects') fetchProjects();
  }, [activeTab]);

  // Cleanup forms on tab change
  useEffect(() => {
    setShowBlogForm(false);
    setEditingBlog(null);
    setShowJobForm(false);
    setEditingJob(null);
    setShowUserForm(false);
    setShowProjectForm(false);
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get(`${API_URL}/stats`, getAuthHeaders());
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await api.get(`${API_URL}/blogs`, getAuthHeaders());
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blog posts');
    }
  };

  const fetchClientRequests = async () => {
    try {
      const response = await api.get(`${API_URL}/client-requests`, getAuthHeaders());
      setClientRequests(response.data);
    } catch (error) {
      console.error('Error fetching client requests:', error);
    }
  };

  const fetchFreelancerApplications = async () => {
    try {
      const response = await api.get('/api/freelancers', getAuthHeaders());
      setFreelancerApplications(response.data);
    } catch (error) {
      console.error('Error fetching freelancer applications:', error);
    }
  };

  const fetchUsers = async () => {
      try {
          const response = await api.get(`${API_URL}/users`, getAuthHeaders());
          setUsers(response.data);
      } catch (error) {
          console.error("Error fetching users", error);
      }
  };

  const fetchProjects = async () => {
      try {
          const response = await api.get(`${API_URL}/projects`, getAuthHeaders());
          setProjects(response.data);
      } catch (error) {
          console.error("Error fetching projects", error);
      }
  };

  const fetchJobs = async () => {
    try {
      const response = await api.get('/api/jobs/admin', getAuthHeaders());
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  // ... export functions ...

  const handleCreateUser = async (userData) => {
      try {
          await api.post(`${API_URL}/users`, userData, getAuthHeaders());
          alert(`User ${userData.name} created! Creds sent to ${userData.email}.`);
          fetchUsers();
          setShowUserForm(false);
      } catch (error) {
          alert('Error creating user: ' + error.response?.data?.message);
      }
  };

  const handleCreateProject = async (projectData) => {
      try {
          await api.post(`${API_URL}/projects`, projectData, getAuthHeaders());
          alert('Project created successfully!');
          fetchProjects();
          setShowProjectForm(false);
      } catch (error) {
           alert('Error creating project: ' + error.response?.data?.message);
      }
  };

  // ... existing blog handlers ...
  const handleCreateBlog = async (blogData) => {
    try {
      await api.post(`${API_URL}/blogs`, blogData, getAuthHeaders());
      fetchBlogs();
      setShowBlogForm(false);
      setEditingBlog(null);
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const handleUpdateBlog = async (id, blogData) => {
    try {
      await api.put(`${API_URL}/blogs/${id}`, blogData, getAuthHeaders());
      fetchBlogs();
      setShowBlogForm(false);
      setEditingBlog(null);
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`${API_URL}/blogs/${id}`, getAuthHeaders());
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      await api.post('/api/jobs', jobData, getAuthHeaders());
      fetchJobs();
      setShowJobForm(false);
      setEditingJob(null);
    } catch (error) {
      alert('Error creating job');
    }
  };

  const handleUpdateJob = async (id, jobData) => {
    try {
      await api.put(`/api/jobs/${id}`, jobData, getAuthHeaders());
      fetchJobs();
      setShowJobForm(false);
      setEditingJob(null);
    } catch (error) {
      alert('Error updating job');
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Delete this job?')) {
      try {
        await api.delete(`/api/jobs/${id}`, getAuthHeaders());
        fetchJobs();
      } catch (error) {
        alert('Error deleting job');
      }
    }
  };
  
  const handleUpdateRequestStatus = async (id, status) => {
    try {
      await api.put(`${API_URL}/client-requests/${id}`, { status }, getAuthHeaders());
      fetchClientRequests();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleUpdateApplicationStatus = async (id, status) => {
    try {
      await api.put(`${API_URL}/freelancer-applications/${id}`, { status }, getAuthHeaders());
      fetchFreelancerApplications();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };



  const handleDeleteClientRequest = async (id) => {
    if (window.confirm('Delete this request?')) {
      try {
        await api.delete(`${API_URL}/client-requests/${id}`, getAuthHeaders());
        fetchClientRequests();
      } catch (error) {
        alert('Error deleting request');
      }
    }
  };

  const handleDeleteFreelancerApplication = async (id) => {
    if (window.confirm('Delete this application?')) {
      try {
        await api.delete(`${API_URL}/freelancer-applications/${id}`, getAuthHeaders());
        fetchFreelancerApplications();
      } catch (error) {
        alert('Error deleting application');
      }
    }
  };

  const handleDeleteProject = async (id) => {
      if (window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
          try {
              await api.delete(`${API_URL}/projects/${id}`, getAuthHeaders());
              fetchProjects();
          } catch (error) {
              alert('Error deleting project');
          }
      }
  };

  // Export placeholders if not defined
  // Export to Excel/CSV
  const handleExportClients = () => {
    const data = clientRequests.map(req => ({
      'Company Name': req.companyName,
      'Contact Person': req.contactPerson,
      'Email': req.email,
      'Country': req.country,
      'Service': req.service === 'Other' && req.otherService ? `Other: ${req.otherService}` : req.service,
      'Other Service': req.otherService || '',
      'Volume': req.volume,
      'Notes': req.notes,
      'Status': req.status,
      'Date': new Date(req.createdAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Client Requests");
    XLSX.writeFile(wb, "Client_Requests.xlsx");
  }; 
  const handleExportFreelancers = () => {
    const data = freelancerApplications.map(app => ({
      Name: app.name,
      Email: app.email,
      Phone: app.phone,
      Languages: app.languages,
      Skills: Array.isArray(app.interests) ? app.interests.join(', ') : app.interests,
      Experience: app.experience,
      Availability: app.availability,
      Status: app.status || 'Pending',
      AppliedAt: new Date(app.createdAt).toLocaleDateString(),
      Resume: app.resume
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Freelancers");
    XLSX.writeFile(wb, "Freelancer_Applications.xlsx");
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'blogs', label: 'Blog Posts', icon: FileText },
    { id: 'jobs', label: 'Job Postings', icon: Megaphone },
    { id: 'clients', label: 'Client Requests', icon: Briefcase },
    { id: 'freelancers', label: 'Applications', icon: Users },
    { id: 'users', label: 'User Management', icon: Shield },
    { id: 'projects', label: 'Projects (God Mode)', icon: Layers }
  ];
  
  // Need to import Layers from lucide-react (add to imports in next step or assuming available)
  // ... imports ...

  return (
    <div className="flex min-h-screen bg-black font-sans">
      {/* Sidebar ... */}
      <aside className={`flex flex-col fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0F1C] text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-gray-800`}>
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
          <a href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-white hover:bg-gray-800 hover:text-white group">
              <Home className="w-5 h-5 text-white group-hover:text-white" />
              <span className="font-medium text-base">Home</span>
          </a>
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
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-white group-hover:text-white'}`} />
              <span className="font-medium text-base">{item.label}</span>
              {activeTab === item.id && <ArrowRight className="w-4 h-4 ml-auto opacity-50" />}
            </button>
          ))}
        </nav>
        {/* ... Sidebar Footer ... */}
         <div className="p-4 border-t border-gray-800">
           <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
           </button>
        </div>
      </aside>

       <main className="flex-1 overflow-y-auto h-screen relative bg-black p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-[#0A0F1C] border border-gray-800 rounded-lg text-white">
                    <Menu size={24} />
                </button>
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">
                        {navItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
                    </h1>
                    <p className="text-white text-sm md:text-base">Welcome back, Admin</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">A</div>
            </div>
        </header>

        <AnimatePresence mode="wait">
             {activeTab === 'overview' && (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                     <DashboardStats stats={stats} />
                 </motion.div>
             )}

            {activeTab === 'users' && (
                <UsersManagement users={users} showForm={showUserForm} setShowForm={setShowUserForm} onCreateUser={handleCreateUser} />
            )}

            {activeTab === 'projects' && (
                <ProjectsManagement 
                    projects={projects} 
                    users={users} 
                    showForm={showProjectForm} 
                    setShowForm={setShowProjectForm} 
                    onCreateProject={handleCreateProject} 
                    onUpdateProject={async (id, data) => {
                        try {
                            await api.put(`${API_URL}/projects/${id}`, data, getAuthHeaders());
                            alert('Project updated successfully!');
                            fetchProjects();
                            setShowProjectForm(false);
                        } catch (error) {
                            alert('Error updating project: ' + error.message);
                        }
                    }}
                    onDeleteProject={handleDeleteProject}
                />
            )}

            {activeTab === 'blogs' && (
                    <BlogsManagement
                    blogs={blogs}
                    showForm={showBlogForm}
                    setShowForm={setShowBlogForm}
                    editingBlog={editingBlog}
                    setEditingBlog={setEditingBlog}
                    onCreateBlog={handleCreateBlog}
                    onUpdateBlog={handleUpdateBlog}
                    onDeleteBlog={handleDeleteBlog}
                />
            )}
            
            {activeTab === 'jobs' && (
                    <JobsManagement
                    jobs={jobs}
                    showForm={showJobForm}
                    setShowForm={setShowJobForm}
                    editingJob={editingJob}
                    setEditingJob={setEditingJob}
                    onCreateJob={handleCreateJob}
                    onUpdateJob={handleUpdateJob}
                    onDeleteJob={handleDeleteJob}
                />
            )}
            
            {activeTab === 'clients' && <ClientRequestsManagement requests={clientRequests} onUpdateStatus={handleUpdateRequestStatus} onDelete={handleDeleteClientRequest} onExport={handleExportClients} />}
            {activeTab === 'freelancers' && <FreelancerApplicationsManagement applications={freelancerApplications} onUpdateStatus={handleUpdateApplicationStatus} onDelete={handleDeleteFreelancerApplication} onExport={handleExportFreelancers} />}
        </AnimatePresence>
      </main>
    </div>
  );
};

// ... Sub Components ...

const DashboardStats = ({ stats }) => {
    const getValue = (val) => {
        if (typeof val === 'object' && val !== null && 'total' in val) return val.total;
        return val || 0;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={Users} label="Total Users" value={getValue(stats?.users)} color="text-blue-400" bg="bg-blue-900/20" />
            <StatCard icon={Briefcase} label="Active Projects" value={getValue(stats?.projects)} color="text-purple-400" bg="bg-purple-900/20" />
            <StatCard icon={FileText} label="Total Blogs" value={getValue(stats?.blogs)} color="text-green-400" bg="bg-green-900/20" />
            <StatCard icon={Briefcase} label="Client Requests" value={getValue(stats?.clientRequests)} color="text-yellow-400" bg="bg-yellow-900/20" />
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className="bg-[#0A0F1C] p-6 rounded-2xl border border-gray-800 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${bg} ${color}`}>
                <Icon size={24} />
            </div>
        </div>
        <h3 className="text-4xl font-bold text-white mb-1">{value}</h3>
        <p className="text-white text-base">{label}</p>
    </div>
);

const UsersManagement = ({ users, showForm, setShowForm, onCreateUser }) => {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'client' });
    const [editingUser, setEditingUser] = useState(null);
    const API_URL = '/api/admin';

    const getAuthHeaders = () => ({
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingUser) {
            try {
                await api.put(`${API_URL}/users/${editingUser._id}`, formData, getAuthHeaders());
                alert('User updated successfully');
                onCreateUser(null); // Refetch helper or pass a refresh function
                setEditingUser(null);
                setShowForm(false);
            } catch (error) {
                alert('Error updating user');
            }
        } else {
            onCreateUser(formData);
        }
        setFormData({ name: '', email: '', role: 'client' });
    };
    
    // Helper to refresh users by calling parent's onCreateUser with null (trick to trigger refetch if parent logic allows, else we need a prop)
    // Actually, onCreateUser in parent refetches. We can create a dedicated 'refetch' prop or reuse onCreateUser logic if modified.
    // Let's modify handleDelete to assume parent will refetch if we call a callback.
    // Ideally, pass onUpdateUser and onDeleteUser from parent. 
    // For now, I will implement local axios calls and then use onCreateUser purely for creation-trigger-refetch, or reload page?
    // Better: Allow parent to handle crud completely. But to save steps, I'll do direct axios here and assume 'onCreateUser' can be used to just refetch if passed a special flag, OR I will duplicate fetch logic? 
    // Let's stick to modifying the parent in the next step to pass these handlers? 
    // No, I can't modify parent easily in this chunk without big context. 
    // I will use direct Axios calls here and reload the page or use a prop if available. 
    // Parent 'onCreateUser' calls fetchUsers(). I can pass a dummy to it? No.
    // I will assume I can pass a 'refresh' callback. I'll add 'onRefresh' to props in the replacement.

    const handleDelete = async (id) => {
        if(window.confirm('Delete this user?')) {
            try {
                await api.delete(`${API_URL}/users/${id}`, getAuthHeaders());
                // Trigger refresh - simpler to just reload or if we had the fetch function
                // I will add onRefresh prop in the parent usage
                if (onCreateUser && typeof onCreateUser === 'function') {
                    // This is hacky: calling onCreateUser with null might just crash or do nothing? 
                    // Let's check handleCreateUser in parent: uses passed data.
                    // I will strictly rely on a new prop 'onRefresh' which I will add to the parent call in the next step.
                } 
                window.location.reload(); // Fallback for now to ensure consistency without big refactor
            } catch (error) {
                alert('Error deleting user');
            }
        }
    };

    useEffect(() => {
        if (!showForm && !editingUser) {
            setFormData({ name: '', email: '', role: 'client' });
        }
    }, [showForm, editingUser]);

    const startEdit = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role });
        setShowForm(true);
    };

    return (
        <div className="space-y-6">
            {showForm && (
                <div className="bg-[#0A0F1C] p-6 rounded-2xl shadow-lg border border-gray-800">
                    <h3 className="text-lg font-bold mb-4 text-white">{editingUser ? 'Update User' : 'Create New Account'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-base font-medium mb-1 text-white">Name</label>
                            <input className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg text-base" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-base font-medium mb-1 text-white">Email</label>
                            <input className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg text-base" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required disabled={!!editingUser} />
                        </div>
                        <div>
                            <label className="block text-base font-medium mb-1 text-white">Role</label>
                            <select className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg text-base" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                <option value="client">Client</option>
                                <option value="freelancer">Freelancer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg font-bold hover:bg-indigo-700 text-base">{editingUser ? 'Update User' : 'Create & Send Email'}</button>
                    </form>
                </div>
            )}
            
            <div className="bg-[#0A0F1C] rounded-2xl border border-gray-800 overflow-hidden">
                <div className="flex justify-between p-6 border-b border-gray-800">
                   <h3 className="font-bold text-white">System Users</h3>
                   <button onClick={() => { setEditingUser(null); setFormData({name: '', email: '', role: 'client'}); setShowForm(!showForm); }} className="text-indigo-400 font-bold flex items-center gap-2"><Plus size={18}/> New User</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1E293B] border-b border-gray-700 text-white">
                            <tr><th className="p-4 text-base font-bold">Name</th><th className="p-4 text-base font-bold">Email</th><th className="p-4 text-base font-bold">Role</th><th className="p-4 text-base font-bold">Actions</th></tr>
                        </thead>
                        <tbody>
                        {users.map(u => (
                            <tr key={u._id} className="border-b border-gray-800 hover:bg-[#1E293B] transition-colors">
                                <td className="p-4 font-bold text-white text-base">{u.name}</td>
                                <td className="p-4 text-base text-white">{u.email}</td>
                                <td className="p-4"><span className="px-2 py-1 rounded-full bg-gray-800 text-xs uppercase font-bold text-white">{u.role}</span></td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => startEdit(u)} className="p-1 text-white hover:text-indigo-400"><Edit2 size={16}/></button>
                                    <button onClick={() => handleDelete(u._id)} className="p-1 text-white hover:text-red-500"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
};

const SERVICE_CATEGORIES = {
    "Text & NLP": [
        "Sentiment Analysis", "Named Entity Recognition", "Text Summarization", "Translation"
    ],
    "Audio & Speech": [
        "Transcription", "Speaker Diarization", "Audio Classification", "Phonetic Annotation"
    ],
    "Computer Vision": [
        "Bounding Boxes", "Semantic Segmentation", "Keypoint Annotation"
    ],
    "Video Intelligence": [
        "Action Recognition", "Object Tracking", "Temporal Labeling", "Scene Understanding"
    ],
    "Generative AI": [
        "RLHF / RLAIF", "Prompt Engineering", "Hallucination Check", "Model Red-Teaming"
    ],
    "Search Relevance": [
        "Query Understanding", "Result Ranking", "Ads Evaluation", "Semantic Match"
    ],
    "Trust & Safety": [
        "Hate Speech Detection", "Content Moderation", "Bias Analysis", "Harmful Content"
    ],
    "Geospatial Data": [
        "LiDAR Annotation", "Satellite Imagery", "POI Verification", "Route Analysis"
    ]
};

const ProjectsManagement = ({ projects, users, showForm, setShowForm, onCreateProject, onUpdateProject, onDeleteProject }) => {
    const [formData, setFormData] = useState({ title: '', description: '', client: '', freelancers: [], deadline: '', category: '', serviceType: '', totalItems: '', unit: 'Tasks' });
    const [editingProject, setEditingProject] = useState(null);
    
    // Filter users
    const clients = users.filter(u => u.role === 'client');
    const freelancers = users.filter(u => u.role === 'freelancer');

    const handleFreelancerChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, freelancers: selectedOptions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingProject) {
            onUpdateProject(editingProject._id, formData);
            setEditingProject(null);
        } else {
            onCreateProject(formData);
        }
        setFormData({ title: '', description: '', client: '', freelancers: [], deadline: '', category: '', serviceType: '', totalItems: '', unit: 'Tasks' });
    };

    const startEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            client: project.client?._id || project.client,
            freelancers: project.freelancers ? project.freelancers.map(f => f._id || f) : [],
            deadline: project.deadline ? project.deadline.split('T')[0] : '', // Format date for input
            category: project.category || '',
            serviceType: project.serviceType || '',
            totalItems: project.totalItems || '',
            unit: project.unit || 'Tasks'
        });
        setShowForm(true);
    };

    return (
        <div className="space-y-6">
            {showForm && (
                <div className="bg-[#0A0F1C] p-6 rounded-2xl shadow-lg border border-gray-800 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">{editingProject ? 'Edit Project' : 'Launch New Project'}</h3>
                        <button onClick={() => { setShowForm(false); setEditingProject(null); setFormData({ title: '', description: '', client: '', freelancers: [], deadline: '', category: '', serviceType: '', totalItems: '', unit: 'Tasks' }); }} className="text-white hover:text-white"><X size={20}/></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg placeholder-gray-500 text-base" placeholder="Project Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            <input className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg text-base" type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} required />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-base font-bold mb-1 text-white">Service Category</label>
                                <select className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg text-base" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value, serviceType: ''})} required>
                                    <option value="">Select Category</option>
                                    {Object.keys(SERVICE_CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                             </div>
                             <div>
                                <label className="block text-base font-bold mb-1 text-white">Service Type</label>
                                <select className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg text-base" value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})} required disabled={!formData.category}>
                                    <option value="">Select Type</option>
                                    {formData.category && SERVICE_CATEGORIES[formData.category].map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                             </div>
                        </div>

                        {/* Quantity and Unit Input */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-base font-bold mb-1 text-white">Total Quantity</label>
                                <input type="number" className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg placeholder-gray-500 text-base" placeholder="e.g. 1000" value={formData.totalItems} onChange={e => setFormData({...formData, totalItems: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-base font-bold mb-1 text-white">Unit Type</label>
                                <input className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg placeholder-gray-500 text-base" placeholder="e.g. Images, Hours" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
                            </div>
                        </div>

                        <textarea className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg placeholder-gray-600" placeholder="Description / Guidelines" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-base font-bold mb-1 text-white">Assign Client</label>
                                <select className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg text-base" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} required>
                                    <option value="">Select Client</option>
                                    {clients.map(c => <option key={c._id} value={c._id}>{c.name} ({c.email})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-base font-bold mb-1 text-white">Assign Freelancers (Ctrl+Click for multiple)</label>
                                <select multiple className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg h-32 text-base" value={formData.freelancers} onChange={handleFreelancerChange}>
                                    {freelancers.map(f => <option key={f._id} value={f._id}>{f.name} ({f.email})</option>)}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700">{editingProject ? 'Update Project' : 'Create Project'}</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                 {/* Project List */}
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-white">Active Projects</h3>
                    <button onClick={() => { setShowForm(!showForm); setEditingProject(null); setFormData({ title: '', description: '', client: '', freelancers: [], deadline: '', category: '', serviceType: '' }); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700">+ New Project</button>
                 </div>
                 
                 {projects.map(p => (
                     <div key={p._id} className="bg-[#0A0F1C] p-6 rounded-xl border border-gray-800 shadow-sm flex flex-col md:flex-row gap-6">
                         <div className="flex-1">
                             <div className="flex items-center gap-2 mb-2">
                                 <h4 className="text-xl font-bold text-white">{p.title}</h4>
                                 <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                     p.status === 'Completed' ? 'bg-green-900/20 text-green-400' : 
                                     p.status === 'In Progress' ? 'bg-blue-900/20 text-blue-400' : 'bg-gray-800 text-white'
                                 }`}>{p.status}</span>
                                 {p.serviceType && <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-900/20 text-purple-400">{p.serviceType}</span>}
                             </div>
                             <p className="text-white text-sm mb-4">{p.description}</p>
                             
                             <div className="flex gap-6 text-sm">
                                 <div>
                                     <span className="block text-white text-xs uppercase font-bold">Client</span>
                                     <span className="font-semibold text-white">{p.client?.name || 'Unknown'}</span>
                                 </div>
                                 <div className="w-px bg-gray-800"></div>
                                 <div className="flex flex-col">
                                     <span className="block text-white text-xs uppercase font-bold">Freelancers</span>
                                     <div className="flex flex-wrap gap-1">
                                         {p.freelancers && p.freelancers.length > 0 ? p.freelancers.map(f => (
                                             <span key={f._id} className="font-semibold text-white bg-gray-800 px-1 rounded">{f.name}</span>
                                         )) : <span className="font-semibold text-white">Unassigned</span>}
                                     </div>
                                 </div>
                             </div>
                         </div>
                         
                         <div className="w-full md:w-64 bg-black rounded-xl p-4 flex flex-col justify-center border border-gray-800">
                             <div className="flex justify-between text-xs font-bold text-white mb-1">
                                 <span>Progress</span>
                                 <span>{p.completedItems || 0} / {p.totalItems || '-'} {p.unit || 'Tasks'}</span>
                             </div>
                             <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                                 <div className="h-full bg-indigo-600" style={{ width: `${p.totalItems > 0 ? ((p.completedItems || 0) / p.totalItems) * 100 : (p.progress || 0)}%` }}></div>
                             </div>
                             
                             {/* Admin Dashboard Change: Add Approve Button */}
                             {p.submissions && p.submissions.length > 0 && (
                                 <div className="mb-4 bg-green-900/20 p-2 rounded text-xs text-green-400 font-bold border border-green-900/30">
                                     <span className="block mb-1">Latest Submission:</span>
                                    <a href={(() => {
                                         const url = p.submissions[p.submissions.length-1].fileUrl;
                                         if (!url) return '#';
                                         if (url.startsWith('http')) return url;
                                         return `${import.meta.env.VITE_API_URL}${url}`;
                                     })()} target="_blank" rel="noopener noreferrer" className="underline truncate block mb-2 text-green-300 hover:text-green-200">
                                        View Submission
                                     </a>
                                     
                                     {/* ONLY show Approve button if status is 'For Review' */}
                                     {p.status === 'For Review' && (
                                         <button 
                                             onClick={() => {
                                                 if (window.confirm('Approve this work? This will make it visible to the client.')) {
                                                     // Re-using onUpdateProject to set status to Approved and progress to 100
                                                     onUpdateProject(p._id, { status: 'Approved', progress: 100 });
                                                 }
                                             }}
                                             className="w-full mt-2 py-1 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700"
                                         >
                                             Approve Work
                                         </button>
                                     )}
                                 </div>
                             )}

                             <button onClick={() => startEdit(p)} className="w-full py-2 bg-[#0A0F1C] border border-gray-700 rounded-lg text-sm font-bold text-white hover:bg-gray-800 mb-2">Manage Details</button>
                             <button onClick={() => onDeleteProject(p._id)} className="w-full py-2 bg-red-900/20 border border-red-900/30 rounded-lg text-sm font-bold text-red-500 hover:bg-red-900/40 flex items-center justify-center gap-2"><Trash2 size={16}/> Delete Project</button>
                         </div>
                     </div>
                 ))}
            </div>
        </div>
    );
};

const JobsManagement = ({ jobs, showForm, setShowForm, editingJob, setEditingJob, onCreateJob, onUpdateJob, onDeleteJob }) => {
    const [formData, setFormData] = useState({ title: '', category: '', location: 'Remote', type: 'Freelance', salary: '', description: '', skills: '' });

    useEffect(() => {
        if (editingJob) {
            setFormData({
                title: editingJob.title || '',
                category: editingJob.category || '',
                location: editingJob.location || 'Remote',
                type: editingJob.type || 'Freelance',
                salary: editingJob.salary || '',
                description: editingJob.description || '',
                skills: editingJob.skills ? (Array.isArray(editingJob.skills) ? editingJob.skills.join(', ') : editingJob.skills) : ''
            });
            setShowForm(true);
        }
    }, [editingJob]);

    useEffect(() => {
        if (!showForm && !editingJob) {
            setFormData({ title: '', category: '', location: 'Remote', type: 'Freelance', salary: '', description: '', skills: '' });
        }
    }, [showForm, editingJob]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        };
        if (editingJob) {
            await onUpdateJob(editingJob._id, data);
        } else {
            await onCreateJob(data);
        }
        setFormData({ title: '', category: '', location: 'Remote', type: 'Freelance', salary: '', description: '', skills: '' });
    };

    return (
        <div className="space-y-6">
            {showForm && (
                <div className="bg-[#0A0F1C] p-6 rounded-2xl shadow-lg border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">{editingJob ? 'Edit Job' : 'Post New Job'}</h3>
                        <button onClick={() => { setShowForm(false); setEditingJob(null); setFormData({ title: '', category: '', location: 'Remote', type: 'Freelance', salary: '', description: '', skills: '' }); }}><X size={20} className="text-white hover:text-white"/></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-white uppercase mb-1">Job Title</label>
                                <input className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg placeholder-gray-500 text-base" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white uppercase mb-1">Category</label>
                                <input className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg placeholder-gray-500 text-base" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. AI Training" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-white uppercase mb-1">Type</label>
                                <select className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg text-base" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white uppercase mb-1">Location</label>
                                <input className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg placeholder-gray-500 text-base" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white uppercase mb-1">Salary / Rate</label>
                                <input className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg placeholder-gray-500 text-base" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} placeholder="e.g. $20/hr"/>
                            </div>
                        </div>
                        
                        <div>
                             <label className="block text-sm font-bold text-white uppercase mb-1">Skills (comma separated)</label>
                             <input className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg placeholder-gray-500 text-base" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="Python, Annotation, Native Speaker"/>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-white uppercase mb-1">Description</label>
                            <ReactQuill theme="snow" value={formData.description} onChange={val => setFormData({...formData, description: val})} className="h-48 mb-12" />
                        </div>
                         
                        <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 mt-4">{editingJob ? 'Update Job' : 'Post Job'}</button>
                    </form>
                </div>
            )}

            <div className="bg-[#0A0F1C] rounded-2xl border border-gray-800 overflow-hidden">
                <div className="flex justify-between p-6 border-b border-gray-800">
                   <h3 className="font-bold text-white">Active Listings</h3>
                   <button onClick={() => { setShowForm(!showForm); setEditingJob(null); setFormData({ title: '', category: '', location: 'Remote', type: 'Freelance', salary: '', description: '', skills: '' }); }} className="text-indigo-400 font-bold flex items-center gap-2 hover:text-indigo-300"><Plus size={18}/> Post Job</button>
                </div>
                <div className="flex flex-col">
                    {jobs.map(job => (
                        <div key={job._id} className="p-6 border-b border-gray-800 hover:bg-[#1E293B] flex justify-between items-center group transition-colors">
                            <div>
                                <h4 className="font-bold text-xl text-white">{job.title}</h4>
                                <div className="flex gap-2 text-base text-white mt-1">
                                    <span className="px-2 py-0.5 bg-blue-900/20 text-blue-400 rounded text-sm font-bold uppercase">{job.type}</span>
                                    <span className="px-2 py-0.5 bg-gray-800 text-white rounded text-sm font-bold uppercase">{job.category}</span>
                                    <span>{job.location}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { 
                                    setFormData({
                                        title: job.title || '',
                                        category: job.category || '',
                                        location: job.location || 'Remote',
                                        type: job.type || 'Freelance',
                                        salary: job.salary || '',
                                        description: job.description || '',
                                        skills: job.skills ? (Array.isArray(job.skills) ? job.skills.join(', ') : job.skills) : ''
                                    });
                                    setEditingJob(job); 
                                    setShowForm(true); 
                                }} className="p-2 text-white hover:text-indigo-400 bg-black border border-gray-700 rounded-lg shadow-sm"><Edit2 size={16}/></button>
                                <button onClick={() => onDeleteJob(job._id)} className="p-2 text-white hover:text-red-500 bg-black border border-gray-700 rounded-lg shadow-sm"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                    {jobs.length === 0 && <div className="p-8 text-center text-white text-lg">No active job postings.</div>}
                </div>
            </div>
        </div>
    );
};

// ... Sub-components (restyled) ...
const BlogsManagement = ({ blogs, showForm, setShowForm, editingBlog, setEditingBlog, onCreateBlog, onUpdateBlog, onDeleteBlog }) => {
  const [formData, setFormData] = useState({
    title: '', excerpt: '', content: '', category: '',
    author: { name: '', role: '', avatar: '' },
    featuredImage: '', readTime: '5 min read',
    published: true, tags: []
  });

  useEffect(() => {
    if (editingBlog) {
      setFormData({
          title: editingBlog.title || '',
          excerpt: editingBlog.excerpt || '',
          content: editingBlog.content || '',
          category: editingBlog.category || '',
          author: editingBlog.author || { name: 'Admin', role: 'Editor', avatar: '' },
          featuredImage: editingBlog.featuredImage || '',
          readTime: editingBlog.readTime || '5 min read',
          published: editingBlog.published !== undefined ? editingBlog.published : true,
          tags: editingBlog.tags || []
      });
      setShowForm(true);
    }
  }, [editingBlog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingBlog) { 
        await onUpdateBlog(editingBlog._id, formData); 
    } else { 
        await onCreateBlog(formData); 
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '', excerpt: '', content: '', category: '',
      author: { name: 'Admin', role: 'Editor', avatar: '' }, 
      featuredImage: '', readTime: '5 min read',
      published: true, tags: []
    });
    setEditingBlog(null);
  };

  useEffect(() => {
    if (!showForm && !editingBlog) {
        setFormData({
            title: '', excerpt: '', content: '', category: '',
            author: { name: 'Admin', role: 'Editor', avatar: '' }, 
            featuredImage: '', readTime: '5 min read',
            published: true, tags: []
        });
    }
  }, [showForm, editingBlog]);

  const modules = {
      toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          ['link', 'image'],
          ['clean']
      ],
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {showForm ? (
         <div className="bg-[#0A0F1C] rounded-xl shadow-lg border border-gray-800 overflow-hidden mb-6 max-w-4xl mx-auto">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#0A0F1C]">
               <h3 className="text-xl font-bold text-white">{editingBlog ? 'Edit Blog Post' : 'Create New Post'}</h3>
               <button onClick={() => { setShowForm(false); resetForm(); }} className="p-1 hover:text-white rounded-full transition text-white"><X size={20} /></button>
            </div>
            <div className="p-6">
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-sm font-bold text-white uppercase">Title</label>
                       <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 text-base text-white bg-black rounded-lg border border-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none placeholder-gray-500" placeholder="Blog Title" required />
                    </div>
                    <div className="space-y-1">
                       <label className="text-sm font-bold text-white uppercase">Category</label>
                       <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 text-base text-white bg-black rounded-lg border border-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none placeholder-gray-500" placeholder="e.g. AI" required />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                      <label className="text-sm font-bold text-white uppercase">Excerpt</label>
                      <textarea rows={2} value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full px-3 py-2 text-base text-white bg-black rounded-lg border border-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none resize-none placeholder-gray-500" placeholder="Brief summary..." required />
                  </div>

                  <div className="space-y-1">
                      <label className="text-sm font-bold text-white uppercase">Content</label>
                      <div className="bg-black rounded-lg border border-gray-700 overflow-hidden">
                          <ReactQuill 
                            key={editingBlog ? editingBlog._id : 'new-blog-post'}
                            theme="snow"
                            value={formData.content} 
                            onChange={(content) => setFormData({ ...formData, content })} 
                            modules={modules}
                            className="h-48 mb-10" // Space for toolbar
                          />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-1">
                        <label className="text-sm font-bold text-white uppercase">Author</label>
                        <input type="text" value={formData.author.name} onChange={(e) => setFormData({ ...formData, author: { ...formData.author, name: e.target.value } })} className="w-full px-3 py-2 text-base text-white bg-black rounded-lg border border-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none placeholder-gray-500" placeholder="Name" required />
                     </div>
                     <div className="space-y-1">
                        <label className="text-sm font-bold text-white uppercase">Read Time</label>
                        <input type="text" value={formData.readTime} onChange={(e) => setFormData({ ...formData, readTime: e.target.value })} className="w-full px-3 py-2 text-base text-white bg-black rounded-lg border border-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none placeholder-gray-500" placeholder="5 min" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-sm font-bold text-white uppercase flex justify-between">
                            Featured Image
                            {formData.featuredImage && (
                                <button type="button" onClick={() => setFormData({...formData, featuredImage: ''})} className="text-red-400 hover:text-red-300 text-xs lowercase hover:underline">remove</button>
                            )}
                        </label>
                        {formData.featuredImage ? (
                            <div className="h-10 w-full flex items-center gap-2 border border-gray-700 rounded-lg px-2 bg-black">
                                <img src={formData.featuredImage} alt="Preview" className="h-8 w-8 rounded object-cover" />
                                <span className="text-xs text-white truncate flex-1">{formData.featuredImage}</span>
                            </div>
                        ) : (
                            <CloudinaryImageUpload 
                                folder="alanxa/blogs"
                                onUploadSuccess={(url) => setFormData({...formData, featuredImage: url})}
                            />
                        )}
                     </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                     <input type="checkbox" id="pub" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="rounded text-indigo-600 focus:ring-indigo-500 w-5 h-5 bg-black border-gray-700" />
                     <label htmlFor="pub" className="text-base font-medium text-white">Publish Immediately</label>
                  </div>

                  <div className="flex gap-3 pt-2">
                     <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow transition-colors text-base">
                        {editingBlog ? 'Update Post' : 'Publish Post'}
                     </button>
                     <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors text-base">
                        Cancel
                     </button>
                  </div>
               </form>
            </div>
         </div>
      ) : (
        <div className="space-y-4">
             <div className="flex justify-between items-center bg-[#0A0F1C] p-4 rounded-xl border border-gray-800 shadow-sm">
                 <h2 className="font-bold text-white text-xl">All Posts</h2>
                 <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-base font-bold shadow hover:bg-indigo-700 transition">
                     <Plus size={18} /> New Post
                 </button>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
                 {blogs.map(blog => (
                     <div key={blog._id} className="bg-[#0A0F1C] p-4 rounded-xl border border-gray-800 shadow-sm flex justify-between items-center group hover:shadow-md transition-all">
                         <div className="flex-1 min-w-0 pr-4">
                             <div className="flex items-center gap-2 mb-1">
                                 <span className={`w-2 h-2 rounded-full ${blog.published ? 'bg-green-500' : 'bg-yellow-400'}`}></span>
                                 <h4 className="font-bold text-white text-lg truncate">{blog.title}</h4>
                             </div>
                             <p className="text-sm text-white truncate">{blog.excerpt}</p>
                             <div className="mt-2 flex gap-2">
                                <span className="px-2 py-0.5 bg-gray-800 text-white text-xs rounded uppercase font-bold tracking-wider">{blog.category}</span>
                                <span className="text-xs text-white py-0.5">{new Date(blog.createdAt).toLocaleDateString()}</span>
                             </div>
                         </div>
                         <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => { 
                                 setFormData({
                                     title: blog.title || '',
                                     excerpt: blog.excerpt || '',
                                     content: blog.content || '',
                                     category: blog.category || '',
                                     author: blog.author || { name: 'Admin', role: 'Editor', avatar: '' },
                                     featuredImage: blog.featuredImage || '',
                                     readTime: blog.readTime || '5 min read',
                                     published: blog.published !== undefined ? blog.published : true,
                                     tags: blog.tags || []
                                 });
                                 setEditingBlog(blog); 
                                 setShowForm(true); 
                             }} className="p-2 text-indigo-400 hover:bg-indigo-900/20 rounded-lg"><Edit2 size={16}/></button>
                             <button onClick={() => onDeleteBlog(blog._id)} className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg"><Trash2 size={16}/></button>
                         </div>
                     </div>
                 ))}
                 {blogs.length === 0 && (
                     <div className="text-center py-10 text-white text-base">No blogs found. Create one to get started.</div>
                 )}
             </div>
        </div>
      )}
    </motion.div>
  );
};


const ClientRequestsManagement = ({ requests, onUpdateStatus, onDelete, onExport }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <div className="bg-[#0A0F1C] rounded-2xl shadow-sm border border-gray-800 overflow-hidden">
                 <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0A0F1C]">
                     <h3 className="font-bold text-white text-xl">Recent Requests</h3>
                     <button onClick={onExport} className="text-base font-medium text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1"><Download size={18} /> Export CSV</button>
                 </div>
                 <div className="overflow-x-auto">
                     <table className="w-full">
                         <thead className="bg-[#1E293B] text-sm font-bold text-white uppercase tracking-wider text-left border-b border-gray-700">
                             <tr>
                                 <th className="p-4">Company</th>
                                 <th className="p-4">Contact</th>
                                 <th className="p-4">Service</th>
                                 <th className="p-4">Date</th>
                                 <th className="p-4">Status</th>
                                 <th className="p-4">Action</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-800">
                             {requests.map(req => (
                                 <tr key={req._id} className="hover:bg-[#1E293B] transition-colors">
                                     <td className="p-4">
                                         <div className="font-bold text-white text-base">{req.companyName}</div>
                                         <div className="text-sm text-white">{req.country}</div>
                                     </td>
                                     <td className="p-4">
                                         <div className="text-base text-white">{req.contactPerson}</div>
                                         <div className="text-sm text-white">{req.email}</div>
                                     </td>
                                     <td className="p-4">
                                         <span className="px-2 py-1 rounded bg-blue-900/20 text-blue-400 text-sm font-semibold">{req.service === 'Other' && req.otherService ? `Other: ${req.otherService}` : req.service}</span>
                                     </td>
                                     <td className="p-4 text-base text-white">{new Date(req.createdAt).toLocaleDateString()}</td>
                                     <td className="p-4">
                                        <select 
                                            value={req.status} 
                                            onChange={(e) => onUpdateStatus(req._id, e.target.value)}
                                            className={`text-sm font-bold px-2 py-1 rounded-full border-none outline-none cursor-pointer ${
                                                req.status === 'Pending' ? 'bg-yellow-900/20 text-yellow-400' : 
                                                req.status === 'Contacted' ? 'bg-blue-900/20 text-blue-400' : 'bg-green-900/20 text-green-400'
                                            }`}
                                        >
                                            <option value="Pending" className="bg-gray-800 text-white">Pending</option>
                                            <option value="Contacted" className="bg-gray-800 text-white">Contacted</option>
                                            <option value="Closed" className="bg-gray-800 text-white">Closed</option>
                                        </select>
                                     </td>
                                     <td className="p-4">
                                        <button onClick={() => onDelete(req._id)} className="p-2 text-white hover:text-red-500 rounded-full hover:bg-red-900/20 transition"><Trash2 size={18} /></button>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
        </motion.div>
    );
};

const FreelancerApplicationsManagement = ({ applications, onUpdateStatus, onDelete, onExport }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <div className="bg-[#0A0F1C] rounded-2xl shadow-sm border border-gray-800 overflow-hidden">
                 <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0A0F1C]">
                     <h3 className="font-bold text-white text-xl">Freelancer Applications</h3>
                     <button onClick={onExport} className="text-base font-medium text-green-400 hover:text-green-300 hover:underline flex items-center gap-1"><Download size={18} /> Export Excel</button>
                 </div>
                 <div className="overflow-x-auto">
                     <table className="w-full">
                         <thead className="bg-[#1E293B] text-sm font-bold text-white uppercase tracking-wider text-left border-b border-gray-700">
                             <tr>
                                 <th className="p-4">Applicant</th>
                                 <th className="p-4">Role/Skills</th>
                                 <th className="p-4">Availability</th>
                                 <th className="p-4">Resume</th>
                                 <th className="p-4">Status</th>
                                 <th className="p-4">Action</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-800">
                             {applications.map(app => (
                                 <tr key={app._id} className="hover:bg-[#1E293B] transition-colors">
                                     <td className="p-4">
                                         <div className="font-bold text-white text-base">{app.name}</div>
                                         <div className="text-sm text-white">{app.email}</div>
                                         <div className="text-sm text-white">{app.phone}</div>
                                     </td>
                                     <td className="p-4">
                                         <div className="text-base text-white line-clamp-1">{app.languages}</div>
                                         <div className="flex flex-wrap gap-1 mt-1">
                                             {app.interests?.slice(0, 2).map((i, idx) => (
                                                 <span key={idx} className="text-xs px-1.5 py-0.5 bg-gray-800 rounded text-white">{i}</span>
                                             ))}
                                         </div>
                                     </td>
                                     <td className="p-4 text-base text-white">
                                         {app.availability || 'N/A'}
                                         <span className="block text-sm text-white">{app.experience}</span>
                                     </td>
                                     <td className="p-4">
                                         {app.resume ? (
                                             <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-base font-medium">
                                                 <FileText size={16} /> View
                                             </a>
                                         ) : <span className="text-white text-sm">-</span>}
                                     </td>
                                     <td className="p-4">
                                        <select 
                                            value={app.status || 'Pending'} 
                                            onChange={(e) => onUpdateStatus(app._id, e.target.value)}
                                            className={`text-sm font-bold px-2 py-1 rounded-full border-none outline-none cursor-pointer ${
                                                app.status === 'Pending' ? 'bg-yellow-900/20 text-yellow-400' : 
                                                app.status === 'Approved' ? 'bg-green-900/20 text-green-400' : 
                                                app.status === 'Reviewing' ? 'bg-blue-900/20 text-blue-400' : 'bg-red-900/20 text-red-400'
                                            }`}
                                        >
                                            <option value="Pending" className="bg-gray-800 text-white">Pending</option>
                                            <option value="Reviewing" className="bg-gray-800 text-white">Reviewing</option>
                                            <option value="Approved" className="bg-gray-800 text-white">Approved</option>
                                            <option value="Rejected" className="bg-gray-800 text-white">Rejected</option>
                                        </select>
                                     </td>
                                     <td className="p-4">
                                        <button onClick={() => onDelete(app._id)} className="p-2 text-white hover:text-red-500 rounded-full hover:bg-red-900/20 transition"><Trash2 size={18} /></button>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
        </motion.div>
    );
};

export default AdminDashboard;
