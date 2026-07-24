export function ComparisonTable() {
  const rows = [
    { feature: "Extraction Method", us: "Supercritical CO2", them: "Chemical Solvents" },
    { feature: "Bio-Availability", us: "94% Absorption", them: "12-15% Absorption" },
    { feature: "HPLC Purity", us: "98.2% Verified", them: "Unverified" },
    { feature: "Clinical Dosage", us: "Therapeutic Potency (25ml 2x daily)", them: "Sub-Therapeutic" },
    { feature: "Synthetic Fillers", us: "0% Artificial", them: "High (Silica/Starch)" },
    { feature: "Botanical Extracts", us: "11 High-Altitude Extracts", them: "2-3 Generic Extracts" },
    { feature: "Absorption Time", us: "Within 20 Minutes", them: "2-4 Hours" },
    { feature: "Certifications", us: "GMP, ISO 9001, FDA, AYUSH, FSSAI", them: "Basic Compliance" },
  ]

  return (
    <section className="py-32 max-w-container-max mx-auto px-margin-mobile md:px-gutter-md" aria-labelledby="comparison-heading">
      <h2
        id="comparison-heading"
        className="text-headline-lg font-headline-lg text-center mb-16"
      >
        The <span className="text-secondary">Biological Advantage</span>
      </h2>
      <p className="text-on-surface-variant text-center mb-12 max-w-2xl mx-auto">
        See how PhytoFlex Gold compares to generic joint supplements across every critical metric.
      </p>
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px]" role="table">
          <caption className="sr-only">
            Comparison between PhytoFlex Gold and generic joint supplements
          </caption>
          <thead>
            <tr className="border-b border-outline-variant/30">
              <th scope="col" className="py-6 text-headline-md font-headline-md">Feature</th>
              <th scope="col" className="py-6 text-headline-md font-headline-md text-primary">PhytoFlex Gold</th>
              <th scope="col" className="py-6 text-headline-md font-headline-md text-on-surface-variant">Generic Supplement</th>
            </tr>
          </thead>
          <tbody className="text-body-md text-body-md">
            {rows.map((row) => (
              <tr key={row.feature} className="border-b border-outline-variant/10">
                <th scope="row" className="py-6 font-bold">{row.feature}</th>
                <td className="py-6">
                  <span className="flex items-center gap-2">
                    <span className="text-green-500" aria-hidden="true">&#10003;</span> {row.us}
                  </span>
                </td>
                <td className="py-6 text-on-surface-variant">{row.them}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
