import Link from "next/link"

export function ShopFooter() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 pt-20 pb-10" role="contentinfo">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter-md px-margin-mobile md:px-gutter-md max-w-container-max mx-auto mb-20">
        <div className="col-span-1 md:col-span-1">
          <div className="text-headline-md font-bold text-on-surface mb-6">Liquid Health</div>
          <p className="text-body-md text-on-surface-variant mb-6">
            Makers of PhytoFlex Gold — clinical-strength wellness protocols for the modern biological athlete. Engineered with 12 high-altitude botanical extracts for maximum joint, nerve, and muscle vitality.
          </p>
          <div className="space-y-3 text-body-md text-on-surface-variant">
            <p className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              <a href="tel:+919555955595" className="hover:text-primary transition-colors">
                +91 9555 9555 95
              </a>
            </p>
            <p className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              <span>
                8/2A, Hazra Road
                <br />
                Kolkata, West Bengal 700021, India
              </span>
            </p>
          </div>
        </div>
        <div>
          <h4 className="text-label-md text-secondary mb-6 uppercase tracking-widest">Protocol</h4>
          <ul className="space-y-4">
            <li><Link href="/#science" className="text-on-surface-variant hover:text-primary transition-colors">The Molecular Science</Link></li>
            <li><Link href="/#benefits" className="text-on-surface-variant hover:text-primary transition-colors">PhytoFlex Gold Benefits</Link></li>
            <li><Link href="/#ingredients" className="text-on-surface-variant hover:text-primary transition-colors">Curated Formulation</Link></li>
            <li><Link href="/#timeline" className="text-on-surface-variant hover:text-primary transition-colors">Recovery Timeline</Link></li>
            <li><Link href="/#pricing" className="text-on-surface-variant hover:text-primary transition-colors">Pricing Plans</Link></li>
            <li><Link href="/#faq" className="text-on-surface-variant hover:text-primary transition-colors">Clinical Clarifications</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-label-md text-secondary mb-6 uppercase tracking-widest">Legal</h4>
          <ul className="space-y-4">
            <li><Link href="/privacy" className="text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/returns" className="text-on-surface-variant hover:text-primary transition-colors">Return &amp; Refund Policy</Link></li>
            <li><Link href="/shipping" className="text-on-surface-variant hover:text-primary transition-colors">Shipping Policy</Link></li>
            <li><Link href="/disclaimer" className="text-on-surface-variant hover:text-primary transition-colors">Medical Disclaimer</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-label-md text-secondary mb-6 uppercase tracking-widest">Support</h4>
          <ul className="space-y-4">
            <li><Link href="/contact" className="text-on-surface-variant hover:text-primary transition-colors">Contact Us</Link></li>
            <li><Link href="/shipping" className="text-on-surface-variant hover:text-primary transition-colors">Shipping FAQ</Link></li>
            <li><Link href="/blog" className="text-on-surface-variant hover:text-primary transition-colors">Blog</Link></li>
            <li><Link href="/order-confirmation" className="text-on-surface-variant hover:text-primary transition-colors">Order Confirmation</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter-md pt-10 border-t border-outline-variant/10 text-center">
        <p className="text-body-md text-on-surface-variant opacity-60">
          &copy; 2024–2026 Liquid Health. PhytoFlex Gold is a product of Liquid Health. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
