const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    planTitle: { type: String, required: true },
    scope: { type: String, enum: ['Domestic', 'International'], required: true },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    coverageAmount: { type: Number, default: 0 },
    durationDays: { type: Number, default: 30 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
