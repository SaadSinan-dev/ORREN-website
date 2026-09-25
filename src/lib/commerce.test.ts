import { describe, expect, it } from 'vitest'
import { addCartItem, cartSubtotal, filterProducts, parseCart, priceForWeight } from './commerce'
import type { CoffeeProduct } from '../types/coffee'

const sample = [
  { id: 'huila', name: 'Huila', origin: 'Colombia', roastLevel: 'Medium', category: 'Single origin', process: 'Washed', tastingNotes: ['Caramel', 'Orange'], price: 18, availability: true },
  { id: 'sidama', name: 'Sidama', origin: 'Ethiopia', roastLevel: 'Light', category: 'Seasonal', process: 'Natural', tastingNotes: ['Jasmine', 'Peach'], price: 22, availability: true },
] as CoffeeProduct[]

describe('coffee discovery', () => {
  it('combines case-insensitive tasting search with roast and category filters', () => {
    expect(filterProducts(sample, { query: 'JASMINE', roast: 'Light', category: 'Seasonal' }).map(p => p.id)).toEqual(['sidama'])
    expect(filterProducts(sample, { query: 'jasmine', roast: 'Dark' })).toEqual([])
  })
  it('sorts without mutating the catalog', () => {
    expect(filterProducts(sample, { sort: 'price-desc' }).map(p => p.id)).toEqual(['sidama', 'huila'])
    expect(sample[0].id).toBe('huila')
  })
  it('filters origin and treats whitespace search as empty', () => {
    expect(filterProducts(sample, { query: '   ', origin: 'Colombia' })).toEqual([sample[0]])
  })
})

describe('cart and money', () => {
  it('merges matching variants but keeps bag weights separate', () => {
    let cart = addCartItem([], { productId: 'huila', weight: 250, quantity: 1 })
    cart = addCartItem(cart, { productId: 'huila', weight: 500, quantity: 1 })
    cart = addCartItem(cart, { productId: 'huila', weight: 250, quantity: 2 })
    expect(cart).toEqual([{ productId: 'huila', weight: 250, quantity: 3 }, { productId: 'huila', weight: 500, quantity: 1 }])
    expect(cartSubtotal(cart, sample)).toBe(86.4)
  })
  it('uses rounded volume pricing and caps quantities at 20', () => {
    expect(priceForWeight(18, 500)).toBe(32.4)
    expect(priceForWeight(18, 1000)).toBe(61.2)
    expect(addCartItem([], { productId: 'huila', weight: 250, quantity: 200 })[0].quantity).toBe(20)
  })
  it('rejects corrupt storage and unavailable variants', () => {
    expect(parseCart('{', sample)).toEqual([])
    expect(parseCart('{}', sample)).toEqual([])
    expect(parseCart(JSON.stringify([{ productId: 'unknown', weight: 250, quantity: 1 }, { productId: 'huila', weight: 99, quantity: 1 }, { productId: 'huila', weight: 250, quantity: -2 }]), sample)).toEqual([])
  })
  it('sanitizes valid storage without trusting stored prices', () => {
    const cart = parseCart(JSON.stringify([{ productId: 'huila', weight: 250, quantity: 2, price: 0 }]), sample)
    expect(cartSubtotal(cart, sample)).toBe(36)
  })
})
