const Assessment = require('../models/Assessment');
const AssessmentSubmission = require('../models/AssessmentSubmission');
const User = require('../models/User');

// ============ ADMIN FUNCTIONS ============

// Create new assessment
exports.createAssessment = async (req, res) => {
    try {
        const { title, description, questions, sopDocuments, timeLimit, passingScore, proctoring } = req.body;

        const assessment = new Assessment({
            title,
            description,
            questions: questions || [],
            sopDocuments: sopDocuments || [],
            timeLimit: timeLimit || 30,
            passingScore: passingScore || 70,
            proctoring: proctoring || {},
            createdBy: req.user.id,
            status: 'draft'
        });

        await assessment.save();
        res.status(201).json(assessment);
    } catch (error) {
        console.error('Error creating assessment:', error);
        res.status(500).json({ message: 'Error creating assessment', error: error.message });
    }
};

// Get all assessments (admin)
exports.getAdminAssessments = async (req, res) => {
    try {
        const assessments = await Assessment.find()
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        // Get submission stats for each assessment
        const assessmentsWithStats = await Promise.all(assessments.map(async (assessment) => {
            const submissions = await AssessmentSubmission.find({ assessment: assessment._id });
            const completed = submissions.filter(s => s.status === 'completed').length;
            const inProgress = submissions.filter(s => s.status === 'in_progress').length;
            const passed = submissions.filter(s => s.passed).length;

            return {
                ...assessment.toObject(),
                stats: {
                    assigned: assessment.assignedTo.length,
                    completed,
                    inProgress,
                    passed
                }
            };
        }));

        res.json(assessmentsWithStats);
    } catch (error) {
        console.error('Error fetching assessments:', error);
        res.status(500).json({ message: 'Error fetching assessments' });
    }
};

// Update assessment
exports.updateAssessment = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const assessment = await Assessment.findByIdAndUpdate(id, updates, { new: true });
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        res.json(assessment);
    } catch (error) {
        console.error('Error updating assessment:', error);
        res.status(500).json({ message: 'Error updating assessment' });
    }
};

// Delete assessment
exports.deleteAssessment = async (req, res) => {
    try {
        const { id } = req.params;

        await Assessment.findByIdAndDelete(id);
        await AssessmentSubmission.deleteMany({ assessment: id });

        res.json({ message: 'Assessment deleted' });
    } catch (error) {
        console.error('Error deleting assessment:', error);
        res.status(500).json({ message: 'Error deleting assessment' });
    }
};

// Assign assessment to freelancers
exports.assignAssessment = async (req, res) => {
    try {
        const { id } = req.params;
        const { freelancerIds } = req.body;

        const assessment = await Assessment.findById(id);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        // Add new freelancers to assignedTo array
        const newAssignees = freelancerIds.filter(fid => !assessment.assignedTo.includes(fid));
        assessment.assignedTo.push(...newAssignees);
        assessment.status = 'active';
        await assessment.save();

        // Create submissions for new assignees
        for (const freelancerId of newAssignees) {
            const existingSubmission = await AssessmentSubmission.findOne({
                assessment: id,
                freelancer: freelancerId
            });

            if (!existingSubmission) {
                await AssessmentSubmission.create({
                    assessment: id,
                    freelancer: freelancerId,
                    status: 'assigned'
                });
            }
        }

        res.json({ message: `Assessment assigned to ${newAssignees.length} freelancers` });
    } catch (error) {
        console.error('Error assigning assessment:', error);
        res.status(500).json({ message: 'Error assigning assessment' });
    }
};

// Get submissions for an assessment (admin view)
exports.getAssessmentSubmissions = async (req, res) => {
    try {
        const { id } = req.params;

        const submissions = await AssessmentSubmission.find({ assessment: id })
            .populate('freelancer', 'name email')
            .sort({ submittedAt: -1 });

        res.json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Error fetching submissions' });
    }
};

// Reassign assessment to a freelancer (reset their submission)
exports.reassignSubmission = async (req, res) => {
    try {
        const { id } = req.params; // Submission ID

        const submission = await AssessmentSubmission.findById(id)
            .populate('freelancer', 'name email');

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Reset the submission
        submission.status = 'assigned';
        submission.answers = [];
        submission.score = 0;
        submission.percentage = 0;
        submission.passed = false;
        submission.violationCount = 0;
        submission.violations = [];
        submission.startedAt = null;
        submission.submittedAt = null;

        await submission.save();

        res.json({
            message: `Assessment reassigned to ${submission.freelancer?.name || 'freelancer'}`,
            submission
        });
    } catch (error) {
        console.error('Error reassigning submission:', error);
        res.status(500).json({ message: 'Error reassigning assessment' });
    }
};

// Grade subjective answers (admin)
exports.gradeSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { grades } = req.body; // [{ questionIndex, pointsEarned, isCorrect }]

        const submission = await AssessmentSubmission.findById(id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        const assessment = await Assessment.findById(submission.assessment);

        // Apply grades
        grades.forEach(grade => {
            const answer = submission.answers.find(a => a.questionIndex === grade.questionIndex);
            if (answer) {
                answer.isCorrect = grade.isCorrect;
                answer.pointsEarned = grade.pointsEarned;
            }
        });

        // Calculate total score
        const totalPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);
        const earnedPoints = submission.answers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
        submission.score = earnedPoints;
        submission.percentage = Math.round((earnedPoints / totalPoints) * 100);
        submission.passed = submission.percentage >= assessment.passingScore;
        submission.status = 'completed';

        await submission.save();
        res.json(submission);
    } catch (error) {
        console.error('Error grading submission:', error);
        res.status(500).json({ message: 'Error grading submission' });
    }
};

