import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | PhytoFlex Gold",
  description:
    "Read the PhytoFlex Gold terms of service. Understand the terms governing your use of our website and purchase of our joint health supplement.",
  alternates: {
    canonical: "https://phytoflexgold.com/terms",
  },
  openGraph: {
    title: "Terms of Service | PhytoFlex Gold",
    description:
      "Terms and conditions governing your use of the PhytoFlex Gold website.",
    url: "https://phytoflexgold.com/terms",
    type: "website",
  },
}

export default function TermsPage() {
  return (
    <main className="bg-background min-h-screen">
      <article className="max-w-3xl mx-auto px-margin-mobile md:px-gutter-md py-20">
        <h1 className="text-headline-lg font-bold text-on-surface mb-8">
          Terms of Service
        </h1>
        <p className="text-body-md text-on-surface-variant mb-6">
          <strong>Last updated:</strong> January 1, 2024
        </p>
        <p className="text-body-md text-on-surface-variant mb-8">
          Welcome to PhytoFlex Gold. These Terms of Service govern your use of
          our website and the purchase of products from Liquid Health Inc. By
          accessing our website or placing an order, you agree to these terms.
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
            images, is the property of Liquid Health Inc. and is protected by
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
            Liquid Health Inc. shall not be liable for any indirect, incidental,
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
            jurisdiction of the courts in New Delhi, India.
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
            or call us at +91 98765 43210.
          </p>
        </section>
      </article>
    </main>
  )
}
