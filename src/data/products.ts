import type { CoffeeProduct } from '../types/coffee'

export const products: CoffeeProduct[] = [
  {
    id: 'huila', name: 'Huila', shortDescription: 'Your morning, a little brighter.',
    description: 'A quietly exceptional everyday coffee from the highlands of Huila. Ripe cherry sweetness opens into soft milk chocolate, with a clean mandarin finish. Beautiful as a filter brew; wonderfully round with milk.',
    origin: 'Colombia', region: 'Huila', farm: 'El Recuerdo collective', process: 'Washed', variety: 'Caturra, Castillo', roastLevel: 'Medium', altitude: '1,700–1,950 m', tastingNotes: ['Milk chocolate', 'Mandarin', 'Caramel'], price: 18, weight: 250,
    image: '/images/products/huila.webp', gallery: ['/images/products/huila.webp', '/images/hero-still-life.webp'], category: 'Single origin', brewRecommendations: ['V60', 'Espresso', 'French press'], availability: true, color: '#713a30', labelColor: '#d9a876', edition: '01',
  },
  {
    id: 'sidama', name: 'Sidama', shortDescription: 'A little wild. Entirely wonderful.',
    description: 'Slow-dried cherries bring a fragrant, fruit-forward character to this Ethiopian lot. Think peach, delicate jasmine, and bergamot. A light roast preserves its lively sweetness and tea-like finish.',
    origin: 'Ethiopia', region: 'Sidama', farm: 'Bensa smallholder collective', process: 'Natural', variety: 'Local landraces', roastLevel: 'Light', altitude: '1,900–2,200 m', tastingNotes: ['Peach', 'Jasmine', 'Bergamot'], price: 22, weight: 250,
    image: '/images/products/sidama.webp', gallery: ['/images/products/sidama.webp', '/images/origin.webp'], category: 'Single origin', brewRecommendations: ['V60', 'Chemex', 'AeroPress'], availability: true, color: '#384b3c', labelColor: '#c1c39d', edition: '02',
  },
  {
    id: 'first-light', name: 'First Light', shortDescription: 'A very good reason to get up.',
    description: 'Our signature blend brings Brazilian body and Colombian sweetness into a reassuringly balanced cup. Built for espresso, but equally at home in a stovetop pot. Chocolate, toasted hazelnut, and a long caramel finish.',
    origin: 'Brazil & Colombia', region: 'Cerrado / Huila', farm: 'Two-origin producer blend', process: 'Natural & washed', variety: 'Bourbon, Caturra', roastLevel: 'Medium', altitude: '1,100–1,800 m', tastingNotes: ['Dark chocolate', 'Hazelnut', 'Toffee'], price: 16, weight: 250,
    image: '/images/products/first-light.webp', gallery: ['/images/products/first-light.webp', '/images/brewing.webp'], category: 'Blend', brewRecommendations: ['Espresso', 'Moka pot', 'French press'], availability: true, color: '#5b202b', labelColor: '#d4ad83', edition: '03',
  },
  {
    id: 'nyeri', name: 'Nyeri', shortDescription: 'Vivid by nature.',
    description: 'Kenyan highlands, volcanic soils, and careful washed processing give this seasonal selection a beautiful clarity. Juicy blackcurrant meets blood orange with a brown-sugar sweetness. Best enjoyed slowly, without milk.',
    origin: 'Kenya', region: 'Nyeri', farm: 'Karima producer group', process: 'Washed', variety: 'SL28, SL34', roastLevel: 'Light', altitude: '1,700–2,000 m', tastingNotes: ['Blackcurrant', 'Blood orange', 'Brown sugar'], price: 24, weight: 250,
    image: '/images/products/nyeri.webp', gallery: ['/images/products/nyeri.webp', '/images/origin.webp'], category: 'Seasonal', brewRecommendations: ['V60', 'Chemex'], availability: true, color: '#764535', labelColor: '#dc9b73', edition: '04',
  },
  {
    id: 'antigua', name: 'Antigua', shortDescription: 'Rich soil. Richer character.',
    description: 'A deeply comforting Guatemalan coffee grown in the shadow of volcanoes. We roast it a little further to bring out cacao and walnut, leaving just enough ripe plum sweetness for balance.',
    origin: 'Guatemala', region: 'Antigua', farm: 'Las Nubes collective', process: 'Washed', variety: 'Bourbon, Catuai', roastLevel: 'Dark', altitude: '1,500–1,800 m', tastingNotes: ['Cacao', 'Walnut', 'Plum'], price: 19, weight: 250,
    image: '/images/products/antigua.webp', gallery: ['/images/products/antigua.webp', '/images/roasting.webp'], category: 'Single origin', brewRecommendations: ['Espresso', 'French press', 'Moka pot'], availability: true, color: '#393435', labelColor: '#b9a18b', edition: '05',
  },
  {
    id: 'tarrazu', name: 'Tarrazú', shortDescription: 'Sweetness, with nothing to add.',
    description: 'Honey processing leaves a little fruit on the seed as it dries, developing a rounded sweetness. This Costa Rican coffee brings apricot, honey, and almond together in an elegant, easy-drinking cup.',
    origin: 'Costa Rica', region: 'Tarrazú', farm: 'Santa Elena micro-mill', process: 'Honey', variety: 'Catuai', roastLevel: 'Medium', altitude: '1,600–1,900 m', tastingNotes: ['Apricot', 'Honey', 'Almond'], price: 23, weight: 250,
    image: '/images/products/tarrazu.webp', gallery: ['/images/products/tarrazu.webp', '/images/brewing.webp'], category: 'Seasonal', brewRecommendations: ['V60', 'AeroPress'], availability: true, color: '#89704a', labelColor: '#edcc8c', edition: '06',
  },
  {
    id: 'cerrado', name: 'Cerrado', shortDescription: 'Something familiar. Something special.',
    description: 'Grown on the gentle plateaus of Brazil and naturally dried in the sun. A full-bodied cup with a low-key acidity and generous notes of praline and cocoa. Made for the everyday ritual.',
    origin: 'Brazil', region: 'Cerrado Mineiro', farm: 'Fazenda Boa Vista', process: 'Natural', variety: 'Yellow Bourbon', roastLevel: 'Medium', altitude: '1,050–1,250 m', tastingNotes: ['Praline', 'Cocoa', 'Dried fig'], price: 17, weight: 250,
    image: '/images/products/cerrado.webp', gallery: ['/images/products/cerrado.webp', '/images/roasting.webp'], category: 'Single origin', brewRecommendations: ['Espresso', 'Moka pot', 'French press'], availability: true, color: '#816046', labelColor: '#d5c1a0', edition: '07',
  },
  {
    id: 'after-hours', name: 'After Hours', shortDescription: 'All the ritual. A softer landing.',
    description: 'A Colombian decaf treated with a sugarcane-derived ethyl acetate process. Roasted for a soft, rounded cup with cocoa and red apple sweetness. A considered coffee for the slower part of your day.',
    origin: 'Colombia', region: 'Cauca', farm: 'Cauca producer collective', process: 'Sugarcane decaf', variety: 'Castillo', roastLevel: 'Medium', altitude: '1,650–1,900 m', tastingNotes: ['Cocoa', 'Red apple', 'Molasses'], price: 20, weight: 250,
    image: '/images/products/after-hours.webp', gallery: ['/images/products/after-hours.webp', '/images/brewing.webp'], category: 'Single origin', brewRecommendations: ['Espresso', 'AeroPress'], availability: true, color: '#444859', labelColor: '#c1bed1', edition: '08',
  },
]

export const getProduct = (id: string | undefined) => products.find(p => p.id === id)
