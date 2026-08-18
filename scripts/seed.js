/**
 * PhytoFlex Gold - Database Seed Script
 * 
 * Run: node scripts/seed.js
 * Requires: FIREBASE_SERVICE_ACCOUNT_KEY env var
 */

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

async function seed() {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  const app = getApps().length === 0
    ? initializeApp({ credential: cert(serviceAccount) })
    : getApps()[0];

  const db = getFirestore(app);
  const auth = getAuth(app);

  console.log("Seeding PhytoFlex Gold data...");

  const productData = {
    name: "PhytoFlex Gold",
    subtitle: "500ml Clinical Strength",
    description:
      "Engineered with a potent matrix of 12 clinical botanicals designed to modulate molecular inflammation and restore joint, nerves and muscle vitality at a cellular level.",
    ingredients: "Supercritical CO2 extracted botanicals, HPLC tested >98% purity",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTqOpEHSIZVvw5PCnvpXM_uNUFC7Guyvy31zsWX8sGFPNRcoNPEEIgqTuR8o04qMKmaHa2JsVfKqVkBw1TMgr4IoyeD0ab8CZrclCE8VGMjlrZCnzElfqCxf9ZGkCkPpAhUsoH6sNdcc6WAnSNwtJXciqzOoIJ74KJ_2zKI9sQPzSGMuJ5t3mZIdoszGUQwEnzKl_YeeysAjWodwXmh9mlIpmcILW4PJHSufeA10SVVVZlI75W0cmF1DxqXo4a4uUXQ5zW-rPn4jkBpg",
    basePrice: 810,
    stock: 500,
    isActive: true,
    tiers: [
      { label: "10 Days", quantity: 1, price: 810, isPopular: false },
      { label: "1 Month", quantity: 3, price: 2100, isPopular: true },
      { label: "3 Month", quantity: 9, price: 5900, isPopular: false },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const productRef = await db.collection("products").add(productData);
  console.log("Product created:", productRef.id);

  console.log("Creating admin user...");
  try {
    const adminEmail = "digitaldoctors.sales@gmail.com";
    const adminPassword = "123456";

    const existingUsers = await db.collection("users").where("email", "==", adminEmail).limit(1).get();
    if (!existingUsers.empty) {
      console.log(`Admin user already exists: ${adminEmail}`);
    } else {
      const adminUser = await auth.createUser({
        email: adminEmail,
        password: adminPassword,
        displayName: "Admin",
      });
      await db.collection("users").doc(adminUser.uid).set({
        email: adminEmail,
        name: "Admin",
        role: "ADMIN",
        createdAt: new Date(),
      });
      console.log("Admin user created:", adminUser.uid);
      console.log("Email:", adminEmail);
      console.log("Password:", adminPassword);
    }
  } catch (err) {
    console.log("Admin user creation error:", err.message);
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
