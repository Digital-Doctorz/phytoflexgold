import { HeroSection } from "@/components/shop/HeroSection"
import { TrustBar } from "@/components/shop/TrustBar"
import { ScienceSection } from "@/components/shop/ScienceSection"
import { BiomarkersSection } from "@/components/shop/BiomarkersSection"
import { TimelineSection } from "@/components/shop/TimelineSection"
import { PricingSection } from "@/components/shop/PricingSection"
import { IngredientsSection } from "@/components/shop/IngredientsSection"
import { ComparisonTable } from "@/components/shop/ComparisonTable"
import { FAQSection } from "@/components/shop/FAQSection"
import { getAdminDb } from "@/lib/firebase-admin"
import type { Metadata } from "next"
import type { Product } from "@/types"

export const metadata: Metadata = {
  title: "PhytoFlex Gold | Clinical-Grade Joint & Mobility Supplement - Order Online",
  description:
    "Buy PhytoFlex Gold - the bio-active gold standard for human mobility. 12 clinical botanicals, 94% bio-available liquid formula, 98.2% HPLC purity. Modulates molecular inflammation. GMP certified. Starting at Rs. 810.",
  openGraph: {
    title: "PhytoFlex Gold | Clinical-Grade Joint & Mobility Supplement",
    description:
      "Buy the bio-active gold standard for human mobility. 12 clinical botanicals, 94% bio-available liquid formula. Starting at Rs. 810.",
    url: "https://phytoflexgold.vercel.app",
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTqOpEHSIZVvw5PCnvpXM_uNUFC7Guyvy31zsWX8sGFPNRcoNPEEIgqTuR8o04qMKmaHa2JsVfKqVkBw1TMgr4IoyeD0ab8CZrclCE8VGMjlrZCnzElfqCxf9ZGkCkPpAhUsoH6sNdcc6WAnSNwtJXciqzOoIJ74KJ_2zKI9sQPzSGMuJ5t3mZIdoszGUQwEnzKl_YeeysAjWodwXmh9mlIpmcILW4PJHSufeA10SVVVZlI75W0cmF1DxqXo4a4uUXQ5zW-rPn4jkBpg",
        width: 1200,
        height: 630,
        alt: "PhytoFlex Gold - Clinical-Grade Joint & Mobility Supplement Bottle",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PhytoFlex Gold | Clinical-Grade Joint & Mobility Supplement",
    description:
      "Buy the bio-active gold standard for human mobility. 12 clinical botanicals, 94% bio-available liquid formula.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDTqOpEHSIZVvw5PCnvpXM_uNUFC7Guyvy31zsWX8sGFPNRcoNPEEIgqTuR8o04qMKmaHa2JsVfKqVkBw1TMgr4IoyeD0ab8CZrclCE8VGMjlrZCnzElfqCxf9ZGkCkPpAhUsoH6sNdcc6WAnSNwtJXciqzOoIJ74KJ_2zKI9sQPzSGMuJ5t3mZIdoszGUQwEnzKl_YeeysAjWodwXmh9mlIpmcILW4PJHSufeA10SVVVZlI75W0cmF1DxqXo4a4uUXQ5zW-rPn4jkBpg"],
  },
}

const fallbackProduct: Product = {
  id: "fallback",
  name: "PhytoFlex Gold",
  subtitle: "500ml Clinical Strength",
  description: "Engineered with a potent matrix of 12 clinical botanicals designed to modulate molecular inflammation and restore joint, nerves and muscle vitality at a cellular level.",
  imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTqOpEHSIZVvw5PCnvpXM_uNUFC7Guyvy31zsWX8sGFPNRcoNPEEIgqTuR8o04qMKmaHa2JsVfKqVkBw1TMgr4IoyeD0ab8CZrclCE8VGMjlrZCnzElfqCxf9ZGkCkPpAhUsoH6sNdcc6WAnSNwtJXciqzOoIJ74KJ_2zKI9sQPzSGMuJ5t3mZIdoszGUQwEnzKl_YeeysAjWodwXmh9mlIpmcILW4PJHSufeA10SVVVZlI75W0cmF1DxqXo4a4uUXQ5zW-rPn4jkBpg",
  basePrice: 810,
  stock: 500,
  isActive: true,
  tiers: [
    { label: "10 Days", quantity: 1, price: 810, isPopular: false },
    { label: "1 Month", quantity: 3, price: 2100, isPopular: true },
    { label: "3 Month", quantity: 9, price: 5900, isPopular: false },
  ],
}

async function getProduct(): Promise<Product> {
  try {
    const snapshot = await getAdminDb().collection("products").limit(1).get()
    if (snapshot.empty) return fallbackProduct
    const doc = snapshot.docs[0]
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name,
      subtitle: data.subtitle,
      description: data.description,
      imageUrl: data.imageUrl,
      basePrice: data.basePrice,
      stock: data.stock,
      isActive: data.isActive,
      tiers: data.tiers,
    } as Product
  } catch {
    return fallbackProduct
  }
}

export default async function HomePage() {
  const product = await getProduct()

  return (
    <>
      <HeroSection />
      <TrustBar />
      <ScienceSection />
      <IngredientsSection />
      <BiomarkersSection />
      <TimelineSection />
      <PricingSection product={product} />
      <ComparisonTable />
      <FAQSection />
    </>
  )
}
