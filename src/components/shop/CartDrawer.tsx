"use client"

import { X, Trash2 } from "lucide-react"
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

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-container-low border-l border-outline-variant/20 z-50 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
          <h2 className="text-headline-md font-headline-md">
            Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-on-surface-variant mt-20">
              <p className="text-body-lg">Your cart is empty</p>
              <p className="text-sm mt-2">Add a protocol to get started</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.tier.label}`} className="flex items-center gap-4 p-4 rounded-lg bg-surface-container">
                <div className="flex-1">
                  <p className="font-bold text-on-surface">{item.productName}</p>
                  <p className="text-sm text-on-surface-variant">{item.tier.label} — {item.tier.quantity} bottle{item.tier.quantity > 1 ? "s" : ""}</p>
                  <p className="text-primary-container font-bold mt-1">{formatPrice(item.tier.price)}</p>
                </div>
                <button
                  onClick={() => removeItem(item.productId, item.tier.label)}
                  className="text-on-surface-variant hover:text-error transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-outline-variant/20 space-y-4">
            <div className="flex justify-between text-body-lg">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="font-bold text-on-surface">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-on-surface-variant">Shipping & taxes calculated at checkout</p>
            <Button
              className="w-full"
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
