export function ComparisonTable() {
  const rows = [
    { feature: "Extraction Method", us: "Supercritical CO2", them: "Chemical Solvents" },
    { feature: "Bio-Availability", us: "94% Absorption", them: "12-15% Absorption" },
    { feature: "HPLC Purity", us: "98.2% Verified", them: "Unverified" },
    { feature: "Clinical Dosage", us: "Therapeutic Potency (25ml 2x daily)", them: "Sub-Therapeutic" },
    { feature: "Synthetic Fillers", us: "0% Artificial", them: "High (Silica/Starch)" },
    { feature: "Botanical Extracts", us: "12 High-Altitude Extracts", them: "2-3 Generic Extracts" },
    { feature: "Absorption Time", us: "Within 20 Minutes", them: "2-4 Hours" },
    { feature: "Certifications", us: "GMP, ISO 9001, FDA, AYUSH, FSSAI", them: "Basic Compliance" },
  ]

  return (
    <section className="py-20 md:py-32 max-w-container-max mx-auto px-margin-mobile md:px-gutter-md scroll-mt-20" aria-labelledby="comparison-heading">
      <h2
        id="comparison-heading"
        className="text-2xl sm:text-headline-lg font-bold text-center mb-6 sm:mb-16 text-balance"
      >
        The <span className="text-secondary">Biological Advantage</span>
      </h2>
      <p className="text-body-md sm:text-body-lg text-on-surface-variant text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
        See how PhytoFlex Gold compares to generic joint supplements across every critical metric.
      </p>
      <p className="sm:hidden text-body-sm text-on-surface-variant/70 mb-3 text-center" aria-hidden="true">
        Swipe horizontally to compare →
      </p>
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[560px]" role="table">
          <caption className="sr-only">
            Comparison between PhytoFlex Gold and generic joint supplements
          </caption>
          <thead>
            <tr className="border-b border-outline-variant/30">
              <th scope="col" className="py-4 sm:py-6 pr-4 text-lg sm:text-headline-md font-bold">Feature</th>
              <th scope="col" className="py-4 sm:py-6 pr-4 text-lg sm:text-headline-md font-bold text-primary">PhytoFlex Gold</th>
              <th scope="col" className="py-4 sm:py-6 text-lg sm:text-headline-md font-bold text-on-surface-variant">Generic Supplement</th>
            </tr>
          </thead>
          <tbody className="text-body-sm sm:text-body-md">
            {rows.map((row) => (
              <tr key={row.feature} className="border-b border-outline-variant/10 hover:bg-surface-container/40 transition-colors">
                <th scope="row" className="py-4 sm:py-6 pr-4 font-bold align-top">{row.feature}</th>
                <td className="py-4 sm:py-6 pr-4 align-top">
                  <span className="flex items-start gap-2">
                    <span className="text-green-500" aria-hidden="true">&#10003;</span> {row.us}
                  </span>
                </td>
                <td className="py-4 sm:py-6 text-on-surface-variant align-top">{row.them}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
