import { Link } from 'react-router-dom'
import type { CoffeeProduct } from '../../types/coffee'
import { money } from '../../lib/commerce'
import { useCart } from '../../features/cart/CartContext'
import { Icon } from '../ui/Icon'

export function ProductCard({ product }: { product: CoffeeProduct }) {
  const { add } = useCart()
  return <article className="product-card">
    <Link to={`/shop/${product.id}`} className={`product-image product-${product.id}`} aria-label={`Explore ${product.name}`}>
      <span className="product-badge">{product.category === 'Seasonal' ? 'Seasonal selection' : product.id === 'first-light' ? 'The house blend' : product.origin}</span>
      <img src={product.image} alt={`ORREN ${product.name} specialty coffee packaging`} loading="lazy" width="600" height="700" />
      <span className="product-explore">Explore coffee <Icon name="arrow" size={18} /></span>
    </Link>
    <div className="product-topline"><span className="eyebrow">{product.origin} <span className="muted">/ {product.process}</span></span><span className={`roast-dot roast-${product.roastLevel.toLowerCase()}`} title={`${product.roastLevel} roast`} /></div>
    <div className="product-heading"><Link to={`/shop/${product.id}`}><h3>{product.name}</h3></Link><span>{money(product.price)} <small>/ 250g</small></span></div>
    <p className="tasting-notes">{product.tastingNotes.join(' · ')}</p>
    <button className="quick-add" onClick={() => add(product.id)} aria-label={`Add ${product.name} 250g to bag`}>Add to bag <Icon name="plus" size={18} /></button>
  </article>
}
