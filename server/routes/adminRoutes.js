const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(protect);
router.use(adminOnly);

// ==================== DASHBOARD ====================
router.get('/stats', adminController.getDashboardStats);

// ==================== BLOG MANAGEMENT ====================
router.get('/blogs', adminController.getAllBlogs);
router.post('/blogs', adminController.createBlog);
router.put('/blogs/:id', adminController.updateBlog);
router.delete('/blogs/:id', adminController.deleteBlog);

// ==================== CLIENT REQUESTS ====================
router.get('/client-requests', adminController.getAllClientRequests);
router.put('/client-requests/:id', adminController.updateClientRequestStatus);
router.delete('/client-requests/:id', adminController.deleteClientRequest);

// ==================== FREELANCER APPLICATIONS ====================
router.get('/freelancer-applications', adminController.getAllFreelancerApplications);
router.put('/freelancer-applications/approve-all', adminController.approveAllFreelancerApplications);
router.put('/freelancer-applications/:id', adminController.updateFreelancerApplicationStatus);
router.delete('/freelancer-applications/:id', adminController.deleteFreelancerApplication);

// ==================== DATA EXPORT ====================
router.get('/export/client-requests', adminController.exportClientRequests);
router.get('/export/freelancer-applications', adminController.exportFreelancerApplications);

// ==================== GOD MODE (USER MANAGEMENT) ====================
router.post('/users', adminController.createUser);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// ==================== PROJECT MANAGEMENT ====================
router.post('/projects', adminController.createProject);
router.get('/projects', adminController.getAllProjects);
router.put('/projects/:id', adminController.updateProject);
router.delete('/projects/:id', adminController.deleteProject);

// ==================== FORM TEMPLATES ====================
router.get('/form-templates', adminController.getAllFormTemplates);
router.get('/form-templates/:id', adminController.getFormTemplate);
router.post('/form-templates', adminController.createFormTemplate);
router.put('/form-templates/:id', adminController.updateFormTemplate);
router.delete('/form-templates/:id', adminController.deleteFormTemplate);

// ==================== DYNAMIC APPLICATIONS ====================
router.get('/dynamic-applications', adminController.getAllDynamicApplications);
router.put('/dynamic-applications/:id', adminController.updateDynamicApplicationStatus);
router.delete('/dynamic-applications/:id', adminController.deleteDynamicApplication);

module.exports = router;
