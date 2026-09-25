import { Link } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'
import { ProductCard } from '../../components/product/ProductCard'
import { products } from '../../data/products'
import { Journey } from './Journey'
import { JournalCards } from '../journal/JournalPage'

export default function HomePage() {
  return <>
    <section className="hero">
      <img className="hero-photo" src="/images/hero-still-life.webp" alt="ORREN coffee, a ceramic cup, and fresh beans in warm afternoon light" fetchPriority="high" width="1536" height="1024" />
      <div className="hero-copy"><span className="eyebrow hero-eyebrow"><span className="tiny-star">✳</span> Exceptional coffee. Everyday ritual.</span><h1>A sense<br />of <em>place.</em><br />A moment<br />for <em>you.</em></h1><p>Thoughtfully sourced. Carefully roasted.<br />Coffee worth slowing down for.</p><Link to="/shop" className="button button-dark">Find your coffee <Icon name="arrow" size={19} /></Link></div>
      <div className="hero-product-caption"><span className="eyebrow">Good mornings begin here</span><Link to="/shop/huila"><span>Meet Huila. Our Colombian favorite.</span><Icon name="arrow" size={19} /></Link></div>
      <a href="#the-collection" className="hero-scroll"><span>There’s a whole world in your cup</span><Icon name="down" size={18} /></a>
      <span className="hero-edition">THE DAILY RITUAL — VOL. 01</span>
    </section>
    <div className="values-strip"><span><Icon name="leaf" size={17} /> Thoughtfully sourced</span><span><Icon name="sun" size={18} /> Roasted in small batches</span><span><Icon name="package" size={17} /> Always fresh, always whole bean</span><span><Icon name="coffee" size={17} /> A better everyday ritual</span></div>
    <section className="collection section-shell" id="the-collection"><div className="section-heading"><div><span className="eyebrow">Good coffee starts with curiosity</span><h2>Find your everyday <em>extraordinary.</em></h2></div><Link to="/shop" className="text-link">Explore all coffees <Icon name="arrow" size={18} /></Link></div><div className="featured-products">{products.slice(0, 3).map(product => <ProductCard key={product.id} product={product} />)}</div></section>
    <section className="origin-teaser"><div className="origin-photo"><img src="/images/origin.webp" alt="Coffee cherries growing on a coffee plant" loading="lazy" width="1200" height="1200" /><span className="image-caption">Great coffee begins long before the roast.</span></div><div className="origin-copy"><span className="eyebrow">Rooted in something real</span><h2>Every coffee<br />has a place.<br /><em>Every place,<br />a story.</em></h2><p>Altitude, soil, a season’s rain. The hands that pick each cherry. We look for coffees that taste unmistakably of where they come from, and roast them to let that character speak.</p><Link className="text-link" to="/origins">Follow the journey <Icon name="arrow" size={19} /></Link><div className="origin-coordinates"><Icon name="pin" size={16} /><span>From the highlands. To your hands.</span></div></div></section>
    <Journey />
    <section className="brew-banner section-shell"><div><span className="eyebrow">Small moments, made well</span><h2>No rush.<br />Just <em>good coffee.</em></h2><p>Grind fresh. Find your favorite cup.<br />Make a little time for something you love.</p><Link to="/journal/a-better-morning" className="button button-outline">Make more of your morning <Icon name="arrow" /></Link></div><img src="/images/brewing.webp" alt="Carefully preparing a fresh cup of coffee" loading="lazy" width="1200" height="900" /></section>
    <section className="journal-section section-shell"><div className="section-heading"><div><span className="eyebrow">Field notes</span><h2>For the <em>curious.</em></h2></div><Link to="/journal" className="text-link">All stories <Icon name="arrow" size={18} /></Link></div><JournalCards /></section>
  </>
}
