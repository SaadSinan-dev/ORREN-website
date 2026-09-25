export type RoastLevel = 'Light' | 'Medium' | 'Dark'
export type CoffeeCategory = 'Single origin' | 'Blend' | 'Seasonal'
export type BagWeight = 250 | 500 | 1000

export interface CoffeeProduct {
  id: string
  name: string
  shortDescription: string
  description: string
  origin: string
  region: string
  farm: string
  process: string
  variety: string
  roastLevel: RoastLevel
  altitude: string
  tastingNotes: string[]
  price: number
  weight: BagWeight
  image: string
  gallery: string[]
  category: CoffeeCategory
  brewRecommendations: string[]
  availability: boolean
  color: string
  labelColor: string
  edition: string
}

export interface CartItem {
  productId: string
  weight: BagWeight
  quantity: number
}
