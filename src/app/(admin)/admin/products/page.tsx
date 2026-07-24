"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { Plus, Pencil, Trash2, X, Save } from "lucide-react"
import type { Product, PricingTier } from "@/types"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      const { id, ...data } = editingProduct
      if (id) {
        await fetch(`/api/products/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      }
      await fetchProducts()
      setShowForm(false)
      setEditingProduct(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" })
      await fetchProducts()
    } catch (err) {
      console.error(err)
    }
  }

  const addTier = () => {
    if (!editingProduct) return
    setEditingProduct({
      ...editingProduct,
      tiers: [...editingProduct.tiers, { label: "", quantity: 1, price: 0, isPopular: false }],
    })
  }

  const updateTier = (index: number, field: keyof PricingTier, value: any) => {
    if (!editingProduct) return
    const tiers = [...editingProduct.tiers]
    tiers[index] = { ...tiers[index], [field]: value }
    setEditingProduct({ ...editingProduct, tiers })
  }

  const removeTier = (index: number) => {
    if (!editingProduct) return
    setEditingProduct({
      ...editingProduct,
      tiers: editingProduct.tiers.filter((_, i) => i !== index),
    })
  }

  const openNew = () => {
    setEditingProduct({
      id: "",
      name: "",
      subtitle: "",
      description: "",
      basePrice: 0,
      stock: 100,
      isActive: true,
      tiers: [],
    })
    setShowForm(true)
  }

  if (loading) return <div className="text-center py-20 text-on-surface-variant">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-display-sm font-extrabold">Products</h1>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {showForm && editingProduct && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct.id ? "Edit Product" : "New Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input value={editingProduct.subtitle} onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  className="flex h-24 w-full rounded-lg border border-outline-variant/30 bg-transparent px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Base Price (₹)</Label>
                  <Input type="number" value={editingProduct.basePrice} onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={editingProduct.imageUrl || ""} onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Pricing Tiers</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={addTier}>
                    <Plus className="w-4 h-4 mr-1" /> Add Tier
                  </Button>
                </div>
                {editingProduct.tiers.map((tier, i) => (
                  <div key={i} className="flex gap-3 items-end bg-surface-container p-4 rounded-lg">
                    <div className="space-y-1 flex-1">
                      <Label>Label</Label>
                      <Input value={tier.label} onChange={(e) => updateTier(i, "label", e.target.value)} placeholder='e.g. "10 Days"' />
                    </div>
                    <div className="space-y-1 w-20">
                      <Label>Qty</Label>
                      <Input type="number" value={tier.quantity} onChange={(e) => updateTier(i, "quantity", Number(e.target.value))} />
                    </div>
                    <div className="space-y-1 w-28">
                      <Label>Price (₹)</Label>
                      <Input type="number" value={tier.price} onChange={(e) => updateTier(i, "price", Number(e.target.value))} />
                    </div>
                    <button type="button" onClick={() => removeTier(i)} className="p-2 text-on-surface-variant hover:text-error">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" /> Save Product
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditingProduct(null) }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-outline-variant/10">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-6 hover:bg-surface-container/50 transition-colors">
                <div className="flex items-center gap-4">
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-surface-container-highest" />
                  )}
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p className="text-sm text-on-surface-variant">{product.subtitle}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">Base: {formatPrice(product.basePrice)}</Badge>
                      <Badge variant="outline">Stock: {product.stock}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setEditingProduct(product); setShowForm(true) }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="text-center py-12 text-on-surface-variant">No products yet. Add your first product.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
