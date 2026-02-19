const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, operatorType } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email and password are required' });
        }
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

        const operatorCode = 'ASC360-OPP-' + String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0');
        const user = await User.create({ name, email, password, phone, operatorCode, operatorType: operatorType || 'Domestic' });

        // Create wallet for user
        await Wallet.create({ userId: user._id, balance: 5000, transactions: [] });

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, operatorCode: user.operatorCode, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, operatorCode: user.operatorCode, phone: user.phone, operatorType: user.operatorType, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/auth/me  (verify token)
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'No token' });
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
});

// PUT /api/auth/profile  — update profile fields
const { protect } = require('../middleware/auth');
router.put('/profile', protect, async (req, res) => {
    try {
        const allowed = ['name', 'phone', 'operatorType', 'liase', 'country', 'officeAddress', 'website', 'paymentCurrency', 'beneficiaryName', 'beneficiaryAccount', 'beneficiaryBank', 'bankIFSC', 'upiId'];
        const update = {};
        allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
        const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/auth/change-password
router.put('/change-password', protect, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) return res.status(400).json({ success: false, message: 'Both fields required' });
        const user = await User.findById(req.user._id);
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        user.password = newPassword;  // pre-save hook hashes it
        await user.save();
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

