# PowerDillo

**Veteran-owned IT Construction, Subcontracting & Equipment Rental platform** built as a full-stack SaaS web application. PowerDillo serves three service divisions — IT Infrastructure Construction, Subcontracting, and Heavy Equipment Rental — under a single branded platform with user authentication, subscription billing, and immersive 3D/animation-driven marketing pages.

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js | 16.2.4 |
| Language | TypeScript | 5.x |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS | 4.x |
| 3D Graphics | Three.js | 0.184.0 |
| Animation | GSAP + ScrollTrigger | 3.15.0 |
| Authentication | NextAuth.js | 4.24.14 |
| Database | Supabase (PostgreSQL) | 2.105.3 |
| Payments | Stripe | 22.1.0 |
| Password Hashing | bcryptjs | 3.0.3 |

---

## GSAP Animations

GSAP (GreenSock Animation Platform) with the ScrollTrigger plugin powers all scroll-driven and timeline-based animations throughout the site.

### Landing Page — Service Card Entrance
**File:** `billing-app/app/page.tsx`

Staggered card entrance triggered on scroll: each service card translates from `y: 60` to `y: 0` with an opacity fade-in. Hero text uses a custom `fadeInLetter` CSS keyframe for a letter-by-letter reveal effect defined in `globals.css`.

### Dashboard — Product Card Entrance
**File:** `billing-app/app/dashboard/page.tsx`

Equipment rental cards slide in from `x: -250` as the user scrolls down. ScrollTrigger fires at `"top 90%"` of the viewport, staggering each card with an eased opacity transition.

### BlueprintAnimation — Construction Timeline
**File:** `billing-app/app/components/BlueprintAnimation.tsx`

A 4-phase looping GSAP timeline animates a spiral path "constructing" each architectural building:
1. **Phase 1** — Spiral path draws around the building (3.5 s, linear)
2. **Phase 2** — Cross-fade from spiral to revealed building (1.2 s, power2.inOut)
3. **Phase 3** — Hold on completed building display
4. **Phase 4** — Building fades out (0.35 s, power2.in), cycles to the next

Hover pauses the animation and enables interactive drag-to-rotate. The cycle repeats across all 3 buildings continuously.

### SmartCityNetwork — Camera & Node Pulses
**File:** `billing-app/app/components/SmartCityNetwork.tsx`

- **Camera drift** — GSAP smoothly interpolates camera position between waypoints using `sine.inOut` easing
- **Node breathing** — Each network node scales up and down continuously with randomized durations for an organic pulse effect
- **Emissive glow** — MeshStandardMaterial `emissiveIntensity` is tweened to create glowing node highlights on hover/click
- **Scroll-triggered connections** — Network connection lines fade in as the user scrolls past the component

---

## Three.js 3D Components

Both 3D scenes are built entirely from scratch using Three.js with custom geometry, materials, lighting, and interaction — no pre-built 3D asset files.

### SmartCityNetwork
**File:** `billing-app/app/components/SmartCityNetwork.tsx`

A procedurally generated smart city visualization used as a hero background and interactive demo.

- **City grid** — 18×18 grid of buildings with randomized heights using `MeshStandardMaterial`
- **Network nodes** — 12% of buildings are designated as nodes, rendered as glowing cyan spheres
- **Connection lines** — `LineBasicMaterial` lines drawn between nodes within a 7.5-unit radius
- **Energy pulses** — Particle objects travel along connection lines to simulate data transmission
- **Atmosphere** — 300 floating ambient particles with subtle vertical drift; `FogExp2` for depth haze
- **Camera** — GSAP-driven position drift combined with real-time mouse parallax and scroll-based zoom
- **Interaction** — Three.js `Raycaster` detects node hover and click, triggering GSAP highlight tweens
- **Lighting** — `AmbientLight` (0x0a1628, intensity 2.5) + `DirectionalLight`
- Fully responsive with window resize handling

