const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    transactionNumber: { type: String, required: true },
    type: { type: String, enum: ['DEDUCT', 'CREDIT'], required: true },
    createdBy: { type: String, default: 'System' },
    note: { type: String, default: '' },
    date: { type: Date, default: Date.now },
});

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 0 },
    transactions: [transactionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
