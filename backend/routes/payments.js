const express = require('express');
const Payment = require('../models/Payment');
const Wallet = require('../models/Wallet');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/user-specific-payments/  (matches real ASC360 API)
router.get('/', protect, async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;
        const filter = { userId: req.user._id };
        if (search) {
            filter.$or = [
                { transactionId: { $regex: search, $options: 'i' } },
                { gateway: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
            ];
        }

        const total = await Payment.countDocuments(filter);
        const payments = await Payment.find(filter)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({ success: true, data: payments, total, page: Number(page), limit: Number(limit) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/user-specific-payments/summary  - payment stats
router.get('/summary', protect, async (req, res) => {
    try {
        const result = await Payment.aggregate([
            { $match: { userId: req.user._id } },
            { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } }
        ]);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
