import React, { useState, useEffect } from 'react';
import { Clock, Download, Play, CheckCircle, AlertCircle, XCircle, Shield, Monitor, Smartphone, FileText, Award, AlertTriangle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import AssessmentAttempt from './AssessmentAttempt';

const AssessmentSection = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeAttempt, setActiveAttempt] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
            const isMobileDevice = mobileRegex.test(userAgent.toLowerCase()) || window.innerWidth < 1024;
            setIsMobile(isMobileDevice);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const getAuthHeaders = () => ({
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    useEffect(() => {
        fetchAssessments();
    }, []);

    const fetchAssessments = async () => {
        try {
            const res = await api.get('/api/assessments/my-assessments', getAuthHeaders());
            setAssessments(res.data);
        } catch (error) {
            console.error('Error fetching assessments:', error);
            toast.error('Failed to load assessments');
        } finally {
            setLoading(false);
        }
    };

    const startAssessment = async (submission) => {
        if (isMobile) {
            toast.error('Please use a PC or laptop to take assessments');
            return;
        }
        try {
            const res = await api.post(`/api/assessments/submission/${submission._id}/start`, {}, getAuthHeaders());
            setActiveAttempt({
                submission: res.data.submission,
                assessment: res.data.assessment
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to start assessment');
        }
    };

    const handleAttemptComplete = () => {
        setActiveAttempt(null);
        fetchAssessments();
    };

    const downloadSOP = (url) => {
        const fullUrl = url.startsWith('http') ? url : `${window.location.origin.replace(':5173', ':5000')}${url}`;
        window.open(fullUrl, '_blank');
    };

    const formatTime = (mins) => mins >= 60 ? `${Math.floor(mins/60)}h ${mins%60}m` : `${mins}m`;

    if (activeAttempt) {
        return (
            <AssessmentAttempt
                submission={activeAttempt.submission}
                assessment={activeAttempt.assessment}
                onComplete={handleAttemptComplete}
            />
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-slate-400">Loading assessments...</span>
                </div>
            </div>
        );
    }

    // Stats calculation
    const stats = {
        total: assessments.length,
        completed: assessments.filter(s => s.status === 'completed').length,
        passed: assessments.filter(s => s.passed).length,
        pending: assessments.filter(s => s.status === 'assigned' || s.status === 'in_progress').length
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                    <h1 className="text-xl font-semibold text-white">My Assessments</h1>
                    <div className="flex items-center gap-2">
                        {isMobile && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-[10px] font-medium">
                                <Smartphone size={10} />
                                Mobile
                            </span>
                        )}
                        <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[10px]">
                            {stats.total} total
                        </span>
                    </div>
                </div>
                <p className="text-xs text-slate-500">Complete assessments to unlock project assignments</p>
            </div>

            {/* Mobile Warning Banner */}
            {isMobile && (
                <div className="mb-4 p-3 bg-gradient-to-r from-amber-900/30 to-orange-900/20 border border-amber-700/50 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-amber-500/20 rounded">
                            <Monitor size={14} className="text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold text-amber-300">Desktop Required</h3>
                            <p className="text-[11px] text-amber-400/70 mt-0.5">
                                Assessments require a PC or laptop for proctoring features. Please switch to a desktop device.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            {stats.total > 0 && (
                <div className="grid grid-cols-4 gap-3 mb-5">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-white">{stats.total}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">Total</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-400">{stats.pending}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">Pending</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-emerald-400">{stats.passed}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">Passed</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-slate-300">{stats.completed}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">Completed</div>
                    </div>
                </div>
            )}

            {/* Assessments List */}
            {assessments.length === 0 ? (
                <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-12 text-center">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={24} className="text-slate-500" />
                    </div>
                    <h3 className="text-sm font-medium text-white mb-1">No Assessments Yet</h3>
                    <p className="text-xs text-slate-500">Assessments will appear here when assigned to you.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {assessments.map(submission => {
                        const assessment = submission.assessment;
                        if (!assessment) return null;

                        const statusConfig = {
                            assigned: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: Clock, label: 'Ready to Start', dot: 'bg-blue-400' },
                            in_progress: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: Clock, label: 'In Progress', dot: 'bg-amber-400' },
                            completed: { 
                                bg: submission.passed ? 'bg-emerald-500/10' : 'bg-red-500/10', 
                                border: submission.passed ? 'border-emerald-500/20' : 'border-red-500/20',
                                text: submission.passed ? 'text-emerald-400' : 'text-red-400', 
                                icon: submission.passed ? CheckCircle : XCircle, 
                                label: submission.passed ? 'Passed' : 'Failed',
                                dot: submission.passed ? 'bg-emerald-400' : 'bg-red-400'
                            },
                            disqualified: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', icon: XCircle, label: 'Disqualified', dot: 'bg-red-400' }
                        };
                        const status = statusConfig[submission.status] || statusConfig.assigned;
                        const StatusIcon = status.icon;
                        const canStart = submission.status === 'assigned' || submission.status === 'in_progress';

                        return (
                            <div 
                                key={submission._id} 
                                className={`group relative bg-gradient-to-r from-slate-900/80 to-slate-900/40 border ${status.border} rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-600`}
                            >
                                {/* Status indicator line */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${status.dot}`}></div>
                                
                                <div className="p-4 pl-5">
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Title Row */}
                                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                                <h3 className="text-sm font-medium text-white">{assessment.title}</h3>
                                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${status.bg} ${status.text}`}>
                                                    <StatusIcon size={10} />
                                                    {status.label}
                                                </span>
                                                {assessment.proctoring?.enabled && (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-violet-500/10 text-violet-400">
                                                        <Shield size={10} />
                                                        Proctored
                                                    </span>
                                                )}
                                            </div>

                                            {/* Description */}
                                            {assessment.description && (
                                                <p className="text-[11px] text-slate-500 mb-2 line-clamp-1">{assessment.description}</p>
                                            )}

                                            {/* Meta info */}
                                            <div className="flex items-center gap-4 text-[11px]">
                                                <span className="flex items-center gap-1 text-slate-400">
                                                    <Clock size={11} className="text-slate-500" />
                                                    {formatTime(assessment.timeLimit)}
                                                </span>
                                                <span className="flex items-center gap-1 text-slate-400">
                                                    <Award size={11} className="text-slate-500" />
                                                    Pass: {assessment.passingScore}%
                                                </span>
                                                <span className="text-slate-500">
                                                    {assessment.questions?.length || 0} Questions
                                                </span>
                                                {submission.percentage > 0 && (
                                                    <span className={`font-semibold ${submission.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        Score: {submission.percentage}%
                                                    </span>
                                                )}
                                                {submission.violationCount > 0 && (
                                                    <span className="flex items-center gap-1 text-red-400">
                                                        <AlertTriangle size={10} />
                                                        {submission.violationCount} violations
                                                    </span>
                                                )}
                                            </div>

                                            {/* Materials */}
                                            {assessment.sopDocuments?.length > 0 && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] text-slate-600">Materials:</span>
                                                    {assessment.sopDocuments.map((url, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => downloadSOP(url)}
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded text-[10px] transition"
                                                        >
                                                            <Download size={10} />
                                                            Doc {i + 1}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <div className="flex-shrink-0">
                                            {canStart && (
                                                <button
                                                    onClick={() => startAssessment(submission)}
                                                    disabled={isMobile}
                                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                                        isMobile 
                                                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                                                            : submission.status === 'in_progress'
                                                                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20'
                                                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/40'
                                                    }`}
                                                >
                                                    {isMobile ? (
                                                        <>
                                                            <Monitor size={12} />
                                                            Desktop Only
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play size={12} />
                                                            {submission.status === 'in_progress' ? 'Continue' : 'Start'}
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                            {submission.status === 'completed' && (
                                                <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${status.bg} ${status.text}`}>
                                                    {submission.passed ? '✓ Passed' : '✗ Failed'}
                                                </div>
                                            )}
                                            {submission.status === 'disqualified' && (
                                                <div className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium">
                                                    Disqualified
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AssessmentSection;
