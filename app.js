const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
 


const fs = require('fs');
const path = require('path');
const serviceRoutes = require('./routes/serviceRoutes');

const uploadPath = path.join(process.cwd(), 'uploads', 'documents');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('📂 Created folder:', uploadPath);
}

// Route files
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");       // ✅ Added
const taskRoutes = require("./routes/taskRoutes");       // ✅ Will handle /api/tasks
const leadRoutes = require("./routes/leadRoutes");
const customerRoutes = require("./routes/customerRoutes");
const servicesRoutes = require("./routes/servicesRoutes");
const documentRoutes = require("./routes/documentRoutes");

 

dotenv.config(); // Load environment variables

const app = express();

//app.use('/api/documents', documentRoutes);

const allowedOrigins = [
  process.env.NEXT_PUBLIC_BASE_URL ,
  process.env.NEXT_PUBLIC_USER_PANEL_URL,
  process.env.NEXT_PUBLIC_ADMIN_PANEL_URL,
];

// Connect to MongoDB
connectDB();

// Middleware
// app.use(cors());
// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
//   exposedHeaders: ['Content-Disposition']
// }));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

app.use(cookieParser());
//app.use('/api/documents', documentRoutes);
app.use(express.json());

app.use(cookieParser());

app.use((err, req, res, next) => {
      if (err instanceof multer.MulterError) {
        console.error('Multer Error:', err);
        return res.status(400).json({ message: err.message });
      } else if (err) {
        console.error('Unknown Error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      next();
    });

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
