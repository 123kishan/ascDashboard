const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    gateway: { type: String, default: 'ASC360 WALLET' },
    method: { type: String, default: 'WALLET' },
    currency: { type: String, default: 'INR' },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Success', 'Pending', 'Failed'], default: 'Success' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy' },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
