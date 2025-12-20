require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const { CLIENT_URL } = require('./config/constants');

const app = express(); // Server initialized

// Trust Proxy for VPS/Nginx
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Database Connection
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Alanxa API is running');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/freelancers', require('./routes/freelancerRoutes'));
app.use('/api/freelancer', require('./routes/freelancerDashboardRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
