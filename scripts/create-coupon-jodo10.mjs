// Creates Firestore coupons/JODO10 INACTIVE from src/lib/coupon-config.ts.
// REQUIRES Node >=22.12 with --experimental-strip-types (it imports a .ts
// file). On older Node it exits with a clear message. Admin-only script; not
// part of `npm test`.
// DRY RUN BY DEFAULT: prints the record and writes nothing. It writes only
// with the explicit --write flag. Run ONLY after merge + DD go, by an admin:
//   FIREBASE_SERVICE_ACCOUNT_KEY='<json>' node --experimental-strip-types scripts/create-coupon-jodo10.mjs --write
// Uses create(), so it refuses to overwrite an existing coupon. Activation is a
// separate admin step (PATCH /api/admin/coupons {code:"JODO10", active:true})
// when DD says start.
const [major, minor] = process.versions.node.split(".").map(Number)
if (major < 22 || (major === 22 && minor < 12)) {
  console.error(`create-coupon-jodo10: Node >=22.12 required (found ${process.versions.node}). Use the Node 22 toolchain.`)
  process.exit(1)
}
const stripTypes =
  process.execArgv.some((a) => a.includes("strip-types")) || process.features?.typescript || major >= 24 || (major === 23 && minor >= 6)
if (!stripTypes) {
  console.error("create-coupon-jodo10: run with `node --experimental-strip-types scripts/create-coupon-jodo10.mjs [--write]`.")
  process.exit(1)
}

const { initializeApp, cert, getApps } = await import("firebase-admin/app")
const { getFirestore } = await import("firebase-admin/firestore")
const { JODO10_SEED } = await import("../src/lib/coupon-config.ts")

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
