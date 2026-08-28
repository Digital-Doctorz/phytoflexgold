"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { authFetch } from "@/lib/auth-client"
import { Plus, Pencil, Trash2, Save, Clock, AlertTriangle, RotateCcw, ChevronDown, ChevronUp } from "lucide-react"
import type { Product, PricingTier, Revision } from "@/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fnRef = useRef(fn)

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => fnRef.current(...args), delay)
    },
    [delay]
  )
}

function RevisionHistory({ entityType, entityId }: { entityType: string; entityId: string }) {
  const [revisions, setRevisions] = useState<Revision[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (!open || fetchedRef.current) return
    fetchedRef.current = true
    authFetch(`/api/revisions?entityType=${entityType}&entityId=${entityId}&limit=10`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setRevisions(data) })
      .catch(() => { /* empty */ })
      .finally(() => setLoading(false))
  }, [open, entityType, entityId])

  if (!entityId) return null

  return (
    <div className="border border-outline-variant/20 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-container/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Revision History ({revisions.length})
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && (
        <div className="border-t border-outline-variant/10 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-on-surface-variant">Loading...</div>
          ) : revisions.length === 0 ? (
            <div className="p-4 text-center text-sm text-on-surface-variant">No revisions yet</div>
          ) : (
            revisions.map((rev) => (
              <div key={rev.id} className="px-4 py-3 border-b border-outline-variant/5 last:border-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-on-surface">
                    {rev.action === "create" ? "Created" : rev.action === "delete" ? "Deleted" : "Updated"}
                  </span>
                  <span className="text-on-surface-variant">
                    {new Date(rev.createdAt).toLocaleString()}
                  </span>
                </div>
                {rev.changedFields && rev.changedFields.length > 0 && (
                  <p className="text-xs text-on-surface-variant mt-1">
                    Changed: {rev.changedFields.join(", ")}
                  </p>
                )}
                {rev.editedBy && (
                  <p className="text-xs text-on-surface-variant mt-0.5">By: {rev.editedBy}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [conflict, setConflict] = useState<{
    serverData: Product
    message: string
  } | null>(null)

  const fetchProducts = async () => {
    try {
      const res = await authFetch("/api/products")
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const res = await authFetch("/api/products")
        const data = await res.json()
        if (!cancelled) setProducts(data)
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  const persistProduct = useCallback(
    async (product: Product) => {
      setSaveStatus("saving")
      try {
        const { id, ...data } = product
        if (id) {
          const res = await authFetch(`/api/products/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, expectedVersion: data.version ?? undefined }),
          })
          if (res.status === 409) {
            const err = await res.json()
            setConflict({ serverData: err.serverData, message: err.message })
            setSaveStatus("error")
            return
          }
          if (!res.ok) throw new Error("Save failed")
          const result = await res.json()
          setEditingProduct((prev) => (prev ? { ...prev, version: result.version } : prev))
          setProducts((prev) =>
            prev.map((p) =>
              p.id === id ? { ...p, ...data, version: result.version } : p
            )
          )
        }
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      } catch {
        setSaveStatus("error")
        setTimeout(() => setSaveStatus("idle"), 3000)
      }
    },
    []
  )

  const debouncedSave = useDebounce(persistProduct, 800)

  const handleFieldChange = (field: keyof Product, value: unknown) => {
    if (!editingProduct) return
    const updated = { ...editingProduct, [field]: value }
    setEditingProduct(updated)
    if (editingProduct.id) {
      debouncedSave(updated)
    }
  }

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    if (editingProduct.id) {
      await persistProduct(editingProduct)
    } else {
      setSaveStatus("saving")
      try {
        const data = Object.fromEntries(
          Object.entries(editingProduct).filter(([k]) => k !== "id")
        )
        const res = await authFetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error("Create failed")
        await fetchProducts()
        setShowForm(false)
        setEditingProduct(null)
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      } catch {
        setSaveStatus("error")
        setTimeout(() => setSaveStatus("idle"), 3000)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return
    try {
      await authFetch(`/api/products/${id}`, { method: "DELETE" })
      await fetchProducts()
    } catch (err) {
      console.error(err)
    }
  }

  const resolveConflict = (useServer: boolean) => {
    if (!conflict) return
    if (useServer) {
      setEditingProduct(conflict.serverData)
    }
    setConflict(null)
  }

  const addTier = () => {
    if (!editingProduct) return
    handleFieldChange("tiers", [
      ...editingProduct.tiers,
      { label: "", quantity: 1, price: 0, isPopular: false },
    ])
  }

  const updateTier = (index: number, field: keyof PricingTier, value: unknown) => {
    if (!editingProduct) return
    const tiers = [...editingProduct.tiers]
    tiers[index] = { ...tiers[index], [field]: value }
    handleFieldChange("tiers", tiers)
  }

  const removeTier = (index: number) => {
    if (!editingProduct) return
    handleFieldChange(
      "tiers",
      editingProduct.tiers.filter((_, i) => i !== index)
    )
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
      version: 0,
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

      {conflict && (
        <Card className="border-error/30 bg-error-container/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-error mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">{conflict.message}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => resolveConflict(true)}>
                    <RotateCcw className="w-3 h-3 mr-1" /> Load Latest Version
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConflict(null)}>
                    Keep My Changes
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showForm && editingProduct && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{editingProduct.id ? "Edit Product" : "New Product"}</CardTitle>
            <div className="flex items-center gap-3">
              {editingProduct.id && (
                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                  {saveStatus === "saving" && <><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Saving...</>}
                  {saveStatus === "saved" && <><span className="w-2 h-2 rounded-full bg-green-400" /> Saved</>}
                  {saveStatus === "error" && <><span className="w-2 h-2 rounded-full bg-red-400" /> Error</>}
                  {saveStatus === "idle" && editingProduct.version !== undefined && (
                    <>v{editingProduct.version}</>
                  )}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input value={editingProduct.name} onChange={(e) => handleFieldChange("name", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input value={editingProduct.subtitle} onChange={(e) => handleFieldChange("subtitle", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  className="flex h-24 w-full rounded-lg border border-outline-variant/30 bg-transparent px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container"
                  value={editingProduct.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Base Price (₹)</Label>
                  <Input type="number" value={editingProduct.basePrice} onChange={(e) => handleFieldChange("basePrice", Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input type="number" value={editingProduct.stock} onChange={(e) => handleFieldChange("stock", Number(e.target.value))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={editingProduct.imageUrl || ""} onChange={(e) => handleFieldChange("imageUrl", e.target.value)} />
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

              {editingProduct.id && (
                <RevisionHistory entityType="product" entityId={editingProduct.id} />
              )}

              <div className="flex gap-3">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" /> {editingProduct.id ? "Save Changes" : "Create Product"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditingProduct(null); setConflict(null) }}>
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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-surface-container-highest" />
                  )}
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p className="text-sm text-on-surface-variant">{product.subtitle}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">Base: {formatPrice(product.basePrice)}</Badge>
                      <Badge variant="outline">Stock: {product.stock}</Badge>
                      {product.version !== undefined && (
                        <Badge variant="outline" className="text-on-surface-variant">v{product.version}</Badge>
                      )}
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
