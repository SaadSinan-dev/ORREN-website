import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'

export function Footer() {
  const [subscribed, setSubscribed] = useState(false)
  return <footer className="site-footer">
    <div className="newsletter"><div><span className="eyebrow">Letters, occasionally.</span><h2>A good thing<br />in your inbox.</h2></div><div className="newsletter-form-wrap"><p>New coffees, stories from origin, and little ways to make your daily ritual better.</p>{subscribed ? <p className="newsletter-success" role="status"><Icon name="check" /> You’re on the local preview list. No email was sent.</p> : <form onSubmit={event => { event.preventDefault(); setSubscribed(true) }}><label className="sr-only" htmlFor="newsletter-email">Your email address</label><input id="newsletter-email" name="email" type="email" required placeholder="Your email address" autoComplete="email" /><button aria-label="Join the newsletter"><Icon name="right" /></button></form>}<small>A considered note. Never a crowded inbox. Demo signup only.</small></div></div>
    <div className="footer-middle"><Link className="wordmark footer-logo" to="/">ORREN<span className="wordmark-dot">®</span></Link><p>Good coffee connects us.<br />To a place. To a person. To a moment.</p><div className="footer-links"><Link to="/shop">Our coffees</Link><Link to="/origins">The journey</Link><Link to="/about">Our story</Link><Link to="/journal">Field notes</Link></div><div className="footer-links"><Link to="/contact">Get in touch</Link><Link to="/shipping">Shipping & returns</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} ORREN Coffee. A sense of place.</span><span>Independent spirit. Shared ritual.</span><span>USD $ · English</span></div>
  </footer>
}
