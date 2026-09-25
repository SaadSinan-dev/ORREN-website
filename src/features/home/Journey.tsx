import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'
const JourneyScene = lazy(() => import('../../three/JourneyScene'))
const chapters = [
  { title: 'A place to begin.', word: 'Origin', detail: 'A coffee’s character starts in the soil. Slow-growing cherries at altitude develop the sweetness we look for.', label: 'Grown with intention' },
  { title: 'Character, brought to life.', word: 'Roast', detail: 'Time and temperature transform the green seed. We roast gently, following the coffee’s natural sweetness.', label: 'Roasted with care' },
  { title: 'A fresh perspective.', word: 'Grind', detail: 'Grinding opens up the bean, releasing its aroma. Freshly ground coffee brings more of that character to your cup.', label: 'Prepared in the moment' },
  { title: 'Make it your moment.', word: 'Brew', detail: 'Coffee, water, and a little attention. Everything that came before, in a cup you can call your own.', label: 'Enjoyed, slowly' },
]

export function Journey() {
  const container = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(false)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReduced(query.matches)
    updateMotion(); query.addEventListener('change', updateMotion)
    const observer = new IntersectionObserver(entries => setActive(entries[0].isIntersecting), { rootMargin: '200px' })
    if (container.current) observer.observe(container.current)
    return () => { observer.disconnect(); query.removeEventListener('change', updateMotion) }
  }, [])
  useEffect(() => {
    if (!active || reduced) return
    let frame = 0
    const update = () => { if (frame) return; frame = requestAnimationFrame(() => { frame = 0; const rect = container.current?.getBoundingClientRect(); if (rect) setProgress(Math.max(0, Math.min(1, -rect.top / (rect.height - innerHeight)))) }) }
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); cancelAnimationFrame(frame) }
  }, [active, reduced])
  const chapter = Math.min(3, Math.floor(progress * 4))
  const selectChapter = (index: number) => {
    if (reduced) { setProgress(index / 3); return }
    const el = container.current
    if (el) window.scrollTo({ top: scrollY + el.getBoundingClientRect().top + (el.offsetHeight - innerHeight) * ((index + 0.25) / 4), behavior: 'smooth' })
  }
  return <section className={`journey ${reduced ? 'journey-reduced' : ''}`} ref={container} id="the-ritual"><div className="journey-sticky"><div className="journey-top"><span className="eyebrow">A small bean. A remarkable journey.</span><span className="eyebrow">0{chapter + 1} / 04</span></div><div className="journey-stage"><div className="journey-copy"><span className="eyebrow">{chapters[chapter].label}</span><h2>{chapters[chapter].title}</h2><p>{chapters[chapter].detail}</p>{chapter === 3 && <Link to="/shop" className="text-link">Find your daily ritual <Icon name="arrow" /></Link>}</div><div className="journey-visual">{active && <Suspense fallback={<div className="scene-loading">A moment of anticipation.</div>}><JourneyScene progress={progress} /></Suspense>}</div><span className="journey-watermark" aria-hidden="true">{chapters[chapter].word}</span></div><div className="journey-bottom"><div className="chapter-buttons">{chapters.map((item, index) => <button key={item.word} onClick={() => selectChapter(index)} aria-current={chapter === index ? 'step' : undefined}><span>0{index + 1}</span> {item.word}</button>)}</div><span className="journey-scroll-hint">{reduced ? 'Choose a chapter' : 'Scroll to follow the coffee'} <Icon name="down" size={17} /></span></div></div></section>
}
