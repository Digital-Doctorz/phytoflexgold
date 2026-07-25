import Image from "next/image"

const benefits = [
  {
    id: "circulation",
    title: "Optimized Circulation",
    body: "Lungs & Cardiovascular",
    desc: "Promotes healthy blood flow and oxygen delivery throughout the body. Enhanced systemic circulation ensures faster nutrient transport to joints and tissues, accelerating recovery and sustaining energy levels throughout the day.",
    stat: "94%",
    statLabel: "bio-availability within 20 minutes",
    marker: { top: "28%", side: "left" as const },
    color: "primary",
  },
  {
    id: "glycemic",
    title: "Glycemic Balance",
    body: "Metabolic & Endocrine",
    desc: "Supports steady blood sugar regulation by optimizing insulin sensitivity at the cellular level. Fenugreek and Ashwagandha extracts work synergistically to maintain metabolic equilibrium throughout the day.",
    stat: "12",
    statLabel: "clinical botanicals targeting 10 biomarkers",
    marker: { top: "42%", side: "left" as const },
    color: "primary",
  },
  {
    id: "structural",
    title: "Structural Integrity",
    body: "Bones, Muscles & Connective Tissue",
    desc: "Strengthens the skeletal matrix with high-silica Bamboo extract and Hadjod for calcium absorption. Builds resilient bone density and muscle support, keeping your body sturdy and active through every decade of life.",
    stat: "98.2%",
    statLabel: "HPLC pharmaceutical-grade purity",
    marker: { top: "56%", side: "left" as const },
    color: "primary",
  },
  {
    id: "nerve-relief",
    title: "Joint & Nerve Relief",
    body: "Joints, Nerves & Inflammatory Response",
    desc: "Directly inhibits 5-LOX and COX-2 inflammatory pathways to reduce joint pain, stiffness, and nerve-related tingling. Boswellia Serrata and Nirgundi deliver clinically proven analgesic support without synthetic drugs.",
    stat: "5-LOX",
    statLabel: "pathway inhibition for rapid relief",
    marker: { top: "28%", side: "right" as const },
    color: "secondary",
  },
  {
    id: "detox",
    title: "Systemic Detox",
    body: "Liver, Kidneys & Cellular Purity",
    desc: "Facilitates the removal of metabolic waste and toxins at the cellular level. Malkangni and Rosehip extracts support hepatic and renal function, promoting internal cleansing and protecting cells from oxidative damage.",
    stat: "11",
    statLabel: "botanical extracts from high-altitude sources",
    marker: { top: "42%", side: "right" as const },
    color: "secondary",
  },
  {
    id: "healing",
    title: "Accelerated Healing",
    body: "Tissue Repair & Recovery",
    desc: "Activates the body's natural repair mechanisms to speed recovery after physical exertion, injury, or chronic wear. Reduces downtime between sessions and supports long-term tissue regeneration for sustained mobility.",
    stat: "48hrs",
    statLabel: "initial molecular changes detected",
    marker: { top: "56%", side: "right" as const },
    color: "secondary",
  },
]

