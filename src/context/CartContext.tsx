"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import type { PricingTier } from "@/types"

export interface CartItem {
  productId: string
  productName: string
  tier: PricingTier
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string; label: string } }
  | { type: "CLEAR_CART" }

interface CartContextType {
  items: CartItem[]
  itemCount: number
  total: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string, label: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  total: 0,
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
})

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find(
        (i) => i.productId === action.payload.productId && i.tier.label === action.payload.tier.label
      )
      if (exists) return state
      return { items: [...state.items, action.payload] }
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (i) => !(i.productId === action.payload.productId && i.tier.label === action.payload.label)
        ),
      }
    case "CLEAR_CART":
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("phytoflex-cart")
      return stored ? { items: JSON.parse(stored) } : { items: [] }
    }
    return { items: [] }
  })

  useEffect(() => {
    localStorage.setItem("phytoflex-cart", JSON.stringify(state.items))
  }, [state.items])

  const itemCount = state.items.reduce((sum: number, item: CartItem) => sum + item.tier.quantity, 0)
  const total = state.items.reduce((sum: number, item: CartItem) => sum + item.tier.price, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount,
        total,
        addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
        removeItem: (productId, label) => dispatch({ type: "REMOVE_ITEM", payload: { productId, label } }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
