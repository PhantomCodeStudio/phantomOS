# Phantom Code — Cinematic Website Design Spec

**Date:** 2026-05-15  
**Project path:** `C:\Users\User\Documents\phantom-code-nextjs`  
**Live domain:** enterphantomcode.com  
**Contact:** studio@enterphantomcode.com  
**Location:** Johannesburg, South Africa  

---

## 1. Vision

A yellow-background immersive website that functions as a manifesto in motion. Every element demonstrates Phantom Code's mastery of spatial computing, physics simulation, and interactive 3D. Visitors don't read about immersive design — they experience it immediately on arrival.

No cards. No boxes. No generic agency layouts.

---

## 2. Technology Stack

| Layer | Tool | Version |
|---|---|---|
| Framework | Next.js App Router | 14.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| 3D rendering | `@react-three/fiber` | 8.x |
| 3D helpers | `@react-three/drei` | 9.x |
| Physics (3D) | `@react-three/cannon` | 6.x |
| Post-processing | `@react-three/postprocessing` | 2.x |
| Scroll animation | GSAP + ScrollTrigger | 3.x |
| Smooth scroll | Lenis | 1.x |
| State | Zustand | 4.x |
| Form/DB | Supabase JS client | 2.x |
| Deployment | Vercel | — |

---

## 3. Color System

```css
--bg:      #FFE900   /* brand yellow — sampled from PhantomCodeLogo.png */
--black:   #0a0a0a   /* text, nav, dark 3D elements */
--xenon:   #4169FF   /* Tier 1 accent */
--violet:  #7B00FF   /* Tier 2 accent */
--crimson: #CC0033   /* Tier 3 accent */
--bio:     #00FF87   /* Tier 4 accent */
--cyan:    #00FFFF   /* Problem section + Philosophy text accent only */
--white:   #F4F2EE   /* inside dark 3D scenes only */
```

**Rule:** Yellow is the ground. Everything lives on or emerges from it. Black carries text and structure. The four tier colors appear exclusively in 3D/blob/geometry contexts — never as background fills on yellow.

---

## 4. Typography

| Role | Font | Style |
|---|---|---|
| Display / hero titles | Bebas Neue | All caps, clamp(10vw, 15vw, 18vw) |
| Body / UI | Inter | 300–600 weight |
| Mono / counters | Space Mono | 400, 700 |

---

## 5. Directory Structure

```
C:\Users\User\Documents\phantom-code-nextjs\
  src/
    app/
      layout.tsx          ← global providers, Lenis init, cursor mount, audio init
      page.tsx            ← section assembly (all sections in order)
      globals.css         ← CSS vars, Tailwind base, grain texture
    components/
      loader/
        LoadingScreen.tsx ← yellow bg, logo, progress bar, inward particles
      nav/
        Nav.tsx           ← fixed nav HTML
        MagneticInkCanvas.tsx ← WebGL particle-wordmark, cursor warp
      hero/
        HeroScene.tsx     ← R3F Canvas: bubbles, god rays, 5k particles
        BubbleMesh.tsx    ← single iridescent bubble with physics
        HeroText.tsx      ← HTML overlay: "Immersive by Design" + sub-text
      problem/
        ProblemSection.tsx ← 3-layer parallax, text reveal, CSS iridescent shapes
      services/
        ServicesSection.tsx ← GSAP ScrollTrigger pin host
        ServiceChapter.tsx  ← single pinned chapter (title + geometry + features)
        geometries/
          CrystalFragments.tsx  ← Tier 1 shattered crystal
          MagneticRibbons.tsx   ← Tier 2 field ribbons
          PlasmaSphere.tsx      ← Tier 3 dissolving sphere
          PlasmaVortex.tsx      ← Tier 4 dual-color vortex
      clients/
        ClientsPlayground.tsx ← 2D canvas physics host
        physicsEngine.ts      ← pure TS: gravity, drag, collision, mouse
      why/
        WhyPhantom.tsx    ← split screen, GSAP counters, word-by-word reveal
      cases/
        CaseStudies.tsx   ← scroll-pinned case sequence
        CaseChapter.tsx   ← single case: image, parallax text, metrics, hover reveal
      footer/
        FooterSection.tsx ← metaball canvas + R3F logo + contact form
        MetaballCanvas.tsx ← 2D WebGL marching-squares metaballs
        FooterLogo.tsx    ← R3F rotating iridescent logo mesh
        ContactForm.tsx   ← controlled form, Supabase insert
      ui/
        Cursor.tsx        ← custom dot + ring cursor
        ScrollProgress.tsx ← top-of-page progress bar
        AudioToggle.tsx   ← mute/unmute button
    lib/
      shaders/
        iridescent.glsl   ← vertex + fragment: Fresnel, cubemap, refraction
        iridescent.ts     ← shaderMaterial wrapper with typed uniforms
      audio/
        audioEngine.ts    ← Web Audio API: oscillators, gain, analyser
      physics/
        physicsEngine.ts  ← 2D rigid body sim (clients + metaballs)
      supabase.ts         ← Supabase client singleton
      store.ts            ← Zustand: scrollProgress, audioEnabled, reducedMotion, loading
    hooks/
      useLenis.ts         ← Lenis init + scroll event forwarding to GSAP
      useMouseParallax.ts ← normalised mouse position [-1, 1]
      useScrollVelocity.ts ← scroll speed magnitude for animation scaling
      useReducedMotion.ts ← prefers-reduced-motion media query
  public/
    images/
      logo.png            ← copy from C:\Users\User\Downloads\PhantomCodeLogo.png.png
  docs/
    superpowers/
      specs/
        2026-05-15-phantom-code-website-design.md ← this file
```

