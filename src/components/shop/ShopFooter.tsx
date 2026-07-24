import Link from "next/link"

export function ShopFooter() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 pt-20 pb-10" role="contentinfo">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter-md px-margin-mobile md:px-gutter-md max-w-container-max mx-auto mb-20">
        <div className="col-span-1 md:col-span-1">
          <div className="text-headline-md font-bold text-on-surface mb-6">PhytoFlex Gold</div>
          <p className="text-body-md text-on-surface-variant mb-6">
            Clinical-strength wellness protocols for the modern biological athlete. Engineered with 12 high-altitude botanical extracts for maximum joint, nerve, and muscle vitality.
          </p>
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
            <li><Link href="/disclaimer" className="text-on-surface-variant hover:text-primary transition-colors">Medical Disclaimer</Link></li>
            <li><Link href="/terms" className="text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-label-md text-secondary mb-6 uppercase tracking-widest">Support</h4>
          <ul className="space-y-4">
            <li><Link href="/contact" className="text-on-surface-variant hover:text-primary transition-colors">Contact Us</Link></li>
            <li><Link href="/shipping" className="text-on-surface-variant hover:text-primary transition-colors">Shipping FAQ</Link></li>
            <li><Link href="/blog" className="text-on-surface-variant hover:text-primary transition-colors">Blog</Link></li>
            <li><Link href="/account" className="text-on-surface-variant hover:text-primary transition-colors">My Account</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter-md pt-10 border-t border-outline-variant/10 text-center">
        <p className="text-body-md text-on-surface-variant opacity-60">
          &copy; 2024–2026 Liquid Health Inc. Clinical strength wellness protocols. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
