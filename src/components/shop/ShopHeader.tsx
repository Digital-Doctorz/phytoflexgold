"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { CartDrawer } from "./CartDrawer"

export function ShopHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { itemCount } = useCart()

  const navLinks = [
    { href: "/#science", label: "Science" },
    { href: "/#benefits", label: "Benefits" },
    { href: "/#ingredients", label: "Ingredients" },
    { href: "/#timeline", label: "Timeline" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#faq", label: "FAQ" },
  ]

  return (
    <>
      <header className="bg-background/90 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/30" role="banner">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter-md max-w-container-max mx-auto h-16">
          <Link href="/" className="font-display-lg text-lg sm:text-headline-md font-extrabold tracking-tighter text-on-background" aria-label="PhytoFlex Gold - Home">
            PhytoFlex Gold
          </Link>

          <nav className="hidden lg:flex gap-6 xl:gap-8 items-center" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 min-h-11 min-w-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary-container text-on-primary-container text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center" aria-hidden="true">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-bold transition-all hover:opacity-90 active:scale-95 min-h-11"
            >
              Buy Now
            </button>
          </nav>

          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 min-h-11 min-w-11 flex items-center justify-center text-on-surface-variant"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary-container text-on-primary-container text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center" aria-hidden="true">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-on-background p-2.5 min-h-11 min-w-11 flex items-center justify-center"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden border-t border-outline-variant/20 bg-surface-container-low animate-fade-in" aria-label="Mobile navigation">
            <div className="flex flex-col px-margin-mobile py-4 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-on-surface-variant hover:text-primary py-3 px-2 -mx-2 rounded-lg hover:bg-surface-container transition-colors min-h-11 flex items-center"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { setCartOpen(true); setMobileOpen(false) }}
                className="bg-primary-container text-on-primary-container px-6 py-3.5 rounded-lg font-bold text-center mt-3 min-h-12 hover:opacity-90 active:scale-95 transition-all"
              >
                Buy Now
              </button>
            </div>
          </nav>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
