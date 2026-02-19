const express = require('express');
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/user-wallet?email=  (matches real ASC360 API pattern)
router.get('/', protect, async (req, res) => {
    try {
        const { email } = req.query;
        let userId = req.user._id;

        if (email) {
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });
            userId = user._id;
        }

        const wallet = await Wallet.findOne({ userId }).populate('userId', 'name email operatorCode phone operatorType');
        if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });

        res.json({
            success: true,
            data: {
                balance: wallet.balance,
                userId: wallet.userId,
                transactions: wallet.transactions,
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/user-wallet/transactions  - paginated transaction list
router.get('/transactions', protect, async (req, res) => {
    try {
        const { search = '', page = 1, limit = 20 } = req.query;
        const wallet = await Wallet.findOne({ userId: req.user._id });
        if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });

        let transactions = wallet.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (search) {
            const s = search.toLowerCase();
            transactions = transactions.filter(t =>
                t.transactionNumber.toLowerCase().includes(s) ||
                t.type.toLowerCase().includes(s) ||
                t.createdBy.toLowerCase().includes(s)
            );
        }
        const total = transactions.length;
        const startIdx = (page - 1) * limit;
        const paginated = transactions.slice(startIdx, startIdx + Number(limit));

        res.json({ success: true, data: paginated, total, balance: wallet.balance });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/user-wallet/credit  - add funds
router.post('/credit', protect, async (req, res) => {
    try {
        const { amount, note } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Valid amount required' });

        const wallet = await Wallet.findOne({ userId: req.user._id });
        if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });

        const txnNo = 'ASC360-' + Math.random().toString(36).substr(2, 8).toUpperCase();
        wallet.balance += Number(amount);
        wallet.transactions.push({ amount, transactionNumber: txnNo, type: 'CREDIT', createdBy: req.user.name, note: note || 'Balance added', date: new Date() });
        await wallet.save();

        res.json({ success: true, message: 'Funds credited', balance: wallet.balance });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
