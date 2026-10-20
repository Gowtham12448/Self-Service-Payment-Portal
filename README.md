# 💳 Self-Service Payment Portal

A full-stack demo application (Node.js + Express + React + Vite) for self-service payments, card management, subscriptions, and plan rollovers — **with no database** (all data lives in memory).

> ⚠️ **Demo only** — no real payment gateway is integrated. Card validation and payment processing are simulated.

## ✨ Features

- 👤 **User Info** — create / update profile (name, email, address, country)
- 💳 **Payment Methods** — add, remove, set-default cards (auto-detects Visa / Mastercard / Amex)
- 💸 **Make Payment** — one-time payment with card selection, amount, description
- 🔁 **Subscriptions** — subscribe, rollover to a different plan, cancel
- 📜 **Payment History** — every successful / failed charge is listed per user
- 🧪 **Simulated gateway** — 10% of payments randomly decline so you can test the failure flow

## 🏗 Tech Stack

| Layer    | Tech                          |
| -------- | ----------------------------- |
| Backend  | Node.js, Express, uuid, cors  |
| Frontend | React 18, Vite                |
| Storage  | In-memory (no DB)             |

## 📂 Project Structure

```
self-service-payment/
├── backend/    # Express REST API (port 4000)
└── frontend/   # React + Vite SPA (port 5173)
```

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### 1. Clone
```bash
git clone <your-repo-url>
cd self-service-payment
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Run the backend
```bash
cd backend
npm start
# → http://localhost:4000
```

### 4. Run the frontend (new terminal)
```bash
cd frontend
npm run dev
# → http://localhost:5173
```

Or use the root helper: `npm run dev` (runs both in parallel).

Open **http://localhost:5173** in your browser.

## 🧪 Test Flow

1. **User Info** → edit fields → **Save Info**
2. **Payment Methods** → add `4242 4242 4242 4242`, exp `12/28`, CVV `123`
3. **Make Payment** → enter amount → **Pay Now** (10% simulated declines)
4. **Subscription** → pick plan → **Subscribe** → try **Rollover** → then **Cancel**

## 🔌 API Reference

Base URL: `http://localhost:4000/api`

| Method | Endpoint                              | Description             |
| ------ | ------------------------------------- | ----------------------- |
| GET    | `/health`                             | Health check            |
| GET    | `/users/:userId`                      | Get user info           |
| POST   | `/users/:userId`                      | Create/update user      |
| GET    | `/cards/:userId`                      | List cards              |
| POST   | `/cards/:userId`                      | Add card                |
| PATCH  | `/cards/:userId/:cardId/default`      | Set default card        |
| DELETE | `/cards/:userId/:cardId`              | Delete card             |
| GET    | `/payments/:userId`                   | List payments           |
| POST   | `/payments/:userId`                   | Make a payment          |
| GET    | `/subscriptions/plans`                | List plans              |
| GET    | `/subscriptions/:userId`              | Get subscription        |
| POST   | `/subscriptions/:userId`              | Start subscription      |
| PATCH  | `/subscriptions/:userId/rollover`     | Change plan             |
| POST   | `/subscriptions/:userId/cancel`       | Cancel subscription     |

## 🐳 Docker

This repo ships **without** Dockerfiles by design so you can containerize it yourself.

**Suggested approach:**

- **Backend**: `FROM node:20-alpine`, `EXPOSE 4000`, `CMD ["node","server.js"]`
- **Frontend**: multi-stage build → `npm run build` → serve `dist/` via Nginx; proxy `/api` to the backend container
- **Orchestration**: `docker compose` with two services (`backend`, `frontend`) on a shared network

## ⚠️ Limitations

- **In-memory store** — data is reset when the backend restarts
- **No authentication** — `demo-user` is hardcoded as the identity
- **No real payments** — swap in Stripe/PayPal in `backend/routes/payments.js` for production

## 📝 License

MIT — free to use, fork, and modify.
