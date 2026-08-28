import type { Metadata } from "next"
import { SITE_URL, buildBreadcrumbSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Privacy Policy | PhytoFlex Gold",
  description:
    "Read the PhytoFlex Gold privacy policy. Learn how Liquid Health collects, uses, and protects your personal information when you purchase our joint supplement.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy | PhytoFlex Gold",
    description:
      "Learn how Liquid Health protects your personal information.",
    url: `${SITE_URL}/privacy`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "PhytoFlex Gold Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | PhytoFlex Gold",
    description: "Learn how Liquid Health protects your personal information.",
    images: [`${SITE_URL}/og-image.svg`],
  },
}

export default function PrivacyPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Privacy Policy", url: `${SITE_URL}/privacy` },
  ])

  return (
    <main className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="max-w-3xl mx-auto px-margin-mobile md:px-gutter-md py-20">
        <h1 className="text-headline-lg font-bold text-on-surface mb-8">
          Privacy Policy
        </h1>
        <p className="text-body-md text-on-surface-variant mb-6">
          <strong>Last updated:</strong> January 1, 2025
        </p>
        <p className="text-body-md text-on-surface-variant mb-8">
          Liquid Health by Trade Me India (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
          operates the PhytoFlex Gold website. This page informs you of our
          policies regarding the collection, use, and disclosure of personal
          information when you use our service.
        </p>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Information We Collect
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            We collect several types of information for various purposes to
            provide and improve our service to you:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-body-md text-on-surface-variant">
            <li>
              <strong>Personal Data:</strong> Name, email address, phone number,
              shipping address, and billing information.
            </li>
            <li>
              <strong>Usage Data:</strong> Browser type, pages visited, time
              spent on pages, and other diagnostic data.
            </li>
            <li>
              <strong>Payment Data:</strong> Payment card details are processed
              securely through Razorpay. We do not store full card numbers on
              our servers.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-body-md text-on-surface-variant">
            <li>To process and fulfill your orders</li>
            <li>To send order confirmations and shipping updates</li>
            <li>To provide customer support</li>
            <li>To improve our website and services</li>
            <li>To send marketing communications (with your consent)</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Data Security
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            The security of your data is important to us. We implement
            industry-standard security measures including SSL encryption,
            secure payment processing, and regular security audits. However, no
            method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Third-Party Services
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            We may employ third-party companies and individuals to facilitate
            our service, provide service on our behalf, or perform service-related
            activities. These third parties have access to your personal data only
            to perform these tasks on our behalf and are obligated not to disclose
            or use it for any other purpose.
          </p>
          <ul className="list-disc pl-6 space-y-3 text-body-md text-on-surface-variant">
            <li>
              <strong>Razorpay:</strong> Payment processing
            </li>
            <li>
              <strong>Analytics providers:</strong> Website usage analysis
            </li>
            <li>
              <strong>Shipping carriers:</strong> Order delivery
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Your Rights
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            You have the right to access, correct, or delete your personal
            information. You may also opt out of receiving marketing
            communications from us at any time. To exercise these rights, please
            contact us at{" "}
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
            Cookies
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            We use cookies and similar tracking technologies to track activity
            on our service and hold certain information. You can instruct your
            browser to refuse all cookies or to indicate when a cookie is being
            sent.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Changes to This Policy
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-bold text-on-surface mb-4">
            Contact Us
          </h2>
          <p className="text-body-md text-on-surface-variant">
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
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
