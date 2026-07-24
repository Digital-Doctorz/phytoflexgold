import type { Metadata } from "next"
import { Truck, Clock, RotateCcw, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Shipping Policy | PhytoFlex Gold",
  description:
    "Learn about PhytoFlex Gold shipping options, delivery times, and return policy. Free shipping on orders above Rs. 2,000 across India.",
  alternates: {
    canonical: "https://phytoflexgold.com/shipping",
  },
  openGraph: {
    title: "Shipping Policy | PhytoFlex Gold",
    description:
      "Shipping options, delivery times, and return policy for PhytoFlex Gold.",
    url: "https://phytoflexgold.com/shipping",
    type: "website",
  },
}

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5–7 business days across India. Metro cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata) typically receive orders within 3–5 business days. Remote areas may take 7–10 business days.",
  },
  {
    question: "Is there free shipping?",
    answer:
      "Yes. Orders above Rs. 2,000 qualify for free standard shipping across India. Orders below Rs. 2,000 incur a flat shipping fee of Rs. 99.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we ship only within India. We are working on expanding to international markets. Contact us for specific inquiries about international shipping.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you will receive an email and SMS with a tracking number. You can track your order through our shipping partner's website or app.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day satisfaction guarantee. If you are not satisfied with your purchase, you may return unopened products within 30 days of delivery for a full refund. Contact us at support@phytoflexgold.com to initiate a return.",
  },
  {
    question: "What if my order arrives damaged?",
    answer:
      "If your order arrives damaged, please contact us within 48 hours of delivery with photos of the damage. We will arrange a replacement or full refund at no extra cost.",
  },
]

export default function ShippingPage() {
  return (
    <main className="bg-background min-h-screen">
      <section className="max-w-3xl mx-auto px-margin-mobile md:px-gutter-md py-20">
        <h1 className="text-headline-lg font-bold text-on-surface mb-4">
          Shipping &amp; Delivery
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-12">
          Fast, reliable delivery across India with free shipping on orders
          above Rs. 2,000.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          <div className="bg-surface-container rounded-2xl p-6 flex gap-4">
            <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-title-md font-bold text-on-surface mb-1">
                Free Shipping
              </h2>
              <p className="text-body-md text-on-surface-variant">
                On all orders above Rs. 2,000 across India
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-2xl p-6 flex gap-4">
            <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-title-md font-bold text-on-surface mb-1">
                Fast Delivery
              </h2>
              <p className="text-body-md text-on-surface-variant">
                3–7 business days depending on location
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-2xl p-6 flex gap-4">
            <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-title-md font-bold text-on-surface mb-1">
                30-Day Returns
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Satisfaction guarantee on unopened products
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-2xl p-6 flex gap-4">
            <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-title-md font-bold text-on-surface mb-1">
                Secure Packaging
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Tamper-proof, temperature-controlled shipping
              </p>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-title-lg font-bold text-on-surface mb-6">
            Shipping Options
          </h2>
          <div className="overflow-x-auto">
            <table
              className="w-full text-left border-collapse"
              role="table"
            >
              <caption className="sr-only">
                Shipping options and delivery times
              </caption>
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th scope="col" className="py-3 px-4 text-label-md text-on-surface-variant">
                    Method
                  </th>
                  <th scope="col" className="py-3 px-4 text-label-md text-on-surface-variant">
                    Cost
                  </th>
                  <th scope="col" className="py-3 px-4 text-label-md text-on-surface-variant">
                    Delivery Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-outline-variant/10">
                  <td className="py-3 px-4 text-body-md text-on-surface">Standard Shipping</td>
                  <td className="py-3 px-4 text-body-md text-on-surface">Rs. 99 (Free above Rs. 2,000)</td>
                  <td className="py-3 px-4 text-body-md text-on-surface">5–7 business days</td>
                </tr>
                <tr className="border-b border-outline-variant/10">
                  <td className="py-3 px-4 text-body-md text-on-surface">Express Shipping</td>
                  <td className="py-3 px-4 text-body-md text-on-surface">Rs. 199</td>
                  <td className="py-3 px-4 text-body-md text-on-surface">2–3 business days</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-body-md text-on-surface">Metro Same-Day</td>
                  <td className="py-3 px-4 text-body-md text-on-surface">Rs. 349</td>
                  <td className="py-3 px-4 text-body-md text-on-surface">Same day (metro cities only)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-title-lg font-bold text-on-surface mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="bg-surface-container rounded-xl overflow-hidden group"
              >
                <summary className="px-6 py-4 cursor-pointer text-title-sm font-bold text-on-surface list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-on-surface-variant group-open:rotate-180 transition-transform" aria-hidden="true">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-body-md text-on-surface-variant">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
