import Image from "next/image"
import type { LucideIcon } from "lucide-react"
import { Wind, Hand, Bone, Brain, FlaskConical, Cross } from "lucide-react"

const leftBenefits = [
  {
    icon: Wind,
    title: "Optimized Circulation",
    desc: "Encourages better breathing and blood flow, supporting healthy lungs and efficient systemic circulation for nutrient delivery.",
  },
  {
    icon: Hand,
    title: "Glycemic Balance",
    desc: "Supports a healthier balance of sugar in your body, helping to keep your blood sugar levels steady throughout the day.",
  },
  {
    icon: Bone,
    title: "Structural Integrity",
    desc: "Builds strong bones and muscles, providing the extra support needed to keep your body sturdy, active, and resilient.",
  },
]

const rightBenefits = [
  {
    icon: Brain,
    title: "Joint & Nerve Relief",
    desc: "Reduces joint pain and inflammation while keeping nerves happy, alleviating discomfort from chronic conditions and tingling sensations.",
  },
  {
    icon: FlaskConical,
    title: "Systemic Detox",
    desc: "Clears out harmful toxins by helping remove bad chemicals that can build up in your body over time, promoting cellular purity.",
  },
  {
    icon: Cross,
    title: "Accelerated Healing",
    desc: "Assists your body in repairing and rebuilding itself faster, reducing downtime after physical exertion or injury.",
  },
]

function BenefitItem({
  icon: Icon,
  title,
  desc,
  accent,
}: {
  icon: LucideIcon
  title: string
  desc: string
  accent: "primary" | "secondary"
}) {
  const iconColor = accent === "primary" ? "text-primary" : "text-secondary"

  return (
    <article className="flex gap-4 items-start">
      <div
        className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-surface-container-high border border-outline-variant/20 ${iconColor}`}
        aria-hidden="true"
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className={`text-lg font-bold mb-2 ${iconColor}`}>
          {title}
        </h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {desc}
        </p>
      </div>
    </article>
  )
}

export function BenefitsSection() {
  return (
    <section
      className="py-32 px-margin-mobile md:px-gutter-md bg-surface"
      id="benefits"
      aria-labelledby="benefits-heading"
    >
      <div className="max-w-container-max mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-block text-label-md font-label-md text-on-surface-variant uppercase tracking-widest mb-6 px-4 py-1.5 rounded-full border border-outline-variant/40 bg-surface-container-low">
            Systemic Impact
          </span>
          <p className="text-label-md font-label-md text-primary uppercase tracking-widest mb-4">
            PhytoFlex Gold Benefits
          </p>
          <h2
            id="benefits-heading"
            className="text-display-sm md:text-display-lg font-extrabold leading-tight mb-6 text-on-surface"
          >
            Targeted Biological Restoration
          </h2>
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            PhytoFlex Gold doesn&apos;t just target joints; it initiates a cascade of
            biological improvements across multiple physiological systems.
          </p>
        </div>

        {/* Benefits grid: left | body | right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left benefits */}
          <div className="lg:col-span-4 space-y-10 lg:space-y-12 order-2 lg:order-1">
            {leftBenefits.map((item) => (
              <BenefitItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
                accent="primary"
              />
            ))}
          </div>

          {/* Center anatomical figure */}
          <div className="lg:col-span-4 order-1 lg:order-2 flex justify-center items-center">
            <div className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] aspect-[3/5]">
              {/* Soft radial glow behind the figure */}
              <div
                className="absolute inset-[10%] rounded-full blur-3xl opacity-50 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,107,53,0.28) 0%, rgba(233,195,73,0.08) 45%, transparent 70%)",
                }}
                aria-hidden="true"
              />
              <Image
                src="/human-body.png"
                alt="Anatomical human figure illustrating systemic benefits of PhytoFlex Gold across joints, nerves, muscles, and circulation"
                fill
                className="object-contain object-center drop-shadow-[0_0_40px_rgba(255,107,53,0.15)]"
                sizes="(max-width: 768px) 280px, 340px"
                priority={false}
              />
            </div>
          </div>

          {/* Right benefits */}
          <div className="lg:col-span-4 space-y-10 lg:space-y-12 order-3">
            {rightBenefits.map((item) => (
              <BenefitItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
                accent="secondary"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
