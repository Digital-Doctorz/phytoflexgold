import type { Metadata } from "next"
import { Hanken_Grotesk } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext"
import "./globals.css"

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-hanken-grotesk",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://phytoflexgold.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    siteName: "PhytoFlex Gold",
    title: "PhytoFlex Gold | Clinical-Grade Joint & Mobility Supplement",
    description:
      "Engineered with 12 clinical botanicals. 94% bio-available liquid formula that restores joint, nerve, and muscle vitality at a cellular level.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PhytoFlex Gold - Clinical-Grade Joint & Mobility Supplement",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PhytoFlex Gold | Clinical-Grade Joint & Mobility Supplement",
    description:
      "Engineered with 12 clinical botanicals. 94% bio-available liquid formula that restores joint, nerve, and muscle vitality.",
    images: ["/og-image.svg"],
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
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PhytoFlex Gold",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    "Clinical-strength wellness protocols for the modern biological athlete.",
  sameAs: [],
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PhytoFlex Gold",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "PhytoFlex Gold",
  description:
    "Clinical-strength botanical supplement engineered with 12 high-altitude botanical extracts. 94% bio-available liquid formula that modulates molecular inflammation and restores joint, nerve, and muscle vitality. 500ml bottle. 98.2% HPLC purity. GMP certified, ISO 9001, FDA registered, AYUSH approved, FSSAI licensed.",
  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTqOpEHSIZVvw5PCnvpXM_uNUFC7Guyvy31zsWX8sGFPNRcoNPEEIgqTuR8o04qMKmaHa2JsVfKqVkBw1TMgr4IoyeD0ab8CZrclCE8VGMjlrZCnzElfqCxf9ZGkCkPpAhUsoH6sNdcc6WAnSNwtJXciqzOoIJ74KJ_2zKI9sQPzSGMuJ5t3mZIdoszGUQwEnzKl_YeeysAjWodwXmh9mlIpmcILW4PJHSufeA10SVVVZlI75W0cmF1DxqXo4a4uUXQ5zW-rPn4jkBpg",
  brand: {
    "@type": "Brand",
    name: "PhytoFlex Gold",
  },
  manufacturer: {
    "@type": "Organization",
    name: "Liquid Health Inc.",
  },
  category: "Joint Health Supplements",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: 810,
    highPrice: 5900,
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: siteUrl,
    offerCount: 3,
    offers: [
      {
        "@type": "Offer",
        name: "10 Days Supply",
        price: 810,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        description: "1x PhytoFlex Gold (500ml) - 10 Days Dosage",
      },
      {
        "@type": "Offer",
        name: "1 Month Supply",
        price: 2100,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        description: "3x PhytoFlex Gold (500ml) - Advanced Biomarker Tracking - Priority Clinical Support - FREE Delivery",
      },
      {
        "@type": "Offer",
        name: "3 Month Supply",
        price: 5900,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        description: "9x PhytoFlex Gold (500ml) - VIP Restoration Coaching - Free Global Shipping - Best Value 35% Off",
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    bestRating: "5",
    reviewCount: "2400",
  },
  review: [
    {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      author: {
        "@type": "Person",
        name: "Verified Customer",
      },
      reviewBody: "Significant improvement in joint mobility and reduction in morning stiffness within 3 weeks of use.",
    },
  ],
  additionalProperty: [
    {
      "@type": "PropertyValue",
      name: "Volume",
      value: "500ml",
    },
    {
      "@type": "PropertyValue",
      name: "Purity",
      value: "98.2% HPLC",
    },
    {
      "@type": "PropertyValue",
      name: "Bio-Availability",
      value: "94%",
    },
    {
      "@type": "PropertyValue",
      name: "Botanical Extracts",
      value: "11",
    },
    {
      "@type": "PropertyValue",
      name: "Certifications",
      value: "GMP, ISO 9001, FDA Registered, AYUSH Approved, FSSAI Licensed",
    },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How quickly will I see results with PhytoFlex Gold?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "While initial molecular changes occur within the first 48 hours, most users report significant mobility gains between weeks 3 and 4 of consistent use. The full 12-week protocol delivers complete physiological stabilization and peak vitality.",
      },
    },
    {
      "@type": "Question",
      name: "Is PhytoFlex Gold safe to use with other medications?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our formula is 100% botanical with zero synthetic fillers. However, we always recommend consulting with your primary care physician before starting any new clinical supplement protocol, especially if taking blood thinners.",
      },
    },
    {
      "@type": "Question",
      name: "What makes PhytoFlex Gold better than standard glucosamine?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Glucosamine only provides the building blocks. PhytoFlex Gold addresses the chronic inflammatory fires that break down cartilage in the first place, allowing the body's natural repair mechanisms to function. Our 94% bio-available liquid formula ensures rapid absorption within 20 minutes.",
      },
    },
    {
      "@type": "Question",
      name: "What is the dosage for PhytoFlex Gold?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each 25ml dose should be consumed twice daily, after lunch and after dinner. Each dose contains the exact clinical threshold of 11 botanical extracts sourced from high-altitude environments.",
      },
    },
    {
      "@type": "Question",
      name: "How is PhytoFlex Gold extracted?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PhytoFlex Gold uses supercritical CO2 extraction, achieving 98.2% HPLC purity. This pharmaceutical-grade process preserves the delicate botanical profile for maximum biological uptake, unlike chemical solvent methods used by generic supplements.",
      },
    },
  ],
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="canonical" href={siteUrl} />
        <meta name="theme-color" content="#121414" />
        <meta name="msapplication-TileColor" content="#121414" />
      </head>
      <body className={`${hankenGrotesk.variable} font-sans antialiased bg-background text-on-background min-h-screen`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
