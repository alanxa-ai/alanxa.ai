
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { CLIENT_URL } = require('./config/constants');


/* ================================
   Trust Proxy (IMPORTANT for VPS)
================================ */
app.set("trust proxy", 1);

/* ================================
   Allowed Origins (CORS)
================================ */
const allowedOrigins = [
    "https://alanxa.ai",
    "https://www.alanxa.ai"
];

/* ================================
   Middleware
================================ */
app.use(express.json());


app.use(
    cors({
        origin: function (origin, callback) {
            // allow server-to-server / curl / postman
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS blocked for origin: ${origin}`));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Preflight support
app.options("*", cors());

app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

/* ================================
   Database
================================ */

app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use(cors({
  origin: [
    "https://alanxa.ai",
    "https://www.alanxa.ai"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



app.options("*", cors());
// Database Connection
connectDB();

/* ================================
   Routes
================================ */
app.get("/", (req, res) => {
    res.send("Alanxa API is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/freelancers", require("./routes/freelancerRoutes"));
app.use("/api/freelancer", require("./routes/freelancerDashboardRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

/* ================================
   Error Handler (IMPORTANT)
================================ */
app.use((err, req, res, next) => {
    console.error("API Error:", err.message);
    res.status(500).json({ message: "Server error" });
});

/* ================================
   Start Server
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
