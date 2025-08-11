const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

dotenv.config();  

const app = express();

connectDB();

const allowedOrigins = [
  process.env.NEXT_PUBLIC_BASE_URL ,
  process.env.NEXT_PUBLIC_USER_PANEL_URL,
  process.env.NEXT_PUBLIC_ADMIN_PANEL_URL,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition']
}));

app.use(cookieParser());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 
 
const serviceRoutes = require('./routes/serviceRoutes');
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");       // ✅ Added
const taskRoutes = require("./routes/taskRoutes");       // ✅ Will handle /api/tasks
const leadRoutes = require("./routes/leadRoutes");
const customerRoutes = require("./routes/customerRoutes");
const servicesRoutes = require("./routes/servicesRoutes");
const documentRoutes = require("./routes/documentRoutes");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user", userRoutes);       // ✅ User route added
app.use("/api/tasks", taskRoutes);      // ✅ Task route added
app.use('/uploads', express.static('uploads')); // Serve static files
app.use('/api/upload-documents', require('./routes/uploadRoutes'));
app.use('/api/service', serviceRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/documents', documentRoutes);
 

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.setTimeout(120000);