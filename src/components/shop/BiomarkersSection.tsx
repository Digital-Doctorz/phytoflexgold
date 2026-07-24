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

const colorMap: Record<string, string> = {
  red: "bg-red-500/10 text-red-500 border-red-500/40",
  orange: "bg-orange-500/10 text-orange-500 border-orange-500/40",
  blue: "bg-blue-500/10 text-blue-500 border-blue-500/40",
  purple: "bg-purple-500/10 text-purple-500 border-purple-500/40",
  green: "bg-green-500/10 text-green-500 border-green-500/40",
  yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/40",
  cyan: "bg-cyan-500/10 text-cyan-500 border-cyan-500/40",
  rose: "bg-rose-500/10 text-rose-500 border-rose-500/40",
  indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/40",
  amber: "bg-amber-500/10 text-amber-500 border-amber-500/40",
}

export function BiomarkersSection() {
  return (
    <section
      className="py-32 bg-surface-container-lowest"
      id="biomarkers"
      aria-labelledby="biomarkers-heading"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter-md">
        <div className="text-center mb-16">
          <h2
            id="biomarkers-heading"
            className="text-headline-lg font-headline-lg mb-4"
          >
            Precision Targeting of <span className="text-primary">10 Key Biomarkers</span>
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            PhytoFlex Gold is designed to down-regulate pro-inflammatory markers while up-regulating regenerative enzymes. Each biomarker is targeted by specific botanical extracts in our clinical-grade formula.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6" role="list">
          {biomarkers.map((bio) => (
            <article
              key={bio.label}
              className={`group bg-surface p-6 rounded-xl border border-outline-variant/10 hover:${colorMap[bio.color]} transition-colors`}
              role="listitem"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${colorMap[bio.color]}`} aria-hidden="true">
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
