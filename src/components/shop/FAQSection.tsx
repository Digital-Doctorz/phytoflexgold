"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "How quickly will I see results with PhytoFlex Gold?",
    a: "While initial molecular changes occur within the first 48 hours, most users report significant mobility gains between weeks 3 and 4 of consistent use. The full 12-week clinical protocol delivers complete physiological stabilization and peak vitality.",
  },
  {
    q: "Is PhytoFlex Gold safe to use with other medications?",
    a: "Our formula is 100% botanical with zero synthetic fillers. However, we always recommend consulting with your primary care physician before starting any new clinical supplement protocol, especially if taking blood thinners.",
  },
  {
    q: "What makes PhytoFlex Gold better than standard glucosamine?",
    a: "Glucosamine only provides the building blocks. PhytoFlex Gold addresses the chronic inflammatory fires that break down cartilage in the first place, allowing the body's natural repair mechanisms to function. Our 94% bio-available liquid formula ensures rapid absorption within 20 minutes of ingestion.",
  },
  {
    q: "What is the recommended dosage for PhytoFlex Gold?",
    a: "Each 25ml dose should be consumed twice daily, after lunch and after dinner. Each dose contains the exact clinical threshold of 11 botanical extracts sourced from high-altitude environments for maximum efficacy.",
  },
  {
    q: "How is PhytoFlex Gold extracted and what is its purity?",
    a: "PhytoFlex Gold uses supercritical CO2 extraction (not chemical solvents), achieving 98.2% HPLC purity. This pharmaceutical-grade process preserves the delicate botanical profile for maximum biological uptake, ensuring each batch meets clinical standards.",
  },
  {
    q: "What certifications does PhytoFlex Gold hold?",
    a: "PhytoFlex Gold is GMP Certified, ISO 9001 compliant, FDA Registered, AYUSH Approved, and FSSAI Licensed. Every batch undergoes rigorous quality verification with zero fillers or artificial additives.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-32 bg-surface-container-lowest" id="faq" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-gutter-md">
        <h2
          id="faq-heading"
          className="text-headline-lg font-headline-lg text-center mb-16"
        >
          Clinical <span className="text-primary">Clarifications</span>
        </h2>
        <div className="space-y-4" role="list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="glass-card rounded-xl overflow-hidden"
              role="listitem"
            >
              <h3>
                <button
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-surface-container transition-colors"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="font-bold text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              {openIndex === i && (
                <div
                  id={`faq-answer-${i}`}
                  className="p-6 pt-0 text-on-surface-variant border-t border-outline-variant/10"
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
