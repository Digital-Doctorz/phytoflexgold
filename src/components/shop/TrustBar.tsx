import { ShieldCheck, PackageCheck, Activity, Leaf, Lock } from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  verified_user: <ShieldCheck aria-hidden="true" />,
  inventory_2: <PackageCheck aria-hidden="true" />,
  health_metrics: <Activity aria-hidden="true" />,
  eco: <Leaf aria-hidden="true" />,
  security: <Lock aria-hidden="true" />,
}

export function TrustBar() {
  const badges = [
    { icon: "verified_user", label: "GMP CERTIFIED" },
    { icon: "inventory_2", label: "ISO 9001" },
    { icon: "health_metrics", label: "FDA REGISTERED" },
    { icon: "eco", label: "AYUSH APPROVED" },
    { icon: "security", label: "FSSAI LICENSED" },
  ]

  return (
    <section className="bg-surface-container-lowest py-8 sm:py-10 border-y border-outline-variant/10 overflow-hidden" aria-label="Certifications and trust badges">
      <div className="flex whitespace-nowrap animate-scroll" role="list">
        {[...badges, ...badges].map((badge, i) => (
          <div key={i} className="flex items-center gap-2 sm:gap-3 px-6 sm:px-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all [&_svg]:w-6 [&_svg]:h-6 sm:[&_svg]:w-8 sm:[&_svg]:h-8" role="listitem">
            {iconMap[badge.icon]}
            <span className="font-bold text-sm sm:text-base">{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
