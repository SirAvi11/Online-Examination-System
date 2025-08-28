const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const moduleRoutes = require('./routes/moduleRoutes.js');
const questionRoutes = require("./routes/questionRoutes.js");
const examRoutes = require('./routes/examRoutes.js');
const examRegistrationRoutes = require('./routes/examRegistrationRoutes.js')
const cron = require('node-cron');
const Exam = require('./models/Exam');



dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Start cron job after successful DB connection
cron.schedule('* * * * *', async () => {
  try {
    await Exam.updateAllStatuses();
    console.log('Exam statuses updated at', new Date().toISOString());
  } catch (error) {
    console.error('Error updating exam statuses:', error);
  }
});

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
  credentials: true
};

app.use(cors(corsOptions));


// API Routes
app.use('/api/users', userRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/modules', moduleRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/exam-registration", examRegistrationRoutes);
app.use("/uploads", express.static("uploads"));



// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Serve static files from React
app.use(express.static(path.join(__dirname, "../frontend/build")));

// IMPORTANT: Catch-all route for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));