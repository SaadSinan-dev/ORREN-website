# ORREN Coffee

A multi-route specialty coffee storefront concept built as a realistic client-side commerce experience. ORREN combines catalog discovery, URL-driven filters, persistent cart state, a clearly labeled demo checkout, editorial content, route-aware motion, and optional 3D product interactions in one React application.

**Live demo:** https://orren-nine.vercel.app/  
**Source:** https://github.com/SaadSinan-dev/ORREN-website

## Professional Overview

ORREN Coffee is a portfolio e-commerce application designed to model the front-end concerns of a modern specialty retail site without pretending to process real orders. It supports product discovery across eight coffee products, detailed product pages, bag-size pricing, a persistent cart, search, editorial journal routes, and an order-preview flow that explicitly states that no payment or order submission occurs.

The project goes beyond static storefront UI by treating 3D as an optional enhancement. Product pages can switch from photography to a procedurally modeled coffee pouch, and the home-page journey uses a separate 3D scene to visualize origin, roasting, grinding, and brewing. Those scenes are lazy-loaded, rendered on demand, paused when off-screen, and replaced with photography when WebGL is unavailable.

## Key Features

- **Multi-route storefront architecture** — dedicated routes for home, catalog, products, origins, about, journal, article content, checkout, information pages, and not-found handling.
- **URL-backed catalog filtering** — search, category, roast, origin, and sorting state are stored in query parameters so discovery state is shareable and survives navigation.
- **Product search from the global header** — searches product names, origins, regions, processes, tasting notes, and brew recommendations, with direct navigation into the catalog or product detail.
- **Variant-aware cart** — product ID and bag weight form a cart key, allowing the same coffee in 250g, 500g, and 1kg variants while merging duplicate lines safely.
- **Persistent client-side cart** — cart contents are stored in `localStorage`, parsed defensively, validated against the current catalog, quantity-capped, and repriced from trusted catalog data rather than stored prices.
- **Demo checkout with clear boundaries** — collects example shipping details only for the current UI flow, does not transmit or persist them, and clears the cart after creating an in-memory order preview.
- **Interactive 3D product inspection** — users can drag or use explicit rotate/reset controls to inspect a procedurally generated coffee pouch with product-specific canvas-rendered label artwork.
- **Scroll-driven coffee journey** — a four-stage 3D sequence transitions from green bean to roast, grounds, and brewed coffee while the DOM copy tracks the active chapter.
- **Motion with accessibility fallbacks** — GSAP effects adapt to viewport size and are disabled for `prefers-reduced-motion`; 3D motion also respects the same user preference.
- **Route-aware page metadata** — document title, description, Open Graph title, and Open Graph description are updated when navigating between products, journal entries, and primary routes.
- **Commerce unit tests** — filtering, sorting, pricing, cart merging, quantity limits, storage sanitization, and trusted repricing are covered with Vitest.

## Technical Architecture

### Frontend

The application uses React 19, TypeScript, React Router, and Vite. `App.tsx` defines the route tree and keeps global concerns — cart context, route effects, shared header/footer, motion binding, and the cart drawer — outside individual feature pages.

Feature code is organized by domain rather than by generic component type. Commerce-specific UI lives under `features/cart`, product discovery under `features/catalog`, product detail under `features/product`, and editorial/home experiences under their own feature folders.

Most secondary routes are loaded with `React.lazy`, reducing the amount of route code required for the initial home page. The Vite configuration also creates a dedicated Three.js-related chunk for the heavier graphics dependencies.

### Commerce State and Data Flow

The catalog is a typed local data source. Pure functions in `lib/commerce.ts` handle filtering, sorting, weight-based pricing, cart-key generation, cart merging, subtotal calculation, and local-storage parsing.

The cart context is responsible for UI-facing state:

1. Read and sanitize persisted cart lines on initialization.
2. Resolve prices from the current catalog rather than trusting serialized values.
3. Persist validated cart items back to `localStorage` when they change.
4. Expose add/update/remove/clear operations plus count and subtotal.
5. Coordinate cart drawer visibility and add-to-bag status messaging.

The checkout route deliberately remains client-only. Form values are read only at submit time to build a temporary success summary; no payment provider, network request, account system, or order database is present.

### 3D Layer

`SceneShell` centralizes WebGL lifecycle behavior for both product and journey scenes. It checks WebGL2 support, waits until a scene has entered the viewport before mounting the canvas, uses `IntersectionObserver` plus page visibility to stop rendering when inactive, caps device pixel ratio, and falls back to a still-life image after unsupported WebGL, context loss, or render errors.

The product pouch is generated procedurally with custom `BufferGeometry`, a shaped label mesh, a deformed seal, deterministic paper texture, and a canvas-generated product label. The scene uses demand rendering and explicit geometry/texture disposal to keep an optional product interaction from becoming a permanent render cost.

### Motion Layer

`ScrollMotion` binds GSAP/ScrollTrigger effects to the current route. It uses responsive settings for desktop, tablet, and mobile, observes lazy-loaded route content with `MutationObserver`, refreshes triggers as images load, and skips motion entirely when the user prefers reduced motion.

### Backend / Database / Authentication

The current project has no backend, database, authentication, user accounts, order API, or payment integration. It is intentionally a front-end commerce demonstration.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, React Router 7, Vite |
| Styling | CSS, Tailwind CSS tooling, Fontsource packages |
| Motion | GSAP, ScrollTrigger |
| 3D / Graphics | Three.js, React Three Fiber |
| UI | Lucide React, native `<dialog>` modals |
| State | React Context + hooks, URL search params, `localStorage` |
| Testing | Vitest |
| Code Quality | Oxlint, TypeScript project build |
| Backend | None |
| Database | None |
| Deployment | Static frontend; live demo hosted on Vercel |

