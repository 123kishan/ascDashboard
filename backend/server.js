require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const policyRoutes = require('./routes/policies');
const planRoutes = require('./routes/plans');
const paymentRoutes = require('./routes/payments');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes (matching real ASC360 API patterns)
app.use('/api/auth', authRoutes);
app.use('/api/user-wallet', walletRoutes);
app.use('/api/trip-status', policyRoutes);
app.use('/api/assign-plan', planRoutes);
app.use('/api/user-specific-payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root route (for deployment health checks)
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to ASC360 Backend API',
        environment: process.env.NODE_ENV || 'development',
        docs: 'https://github.com/123kishan/ascDashboard/blob/main/backend/README.md'
    });
});

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, message: 'ASC360 API running', timestamp: new Date() }));

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` }));

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected');
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
