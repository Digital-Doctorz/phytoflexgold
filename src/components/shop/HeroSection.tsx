"use client"

import Image from "next/image"
import { ShoppingCart, PlayCircle, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32" aria-label="Hero">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter-md grid md:grid-cols-2 gap-12 items-center">
        <div className="z-10 order-2 md:order-1">
          <span className="inline-block py-1 px-3 bg-primary-container/10 border border-primary-container/20 text-primary-container rounded-full text-label-md font-label-md mb-6 uppercase tracking-widest">
            Clinical Grade Supplement
          </span>
          <h1 className="text-display-sm md:text-display-lg leading-none mb-6 font-extrabold">
            The Bio-Active{" "}
            <span className="text-secondary">Gold Standard</span> for Human Mobility
          </h1>
          <p className="text-body-lg text-on-surface-variant mb-10 max-w-xl">
            Engineered with a potent matrix of 12 clinical botanicals designed to
            modulate molecular inflammation and restore joint, nerves and muscle
            vitality at a cellular level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#pricing"
              className="bg-primary-container text-on-primary-container px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              Order Now <ShoppingCart className="w-5 h-5" />
            </a>
            <a
              href="#science"
              className="border border-secondary text-secondary px-8 py-4 rounded-lg font-bold text-lg hover:bg-secondary/10 transition-all flex items-center justify-center gap-2"
            >
              Watch Science <PlayCircle className="w-5 h-5" />
            </a>
          </div>
          <div className="mt-8 flex items-center gap-4 text-on-surface-variant">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
              ))}
            </div>
            <p className="text-label-md font-label-md">
              Trusted by 24,000+ High-Performance Individuals
            </p>
          </div>
        </div>
        <div className="relative order-1 md:order-2 flex justify-center items-center">
          <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full scale-75" aria-hidden="true"></div>
          <Image
            alt="PhytoFlex Gold - clinical strength botanical joint supplement, 500ml liquid bottle with 98.2% HPLC purity certification"
            className="relative z-10 w-auto max-h-[560px] md:max-h-[640px] h-auto object-contain glow-orange transform hover:scale-105 transition-transform duration-700"
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
