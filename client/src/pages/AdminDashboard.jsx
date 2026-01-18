import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, FileText, Briefcase, TrendingUp, Search, Download, 
  Edit2, Trash2, Eye, CheckCircle, XCircle, Clock, Plus,
  Filter, ChevronDown, Upload, Save, LayoutDashboard, LogOut, Menu, X, ArrowRight, Layers, Shield, Megaphone, Home, Bell, Send
} from 'lucide-react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import CloudinaryImageUpload from '../components/CloudinaryImageUpload';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';
import FormTemplatesManager from '../components/FormTemplatesManager';
import AssessmentManager from '../components/AssessmentManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [clientRequests, setClientRequests] = useState([]);
  const [freelancerApplications, setFreelancerApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
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
        'Authorization': `Bearer ${token}`
      }
    };
  };

  // Session validation - check token and admin role
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/freelancer-dashboard');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardStats();
    if (activeTab === 'blogs') fetchBlogs();
    if (activeTab === 'jobs') fetchJobs();
    if (activeTab === 'clients') fetchClientRequests();
    if (activeTab === 'freelancers') fetchFreelancerApplications();
    if (activeTab === 'users' || activeTab === 'projects') fetchUsers(); // Need users for project creation
    if (activeTab === 'projects') fetchProjects();
    if (activeTab === 'announcements') { fetchAnnouncements(); fetchProjects(); }
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
      // Fetch legacy applications
      const legacyResponse = await api.get('/api/freelancers', getAuthHeaders());
      const legacyApps = (legacyResponse.data || []).map(app => ({
        ...app,
        source: 'legacy'
      }));
      
      // Fetch dynamic applications
      let dynamicApps = [];
      try {
        const dynamicResponse = await api.get(`${API_URL}/dynamic-applications`, getAuthHeaders());
        dynamicApps = (dynamicResponse.data || []).map(app => {
          // Extract name and email from formData for display
          const formData = app.formData || {};
          // Find name/email fields (common field IDs)
          const name = formData.name || formData.fullName || formData.full_name || 
                       Object.values(formData).find(v => typeof v === 'string' && v.includes('@') === false && v.length > 2 && v.length < 50) || 
                       'Dynamic Applicant';
          const email = formData.email || formData.emailAddress || 
                        Object.values(formData).find(v => typeof v === 'string' && v.includes('@')) || '';
          const phone = formData.phone || formData.phoneNumber || formData.contact || '';
          const interests = formData.skills || formData.interests || [];
          
          return {
            ...app,
            _id: app._id,
            name: name,
            email: email,
            phone: phone,
            languages: formData.language || formData.languages || '',
            interests: Array.isArray(interests) ? interests : [],
            experience: formData.experience || '',
            availability: formData.availability || '',
            resume: app.resumeUrl,
            position: app.jobTitle || 'Dynamic Form',
            status: app.status || 'Pending',
            createdAt: app.createdAt,
            source: 'dynamic',
            templateId: app.formTemplateId?._id || app.formTemplateId || null,
            templateName: app.formTemplateId?.name || 'Unknown Template',
            formData: formData  // Keep original formData for detailed view
          };
        });
      } catch (e) {
        console.log('No dynamic applications or endpoint not available');
      }
      
      // Merge and sort by date (newest first)
      const allApps = [...legacyApps, ...dynamicApps].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setFreelancerApplications(allApps);
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

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/api/admin/announcements', getAuthHeaders());
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleCreateAnnouncement = async (announcementData) => {
    try {
      await api.post('/api/admin/announcements', announcementData, getAuthHeaders());
      toast.success('Announcement sent successfully!');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error(error.response?.data?.message || 'Error sending announcement');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        await api.delete(`/api/admin/announcements/${id}`, getAuthHeaders());
        toast.success('Announcement deleted');
        fetchAnnouncements();
      } catch (error) {
        toast.error('Error deleting announcement');
      }
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
      // Form closing handled by caller or state update, but here we keep generic flow
      setShowBlogForm(false);
      setEditingBlog(null);
      toast.success('Blog post created successfully');
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error(error.response?.data?.message || 'Error creating blog');
      throw error; // Propagate error
    }
  };

  const handleUpdateBlog = async (id, blogData) => {
    try {
      await api.put(`${API_URL}/blogs/${id}`, blogData, getAuthHeaders());
      fetchBlogs();
      setShowBlogForm(false);
      setEditingBlog(null);
      toast.success('Blog post updated successfully');
    } catch (error) {
      console.error('Error updating blog:', error);
       toast.error(error.response?.data?.message || 'Error updating blog');
      throw error; // Propagate error
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

  const handleUpdateApplicationStatus = async (id, status, source) => {
    try {
      if (source === 'dynamic') {
        await api.put(`${API_URL}/dynamic-applications/${id}`, { status }, getAuthHeaders());
      } else {
        await api.put(`${API_URL}/freelancer-applications/${id}`, { status }, getAuthHeaders());
      }
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

  const handleDeleteFreelancerApplication = async (id, source) => {
    if (window.confirm('Delete this application?')) {
      try {
        if (source === 'dynamic') {
          await api.delete(`${API_URL}/dynamic-applications/${id}`, getAuthHeaders());
        } else {
          await api.delete(`${API_URL}/freelancer-applications/${id}`, getAuthHeaders());
        }
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

  const handleApproveAll = async () => {
    if (window.confirm('Are you sure you want to approve ALL pending freelancer applications?')) {
        try {
            const response = await api.put(`${API_URL}/freelancer-applications/approve-all`, {}, getAuthHeaders());
            alert(response.data.message);
            fetchFreelancerApplications();
        } catch (error) {
            console.error('Error approving all:', error);
            alert('Failed to approve applications');
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
      Country: app.country || '',
      'Mobile Device': app.mobileDevice || app.device || '',
      'Desktop Device': app.desktopDevice || '',
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
    { id: 'projects', label: 'Projects (God Mode)', icon: Layers },
    { id: 'form-templates', label: 'Form Templates', icon: FileText },
    { id: 'assessments', label: 'Assessments', icon: FileText },
    { id: 'announcements', label: 'Announcements', icon: Bell }
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

            {activeTab === 'form-templates' && (
                <FormTemplatesManager />
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
            {activeTab === 'freelancers' && <FreelancerApplicationsManagement applications={freelancerApplications} onUpdateStatus={handleUpdateApplicationStatus} onDelete={handleDeleteFreelancerApplication} onExport={handleExportFreelancers} onApproveAll={handleApproveAll} />}
            {activeTab === 'announcements' && <AnnouncementsPanel announcements={announcements} projects={projects} onCreateAnnouncement={handleCreateAnnouncement} onDeleteAnnouncement={handleDeleteAnnouncement} />}
            {activeTab === 'assessments' && <AssessmentManager />}
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
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editRole, setEditRole] = useState('client');
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    
    const API_URL = '/api/admin';

    const getAuthHeaders = () => ({
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    // Filter users
    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Create User Handle
    const handleSubmit = async (e) => {
        e.preventDefault();
        onCreateUser(formData); // Parent handles creation
        setFormData({ name: '', email: '', role: 'client' });
    };

    // Inline Edit Handlers
    const startEdit = (user) => {
        setEditingId(user._id);
        setEditRole(user.role);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditRole('client');
    };

    const handleExport = () => {
        const usersToExport = selectedUsers.size > 0 
            ? filteredUsers.filter(u => selectedUsers.has(u._id))
            : filteredUsers;
            
        const data = usersToExport.map(u => ({
            Name: u.name,
            Email: u.email,
            Role: u.role,
            Joined: new Date(u.createdAt || Date.now()).toLocaleDateString()
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Users");
        XLSX.writeFile(wb, "Users_List.xlsx");
    };

    const saveRole = async (userId) => {
        try {
            await api.put(`${API_URL}/users/${userId}`, { role: editRole }, getAuthHeaders());
            toast.success('User role updated');
            setEditingId(null);
            setTimeout(() => window.location.reload(), 500); // Reload to refresh
        } catch (error) {
            toast.error('Error updating role');
        }
    };

    // Delete Handlers
    const handleDelete = async (id) => {
        if(window.confirm('Delete this user?')) {
            try {
                await api.delete(`${API_URL}/users/${id}`, getAuthHeaders());
                toast.success('User deleted');
                window.location.reload();
            } catch (error) {
                toast.error('Error deleting user');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedUsers.size) return;
        if (window.confirm(`Delete ${selectedUsers.size} users?`)) {
            try {
                // Delete users sequentially (simple implementation)
                for (const id of selectedUsers) {
                    await api.delete(`${API_URL}/users/${id}`, getAuthHeaders());
                }
                toast.success('Users deleted successfully');
                setSelectedUsers(new Set());
                window.location.reload();
            } catch (error) {
                toast.error('Error deleting some users');
            }
        }
    };

    const handleBulkRoleChange = async (newRole) => {
        if (!selectedUsers.size) return;
        if (window.confirm(`Change role of ${selectedUsers.size} users to ${newRole}?`)) {
            try {
                await api.put(`${API_URL}/users/bulk-role`, { 
                    userIds: Array.from(selectedUsers),
                    newRole 
                }, getAuthHeaders());
                toast.success('Roles updated successfully');
                setSelectedUsers(new Set());
                window.location.reload();
            } catch (error) {
                toast.error('Error updating roles');
            }
        }
    };

    // Selection Handlers
    const toggleSelect = (id) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedUsers(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedUsers.size === filteredUsers.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(filteredUsers.map(u => u._id)));
        }
    };

    return (
        <div className="space-y-6">
            {/* Create User Form (Always valid to have) */}
            {showForm && (
                <div className="bg-[#0A0F1C] p-6 rounded-2xl shadow-lg border border-gray-800">
                    <h3 className="text-lg font-bold mb-4 text-white">Create New Account</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-base font-medium mb-1 text-white">Name</label>
                            <input className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg text-base" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-base font-medium mb-1 text-white">Email</label>
                            <input className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg text-base" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-base font-medium mb-1 text-white">Role</label>
                            <select className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg text-base" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                <option value="client">Client</option>
                                <option value="freelancer">Freelancer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg font-bold hover:bg-indigo-700 text-base">Create & Send Email</button>
                    </form>
                </div>
            )}
            
            <div className="bg-[#0A0F1C] rounded-2xl border border-gray-800 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-gray-800 gap-4">
                   <div className="flex items-center gap-4 w-full md:w-auto">
                       <h3 className="font-bold text-white whitespace-nowrap">System Users</h3>
                       <div className="relative w-full md:w-64">
                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                           <input 
                               type="text" 
                               placeholder="Search users..." 
                               value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                               className="w-full bg-[#1E293B] text-white pl-9 pr-4 py-2 rounded-lg text-sm border border-transparent focus:border-indigo-500 outline-none"
                           />
                       </div>
                   </div>
                   
                   <div className="flex items-center gap-3">
                       {selectedUsers.size > 0 && (
                           <>
                               <select 
                                   onChange={(e) => handleBulkRoleChange(e.target.value)}
                                   className="bg-black text-white text-sm px-3 py-2 rounded-lg border border-gray-700 hover:border-gray-500 font-bold outline-none"
                                   defaultValue=""
                               >
                                   <option value="" disabled>Change Role</option>
                                   <option value="client">Client</option>
                                   <option value="freelancer">Freelancer</option>
                                   <option value="admin">Admin</option>
                               </select>

                               <button onClick={handleBulkDelete} className="bg-red-900/20 text-red-400 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-900/40 transition flex items-center gap-2">
                                   <Trash2 size={16} /> Delete Selected ({selectedUsers.size})
                               </button>
                           </>
                       )}
                       <button onClick={handleExport} className="text-indigo-400 font-bold flex items-center gap-2 hover:bg-indigo-900/20 px-3 py-2 rounded-lg transition"><Download size={18}/> Export Excel</button>
                       <button onClick={() => setShowForm(!showForm)} className="text-indigo-400 font-bold flex items-center gap-2 hover:bg-indigo-900/20 px-3 py-2 rounded-lg transition"><Plus size={18}/> New User</button>
                   </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1E293B] border-b border-gray-700 text-white">
                            <tr>
                                <th className="p-4 w-10">
                                    <input 
                                        type="checkbox" 
                                        checked={filteredUsers.length > 0 && selectedUsers.size === filteredUsers.length}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-600 bg-black text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    />
                                </th>
                                <th className="p-4 text-base font-bold">Name</th>
                                <th className="p-4 text-base font-bold">Email</th>
                                <th className="p-4 text-base font-bold">Role</th>
                                <th className="p-4 text-base font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map(u => (
                            <tr key={u._id} className={`border-b border-gray-800 hover:bg-[#1E293B] transition-colors ${selectedUsers.has(u._id) ? 'bg-indigo-900/10' : ''}`}>
                                <td className="p-4">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedUsers.has(u._id)}
                                        onChange={() => toggleSelect(u._id)}
                                        className="rounded border-gray-600 bg-black text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    />
                                </td>
                                <td className="p-4 font-bold text-white text-base">{u.name}</td>
                                <td className="p-4 text-base text-white">{u.email}</td>
                                <td className="p-4">
                                    {editingId === u._id ? (
                                        <select 
                                            value={editRole} 
                                            onChange={(e) => setEditRole(e.target.value)}
                                            className="bg-black text-white text-sm px-2 py-1 rounded border border-gray-700 outline-none"
                                        >
                                            <option value="freelancer">Freelancer</option>
                                            <option value="client">Client</option>
                                            <option value="admin">Admin</option>
                                            <option value="none">None</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2 py-1 rounded-full text-xs uppercase font-bold ${ 
                                            u.role === 'admin' ? 'bg-purple-900/50 text-purple-300' :
                                            u.role === 'freelancer' ? 'bg-blue-900/50 text-blue-300' :
                                            u.role === 'client' ? 'bg-green-900/50 text-green-300' :
                                            'bg-gray-800 text-gray-300'
                                        }`}>{u.role?.toUpperCase() || 'NONE'}</span>
                                    )}
                                </td>
                                <td className="p-4 flex gap-2">
                                    {editingId === u._id ? (
                                        <>
                                            <button onClick={() => saveRole(u._id)} className="p-1 text-green-400 hover:text-green-300" title="Save"><Save size={18}/></button>
                                            <button onClick={cancelEdit} className="p-1 text-gray-400 hover:text-white" title="Cancel"><X size={18}/></button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => startEdit(u)} className="p-1 text-white hover:text-indigo-400" title="Edit Role"><Edit2 size={16}/></button>
                                            <button onClick={() => handleDelete(u._id)} className="p-1 text-white hover:text-red-500" title="Delete"><Trash2 size={16}/></button>
                                        </>
                                    )}
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

    const handleExport = () => {
        const data = projects.map(p => ({
            Title: p.title,
            Client: p.client?.name || 'Unknown',
            Freelancers: p.freelancers?.map(f => f.name).join(', ') || 'Unassigned',
            Status: p.status,
            Progress: `${p.completedItems || 0} / ${p.totalItems || '-'} ${p.unit || ''}`,
            Deadline: new Date(p.deadline).toLocaleDateString(),
            Category: p.category,
            ServiceType: p.serviceType
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Projects");
        XLSX.writeFile(wb, "Projects_List.xlsx");
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
                    <div className="flex gap-2">
                        <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-green-700 flex items-center gap-1"><Download size={16}/> Export</button>
                        <button onClick={() => { setShowForm(!showForm); setEditingProject(null); setFormData({ title: '', description: '', client: '', freelancers: [], deadline: '', category: '', serviceType: '' }); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700">+ New Project</button>
                    </div>
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
    const [formData, setFormData] = useState({ title: '', category: '', location: 'Remote', type: 'Freelance', salary: '', description: '', skills: '', formTemplate: '' });
    const [formTemplates, setFormTemplates] = useState([]);

    const API_URL = '/api/admin';
    const getAuthHeaders = () => ({
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    // Fetch form templates on mount
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await api.get(`${API_URL}/form-templates`, getAuthHeaders());
                setFormTemplates(res.data);
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        };
        fetchTemplates();
    }, []);

    useEffect(() => {
        if (editingJob) {
            setFormData({
                title: editingJob.title || '',
                category: editingJob.category || '',
                location: editingJob.location || 'Remote',
                type: editingJob.type || 'Freelance',
                salary: editingJob.salary || '',
                description: editingJob.description || '',
                skills: editingJob.skills ? (Array.isArray(editingJob.skills) ? editingJob.skills.join(', ') : editingJob.skills) : '',
                formTemplate: editingJob.formTemplate || ''
            });
            setShowForm(true);
        }
    }, [editingJob]);

    useEffect(() => {
        if (!showForm && !editingJob) {
            setFormData({ title: '', category: '', location: 'Remote', type: 'Freelance', salary: '', description: '', skills: '', formTemplate: '' });
        }
    }, [showForm, editingJob]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            formTemplate: formData.formTemplate || null
        };
        if (editingJob) {
            await onUpdateJob(editingJob._id, data);
        } else {
            await onCreateJob(data);
        }
        setFormData({ title: '', category: '', location: 'Remote', type: 'Freelance', salary: '', description: '', skills: '', formTemplate: '' });
    };

    const handleExport = () => {
        const data = jobs.map(job => ({
            Title: job.title,
            Category: job.category,
            Type: job.type,
            Location: job.location,
            Salary: job.salary,
            Skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills,
            PostedAt: new Date(job.createdAt || Date.now()).toLocaleDateString()
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Jobs");
        XLSX.writeFile(wb, "Jobs_List.xlsx");
    };

    return (
        <div className="space-y-6">
            {showForm && (
                <div className="bg-[#0A0F1C] p-6 rounded-2xl shadow-lg border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">{editingJob ? 'Edit Job' : 'Post New Job'}</h3>
                        <button onClick={() => { setShowForm(false); setEditingJob(null); setFormData({ title: '', category: '', location: 'Remote', type: 'Freelance', salary: '', description: '', skills: '', formTemplate: '' }); }}><X size={20} className="text-white hover:text-white"/></button>
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
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                 <label className="block text-sm font-bold text-white uppercase mb-1">Skills (comma separated)</label>
                                 <input className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg placeholder-gray-500 text-base" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="Python, Annotation, Native Speaker"/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white uppercase mb-1">Application Form</label>
                                <select 
                                    className="w-full p-2 border border-gray-700 bg-black text-white rounded-lg text-base"
                                    value={formData.formTemplate} 
                                    onChange={e => setFormData({...formData, formTemplate: e.target.value})}
                                >
                                    <option value="">Default Form (Static)</option>
                                    {formTemplates.map(tmpl => (
                                        <option key={tmpl._id} value={tmpl._id}>{tmpl.name} ({tmpl.fields?.length || 0} fields)</option>
                                    ))}
                                </select>
                            </div>
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
                   <div className="flex gap-2">
                       <button onClick={handleExport} className="text-green-400 font-bold flex items-center gap-2 hover:text-green-300 mr-4"><Download size={18}/> Export Excel</button>
                       <button onClick={() => { setShowForm(!showForm); setEditingJob(null); setFormData({ title: '', category: '', location: 'Remote', type: 'Freelance', salary: '', description: '', skills: '', formTemplate: '' }); }} className="text-indigo-400 font-bold flex items-center gap-2 hover:text-indigo-300"><Plus size={18}/> Post Job</button>
                   </div>
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
    try {
        if (editingBlog) { 
            await onUpdateBlog(editingBlog._id, formData); 
        } else { 
            await onCreateBlog(formData); 
        }
        resetForm();
    } catch (error) {
        // Error already handled/toasted in parent, just don't reset form
        console.log("Keep form open due to error");
    }
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
                     <button onClick={onExport} className="text-base font-medium text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1"><Download size={18} /> Export Excel</button>
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

const FreelancerApplicationsManagement = ({ applications, onUpdateStatus, onDelete, onExport, onApproveAll }) => {
    const [statusFilter, setStatusFilter] = useState('All');
    const [sourceFilter, setSourceFilter] = useState('All'); // All, legacy, dynamic
    const [templateFilter, setTemplateFilter] = useState('All'); // Filter by specific template ID
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedApp, setSelectedApp] = useState(null); // For viewing details
    const API_URL = '/api/admin';
    const getAuthHeaders = () => ({
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    // Get unique templates from applications
    const uniqueTemplates = useMemo(() => {
        const templates = new Map();
        applications.forEach(app => {
            if (app.source === 'dynamic' && app.templateId) {
                templates.set(app.templateId, app.templateName);
            }
        });
        return Array.from(templates.entries()).map(([id, name]) => ({ id, name }));
    }, [applications]);

    // Filter applications based on current filters
    const filteredApplications = applications.filter(app => {
        // Source filter
        if (sourceFilter !== 'All' && app.source !== sourceFilter) {
            return false;
        }

        // Template filter (only if source is dynamic or All)
        if (templateFilter !== 'All' && app.templateId !== templateFilter) {
            return false;
        }
        
        // Status filter
        if (statusFilter !== 'All' && (app.status || 'Pending') !== statusFilter) {
            return false;
        }
        
        // Date filter
        const appDate = new Date(app.createdAt);
        if (startDate && appDate < new Date(startDate)) {
            return false;
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include the entire end date
            if (appDate > end) {
                return false;
            }
        }
        
        return true;
    });

    // Quick date presets
    const setDatePreset = (days) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
    };

    const clearFilters = () => {
        setStatusFilter('All');
        setSourceFilter('All');
        setTemplateFilter('All');
        setStartDate('');
        setEndDate('');
    };

    // Export filtered data with dynamic form fields
    const handleFilteredExport = () => {
        const wb = XLSX.utils.book_new();
        const timestamp = new Date().toISOString().split('T')[0];

        // Helper to remove empty columns
        const removeEmptyColumns = (dataset) => {
            if (!dataset || dataset.length === 0) return [];
            
            const keys = Object.keys(dataset[0]);
            const nonEmptyKeys = keys.filter(key => 
                dataset.some(row => row[key] !== '' && row[key] !== null && row[key] !== undefined)
            );
            
            return dataset.map(row => {
                const newRow = {};
                nonEmptyKeys.forEach(key => newRow[key] = row[key]);
                return newRow;
            });
        };

        // Helper to get full URL
        const getFullUrl = (url) => {
            if (!url) return '';
            if (url.startsWith('http')) return url;
            return `${window.location.origin.replace(':5173', ':5000')}${url}`;
        };

        // Use all applications when no filters are applied
        const isDefaultFilters = statusFilter === 'All' && sourceFilter === 'All' && templateFilter === 'All' && !startDate && !endDate;
        const dataToExport = isDefaultFilters ? applications : filteredApplications;

        // If no filters, create a single "All Applications" sheet first
        if (isDefaultFilters && dataToExport.length > 0) {
            const allData = dataToExport.map(app => {
                const baseRow = {
                    Type: app.source === 'dynamic' ? 'Dynamic' : 'Static',
                    Name: app.name || app.formData?.name || app.formData?.full_name || '',
                    Email: app.email || app.formData?.email || '',
                    Phone: app.phone || app.formData?.phone || '',
                    Languages: app.languages || app.formData?.languages || app.formData?.language || '',
                    Skills: Array.isArray(app.interests) ? app.interests.join(', ') : (app.interests || ''),
                    Experience: app.experience || app.formData?.experience || '',
                    Availability: app.availability || app.formData?.availability || '',
                    Position: app.position || app.templateName || '',
                    Country: app.country || app.formData?.country || '',
                    Device: app.device || app.formData?.device || '',
                    Status: app.status || 'Pending',
                    AppliedAt: new Date(app.createdAt).toLocaleDateString(),
                    Resume: getFullUrl(app.resume || app.resumeUrl || '')
                };

                // For dynamic forms, add extra formData fields
                if (app.source === 'dynamic' && app.formData) {
                    Object.entries(app.formData).forEach(([key, value]) => {
                        let cleanKey = key.replace(/_\d+$/, '').replace(/_/g, ' ');
                        cleanKey = cleanKey.charAt(0).toUpperCase() + cleanKey.slice(1);
                        // Skip if already mapped
                        if (!baseRow[cleanKey]) {
                            if (Array.isArray(value)) {
                                baseRow[cleanKey] = value.join(', ');
                            } else if (typeof value === 'object' && value !== null) {
                                baseRow[cleanKey] = JSON.stringify(value);
                            } else {
                                baseRow[cleanKey] = value || '';
                            }
                        }
                    });
                }
                return baseRow;
            });

            const cleanedData = removeEmptyColumns(allData);
            if (cleanedData.length > 0) {
                const ws = XLSX.utils.json_to_sheet(cleanedData);
                XLSX.utils.book_append_sheet(wb, ws, 'All Applications');
            }
        }

        // 1. Group Applications by Template/Source (for separate sheets)
        const groups = {};

        dataToExport.forEach(app => {
            let groupKey = 'legacy';
            let groupName = 'Static Forms';

            if (app.source === 'dynamic') {
                groupKey = app.templateId || 'unknown_dynamic';
                groupName = app.templateName || 'Dynamic Forms';
            }

            if (!groups[groupKey]) {
                groups[groupKey] = {
                    name: groupName,
                    apps: []
                };
            }
            groups[groupKey].apps.push(app);
        });

        // 2. Process each group as a separate sheet
        Object.values(groups).forEach(group => {
            let data;
            
            // Sanitize Sheet Name (Excel max 31 chars, no invalid chars)
            let sheetName = group.name.replace(/[:\/\\?*\[\]]/g, ' ').substring(0, 31).trim();
            // Ensure unique sheet names if duplicates after truncation
            let uniqueSheetName = sheetName;
            let counter = 1;
            while (wb.SheetNames.includes(uniqueSheetName)) {
                uniqueSheetName = `${sheetName.substring(0, 28)}(${counter})`;
                counter++;
            }
            
            if (group.name === 'Static Forms') {
                // Static/Legacy Mapping
                data = group.apps.map(app => ({
                    Name: app.name,
                    Email: app.email,
                    Phone: app.phone,
                    Languages: app.languages,
                    Skills: Array.isArray(app.interests) ? app.interests.join(', ') : (app.interests || ''),
                    OtherSkill: app.otherSkill || '',
                    Experience: app.experience,
                    Availability: app.availability,
                    Position: app.position || '',
                    Country: app.country || '',
                    OtherRegion: app.countryOther || '',
                    'Mobile Device': app.mobileDevice || app.device || '',
                    'Desktop Device': app.desktopDevice || (app.device === 'Laptop/PC' ? 'Windows' : ''),
                    Status: app.status || 'Pending',
                    AppliedAt: new Date(app.createdAt).toLocaleDateString(),
                    Resume: app.resume ? (app.resume.startsWith('http') ? app.resume : `${window.location.origin.replace(':5173', ':5000')}${app.resume}`) : ''
                }));
            } else {
                // Dynamic Form Mapping
                const getFullUrl = (url) => {
                    if (!url) return '';
                    if (url.startsWith('http')) return url;
                    return `${window.location.origin.replace(':5173', ':5000')}${url}`;
                };
                
                data = group.apps.map(app => {
                    const resumeUrl = app.resume || app.resumeUrl || '';
                    const row = {
                        Status: app.status || 'Pending',
                        AppliedAt: new Date(app.createdAt).toLocaleDateString(),
                        Resume: getFullUrl(resumeUrl)
                    };
                    
                    // Add formData with cleaned keys
                    if (app.formData && typeof app.formData === 'object') {
                        Object.entries(app.formData).forEach(([key, value]) => {
                            // Clean key: remove timestamp suffixes
                            let cleanKey = key.replace(/_\d+$/, '').replace(/_/g, ' ');
                            // Capitalize
                            cleanKey = cleanKey.charAt(0).toUpperCase() + cleanKey.slice(1);
                            
                            let formattedValue = '';
                            if (Array.isArray(value)) {
                                formattedValue = value.join(', ');
                            } else if (typeof value === 'object' && value !== null) {
                                formattedValue = JSON.stringify(value);
                            } else {
                                formattedValue = value || '';
                            }
                            row[cleanKey] = formattedValue;
                        });
                    }
                    return row;
                });
                
                // Remove empty columns for dynamic sheets
                data = removeEmptyColumns(data);
            }

            if (data.length > 0) {
                const ws = XLSX.utils.json_to_sheet(data);
                XLSX.utils.book_append_sheet(wb, ws, uniqueSheetName);
            }
        });

        if (wb.SheetNames.length === 0) {
            toast.error('No data to export');
            return;
        }

        // 3. Generate Filename
        let filename = "Applications";
        if (templateFilter !== 'All') {
            const templateName = uniqueTemplates.find(t => t.id === templateFilter)?.name || 'Template';
            filename = templateName.replace(/[^a-z0-9]/gi, '_') + "_Applications";
        } else if (sourceFilter === 'legacy') {
            filename = "Static_Applications";
        } else if (sourceFilter === 'dynamic') {
            filename = "All_Dynamic_Applications";
        }
        
        if (statusFilter !== 'All') filename += `_${statusFilter}`;
        filename += `_${timestamp}.xlsx`;
        
        XLSX.writeFile(wb, filename);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <div className="bg-[#0A0F1C] rounded-2xl shadow-sm border border-gray-800 overflow-hidden">
                 <div className="p-6 border-b border-gray-800 flex flex-col gap-4 bg-[#0A0F1C]">
                     {/* Header Row */}
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                         <h3 className="font-bold text-white text-xl">Freelancer Applications</h3>
                         <div className="flex flex-wrap gap-3 w-full md:w-auto">
                            <button onClick={async () => {
                                if (window.confirm('CRITICAL WARNING: Are you sure you want to DELETE ALL applications? This action CANNOT be undone and will wipe all legacy and dynamic form submissions.')) {
                                    try {
                                        await api.delete(`${API_URL}/freelancer-applications/all`, getAuthHeaders());
                                        toast.success('All applications deleted successfully');
                                        setTimeout(() => window.location.reload(), 1000);
                                    } catch (error) {
                                        toast.error('Error deleting applications');
                                        console.error(error);
                                    }
                                }
                            }} className="w-auto justify-center text-sm md:text-base font-bold bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/30 px-4 py-2 rounded-lg shadow-lg hover:shadow-red-900/10 transition-all flex items-center gap-2 whitespace-nowrap">
                                 <Trash2 size={18} /> Delete All
                            </button>
                            <button onClick={onApproveAll} className="w-auto justify-center text-sm md:text-base font-bold bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-green-900/20 transition-all flex items-center gap-2 whitespace-nowrap">
                                 <CheckCircle size={18} /> Approve All
                            </button>
                            <button onClick={handleFilteredExport} className="w-auto justify-center text-sm md:text-base font-medium text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 whitespace-nowrap"><Download size={18} /> Export Excel</button>
                         </div>
                     </div>
                     
                     {/* Filter Row */}
                     <div className="bg-[#1E293B] p-4 rounded-xl flex flex-col gap-4">
                         
                         <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            <span className="text-white text-sm font-bold uppercase shrink-0">Filters:</span>
                            
                            <div className="flex flex-col sm:flex-row gap-3 flex-1">
                                {/* Source Filter */}
                                <select 
                                    value={sourceFilter} 
                                    onChange={(e) => setSourceFilter(e.target.value)}
                                    className="bg-black text-white text-sm px-3 py-2 rounded-lg border border-gray-700 outline-none cursor-pointer w-full sm:w-auto min-w-[120px]"
                                >
                                    <option value="All">All Types</option>
                                    <option value="legacy">Static Forms</option>
                                    <option value="dynamic">Dynamic Forms</option>
                                </select>
                                
                                {/* Template Filter - Only show if dynamic/all and we have templates */}
                                {sourceFilter !== 'legacy' && uniqueTemplates.length > 0 && (
                                    <select 
                                        value={templateFilter} 
                                        onChange={(e) => setTemplateFilter(e.target.value)}
                                        className="bg-black text-white text-sm px-3 py-2 rounded-lg border border-gray-700 outline-none cursor-pointer w-full sm:w-auto min-w-[150px]"
                                    >
                                        <option value="All">All Templates</option>
                                        {uniqueTemplates.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                )}
                                
                                {/* Status Filter */}
                                <select 
                                    value={statusFilter} 
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-black text-white text-sm px-3 py-2 rounded-lg border border-gray-700 outline-none cursor-pointer w-full sm:w-auto min-w-[120px]"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Reviewing">Reviewing</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                                
                                {/* Date Range */}
                                <div className="flex items-center gap-2 w-full sm:w-auto bg-black border border-gray-700 rounded-lg px-2 py-1.5">
                                    <input 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        onClick={(e) => e.target.showPicker()}
                                        className="bg-transparent text-white text-sm outline-none cursor-pointer w-full"
                                        placeholder="Start"
                                    />
                                    <span className="text-gray-500 text-xs">to</span>
                                    <input 
                                        type="date" 
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        onClick={(e) => e.target.showPicker()}
                                        className="bg-transparent text-white text-sm outline-none cursor-pointer w-full"
                                        placeholder="End"
                                    />
                                </div>
                            </div>

                             {/* Clear Filters */}
                             {(statusFilter !== 'All' || startDate || endDate) && (
                                 <button onClick={clearFilters} className="self-start lg:self-center text-xs px-3 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg transition flex items-center gap-1">
                                     <X size={14} /> Clear
                                 </button>
                             )}
                         </div>

                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-gray-700 pt-3">
                             {/* Quick Presets */}
                             <div className="flex flex-wrap gap-2">
                                 <span className="text-gray-400 text-xs font-medium uppercase mr-1 py-1">Quick:</span>
                                 <button onClick={() => setDatePreset(0)} className="text-xs px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition">Today</button>
                                 <button onClick={() => setDatePreset(1)} className="text-xs px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition">Last 2 Days</button>
                                 <button onClick={() => setDatePreset(7)} className="text-xs px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition">Last 7 Days</button>
                                 <button onClick={() => setDatePreset(30)} className="text-xs px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition">Last 30 Days</button>
                             </div>
                             
                             {/* Results Count */}
                             <span className="text-gray-400 text-sm font-medium whitespace-nowrap">
                                 Showing <span className="text-white">{filteredApplications.length}</span> of {applications.length}
                             </span>
                         </div>
                     </div>
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
                             {filteredApplications.map(app => (
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
                                            onChange={(e) => onUpdateStatus(app._id, e.target.value, app.source)}
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
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setSelectedApp(app)} className="p-2 text-indigo-400 hover:text-indigo-300 rounded-full hover:bg-indigo-900/20 transition" title="View Details"><Eye size={18} /></button>
                                            <button onClick={() => onDelete(app._id, app.source)} className="p-2 text-white hover:text-red-500 rounded-full hover:bg-red-900/20 transition"><Trash2 size={18} /></button>
                                        </div>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>

            {/* Application Details Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedApp(null)}>
                    <div className="bg-[#0A0F1C] rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-[#0A0F1C]">
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedApp.name}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${selectedApp.source === 'dynamic' ? 'bg-purple-900/20 text-purple-400' : 'bg-gray-800 text-gray-400'}`}>
                                    {selectedApp.source === 'dynamic' ? 'Dynamic Form' : 'Legacy Form'}
                                </span>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-gray-800 rounded-lg"><X size={20} className="text-white"/></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1E293B] p-4 rounded-xl">
                                    <span className="text-xs text-gray-400 uppercase">Email</span>
                                    <p className="text-white font-medium">{selectedApp.email}</p>
                                </div>
                                <div className="bg-[#1E293B] p-4 rounded-xl">
                                    <span className="text-xs text-gray-400 uppercase">Phone</span>
                                    <p className="text-white font-medium">{selectedApp.phone || 'N/A'}</p>
                                </div>
                                {selectedApp.languages && (
                                    <div className="bg-[#1E293B] p-4 rounded-xl">
                                        <span className="text-xs text-gray-400 uppercase">Languages</span>
                                        <p className="text-white font-medium">{selectedApp.languages}</p>
                                    </div>
                                )}
                                {selectedApp.position && (
                                    <div className="bg-[#1E293B] p-4 rounded-xl">
                                        <span className="text-xs text-gray-400 uppercase">Position</span>
                                        <p className="text-white font-medium">{selectedApp.position}</p>
                                    </div>
                                )}
                                {selectedApp.country && (
                                    <div className="bg-[#1E293B] p-4 rounded-xl">
                                        <span className="text-xs text-gray-400 uppercase">Country</span>
                                        <p className="text-white font-medium">{selectedApp.country} {selectedApp.countryOther && selectedApp.country === 'Other' ? `(${selectedApp.countryOther})` : ''}</p>
                                    </div>
                                )}
                                {selectedApp.device && (
                                    <div className="bg-[#1E293B] p-4 rounded-xl">
                                        <span className="text-xs text-gray-400 uppercase">Device</span>
                                        <p className="text-white font-medium">{selectedApp.device}</p>
                                    </div>
                                )}
                                {selectedApp.experience && (
                                    <div className="bg-[#1E293B] p-4 rounded-xl">
                                        <span className="text-xs text-gray-400 uppercase">Experience</span>
                                        <p className="text-white font-medium">{selectedApp.experience}</p>
                                    </div>
                                )}
                                {selectedApp.availability && (
                                    <div className="bg-[#1E293B] p-4 rounded-xl">
                                        <span className="text-xs text-gray-400 uppercase">Availability</span>
                                        <p className="text-white font-medium">{selectedApp.availability}</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Skills */}
                            {selectedApp.interests && selectedApp.interests.length > 0 && (
                                <div className="bg-[#1E293B] p-4 rounded-xl">
                                    <span className="text-xs text-gray-400 uppercase block mb-2">Skills/Interests</span>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedApp.interests.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-indigo-900/30 text-indigo-400 rounded-full text-sm">{skill}</span>
                                        ))}
                                    </div>
                                    {selectedApp.otherSkill && <p className="text-white mt-2 text-sm">Other: {selectedApp.otherSkill}</p>}
                                </div>
                            )}

                            {/* Dynamic Form Data */}
                            {selectedApp.formData && Object.keys(selectedApp.formData).length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Layers size={18} className="text-purple-400"/> Dynamic Form Data</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {Object.entries(selectedApp.formData).map(([key, value]) => (
                                            <div key={key} className="bg-[#1E293B] p-4 rounded-xl">
                                                <span className="text-xs text-purple-400 uppercase">{key.replace(/_/g, ' ')}</span>
                                                <p className="text-white font-medium">
                                                    {Array.isArray(value) ? value.join(', ') : (typeof value === 'object' ? JSON.stringify(value) : (value || 'N/A'))}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Resume Link */}
                            {selectedApp.resume && (
                                <div className="pt-4 border-t border-gray-800">
                                    <a href={selectedApp.resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition">
                                        <FileText size={18}/> View Resume
                                    </a>
                                </div>
                            )}
                            
                            <div className="text-sm text-gray-500 pt-2">Applied: {new Date(selectedApp.createdAt).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

// ==================== ANNOUNCEMENTS PANEL ====================
const AnnouncementsPanel = ({ announcements, projects, onCreateAnnouncement, onDeleteAnnouncement }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        targetType: 'all',
        projectId: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.message.trim()) {
            toast.error('Title and message are required');
            return;
        }
        onCreateAnnouncement(formData);
        setFormData({ title: '', message: '', targetType: 'all', projectId: '' });
        setShowForm(false);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            {/* Create Announcement Form */}
            {showForm && (
                <div className="bg-[#0A0F1C] p-6 rounded-2xl border border-gray-800 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Send size={20} className="text-indigo-400" />
                            New Announcement
                        </h3>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full p-3 bg-black border border-gray-700 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                                placeholder="Announcement title..."
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                rows={4}
                                className="w-full p-3 bg-black border border-gray-700 rounded-xl text-white focus:border-indigo-500 focus:outline-none resize-none"
                                placeholder="Write your announcement message..."
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Target Audience</label>
                                <select
                                    value={formData.targetType}
                                    onChange={(e) => setFormData({...formData, targetType: e.target.value, projectId: ''})}
                                    className="w-full p-3 bg-black border border-gray-700 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                                >
                                    <option value="all">All Freelancers</option>
                                    <option value="project">Project Freelancers</option>
                                </select>
                            </div>
                            
                            {formData.targetType === 'project' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Select Project</label>
                                    <select
                                        value={formData.projectId}
                                        onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                                        className="w-full p-3 bg-black border border-gray-700 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                                        required
                                    >
                                        <option value="">Select a project...</option>
                                        {projects.map(p => (
                                            <option key={p._id} value={p._id}>{p.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2 border border-gray-700 text-gray-400 rounded-xl hover:bg-gray-800 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 font-medium"
                            >
                                <Send size={18} /> Send Announcement
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {/* Announcements List */}
            <div className="bg-[#0A0F1C] rounded-2xl border border-gray-800 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <div>
                        <h3 className="text-xl font-bold text-white">Sent Announcements</h3>
                        <p className="text-gray-400 text-sm mt-1">{announcements.length} announcements sent</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
                    >
                        <Plus size={18} /> New Announcement
                    </button>
                </div>
                
                <div className="divide-y divide-gray-800">
                    {announcements.length === 0 ? (
                        <div className="p-12 text-center">
                            <Bell size={48} className="mx-auto text-gray-600 mb-4" />
                            <h4 className="text-white font-medium mb-2">No Announcements Yet</h4>
                            <p className="text-gray-500 text-sm">Create your first announcement to notify freelancers</p>
                        </div>
                    ) : (
                        announcements.map(announcement => (
                            <div key={announcement._id} className="p-6 hover:bg-[#1E293B]/50 transition">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-white font-bold text-lg">{announcement.title}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                announcement.targetType === 'all' 
                                                    ? 'bg-blue-900/30 text-blue-400'
                                                    : 'bg-purple-900/30 text-purple-400'
                                            }`}>
                                                {announcement.targetType === 'all' ? 'All Freelancers' : announcement.project?.title || 'Project'}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 mb-3 whitespace-pre-wrap">{announcement.message}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Users size={14} />
                                                {announcement.totalRecipients} recipients
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={14} />
                                                {announcement.readCount} read
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {new Date(announcement.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onDeleteAnnouncement(announcement._id)}
                                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
