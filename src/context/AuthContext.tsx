"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { auth } from "@/lib/firebase-client"
import { onAuthStateChanged, signInWithCustomToken, signOut as firebaseSignOut, type User as FirebaseUser } from "firebase/auth"
import type { User } from "@/types"

interface AuthContextType {
  userProfile: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  userProfile: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  isAdmin: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (firebaseUser: FirebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken()
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${idToken}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUserProfile(data)
      } else {
        setUserProfile(null)
      }
    } catch {
      setUserProfile(null)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchProfile(firebaseUser)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [fetchProfile])

  const signIn = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || "Failed to sign in")
    }

    try {
      await signInWithCustomToken(auth, data.customToken)
    } catch (err: any) {
      throw new Error("Failed to authenticate with server: " + (err.message || "Unknown error"))
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || "Failed to register")
    }

    await signInWithCustomToken(auth, data.customToken)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUserProfile(null)
  }

  const isAdmin = userProfile?.role === "ADMIN"

  return (
    <AuthContext.Provider value={{ userProfile, loading, signIn, signUp, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
