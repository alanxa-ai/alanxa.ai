require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

/* ================================
   Trust Proxy (IMPORTANT for VPS)
================================ */
app.set("trust proxy", 1);

/* ================================
   Allowed Origins (CORS)
================================ */
const allowedOrigins = [
    "https://alanxa.ai",
    "https://www.alanxa.ai",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];


/* ================================
   Middleware
================================ */
app.use(express.json({ strict: false }));

app.use(
    cors({
        origin: function (origin, callback) {
            // allow server-to-server / curl / postman
            if (!origin) return callback(null, true);

            console.log("Incoming Origin:", origin); // Debug CORS

            // TEMPORARY: Allow all origins to debug 500 error masked as CORS
            return callback(null, true);

            /*
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                // Silently reject unknown origins instead of throwing error
                callback(null, false);
            }
            */
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
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api", require("./routes/notificationRoutes"));

/* ================================
   Error Handler
================================ */
app.use((err, req, res, next) => {
    console.error("API Error Stack:", err.stack); // Log full stack
    res.status(500).json({ message: "Server error", error: err.message });
});

/* ================================
   Start Server
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
