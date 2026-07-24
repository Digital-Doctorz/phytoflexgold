// Firebase setup script - run with: node scripts/firebase-setup.mjs
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import bcrypt from "bcryptjs"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load service account from .env.local
const envContent = readFileSync(join(__dirname, "..", ".env.local"), "utf-8")
const match = envContent.match(/FIREBASE_SERVICE_ACCOUNT_KEY=(.+)/)
if (!match) {
  console.error("No FIREBASE_SERVICE_ACCOUNT_KEY found in .env.local")
  process.exit(1)
}

// Parse the JSON (handle newlines in private_key)
const serviceAccount = JSON.parse(match[1])

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  })
}

const auth = getAuth()
const db = getFirestore()

async function setup() {
  console.log("=== PhytoFlex Gold Firebase Setup ===\n")

  // Hash the admin password
  const adminPassword = "PhytoFlex@2024"
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  // 1. Create admin user in Firebase Auth
  console.log("1. Creating admin user in Firebase Auth...")
  let adminUid
  try {
    const adminUser = await auth.createUser({
      email: "admin@phytoflexgold.com",
      password: adminPassword,
      displayName: "Admin",
      emailVerified: true,
    })
    adminUid = adminUser.uid
    console.log(`   Created: ${adminUser.email} (uid: ${adminUid})`)
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      console.log("   User already exists in Auth, fetching uid...")
      const existing = await auth.getUserByEmail("admin@phytoflexgold.com")
      adminUid = existing.uid
      console.log(`   Found existing uid: ${adminUid}`)
    } else {
      console.error("   Error:", err.message)
      process.exit(1)
    }
  }

  // 2. Store user profile with passwordHash in Firestore
  console.log("\n2. Storing user profile in Firestore...")
  await db.collection("users").doc(adminUid).set({
    email: "admin@phytoflexgold.com",
    name: "Admin",
    role: "ADMIN",
    passwordHash,
    createdAt: new Date(),
  })
  console.log("   User profile stored with password hash")

  // 3. Seed product data
  console.log("\n3. Seeding product data...")
  try {
    await db.collection("products").doc("phytoflex-gold").set({
      name: "PhytoFlex Gold",
      subtitle: "500ml Clinical Strength",
      description: "Clinical-strength botanical supplement engineered with 12 high-altitude botanical extracts. 94% bio-available liquid formula that modulates molecular inflammation and restores joint, nerve, and muscle vitality at a cellular level.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTqOpEHSIZVvw5PCnvpXM_uNUFC7Guyvy31zsWX8sGFPNRcoNPEEIgqTuR8o04qMKmaHa2JsVfKqVkBw1TMgr4IoyeD0ab8CZrclCE8VGMjlrZCnzElfqCxf9ZGkCkPpAhUsoH6sNdcc6WAnSNwtJXciqzOoIJ74KJ_2zKI9sQPzSGMuJ5t3mZIdoszGUQwEnzKl_YeeysAjWodwXmh9mlIpmcILW4PJHSufeA10SVVVZlI75W0cmF1DxqXo4a4uUXQ5zW-rPn4jkBpg",
      basePrice: 810,
      stock: 500,
      isActive: true,
      tiers: [
        { label: "10 Days", quantity: 1, price: 810, isPopular: false },
        { label: "1 Month", quantity: 3, price: 2100, isPopular: true },
        { label: "3 Month", quantity: 9, price: 5900, isPopular: false },
      ],
      createdAt: new Date(),
    })
    console.log("   Product seeded: PhytoFlex Gold")
  } catch (err) {
    console.error("   Error:", err.message)
  }

  // 4. Firestore security rules
  console.log("\n4. Firestore rules should be set via Firebase Console.")
  console.log("   Go to: Firestore Database -> Rules -> Publish the following:")
  console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if false;
    }
    match /orders/{orderId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "ADMIN"
      );
      allow create: if request.auth != null;
      allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "ADMIN";
    }
    match /customers/{customerId} {
      allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "ADMIN";
    }
  }
}`)

  console.log("\n=== Setup Complete! ===")
  console.log("\nLogin credentials:")
  console.log("  Email: admin@phytoflexgold.com")
  console.log("  Password: PhytoFlex@2024")
  console.log("\nAdmin URL: http://localhost:3000/auth/login")
}

setup().catch(console.error)
