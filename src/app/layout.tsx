import type { Metadata } from "next"
import { Hanken_Grotesk } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext"
import { SITE_URL } from "@/lib/seo"
import "./globals.css"

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-hanken-grotesk",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PhytoFlex Gold | Clinical-Grade Joint & Mobility Supplement",
    template: "%s | PhytoFlex Gold",
  },
  description:
    "PhytoFlex Gold is a clinical-strength botanical supplement engineered with 12 high-altitude botanical extracts. 94% bio-available liquid formula that modulates molecular inflammation and restores joint, nerve, and muscle vitality at a cellular level. 98.2% HPLC purity. GMP certified.",
  keywords: [
    "joint supplement",
    "mobility supplement",
    "anti-inflammatory supplement",
    "botanical supplement",
    "clinical grade supplement",
    "joint pain relief",
    "natural joint support",
    "bio-available supplement",
    "molecular inflammation",
    "cartilage support",
    "Ayurvedic joint formula",
    "liquid supplement",
    "PhytoFlex Gold",
    "joint health",
    "muscle recovery",
    "nerve support",
    "HPLC purity certified",
    "GMP certified supplement",
  ],
  authors: [{ name: "PhytoFlex Gold" }],
  creator: "PhytoFlex Gold",
  publisher: "PhytoFlex Gold",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "PhytoFlex Gold",
    title: "PhytoFlex Gold | Clinical-Grade Joint & Mobility Supplement",
    description:
      "Engineered with 12 clinical botanicals. 94% bio-available liquid formula that restores joint, nerve, and muscle vitality at a cellular level.",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "PhytoFlex Gold - Clinical-Grade Joint & Mobility Supplement",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PhytoFlex Gold | Clinical-Grade Joint & Mobility Supplement",
    description:
      "Engineered with 12 clinical botanicals. 94% bio-available liquid formula that restores joint, nerve, and muscle vitality.",
    images: [`${SITE_URL}/twitter-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#121414" />
        <meta name="msapplication-TileColor" content="#121414" />
      </head>
      <body className={`${hankenGrotesk.variable} font-sans antialiased bg-background text-on-background min-h-screen`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
