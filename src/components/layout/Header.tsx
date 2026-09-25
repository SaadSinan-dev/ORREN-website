import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import { Modal } from '../ui/Modal'
import { useCart } from '../../features/cart/CartContext'
import { products } from '../../data/products'
import { filterProducts, money } from '../../lib/commerce'

export function Header() {
  const { count, setOpen } = useCart()
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const closeMenus = () => { setMenu(false); setSearch(false) }
  const links = <><NavLink to="/shop" onClick={closeMenus}>Our coffees</NavLink><NavLink to="/origins" onClick={closeMenus}>The journey</NavLink><NavLink to="/about" onClick={closeMenus}>Our story</NavLink><NavLink to="/journal" onClick={closeMenus}>Field notes</NavLink></>
  const results = filterProducts(products, { query }).slice(0, 4)
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="announcement"><span>Good coffee. No shortcuts.</span><span>Freshly roasted · Free shipping on orders $50+</span><span>From origin to your everyday.</span></div>
    <header className="site-header">
      <button className="icon-button mobile-menu-button" aria-label="Open navigation" onClick={() => setMenu(true)}><Icon name="menu" /></button>
      <Link className="wordmark" to="/" aria-label="ORREN home">ORREN<span className="wordmark-dot">®</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links}</nav>
      <div className="header-actions"><button className="icon-button" aria-label="Search coffees" onClick={() => setSearch(true)}><Icon name="search" /></button><button className="bag-button" aria-label={`Open bag, ${count} items`} onClick={() => setOpen(true)}><span className="bag-label">Bag</span><Icon name="bag" size={19} /><span className="bag-count">{count}</span></button></div>
    </header>
    <Modal open={menu} onClose={() => setMenu(false)} title="Explore ORREN" className="menu-modal"><nav className="mobile-nav" aria-label="Mobile navigation">{links}</nav><p className="menu-caption">A sense of place.<br />A moment for yourself.</p></Modal>
    <Modal open={search} onClose={() => setSearch(false)} title="Find your coffee" className="search-modal">
      <form className="search-field" onSubmit={event => { event.preventDefault(); setSearch(false); navigate(`/shop?q=${encodeURIComponent(query)}`) }}><Icon name="search" /><input autoFocus aria-label="Search by coffee, origin or tasting note" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try Ethiopia, chocolate, or espresso" /><button type="button" className="icon-button" onClick={() => setQuery('')} aria-label="Clear search"><Icon name="close" size={16} /></button></form>
      <p className="eyebrow search-caption">{query ? `${results.length} matches` : 'A few places to begin'}</p>
      <div className="search-results">{results.map(product => <Link to={`/shop/${product.id}`} key={product.id} className="search-result" onClick={closeMenus}><img src={product.image} alt="" /><div><h3>{product.name}</h3><p>{product.origin} · {product.tastingNotes[0]}</p></div><span>{money(product.price)}</span><Icon name="arrow" /></Link>)}</div>
      {!results.length && <div className="empty-state"><h3>No coffees found.</h3><p>Try a country, a flavor, or a brewing method.</p><button className="text-link" onClick={() => setQuery('')}>Clear search <Icon name="right" /></button></div>}
      <Link className="text-link search-all" onClick={closeMenus} to={`/shop${query ? `?q=${encodeURIComponent(query)}` : ''}`}>Explore all coffees <Icon name="right" /></Link>
    </Modal>
  </>
}

