# ASC360 Dashboard - MERN Stack Project

# 📦 Project Structure

```
ascDashboard/
├── backend/       → Node.js + Express + MongoDB API
└── frontend/      → React + Vite UI
```

# 🔑 APIs Built (matching real ASC360 network tab)

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/login` | POST | Login, returns JWT token |
| `/api/auth/register` | POST | Register new operator |
| `/api/user-wallet?email=` | GET | Get wallet balance |
| `/api/user-wallet/transactions` | GET | Wallet transaction list |
| `/api/trip-status?cover_type=` | GET | Policy counts by type |
| `/api/trip-status/all` | GET | All policies with filter |
| `/api/assign-plan/` | GET | List active plans |
| `/api/user-specific-payments/` | GET | User payment history |
| `/api/dashboard/stats` | GET | All dashboard data |

---

# 🚀 How to Run (Step by Step)

## Step 1: Set Up MongoDB Atlas (FREE)

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) → **Sign up FREE**
2. Create a **Free Cluster** (M0 Sandbox)
3. In the left menu → **Database Access** → Add user:
   - Username: `ascAdmin`
   - Password: `asc123456`
   - Role: `Atlas Admin`
4. In left menu → **Network Access** → Add IP → click **"Allow access from anywhere"** (0.0.0.0/0)
5. In left menu → **Databases** → click **Connect** → **Connect your application**
6. Copy the connection string, it looks like:
   ```
   mongodb+srv://ascAdmin:asc123456@cluster0.xxxx.mongodb.net/
   ```
7. Open `backend/.env` and replace `MONGO_URI` with:
   ```
   MONGO_URI=mongodb+srv://ascAdmin:asc123456@cluster0.xxxx.mongodb.net/ascDashboard?retryWrites=true&w=majority
   ```
   *(Replace `cluster0.xxxx` with your actual cluster address)*

---

## Step 2: Start the Backend

Open **Terminal 1** and run:
```bash
cd E:\ascDashboard\backend
npm install
node seed.js        ← This creates demo data in MongoDB
npm start           ← This starts the API server
```

✅ You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

---

## Step 3: Start the Frontend

Open **Terminal 2** and run:
```bash
cd E:\ascDashboard\frontend
npm install
npm run dev
```

✅ You should see:
```
VITE v7.x ready in xxx ms
➜  Local: http://localhost:5173/
```

---

## Step 4: Open the App

Go to → **http://localhost:5173**

### Demo Login Credentials:
| Field | Value |
|---|---|
| Email | opt.act360@gmail.com |
| Password | password123 |

---

# 📱 Pages in the App

| Page | URL | What you see |
|---|---|---|
| **Login** | `/login` | Sign in / Register form |
| **Dashboard** | `/dashboard` | Stats, chart, wallet, tables |
| **Wallet** | `/operator/wallet` | All transactions (DEDUCT/CREDIT) |
| **Payments** | `/operator/payments` | Payment history with status |
| **Operator** | `/operator/about` | Operator profile info |
| **Issue Policy** | `/issuance/issue` | Form to create new policy |
| **All Policies** | `/issuance/all` | Search/filter all policies |

---

# 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (no frameworks) |
| Charts | Recharts |
| HTTP Client | Axios |
| Routing | React Router DOM v6 |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Auth | JWT (jsonwebtoken) |
| Password | bcryptjs |

---

# 🔐 How JWT Auth Works

1. User logs in → backend validates password → returns JWT token
2. Token stored in `localStorage`
3. Every API request sends: `Authorization: Bearer <token>`
4. Backend middleware verifies token before any protected route

---

# ❓ Troubleshooting

| Problem | Solution |
|---|---|
| `MongoDB connection error` | Check MONGO_URI in `backend/.env`, ensure IP is whitelisted in Atlas |
| `Port 5000 already in use` | Change `PORT=5001` in `backend/.env` |
| `CORS error` | Backend has `cors({ origin: '*' })` – should work |
| Login says "Invalid credentials" | Run `node seed.js` first to create the demo user |
