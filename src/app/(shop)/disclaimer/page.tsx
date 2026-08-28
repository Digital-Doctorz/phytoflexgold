import type { Metadata } from "next"
import { SITE_URL, buildBreadcrumbSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Medical Disclaimer | PhytoFlex Gold",
  description:
    "Read the PhytoFlex Gold medical disclaimer. PhytoFlex Gold is a dietary supplement and is not intended to diagnose, treat, cure, or prevent any disease.",
  alternates: {
    canonical: `${SITE_URL}/disclaimer`,
  },
  openGraph: {
    title: "Medical Disclaimer | PhytoFlex Gold",
    description:
      "Important medical disclaimer for PhytoFlex Gold dietary supplement.",
    url: `${SITE_URL}/disclaimer`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "PhytoFlex Gold Medical Disclaimer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Medical Disclaimer | PhytoFlex Gold",
    description: "Important medical disclaimer for PhytoFlex Gold dietary supplement.",
    images: [`${SITE_URL}/opengraph-image`],
  },
}

export default function DisclaimerPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Disclaimer", url: `${SITE_URL}/disclaimer` },
  ])

  return (
    <main className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="max-w-3xl mx-auto px-margin-mobile md:px-gutter-md py-20">
        <h1 className="text-headline-lg font-bold text-on-surface mb-8">
          Medical Disclaimer
        </h1>
        <p className="text-body-md text-on-surface-variant mb-6">
          <strong>Last updated:</strong> January 1, 2025
        </p>

        <section className="mb-10">
          <div className="bg-error-container/20 border border-error/30 rounded-lg p-6 mb-8">
            <p className="text-body-lg text-on-surface font-semibold">
              IMPORTANT: PhytoFlex Gold is a dietary supplement. It is NOT
              intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </div>

          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            No Medical Advice
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            The information provided on this website, including but not limited
            to text, graphics, images, and other material, is for informational
            purposes only. It is not intended to be a substitute for
            professional medical advice, diagnosis, or treatment.
          </p>
          <p className="text-body-md text-on-surface-variant mb-4">
            Always seek the advice of your physician or other qualified health
            provider with any questions you may have regarding a medical
            condition. Never disregard professional medical advice or delay in
            seeking it because of something you have read on this website.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Product Use
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            PhytoFlex Gold is a dietary supplement formulated with botanical
            extracts. Individual results may vary. The statements on this
            website have not been evaluated by the Food Safety and Standards
            Authority of India (FSSAI) or the Ministry of AYUSH.
          </p>
          <p className="text-body-md text-on-surface-variant mb-4">
            Do not use PhytoFlex Gold if you are pregnant, nursing, taking
            medication, or have a known medical condition. Consult your
            healthcare provider before starting any new supplement regimen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Testimonials
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Testimonials appearing on this website represent the experiences of
            individual users. Your experience may differ. The testimonials on
            this website are not intended to make claims that these products can
            be used to diagnose, treat, cure, mitigate, or prevent any disease.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Clinical References
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Scientific references cited on this website are for informational
            purposes only and do not constitute an endorsement of the product.
            Results from referenced studies may not be representative of
            individual outcomes.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Contact Us
          </h2>
          <p className="text-body-md text-on-surface-variant">
            If you have any questions about this Medical Disclaimer, please
            contact us at{" "}
            <a
              href="mailto:support@phytoflexgold.com"
              className="text-primary hover:underline"
            >
              support@phytoflexgold.com
            </a>{" "}
            or call us at{" "}
            <a
              href="tel:+919555955595"
              className="text-primary hover:underline"
            >
              +91 9555 9555 95
            </a>
            .
          </p>
          <p className="text-body-md text-on-surface-variant mt-4">
            Liquid Health by Trade Me India
            <br />
            8/2A, Hazra Road
            <br />
            Kolkata, West Bengal 700021, India
          </p>
        </section>
      </article>
    </main>
  )
}