## Engineering Highlights

- **Commerce rules are separated from UI.** Pricing, filtering, cart merging, subtotal calculation, and storage parsing are pure functions that can be tested independently of React.
- **Persisted data is treated as untrusted input.** `parseCart()` rejects invalid products, unsupported weights, unavailable items, bad quantities, and corrupt JSON; pricing is always recalculated from the catalog.
- **Catalog state is represented in the URL.** Search and filters use `useSearchParams`, which improves navigation behavior without introducing a global state library for data that naturally belongs in the address bar.
- **The project is transparent about transaction boundaries.** Checkout copy and success state explicitly state that no payment is collected and no order is transmitted.
- **3D is demand-driven.** WebGL scenes are not mounted until visited, stop rendering when inactive, and provide a static visual fallback when graphics support fails.
- **Graphics resources are cleaned up.** Procedural geometries and canvas textures used by the 3D pouch and journey are disposed when their components unmount.
- **Motion is route-aware and lazy-content-aware.** A `MutationObserver` lets the GSAP layer bind to code-split content after it enters the DOM without coupling every page component to animation setup.
- **Native dialog behavior is used for overlays.** Search, navigation, and cart overlays use `<dialog>`, restore the previously focused element on close, support Escape cancellation, and temporarily lock body scrolling.
- **Responsive and reduced-motion behavior is implemented in logic.** Motion distances, tilt, image parallax, DPR, and frame-loop behavior change based on viewport/pointer capabilities and user preferences.

## Project Challenges & Solutions

**Challenge:** Preserve useful storefront state without adding unnecessary global complexity.  
**Solution:** Product filters live in URL search parameters, catalog data remains static and typed, and only cross-route bag state is centralized in a focused React context.

**Challenge:** Local storage can contain stale or manipulated commerce data.  
**Solution:** Stored cart lines are parsed as unknown input, validated against the live product catalog, constrained to supported variants and quantities, and repriced from catalog data instead of accepting serialized prices.

**Challenge:** Rich 3D interactions can consume resources even when the user is not viewing them.  
**Solution:** `SceneShell` uses viewport visibility and document visibility to choose between demand rendering and a stopped frame loop, caps DPR, and delays canvas creation until the visual has actually been visited.

**Challenge:** A portfolio checkout should feel complete without implying real payment processing.  
**Solution:** The route implements realistic form, summary, shipping-threshold, and success states while clearly labeling the flow as a demonstration and avoiding all order/payment network calls.

**Challenge:** Page-level GSAP effects must keep working as lazy routes and images appear.  
**Solution:** The motion layer is centralized, route-aware, responsive, observes DOM mutations, refreshes ScrollTrigger after image loads, and tears itself down on route changes.

## Folder Structure

```text
landing-3d2/
├── public/
│   └── images/                 # Product, editorial and hero imagery
├── src/
│   ├── components/
│   │   ├── layout/             # Header and footer
│   │   ├── product/            # Reusable product card
│   │   └── ui/                 # Icon and native-dialog modal primitives
│   ├── data/                   # Typed product catalog and journal content
│   ├── features/
│   │   ├── cart/               # Cart context, drawer and demo checkout
│   │   ├── catalog/            # Search/filter/sort collection page
│   │   ├── content/            # Origins, about and information routes
│   │   ├── home/               # Home page and scroll journey
│   │   ├── journal/            # Journal index/article routes
│   │   └── product/            # Product detail experience
│   ├── lib/                    # Commerce logic and tests
│   ├── motion/                 # Route-aware GSAP system
│   ├── three/                  # WebGL shell, pouch geometry and 3D scenes
│   ├── types/                  # Coffee/cart domain types
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

## Installation & Running

Prerequisites are Node.js and npm; the repository does not declare a specific Node engine.

```bash
npm ci
npm run dev
```

Verification and production commands:

```bash
npm test
npm run lint
npm run build
npm run preview
```

## Environment Variables

No environment variables are required for the current application.

There are no payment keys, authentication secrets, API credentials, or database connection strings because those integrations are not implemented.

## Future Improvements

- Add a real server-side checkout boundary with a payment provider only when the project is intended to accept transactions; keep price validation authoritative on the server.
- Add account/order persistence behind an API instead of extending the current browser-only cart into responsibilities it should not own.
- Expand browser-level tests for routing, modal focus behavior, search/filter URLs, cart persistence, reduced motion, and WebGL fallbacks.
- Add inventory and availability data from a backend so product state is not limited to the static catalog.
- Add image-responsive sources and deeper performance budgets for product/editorial media alongside the existing lazy route and demand-render strategies.
- Add explicit analytics/privacy choices only if measurement becomes necessary for a deployed product.

## Screenshots

> Add project screenshots here.
>
> Recommended set: home page, filtered collection, product detail with 3D view, cart drawer, and demo checkout success state.

## Developer Note

I treated ORREN as a storefront rather than a collection of isolated screens. That meant keeping product discovery, cart rules, route state, accessibility, 3D lifecycle, and checkout boundaries consistent across the application. The project intentionally stops short of pretending that a browser-only demo is a production commerce backend; the next step would be to preserve these front-end boundaries while moving payments, inventory, and order authority to server-side systems.
