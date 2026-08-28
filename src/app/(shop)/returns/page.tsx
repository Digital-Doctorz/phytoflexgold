import type { Metadata } from "next"
import { SITE_URL, buildBreadcrumbSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Return & Refund Policy | PhytoFlex Gold",
  description:
    "Read the Liquid Health return and refund policy for PhytoFlex Gold. 30-day satisfaction guarantee, easy returns, and fast refunds. Contact us for assistance.",
  alternates: {
    canonical: `${SITE_URL}/returns`,
  },
  openGraph: {
    title: "Return & Refund Policy | PhytoFlex Gold",
    description:
      "Liquid Health 30-day return and refund policy for PhytoFlex Gold.",
    url: `${SITE_URL}/returns`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "PhytoFlex Gold Return & Refund Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Return & Refund Policy | PhytoFlex Gold",
    description: "Liquid Health 30-day return and refund policy for PhytoFlex Gold.",
    images: [`${SITE_URL}/opengraph-image`],
  },
}

export default function ReturnsPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Return Policy", url: `${SITE_URL}/returns` },
  ])

  return (
    <main className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="max-w-3xl mx-auto px-margin-mobile md:px-gutter-md py-20">
        <h1 className="text-headline-lg font-bold text-on-surface mb-8">
          Return &amp; Refund Policy
        </h1>
        <p className="text-body-md text-on-surface-variant mb-6">
          <strong>Last updated:</strong> January 1, 2025
        </p>
        <p className="text-body-md text-on-surface-variant mb-8">
          Liquid Health by Trade Me India (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
          wants you to be completely satisfied with every bottle of PhytoFlex
          Gold you purchase. This Return &amp; Refund Policy explains how you can
          return a product and receive a refund.
        </p>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            30-Day Satisfaction Guarantee
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            Every order of PhytoFlex Gold is covered by our 30-day satisfaction
            guarantee. If you are not fully satisfied with your purchase, you
            may return it within 30 days of the delivery date.
          </p>
          <ul className="list-disc pl-6 space-y-3 text-body-md text-on-surface-variant">
            <li>
              <strong>Unopened products:</strong> Full refund of the product
              price within 30 days of delivery.
            </li>
            <li>
              <strong>Opened products:</strong> If you did not experience the
              expected results, opened bottles may still be eligible for a
              partial refund, reviewed on a case-by-case basis.
            </li>
            <li>
              <strong>Damaged or defective items:</strong> If your order arrives
              damaged, tampered with, or defective, we will arrange a free
              replacement or full refund — including shipping costs.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            How to Initiate a Return
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            To start a return, please contact our customer support team with your
            order number and reason for return:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-body-md text-on-surface-variant">
            <li>
              Email:{" "}
              <a
                href="mailto:support@phytoflexgold.com"
                className="text-primary hover:underline"
              >
                support@phytoflexgold.com
              </a>
            </li>
            <li>
              Phone:{" "}
              <a
                href="tel:+919555955595"
                className="text-primary hover:underline"
              >
                +91 9555 9555 95
              </a>
            </li>
          </ul>
          <p className="text-body-md text-on-surface-variant mt-4">
            For damaged or defective items, please include clear photos of the
            damage within 48 hours of delivery so we can process your request
            quickly.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Refund Processing
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            Once we receive your return request and confirm eligibility, we will
            process your refund within 5–7 business days. Refunds are issued to
            the original payment method used at checkout (via Razorpay) and may
            take an additional few days to appear on your statement depending on
            your bank or card provider.
          </p>
          <p className="text-body-md text-on-surface-variant">
            Shipping charges are only refunded when the return is due to an
            error on our part (damaged, defective, or incorrect items).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Non-Returnable Items
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            For hygiene and safety reasons, we are unable to accept returns on
            products that have been opened and are more than 30 days past the
            delivery date, or products that have been tampered with by anyone
            other than the manufacturer.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Contact Us
          </h2>
          <p className="text-body-md text-on-surface-variant">
            If you have any questions about this Return &amp; Refund Policy,
            please contact us at{" "}
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
