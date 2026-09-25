import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { CartProvider } from './features/cart/CartContext'
import { CartDrawer } from './features/cart/CartDrawer'
import HomePage from './features/home/HomePage'
import { getProduct } from './data/products'
import { articles } from './data/journal'
import ScrollMotion from './motion/ScrollMotion'
const ShopPage = lazy(() => import('./features/catalog/ShopPage'))
const ProductPage = lazy(() => import('./features/product/ProductPage'))
const CheckoutPage = lazy(() => import('./features/cart/CheckoutPage'))
const JournalPage = lazy(() => import('./features/journal/JournalPage'))
const ArticlePage = lazy(() => import('./features/journal/JournalPage').then(module => ({ default: module.ArticlePage })))
const OriginsPage = lazy(() => import('./features/content/ContentPages').then(module => ({ default: module.OriginsPage })))
const AboutPage = lazy(() => import('./features/content/ContentPages').then(module => ({ default: module.AboutPage })))
const InformationPage = lazy(() => import('./features/content/ContentPages').then(module => ({ default: module.InformationPage })))
const NotFoundPage = lazy(() => import('./features/content/ContentPages').then(module => ({ default: module.NotFoundPage })))

function RouteEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const product = pathname.startsWith('/shop/') ? getProduct(pathname.split('/')[2]) : undefined
    const article = pathname.startsWith('/journal/') ? articles.find(a => a.id === pathname.split('/')[2]) : undefined
    const titles: Record<string, string> = { '/shop': 'Our coffees', '/origins': 'The journey', '/about': 'Our story', '/journal': 'Field notes', '/checkout': 'Your order preview', '/shipping': 'Shipping & returns', '/privacy': 'Privacy', '/terms': 'Terms', '/contact': 'Get in touch' }
    const title = product ? product.name + ' · ' + product.origin : article?.title || titles[pathname]
    document.title = title ? title + ' — ORREN Coffee' : 'ORREN Coffee — A sense of place. A moment for you.'
    const description = product?.description || article?.intro || 'Thoughtfully sourced, carefully roasted specialty coffee. Explore distinctive origins, discover your daily ritual, and find a coffee that feels like you.'
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])
  return null
}

export default function App() {
  return <BrowserRouter><CartProvider><RouteEffects /><Header /><main id="main" tabIndex={-1}><ScrollMotion /><Suspense fallback={<div className="page-loading"><span className="wordmark">ORREN</span><span>A moment of anticipation.</span></div>}><Routes><Route path="/" element={<HomePage />} /><Route path="/shop" element={<ShopPage />} /><Route path="/shop/:productId" element={<ProductPage />} /><Route path="/origins" element={<OriginsPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/journal" element={<JournalPage />} /><Route path="/journal/:articleId" element={<ArticlePage />} /><Route path="/checkout" element={<CheckoutPage />} />{['shipping', 'privacy', 'terms', 'contact'].map(kind => <Route key={kind} path={'/' + kind} element={<InformationPage kind={kind} />} />)}<Route path="*" element={<NotFoundPage />} /></Routes></Suspense></main><Footer /><CartDrawer /></CartProvider></BrowserRouter>
}

