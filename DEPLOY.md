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
# - Admin user: admin@phytoflex.com / Admin@123
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
2. Login at `/auth/login` with admin@phytoflex.com / Admin@123
3. Access dashboard at `/admin/dashboard`
4. Test checkout flow
