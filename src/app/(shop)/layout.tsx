import { CartProvider } from "@/context/CartContext"
import { ShopHeader } from "@/components/shop/ShopHeader"
import { ShopFooter } from "@/components/shop/ShopFooter"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ShopHeader />
      <main>{children}</main>
      <ShopFooter />
    </CartProvider>
  )
}