### BlueprintAnimation
**File:** `billing-app/app/components/BlueprintAnimation.tsx`

An architectural blueprint viewer that reveals three procedurally generated buildings in sequence.

| Building | Style | Height |
|---|---|---|
| Art Deco Skyscraper | Setbacks, decorative spire, detailed windows | 5.95 units |
| Modern Glass Tower | Uniform curtain-wall facade | 5.42 units |
| International Style Slab | End towers, horizontal ribbon windows | 4.30 units |

- All geometry rendered as **wireframe line segments** — no filled meshes (`EdgesGeometry`, `LineSegments`)
- Spiral construction paths animate around each building before the reveal
- `LineBasicMaterial` in orange (`#ff8c40`) matches brand palette
- Drag-to-rotate interaction; auto-rotate resumes when pointer leaves
- Grid floor plane provides spatial grounding

---

## Features

- **Multi-division landing page** — Showcases IT Construction, Subcontracting, and Equipment Rental services with GSAP scroll animations
- **User authentication** — Email/password signup and login via NextAuth.js + Supabase; passwords hashed with bcryptjs (12 rounds)
- **Equipment rental catalog** — Browse and filter equipment by availability and category; expandable product detail cards
- **4-tier subscription pricing** — Monthly, 2-Month (−10%), 6-Month (−20%), Annual (−30%) plans
- **Stripe checkout** — Recurring subscription sessions; mock mode for development without live keys
- **Protected routes** — NextAuth JWT sessions gate the dashboard and billing pages
- **Responsive design** — Tailwind CSS mobile-first grid layouts across all pages

---

## Project Structure

```
PowerDilloWebsite/
└── billing-app/
    ├── app/
    │   ├── api/
    │   │   ├── auth/[...nextauth]/   # NextAuth handler
    │   │   ├── create-checkout-session/  # Stripe session creation
    │   │   └── signup/               # User registration
    │   ├── components/
    │   │   ├── BlueprintAnimation.tsx  # Three.js + GSAP blueprint viewer
    │   │   ├── SmartCityNetwork.tsx    # Three.js + GSAP city visualization
    │   │   ├── NavAuthButton.tsx       # Session-aware nav button
    │   │   └── Providers.tsx           # NextAuth SessionProvider wrapper
    │   ├── lib/
    │   │   └── config.ts              # Billing config + Stripe keys
    │   ├── dashboard/page.tsx         # Equipment rental catalog
    │   ├── billing/page.tsx           # Checkout with pricing tiers
    │   ├── login/page.tsx             # Login form
    │   ├── signup/page.tsx            # Registration form
    │   ├── auth/success/page.tsx      # Post-signup landing
    │   ├── success/page.tsx           # Post-payment confirmation
    │   ├── page.tsx                   # Landing page
    │   ├── layout.tsx                 # Root layout
    │   └── globals.css
    ├── lib/
    │   ├── auth.ts                    # NextAuth config + Supabase credential check
    │   └── supabase.ts                # Supabase client (singleton)
    └── package.json
```

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/grilledcheese1/PowerDilloWebsite.git
cd PowerDilloWebsite/billing-app

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
# Fill in the values — see Environment Variables below

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXTAUTH_SECRET` | JWT signing secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | NextAuth callback URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_...` or `sk_test_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_PRICE_ID` | Recurring product price ID from Stripe dashboard |
| `NEXT_PUBLIC_BASE_URL` | Production domain (e.g. `https://yourdomain.com`) |
| `BILLING_MOCK_MODE` | `true` to skip Stripe in dev; `false` for live payments |

---

## API Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/signup` | Register a new user; validates input, hashes password, inserts into Supabase |
| `POST` | `/api/create-checkout-session` | Create a Stripe recurring subscription checkout session |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth authentication handlers |

---

## Build & Lint

```bash
npm run build   # Production build
npm run lint    # ESLint check
npm start       # Start production server
```
