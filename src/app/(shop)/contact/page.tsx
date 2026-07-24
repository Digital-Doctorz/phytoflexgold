import type { Metadata } from "next"
import { Mail, Phone, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | PhytoFlex Gold",
  description:
    "Get in touch with PhytoFlex Gold support. Contact Liquid Health Inc. for product inquiries, order support, or questions about our joint health supplement.",
  alternates: {
    canonical: "https://phytoflexgold.com/contact",
  },
  openGraph: {
    title: "Contact Us | PhytoFlex Gold",
    description:
      "Contact PhytoFlex Gold support for product inquiries and order support.",
    url: "https://phytoflexgold.com/contact",
    type: "website",
  },
}

export default function ContactPage() {
  return (
    <main className="bg-background min-h-screen">
      <section className="max-w-3xl mx-auto px-margin-mobile md:px-gutter-md py-20">
        <h1 className="text-headline-lg font-bold text-on-surface mb-4">
          Contact Us
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-12">
          Have a question about PhytoFlex Gold? We&apos;re here to help.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-surface-container rounded-2xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-container text-on-primary-container rounded-full mb-4">
              <Phone className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-title-md font-bold text-on-surface mb-2">
              Phone
            </h2>
            <a
              href="tel:+919876543210"
              className="text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              +91 98765 43210
            </a>
            <p className="text-body-sm text-on-surface-variant mt-2">
              Mon–Sat, 9am–6pm IST
            </p>
          </div>

          <div className="bg-surface-container rounded-2xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-container text-on-primary-container rounded-full mb-4">
              <Mail className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-title-md font-bold text-on-surface mb-2">
              Email
            </h2>
            <a
              href="mailto:support@phytoflexgold.com"
              className="text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              support@phytoflexgold.com
            </a>
            <p className="text-body-sm text-on-surface-variant mt-2">
              Response within 24 hours
            </p>
          </div>

          <div className="bg-surface-container rounded-2xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-container text-on-primary-container rounded-full mb-4">
              <MapPin className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-title-md font-bold text-on-surface mb-2">
              Address
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Liquid Health Inc.
            </p>
            <p className="text-body-sm text-on-surface-variant mt-2">
              New Delhi, India
            </p>
          </div>
        </div>

        <section className="bg-surface-container-low rounded-2xl p-8 md:p-12">
          <h2 className="text-title-lg font-bold text-on-surface mb-6">
            Send Us a Message
          </h2>
          <form className="space-y-6" action="#" method="POST">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-label-md text-on-surface-variant mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-label-md text-on-surface-variant mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-label-md text-on-surface-variant mb-2"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-label-md text-on-surface-variant mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Tell us more..."
              />
            </div>
            <button
              type="submit"
              className="bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-bold transition-all active:scale-95 hover:shadow-lg"
            >
              Send Message
            </button>
          </form>
        </section>
      </section>
    </main>
  )
}
