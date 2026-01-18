import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Users, FileText, Upload, Clock, CheckCircle, AlertCircle, Eye, Download, Shield } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AssessmentManager = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [showSubmissions, setShowSubmissions] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    const [users, setUsers] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        timeLimit: 30,
        passingScore: 70,
        questions: [],
        sopDocuments: [],
        proctoring: {
            enabled: true,
            allowTabSwitch: false,
            maxViolations: 3,
            requireCamera: true
        }
    });

    // Question builder state
    const [newQuestion, setNewQuestion] = useState({
        type: 'mcq',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 1
    });

    const getAuthHeaders = () => ({
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    useEffect(() => {
        fetchAssessments();
        fetchUsers();
    }, []);

    const fetchAssessments = async () => {
        try {
            const res = await api.get('/api/assessments/admin', getAuthHeaders());
            setAssessments(res.data);
        } catch (error) {
            toast.error('Failed to load assessments');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/admin/users', getAuthHeaders());
            setUsers(res.data.filter(u => u.role === 'freelancer'));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            timeLimit: 30,
            passingScore: 70,
            questions: [],
            sopDocuments: [],
            proctoring: { enabled: true, allowTabSwitch: false, maxViolations: 3, requireCamera: true }
        });
        setNewQuestion({ type: 'mcq', question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 });
        setEditingAssessment(null);
        setShowForm(false);
    };

    const handleAddQuestion = () => {
        if (!newQuestion.question.trim()) {
            toast.error('Question text is required');
            return;
        }

        if (newQuestion.type === 'mcq' && newQuestion.options.filter(o => o.trim()).length < 2) {
            toast.error('At least 2 options required for MCQ');
            return;
        }

        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, { ...newQuestion, options: newQuestion.options.filter(o => o.trim()) }]
        }));
        setNewQuestion({ type: 'mcq', question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 });
    };

    const handleRemoveQuestion = (index) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const handleSOPUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('sop', file);

        try {
            const res = await api.post('/api/assessments/upload-sop', formDataUpload, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormData(prev => ({
                ...prev,
                sopDocuments: [...prev.sopDocuments, { name: file.name, url: res.data.url }]
            }));
            toast.success('SOP uploaded');
        } catch (error) {
            toast.error('Failed to upload SOP');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        try {
            const payload = {
                ...formData,
                sopDocuments: formData.sopDocuments.map(d => d.url || d)
            };

            if (editingAssessment) {
                await api.put(`/api/assessments/${editingAssessment._id}`, payload, getAuthHeaders());
                toast.success('Assessment updated');
            } else {
                await api.post('/api/assessments', payload, getAuthHeaders());
                toast.success('Assessment created');
            }
            fetchAssessments();
            resetForm();
        } catch (error) {
            toast.error('Failed to save assessment');
        }
    };

    const handleEdit = (assessment) => {
        setEditingAssessment(assessment);
        setFormData({
            title: assessment.title,
            description: assessment.description || '',
            timeLimit: assessment.timeLimit,
            passingScore: assessment.passingScore,
            questions: assessment.questions || [],
            sopDocuments: assessment.sopDocuments?.map(url => ({ name: url.split('/').pop(), url })) || [],
            proctoring: assessment.proctoring || { enabled: true, allowTabSwitch: false, maxViolations: 3, requireCamera: true }
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this assessment?')) return;
        try {
            await api.delete(`/api/assessments/${id}`, getAuthHeaders());
            toast.success('Assessment deleted');
            fetchAssessments();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const openAssignModal = (assessment) => {
        setSelectedAssessment(assessment);
        setShowAssignModal(true);
    };

    const handleAssign = async (freelancerIds) => {
        try {
            await api.post(`/api/assessments/${selectedAssessment._id}/assign`, { freelancerIds }, getAuthHeaders());
            toast.success('Assessment assigned');
            fetchAssessments();
            setShowAssignModal(false);
        } catch (error) {
            toast.error('Failed to assign');
        }
    };

    const viewSubmissions = async (assessment) => {
        setSelectedAssessment(assessment);
        try {
            const res = await api.get(`/api/assessments/${assessment._id}/submissions`, getAuthHeaders());
            setSubmissions(res.data);
            setShowSubmissions(true);
        } catch (error) {
            toast.error('Failed to load submissions');
        }
    };

    const downloadSEBConfig = async (assessment) => {
        try {
            const response = await api.get(`/api/assessments/${assessment._id}/seb-config`, {
                ...getAuthHeaders(),
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'application/x-seb' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${assessment.title.replace(/[^a-z0-9]/gi, '_')}_SEB.seb`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success('SEB config downloaded!');
        } catch (error) {
            toast.error('Failed to generate SEB config');
        }
    };

    if (loading) return <div className="text-white text-center py-20">Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Assessments</h2>
                    <p className="text-gray-400 text-sm mt-1">Create and manage freelancer assessments</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
                >
                    <Plus size={18} /> New Assessment
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-[#0A0F1C] border border-gray-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">
                            {editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}
                        </h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-white"><X size={20} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-white mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white outline-none focus:border-indigo-500"
                                    placeholder="e.g., Data Annotation Assessment"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-white mb-2">Time Limit (min)</label>
                                    <input
                                        type="number"
                                        value={formData.timeLimit}
                                        onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                                        className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-white mb-2">Passing Score (%)</label>
                                    <input
                                        type="number"
                                        value={formData.passingScore}
                                        onChange={(e) => setFormData(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                                        className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-white mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white outline-none focus:border-indigo-500 resize-none"
                                rows={2}
                                placeholder="Brief description of the assessment..."
                            />
                        </div>

                        {/* SOP Documents */}
                        <div>
                            <label className="block text-sm font-bold text-white mb-2">SOP Documents</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.sopDocuments.map((doc, i) => (
                                    <span key={i} className="flex items-center gap-2 bg-blue-900/30 text-blue-300 px-3 py-1 rounded text-sm">
                                        <FileText size={14} />
                                        {doc.name || doc.split('/').pop()}
                                        <button type="button" onClick={() => setFormData(prev => ({
                                            ...prev,
                                            sopDocuments: prev.sopDocuments.filter((_, idx) => idx !== i)
                                        }))} className="hover:text-red-400"><X size={12} /></button>
                                    </span>
                                ))}
                            </div>
                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700 w-fit">
                                <Upload size={16} /> Upload SOP
                                <input type="file" accept=".pdf,.doc,.docx,.txt,.ppt,.pptx" onChange={handleSOPUpload} className="hidden" />
                            </label>
                        </div>

                        {/* Questions */}
                        <div>
                            <label className="block text-sm font-bold text-white mb-3">Questions ({formData.questions.length})</label>
                            {formData.questions.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    {formData.questions.map((q, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-[#1E293B] p-3 rounded-lg border border-gray-700">
                                            <span className="text-indigo-400 font-bold">Q{idx + 1}</span>
                                            <div className="flex-1">
                                                <span className="text-white">{q.question}</span>
                                                <span className="ml-2 text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">{q.type.toUpperCase()}</span>
                                                <span className="ml-2 text-xs text-green-400">{q.points} pts</span>
                                            </div>
                                            <button type="button" onClick={() => handleRemoveQuestion(idx)} className="text-red-400 hover:text-red-300">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Question Form */}
                            <div className="border border-dashed border-gray-700 rounded-xl p-4 bg-black/30">
                                <label className="block text-sm font-bold text-indigo-400 mb-4">+ Add Question</label>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <select
                                            value={newQuestion.type}
                                            onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value }))}
                                            className="px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm outline-none"
                                        >
                                            <option value="mcq">MCQ</option>
                                            <option value="subjective">Subjective</option>
                                        </select>
                                        <input
                                            type="number"
                                            value={newQuestion.points}
                                            onChange={(e) => setNewQuestion(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                                            className="px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm outline-none"
                                            placeholder="Points"
                                            min="1"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={newQuestion.question}
                                        onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm outline-none"
                                        placeholder="Enter question text..."
                                    />
                                    {newQuestion.type === 'mcq' && (
                                        <div className="grid grid-cols-2 gap-2">
                                            {newQuestion.options.map((opt, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="correctAnswer"
                                                        checked={newQuestion.correctAnswer === i}
                                                        onChange={() => setNewQuestion(prev => ({ ...prev, correctAnswer: i }))}
                                                        className="accent-green-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={opt}
                                                        onChange={(e) => {
                                                            const newOpts = [...newQuestion.options];
                                                            newOpts[i] = e.target.value;
                                                            setNewQuestion(prev => ({ ...prev, options: newOpts }));
                                                        }}
                                                        className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm outline-none"
                                                        placeholder={`Option ${i + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleAddQuestion}
                                        className="px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg text-sm font-bold hover:bg-indigo-600/30"
                                    >
                                        + Add This Question
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Proctoring Settings */}
                        <div className="bg-[#1E293B] p-4 rounded-xl">
                            <label className="block text-sm font-bold text-white mb-3">Proctoring Settings</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.proctoring.enabled}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            proctoring: { ...prev.proctoring, enabled: e.target.checked }
                                        }))}
                                        className="accent-indigo-600"
                                    />
                                    Enable Proctoring
                                </label>
                                <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.proctoring.requireCamera}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            proctoring: { ...prev.proctoring, requireCamera: e.target.checked }
                                        }))}
                                        className="accent-indigo-600"
                                    />
                                    Require Camera
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-sm">Max Violations:</span>
                                    <input
                                        type="number"
                                        value={formData.proctoring.maxViolations}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            proctoring: { ...prev.proctoring, maxViolations: parseInt(e.target.value) }
                                        }))}
                                        className="w-16 px-2 py-1 bg-black border border-gray-700 rounded text-white text-sm outline-none"
                                        min="1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2"
                            >
                                <Save size={18} /> {editingAssessment ? 'Update' : 'Save'} Assessment
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Assessment List */}
            <div className="bg-[#0A0F1C] border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h3 className="font-bold text-white">All Assessments ({assessments.length})</h3>
                </div>

                {assessments.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No assessments yet. Create your first one!
                    </div>
                ) : (
                    <div className="divide-y divide-gray-800">
                        {assessments.map(assessment => (
                            <div key={assessment._id} className="p-6 hover:bg-[#1E293B]/50 transition">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-white font-bold text-lg">{assessment.title}</h4>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                assessment.status === 'active' ? 'bg-green-900/30 text-green-400' :
                                                assessment.status === 'draft' ? 'bg-yellow-900/30 text-yellow-400' :
                                                'bg-gray-800 text-gray-400'
                                            }`}>{assessment.status?.toUpperCase()}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1">{assessment.description || 'No description'}</p>
                                        <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                            <span className="text-gray-400"><Clock size={14} className="inline mr-1" />{assessment.timeLimit} min</span>
                                            <span className="text-gray-400">{assessment.questions?.length || 0} questions</span>
                                            <span className="text-blue-400"><Users size={14} className="inline mr-1" />{assessment.stats?.assigned || 0} assigned</span>
                                            <span className="text-green-400"><CheckCircle size={14} className="inline mr-1" />{assessment.stats?.completed || 0} completed</span>
                                            <span className="text-purple-400">{assessment.stats?.passed || 0} passed</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openAssignModal(assessment)} className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition" title="Assign">
                                            <Users size={18} />
                                        </button>
                                        <button onClick={() => viewSubmissions(assessment)} className="p-2 text-purple-400 hover:bg-purple-900/20 rounded-lg transition" title="View Submissions">
                                            <Eye size={18} />
                                        </button>
                                        <button onClick={() => handleEdit(assessment)} className="p-2 text-white hover:bg-gray-700 rounded-lg transition" title="Edit">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => downloadSEBConfig(assessment)} className="p-2 text-green-400 hover:bg-green-900/20 rounded-lg transition" title="Download SEB Config">
                                            <Shield size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(assessment._id)} className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Assign Modal */}
            {showAssignModal && (
                <AssignModal
                    users={users}
                    assessment={selectedAssessment}
                    onAssign={handleAssign}
                    onClose={() => setShowAssignModal(false)}
                />
            )}

            {/* Submissions Modal */}
            {showSubmissions && (
                <SubmissionsModal
                    assessment={selectedAssessment}
                    submissions={submissions}
                    onClose={() => setShowSubmissions(false)}
                    onReassign={() => viewSubmissions(selectedAssessment)}
                />
            )}
        </div>
    );
};

// Professional Assign Modal Component with Search and Multi-Select
const AssignModal = ({ users, assessment, onAssign, onClose }) => {
    const [selected, setSelected] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(true);
    const [reassigning, setReassigning] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showOnlyUnassigned, setShowOnlyUnassigned] = useState(false);
    const alreadyAssigned = assessment.assignedTo?.map(u => u._id || u) || [];

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await api.get(`/api/assessments/${assessment._id}/submissions`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setSubmissions(res.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoadingSubmissions(false);
        }
    };

    const getSubmissionForUser = (userId) => {
        return submissions.find(s => s.freelancer?._id === userId || s.freelancer === userId);
    };

    // Filter users based on search and filter settings
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const isUnassigned = !alreadyAssigned.includes(user._id);
        return matchesSearch && (showOnlyUnassigned ? isUnassigned : true);
    });

    const unassignedUsers = filteredUsers.filter(u => !alreadyAssigned.includes(u._id));

    const toggleSelect = (userId) => {
        setSelected(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const selectAllUnassigned = () => {
        const allUnassignedIds = unassignedUsers.map(u => u._id);
        setSelected(allUnassignedIds);
    };

    const clearSelection = () => setSelected([]);

    const handleReassign = async (submissionId, freelancerName) => {
        if (!window.confirm(`Reassign to ${freelancerName}?`)) return;
        
        setReassigning(submissionId);
        try {
            await api.post(`/api/assessments/submission/${submissionId}/reassign`, {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success(`Reassigned to ${freelancerName}`);
            fetchSubmissions();
        } catch (error) {
            toast.error('Failed to reassign');
        } finally {
            setReassigning(null);
        }
    };

    const getStatusBadge = (submission) => {
        if (!submission) return null;
        const configs = {
            assigned: { bg: 'bg-slate-600/40', text: 'text-slate-300', label: 'Pending' },
            in_progress: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'In Progress' },
            completed: submission?.passed 
                ? { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: `✓ ${submission.percentage}%` }
                : { bg: 'bg-red-500/20', text: 'text-red-400', label: `✗ ${submission.percentage}%` },
            disqualified: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'DQ' }
        };
        const c = configs[submission.status] || configs.assigned;
        return <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${c.bg} ${c.text}`}>{c.label}</span>;
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-semibold text-white">Assign Assessment</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[250px]">{assessment.title}</p>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg transition">
                            <X size={16} className="text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="px-4 py-2 border-b border-slate-700/30 bg-slate-800/30">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search freelancers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                        />
                        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showOnlyUnassigned}
                                onChange={(e) => setShowOnlyUnassigned(e.target.checked)}
                                className="w-3 h-3 accent-indigo-500"
                            />
                            <span className="text-[10px] text-slate-400">Unassigned only</span>
                        </label>
                        <div className="flex gap-2">
                            <button onClick={selectAllUnassigned} className="text-[10px] text-indigo-400 hover:text-indigo-300">Select All</button>
                            <button onClick={clearSelection} className="text-[10px] text-slate-400 hover:text-slate-300">Clear</button>
                        </div>
                    </div>
                </div>

                {/* User List */}
                <div className="max-h-64 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 text-xs">No freelancers found</div>
                    ) : (
                        <div className="divide-y divide-slate-800/50">
                            {filteredUsers.map(user => {
                                const isAssigned = alreadyAssigned.includes(user._id);
                                const submission = getSubmissionForUser(user._id);
                                const canReassign = submission && ['completed', 'disqualified', 'in_progress'].includes(submission.status);
                                const isSelected = selected.includes(user._id);

                                return (
                                    <div
                                        key={user._id}
                                        className={`flex items-center gap-2 px-4 py-2 transition hover:bg-slate-800/30 ${
                                            isSelected ? 'bg-indigo-900/20' : ''
                                        }`}
                                    >
                                        {!isAssigned && (
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelect(user._id)}
                                                className="w-3.5 h-3.5 accent-indigo-500 cursor-pointer"
                                            />
                                        )}
                                        <div className={`flex-1 min-w-0 ${isAssigned ? 'ml-5' : ''}`}>
                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-xs font-medium truncate ${isAssigned ? 'text-slate-400' : 'text-white'}`}>
                                                    {user.name}
                                                </span>
                                                {getStatusBadge(submission)}
                                            </div>
                                            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                                        </div>
                                        {canReassign && (
                                            <button
                                                onClick={() => handleReassign(submission._id, user.name)}
                                                disabled={reassigning === submission._id}
                                                className="px-2 py-1 text-[10px] font-medium text-blue-400 bg-blue-500/10 rounded hover:bg-blue-500/20 transition disabled:opacity-50"
                                            >
                                                {reassigning === submission._id ? '...' : '↺'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-slate-700/50 bg-slate-800/30 flex items-center gap-2">
                    <button
                        onClick={() => onAssign(selected)}
                        disabled={selected.length === 0}
                        className="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-semibold rounded-lg transition disabled:cursor-not-allowed"
                    >
                        Assign {selected.length > 0 && `(${selected.length})`}
                    </button>
                    <button 
                        onClick={onClose} 
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium rounded-lg transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// Professional Submissions Modal Component
const SubmissionsModal = ({ assessment, submissions, onClose, onReassign }) => {
    const [reassigning, setReassigning] = useState(null);

    const handleReassign = async (submissionId, freelancerName) => {
        if (!window.confirm(`Reassign to ${freelancerName}?`)) return;
        
        setReassigning(submissionId);
        try {
            await api.post(`/api/assessments/submission/${submissionId}/reassign`, {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success(`Reassigned to ${freelancerName}`);
            if (onReassign) onReassign();
        } catch (error) {
            toast.error('Failed to reassign');
        } finally {
            setReassigning(null);
        }
    };

    const getStatusBadge = (status, passed) => {
        const configs = {
            assigned: { bg: 'bg-slate-600/30', text: 'text-slate-300', label: 'Pending' },
            in_progress: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Active' },
            completed: passed 
                ? { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Passed' }
                : { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Failed' },
            disqualified: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'DQ' }
        };
        const c = configs[status] || configs.assigned;
        return <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${c.bg} ${c.text}`}>{c.label}</span>;
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/50 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-semibold text-white">Submissions</h3>
                        <p className="text-[11px] text-slate-400 truncate max-w-[350px]">{assessment.title}</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg transition">
                        <X size={16} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[400px] overflow-y-auto">
                    {submissions.length === 0 ? (
                        <div className="py-12 text-center text-slate-500 text-xs">No submissions yet</div>
                    ) : (
                        <table className="w-full text-xs">
                            <thead className="bg-slate-800/50 sticky top-0">
                                <tr className="text-left text-slate-400 text-[10px] uppercase tracking-wider">
                                    <th className="px-4 py-2 font-medium">Freelancer</th>
                                    <th className="px-3 py-2 font-medium">Status</th>
                                    <th className="px-3 py-2 font-medium">Score</th>
                                    <th className="px-3 py-2 font-medium">Violations</th>
                                    <th className="px-3 py-2 font-medium">Date</th>
                                    <th className="px-3 py-2 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {submissions.map(sub => (
                                    <tr key={sub._id} className="hover:bg-slate-800/30 transition">
                                        <td className="px-4 py-2.5">
                                            <div className="text-white font-medium">{sub.freelancer?.name}</div>
                                            <div className="text-[10px] text-slate-500">{sub.freelancer?.email}</div>
                                        </td>
                                        <td className="px-3 py-2.5">{getStatusBadge(sub.status, sub.passed)}</td>
                                        <td className="px-3 py-2.5">
                                            <span className={`font-semibold ${sub.passed ? 'text-emerald-400' : 'text-white'}`}>
                                                {sub.percentage || 0}%
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className={sub.violationCount > 0 ? 'text-red-400' : 'text-slate-500'}>
                                                {sub.violationCount || 0}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-slate-500 text-[10px]">
                                            {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-3 py-2.5">
                                            {['completed', 'disqualified', 'in_progress'].includes(sub.status) && (
                                                <button
                                                    onClick={() => handleReassign(sub._id, sub.freelancer?.name)}
                                                    disabled={reassigning === sub._id}
                                                    className="px-2 py-1 text-[10px] font-medium text-blue-400 bg-blue-500/10 rounded hover:bg-blue-500/20 transition disabled:opacity-50"
                                                >
                                                    {reassigning === sub._id ? '...' : '↺'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-slate-700/50 bg-slate-800/30 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</span>
                    <button 
                        onClick={onClose} 
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium rounded-lg transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssessmentManager;
