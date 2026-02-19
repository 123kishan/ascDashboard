const express = require('express');
const Plan = require('../models/Plan');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/assign-plan/  - list all active plans (matches real ASC360 API)
router.get('/', protect, async (req, res) => {
    try {
        const { scope = '', search = '' } = req.query;
        const filter = { isActive: true };
        if (scope) filter.scope = scope;
        if (search) filter.planTitle = { $regex: search, $options: 'i' };

        const plans = await Plan.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: plans, total: plans.length });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/assign-plan/:id  - single plan detail
router.get('/:id', protect, async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
        res.json({ success: true, data: plan });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
