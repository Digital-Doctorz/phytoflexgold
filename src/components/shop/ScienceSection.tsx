"use client"

import { BarChart3, FlaskConical } from "lucide-react"
import { BenefitsSection } from "@/components/shop/BenefitsSection"

export function ScienceSection() {
  return (
    <>
      <section className="py-20 md:py-32 px-margin-mobile md:px-gutter-md max-w-container-max mx-auto scroll-mt-20" id="science" aria-labelledby="science-heading">
        <div className="max-w-container-max mx-auto">
          <p className="text-label-md font-semibold text-primary uppercase tracking-widest mb-8">The Molecular Science</p>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            <div className="md:col-span-8 bg-surface-container-low p-6 sm:p-10 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
              <div>
                <h2
                  id="science-heading"
                  className="text-3xl sm:text-display-sm md:text-display-lg leading-[1.05] mb-6 sm:mb-8 font-extrabold text-balance"
                >
                  Precision <span className="text-secondary italic">Modulation</span> of Inflammatory Pathways.
                </h2>
                <p className="text-body-md sm:text-body-lg text-on-surface-variant max-w-xl mb-8 sm:mb-10">
                  We don&apos;t just mask your signals. PhytoFlex Gold regulates the systemic response that causes biological wear and tear. Our 94% bio-available liquid formula targets 10 key inflammatory biomarkers for rapid joint, nerve, and muscle restoration.
                </p>
              </div>
              <div className="flex gap-3 sm:gap-4 flex-wrap">
                <a href="#benefits" className="bg-primary text-on-primary px-5 sm:px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">SEE ALL BENEFITS</a>
                <a href="#ingredients" className="bg-surface-container-highest text-on-surface px-5 sm:px-6 py-2.5 rounded-lg font-bold text-sm border border-outline-variant/30 hover:bg-surface-bright transition-colors">THE STRATEGY</a>
                <a href="#pricing" className="bg-surface-container-highest text-on-surface px-5 sm:px-6 py-2.5 rounded-lg font-bold text-sm border border-outline-variant/30 hover:bg-surface-bright transition-colors">PLATFORM DATA</a>
              </div>
            </div>
            <div className="md:col-span-4 bg-primary-container p-6 sm:p-10 rounded-2xl flex flex-col justify-between gap-6 text-on-primary-container min-h-[200px]">
              <BarChart3 className="w-10 h-10" aria-hidden="true" />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mb-2">Fast Absorption</h3>
                <p className="text-sm opacity-80 leading-relaxed">Liquid gold technology ensures 94% bio-availability within 20 minutes of ingestion.</p>
              </div>
            </div>
            <div className="md:col-span-4 bg-surface-container-high p-6 sm:p-8 rounded-2xl border border-outline-variant/20">
              <FlaskConical className="text-secondary w-10 h-10 mb-6" aria-hidden="true" />
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">98.2% HPLC PURITY</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Pharmaceutical grade extraction. Every batch is verified. No fillers.</p>
            </div>
            <div className="md:col-span-8 bg-white p-6 sm:p-10 rounded-2xl flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-black">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-secondary bg-surface-container-highest flex items-center justify-center">
                  <span className="text-4xl text-white" aria-hidden="true">MP</span>
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl sm:text-2xl font-bold italic mb-4 leading-relaxed">
                  Molecular Precision
                </h3>
                <p className="text-body-md text-neutral-600 leading-relaxed">
                  Each 25ml dose which needs to be consumed twice, after lunch and after dinner; contains the exact clinical threshold of 12 botanical extracts sourced from high-altitude environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BenefitsSection />
    </>
  )
}
