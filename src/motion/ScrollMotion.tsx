import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Role = 'text' | 'heading' | 'action' | 'image' | 'card' | 'quiet'

/** Select existing content; the motion layer never replaces or duplicates a site element. */
const targets: ReadonlyArray<[string, Role]> = [
  ['.values-strip > span', 'quiet'],
  ['.section-heading .eyebrow, .shop-intro .eyebrow, .page-intro .eyebrow, .origin-copy > .eyebrow, .origin-intro > .eyebrow, .about-intro > .eyebrow, .article-heading > .eyebrow, .product-info > .eyebrow', 'quiet'],
  ['.section-heading h2, .shop-intro h1, .page-intro h1, .origin-copy h2, .origin-intro h2, .about-intro h1, .about-cta h2, .article-heading h1, .product-info h1, .related-products h2, .checkout-page h1, .information-page h1, .not-found h1', 'heading'],
  ['.section-heading .text-link, .origin-copy > .text-link, .brew-banner .button, .about-cta .button, .article-body > .button, .information-page > .text-link', 'action'],
  ['.origin-copy > p, .origin-intro > p, .shop-intro > p, .page-intro > p, .about-body p, .article-heading > p, .product-info .product-short, .product-info .flavor-block, .product-info .weight-selector, .product-info .add-to-cart-row, .checkout-notice', 'text'],
  ['.origin-photo img, .brew-banner > img, .editorial-hero > img, .about-photo, .article-hero, .product-main-image', 'image'],
  ['.product-card, .journal-card, .about-values > div, .origin-list > a, .article-body section, .information-page section', 'card'],
  ['.brew-banner .eyebrow, .brew-banner h2, .brew-banner p, .journal-meta, .product-promises, .detail-tabs, .detail-panel, .shop-toolbar, .filter-row, .checkout-grid > form, .checkout-summary', 'quiet'],
]

interface MotionSettings { travel: number; tilt: number; imageTilt: number; exit: number; scrub: number; parallax: number }

function settingsFor(width: number): MotionSettings {
  if (width <= 760) return { travel: 14, tilt: 0, imageTilt: 0, exit: 3, scrub: 0.23, parallax: 1.5 }
  if (width <= 1100) return { travel: 21, tilt: 1, imageTilt: 1, exit: 5, scrub: 0.38, parallax: 3 }
  return { travel: 32, tilt: 2.5, imageTilt: 2, exit: 8, scrub: 0.5, parallax: 5 }
}

function entrance(element: HTMLElement, role: Role, settings: MotionSettings, index: number) {
  const isImage = role === 'image'
  const isCard = role === 'card'
  const isQuiet = role === 'quiet'
  const distance = settings.travel * (isImage ? 1.15 : isQuiet ? 0.45 : isCard ? 1.1 : role === 'action' ? 0.65 : 1)
  const start = isCard ? 95 - Math.min(index % (innerWidth <= 760 ? 2 : 3), 2) * 2 : 94
  const timeline = gsap.timeline({
    scrollTrigger: { trigger: element, start: `top ${start}%`, end: 'bottom 8%', scrub: settings.scrub, invalidateOnRefresh: true },
  })
  timeline.fromTo(element,
    { opacity: 0, y: distance, scale: isImage ? 1.025 : role === 'action' ? 0.975 : 1, rotateX: isImage ? 0 : settings.tilt, rotateY: isImage ? settings.imageTilt : 0, force3D: true },
    { opacity: 1, y: 0, scale: 1, rotateX: 0, rotateY: 0, duration: 0.18, ease: 'power2.out', force3D: true }, 0)
    .to(element, { opacity: 1, duration: 0.72 }, 0.18)
    .to(element, { opacity: isImage ? 0.9 : 0.84, y: -settings.exit, duration: 0.1, ease: 'none' }, 0.9)
  return timeline
}

function heroMotion(hero: HTMLElement, settings: MotionSettings) {
  const image = hero.querySelector<HTMLElement>('.hero-photo')
  const selectors = ['.hero-eyebrow', '.hero h1', '.hero-copy > p', '.hero-copy > .button', '.hero-product-caption', '.hero-scroll', '.hero-edition']
  const elements = selectors.map(selector => hero.querySelector<HTMLElement>(selector)).filter((value): value is HTMLElement => !!value)
  gsap.fromTo(elements,
    { opacity: 0, y: settings.travel * 1.2, rotateX: settings.tilt, scale: 0.985, force3D: true },
    { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.85, ease: 'power3.out', stagger: 0.105, clearProps: 'transform,opacity', overwrite: true })
  if (image) {
    gsap.fromTo(image, { scale: 1.075, yPercent: -settings.parallax * 0.4 },
      { scale: 1.015, yPercent: settings.parallax, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: settings.scrub } })
  }
  const copy = hero.querySelector<HTMLElement>('.hero-copy')
  if (copy && settings.parallax > 2) gsap.to(copy, {
    y: -settings.travel * 1.25, ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: settings.scrub },
  })
}

/** Route-aware, reversible GSAP bindings for the current page and lazy-loaded route content. */
export default function ScrollMotion() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    const root = document.getElementById('main')
    if (!root) return
    const media = gsap.matchMedia()
    media.add({ desktop: '(min-width: 1101px)', tablet: '(min-width: 761px) and (max-width: 1100px)', mobile: '(max-width: 760px)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
      if (context.conditions?.reduced) return
      const settings = settingsFor(innerWidth)
      const bound = new WeakSet<HTMLElement>()
      const animations = new Map<HTMLElement, gsap.core.Timeline>()
      const scoped = gsap.context(() => undefined, root)
      let frame = 0
      const bind = () => {
        frame = 0
        let changed = false
        for (const [element, timeline] of animations) {
          if (!element.isConnected) { timeline.kill(); animations.delete(element); changed = true }
        }
        scoped.add(() => {
          const hero = root.querySelector<HTMLElement>('.hero')
          if (hero && !bound.has(hero)) { bound.add(hero); heroMotion(hero, settings); changed = true }
          for (const [selector, role] of targets) {
            root.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
              if (bound.has(element)) return
              bound.add(element)
              animations.set(element, entrance(element, role, settings, index))
              changed = true
            })
          }
        })
        if (changed) ScrollTrigger.refresh()
      }
      const schedule = () => { if (!frame) frame = requestAnimationFrame(bind) }
      const observer = new MutationObserver(schedule)
      observer.observe(root, { childList: true, subtree: true })
      const refreshOnImage = (event: Event) => { if (event.target instanceof HTMLImageElement) ScrollTrigger.refresh() }
      root.addEventListener('load', refreshOnImage, true)
      schedule()
      return () => { observer.disconnect(); root.removeEventListener('load', refreshOnImage, true); cancelAnimationFrame(frame); scoped.revert() }
    })
    return () => media.revert()
  }, [pathname])
  return null
}
