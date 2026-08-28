import type { Metadata } from "next"
import { SITE_URL, buildBreadcrumbSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Terms of Service | PhytoFlex Gold",
  description:
    "Read the PhytoFlex Gold terms of service. Understand the terms governing your use of our website and purchase of our joint health supplement.",
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
  openGraph: {
    title: "Terms of Service | PhytoFlex Gold",
    description:
      "Terms and conditions governing your use of the PhytoFlex Gold website.",
    url: `${SITE_URL}/terms`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "PhytoFlex Gold Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | PhytoFlex Gold",
    description: "Terms and conditions governing your use of the PhytoFlex Gold website.",
    images: [`${SITE_URL}/opengraph-image`],
  },
}

export default function TermsPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Terms of Service", url: `${SITE_URL}/terms` },
  ])

  return (
    <main className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="max-w-3xl mx-auto px-margin-mobile md:px-gutter-md py-20">
        <h1 className="text-headline-lg font-bold text-on-surface mb-8">
          Terms of Service
        </h1>
        <p className="text-body-md text-on-surface-variant mb-6">
          <strong>Last updated:</strong> January 1, 2025
        </p>
        <p className="text-body-md text-on-surface-variant mb-8">
          Welcome to PhytoFlex Gold, a product of Liquid Health by Trade Me India. These Terms of
          Service govern your use of our website and the purchase of products
          from Liquid Health by Trade Me India. By accessing our website or placing an order, you
          agree to these terms.
        </p>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Products and Orders
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            All products are subject to availability. We reserve the right to
            discontinue any product at any time. Prices for products are subject
            to change without notice. We shall not be liable to you or any
            third-party for any price change.
          </p>
          <p className="text-body-md text-on-surface-variant">
            By placing an order, you represent that the information you provide
            is accurate and complete. We reserve the right to refuse or cancel
            any order for any reason.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Payment
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            We accept payments through Razorpay. All payment information is
            processed securely. We do not store credit card details on our
            servers.
          </p>
          <p className="text-body-md text-on-surface-variant">
            All prices are displayed in Indian Rupees (INR) and include
            applicable taxes unless otherwise stated.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Shipping and Delivery
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            Shipping times are estimates and may vary based on location and
            shipping method selected. We are not responsible for delays caused
            by shipping carriers or customs processing.
          </p>
          <p className="text-body-md text-on-surface-variant">
            Risk of loss and title for items purchased pass to you upon delivery
            to the carrier.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Returns and Refunds
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            We offer a 30-day satisfaction guarantee. If you are not satisfied
            with your purchase, you may return unopened products within 30 days
            of delivery for a full refund. Opened products may be eligible for
            a partial refund on a case-by-case basis.
          </p>
          <p className="text-body-md text-on-surface-variant">
            To initiate a return, please contact us at{" "}
            <a
              href="mailto:support@phytoflexgold.com"
              className="text-primary hover:underline"
            >
              support@phytoflexgold.com
            </a>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Intellectual Property
          </h2>
          <p className="text-body-md text-on-surface-variant">
            All content on this website, including text, graphics, logos, and
            images, is the property of Liquid Health by Trade Me India and is protected by
            applicable intellectual property laws. You may not reproduce,
            distribute, or create derivative works without our express written
            permission.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Limitation of Liability
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Liquid Health by Trade Me India shall not be liable for any indirect, incidental,
            special, or consequential damages resulting from the use or
            inability to use our products or services. Our total liability shall
            not exceed the amount paid by you for the product in question.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Governing Law
          </h2>
          <p className="text-body-md text-on-surface-variant">
            These Terms shall be governed by and construed in accordance with
            the laws of India. Any disputes shall be subject to the exclusive
            jurisdiction of the courts in Kolkata, India.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Contact Us
          </h2>
          <p className="text-body-md text-on-surface-variant">
            If you have any questions about these Terms of Service, please
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
