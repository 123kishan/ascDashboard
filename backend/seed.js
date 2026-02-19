require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Wallet = require('./models/Wallet');
const Policy = require('./models/Policy');
const Payment = require('./models/Payment');
const Plan = require('./models/Plan');

const generateTxnId = () => 'ASC360' + Math.floor(Math.random() * 9e15);
const generateTxnNo = () => 'ASC360-' + Math.random().toString(36).substr(2, 8).toUpperCase();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear only policies, wallets, payments, plans (keep users if they exist)
        await Promise.all([Wallet.deleteMany(), Policy.deleteMany(), Payment.deleteMany(), Plan.deleteMany()]);
        console.log('Cleared policies, wallets, payments, plans');

        // Create demo user if not exists
        let user = await User.findOne({ email: 'opt.act360@gmail.com' });
        if (!user) {
            const hashedPw = await bcrypt.hash('password123', 10);
            user = await User.create({
                name: 'Test Rishabh None',
                email: 'opt.act360@gmail.com',
                password: hashedPw,
                phone: '7982859396',
                operatorCode: 'ASC360-OPP-0004',
                operatorType: 'Domestic',
                role: 'operator'
            });
            console.log('Created demo user:', user.email);
        } else {
            console.log('Demo user already exists:', user.email);
        }

        // Create plans
        const plans = await Plan.insertMany([
            { planTitle: 'ASC360 Domestic Adventure Cover - Test', scope: 'Domestic', price: 60, description: 'Basic domestic travel insurance', coverageAmount: 100000, durationDays: 30 },
            { planTitle: 'ASC360 - Boat Racing Plan', scope: 'Domestic', price: 60, description: 'Specialized boat racing coverage', coverageAmount: 200000, durationDays: 7 },
            { planTitle: 'ASC360 - Kailash Mansa', scope: 'International', price: 540, description: 'Kailash Mansarovar yatra coverage', coverageAmount: 500000, durationDays: 15 },
            { planTitle: 'ASC360 International Adventure Cover', scope: 'International', price: 1200, description: 'Comprehensive international adventure', coverageAmount: 1000000, durationDays: 30 },
            { planTitle: 'ASC360 Budget Domestic Plan', scope: 'Domestic', price: 30, description: 'Affordable domestic plan', coverageAmount: 50000, durationDays: 15 },
        ]);
        console.log('Created plans:', plans.length);

        // Seed data for ALL users in the database
        const allUsers = await User.find({});
        console.log('Seeding data for', allUsers.length, 'user(s)...');

        for (const u of allUsers) {
            const now = new Date();
            const policyBatch = [];

            // 97 Active Domestic policies
            for (let i = 0; i < 97; i++) {
                policyBatch.push({
                    coverTitle: plans[i % 2].planTitle,
                    coverType: 'Domestic',
                    status: 'Active',
                    userId: u._id,
                    planId: plans[i % 2]._id,
                    travelerName: `Traveler ${i + 1}`,
                    travelerAge: 20 + (i % 40),
                    travelerGender: i % 2 === 0 ? 'Male' : 'Female',
                    startDate: new Date(now.getTime() - i * 86400000),
                    endDate: new Date(now.getTime() + (30 - i % 30) * 86400000),
                    premium: 60,
                    policyNumber: `ASC360-POL-ACT-${u._id.toString().slice(-4)}-${String(i + 1).padStart(4, '0')}`,
                });
            }

            // 97 Matured Domestic policies
            for (let i = 0; i < 97; i++) {
                policyBatch.push({
                    coverTitle: plans[i % 2].planTitle,
                    coverType: 'Domestic',
                    status: 'Matured',
                    userId: u._id,
                    planId: plans[i % 2]._id,
                    travelerName: `Old Traveler ${i + 1}`,
                    travelerAge: 20 + (i % 40),
                    travelerGender: i % 3 === 0 ? 'Female' : 'Male',
                    startDate: new Date(now.getTime() - (90 + i) * 86400000),
                    endDate: new Date(now.getTime() - (60 + i % 30) * 86400000),
                    premium: 60,
                    policyNumber: `ASC360-POL-MAT-${u._id.toString().slice(-4)}-${String(i + 1).padStart(4, '0')}`,
                });
            }

            // 5 International policies
            for (let i = 0; i < 5; i++) {
                policyBatch.push({
                    coverTitle: plans[2 + (i % 2)].planTitle,
                    coverType: 'International',
                    status: i < 3 ? 'Active' : 'Matured',
                    userId: u._id,
                    planId: plans[2 + (i % 2)]._id,
                    travelerName: `Intl Traveler ${i + 1}`,
                    travelerAge: 25 + i * 5,
                    travelerGender: 'Male',
                    startDate: new Date(now.getTime() - i * 86400000),
                    endDate: new Date(now.getTime() + (15 - i) * 86400000),
                    premium: 540,
                    policyNumber: `ASC360-POL-INTL-${u._id.toString().slice(-4)}-${String(i + 1).padStart(4, '0')}`,
                });
            }

            await Policy.insertMany(policyBatch);
            console.log(`  ✅ Created ${policyBatch.length} policies for: ${u.email}`);

            // Wallet
            const walletTxns = [];
            const amounts = [60, 60, 60, 60, 540, 540, 1200, 30, 30, 30];
            for (let i = 0; i < 20; i++) {
                walletTxns.push({
                    amount: amounts[i % amounts.length],
                    transactionNumber: generateTxnNo(),
                    type: 'DEDUCT',
                    createdBy: u.name,
                    note: 'Policy premium deducted',
                    date: new Date(now.getTime() - i * 3600000 * 24),
                });
            }
            walletTxns.push({ amount: 50000, transactionNumber: generateTxnNo(), type: 'CREDIT', createdBy: 'Admin', note: 'Initial wallet load', date: new Date(now.getTime() - 100 * 86400000) });
            walletTxns.push({ amount: 10000, transactionNumber: generateTxnNo(), type: 'CREDIT', createdBy: 'Admin', note: 'Top-up', date: new Date(now.getTime() - 50 * 86400000) });

            await Wallet.create({ userId: u._id, balance: 39940, transactions: walletTxns });
            console.log(`  ✅ Created wallet (₹39,940) for: ${u.email}`);

            // Payments
            const paymentBatch = [];
            const payAmounts = [60, 60, 60, 60, 540, 540, 1200, 30, 30, 30];
            for (let i = 0; i < 20; i++) {
                paymentBatch.push({
                    transactionId: generateTxnId().toString(),
                    gateway: 'ASC360 WALLET',
                    method: 'WALLET',
                    currency: 'INR',
                    totalAmount: payAmounts[i % payAmounts.length],
                    status: 'Success',
                    userId: u._id,
                    date: new Date(now.getTime() - i * 3600000 * 24),
                });
            }
            await Payment.insertMany(paymentBatch);
            console.log(`  ✅ Created 20 payments for: ${u.email}`);
        }

        console.log('\n✅ Seed complete!\n');
        console.log('Login credentials:');
        console.log('  Email: opt.act360@gmail.com');
        console.log('  Password: password123\n');
        console.log('All registered users now have demo data.\n');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
};

seed();
