"use client"

import { useEffect } from "react"
import { X, Trash2, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, total, itemCount, removeItem } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-full max-w-md bg-surface-container-low border-l border-outline-variant/20 z-50 flex flex-col animate-slide-in-right shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`Shopping cart, ${itemCount} items`}
      >
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-outline-variant/20">
          <h2 className="text-xl sm:text-headline-md font-bold">
            Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
          </h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-2 -m-2 min-h-11 min-w-11 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5 sm:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-on-surface-variant mt-20">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" aria-hidden="true" />
              <p className="text-body-lg">Your cart is empty</p>
              <p className="text-body-sm mt-2">Add a protocol to get started</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.tier.label}`} className="flex items-center gap-4 p-4 rounded-lg bg-surface-container">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-on-surface">{item.productName}</p>
                  <p className="text-body-sm text-on-surface-variant">{item.tier.label} — {item.tier.quantity} bottle{item.tier.quantity > 1 ? "s" : ""}</p>
                  <p className="text-primary-container font-bold mt-1">{formatPrice(item.tier.price)}</p>
                </div>
                <button
                  onClick={() => removeItem(item.productId, item.tier.label)}
                  className="text-on-surface-variant hover:text-error transition-colors p-2.5 min-h-11 min-w-11 flex items-center justify-center rounded-lg hover:bg-error-container/10 shrink-0"
                  aria-label={`Remove ${item.productName} ${item.tier.label} from cart`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-outline-variant/20 space-y-4">
            <div className="flex justify-between text-body-lg">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="font-bold text-on-surface">{formatPrice(total)}</span>
            </div>
            <p className="text-body-sm text-on-surface-variant">Shipping & taxes calculated at checkout</p>
            <Button
              className="w-full min-h-12"
              size="lg"
              onClick={() => {
                onClose()
                router.push("/checkout")
              }}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
