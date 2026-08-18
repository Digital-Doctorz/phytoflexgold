"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary mb-2 block">
            PhytoFlex Gold
          </Link>
          <CardTitle>Registration Disabled</CardTitle>
          <CardDescription>New account registration is not available. Please contact the administrator for access.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/auth/login" className="text-primary hover:underline text-sm">
            Back to Sign In
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
