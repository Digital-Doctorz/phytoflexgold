"use client"

import { CheckCircle2, X } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types"

interface PricingSectionProps {
  product: Product
}

export function PricingSection({ product }: PricingSectionProps) {
  const { addItem, items } = useCart()

  const tierFeatures: Record<string, string[]> = {
    "10 Days": [
      "1x PhytoFlex Gold (500ml)",
      "10 Days Dosage",
      "Standard Support",
    ],
    "1 Month": [
      "3x PhytoFlex Gold (500ml)",
      "Advanced Biomarker Tracking",
      "Priority Clinical Support",
      "FREE Delivery",
    ],
    "3 Month": [
      "9x PhytoFlex Gold (500ml)",
      "VIP Restoration Coaching",
      "Free Shipping",
      "Best Value - 35% Off",
    ],
  }

  const tierExcludes: Record<string, string[]> = {
    "10 Days": ["Priority Support"],
  }

  return (
    <section className="py-32 bg-surface-container-low px-margin-mobile md:px-gutter-md" id="pricing" aria-labelledby="pricing-heading">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-16">
          <h2
            id="pricing-heading"
            className="text-display-sm md:text-display-lg leading-tight font-extrabold mb-6"
          >
            Choose Your Peak <span className="text-primary-container">Protocol</span>
          </h2>
          <p className="text-on-surface-variant">Invest in clinical-strength recovery with our flexible subscription models. Each bottle contains 500ml of clinical-grade PhytoFlex Gold.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto" role="list">
          {product.tiers.map((tier) => {
            const inCart = items.some(
              (i) => i.productId === product.id && i.tier.label === tier.label
            )
            const features = tierFeatures[tier.label] || []
            const excludes = tierExcludes[tier.label] || []
            const isPopular = tier.isPopular || (tier.label === "1 Month")

            return (
              <article
                key={tier.label}
                className={`p-8 rounded-2xl flex flex-col relative ${isPopular
                  ? "bg-surface-container-high border-2 border-primary-container transform md:scale-105 shadow-2xl"
                  : "bg-background border border-outline-variant/20"
                }`}
                role="listitem"
                aria-label={`${tier.label} supply plan at ${formatPrice(tier.price)}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-container px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest z-10">
                    Most Popular
                  </div>
                )}
                <div className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest mb-4">
                  {tier.label === "10 Days" ? "Discovery Phase" : tier.label === "1 Month" ? "Saturation Phase" : "Transformation Phase"}
                </div>
                <h3 className="text-headline-md font-headline-md mb-2">
                  {tier.label === "10 Days" ? "10 Days Supply" : tier.label === "1 Month" ? "1 Month Supply" : "3 Months Supply"}
                </h3>
                <div className="mb-6">
                  <p className="text-3xl font-bold text-on-surface">
                    {formatPrice(tier.price)}{" "}
                    <span className="text-sm font-normal text-on-surface-variant">
                      / {tier.quantity} bottle{tier.quantity > 1 ? "s" : ""}
                    </span>
                  </p>
                  {tier.label === "1 Month" && (
                    <p className="text-primary-container font-bold text-sm mt-1">You save Rs. 330 Total</p>
                  )}
                  {tier.label === "3 Month" && (
                    <p className="text-secondary font-bold text-sm mt-1">Best Value - 35% Off</p>
                  )}
                </div>
                <ul className="space-y-4 mb-8 flex-grow" aria-label={`Features included in ${tier.label} supply`}>
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle2 className="text-secondary w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
                      <span className="text-body-md">{f}</span>
                    </li>
                  ))}
                  {excludes.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-on-surface-variant">
                      <X className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
                      <span className="text-body-md">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() =>
                    addItem({
                      productId: product.id,
                      productName: product.name,
                      tier,
                    })
                  }
                  disabled={inCart}
                  className={`w-full py-4 rounded-lg font-bold transition-all active:scale-95 ${
                    isPopular
                      ? "bg-primary-container text-on-primary-container hover:opacity-90"
                      : "border border-primary text-primary hover:bg-primary/5"
                  } ${inCart ? "opacity-50 cursor-not-allowed" : ""}`}
                  aria-label={inCart ? `${tier.label} supply added to cart` : `Add ${tier.label} supply to cart for ${formatPrice(tier.price)}`}
                >
                  {inCart ? "Added to Cart" : "Select Protocol"}
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
