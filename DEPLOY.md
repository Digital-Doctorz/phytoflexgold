# PhytoFlex Gold - Deployment Guide

## Prerequisites

1. **Firebase Project** (with Firestore, Auth, Storage enabled)
2. **Razorpay Account** (with API keys)
3. **GitHub Account**
4. **Vercel Account** (free tier)

## Step 1: Firebase Setup (using MCP)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firebase in the project
firebase init
# Select: Firestore, Authentication, Storage
# Use default files (firestore.rules, firestore.indexes.json)

# OR use MCP (if using Antigravity/Claude):
# In your AI tool, add the Firebase MCP server:
# {
#   "mcpServers": {
#     "firebase": {
#       "command": "npx",
#       "args": ["-y", "firebase-tools@latest", "mcp"]
#     }
#   }
# }
```

### After Firebase setup:
1. Go to Firebase Console > Authentication > Sign-in method > Enable Email/Password
2. Go to Firestore > Create database > Start in production mode
3. Go to Storage > Set up > Start in production mode
4. Go to Project Settings > Service Accounts > Generate new private key
5. Go to Project Settings > General > Your apps > Add web app (copy config)

## Step 2: Seed the Database

```bash
# Set the service account key
set FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Run seed script
node scripts/seed.js

# This creates:
# - PhytoFlex Gold product with 3 pricing tiers
# - Admin user: digitaldoctors.sales@gmail.com / 123456
```

## Step 3: GitHub Repository

```bash
git add .
git commit -m "Initial commit: PhytoFlex Gold e-commerce platform"
gh repo create phytoflex-gold --public --source=. --remote=origin --push
```

## Step 4: Vercel Deployment

1. Go to [vercel.com](https://vercel.com) > Add New Project
2. Import your GitHub repository
3. Add environment variables (all from `.env.example`)
4. Deploy

## Step 5: Razorpay Webhook

1. Go to Razorpay Dashboard > Settings > Webhooks
2. Add webhook URL: `https://your-domain.vercel.app/api/webhooks/razorpay`
3. Select events: `payment.captured`

## Step 6: Verify

1. Visit your Vercel URL
2. Login at `/auth/login` with digitaldoctors.sales@gmail.com / 123456
3. Access dashboard at `/admin/dashboard`
4. Test checkout flow

## DEPLOY-NOTES: Razorpay webhook secret (PR-A, payment hardening)

From PR-A the webhook (`/api/webhooks/razorpay`) verifies `X-Razorpay-Signature`
with **`RAZORPAY_WEBHOOK_SECRET`** (the secret typed into Razorpay Dashboard →
Webhooks), not `RAZORPAY_KEY_SECRET`. The env var and the dashboard value must
match, so change them together. Do test mode on the Preview first, then live.

Ordered steps (per environment: Preview/test keys first, then Production/live):
1. Generate a new random secret locally (e.g. `openssl rand -hex 32`). Do not commit it or paste it in chat/tickets.
2. Vercel → Project → Settings → Environment Variables: add `RAZORPAY_WEBHOOK_SECRET` for the target environment (Preview for test mode, Production for live). Do not change `RAZORPAY_KEY_SECRET`.
3. Deploy PR-A to that environment (Preview: the PR preview; Production: merge). Env changes only take effect on a new deployment.
4. Razorpay Dashboard (Test mode for Preview / Live mode for Production) → Settings → Webhooks → the phytoflexgold webhook → Edit → set Secret to the same value → Save. Keep events `payment.captured` and `payment.failed`.
5. Immediately send a test event / make a test payment; confirm the webhook delivery shows 200 in the dashboard and the order gets `PAID`, `razorpay.method`, `paidAt`, `amountMismatch:false`.
6. Watch Vercel logs for `Invalid webhook signature` (401) for 24 h.
   Between steps 3 and 4 webhooks return 401; Razorpay retries failed webhooks, and verify-payment still marks orders PAID from the checkout handler, so keep that window to minutes.

Rollback:
- Webhook 401s after the change: re-check the dashboard secret equals the env value (whitespace!) and that a redeploy happened after the env change.
- Full rollback: revert PR-A in Git and redeploy. The pre-PR-A code verifies the webhook with `RAZORPAY_KEY_SECRET`, so ALSO set the dashboard webhook secret back to the previous value (or to the key secret if that is what it was). Leaving `RAZORPAY_WEBHOOK_SECRET` set is harmless.
- `amountMismatch` / `razorpay.amountCapturedPaise` fields stay on orders after rollback and are ignored by old code.