// ============ FREELANCER FUNCTIONS ============

// Get assigned assessments for freelancer
exports.getFreelancerAssessments = async (req, res) => {
    try {
        const userId = req.user.id;

        const submissions = await AssessmentSubmission.find({ freelancer: userId })
            .populate({
                path: 'assessment',
                select: 'title description timeLimit passingScore sopDocuments status proctoring'
            })
            .sort({ createdAt: -1 });

        res.json(submissions);
    } catch (error) {
        console.error('Error fetching freelancer assessments:', error);
        res.status(500).json({ message: 'Error fetching assessments' });
    }
};

// Start assessment attempt
exports.startAssessment = async (req, res) => {
    try {
        const { id } = req.params; // Submission ID

        const submission = await AssessmentSubmission.findById(id)
            .populate('assessment');

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        if (submission.freelancer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (submission.status === 'completed' || submission.status === 'disqualified') {
            return res.status(400).json({ message: 'Assessment already completed' });
        }

        // Mark as in progress
        submission.status = 'in_progress';
        submission.startedAt = new Date();
        await submission.save();

        // Return assessment with questions (without correct answers)
        const assessmentData = {
            ...submission.assessment.toObject(),
            questions: submission.assessment.questions.map(q => ({
                type: q.type,
                question: q.question,
                options: q.options,
                points: q.points
                // correctAnswer is NOT sent to frontend
            }))
        };

        res.json({
            submission: submission.toObject(),
            assessment: assessmentData
        });
    } catch (error) {
        console.error('Error starting assessment:', error);
        res.status(500).json({ message: 'Error starting assessment' });
    }
};

// Submit assessment answers
exports.submitAssessment = async (req, res) => {
    try {
        const { id } = req.params;
        const { answers = [] } = req.body; // [{ questionIndex, answer }]

        const submission = await AssessmentSubmission.findById(id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        if (submission.freelancer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const assessment = await Assessment.findById(submission.assessment);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        // Grade all questions - including unanswered ones
        let totalPoints = 0;
        let earnedPoints = 0;

        // Create answer map for quick lookup
        const answerMap = {};
        answers.forEach(ans => {
            answerMap[ans.questionIndex] = ans.answer;
        });

        // Grade each question
        const gradedAnswers = assessment.questions.map((question, index) => {
            totalPoints += question.points || 1;
            const userAnswer = answerMap[index];

            if (question.type === 'mcq') {
                const isCorrect = userAnswer !== undefined && userAnswer === question.correctAnswer;
                const points = isCorrect ? (question.points || 1) : 0;
                earnedPoints += points;
                return { questionIndex: index, answer: userAnswer, isCorrect, pointsEarned: points };
            } else {
                // Subjective answers need manual grading
                return { questionIndex: index, answer: userAnswer || '', isCorrect: null, pointsEarned: 0 };
            }
        });

        submission.answers = gradedAnswers;
        submission.submittedAt = new Date();
        submission.timeSpent = Math.floor((submission.submittedAt - submission.startedAt) / 1000);

        // Check if any subjective questions need grading
        const hasSubjective = assessment.questions.some(q => q.type === 'subjective');

        if (!hasSubjective) {
            // All MCQ - calculate final score
            submission.score = earnedPoints;
            submission.percentage = Math.round((earnedPoints / totalPoints) * 100);
            submission.passed = submission.percentage >= assessment.passingScore;
            submission.status = 'completed';
        } else {
            // Has subjective - needs manual grading
            submission.status = 'completed'; // Mark as completed, admin will grade
        }

        await submission.save();

        res.json({
            message: 'Assessment submitted successfully',
            submission: {
                status: submission.status,
                score: submission.score,
                percentage: submission.percentage,
                passed: submission.passed,
                timeSpent: submission.timeSpent,
                violationCount: submission.violationCount
            }
        });
    } catch (error) {
        console.error('Error submitting assessment:', error);
        res.status(500).json({ message: 'Error submitting assessment' });
    }
};

// Log proctoring violation
exports.logViolation = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;

        const submission = await AssessmentSubmission.findById(id)
            .populate('assessment');

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        submission.violations.push({ type, timestamp: new Date() });
        submission.violationCount = submission.violations.length;

        // Check if max violations exceeded
        const maxViolations = submission.assessment.proctoring?.maxViolations || 3;
        if (submission.violationCount >= maxViolations) {
            submission.status = 'disqualified';
            await submission.save();
            return res.json({
                message: 'Maximum violations exceeded. Assessment disqualified.',
                disqualified: true,
                violationCount: submission.violationCount
            });
        }

        await submission.save();
        res.json({
            violationCount: submission.violationCount,
            remaining: maxViolations - submission.violationCount
        });
    } catch (error) {
        console.error('Error logging violation:', error);
        res.status(500).json({ message: 'Error logging violation' });
    }
};

// Upload SOP document
exports.uploadSOP = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `/uploads/sop/${req.file.filename}`;
        res.json({ url: fileUrl });
    } catch (error) {
        console.error('Error uploading SOP:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
};
