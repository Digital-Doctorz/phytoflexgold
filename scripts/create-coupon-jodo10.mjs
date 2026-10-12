// Creates Firestore coupons/JODO10 INACTIVE from src/lib/coupon-config.ts.
// Run ONLY after merge + DD go, by an admin:
//   FIREBASE_SERVICE_ACCOUNT_KEY='<json>' node --experimental-strip-types scripts/create-coupon-jodo10.mjs --write
// Without --write it is a dry run that prints the record. Uses create(), so it
// refuses to overwrite an existing coupon. Activation is a separate admin step
// (PATCH /api/admin/coupons {code:"JODO10", active:true}) when DD says start.
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { JODO10_SEED } from "../src/lib/coupon-config.ts"

const record = { ...JODO10_SEED, active: false, createdAt: new Date(), updatedAt: new Date() }
if (!process.argv.includes("--write")) {
  console.log("[dry-run] coupons/JODO10 =", JSON.stringify(record, null, 2))
  process.exit(0)
}
const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
if (!raw) {
  console.error("FIREBASE_SERVICE_ACCOUNT_KEY must be set")
  process.exit(1)
}
const sa = JSON.parse(raw)
if (getApps().length === 0) initializeApp({ credential: cert(sa), projectId: sa.project_id })
await getFirestore().collection("coupons").doc("JODO10").create(record)
console.log("Created coupons/JODO10 (inactive)")
