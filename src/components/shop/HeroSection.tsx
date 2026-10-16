"use client"

import Image from "next/image"
import { ShoppingCart, PlayCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 sm:pt-20 pb-20 md:pb-32" aria-label="Hero">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter-md grid md:grid-cols-2 gap-10 md:gap-12 items-center">
        <div className="z-10 order-2 md:order-1">
          <span className="inline-block py-1.5 px-3 bg-primary-container/10 border border-primary-container/20 text-primary-container rounded-full text-xs sm:text-label-md font-semibold mb-5 sm:mb-6 uppercase tracking-widest">
            Clinical Grade Supplement
          </span>
          <h1 className="text-4xl sm:text-display-sm md:text-display-lg leading-[1.05] mb-5 sm:mb-6 font-extrabold text-balance product-name">
            PhytoFlex Gold: The Bio-Active{" "}
            <span className="text-secondary">Gold Standard</span> for Human Mobility
          </h1>
          <p className="text-body-md sm:text-body-lg text-on-surface-variant mb-8 sm:mb-10 max-w-xl product-description">
            Engineered with a potent matrix of 12 clinical botanicals designed to
            modulate molecular inflammation and restore joint, nerves and muscle
            vitality at a cellular level.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#pricing"
              className="w-full sm:w-auto bg-primary-container text-on-primary-container px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95 min-h-12"
            >
              Order Now <ShoppingCart className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="#science"
              className="w-full sm:w-auto border border-secondary text-secondary px-8 py-4 rounded-lg font-bold text-lg hover:bg-secondary/10 transition-all flex items-center justify-center gap-2 active:scale-95 min-h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Watch video detailing the clinical science behind PhytoFlex Gold"
            >
              Watch Science <PlayCircle className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="relative order-1 md:order-2 flex justify-center items-center">
          <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full scale-75" aria-hidden="true"></div>
          <Image
            alt="PhytoFlex Gold - clinical strength botanical joint supplement, 500ml liquid bottle with 98.2% HPLC purity certification"
            className="relative z-10 w-auto max-h-[360px] sm:max-h-[480px] md:max-h-[640px] h-auto object-contain glow-orange transform hover:scale-105 transition-transform duration-700"
            src="/product-phytoflex-gold.png"
            width={388}
            height={708}
            priority
            sizes="(max-width: 768px) 80vw, 40vw"
          />
        </div>
      </div>
    </section>
  )
}
