import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertTriangle, Camera, Clock, Shield, Send, CheckCircle, Monitor, Lock, Eye, Video, Mic, AlertCircle, ChevronRight, X } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AssessmentAttempt = ({ submission, assessment, onComplete }) => {
    // Pre-assessment state
    const [stage, setStage] = useState('instructions'); // 'instructions' | 'system-check' | 'ready' | 'assessment'
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [systemChecks, setSystemChecks] = useState({
        browser: false,
        camera: false,
        fullscreen: false,
        notifications: false
    });

    // Assessment state
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(assessment.timeLimit * 60);
    const [violations, setViolations] = useState(submission.violationCount || 0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDisqualified, setIsDisqualified] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    
    const videoRef = useRef(null);
    const assessmentVideoRef = useRef(null);
    const containerRef = useRef(null);
    const maxViolations = assessment.proctoring?.maxViolations || 3;

    const getAuthHeaders = () => ({
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    // ============ SYSTEM CHECKS ============
    const runSystemChecks = async () => {
        // Browser check
        const isChrome = /Chrome/.test(navigator.userAgent);
        const isEdge = /Edg/.test(navigator.userAgent);
        setSystemChecks(prev => ({ ...prev, browser: isChrome || isEdge }));

        // Request notification permission (to block them later)
        if ('Notification' in window) {
            await Notification.requestPermission();
            setSystemChecks(prev => ({ ...prev, notifications: true }));
        }

        // Camera check - always try to get camera
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setCameraStream(stream);
            setSystemChecks(prev => ({ ...prev, camera: true }));
        } catch (err) {
            console.error('Camera access denied:', err);
            // If camera not required, still pass
            if (!assessment.proctoring?.requireCamera) {
                setSystemChecks(prev => ({ ...prev, camera: true }));
            } else {
                setSystemChecks(prev => ({ ...prev, camera: false }));
            }
        }

        // Fullscreen check
        setSystemChecks(prev => ({ ...prev, fullscreen: document.fullscreenEnabled }));
    };

    // Assign camera stream to video element when stream or stage changes
    useEffect(() => {
        if (cameraStream) {
            // For system check screen
            if (videoRef.current) {
                videoRef.current.srcObject = cameraStream;
                videoRef.current.play().catch(err => console.log('Video play error:', err));
            }
            // For assessment screen
            if (assessmentVideoRef.current) {
                assessmentVideoRef.current.srcObject = cameraStream;
                assessmentVideoRef.current.play().catch(err => console.log('Assessment video play error:', err));
            }
        }
    }, [cameraStream, stage]);

    // ============ PROCTORING FUNCTIONS ============
    const logViolation = useCallback(async (type) => {
        try {
            const res = await api.post(`/api/assessments/submission/${submission._id}/violation`, { type }, getAuthHeaders());
            setViolations(res.data.violationCount);
            
            if (res.data.disqualified) {
                setIsDisqualified(true);
                toast.error('Assessment terminated due to policy violations.');
                setTimeout(() => onComplete(), 3000);
            } else {
                setWarningMessage(`⚠️ Policy Violation Detected: ${type.replace('_', ' ').toUpperCase()}\n\nRemaining warnings: ${res.data.remaining}`);
                setShowWarning(true);
                setTimeout(() => setShowWarning(false), 4000);
            }
        } catch (error) {
            console.error('Error logging violation:', error);
        }
    }, [submission._id, onComplete]);

    const enterFullscreen = useCallback(async () => {
        try {
            if (containerRef.current && document.fullscreenEnabled) {
                await containerRef.current.requestFullscreen();
                setIsFullscreen(true);
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
        }
    }, []);

    // Start the actual assessment
    const startAssessment = async () => {
        try {
            // Must enter fullscreen before starting
            if (containerRef.current && document.fullscreenEnabled) {
                await containerRef.current.requestFullscreen();
                setIsFullscreen(true);
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
            toast.error('Please allow fullscreen mode to continue');
            return; // Don't start if fullscreen fails
        }
        setStage('assessment');
    };

    // ============ PROCTORING LISTENERS ============
    useEffect(() => {
        if (stage !== 'assessment') return;
        
        // Always enable proctoring for now (can be made conditional later)
        const proctoringEnabled = true; // assessment.proctoring?.enabled

        if (!proctoringEnabled) return;

        // Immediately check and enforce fullscreen
        const enforceFullscreen = async () => {
            if (!document.fullscreenElement && containerRef.current) {
                try {
                    await containerRef.current.requestFullscreen();
                    setIsFullscreen(true);
                } catch (error) {
                    console.error('Failed to enter fullscreen:', error);
                }
            }
        };

        // Run immediately
        enforceFullscreen();

        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.log('Tab switch detected!');
                logViolation('tab_switch');
            }
        };

        const handleBlur = () => {
            console.log('Window blur detected!');
            // Only log if we're in assessment stage
            if (stage === 'assessment') {
                logViolation('window_blur');
            }
        };

        const handleFocus = () => {
            // When window regains focus, try to re-enter fullscreen
            enforceFullscreen();
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                console.log('Fullscreen exit detected!');
                setIsFullscreen(false);
                logViolation('fullscreen_exit');
                // Immediately try to re-enter fullscreen
                setTimeout(enforceFullscreen, 100);
            } else {
                setIsFullscreen(true);
            }
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };
        
        const handleKeyDown = (e) => {
            // Block common exit shortcuts
            const blockedKeys = ['Escape', 'F11'];
            const blockedCtrlKeys = ['Tab', 'w', 't', 'n', 'r', 'f5'];
            const blockedAltKeys = ['Tab', 'F4'];
            
            if (blockedKeys.includes(e.key) || 
                (e.ctrlKey && blockedCtrlKeys.includes(e.key.toLowerCase())) ||
                (e.altKey && blockedAltKeys.includes(e.key))) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Blocked shortcut detected:', e.key);
                logViolation('blocked_shortcut');
                return false;
            }
        };

        // Block copy/paste/cut
        const handleCopy = (e) => { e.preventDefault(); return false; };
        const handlePaste = (e) => { e.preventDefault(); return false; };
        const handleCut = (e) => { e.preventDefault(); return false; };

        // Block devtools
        const handleDevTools = (e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))) {
                e.preventDefault();
                logViolation('devtools_attempt');
                return false;
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('keydown', handleDevTools, true);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('cut', handleCut);

        // Periodic fullscreen check
        const fullscreenChecker = setInterval(() => {
            if (!document.fullscreenElement && stage === 'assessment') {
                enforceFullscreen();
            }
        }, 2000);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('keydown', handleDevTools, true);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('cut', handleCut);
            clearInterval(fullscreenChecker);
        };
    }, [stage, logViolation]);

    // Timer
    useEffect(() => {
        if (stage !== 'assessment') return;
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [stage, timeLeft]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        };
    }, [cameraStream]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionIndex, answer) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
            if (document.fullscreenElement) {
                await document.exitFullscreen().catch(() => {});
            }

            const formattedAnswers = Object.entries(answers).map(([index, answer]) => ({
                questionIndex: parseInt(index),
                answer
            }));

            const res = await api.post(
                `/api/assessments/submission/${submission._id}/submit`,
                { answers: formattedAnswers },
                getAuthHeaders()
            );

            toast.success(`Assessment submitted! Score: ${res.data.submission.percentage}%`);
            onComplete();
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Failed to submit assessment');
            setIsSubmitting(false);
        }
    };

    // ============ INSTRUCTIONS SCREEN ============
    if (stage === 'instructions') {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 overflow-auto">
                <div className="max-w-4xl mx-auto p-6 md:p-12">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 rounded-full mb-4">
                            <Shield className="text-indigo-400" size={20} />
                            <span className="text-indigo-300 font-semibold">Secure Assessment Environment</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{assessment.title}</h1>
                        <p className="text-gray-400">Please read the following instructions carefully before proceeding</p>
                    </div>

                    {/* Assessment Info Card */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Clock size={20} className="text-blue-400" /> Assessment Overview
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="bg-slate-900/50 rounded-xl p-4">
                                <div className="text-2xl font-bold text-white">{assessment.questions?.length || 0}</div>
                                <div className="text-xs text-gray-400">Questions</div>
                            </div>
                            <div className="bg-slate-900/50 rounded-xl p-4">
                                <div className="text-2xl font-bold text-white">{assessment.timeLimit}</div>
                                <div className="text-xs text-gray-400">Minutes</div>
                            </div>
                            <div className="bg-slate-900/50 rounded-xl p-4">
                                <div className="text-2xl font-bold text-white">{assessment.passingScore}%</div>
                                <div className="text-xs text-gray-400">Passing Score</div>
                            </div>
                            <div className="bg-slate-900/50 rounded-xl p-4">
                                <div className="text-2xl font-bold text-white">{maxViolations}</div>
                                <div className="text-xs text-gray-400">Max Warnings</div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <AlertCircle size={20} className="text-yellow-400" /> Important Instructions
                        </h2>
                        <div className="space-y-3 text-gray-300">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-white">1</span>
                                </div>
                                <p>This is a <strong className="text-white">proctored assessment</strong>. Your screen activity will be monitored throughout the test.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-white">2</span>
                                </div>
                                <p>The assessment will run in <strong className="text-white">fullscreen mode</strong>. Exiting fullscreen will be logged as a violation.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-white">3</span>
                                </div>
                                <p><strong className="text-white">Do NOT switch tabs</strong>, open new windows, or use keyboard shortcuts (Alt+Tab, Ctrl+Tab, etc.).</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-white">4</span>
                                </div>
                                <p>Your <strong className="text-white">camera will be active</strong> during the assessment for identity verification purposes.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-white">5</span>
                                </div>
                                <p>Exceeding <strong className="text-white">{maxViolations} violations</strong> will result in automatic disqualification.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-white">6</span>
                                </div>
                                <p>Ensure a <strong className="text-white">stable internet connection</strong> before starting. The timer cannot be paused.</p>
                            </div>
                        </div>
                    </div>

                    {/* Prohibited Actions */}
                    <div className="bg-red-900/20 border border-red-800/50 rounded-2xl p-6 mb-6">
                        <h2 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                            <X size={20} /> Prohibited Actions
                        </h2>
                        <div className="grid md:grid-cols-2 gap-3 text-red-300 text-sm">
                            <div className="flex items-center gap-2">
                                <X size={14} /> Switching browser tabs or windows
                            </div>
                            <div className="flex items-center gap-2">
                                <X size={14} /> Using keyboard shortcuts to navigate away
                            </div>
                            <div className="flex items-center gap-2">
                                <X size={14} /> Opening developer tools
                            </div>
                            <div className="flex items-center gap-2">
                                <X size={14} /> Copying or pasting content
                            </div>
                            <div className="flex items-center gap-2">
                                <X size={14} /> Taking screenshots
                            </div>
                            <div className="flex items-center gap-2">
                                <X size={14} /> Using external assistance
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
                        <h2 className="text-lg font-bold text-white mb-4">Terms & Conditions</h2>
                        <div className="bg-slate-900/50 rounded-xl p-4 max-h-40 overflow-y-auto text-sm text-gray-400 mb-4">
                            <p className="mb-3">By proceeding with this assessment, I acknowledge and agree to the following:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>I will complete this assessment independently without any external assistance or collaboration.</li>
                                <li>I understand that my screen activity and camera feed may be recorded for proctoring purposes.</li>
                                <li>I will not use any unauthorized materials, websites, or applications during the assessment.</li>
                                <li>I understand that any violation of the assessment policies may result in disqualification.</li>
                                <li>I confirm that I am the authorized person taking this assessment.</li>
                                <li>I agree to maintain academic integrity throughout the assessment process.</li>
                            </ul>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="w-4 h-4 accent-indigo-600 rounded"
                            />
                            <span className="text-white text-sm">I have read and agree to the terms and conditions</span>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onComplete}
                            className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { runSystemChecks(); setStage('system-check'); }}
                            disabled={!agreedToTerms}
                            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                            Continue <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ============ SYSTEM CHECK SCREEN ============
    if (stage === 'system-check') {
        const allChecksPass = systemChecks.browser && systemChecks.camera && systemChecks.fullscreen && systemChecks.notifications;
        
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 overflow-auto">
                <div className="max-w-2xl mx-auto p-6 md:p-12">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">System Compatibility Check</h1>
                        <p className="text-gray-400">Verifying your system meets the requirements for a proctored assessment</p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6 space-y-4">
                        {/* Browser Check */}
                        <div className={`flex items-center justify-between p-4 rounded-xl ${systemChecks.browser ? 'bg-green-900/20 border border-green-800/50' : 'bg-red-900/20 border border-red-800/50'}`}>
                            <div className="flex items-center gap-3">
                                <Monitor size={24} className={systemChecks.browser ? 'text-green-400' : 'text-red-400'} />
                                <div>
                                    <div className="font-bold text-white">Browser Compatibility</div>
                                    <div className="text-sm text-gray-400">Chrome or Edge required</div>
                                </div>
                            </div>
                            {systemChecks.browser ? (
                                <CheckCircle className="text-green-400" size={24} />
                            ) : (
                                <AlertCircle className="text-red-400" size={24} />
                            )}
                        </div>

                        {/* Camera Check */}
                        <div className={`flex items-center justify-between p-4 rounded-xl ${systemChecks.camera ? 'bg-green-900/20 border border-green-800/50' : 'bg-red-900/20 border border-red-800/50'}`}>
                            <div className="flex items-center gap-3">
                                <Camera size={24} className={systemChecks.camera ? 'text-green-400' : 'text-red-400'} />
                                <div>
                                    <div className="font-bold text-white">Camera Access</div>
                                    <div className="text-sm text-gray-400">Required for proctoring</div>
                                </div>
                            </div>
                            {systemChecks.camera ? (
                                <CheckCircle className="text-green-400" size={24} />
                            ) : (
                                <AlertCircle className="text-red-400" size={24} />
                            )}
                        </div>

                        {/* Fullscreen Check */}
                        <div className={`flex items-center justify-between p-4 rounded-xl ${systemChecks.fullscreen ? 'bg-green-900/20 border border-green-800/50' : 'bg-red-900/20 border border-red-800/50'}`}>
                            <div className="flex items-center gap-3">
                                <Monitor size={24} className={systemChecks.fullscreen ? 'text-green-400' : 'text-red-400'} />
                                <div>
                                    <div className="font-bold text-white">Fullscreen Support</div>
                                    <div className="text-sm text-gray-400">Required for secure mode</div>
                                </div>
                            </div>
                            {systemChecks.fullscreen ? (
                                <CheckCircle className="text-green-400" size={24} />
                            ) : (
                                <AlertCircle className="text-red-400" size={24} />
                            )}
                        </div>

                        {/* Camera Preview */}
                        {cameraStream && (
                            <div className="mt-4">
                                <div className="text-sm text-gray-400 mb-2">Camera Preview</div>
                                <div className="bg-black rounded-xl overflow-hidden aspect-video max-w-xs mx-auto">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status Message */}
                    <div className={`text-center p-3 rounded-lg mb-4 ${allChecksPass ? 'bg-green-900/20 border border-green-800/50' : 'bg-yellow-900/20 border border-yellow-800/50'}`}>
                        {allChecksPass ? (
                            <p className="text-green-400 text-sm">✓ All checks passed. Ready to start!</p>
                        ) : (
                            <p className="text-yellow-400 text-sm">Some checks failed. Please resolve before continuing.</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setStage('instructions')}
                            className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={startAssessment}
                            disabled={!allChecksPass}
                            className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                            <Lock size={14} /> Start Assessment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ============ DISQUALIFIED SCREEN ============
    if (isDisqualified) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                <div className="text-center p-8">
                    <AlertTriangle size={64} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-red-500">Assessment Terminated</h2>
                    <p className="text-gray-400 mt-2">Your assessment has been terminated due to policy violations.</p>
                    <p className="text-gray-500 mt-4">Redirecting...</p>
                </div>
            </div>
        );
    }

    // ============ ASSESSMENT SCREEN ============
    return (
        <div ref={containerRef} className="fixed inset-0 bg-slate-900 z-50 overflow-hidden flex flex-col">
            {/* Warning Overlay */}
            {showWarning && (
                <div className="fixed inset-0 bg-red-900/80 flex items-center justify-center z-[100] animate-pulse">
                    <div className="bg-red-950 border-2 border-red-500 rounded-2xl p-8 text-center max-w-md mx-4">
                        <AlertTriangle size={56} className="mx-auto text-red-400 mb-4" />
                        <p className="text-white font-bold text-lg whitespace-pre-line">{warningMessage}</p>
                    </div>
                </div>
            )}

            {/* Fullscreen Enforcement Overlay */}
            {!isFullscreen && stage === 'assessment' && (
                <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[99]">
                    <div className="bg-slate-900 border-2 border-red-500 rounded-2xl p-8 text-center max-w-lg mx-4">
                        <Monitor size={64} className="mx-auto text-red-400 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-4">⚠️ Fullscreen Required</h2>
                        <p className="text-gray-300 mb-6">
                            This assessment must be taken in fullscreen mode. 
                            Please click the button below to re-enter fullscreen mode.
                        </p>
                        <p className="text-red-400 text-sm mb-6">
                            Exiting fullscreen is logged as a violation. You have {violations}/{maxViolations} violations.
                        </p>
                        <button
                            onClick={async () => {
                                try {
                                    if (containerRef.current) {
                                        await containerRef.current.requestFullscreen();
                                        setIsFullscreen(true);
                                    }
                                } catch (err) {
                                    console.error('Fullscreen error:', err);
                                    toast.error('Failed to enter fullscreen. Please try again.');
                                }
                            }}
                            className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition flex items-center gap-2 mx-auto"
                        >
                            <Monitor size={20} /> Enter Fullscreen Mode
                        </button>
                    </div>
                </div>
            )}

            {/* Top Bar - Fixed */}
            <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Shield className="text-indigo-400" size={20} />
                        <span className="font-bold text-white hidden md:block">{assessment.title}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Timer */}
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg ${
                        timeLeft < 60 ? 'bg-red-900/50 text-red-400 animate-pulse' : 
                        timeLeft < 300 ? 'bg-yellow-900/50 text-yellow-400' : 
                        'bg-slate-700 text-white'
                    }`}>
                        <Clock size={18} />
                        {formatTime(timeLeft)}
                    </div>

                    {/* Violations */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        violations > 0 ? 'bg-red-900/50 text-red-400' : 'bg-slate-700 text-gray-400'
                    }`}>
                        <AlertTriangle size={16} />
                        <span className="font-medium">{violations}/{maxViolations}</span>
                    </div>

                    {/* Recording Indicator */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-900/50 rounded-lg">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-400 text-sm font-medium hidden md:block">REC</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Question Navigation - Left Sidebar */}
                <div className="w-20 md:w-24 bg-slate-800 border-r border-slate-700 p-2 overflow-y-auto flex-shrink-0">
                    <div className="grid grid-cols-2 gap-1">
                        {assessment.questions.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentQuestion(idx)}
                                className={`aspect-square rounded-lg font-bold text-sm ${
                                    currentQuestion === idx
                                        ? 'bg-indigo-600 text-white'
                                        : answers[idx] !== undefined
                                            ? 'bg-green-600/30 text-green-400 border border-green-600/50'
                                            : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                                }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-indigo-400 font-bold">
                                Question {currentQuestion + 1} of {assessment.questions.length}
                            </span>
                            <span className="text-sm text-gray-400 bg-slate-800 px-3 py-1 rounded-full">
                                {assessment.questions[currentQuestion].points} points
                            </span>
                        </div>

                        {/* Question Content */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
                            <p className="text-white text-lg font-medium mb-6">
                                {assessment.questions[currentQuestion].question}
                            </p>

                            {assessment.questions[currentQuestion].type === 'mcq' ? (
                                <div className="space-y-3">
                                    {assessment.questions[currentQuestion].options.map((option, optIdx) => (
                                        <label
                                            key={optIdx}
                                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                                                answers[currentQuestion] === optIdx
                                                    ? 'bg-indigo-900/30 border-indigo-500 text-indigo-200'
                                                    : 'bg-slate-700/50 border-slate-600 text-white hover:border-slate-500'
                                            }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                answers[currentQuestion] === optIdx
                                                    ? 'border-indigo-400 bg-indigo-600'
                                                    : 'border-gray-500'
                                            }`}>
                                                {answers[currentQuestion] === optIdx && (
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                )}
                                            </div>
                                            <span>{option}</span>
                                            <input
                                                type="radio"
                                                name={`q-${currentQuestion}`}
                                                checked={answers[currentQuestion] === optIdx}
                                                onChange={() => handleAnswerChange(currentQuestion, optIdx)}
                                                className="hidden"
                                            />
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <textarea
                                    value={answers[currentQuestion] || ''}
                                    onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                                    className="w-full h-40 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white outline-none focus:border-indigo-500 resize-none"
                                    placeholder="Type your answer here..."
                                />
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestion === 0}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            
                            {currentQuestion === assessment.questions.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    {isSubmitting ? '...' : <><Send size={14} /> Submit</>}
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQuestion(prev => Math.min(assessment.questions.length - 1, prev + 1))}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Camera Preview - Right Side */}
                {cameraStream && (
                    <div className="w-48 bg-slate-800 border-l border-slate-700 p-2 flex flex-col flex-shrink-0">
                        <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                            <Camera size={12} /> Camera Active
                        </div>
                        <div className="bg-black rounded-lg overflow-hidden aspect-[4/3]">
                            <video
                                ref={assessmentVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="mt-2 text-[10px] text-gray-500 text-center">
                            Your video is being recorded
                        </div>

                        {/* Proctoring Status */}
                        <div className="mt-4 space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-green-400">
                                <Eye size={12} /> Screen Monitoring Active
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <Video size={12} /> Video Recording Active
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <Lock size={12} /> Secure Mode Enabled
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Status Bar */}
            <div className="bg-slate-800 border-t border-slate-700 px-4 py-2 flex items-center justify-between text-sm flex-shrink-0">
                <div className="text-gray-400">
                    Answered: <span className="text-white font-medium">{Object.keys(answers).length}/{assessment.questions.length}</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                    <Shield size={14} />
                    Proctored Assessment - All activities are being monitored
                </div>
            </div>
        </div>
    );
};

export default AssessmentAttempt;