---

## 6. Global Systems

### 6.1 Iridescence Shader (`IridescentMaterial`)

Single reusable `shaderMaterial` (drei) used by: Hero bubbles, Service chapter geometries, Footer rotating logo.

**Uniforms:**
```typescript
uTime: float           // driven by useFrame clock
uCameraPosition: vec3  // for view-dependent Fresnel
uColor: vec3           // base tint (per usage)
uFresnelPower: float   // edge shimmer intensity
uRefractionStrength: float  // distortion amount
uEnvMap: samplerCube   // cubemap for reflections
```

**Fragment logic:**
1. Fresnel coefficient from `dot(viewDir, normal)`
2. Sample cubemap with refracted view direction
3. Layer rainbow tint: `hue = fresnel * 2.0 + uTime * 0.1`
4. Blend with `uColor` base, output with alpha for transparency

### 6.2 Audio Engine

Web Audio API only — no external audio files.

```
OscillatorNode → GainNode → AnalyserNode → destination
```

| Event | Wave | Frequency | Duration |
|---|---|---|---|
| Hover element | sine | Y-position mapped 200–600Hz | 80ms fade |
| Click | sine | 440Hz | 150ms |
| Blob collision | sawtooth | velocity × 100Hz | 50ms burst |
| Logo collision (clients) | triangle | velocity × 80Hz | 80ms |
| Form submit success | sine chord | C4+E4+G4 (261+329+392Hz) | 300ms fade |

`AnalyserNode` outputs float32 frequency array each frame → passed to particle systems for audio-reactive intensity scaling.

Zustand `audioEnabled` flag: all audio calls check this before executing.

### 6.3 Scroll System

