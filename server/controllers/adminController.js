const Blog = require('../models/Blog');
const ClientRequest = require('../models/ClientRequest');
const FreelancerApplication = require('../models/FreelancerApplication');
const User = require('../models/User');
const Subscriber = require('../models/Subscriber');
const sendEmail = require('../utils/sendEmail');
const { getNewsletterTemplate, getCredentialsTemplate } = require('../utils/emailTemplates');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Project = require('../models/Project');
const { CLIENT_URL } = require('../config/constants');

// ==================== BLOG MANAGEMENT ====================

// Get all blogs (admin view)
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create new blog
exports.createBlog = async (req, res) => {
    try {
        const blogData = req.body;
        const blog = new Blog(blogData);
        await blog.save();

        // Notify Subscribers if published
        if (blog.published) {
            // Run asynchronously to not block response
            (async () => {
                try {
                    const subscribers = await Subscriber.find({});
                    if (subscribers.length > 0) {
                        // Simple HTML template for newsletter
                        const subject = `New Insight: ${blog.title}`;
                        const linkUrl = `${CLIENT_URL}/blog/${blog._id}`;
                        const htmlContent = getNewsletterTemplate(blog.title, blog.excerpt, linkUrl);

                        // Send in batches or simple loop (using loop for now as count is likely low)
                        for (const sub of subscribers) {
                            try {
                                await sendEmail(sub.email, subject, htmlContent);
                            } catch (err) {
                                console.error(`Failed to email ${sub.email}`, err.message);
                            }
                        }
                        console.log(`Newsletter sent to ${subscribers.length} subscribers.`);
                    }
                } catch (err) {
                    console.error("Error sending newsletter:", err);
                }
            })();
        }

        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update blog
exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ==================== CLIENT REQUESTS ====================

// Get all client requests
exports.getAllClientRequests = async (req, res) => {
    try {
        const requests = await ClientRequest.find().sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update client request status
exports.updateClientRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const request = await ClientRequest.findByIdAndUpdate(
            id,
            { status, notes },
            { new: true }
        );
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json({ message: 'Status updated successfully', request });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete client request
exports.deleteClientRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await ClientRequest.findByIdAndDelete(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ==================== FREELANCER APPLICATIONS ====================

// Get all freelancer applications
exports.getAllFreelancerApplications = async (req, res) => {
    try {
        const applications = await FreelancerApplication.find()
            .populate('reviewedBy', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Bulk Approve all pending freelancer applications
exports.approveAllFreelancerApplications = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await FreelancerApplication.updateMany(
            { status: 'Pending' },
            {
                status: 'Approved',
                reviewedBy: userId,
                reviewedAt: new Date()
            }
        );

        res.status(200).json({
            message: `Successfully approved ${result.modifiedCount} applications`,
            count: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update freelancer application status
exports.updateFreelancerApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const userId = req.user.id; // From auth middleware

        const application = await FreelancerApplication.findByIdAndUpdate(
            id,
            {
                status,
                notes,
                reviewedBy: userId,
                reviewedAt: new Date()
            },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.status(200).json({ message: 'Status updated successfully', application });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete freelancer application
exports.deleteFreelancerApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await FreelancerApplication.findByIdAndDelete(id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ==================== DASHBOARD STATS ====================

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const [
            totalBlogs,
            publishedBlogs,
            totalClientRequests,
            pendingClientRequests,
            totalFreelancerApplications,
            pendingFreelancerApplications,
            totalUsers
        ] = await Promise.all([
            Blog.countDocuments(),
            Blog.countDocuments({ published: true }),
            ClientRequest.countDocuments(),
            ClientRequest.countDocuments({ status: 'Pending' }),
            FreelancerApplication.countDocuments(),
            FreelancerApplication.countDocuments({ status: 'Pending' }),
            User.countDocuments()
        ]);

        res.status(200).json({
            blogs: {
                total: totalBlogs,
                published: publishedBlogs,
                draft: totalBlogs - publishedBlogs
            },
            clientRequests: {
                total: totalClientRequests,
                pending: pendingClientRequests
            },
            freelancerApplications: {
                total: totalFreelancerApplications,
                pending: pendingFreelancerApplications
            },
            users: {
                total: totalUsers
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ==================== DATA EXPORT ====================

// Export client requests to CSV
exports.exportClientRequests = async (req, res) => {
    try {
        const requests = await ClientRequest.find().sort({ createdAt: -1 });

        // CSV format
        const csvHeader = 'ID,Company Name,Contact Person,Email,Country,Service,Languages,Volume,Status,Notes,Created At\n';
        const csvRows = requests.map(r =>
            `"${r._id}","${r.companyName}","${r.contactPerson}","${r.email}","${r.country}","${r.service}","${r.languages || ''}","${r.volume || ''}","${r.status}","${r.notes || ''}","${r.createdAt}"`
        ).join('\n');

        const csv = csvHeader + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=client_requests.csv');
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Export freelancer applications to CSV
exports.exportFreelancerApplications = async (req, res) => {
    try {
        const applications = await FreelancerApplication.find()
            .populate('reviewedBy', 'name')
            .sort({ createdAt: -1 });

        // CSV format
        const csvHeader = 'ID,Full Name,Email,Phone,Country,Expertise,Languages,Experience,Resume,Status,Notes,Created At,Reviewed By\n';
        const csvRows = applications.map(a =>
            `"${a._id}","${a.fullName || a.name}","${a.email}","${a.phone || ''}","${a.country || ''}","${a.expertise || ''}","${a.languages || ''}","${a.experience || ''}","${a.resume || ''}","${a.status}","${a.notes || ''}","${a.createdAt}","${a.reviewedBy?.name || 'Not Reviewed'}"`
        ).join('\n');

        const csv = csvHeader + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=freelancer_applications.csv');
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ==================== USER MANAGEMENT (GOD MODE) ====================


// Create a new User (Client/Freelancer) by Admin
exports.createUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Generate temporary password
        const tempPassword = crypto.randomBytes(4).toString('hex');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role, // 'client' or 'freelancer'
            isVerified: true // Auto-verify admin created users
        });

        await user.save();

        // Send Email with credentials
        const emailSubject = `Welcome to Alanxa - Your ${role} Account`;
        const emailBody = getCredentialsTemplate(name, email, tempPassword, role);

        await sendEmail(email, emailSubject, emailBody);

        res.status(201).json({ message: `User created and email sent to ${email}`, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create Project
exports.createProject = async (req, res) => {
    try {
        const { title, description, client, freelancers, deadline, taskData, category, serviceType, totalItems, unit } = req.body;

        const project = new Project({
            title,
            description,
            client,
            freelancers, // Array of IDs
            deadline,
            taskData,
            category,
            serviceType,
            totalItems: totalItems || 0,
            unit: unit || 'Tasks'
        });

        await project.save();
        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

// Get All Projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('client', 'name email')
            .populate('freelancers', 'name email') // Populate array
            .sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Project (Admin)
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // status, adminNotes, etc.

        const project = await Project.findByIdAndUpdate(id, updates, { new: true });

        // Notification could go here if status changes to 'Approved'

        res.status(200).json({ message: 'Project updated', project });
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};

// Delete Project
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndDelete(id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};

// ==================== USER CRUD EXTENSIONS ====================

// Update User
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        // Prevent password update via this route for simplicity, or handle hashing if needed
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
