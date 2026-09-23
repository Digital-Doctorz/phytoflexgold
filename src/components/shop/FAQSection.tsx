"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { homeFaqs as faqs } from "@/lib/faqs"

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 md:py-32 bg-surface-container-lowest scroll-mt-20" id="faq" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-gutter-md">
        <h2
          id="faq-heading"
          className="text-2xl sm:text-headline-lg font-bold text-center mb-10 sm:mb-16 text-balance"
        >
          Clinical <span className="text-primary">Clarifications</span>
        </h2>
        <div className="space-y-3 sm:space-y-4" role="list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="glass-card rounded-xl overflow-hidden"
              role="listitem"
            >
              <h3>
                <button
                  id={`faq-question-${i}`}
                  className="w-full flex justify-between items-center gap-4 p-5 sm:p-6 text-left hover:bg-surface-container transition-colors min-h-14"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="font-bold text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              <div
                id={`faq-answer-${i}`}
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${openIndex === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-body-sm sm:text-body-md text-on-surface-variant leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
