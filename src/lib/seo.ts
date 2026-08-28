export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.phytoflexgold.com"

export const ORGANIZATION = {
  name: "Liquid Health",
  legalName: "Liquid Health",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: "Makers of PhytoFlex Gold, a clinical-strength botanical supplement engineered with 12 high-altitude botanical extracts for joint, nerve, and muscle vitality.",
  email: "support@phytoflexgold.com",
  phone: "+91-9555955595",
  address: {
    "@type": "PostalAddress",
    streetAddress: "8/2A, Hazra Road",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    postalCode: "700021",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.facebook.com/phytoflexgold",
    "https://www.instagram.com/phytoflexgold",
    "https://twitter.com/phytoflexgold",
    "https://www.youtube.com/@phytoflexgold",
    "https://www.linkedin.com/company/phytoflexgold",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9555955595",
    contactType: "customer service",
    email: "support@phytoflexgold.com",
    availableLanguage: ["English", "Hindi", "Bengali"],
    areaServed: "IN",
  },
} as const

export const PRODUCT_IMAGE_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuDTqOpEHSIZVvw5PCnvpXM_uNUFC7Guyvy31zsWX8sGFPNRcoNPEEIgqTuR8o04qMKmaHa2JsVfKqVkBw1TMgr4IoyeD0ab8CZrclCE8VGMjlrZCnzElfqCxf9ZGkCkPpAhUsoH6sNdcc6WAnSNwtJXciqzOoIJ74KJ_2zKI9sQPzSGMuJ5t3mZIdoszGUQwEnzKl_YeeysAjWodwXmh9mlIpmcILW4PJHSufeA10SVVVZlI75W0cmF1DxqXo4a4uUXQ5zW-rPn4jkBpg"

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    ...ORGANIZATION,
  }
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORGANIZATION.name,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: ORGANIZATION.name,
    description: ORGANIZATION.description,
    url: SITE_URL,
    telephone: ORGANIZATION.phone,
    email: ORGANIZATION.email,
    address: ORGANIZATION.address,
    geo: {
      "@type": "GeoCoordinates",
      latitude: 22.5726,
      longitude: 88.3639,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "₹810 - ₹5900",
    image: PRODUCT_IMAGE_URL,
    sameAs: ORGANIZATION.sameAs,
  }
}

export function buildProductSchema(product?: {
  name?: string
  description?: string
  imageUrl?: string
  basePrice?: number
  tiers?: { label: string; quantity: number; price: number; isPopular?: boolean }[]
}) {
  const name = product?.name || "PhytoFlex Gold"
  const description = product?.description || "Clinical-strength botanical supplement engineered with 12 high-altitude botanical extracts. 94% bio-available liquid formula."
  const image = product?.imageUrl || PRODUCT_IMAGE_URL

  const offers = product?.tiers?.length
    ? product.tiers.map((t) => ({
        "@type": "Offer" as const,
        name: t.label,
        price: t.price,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        description: `${t.quantity}x PhytoFlex Gold (500ml) - ${t.label}`,
      }))
    : [
        { "@type": "Offer" as const, name: "10 Days Supply", price: 810, priceCurrency: "INR", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition", description: "1x PhytoFlex Gold (500ml) - 10 Days Dosage" },
        { "@type": "Offer" as const, name: "1 Month Supply", price: 2100, priceCurrency: "INR", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition", description: "3x PhytoFlex Gold (500ml) - Advanced Biomarker Tracking - Priority Clinical Support - FREE Delivery" },
        { "@type": "Offer" as const, name: "3 Month Supply", price: 5900, priceCurrency: "INR", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition", description: "9x PhytoFlex Gold (500ml) - VIP Restoration Coaching - Free Global Shipping - Best Value 35% Off" },
      ]

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: { "@type": "Brand", name: ORGANIZATION.name },
    manufacturer: { "@type": "Organization", name: ORGANIZATION.legalName },
    category: "Joint Health Supplements",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: 810,
      highPrice: 5900,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: SITE_URL,
      offerCount: offers.length,
      offers,
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
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        author: { "@type": "Person", name: "Verified Customer" },
        reviewBody: "Significant improvement in joint mobility and reduction in morning stiffness within 3 weeks of use.",
      },
    ],
    additionalProperty: [
      { "@type": "PropertyValue", name: "Volume", value: "500ml" },
      { "@type": "PropertyValue", name: "Purity", value: "98.2% HPLC" },
      { "@type": "PropertyValue", name: "Bio-Availability", value: "94%" },
      { "@type": "PropertyValue", name: "Botanical Extracts", value: "12" },
      { "@type": "PropertyValue", name: "Certifications", value: "GMP, ISO 9001, FDA Registered, AYUSH Approved, FSSAI Licensed" },
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".product-name", ".product-description"],
    },
  }
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function buildHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Use PhytoFlex Gold: 12-Week Joint Health Protocol",
    description: "Step-by-step guide to the PhytoFlex Gold 12-week clinical protocol for joint restoration and peak mobility.",
    totalTime: "P12W",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: "2100",
    },
    supply: [
      {
        "@type": "HowToSupply",
        name: "PhytoFlex Gold (500ml bottle)",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        name: "Phase 1 - Molecular Desensitization (Weeks 1-2)",
        text: "Take 25ml of PhytoFlex Gold twice daily, after lunch and after dinner. Initial molecular changes begin within 48 hours. The formula starts modulating NF-κB and COX-2 inflammatory pathways.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Phase 2 - Active Restoration (Weeks 4-6)",
        text: "Continue twice-daily dosing. Noticeable improvements in morning stiffness and daily mobility. Boswellia Serrata and Curcumin reach therapeutic concentrations in joint tissue.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Phase 3 - Optimization (Week 12+)",
        text: "Full physiological stabilization and peak vitality achieved. Continue maintenance dosing of 25ml twice daily for sustained joint health and mobility.",
        position: 3,
      },
    ],
  }
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}

export function buildArticleSchema(post: {
  title: string
  description: string
  datePublished: string
  slug: string
  category: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.datePublished,
    author: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    articleSection: post.category,
    inLanguage: "en-US",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-content"],
    },
  }
}
