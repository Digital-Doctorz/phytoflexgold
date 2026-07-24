"use client"

const phases = [
  {
    week: "1",
    label: "Week 1-2",
    color: "border-secondary text-secondary",
    title: "Phase 1: Molecular Desensitization",
    desc: "Initial reduction in systemic inflammatory markers. The 94% bio-available formula begins modulating NF-kB and COX-2 pathways within 48 hours of first dose.",
    side: "left",
    action: "Take 25ml twice daily after lunch and dinner",
  },
  {
    week: "4",
    label: "Week 4-6",
    color: "border-primary text-primary",
    title: "Phase 2: Restoration",
    desc: "Noticeable improvements in morning stiffness and daily mobility. Boswellia Serrata and Nirgundi bio-actives reach therapeutic saturation levels.",
    side: "right",
    action: "Continue consistent daily dosage",
  },
  {
    week: "12",
    label: "Week 12+",
    color: "border-white text-white",
    title: "Phase 3: Optimization",
    desc: "Full physiological stabilization and peak vitality. All 10 key biomarkers reach optimal ranges for sustained joint, nerve, and muscle health.",
    side: "left",
    action: "Maintain protocol for long-term results",
  },
]

export function TimelineSection() {
  return (
    <section className="py-32 relative overflow-hidden" id="timeline" aria-labelledby="timeline-heading">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-gutter-md relative">
        <div className="text-center mb-24">
          <h2
            id="timeline-heading"
            className="text-headline-lg font-headline-lg mb-4"
          >
            The Recovery Cycle <span className="text-secondary">Timeline</span>
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            A 12-week clinical protocol for systemic mobility restoration. Follow this evidence-based timeline for optimal results.
          </p>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-48 bottom-0 w-1 bg-gradient-to-b from-primary-container to-secondary opacity-30 rounded-full" aria-hidden="true"></div>
        <div className="space-y-24 relative" role="list">
          {phases.map((phase) => (
            <div key={phase.week} className="flex items-center group" role="listitem">
              {phase.side === "left" && (
                <div className="w-1/2 pr-12 text-right hidden md:block">
                  <h3 className={`font-bold text-2xl ${phase.color.replace('border', 'text').replace('text-secondary', 'text-secondary').replace('text-primary', 'text-primary').replace('text-white', 'text-white')} mb-2`}>
                    {phase.label}
                  </h3>
                  <p className="text-on-surface-variant">{phase.desc}</p>
                </div>
              )}
              <div
                className={`z-10 w-12 h-12 rounded-full bg-background border-4 ${phase.color} flex items-center justify-center font-bold group-hover:scale-110 transition-transform`}
                aria-hidden="true"
              >
                {phase.week}
              </div>
              <div className={`w-1/2 ${phase.side === 'left' ? 'pl-12' : 'pr-12 text-right'} md:text-left`}>
                <h3 className={`font-bold text-2xl ${phase.color.replace('border', 'text').replace('text-secondary', 'text-secondary').replace('text-primary', 'text-primary').replace('text-white', 'text-white')} mb-2 md:hidden`}>
                  {phase.label}
                </h3>
                <p className="text-headline-md font-headline-md">{phase.title}</p>
                <p className="text-on-surface-variant md:hidden">{phase.desc}</p>
                {phase.side === "right" && (
                  <p className="text-on-surface-variant hidden md:block mt-2">{phase.desc}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