- Lenis wraps the document, forwards `scroll` events to GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`
- `useScrollVelocity` returns `Math.abs(lenis.velocity)` — used to scale animation aggressiveness
- Scroll progress (0–1) stored in Zustand for components that need it without subscribing to scroll events directly

### 6.4 Custom Cursor

```
#cur-dot   6px yellow circle, mix-blend-mode: multiply
#cur-ring  36px black border circle, lags behind dot
```

On interactive element hover: dot scales ×2, ring grows to 60px.  
On 3D canvas sections: ring hides, dot becomes crosshair.

### 6.5 Performance

| Strategy | Detail |
|---|---|
| R3F `frameloop="demand"` | Sections with no continuous animation stop rendering |
| `InstancedMesh` | All particle systems — single draw call |
| Dynamic import | Service chapter geometries load per chapter, not upfront |
| `prefers-reduced-motion` | All `useFrame` loops early-return; GSAP durations → 0.001s; particles count → 0 |
| Image optimization | Next.js `<Image>` for all client logos and case study images |
| Font subsetting | Self-host only Latin subset |

---

## 7. Sections

### 7.1 Loading Screen

**Duration:** 2.5s  
**Background:** `#FFE900`  
**Logo:** `public/images/logo.png` — centered, 200×200px, fade-in + scale 0.8→1.0 (500ms ease-out)  
**Progress bar:** 300px wide × 4px tall, black fill animating 0%→100% (GSAP power2.inOut)  
**Counter:** Space Mono, `0%` → `100%`, updates every 25ms  
**Particles:** 500 — colors: Xenon Blue / Violet / Bioluminescent, converging inward toward logo  
**ESC skip:** fires after 1s, instantly completes progress and fades out  
**Exit:** 300ms opacity dissolve to Hero  

### 7.2 Navigation (Global, Fixed)

**HTML layer:** Logo mark left, links center (About / Services / Work / Contact), AudioToggle right  
**Colors:** black on yellow  
**On scroll:** `backdrop-filter: blur(12px)`, subtle bottom border `rgba(0,0,0,0.08)`  
**Smooth scroll:** each link scrolls to section via Lenis `scrollTo`

**Magnetic Ink Canvas (behind HTML nav):**
- Fixed `<canvas>` spanning full nav height, `pointer-events: none`, `z-index` below HTML nav
- 200 black micro-particles (2px circles)
- Idle state: particles form ghost "PHANTOM CODE" wordmark shape (positions precomputed from text path)
- Cursor within 120px: repulsion, strength = `1 / distance²`
- Fast cursor swipe (velocity > 800px/s): full scatter, spring-reform over 800ms
- Hovered nav link: particles within 80px cluster toward link center (attraction)
- Scroll past Hero: particles animate to a 1px horizontal line across nav bottom edge
- Rendered via `requestAnimationFrame`, independent of React render cycle

### 7.3 Hero Section

**Canvas:** Full viewport R3F Canvas, fixed behind HTML content  
**Background:** `#FFE900` clear color  
**Post-processing:** `EffectComposer` → Bloom (intensity 0.8, on dark 3D elements only), ChromaticAberration (0.002), Vignette (0.3)

**Bubbles:**
- 3 large (r: 0.8–1.2 units) + 6 small (r: 0.2–0.5 units) `<mesh sphereGeometry>`
- `IridescentMaterial` with `uFresnelPower: 3.0`, `uRefractionStrength: 0.15`
- Physics: custom spring sim per bubble — no Cannon (overkill for floaty motion)
  - Buoyancy: upward force + sine wave offset (unique phase per bubble)
  - Gravity: `−0.002` downward acceleration
  - Drag: `velocity *= 0.98` per frame
  - Bubble-bubble collision: distance check, elastic response
  - Mouse repulsion: force applied when cursor within 1.5 units (raycasted world position)
- Particle system inside 2 large bubbles: 300 `InstancedMesh` dust motes drifting

**Background particles:** 5000 `InstancedMesh` points — Xenon Blue / Violet / Bioluminescent  
**God rays:** `VolumetricLight` (postprocessing) from top-center  
**Parallax:** camera position offset by `useMouseParallax` × 0.3 units XY  

**Hero text (HTML overlay):**
- `"Immersive by Design"` — Bebas Neue, clamp(8vw, 12vw, 14vw), black, fades in at t=1.0s after loader exits
- Sub: `"We don't build experiences. We architect realities."` — Inter 300, 1.1rem
- Text has `mix-blend-mode: multiply` so bubbles passing behind it darken the letters

**Scroll hint:** bouncing arrow, `"Scroll to explore"` fades out on first scroll event

### 7.4 Problem Section

**Layout:** 3-layer parallax — background (−0.3× scroll), content (0.5×), foreground (1.0×)  
**Background:** `#FFE900` base + CSS iridescent geometric shapes (`conic-gradient` + `filter: blur(40px)`) in Xenon Blue and Violet at 15% opacity  
**No R3F canvas** — pure CSS + GSAP

