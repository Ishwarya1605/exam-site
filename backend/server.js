const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database.js');
const authRoutes = require('./routes/authRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const studentsRoutes = require('./routes/studentsRoutes.js');
const courseRoutes = require('./routes/courseRoutes.js');
const subjectRoutes = require('./routes/subjectRoutes.js');
const topicRoutes = require('./routes/topicRoutes.js')
const questionRoutes = require('./routes/questionRoutes.js')
const studentAuthRoutes = require("./routes/studentAuthRoutes");
const bookmarkRoutes = require('./routes/bookmarkRoutes.js');
const topicCompletionRoutes = require('./routes/topicCompletionRoutes.js');
require('dotenv').config();
const app = express();



app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/subjects', subjectRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/topics', topicRoutes)
app.use('/api/questions', questionRoutes)
app.use("/api/students/auth", studentAuthRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/topic-completions', topicCompletionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running successfully!' });
});

// Serve React build from the `web` folder (static assets)
const webPath = path.join(__dirname, 'web');
app.use(express.static(webPath));

// For any non-API and non-upload request, return the React app index.html
// Use '/*' instead of '*' to avoid path-to-regexp parsing errors in some environments
// Use a middleware instead of a string route to avoid path-to-regexp errors.
// Serve index.html for any GET request that is not an API or uploads request.
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();

  res.sendFile(path.join(webPath, 'index.html'), (err) => {
    if (err) return next(err);
  });
});

// If a request falls through (e.g., API route not found), keep existing 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
