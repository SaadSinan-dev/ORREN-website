import type { BagWeight, CartItem, CoffeeProduct } from '../types/coffee'

export interface CatalogFilters { query?: string; category?: string; roast?: string; origin?: string; sort?: string }
export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: value % 1 ? 2 : 0 }).format(value)
export const priceForWeight = (price: number, weight: BagWeight) => Math.round(price * ({ 250: 1, 500: 1.8, 1000: 3.4 }[weight]) * 100) / 100
export const cartKey = (item: Pick<CartItem, 'productId' | 'weight'>) => `${item.productId}-${item.weight}`

export function filterProducts(catalog: CoffeeProduct[], filters: CatalogFilters) {
  const q = filters.query?.trim().toLowerCase() ?? ''
  const result = catalog.filter(p =>
    (!q || [p.name, p.origin, p.region, p.process, ...p.tastingNotes, ...p.brewRecommendations ?? []].join(' ').toLowerCase().includes(q)) &&
    (!filters.category || filters.category === 'All coffee' || p.category === filters.category || p.brewRecommendations?.includes(filters.category)) &&
    (!filters.roast || p.roastLevel === filters.roast) && (!filters.origin || p.origin === filters.origin))
  return result.sort((a, b) => filters.sort === 'price-asc' ? a.price - b.price : filters.sort === 'price-desc' ? b.price - a.price : filters.sort === 'name' ? a.name.localeCompare(b.name) : 0)
}

export function addCartItem(cart: CartItem[], item: CartItem): CartItem[] {
  const existing = cart.find(line => cartKey(line) === cartKey(item))
  const quantity = Math.max(1, Math.min(20, Math.floor(item.quantity)))
  return existing ? cart.map(line => line === existing ? { ...line, quantity: Math.min(20, line.quantity + quantity) } : line) : [...cart, { ...item, quantity }]
}

export function cartSubtotal(cart: CartItem[], catalog: CoffeeProduct[]) {
  return Math.round(cart.reduce((sum, item) => {
    const product = catalog.find(p => p.id === item.productId)
    return sum + (product ? priceForWeight(product.price, item.weight) * item.quantity : 0)
  }, 0) * 100) / 100
}

export function parseCart(raw: string | null, catalog: CoffeeProduct[]): CartItem[] {
  try {
    const data: unknown = JSON.parse(raw ?? '[]')
    if (!Array.isArray(data)) return []
    return data.reduce<CartItem[]>((valid, item) => {
      if (typeof item !== 'object' || !item || !catalog.some(p => p.id === item.productId && p.availability) || ![250, 500, 1000].includes(item.weight) || !Number.isFinite(item.quantity) || item.quantity < 1) return valid
      return addCartItem(valid, { productId: item.productId, weight: item.weight, quantity: item.quantity })
    }, [])
  } catch { return [] }
}