**Three narrative beats (each triggers on ScrollTrigger `start: "top 65%"`):**

1. **"The Gap"** — brands reach through flat screens; humans experience space and presence
2. **"The Opportunity"** — AR, XR, TouchDesigner exist; few studios master them
3. **"The Phantom Difference"** — we think in dimensions; we design for presence and memory

**Text animations:**
- Letter-by-letter stagger: `gsap.from(chars, { opacity: 0, y: 20, stagger: 0.03 })`
- Key words ("immersive", "reality", "presence"): subtle CSS glitch on entry (3-frame offset)
- Cyan (#00FFFF) animated underline on key phrases — SVG `strokeDashoffset` draw-on
- Parallax distortion: `gsap.to(text, { y: scrollProgress * 30 })`

### 7.5 Services Section — Cinematic Scrolljack

**Pin:** `ScrollTrigger.pin` holds section for `4 × 100vh` scroll distance  
**4 chapters** — scroll progress 0–25% / 25–50% / 50–75% / 75–100%

| Chapter | Tier | Name | Color | Geometry |
|---|---|---|---|---|
| 1 | 1 | Interactive Installations | Xenon `#4169FF` | Shattered crystal fragments (convex hull pieces, drift apart + reassemble) |
| 2 | 2 | Brand Activations | Violet `#7B00FF` | Magnetic field ribbons (tube geometry, animated along field lines) |
| 3 | 3 | XR Experiences | Crimson `#CC0033` | Molten sphere dissolving (displacement shader, noise-based erosion) |
| 4 | 4 | Full Immersive Experiences | Violet+Bio duotone | Dual-color plasma vortex (particle torus, color shifts per revolution) |

**Per chapter layout:**
- Tier name: Bebas Neue, `clamp(12vw, 15vw, 18vw)`, black, full width
- Features: Inter 300, 0.9rem, surface word-by-word as scroll progresses through chapter
- CTA: `"Book a Call →"` plain text link, no border, particle trail underline animates on hover
- Geometry: R3F Canvas positioned right-50% of viewport, dynamically imported per chapter
- Chapter geometries use `IridescentMaterial` tinted with chapter color

**Transition between chapters:** `clip-path: inset(0 0 100% 0)` → `inset(0 0 0% 0)` driven by scroll progress

### 7.6 Clients Playground

**Title:** `"Brands That Trust Phantom Code"` — Bebas Neue, 5vw  
**Sub:** `"Drag. Drop. Interact."` — Inter 300, small  
**Canvas:** 2D `<canvas>` element, full section width × 600px minimum height

**Client list:**
Nike, Lascote, FNB Art Joburg, Fa'kugesi, Keith Haring Foundation, Butan Streetwear, Rosons Spices, Meta, South Point Accommodation, Art Bank of South Africa, National Arts Festival, Playtopia, Africa Games Week, SPOVA.app

**Physics engine (pure TypeScript, `lib/physics/physicsEngine.ts`):**
```typescript
interface LogoBody {
  x: number; y: number;
  vx: number; vy: number;
  mass: number; radius: number;
  friction: number; restitution: number;
}
// Per frame:
// 1. Apply gravity: vy += 0.05
// 2. Apply drag: vx *= 0.98, vy *= 0.98
// 3. Apply wind: periodic gust via sin(time * 0.3) on vx
// 4. Mouse repulsion: if dist(logo, mouse) < 60px → push away
// 5. Wall bounce: reflect velocity at canvas edges
// 6. Logo-logo collision: circle overlap → elastic response
//    (logos treated as circles; radius = half the shorter PNG dimension)
// 7. Integrate: x += vx, y += vy
```

**Cursor behaviors:**
- Hover logo: scale 1.2×, glow (brand or Xenon), name below, others fade to 50%
- Click + drag: logo becomes kinematic (user drives), trail particles, release transfers momentum
- Cursor velocity > 500px/s: strong repulsion radius 80px
- Shift+click: multi-select, group physics

**Collision effects:** particle burst at contact point, Canvas `shadowBlur` flash, Web Audio impact tone (pitch = velocity magnitude × 80)

**Rendering:** `drawImage` for PNG logos (placed in `public/images/clients/`). Fallback: `fillText` with brand name if image missing.

### 7.7 Why Phantom Code

**Layout:** CSS Grid, two columns (50/50), no R3F

**Left — By The Numbers (Xenon Blue accents):**
| Metric | Value | Icon |
|---|---|---|
| Years Active | 10+ | — |
| Projects Delivered | 150+ | — |
| Clients Served | 45+ | — |
| AR Activations | 200+ | — |
| Team Members | 25+ | — |
| Awards Won | 12+ | — |

Counter animation: GSAP `ScrollTrigger` `onEnter` → `gsap.to({ val: 0 }, { val: target, onUpdate })`, ease `power2.out`, 1.5s duration. Particle burst when counter reaches final value.

**Right — Philosophy (Cyan #00FFFF accents):**
```
We don't follow trends.
We create them.

Immersive experiences aren't a trend.
They're the future of connection.

Every interaction matters.
Every detail counts.

We architect experiences that transform
how brands connect with their audience.

Not through screens.
Through presence.
```
Words surface with `stagger: 0.05` on scroll entry. Cyan animated underlines on key phrases.

**Shared background:** subtle animated grid (CSS `background-image: linear-gradient` crosshatch), pulsing opacity 0.03→0.06.

### 7.8 Case Studies

**Three full-viewport pinned chapters** (same scrolljack pattern as Services, `3 × 100vh` pin):

| Case | Title | Color | Metrics |
|---|---|---|---|
| 1 | Dress Code: Digital | Neon Pink `#FF006E` | Reach 2.5M+, Engagement 45%, Conversions +180% |
| 2 | Reality Redefined | Electric Purple `#A100F2` | Visitors 50K+, Avg time 12min, Repeat 65% |
| 3 | The Past Meets Tomorrow | Deep Teal `#00D9FF` | Interactions 1M+, Impact 9.2/10 |

**Per chapter:**
- Hero image: full-viewport, `object-fit: cover`, parallax `y` offset tied to scroll progress (floats ±40px)
- Title: Bebas Neue, `clamp(8vw, 12vw, 16vw)`, overlaid with `mix-blend-mode: difference`
- Metrics: CountUp via GSAP on chapter enter
- Behind-the-scenes: `clip-path` wipe reveal on hover, shows dev process detail
- Chapter color applied as thin left-border accent and metric number color

### 7.9 Footer / CTA

**Structure:** three layers stacked
1. Metaball canvas (full width, 60vh, fixed to bottom during approach)
2. R3F canvas (rotating logo)
3. HTML content (form, socials, legal)

**Metaball rise (triggered at `top 80%` viewport):**
- 4 blobs: Xenon (#4169FF), Violet (#7B00FF), Crimson (#CC0033), Bioluminescent (#00FF87)
- 2D WebGL marching-squares rendering on `<canvas>`
- Rise animation: blobs start below canvas bottom edge, GSAP `y` drives them upward over 1.2s (ease: power3.out)
- Cursor dent: each blob's metafield influenced by cursor distance (field strength -= proximity × 0.3)
- Spring return: `0.15` stiffness, `0.75` damping
- On scroll into footer: blobs settle, reduce animation, opacity dims to 40%
- On form submit success: all 4 blobs burst outward (GSAP radial scatter), replaced by confetti canvas

**Rotating logo:**
- R3F `<mesh>` with `IridescentMaterial`, Y-axis continuous rotation via `useFrame`
- Logo as texture-mapped plane (`PlaneGeometry` + `IridescentMaterial` with logo as `alphaMap`)
- Hover: rotation speed doubles, Bloom intensity increases

**Contact form fields:** Name, Email, Company, Service Tier (radio — styled as plain text options, no boxes), Message  
**Submission:** Supabase `from('leads').insert(data)`. Success: particle burst + Space Mono `"Message received."` fade in.

**Socials:** Instagram, LinkedIn, Twitter/X, YouTube — icon glow on hover (Xenon Blue)

**Footer info:**
```
studio@enterphantomcode.com
Johannesburg, South Africa
Phantom Code © 2025
```

---

## 8. Accessibility

- WCAG AA minimum, AAA where possible (contrast: black on #FFE900 = ~13:1 ✓)
- `prefers-reduced-motion`: `useReducedMotion` hook sets Zustand `reducedMotion: true`
  - All `useFrame` loops: early return
  - GSAP durations: 0.001s (effectively instant)
  - Particle counts: 0
  - Parallax: disabled (static positioning)
  - Iridescence shader: `uTime` frozen at 0
- Keyboard navigation: all interactive elements reachable via Tab
- ARIA labels on canvas sections: `aria-label="Interactive 3D scene — [description]"`, `role="img"`
- Focus indicators: 2px Xenon Blue outline
- Screen reader: all decorative canvases `aria-hidden="true"`

---

## 9. Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | 90+ |
| LCP | < 2.5s |
| FPS (desktop) | 60 |
| FPS (mobile) | 45+ |
| Bundle (gzipped) | < 150KB JS (excl. Three.js) |

**Strategies:**
- Three.js + R3F: dynamic imported, not in initial bundle
- Each Service/Case chapter geometry: separate dynamic import
- Client logo PNGs: Next.js `<Image>` with `loading="lazy"`
- R3F `frameloop="demand"` on Why Phantom and Problem sections
- `InstancedMesh` for all particle systems

---

## 10. Data & Forms

**Supabase table: `leads`**
```sql
id          uuid primary key default gen_random_uuid()
name        text not null
email       text not null
company     text
tier        text  -- 'installations' | 'activations' | 'xr' | 'immersive'
message     text
created_at  timestamptz default now()
```

Environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 11. Deployment

- Host: Vercel
- Domain: enterphantomcode.com (DNS via existing registrar)
- Preview deploys: on every push to non-main branch
- Environment: production vars set in Vercel dashboard

---

## 12. Asset Checklist

| Asset | Source | Destination |
|---|---|---|
| Brand logo | `C:\Users\User\Downloads\PhantomCodeLogo.png.png` | `public/images/logo.png` |
| Client logos (14) | To be provided / downloaded | `public/images/clients/[name].png` |
| Case study images (3) | Placeholder → real | `public/images/cases/case-[1-3].jpg` |
| Cubemap for iridescence | Generated (drei `CubeCamera`) | Runtime — no file needed |

---

## 13. Implementation Phases

| Phase | Scope | Est. |
|---|---|---|
| 1 | Project scaffold, global systems (Lenis, GSAP, Zustand, audio, cursor, color vars) | Wk 1 |
| 2 | Iridescence shader + `IridescentMaterial`, Hero bubbles, Loading screen | Wk 2 |
| 3 | Nav magnetic ink canvas, Hero particles, post-processing | Wk 2–3 |
| 4 | Problem section parallax, Services scrolljack (all 4 chapters) | Wk 3–4 |
| 5 | Clients physics playground (2D engine + canvas rendering) | Wk 4–5 |
| 6 | Why Phantom counters, Case Studies scrolljack | Wk 5–6 |
| 7 | Footer metaballs, rotating logo, contact form + Supabase | Wk 6–7 |
| 8 | Audio system integration, accessibility audit | Wk 7–8 |
| 9 | Performance optimization, mobile fallbacks | Wk 8–9 |
| 10 | Polish, cross-browser QA, Vercel deployment | Wk 9–10 |

---

## 14. Success Criteria

- Visual: jaw-dropping on yellow ground, every section distinctive
- No cards, no boxes, no generic agency patterns anywhere
- 60 FPS desktop, 45+ FPS mobile
- Lighthouse 90+, LCP < 2.5s
- Every interaction (hover, drag, scroll, click) has physical consequence
- 4 "Book a Call" CTAs (one per service chapter), all tracked
- WCAG AA minimum
- Form submissions land in Supabase `leads` table

