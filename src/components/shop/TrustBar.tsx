import { ShieldCheck, PackageCheck, Activity, Leaf, Lock } from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  verified_user: <ShieldCheck className="w-8 h-8" aria-hidden="true" />,
  inventory_2: <PackageCheck className="w-8 h-8" aria-hidden="true" />,
  health_metrics: <Activity className="w-8 h-8" aria-hidden="true" />,
  eco: <Leaf className="w-8 h-8" aria-hidden="true" />,
  security: <Lock className="w-8 h-8" aria-hidden="true" />,
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
    <section className="bg-surface-container-lowest py-10 border-y border-outline-variant/10 overflow-hidden" aria-label="Certifications and trust badges">
      <div className="flex whitespace-nowrap animate-scroll" role="list">
        {[...badges, ...badges].map((badge, i) => (
          <div key={i} className="flex items-center gap-3 px-12 opacity-50 grayscale hover:grayscale-0 transition-all" role="listitem">
            {iconMap[badge.icon]}
            <span className="font-bold">{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
