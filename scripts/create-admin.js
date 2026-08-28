/**
 * PhytoFlex Gold - Owner Admin Bootstrap
 *
 * Creates (or ensures) a private owner account so the owner can sign in
 * through the admin dashboard login at /auth/login.
 *
 * Run: node scripts/create-admin.js
 * Requires: FIREBASE_SERVICE_ACCOUNT_KEY env var
 * Optional: ADMIN_EMAIL, ADMIN_PASSWORD (defaults below)
 */
/* eslint-disable */

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const bcrypt = require("bcryptjs");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "liquidhealth.info@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Ag@123456";

async function ensureAdmin() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY env var is required");
  }
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  const app = getApps().length === 0
    ? initializeApp({ credential: cert(serviceAccount) })
    : getApps()[0];

  const db = getFirestore(app);
  const auth = getAuth(app);

  // 1. Make sure a Firebase Auth record exists so custom-token login resolves.
  let uid;
  let createdAuthUser = false;
  try {
    const existing = await auth.getUserByEmail(ADMIN_EMAIL);
    uid = existing.uid;
    console.log(`Auth user already exists: ${ADMIN_EMAIL} (${uid})`);
  } catch (err) {
    if (err.code !== "auth/user-not-found") throw err;
    const created = await auth.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      emailVerified: true,
      displayName: "Owner",
    });
    uid = created.uid;
    createdAuthUser = true;
    console.log(`Auth user created: ${ADMIN_EMAIL} (${uid})`);
  }

  // 2. Write the profile doc the login route (bcrypt compare) and the
  //    requireAdmin guard both rely on. Login does userDoc.data().passwordHash
  //    comparison, and verifyAuth reads role from users/{decoded.uid}.
  const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
  await db.collection("users").doc(uid).set(
    {
      email: ADMIN_EMAIL,
      name: "Owner",
      role: "ADMIN",
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { merge: true }
  );

  console.log("Admin profile saved to Firestore: users/" + uid);
  console.log("Email:", ADMIN_EMAIL);
  console.log(createdAuthUser ? "Password set on new auth user." : "Auth user existed; profile hash refreshed.");
  console.log("Sign in at: https://www.phytoflexgold.com/auth/login");
}

ensureAdmin()
  .then(() => console.log("Done."))
  .catch((err) => {
    console.error("Failed:", err.message);
    process.exit(1);
  });