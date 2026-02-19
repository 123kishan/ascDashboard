const express = require('express');
const Policy = require('../models/Policy');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/trip-status?cover_type=Domestic  (matches real ASC360 API)
router.get('/', protect, async (req, res) => {
    try {
        const { cover_type } = req.query;
        const filter = { userId: req.user._id };
        if (cover_type) filter.coverType = cover_type;

        const [active, yetToActive, matured, pending] = await Promise.all([
            Policy.countDocuments({ ...filter, status: 'Active' }),
            Policy.countDocuments({ ...filter, status: 'Yet to Active' }),
            Policy.countDocuments({ ...filter, status: 'Matured' }),
            Policy.countDocuments({ ...filter, status: 'Pending' }),
        ]);

        res.json({
            success: true,
            cover_type: cover_type || 'All',
            data: { active, yetToActive, matured, pending, total: active + yetToActive + matured + pending }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/policies  - list all policies with search
router.get('/all', protect, async (req, res) => {
    try {
        const { search = '', cover_type = '', status = '', page = 1, limit = 10 } = req.query;
        const filter = { userId: req.user._id };
        if (cover_type) filter.coverType = cover_type;
        if (status) filter.status = status;
        if (search) filter.coverTitle = { $regex: search, $options: 'i' };

        const total = await Policy.countDocuments(filter);
        const policies = await Policy.find(filter)
            .populate('planId', 'planTitle scope price')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({ success: true, data: policies, total, page: Number(page), limit: Number(limit) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/trip-status  - create a new policy (issue cover)
router.post('/', protect, async (req, res) => {
    try {
        const { coverTitle, coverType, planId, travelerName, travelerAge, travelerGender, startDate, endDate, premium } = req.body;
        if (!coverTitle || !coverType) return res.status(400).json({ success: false, message: 'Cover title and type required' });

        const policyNumber = 'ASC360-POL-' + Date.now();
        const policy = await Policy.create({
            coverTitle, coverType, planId, travelerName, travelerAge, travelerGender,
            startDate, endDate, premium, policyNumber, userId: req.user._id, status: 'Active'
        });

        res.status(201).json({ success: true, data: policy, message: 'Policy issued successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PATCH /api/trip-status/:id  - update policy status
router.patch('/:id', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const policy = await Policy.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { status },
            { new: true }
        );
        if (!policy) return res.status(404).json({ success: false, message: 'Policy not found' });
        res.json({ success: true, data: policy });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
