import { CartProvider } from "@/context/CartContext"
import { ShopHeader } from "@/components/shop/ShopHeader"
import { ShopFooter } from "@/components/shop/ShopFooter"
import { buildSiteGraphSchema } from "@/lib/seo"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {/* Organization, WebSite and LocalBusiness: defined once here for every (shop) page. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSiteGraphSchema()) }}
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
