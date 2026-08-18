import Image from "next/image"

const leftBenefits = [
  {
    id: "circulation",
    title: "Optimized Circulation",
    system: "Lungs & Cardiovascular",
    desc: "Promotes healthy blood flow and oxygen delivery throughout the body. Enhanced systemic circulation ensures faster nutrient transport to joints and tissues, accelerating recovery and sustaining all-day energy.",
    stat: "94%",
    statLabel: "bio-available within 20 min",
  },
  {
    id: "glycemic",
    title: "Glycemic Balance",
    system: "Metabolic & Endocrine",
    desc: "Supports steady blood sugar regulation by optimizing insulin sensitivity at the cellular level. Fenugreek and Ashwagandha extracts work synergistically to maintain metabolic equilibrium.",
    stat: "12",
    statLabel: "botanicals targeting 10 biomarkers",
  },
  {
    id: "structural",
    title: "Structural Integrity",
    system: "Bones, Muscles & Connective Tissue",
    desc: "Strengthens the skeletal matrix with high-silica Bamboo extract and Hadjod for calcium absorption. Builds resilient bone density and keeps your body sturdy through every decade of life.",
    stat: "98.2%",
    statLabel: "HPLC pharmaceutical-grade purity",
  },
]

const rightBenefits = [
  {
    id: "nerve-relief",
    title: "Joint & Nerve Relief",
    system: "Joints, Nerves & Inflammation",
    desc: "Directly inhibits 5-LOX and COX-2 inflammatory pathways to reduce joint pain, stiffness, and nerve-related tingling. Boswellia Serrata and Nirgundi deliver clinically proven analgesic support.",
    stat: "5-LOX",
    statLabel: "pathway inhibition for rapid relief",
  },
  {
    id: "detox",
    title: "Systemic Detox",
    system: "Liver, Kidneys & Cellular Purity",
    desc: "Facilitates the removal of metabolic waste and toxins at the cellular level. Malkangni and Rosehip extracts support hepatic and renal function, protecting cells from oxidative damage.",
    stat: "11",
    statLabel: "extracts from high-altitude sources",
  },
  {
    id: "healing",
    title: "Accelerated Healing",
    system: "Tissue Repair & Recovery",
    desc: "Activates the body's natural repair mechanisms to speed recovery after physical exertion, injury, or chronic wear. Supports long-term tissue regeneration for sustained mobility.",
    stat: "48hrs",
    statLabel: "initial molecular changes detected",
  },
]

const allBenefits = [...leftBenefits, ...rightBenefits]

function BodyDiagram() {
  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px] aspect-[1/2] mx-auto z-0">
      <div
        className="absolute inset-[10%] rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,107,53,0.25) 0%, rgba(233,195,73,0.06) 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <Image
        src="/human-body.png"
        alt="Anatomical figure showing the six body systems supported by PhytoFlex Gold"
        fill
        className="object-contain object-center drop-shadow-[0_0_32px_rgba(255,107,53,0.12)]"
        sizes="(max-width: 768px) 280px, (max-width: 1024px) 400px, 480px"
        priority={false}
      />
    </div>
  )
}

function BenefitCard({
  benefit,
  index,
  accent,
}: {
  benefit: (typeof allBenefits)[number]
  index: number
  accent: "primary" | "secondary"
}) {
  const accentText = accent === "secondary" ? "text-secondary" : "text-primary"
  const accentBg =
    accent === "secondary"
      ? "bg-secondary/8 border-secondary/15"
      : "bg-primary/8 border-primary/15"
  const dotColor = accent === "secondary" ? "bg-secondary" : "bg-primary"

  return (
    <article
      className="group relative p-5 sm:p-6"
      itemScope
      itemType="https://schema.org/MedicalTherapy"
    >
      <meta itemProp="name" content={benefit.title} />
      <meta itemProp="description" content={benefit.desc} />

      <div className="flex items-start gap-4">
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accentBg} text-sm font-extrabold ${accentText}`}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className={`flex items-center gap-2 text-xs font-semibold ${accentText} uppercase tracking-wider mb-1.5`}
          >
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotColor}`} />
            {benefit.system}
          </p>
          <h3
            className="text-base sm:text-lg font-bold text-on-surface mb-2 leading-snug"
            itemProp="name"
          >
            {benefit.title}
          </h3>
          <p
            className="text-sm text-on-surface-variant leading-relaxed mb-4"
            itemProp="description"
          >
            {benefit.desc}
          </p>
          <div
            className={`inline-flex items-baseline gap-2 rounded-lg border px-3 py-1.5 ${accentBg}`}
          >
            <span className={`text-lg font-extrabold ${accentText}`}>
              {benefit.stat}
            </span>
            <span className="text-xs text-on-surface-variant leading-tight">
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
    itemListElement: allBenefits.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalTherapy",
        name: b.title,
        description: b.desc,
        applicableCondition: {
          "@type": "MedicalCondition",
          name: b.system,
        },
      },
    })),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#benefits-heading"],
    },
  }

  return (
    <section
      className="py-24 sm:py-32 px-margin-mobile md:px-gutter-md bg-surface"
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
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="inline-block text-label-md font-label-md text-on-surface-variant uppercase tracking-widest mb-5 px-4 py-1.5 rounded-full border border-outline-variant/40 bg-surface-container-low">
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

        {/* Mobile: image + 2-col card grid */}
        <div className="lg:hidden">
          <div className="flex justify-center mb-10">
            <BodyDiagram />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allBenefits.map((b, i) => (
              <BenefitCard
                key={b.id}
                benefit={b}
                index={i}
                accent={i < 3 ? "primary" : "secondary"}
              />
            ))}
          </div>
        </div>

        {/* Desktop: 3-col layout with body diagram centered */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-start">
          <div className="col-span-4 flex flex-col gap-5">
            {leftBenefits.map((b, i) => (
              <BenefitCard key={b.id} benefit={b} index={i} accent="primary" />
            ))}
          </div>

          <div className="col-span-4 flex justify-center items-center lg:sticky lg:top-32 py-8 z-0">
            <BodyDiagram />
          </div>

          <div className="col-span-4 flex flex-col gap-5">
            {rightBenefits.map((b, i) => (
              <BenefitCard
                key={b.id}
                benefit={b}
                index={i + 3}
                accent="secondary"
              />
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 text-center">
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
              className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-4 sm:p-5"
            >
              <p className="text-headline-md font-extrabold text-primary mb-1">
                {item.value}
              </p>
              <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-snug">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
