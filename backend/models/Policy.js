const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    coverTitle: { type: String, required: true },
    coverType: { type: String, enum: ['Domestic', 'International'], required: true },
    status: { type: String, enum: ['Active', 'Yet to Active', 'Matured', 'Pending'], default: 'Pending' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
    travelerName: { type: String, default: '' },
    travelerAge: { type: Number, default: 0 },
    travelerGender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    startDate: { type: Date },
    endDate: { type: Date },
    premium: { type: Number, default: 0 },
    policyNumber: { type: String, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);