function BodyDiagram() {
  return (
    <div className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] aspect-[3/5]">
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
        alt="Anatomical human figure illustrating the six systemic benefits of PhytoFlex Gold: circulation, glycemic balance, structural integrity, joint and nerve relief, systemic detox, and accelerated healing"
        fill
        className="object-contain object-center drop-shadow-[0_0_40px_rgba(255,107,53,0.15)]"
        sizes="(max-width: 768px) 280px, 340px"
        priority={false}
      />

      <svg
        viewBox="0 0 200 320"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        {benefits.map((b) => {
          const y = b.marker.top === "28%" ? 90 : b.marker.top === "42%" ? 135 : 180
          const cx = b.marker.side === "left" ? 65 : 135
          return (
            <g key={b.id}>
              <circle
                cx={cx}
                cy={y}
                r="5"
                fill="none"
                stroke={b.color === "primary" ? "#FF6B35" : "#E9C349"}
                strokeWidth="1.5"
                opacity="0.9"
              >
                <animate
                  attributeName="r"
                  values="5;8;5"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.9;0.4;0.9"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={cx}
                cy={y}
                r="2"
                fill={b.color === "primary" ? "#FF6B35" : "#E9C349"}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function BenefitCard({
  benefit,
  index,
}: {
  benefit: (typeof benefits)[number]
  index: number
}) {
  const isSecondary = benefit.color === "secondary"
  const accent = isSecondary ? "text-secondary" : "text-primary"
  const accentBg = isSecondary
    ? "bg-secondary/10 border-secondary/20"
    : "bg-primary/10 border-primary/20"
  const lineColor = isSecondary ? "bg-secondary/30" : "bg-primary/30"

  return (
    <article
      className="relative group"
      itemScope
      itemType="https://schema.org/MedicalTherapy"
    >
      <meta itemProp="name" content={benefit.title} />
      <meta itemProp="description" content={benefit.desc} />

      <div className="flex gap-4 items-start">
        <div className="flex flex-col items-center gap-1">
          <span
            className={`flex items-center justify-center w-10 h-10 rounded-xl ${accentBg} border text-sm font-extrabold ${accent}`}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div
            className={`w-px h-full min-h-[2rem] ${lineColor} hidden lg:block`}
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0 flex-1 pb-8 last:pb-0">
          <p
            className={`text-xs font-semibold ${accent} uppercase tracking-wider mb-1`}
          >
            {benefit.body}
          </p>
          <h3
            className="text-lg font-bold text-on-surface mb-2"
            itemProp="name"
          >
            {benefit.title}
          </h3>
          <p
            className="text-sm text-on-surface-variant leading-relaxed mb-3"
            itemProp="description"
          >
            {benefit.desc}
          </p>
          <div
            className={`inline-flex items-baseline gap-2 px-3 py-1.5 rounded-lg ${accentBg}`}
          >
            <span className={`text-xl font-extrabold ${accent}`}>
              {benefit.stat}
            </span>
            <span className="text-xs text-on-surface-variant">
              {benefit.statLabel}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export function BenefitsSection() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PhytoFlex Gold - Systemic Health Benefits",
    description:
      "Six clinically validated biological benefits of PhytoFlex Gold botanical supplement covering circulation, glycemic balance, structural integrity, joint and nerve relief, systemic detoxification, and accelerated tissue healing.",
    numberOfItems: 6,
    itemListElement: benefits.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalTherapy",
        name: b.title,
        description: b.desc,
        applicableCondition: {
          "@type": "MedicalCondition",
          name: b.body,
        },
      },
    })),
  }

  return (
    <section
      className="py-32 px-margin-mobile md:px-gutter-md bg-surface"
      id="benefits"
      aria-labelledby="benefits-heading"
    >
      <div className="max-w-container-max mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListSchema),
          }}
        />

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
            PhytoFlex Gold doesn&apos;t just target joints — it initiates a cascade of
            biological improvements across six key physiological systems, delivering
            measurable restoration from the cellular level outward.
          </p>
        </div>

        {/* Benefits grid: left | body | right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-start">
          {/* Left benefits */}
          <div className="lg:col-span-4 space-y-0">
            {benefits
              .filter((b) => b.marker.side === "left")
              .map((b, i) => (
                <BenefitCard key={b.id} benefit={b} index={i} />
              ))}
          </div>

          {/* Center anatomical figure */}
          <div className="lg:col-span-4 flex justify-center items-center lg:sticky lg:top-24">
            <BodyDiagram />
          </div>

          {/* Right benefits */}
          <div className="lg:col-span-4 space-y-0">
            {benefits
              .filter((b) => b.marker.side === "right")
              .map((b, i) => (
                <BenefitCard key={b.id} benefit={b} index={i + 3} />
              ))}
          </div>
        </div>

        {/* Summary row for GEO/AI citation */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {[
            { value: "6", label: "Body Systems Targeted" },
            { value: "12", label: "Clinical Botanicals" },
            { value: "94%", label: "Bio-Availability" },
            { value: "98.2%", label: "HPLC Purity" },
            { value: "20min", label: "Absorption Time" },
            { value: "48hrs", label: "Initial Results" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10"
            >
              <p className="text-headline-md font-extrabold text-primary mb-1">
                {item.value}
              </p>
              <p className="text-xs text-on-surface-variant font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
