const Notification = require('../models/Notification');
const User = require('../models/User');
const Project = require('../models/Project');

// ==================== ADMIN FUNCTIONS ====================

// Create a new announcement
const createAnnouncement = async (req, res) => {
    try {
        const { title, message, targetType, projectId } = req.body;

        if (!title || !message) {
            return res.status(400).json({ message: 'Title and message are required' });
        }

        let recipients = [];
        let project = null;

        if (targetType === 'project' && projectId) {
            // Get freelancers assigned to this project
            project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
            // Combine legacy freelancer field and new freelancers array
            recipients = [
                ...(project.freelancer ? [project.freelancer] : []),
                ...(project.freelancers || [])
            ];
        } else {
            // Target all freelancers
            const freelancers = await User.find({ role: 'freelancer' }).select('_id');
            recipients = freelancers.map(f => f._id);
        }

        const notification = new Notification({
            title,
            message,
            type: 'announcement',
            sender: req.user._id,
            recipients,
            project: project?._id,
            targetType: targetType || 'all'
        });

        await notification.save();

        // Populate sender info for response
        await notification.populate('sender', 'name email');
        if (notification.project) {
            await notification.populate('project', 'title');
        }

        res.status(201).json({
            message: 'Announcement created successfully',
            notification
        });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all announcements (admin view)
const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Notification.find({ type: 'announcement' })
            .populate('sender', 'name email')
            .populate('project', 'title')
            .sort({ createdAt: -1 });

        // Add read count for each announcement
        const announcementsWithStats = announcements.map(ann => ({
            ...ann.toObject(),
            totalRecipients: ann.recipients.length,
            readCount: ann.readBy.length
        }));

        res.json(announcementsWithStats);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an announcement
const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await Notification.findByIdAndDelete(id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ==================== FREELANCER FUNCTIONS ====================

// Get notifications for a freelancer
const getFreelancerNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({
            recipients: userId
        })
            .populate('sender', 'name')
            .populate('project', 'title')
            .sort({ createdAt: -1 })
            .limit(50);

        // Add isRead flag for each notification
        const notificationsWithStatus = notifications.map(notif => ({
            ...notif.toObject(),
            isRead: notif.readBy.includes(userId)
        }));

        res.json(notificationsWithStatus);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Mark a single notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findByIdAndUpdate(
            id,
            { $addToSet: { readBy: userId } },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json({ message: 'Marked as read', notification });
    } catch (error) {
        console.error('Error marking as read:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.updateMany(
            { recipients: userId },
            { $addToSet: { readBy: userId } }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all as read:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;

        const count = await Notification.countDocuments({
            recipients: userId,
            readBy: { $ne: userId }
        });

        res.json({ unreadCount: count });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    // Admin functions
    createAnnouncement,
    getAllAnnouncements,
    deleteAnnouncement,
    // Freelancer functions
    getFreelancerNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
};
