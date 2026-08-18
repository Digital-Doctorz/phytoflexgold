import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"
import { getStorage } from "firebase-admin/storage"

let firebaseApp: ReturnType<typeof initializeApp> | null = null

function getApp() {
  if (firebaseApp) return firebaseApp
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!json) throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set in .env.local")
  const sa = JSON.parse(json)
  firebaseApp = getApps().length === 0
    ? initializeApp({
        credential: cert(sa),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      })
    : getApps()[0]
  return firebaseApp
}

export function getAdminDb() {
  return getFirestore(getApp())
}

export function getAdminAuth() {
  return getAuth(getApp())
}

export function getAdminStorage() {
  return getStorage(getApp())
}

export function serializeFirestoreData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}
