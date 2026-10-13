import { CartProvider } from "@/context/CartContext"
import { ShopHeader } from "@/components/shop/ShopHeader"
import { ShopFooter } from "@/components/shop/ShopFooter"
import { buildOrganizationSchema, buildWebSiteSchema, buildLocalBusinessSchema } from "@/lib/seo"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebSiteSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusinessSchema()) }}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 p-4 bg-primary text-primary-foreground font-bold"
      >
        Skip to content
      </a>
      <ShopHeader />
      <main id="main-content">{children}</main>
      <ShopFooter />
    </CartProvider>
  )
}
