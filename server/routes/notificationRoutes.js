const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ==================== ADMIN ROUTES ====================
// All admin routes require authentication and admin role
router.post('/admin/announcements', protect, adminOnly, notificationController.createAnnouncement);
router.get('/admin/announcements', protect, adminOnly, notificationController.getAllAnnouncements);
router.delete('/admin/announcements/:id', protect, adminOnly, notificationController.deleteAnnouncement);

// ==================== FREELANCER ROUTES ====================
// Freelancer routes only require authentication
router.get('/freelancer/notifications', protect, notificationController.getFreelancerNotifications);
router.put('/freelancer/notifications/read-all', protect, notificationController.markAllAsRead);
router.put('/freelancer/notifications/:id/read', protect, notificationController.markAsRead);
router.get('/freelancer/notifications/unread-count', protect, notificationController.getUnreadCount);

module.exports = router;
