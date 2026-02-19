const express = require('express');
const Policy = require('../models/Policy');
const Payment = require('../models/Payment');
const Wallet = require('../models/Wallet');
const Plan = require('../models/Plan');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/stats  - all stats for dashboard, optionally filtered by cover_type
router.get('/stats', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const { cover_type } = req.query; // optional: 'Domestic' | 'International'

        // Build policy filter
        const baseFilter = { userId };
        const domesticFilter = cover_type && cover_type !== 'International'
            ? { userId, coverType: 'Domestic' }
            : (cover_type === 'International' ? null : { userId, coverType: 'Domestic' });
        const intlFilter = cover_type && cover_type !== 'Domestic'
            ? { userId, coverType: 'International' }
            : (cover_type === 'Domestic' ? null : { userId, coverType: 'International' });

        const statuses = ['Active', 'Yet to Active', 'Matured', 'Pending'];

        // Count helper
        const countByStatus = async (filter) => {
            if (!filter) return [0, 0, 0, 0];
            return Promise.all(statuses.map(s => Policy.countDocuments({ ...filter, status: s })));
        };

        const [
            domesticStats, intlStats,
            wallet, activePlans, recentPayments
        ] = await Promise.all([
            countByStatus(domesticFilter),
            countByStatus(intlFilter),
            Wallet.findOne({ userId }),
            Plan.find({ isActive: true }).limit(10),
            Payment.find({ userId }).sort({ date: -1 }).limit(5),
        ]);

        const active = domesticStats[0] + intlStats[0];
        const yetToActive = domesticStats[1] + intlStats[1];
        const matured = domesticStats[2] + intlStats[2];
        const pending = domesticStats[3] + intlStats[3];

        res.json({
            success: true,
            data: {
                stats: { active, yetToActive, matured, pending },
                chartData: {
                    domestic: { active: domesticStats[0], yetToActive: domesticStats[1], matured: domesticStats[2], pending: domesticStats[3] },
                    international: { active: intlStats[0], yetToActive: intlStats[1], matured: intlStats[2], pending: intlStats[3] },
                },
                wallet: wallet ? { balance: wallet.balance } : { balance: 0 },
                activePlans,
                recentPayments,
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


// GET /api/dashboard/travelers-by-age - Travelers By Age Group And Gender chart
router.get('/travelers-by-age', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await Policy.aggregate([
            { $match: { userId } },
            { $group: { _id: { ageGroup: { $floor: { $divide: ['$travelerAge', 10] } }, gender: '$travelerGender' }, count: { $sum: 1 } } },
            { $sort: { '_id.ageGroup': 1 } }
        ]);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
