"use client"

import { Activity, Dna, Heart, Brain, Droplets, Shield, Zap, Megaphone } from "lucide-react"

const biomarkers = [
  { icon: Activity, label: "NF-kB", color: "red", desc: "The master switch for inflammatory response." },
  { icon: Zap, label: "COX-2", color: "orange", desc: "Targeted enzyme modulation for chronic relief." },
  { icon: Droplets, label: "IL-6", color: "blue", desc: "Reducing systemic inflammation signals." },
  { icon: Megaphone, label: "TNF-α", color: "purple", desc: "Controlling the necrosis factor pathways." },
  { icon: Dna, label: "MMPs", color: "green", desc: "Preserving cartilage and connective tissue." },
  { icon: Heart, label: "CRP", color: "yellow", desc: "Lowering overall biological stress levels." },
  { icon: Zap, label: "SIRT-1", color: "cyan", desc: "Activating longevity and repair genes." },
  { icon: Droplets, label: "ESR", color: "rose", desc: "Normalizing sedimentation rates." },
  { icon: Brain, label: "PGE2", color: "indigo", desc: "Suppressing pain-inducing prostaglandins." },
  { icon: Shield, label: "Lox-5", color: "amber", desc: "Targeting alternative inflammatory paths." },
]

const iconColorMap: Record<string, string> = {
  red: "bg-red-500/10 text-red-500",
  orange: "bg-orange-500/10 text-orange-500",
  blue: "bg-blue-500/10 text-blue-500",
  purple: "bg-purple-500/10 text-purple-500",
  green: "bg-green-500/10 text-green-500",
  yellow: "bg-yellow-500/10 text-yellow-500",
  cyan: "bg-cyan-500/10 text-cyan-500",
  rose: "bg-rose-500/10 text-rose-500",
  indigo: "bg-indigo-500/10 text-indigo-500",
  amber: "bg-amber-500/10 text-amber-500",
}

export function BiomarkersSection() {
  return (
    <section
      className="py-20 md:py-32 bg-surface-container-lowest scroll-mt-20"
      id="biomarkers"
      aria-labelledby="biomarkers-heading"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter-md">
        <div className="text-center mb-12 sm:mb-16">
          <h2
            id="biomarkers-heading"
            className="text-2xl sm:text-headline-lg font-bold mb-4 text-balance"
          >
            Precision Targeting of <span className="text-primary">10 Key Biomarkers</span>
          </h2>
          <p className="text-body-md sm:text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            PhytoFlex Gold is designed to down-regulate pro-inflammatory markers while up-regulating regenerative enzymes. Each biomarker is targeted by specific botanical extracts in our clinical-grade formula.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6" role="list">
          {biomarkers.map((bio) => (
            <article
              key={bio.label}
              className="group bg-surface p-5 sm:p-6 rounded-xl border border-outline-variant/10 hover:border-outline-variant/40 hover:bg-surface-container transition-colors"
              role="listitem"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${iconColorMap[bio.color]}`} aria-hidden="true">
                <bio.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg mb-2">{bio.label}</h4>
              <p className="text-sm text-on-surface-variant">{bio.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
