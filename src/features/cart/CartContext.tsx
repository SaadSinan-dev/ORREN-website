import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { products } from '../../data/products'
import { addCartItem, cartKey, cartSubtotal, parseCart } from '../../lib/commerce'
import type { BagWeight, CartItem } from '../../types/coffee'

const STORAGE_KEY = 'orren-cart-v1'
interface CartContextValue {
  items: CartItem[]; count: number; subtotal: number; isOpen: boolean; notice: string
  setOpen: (open: boolean) => void
  add: (productId: string, weight?: BagWeight, quantity?: number) => void
  update: (key: string, quantity: number) => void
  remove: (key: string) => void
  clear: () => void
}
const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => { try { return parseCart(localStorage.getItem(STORAGE_KEY), products) } catch { return [] } })
  const [isOpen, setOpen] = useState(false)
  const [notice, setNotice] = useState('')
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* Cart remains usable when storage is unavailable. */ } }, [items])
  useEffect(() => { if (!notice) return; const id = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(id) }, [notice])
  const add = (productId: string, weight: BagWeight = 250, quantity = 1) => {
    const product = products.find(p => p.id === productId && p.availability)
    if (!product) return
    setItems(current => addCartItem(current, { productId, weight, quantity }))
    setNotice(`${product.name} · ${weight}g added to your bag`)
  }
  const value: CartContextValue = {
    items, count: items.reduce((sum, item) => sum + item.quantity, 0), subtotal: cartSubtotal(items, products), isOpen, notice, setOpen, add,
    update: (key, quantity) => setItems(current => current.map(item => cartKey(item) === key ? { ...item, quantity: Math.max(1, Math.min(20, quantity)) } : item)),
    remove: key => setItems(current => current.filter(item => cartKey(item) !== key)), clear: () => setItems([]),
  }
  return <CartContext.Provider value={value}>{children}<div className={`toast ${notice ? 'visible' : ''}`} role="status">{notice}<button onClick={() => setOpen(true)}>View bag</button></div></CartContext.Provider>
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart requires CartProvider')
  return value
}
