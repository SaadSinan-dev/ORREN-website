# ORREN implementation plan

The supplied master brief is the approved scope. Creative and implementation decisions proceed autonomously as requested.

## Visual and technical thesis

A considered coffee ritual: parchment, oxblood, olive, large Cormorant Garamond editorial typography, DM Sans utility typography, tactile packaging, and purposeful physical transformation. A photographic hero introduces the brand; original interactive Three.js packaging and a scroll-driven bean-to-cup scene let the customer explore the craft. Commerce stays available in semantic HTML and works without WebGL.

React 19 / TypeScript / Vite, Tailwind, React Router, Three.js / R3F / Drei. Context and pure domain functions own local cart state. Product data, UI, scenes, content, and styling have separate modules. No backend or payments; checkout must clearly identify a local demonstration before submission.

## Delivery checklist

1. [in progress] Foundation, brand tokens, asset research and representative homepage.
2. [pending] Typed catalog, filters/search/sort, detail selection, cart and demo checkout.
3. [pending] Purposeful 3D inspection and scroll chapters; origin/about/journal content.
4. [pending] Desktop/mobile browser QA, keyboard/reduced-motion/fallback checks, build and lint.
5. [pending] Documentation, clean source ZIP, extracted npm install/build/dev verification.

## Ownership

- Root: application, design system, pages, commerce, integration, verification, packaging.
- Asset agent: three original product/editorial renders, returned outside checkout.
- Reference agent: read-only reference/asset audit.
- Scene agent: isolated src/three modules with documented props; no app/styles/manifest edits.

## Verification inventory

- Routes: home, shop, product, origins, about, journal/list/article, legal, checkout, not found; direct reload and back navigation.
- Commerce: query, category/roast/origin filters, sort, combined/empty states, reset, weights, quantity, variant merge, removal, persistence, malformed storage, totals, demo order and validation.
- UI: navigation, mobile menu, search, cart drawer focus/escape, newsletter honest local state, journal links.
- 3D: scene visible, scroll forward/back changes material and composition, package rotation/reset, mobile framing, reduced motion, offscreen idle, no-WebGL fallback, failed-image fallback.
- Visual: 1440 desktop, 768 tablet, 390 and 320 mobile; full-page and focused review, image loading, no overflow, interactive states.
- Delivery: TypeScript/build, lint, meaningful domain tests, browser error capture, ZIP exclusions and clean extracted installation/start.

## Alternatives considered

An always-on full-viewport WebGL world makes commerce harder to access and is costly on mobile. A purely photographic storefront lacks meaningful interaction. The selected approach gives the editorial surface a fast first paint and puts interactive 3D into explicit product inspection and a short continuous craft chapter.
