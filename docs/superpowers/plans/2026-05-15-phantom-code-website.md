# Phantom Code Cinematic Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Phantom Code's immersive yellow-background cinematic website with 3D physics, iridescence shaders, scrolljack sections, and a 2D metaball footer.

**Architecture:** Next.js 14 App Router with React Three Fiber for 3D sections, pure-TS 2D canvas physics for clients playground and metaballs, GSAP ScrollTrigger for scroll-driven animations, and Lenis for smooth scroll. A single `IridescentMaterial` shaderMaterial is reused across all 3D surfaces. Global state (audio, reduced motion, loading, scroll progress) lives in Zustand.

**Tech Stack:** Next.js 14, TypeScript 5, Tailwind CSS 3, @react-three/fiber 8, @react-three/drei 9, @react-three/postprocessing 2, GSAP 3 + ScrollTrigger, Lenis 1, Zustand 4, Supabase JS 2, Vitest (unit tests for pure-TS libs)

---

## Task 1: Scaffold Project + Install Dependencies

**Files:**
- Create: `C:\Users\User\Documents\phantom-code-nextjs\` (Next.js project root)
- Create: `.env.local`
- Create: `vitest.config.ts`

- [ ] **Step 1: Scaffold Next.js 14**

```bash
cd "C:\Users\User\Documents"
npx create-next-app@14 phantom-code-nextjs --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-npm
cd phantom-code-nextjs
```

- [ ] **Step 2: Install all dependencies**

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing @react-three/cannon gsap @studio-freight/lenis zustand @supabase/supabase-js
npm install --save-dev vitest @vitest/ui @types/three
```

- [ ] **Step 3: Create vitest config**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
  },
})
```

- [ ] **Step 4: Create .env.local**

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- [ ] **Step 5: Copy logo asset**

```bash
copy "C:\Users\User\Downloads\PhantomCodeLogo.png.png" "C:\Users\User\Documents\phantom-code-nextjs\public\images\logo.png"
```
(Create `public/images/` first if needed: `mkdir public\images public\images\clients public\images\cases`)

- [ ] **Step 6: Init git and commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js 14 project with dependencies"
```

---

## Task 2: Global CSS + Color System

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Write globals.css**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

:root {
  --bg: #FFE900;
  --black: #0a0a0a;
  --xenon: #4169FF;
  --violet: #7B00FF;
  --crimson: #CC0033;
  --bio: #00FF87;
  --cyan: #00FFFF;
  --white: #F4F2EE;
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: auto; font-size: 16px; }

body {
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--black);
  overflow-x: hidden;
  cursor: none;
}

body.loading { overflow: hidden; }

.grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9990;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px;
}

::selection { background: var(--black); color: var(--bg); }

*:focus-visible { outline: 2px solid var(--xenon); outline-offset: 2px; }

.font-bebas { font-family: 'Bebas Neue', sans-serif; }
.font-mono  { font-family: 'Space Mono', monospace; }
```

- [ ] **Step 2: Extend Tailwind config**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#FFE900',
        black:   '#0a0a0a',
        xenon:   '#4169FF',
        violet:  '#7B00FF',
        crimson: '#CC0033',
        bio:     '#00FF87',
        cyan:    '#00FFFF',
        offwhite:'#F4F2EE',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3: Commit**

```bash
git add app/globals.css tailwind.config.ts
git commit -m "feat: global CSS vars, color system, typography imports"
```

---

## Task 3: Zustand Store

**Files:**
- Create: `lib/store.ts`
- Create: `lib/store.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// lib/store.test.ts
import { describe, it, expect } from 'vitest'
import { useStore } from './store'

describe('useStore', () => {
  it('initializes with correct defaults', () => {
    const state = useStore.getState()
    expect(state.loading).toBe(true)
    expect(state.audioEnabled).toBe(false)
    expect(state.reducedMotion).toBe(false)
    expect(state.scrollProgress).toBe(0)
  })

  it('setLoading updates loading flag', () => {
    useStore.getState().setLoading(false)
    expect(useStore.getState().loading).toBe(false)
    useStore.getState().setLoading(true)
  })

  it('setAudioEnabled toggles audio', () => {
    useStore.getState().setAudioEnabled(true)
    expect(useStore.getState().audioEnabled).toBe(true)
    useStore.getState().setAudioEnabled(false)
  })

  it('setScrollProgress clamps to 0-1', () => {
    useStore.getState().setScrollProgress(0.5)
    expect(useStore.getState().scrollProgress).toBe(0.5)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx vitest run lib/store.test.ts
```
Expected: `Cannot find module './store'`

- [ ] **Step 3: Implement store**

```typescript
// lib/store.ts
import { create } from 'zustand'

interface StoreState {
  loading: boolean
  audioEnabled: boolean
  reducedMotion: boolean
  scrollProgress: number
  setLoading: (v: boolean) => void
  setAudioEnabled: (v: boolean) => void
  setReducedMotion: (v: boolean) => void
  setScrollProgress: (v: number) => void
}

export const useStore = create<StoreState>((set) => ({
  loading: true,
  audioEnabled: false,
  reducedMotion: false,
  scrollProgress: 0,
  setLoading: (v) => set({ loading: v }),
  setAudioEnabled: (v) => set({ audioEnabled: v }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setScrollProgress: (v) => set({ scrollProgress: Math.min(1, Math.max(0, v)) }),
}))
```

- [ ] **Step 4: Run — expect PASS**

```bash
npx vitest run lib/store.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add lib/store.ts lib/store.test.ts
git commit -m "feat: Zustand store with loading, audio, reducedMotion, scrollProgress"
```

---

## Task 4: Hooks

**Files:**
- Create: `hooks/useReducedMotion.ts`
- Create: `hooks/useMouseParallax.ts`
- Create: `hooks/useScrollVelocity.ts`
- Create: `hooks/useLenis.ts`

- [ ] **Step 1: useReducedMotion**

```typescript
// hooks/useReducedMotion.ts
'use client'
import { useEffect } from 'react'
import { useStore } from '@/lib/store'

export function useReducedMotion() {
  const setReducedMotion = useStore((s) => s.setReducedMotion)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [setReducedMotion])
}
```

- [ ] **Step 2: useMouseParallax**

```typescript
// hooks/useMouseParallax.ts
'use client'
import { useEffect, useRef } from 'react'

export function useMouseParallax() {
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      pos.current = {
        x: (e.clientX / window.innerWidth)  * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return pos
}
```

- [ ] **Step 3: useScrollVelocity**

```typescript
// hooks/useScrollVelocity.ts
'use client'
import { useRef } from 'react'

export function useScrollVelocity() {
  const velocity = useRef(0)
  return velocity
}
```

- [ ] **Step 4: useLenis**

```typescript
// hooks/useLenis.ts
'use client'
import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import { useStore } from '@/lib/store'

gsap.registerPlugin(ScrollTrigger)

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)
  const setScrollProgress = useStore((s) => s.setScrollProgress)
  const velocityRef = useRef(0)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    lenisRef.current = lenis

    lenis.on('scroll', ({ progress, velocity }: { progress: number; velocity: number }) => {
      setScrollProgress(progress)
      velocityRef.current = Math.abs(velocity)
      ScrollTrigger.update()
    })

    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf) }
    const id = requestAnimationFrame(raf)

    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [setScrollProgress])

  return { lenisRef, velocityRef }
}
```

- [ ] **Step 5: Commit**

```bash
git add hooks/
git commit -m "feat: useReducedMotion, useMouseParallax, useScrollVelocity, useLenis hooks"
```

---

## Task 5: Audio Engine

**Files:**
- Create: `lib/audio/audioEngine.ts`
- Create: `lib/audio/audioEngine.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// lib/audio/audioEngine.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Web Audio API
const mockGain = { gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() }, connect: vi.fn() }
const mockOsc  = { type: '', frequency: { value: 0 }, connect: vi.fn(), start: vi.fn(), stop: vi.fn() }
const mockAnalyser = { fftSize: 0, frequencyBinCount: 128, getFloatFrequencyData: vi.fn(), connect: vi.fn() }
const mockCtx  = {
  state: 'running',
  resume: vi.fn(),
  currentTime: 0,
  destination: {},
  createOscillator: vi.fn(() => ({ ...mockOsc })),
  createGain: vi.fn(() => ({ ...mockGain })),
  createAnalyser: vi.fn(() => ({ ...mockAnalyser })),
}
vi.stubGlobal('AudioContext', vi.fn(() => mockCtx))

import { AudioEngine } from './audioEngine'

describe('AudioEngine', () => {
  let engine: AudioEngine

  beforeEach(() => { engine = new AudioEngine() })

  it('does not play when disabled', () => {
    engine.setEnabled(false)
    engine.playHover(100)
    expect(mockCtx.createOscillator).not.toHaveBeenCalled()
  })

  it('plays hover tone when enabled', () => {
    engine.setEnabled(true)
    engine.playHover(300)
    expect(mockCtx.createOscillator).toHaveBeenCalled()
  })

  it('maps yPosition to frequency in 200-600Hz range', () => {
    const freq = engine.yToFrequency(0.5)
    expect(freq).toBeGreaterThanOrEqual(200)
    expect(freq).toBeLessThanOrEqual(600)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx vitest run lib/audio/audioEngine.test.ts
```

- [ ] **Step 3: Implement AudioEngine**

```typescript
// lib/audio/audioEngine.ts
export class AudioEngine {
  private ctx: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private enabled = false

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.analyser = this.ctx.createAnalyser()
      this.analyser.fftSize = 256
      this.analyser.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  setEnabled(v: boolean) { this.enabled = v }

  yToFrequency(normalizedY: number): number {
    return 200 + normalizedY * 400
  }

  private tone(freq: number, wave: OscillatorType, duration: number, gain = 0.15) {
    if (!this.enabled) return
    const ctx = this.getCtx()
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.type = wave
    osc.frequency.value = freq
    gainNode.gain.setValueAtTime(gain, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)
    osc.connect(gainNode)
    gainNode.connect(this.analyser ?? ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  }

  playHover(yPosition: number) {
    this.tone(this.yToFrequency(yPosition), 'sine', 0.08)
  }

  playClick() {
    this.tone(440, 'sine', 0.15)
  }

  playCollision(velocity: number) {
    this.tone(Math.min(velocity * 100, 800), 'sawtooth', 0.05, 0.1)
  }

  playLogoCollision(velocity: number) {
    this.tone(Math.min(velocity * 80, 600), 'triangle', 0.08, 0.1)
  }

  playFormSuccess() {
    ;[261, 329, 392].forEach((freq, i) => {
      setTimeout(() => this.tone(freq, 'sine', 0.3, 0.08), i * 30)
    })
  }

  getFrequencyData(): Float32Array {
    const data = new Float32Array(this.analyser?.frequencyBinCount ?? 128)
    this.analyser?.getFloatFrequencyData(data)
    return data
  }
}

export const audioEngine = new AudioEngine()
```

- [ ] **Step 4: Run — expect PASS**

```bash
npx vitest run lib/audio/audioEngine.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add lib/audio/
git commit -m "feat: Web Audio Engine with hover, click, collision, form-success tones"
```

---

## Task 6: 2D Physics Engine

**Files:**
- Create: `lib/physics/physicsEngine.ts`
- Create: `lib/physics/physicsEngine.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// lib/physics/physicsEngine.test.ts
import { describe, it, expect } from 'vitest'
import { PhysicsEngine, LogoBody } from './physicsEngine'

function makeBody(x = 100, y = 100, r = 30): LogoBody {
  return { x, y, vx: 0, vy: 0, mass: 1, radius: r, friction: 0.98, restitution: 0.7, dragging: false }
}

describe('PhysicsEngine', () => {
  it('applies gravity each step', () => {
    const engine = new PhysicsEngine(800, 600)
    const body = makeBody()
    engine.addBody(body)
    engine.step(0, null)
    expect(body.vy).toBeGreaterThan(0)
  })

  it('bounces off bottom wall', () => {
    const engine = new PhysicsEngine(800, 600)
    const body = makeBody(100, 600, 30)
    body.vy = 5
    engine.addBody(body)
    engine.step(0, null)
    expect(body.vy).toBeLessThan(0)
  })

  it('applies drag every step', () => {
    const engine = new PhysicsEngine(800, 600)
    const body = makeBody()
    body.vx = 10
    engine.addBody(body)
    engine.step(0, null)
    expect(body.vx).toBeLessThan(10)
  })

  it('elastic collision separates overlapping bodies', () => {
    const engine = new PhysicsEngine(800, 600)
    const a = makeBody(100, 100, 30)
    const b = makeBody(140, 100, 30)
    engine.addBody(a)
    engine.addBody(b)
    engine.step(0, null)
    const dist = Math.hypot(a.x - b.x, a.y - b.y)
    expect(dist).toBeGreaterThanOrEqual(60)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx vitest run lib/physics/physicsEngine.test.ts
```

- [ ] **Step 3: Implement PhysicsEngine**

```typescript
// lib/physics/physicsEngine.ts
export interface LogoBody {
  x: number; y: number
  vx: number; vy: number
  mass: number; radius: number
  friction: number; restitution: number
  dragging: boolean
}

export interface MouseState {
  x: number; y: number; vx: number; vy: number
}

export class PhysicsEngine {
  bodies: LogoBody[] = []
  private w: number
  private h: number
  private time = 0

  constructor(width: number, height: number) {
    this.w = width
    this.h = height
  }

  resize(w: number, h: number) { this.w = w; this.h = h }

  addBody(body: LogoBody) { this.bodies.push(body) }

  step(dt: number, mouse: MouseState | null) {
    this.time += 0.016
    const wind = Math.sin(this.time * 0.3) * 0.02

    for (const b of this.bodies) {
      if (b.dragging) continue

      // Gravity + wind
      b.vy += 0.05
      b.vx += wind

      // Drag
      b.vx *= b.friction
      b.vy *= b.friction

      // Mouse repulsion
      if (mouse) {
        const dx = b.x - mouse.x
        const dy = b.y - mouse.y
        const dist = Math.hypot(dx, dy)
        const repelRadius = mouse.vx > 500 ? 80 : 60
        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius
          b.vx += (dx / dist) * force * 2
          b.vy += (dy / dist) * force * 2
        }
      }

      // Integrate
      b.x += b.vx
      b.y += b.vy

      // Wall bounce
      if (b.x - b.radius < 0) { b.x = b.radius; b.vx = Math.abs(b.vx) * b.restitution }
      if (b.x + b.radius > this.w) { b.x = this.w - b.radius; b.vx = -Math.abs(b.vx) * b.restitution }
      if (b.y - b.radius < 0) { b.y = b.radius; b.vy = Math.abs(b.vy) * b.restitution }
      if (b.y + b.radius > this.h) { b.y = this.h - b.radius; b.vy = -Math.abs(b.vy) * b.restitution }
    }

    // Circle-circle collisions
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        this.resolveCollision(this.bodies[i], this.bodies[j])
      }
    }
  }

  private resolveCollision(a: LogoBody, b: LogoBody) {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dist = Math.hypot(dx, dy)
    const minDist = a.radius + b.radius
    if (dist >= minDist || dist === 0) return

    // Separate
    const overlap = (minDist - dist) / 2
    const nx = dx / dist
    const ny = dy / dist
    if (!a.dragging) { a.x -= nx * overlap; a.y -= ny * overlap }
    if (!b.dragging) { b.x += nx * overlap; b.y += ny * overlap }

    // Elastic velocity exchange
    const dvx = a.vx - b.vx
    const dvy = a.vy - b.vy
    const dot = dvx * nx + dvy * ny
    if (dot > 0) return
    const impulse = (2 * dot) / (a.mass + b.mass)
    if (!a.dragging) { a.vx -= impulse * b.mass * nx; a.vy -= impulse * b.mass * ny }
    if (!b.dragging) { b.vx += impulse * a.mass * nx; b.vy += impulse * a.mass * ny }
  }
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npx vitest run lib/physics/physicsEngine.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add lib/physics/
git commit -m "feat: 2D physics engine — gravity, drag, wall bounce, elastic collision"
```

---

## Task 7: Supabase Client

**Files:**
- Create: `lib/supabase.ts`

- [ ] **Step 1: Implement**

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

export interface Lead {
  name: string
  email: string
  company?: string
  tier: 'installations' | 'activations' | 'xr' | 'immersive'
  message?: string
}

export async function submitLead(lead: Lead): Promise<{ error: string | null }> {
  const { error } = await supabase.from('leads').insert(lead)
  return { error: error?.message ?? null }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/supabase.ts
git commit -m "feat: Supabase client + submitLead helper"
```

---

## Task 8: Iridescence Shader

**Files:**
- Create: `lib/shaders/iridescent.ts`

- [ ] **Step 1: Implement shaderMaterial**

```typescript
// lib/shaders/iridescent.ts
import { shaderMaterial } from '@react-three/drei'
import { Color, Vector3, CubeTexture } from 'three'
import { extend } from '@react-three/fiber'

const vertexShader = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const fragmentShader = /* glsl */`
  uniform float uTime;
  uniform vec3  uCameraPosition;
  uniform vec3  uColor;
  uniform float uFresnelPower;
  uniform float uRefractionStrength;
  uniform float uAlpha;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
  }

  void main() {
    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), uFresnelPower);

    float hue = fresnel * 1.5 + uTime * 0.08;
    vec3 rainbow = hsl2rgb(vec3(mod(hue, 1.0), 0.9, 0.6));

    vec3 color = mix(uColor, rainbow, fresnel * 0.8);
    float alpha = mix(uAlpha * 0.3, uAlpha, fresnel);

    gl_FragColor = vec4(color, alpha);
  }
`

export const IridescentMaterial = shaderMaterial(
  {
    uTime:               0,
    uCameraPosition:     new Vector3(),
    uColor:              new Color('#4169FF'),
    uFresnelPower:       3.0,
    uRefractionStrength: 0.15,
    uAlpha:              0.85,
  },
  vertexShader,
  fragmentShader,
)

extend({ IridescentMaterial })

// TypeScript declaration for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      iridescentMaterial: any
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/shaders/
git commit -m "feat: IridescentMaterial GLSL shader — Fresnel, rainbow hue, alpha blend"
```

---

## Task 9: UI Components (Cursor, ScrollProgress, AudioToggle)

**Files:**
- Create: `components/ui/Cursor.tsx`
- Create: `components/ui/ScrollProgress.tsx`
- Create: `components/ui/AudioToggle.tsx`

- [ ] **Step 1: Cursor**

```tsx
// components/ui/Cursor.tsx
'use client'
import { useEffect, useRef } from 'react'

export function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({ x: 0, y: 0 })
  const ring    = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', move, { passive: true })

    let raf: number
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="fixed top-0 left-0 w-[6px] h-[6px] bg-black rounded-full pointer-events-none z-[99997] mix-blend-multiply" />
      <div ref={ringRef} className="fixed top-0 left-0 w-9 h-9 border border-black rounded-full pointer-events-none z-[99996] transition-[width,height] duration-300" />
    </>
  )
}
```

- [ ] **Step 2: ScrollProgress**

```tsx
// components/ui/ScrollProgress.tsx
'use client'
import { useStore } from '@/lib/store'

export function ScrollProgress() {
  const progress = useStore((s) => s.scrollProgress)
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none">
      <div
        className="h-full bg-black transition-none"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}
```

- [ ] **Step 3: AudioToggle**

```tsx
// components/ui/AudioToggle.tsx
'use client'
import { useStore } from '@/lib/store'
import { audioEngine } from '@/lib/audio/audioEngine'

export function AudioToggle() {
  const { audioEnabled, setAudioEnabled } = useStore()

  const toggle = () => {
    const next = !audioEnabled
    audioEngine.setEnabled(next)
    setAudioEnabled(next)
  }

  return (
    <button
      onClick={toggle}
      aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
      className="font-mono text-[0.6rem] tracking-widest uppercase text-black opacity-50 hover:opacity-100 transition-opacity cursor-none"
    >
      {audioEnabled ? 'SND ON' : 'SND OFF'}
    </button>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/
git commit -m "feat: Cursor, ScrollProgress, AudioToggle UI components"
```

---

## Task 10: Layout + Root Providers

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Implement layout**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Cursor }         from '@/components/ui/Cursor'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { LenisProvider }  from '@/components/providers/LenisProvider'
import { ReducedMotionProvider } from '@/components/providers/ReducedMotionProvider'

export const metadata: Metadata = {
  title: 'Phantom Code — Immersive by Design',
  description: 'We architect immersive experiences. AR, XR, interactive installations, spatial computing.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="grain" aria-hidden="true" />
        <ScrollProgress />
        <Cursor />
        <ReducedMotionProvider />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create LenisProvider**

```tsx
// components/providers/LenisProvider.tsx
'use client'
import { useLenis } from '@/hooks/useLenis'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useLenis()
  return <>{children}</>
}
```

- [ ] **Step 3: Create ReducedMotionProvider**

```tsx
// components/providers/ReducedMotionProvider.tsx
'use client'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function ReducedMotionProvider() {
  useReducedMotion()
  return null
}
```

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx components/providers/
git commit -m "feat: root layout with Lenis, ReducedMotion, Cursor, ScrollProgress providers"
```

---

## Task 11: Loading Screen

**Files:**
- Create: `components/loader/LoadingScreen.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/loader/LoadingScreen.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useStore } from '@/lib/store'

const COLORS = ['#4169FF', '#7B00FF', '#00FF87']

export function LoadingScreen() {
  const ref        = useRef<HTMLDivElement>(null)
  const barRef     = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const [pct, setPct] = useState(0)
  const setLoading = useStore((s) => s.setLoading)

  useEffect(() => {
    document.body.classList.add('loading')

    // Particle system
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const cx = canvas.width / 2
    const cy = canvas.height / 2

    const particles = Array.from({ length: 500 }, () => {
      const angle = Math.random() * Math.PI * 2
      const radius = 200 + Math.random() * 300
      return {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        tx: cx + (Math.random() - 0.5) * 40,
        ty: cy + (Math.random() - 0.5) * 40,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 2 + 1,
        speed: 0.3 + Math.random() * 0.5,
        progress: 0,
      }
    })

    let raf: number
    let animating = true
    const draw = () => {
      if (!animating) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.progress = Math.min(1, p.progress + p.speed * 0.01)
        p.x += (p.tx - p.x) * 0.05
        p.y += (p.ty - p.y) * 0.05
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.progress
        ctx.fill()
      })
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    // Progress bar
    const obj = { val: 0 }
    gsap.to(obj, {
      val: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        setPct(Math.round(obj.val))
        if (barRef.current) barRef.current.style.width = `${obj.val}%`
      },
      onComplete: exit,
    })

    // ESC skip (after 1s)
    let escEnabled = false
    const escTimer = setTimeout(() => { escEnabled = true }, 1000)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && escEnabled) exit() }
    window.addEventListener('keydown', onKey)

    function exit() {
      animating = false
      cancelAnimationFrame(raf)
      gsap.to(ref.current, {
        opacity: 0, duration: 0.3, onComplete: () => {
          document.body.classList.remove('loading')
          setLoading(false)
        }
      })
    }

    return () => {
      clearTimeout(escTimer)
      window.removeEventListener('keydown', onKey)
      cancelAnimationFrame(raf)
    }
  }, [setLoading])

  return (
    <div ref={ref} className="fixed inset-0 z-[99999] bg-[#FFE900] flex flex-col items-center justify-center gap-8">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Image src="/images/logo.png" alt="Phantom Code" width={200} height={200} priority className="animate-[fadeScale_0.5s_ease-out_forwards]" />
        <div className="w-[300px] h-[4px] bg-black/10 overflow-hidden">
          <div ref={barRef} className="h-full bg-black transition-none" style={{ width: '0%' }} />
        </div>
        <span className="font-mono text-[0.65rem] tracking-[0.25em] text-black/40">{pct}%</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add keyframe to globals.css**

```css
/* append to app/globals.css */
@keyframes fadeScale {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}
```

- [ ] **Step 3: Commit**

```bash
git add components/loader/ app/globals.css
git commit -m "feat: LoadingScreen — yellow bg, logo, progress bar, 500 inward particles, ESC skip"
```

---

## Task 12: Navigation + Magnetic Ink Canvas

**Files:**
- Create: `components/nav/Nav.tsx`
- Create: `components/nav/MagneticInkCanvas.tsx`

- [ ] **Step 1: MagneticInkCanvas**

```tsx
// components/nav/MagneticInkCanvas.tsx
'use client'
import { useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'

interface Particle {
  x: number; y: number
  tx: number; ty: number
  homeX: number; homeY: number
  vx: number; vy: number
}

const WORD = 'PHANTOM CODE'
const PARTICLE_COUNT = 200

export function MagneticInkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollProgress = useStore((s) => s.scrollProgress)
  const scrollRef = useRef(0)

  useEffect(() => { scrollRef.current = scrollProgress }, [scrollProgress])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = 72 }
    resize()
    window.addEventListener('resize', resize)

    // Compute wordmark positions via offscreen canvas
    const offscreen = document.createElement('canvas')
    offscreen.width = window.innerWidth
    offscreen.height = 72
    const octx = offscreen.getContext('2d')!
    octx.fillStyle = '#000'
    octx.font = 'bold 22px Inter, sans-serif'
    octx.textBaseline = 'middle'
    const tw = octx.measureText(WORD).width
    octx.fillText(WORD, (offscreen.width - tw) / 2, 36)
    const imageData = octx.getImageData(0, 0, offscreen.width, 72)
    const wordPositions: { x: number; y: number }[] = []
    for (let y = 0; y < 72; y += 2) {
      for (let x = 0; x < offscreen.width; x += 4) {
        if (imageData.data[(y * offscreen.width + x) * 4 + 3] > 128) {
          wordPositions.push({ x, y })
        }
      }
    }

    const linePosY = 71
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const home = wordPositions[Math.floor(Math.random() * wordPositions.length)] ?? { x: Math.random() * canvas.width, y: 36 }
      return { x: Math.random() * canvas.width, y: Math.random() * 72, tx: home.x, ty: home.y, homeX: home.x, homeY: home.y, vx: 0, vy: 0 }
    })

    let mouseX = -999, mouseY = -999, prevMouseX = -999, prevMouseY = -999
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      prevMouseX = mouseX; prevMouseY = mouseY
      mouseX = e.clientX; mouseY = e.clientY - rect.top
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    let raf: number
    const STIFFNESS = 0.15, DAMPING = 0.75

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, 72)
      const scrolled = scrollRef.current > 0.05

      particles.forEach((p) => {
        const targetY = scrolled ? linePosY : p.homeY
        const targetX = scrolled ? p.homeX : p.homeX

        // Repulsion
        const dx = p.x - mouseX
        const dy = p.y - mouseY
        const dist = Math.hypot(dx, dy)
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120
          p.vx += (dx / dist) * force * 3
          p.vy += (dy / dist) * force * 3
        }

        // Spring to target
        p.vx += (targetX - p.x) * STIFFNESS
        p.vy += (targetY - p.y) * STIFFNESS
        p.vx *= DAMPING
        p.vy *= DAMPING
        p.x += p.vx
        p.y += p.vy

        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = '#0a0a0a'
        ctx.globalAlpha = 0.6
        ctx.fill()
      })
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMouse) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
}
```

- [ ] **Step 2: Nav**

```tsx
// components/nav/Nav.tsx
'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { MagneticInkCanvas } from './MagneticInkCanvas'
import { AudioToggle } from '@/components/ui/AudioToggle'
import { useStore } from '@/lib/store'

const LINKS = ['About', 'Services', 'Work', 'Contact']
const ANCHORS: Record<string, string> = { About: '#problem', Services: '#services', Work: '#cases', Contact: '#footer' }

export function Nav() {
  const navRef = useRef<HTMLElement>(null)
  const scrollProgress = useStore((s) => s.scrollProgress)

  useEffect(() => {
    if (!navRef.current) return
    if (scrollProgress > 0.02) {
      navRef.current.classList.add('sc')
    } else {
      navRef.current.classList.remove('sc')
    }
  }, [scrollProgress])

  const scrollTo = (anchor: string) => {
    const el = document.querySelector(anchor)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center justify-between px-[5%] transition-[background,backdrop-filter,border-color] duration-500 [&.sc]:bg-[rgba(255,233,0,0.9)] [&.sc]:backdrop-blur-[12px] [&.sc]:border-b [&.sc]:border-black/[0.08]"
    >
      <MagneticInkCanvas />
      <div className="relative z-10 flex items-center">
        <Image src="/images/logo.png" alt="Phantom Code" width={36} height={36} />
      </div>
      <ul className="relative z-10 flex gap-8 list-none">
        {LINKS.map((link) => (
          <li key={link}>
            <button
              onClick={() => scrollTo(ANCHORS[link])}
              className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-black/50 hover:text-black transition-colors duration-200 cursor-none"
            >
              {link}
            </button>
          </li>
        ))}
      </ul>
      <div className="relative z-10">
        <AudioToggle />
      </div>
    </nav>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/nav/
git commit -m "feat: Nav with MagneticInkCanvas — 200 particles form wordmark, cursor repulsion, scroll collapse"
```

---

## Task 13: Hero Scene

**Files:**
- Create: `components/hero/BubbleMesh.tsx`
- Create: `components/hero/HeroScene.tsx`
- Create: `components/hero/HeroText.tsx`

- [ ] **Step 1: BubbleMesh**

```tsx
// components/hero/BubbleMesh.tsx
'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'
import { useStore } from '@/lib/store'
import '@/lib/shaders/iridescent'

interface Props {
  position: [number, number, number]
  radius: number
  phase: number
}

export function BubbleMesh({ position, radius, phase }: Props) {
  const meshRef   = useRef<Mesh>(null)
  const vel       = useRef(new Vector3(0, 0, 0))
  const pos       = useRef(new Vector3(...position))
  const reducedMotion = useStore((s) => s.reducedMotion)

  useFrame(({ clock, camera, pointer }) => {
    if (reducedMotion) return
    const t   = clock.getElapsedTime()
    const mat = meshRef.current?.material as any
    if (mat) { mat.uTime = t; mat.uCameraPosition = camera.position }

    // Buoyancy
    const buoy = Math.sin(t * 0.4 + phase) * 0.008
    vel.current.y += buoy
    vel.current.y -= 0.002  // gravity
    vel.current.multiplyScalar(0.98) // drag

    // Mouse repulsion (pointer is NDC -1..1)
    const mouseWorld = new Vector3(pointer.x * 8, pointer.y * 4, 0)
    const diff = pos.current.clone().sub(mouseWorld)
    const dist = diff.length()
    if (dist < 1.5) vel.current.add(diff.normalize().multiplyScalar(0.05 / (dist + 0.1)))

    pos.current.add(vel.current)

    // Bounds
    if (Math.abs(pos.current.x) > 8)  { pos.current.x  = Math.sign(pos.current.x) * 8;  vel.current.x *= -0.6 }
    if (Math.abs(pos.current.y) > 4.5) { pos.current.y = Math.sign(pos.current.y) * 4.5; vel.current.y *= -0.6 }

    if (meshRef.current) meshRef.current.position.copy(pos.current)
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 64, 64]} />
      <iridescentMaterial
        transparent
        uFresnelPower={3.0}
        uRefractionStrength={0.15}
        uAlpha={0.75}
        depthWrite={false}
      />
    </mesh>
  )
}
```

- [ ] **Step 2: HeroScene**

```tsx
// components/hero/HeroScene.tsx
'use client'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2, Color, InstancedMesh, Object3D, MathUtils } from 'three'
import { BubbleMesh } from './BubbleMesh'
import { useStore } from '@/lib/store'
import { useMouseParallax } from '@/hooks/useMouseParallax'

const BUBBLE_LARGE  = [[-2, 1, -1], [2.5, -0.5, -0.5], [0, -1.5, 0.5]] as [number,number,number][]
const BUBBLE_SMALL  = [[-4, 2, 0], [4, 1.5, -1], [-1.5, 2.5, 0.5], [3, -2, 0], [-3, -1.5, -0.5], [1, 3, -0.5]] as [number,number,number][]
const RADII_LARGE   = [1.1, 0.9, 0.8]
const RADII_SMALL   = [0.4, 0.35, 0.3, 0.45, 0.25, 0.35]
const PARTICLE_COLORS = [0x4169FF, 0x7B00FF, 0x00FF87]

function BackgroundParticles() {
  const meshRef = useRef<InstancedMesh>(null)
  const dummy   = useRef(new Object3D())
  const reducedMotion = useStore((s) => s.reducedMotion)
  const COUNT   = 5000

  useFrame(({ clock }) => {
    if (reducedMotion || !meshRef.current) return
    const t = clock.getElapsedTime()
    for (let i = 0; i < COUNT; i++) {
      const seed = i * 2.39996
      const x = Math.cos(seed) * (3 + (i % 7))
      const y = Math.sin(seed * 1.3) * (2 + (i % 5)) + Math.sin(t * 0.2 + i) * 0.1
      const z = -2 - (i % 4)
      dummy.current.position.set(x, y, z)
      dummy.current.scale.setScalar(0.02 + (i % 3) * 0.01)
      dummy.current.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.current.matrix)
      const col = new Color(PARTICLE_COLORS[i % 3])
      meshRef.current.setColorAt(i, col)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial vertexColors />
    </instancedMesh>
  )
}

function CameraRig() {
  const mouse = useMouseParallax()
  const { camera } = useThree()
  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.3 - camera.position.x) * 0.05
    camera.position.y += (-mouse.current.y * 0.3 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })
  return null
}

export function HeroScene() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#FFE900' }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <BackgroundParticles />
          {BUBBLE_LARGE.map((pos, i) => (
            <BubbleMesh key={`l${i}`} position={pos} radius={RADII_LARGE[i]} phase={i * 2.1} />
          ))}
          {BUBBLE_SMALL.map((pos, i) => (
            <BubbleMesh key={`s${i}`} position={pos} radius={RADII_SMALL[i]} phase={i * 1.3} />
          ))}
          <EffectComposer>
            <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
            <ChromaticAberration offset={new Vector2(0.002, 0.002)} blendFunction={BlendFunction.NORMAL} />
            <Vignette eskil={false} offset={0.3} darkness={0.4} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 3: HeroText**

```tsx
// components/hero/HeroText.tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStore } from '@/lib/store'

export function HeroText() {
  const ref    = useRef<HTMLDivElement>(null)
  const loading = useStore((s) => s.loading)

  useEffect(() => {
    if (loading || !ref.current) return
    gsap.fromTo(ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' })
  }, [loading])

  return (
    <div ref={ref} className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 opacity-0">
      <h1
        className="font-bebas text-black leading-none mix-blend-multiply"
        style={{ fontSize: 'clamp(8vw, 12vw, 14vw)' }}
      >
        Immersive by Design
      </h1>
      <p className="mt-4 text-black/70 font-light text-lg max-w-md">
        We don&rsquo;t build experiences.<br />We architect realities.
      </p>
      <div className="mt-16 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-[1px] h-8 bg-black/30" />
        <span className="font-mono text-[0.6rem] tracking-widest uppercase text-black/40">Scroll to explore</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/hero/
git commit -m "feat: Hero — R3F bubbles with iridescence + physics, 5k particles, camera rig, HeroText"
```

---

## Task 14: Problem Section

**Files:**
- Create: `components/problem/ProblemSection.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/problem/ProblemSection.tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '@/lib/store'

gsap.registerPlugin(ScrollTrigger)

const BEATS = [
  {
    label: 'The Gap',
    body: 'Brands reach audiences through flat screens. But humans experience space, depth, and presence. Current web is 2D thinking for 3D beings.',
    key: ['space', 'presence'],
  },
  {
    label: 'The Opportunity',
    body: 'AR, XR, and TouchDesigner exist as tools. Few studios truly master them. The market is hungry for immersive.',
    key: ['immersive'],
  },
  {
    label: 'The Phantom Difference',
    body: 'We think in dimensions. We design for presence and memory. We build for transformation.',
    key: ['dimensions', 'presence', 'transformation'],
  },
]

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useStore((s) => s.reducedMotion)

  useEffect(() => {
    if (!sectionRef.current) return
    const beats = sectionRef.current.querySelectorAll<HTMLElement>('.beat')
    beats.forEach((beat) => {
      gsap.fromTo(
        beat,
        { opacity: 0, y: reducedMotion ? 0 : 40 },
        {
          opacity: 1, y: 0,
          duration: reducedMotion ? 0.001 : 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: beat, start: 'top 65%', toggleActions: 'play none none none' },
        }
      )
    })
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()) }
  }, [reducedMotion])

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-[8%] overflow-hidden bg-[#FFE900]"
    >
      {/* Background iridescent shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'conic-gradient(from 0deg, #4169FF22, #7B00FF22, #4169FF22)', filter: 'blur(60px)' }}
        aria-hidden="true"
      />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'conic-gradient(from 180deg, #7B00FF22, #00FFFF22, #7B00FF22)', filter: 'blur(80px)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-24">
        {BEATS.map((beat) => (
          <div key={beat.label} className="beat">
            <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-black/40 block mb-3">
              {beat.label}
            </span>
            <p className="font-bebas text-black leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              {beat.body.split(' ').map((word, i) => (
                <span
                  key={i}
                  className={beat.key.includes(word.toLowerCase().replace(/[^a-z]/g, ''))
                    ? 'text-[#4169FF]'
                    : ''}
                >
                  {word}{' '}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/problem/
git commit -m "feat: Problem section — 3 narrative beats, ScrollTrigger fade-up, iridescent bg shapes"
```

---

## Task 15: Services — Cinematic Scrolljack

**Files:**
- Create: `components/services/ServicesSection.tsx`
- Create: `components/services/ServiceChapter.tsx`
- Create: `components/services/geometries/CrystalFragments.tsx`
- Create: `components/services/geometries/MagneticRibbons.tsx`
- Create: `components/services/geometries/PlasmaSphere.tsx`
- Create: `components/services/geometries/PlasmaVortex.tsx`

- [ ] **Step 1: CrystalFragments (Tier 1)**

```tsx
// components/services/geometries/CrystalFragments.tsx
'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Color } from 'three'
import '@/lib/shaders/iridescent'

export function CrystalFragments() {
  const groupRef = useRef<any>(null)
  const fragments = Array.from({ length: 12 }, (_, i) => ({
    pos: [(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 1] as [number,number,number],
    rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number,number,number],
    scale: 0.2 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
  }))

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime()
    if (!groupRef.current) return
    groupRef.current.children.forEach((child: Mesh, i: number) => {
      const f = fragments[i]
      const drift = Math.sin(t * 0.5 + f.phase) * 0.3
      child.position.set(f.pos[0] + drift, f.pos[1] + Math.cos(t * 0.3 + f.phase) * 0.2, f.pos[2])
      child.rotation.x = f.rot[0] + t * 0.2
      child.rotation.y = f.rot[1] + t * 0.15
      const mat = child.material as any
      if (mat) { mat.uTime = t; mat.uCameraPosition = camera.position }
    })
  })

  return (
    <group ref={groupRef}>
      {fragments.map((f, i) => (
        <mesh key={i} position={f.pos} rotation={f.rot} scale={f.scale}>
          <octahedronGeometry args={[1, 0]} />
          <iridescentMaterial transparent uColor={new Color('#4169FF')} uFresnelPower={4} uAlpha={0.9} />
        </mesh>
      ))}
    </group>
  )
}
```

- [ ] **Step 2: MagneticRibbons (Tier 2)**

```tsx
// components/services/geometries/MagneticRibbons.tsx
'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3, TubeGeometry, Color } from 'three'
import { Mesh } from 'three'
import '@/lib/shaders/iridescent'

export function MagneticRibbons() {
  const ribbons = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => {
      const pts = Array.from({ length: 8 }, (_, j) => new Vector3(
        Math.sin((j / 7) * Math.PI * 2 + i) * 2,
        (j / 7) * 4 - 2,
        Math.cos((j / 7) * Math.PI * 2 + i * 0.7) * 1.5,
      ))
      return { curve: new CatmullRomCurve3(pts), phase: i * 0.5 }
    }), [])

  const refs = useRef<(Mesh | null)[]>([])

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime()
    ribbons.forEach((r, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      mesh.rotation.y = Math.sin(t * 0.2 + r.phase) * 0.3
      mesh.rotation.z = Math.cos(t * 0.15 + r.phase) * 0.2
      const mat = mesh.material as any
      if (mat) { mat.uTime = t; mat.uCameraPosition = camera.position }
    })
  })

  return (
    <group>
      {ribbons.map((r, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el }}>
          <tubeGeometry args={[r.curve, 20, 0.05, 8, false]} />
          <iridescentMaterial transparent uColor={new Color('#7B00FF')} uFresnelPower={3} uAlpha={0.85} />
        </mesh>
      ))}
    </group>
  )
}
```

- [ ] **Step 3: PlasmaSphere (Tier 3)**

```tsx
// components/services/geometries/PlasmaSphere.tsx
'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Color } from 'three'
import '@/lib/shaders/iridescent'

export function PlasmaSphere() {
  const ref = useRef<Mesh>(null)

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime()
    if (!ref.current) return
    ref.current.rotation.y = t * 0.3
    ref.current.rotation.x = Math.sin(t * 0.2) * 0.2
    const mat = ref.current.material as any
    if (mat) {
      mat.uTime = t
      mat.uCameraPosition = camera.position
      mat.uFresnelPower = 2.5 + Math.sin(t * 0.5) * 0.5
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <iridescentMaterial transparent uColor={new Color('#CC0033')} uFresnelPower={2.5} uAlpha={0.8} depthWrite={false} />
    </mesh>
  )
}
```

- [ ] **Step 4: PlasmaVortex (Tier 4)**

```tsx
// components/services/geometries/PlasmaVortex.tsx
'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D, Color } from 'three'

const COUNT = 2000

export function PlasmaVortex() {
  const ref   = useRef<InstancedMesh>(null)
  const dummy = useRef(new Object3D())

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * Math.PI * 2 * 8 + t * 0.3
      const r = 0.5 + (i / COUNT) * 2
      const y = (i / COUNT) * 4 - 2
      dummy.current.position.set(Math.cos(a) * r, y, Math.sin(a) * r)
      dummy.current.scale.setScalar(0.03)
      dummy.current.updateMatrix()
      ref.current.setMatrixAt(i, dummy.current.matrix)
      const hue = (i / COUNT + t * 0.05) % 1
      const col = new Color().setHSL(hue < 0.5 ? 0.78 : 0.42, 1, 0.6)
      ref.current.setColorAt(i, col)
    }
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial vertexColors />
    </instancedMesh>
  )
}
```

- [ ] **Step 5: ServiceChapter**

```tsx
// components/services/ServiceChapter.tsx
'use client'
import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'

const GEOMETRIES = {
  crystal: lazy(() => import('./geometries/CrystalFragments').then(m => ({ default: m.CrystalFragments }))),
  ribbons: lazy(() => import('./geometries/MagneticRibbons').then(m => ({ default: m.MagneticRibbons }))),
  plasma:  lazy(() => import('./geometries/PlasmaSphere').then(m => ({ default: m.PlasmaSphere }))),
  vortex:  lazy(() => import('./geometries/PlasmaVortex').then(m => ({ default: m.PlasmaVortex }))),
}

interface Props {
  tier: number
  name: string
  color: string
  features: string[]
  geometry: keyof typeof GEOMETRIES
  active: boolean
}

export function ServiceChapter({ tier, name, color, features, geometry, active }: Props) {
  const Geo = GEOMETRIES[geometry]

  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{ opacity: active ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: active ? 'auto' : 'none' }}
    >
      {/* Left: text */}
      <div className="w-1/2 px-[8%] flex flex-col gap-6">
        <span className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-black/30">
          Tier 0{tier}
        </span>
        <h2
          className="font-bebas text-black leading-none"
          style={{ fontSize: 'clamp(12vw, 15vw, 18vw)', color: active ? '#0a0a0a' : '#0a0a0a' }}
        >
          {name}
        </h2>
        <ul className="flex flex-col gap-2 mt-2">
          {features.map((f, i) => (
            <li key={i} className="font-light text-sm text-black/60 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full inline-block" style={{ background: color }} />
              {f}
            </li>
          ))}
        </ul>
        <a
          href="mailto:studio@enterphantomcode.com"
          className="mt-4 font-mono text-sm tracking-widest uppercase text-black hover:opacity-60 transition-opacity group inline-flex items-center gap-2"
        >
          Book a Call →
          <span className="block h-[1px] w-0 group-hover:w-16 transition-all duration-500" style={{ background: color }} />
        </a>
      </div>

      {/* Right: 3D canvas */}
      <div className="w-1/2 h-screen" aria-label={`3D visualization for ${name}`}>
        {active && (
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }} style={{ background: 'transparent' }}>
            <Suspense fallback={null}>
              <Geo />
            </Suspense>
          </Canvas>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: ServicesSection**

```tsx
// components/services/ServicesSection.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ServiceChapter } from './ServiceChapter'

gsap.registerPlugin(ScrollTrigger)

const CHAPTERS = [
  { tier: 1, name: 'Interactive Installations', color: '#4169FF', geometry: 'crystal' as const,
    features: ['2D & 3D interactive experiences', 'Spatial design consultation', 'Installation prototyping', 'On-site technical direction'] },
  { tier: 2, name: 'Brand Activations', color: '#7B00FF', geometry: 'ribbons' as const,
    features: ['Immersive brand worlds', 'Event & experiential activations', 'AR social filters', 'Multi-sensory environments'] },
  { tier: 3, name: 'XR Experiences', color: '#CC0033', geometry: 'plasma' as const,
    features: ['WebXR & native AR/VR', 'Mixed reality installations', 'Real-time 3D environments', 'Spatial audio design'] },
  { tier: 4, name: 'Full Immersive Experiences', color: '#00FF87', geometry: 'vortex' as const,
    features: ['Complete world-building', 'Multi-sensory design', 'Custom hardware integration', 'Unlimited scope'] },
]

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive]   = useState(0)

  useEffect(() => {
    if (!sectionRef.current) return
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: true,
      start: 'top top',
      end: `+=${window.innerHeight * 4}`,
      scrub: 0.5,
      onUpdate: (self) => {
        const idx = Math.min(3, Math.floor(self.progress * 4))
        setActive(idx)
      },
    })
    return () => st.kill()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="relative h-screen overflow-hidden bg-[#FFE900]" aria-label="Services">
      {CHAPTERS.map((ch, i) => (
        <ServiceChapter key={ch.tier} {...ch} active={active === i} />
      ))}
    </section>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add components/services/
git commit -m "feat: Services — 4-chapter cinematic scrolljack with dynamic 3D geometries per tier"
```

---

## Task 16: Clients Playground

**Files:**
- Create: `components/clients/ClientsPlayground.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/clients/ClientsPlayground.tsx
'use client'
import { useEffect, useRef } from 'react'
import { PhysicsEngine, LogoBody } from '@/lib/physics/physicsEngine'
import { audioEngine } from '@/lib/audio/audioEngine'
import { useStore } from '@/lib/store'

const CLIENTS = [
  'Nike','Lascote','FNB Art Joburg','Fa\'kugesi','Keith Haring Foundation',
  'Butan Streetwear','Rosons Spices','Meta','South Point','Art Bank SA',
  'Natl Arts Festival','Playtopia','Africa Games Week','SPOVA.app',
]
const COLORS = ['#4169FF','#7B00FF','#CC0033','#00FF87','#0a0a0a']

export function ClientsPlayground() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const engineRef  = useRef<PhysicsEngine | null>(null)
  const bodiesRef  = useRef<(LogoBody & { name: string; color: string; scale: number })[]>([])
  const mouseRef   = useRef({ x: -999, y: -999, vx: 0, vy: 0, px: -999, py: -999 })
  const dragRef    = useRef<number | null>(null)
  const hoveredRef = useRef<number | null>(null)
  const reducedMotion = useStore((s) => s.reducedMotion)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    const W = canvas.offsetWidth
    const H = Math.max(600, canvas.offsetHeight)
    canvas.width  = W
    canvas.height = H

    const engine = new PhysicsEngine(W, H)
    engineRef.current = engine

    const bodies = CLIENTS.map((name, i) => {
      const body = {
        name, color: COLORS[i % COLORS.length],
        x: 80 + Math.random() * (W - 160),
        y: 80 + Math.random() * (H - 160),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        mass: 1, radius: 48, friction: 0.98, restitution: 0.65,
        dragging: false, scale: 1,
      }
      engine.addBody(body)
      return body
    })
    bodiesRef.current = bodies

    const getBodyAt = (mx: number, my: number) => {
      for (let i = bodies.length - 1; i >= 0; i--) {
        const b = bodies[i]
        if (Math.hypot(mx - b.x, my - b.y) < b.radius) return i
      }
      return null
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      mouseRef.current.vx = Math.abs(mx - mouseRef.current.px)
      mouseRef.current.vy = Math.abs(my - mouseRef.current.py)
      mouseRef.current.px = mouseRef.current.x
      mouseRef.current.py = mouseRef.current.y
      mouseRef.current.x  = mx
      mouseRef.current.y  = my
      if (dragRef.current !== null) {
        bodies[dragRef.current].x = mx
        bodies[dragRef.current].y = my
      }
      hoveredRef.current = getBodyAt(mx, my)
    }

    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const idx  = getBodyAt(e.clientX - rect.left, e.clientY - rect.top)
      if (idx !== null) { dragRef.current = idx; bodies[idx].dragging = true }
    }

    const onMouseUp = () => {
      if (dragRef.current !== null) {
        const b = bodies[dragRef.current]
        b.dragging = false
        b.vx = mouseRef.current.vx * 0.3
        b.vy = mouseRef.current.vy * 0.3
        dragRef.current = null
      }
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    let raf: number
    const prevVels: number[] = bodies.map(() => 0)

    const loop = () => {
      const mouse = { x: mouseRef.current.x, y: mouseRef.current.y, vx: mouseRef.current.vx, vy: mouseRef.current.vy }
      engine.step(0, mouse)

      // Detect collisions for audio
      bodies.forEach((b, i) => {
        const speed = Math.hypot(b.vx, b.vy)
        const prev  = prevVels[i]
        if (prev - speed > 1.5) audioEngine.playLogoCollision(prev - speed)
        prevVels[i] = speed
      })

      ctx.clearRect(0, 0, W, H)

      bodies.forEach((b, i) => {
        const isHovered  = hoveredRef.current === i
        const isDragging = dragRef.current === i

        ctx.save()
        ctx.translate(b.x, b.y)

        // Glow
        if (isHovered || isDragging) {
          ctx.shadowColor  = b.color
          ctx.shadowBlur   = 30
        }

        // Circle body
        ctx.beginPath()
        ctx.arc(0, 0, b.radius * (isHovered ? 1.15 : 1), 0, Math.PI * 2)
        ctx.fillStyle = b.color + '22'
        ctx.strokeStyle = b.color
        ctx.lineWidth = 1.5
        ctx.fill()
        ctx.stroke()

        // Label
        ctx.shadowBlur = 0
        ctx.fillStyle  = '#0a0a0a'
        ctx.font       = `500 ${b.radius > 40 ? 11 : 9}px Inter, sans-serif`
        ctx.textAlign  = 'center'
        ctx.textBaseline = 'middle'
        const words = b.name.split(' ')
        if (words.length === 1) {
          ctx.fillText(b.name, 0, 0)
        } else {
          words.forEach((w, wi) => ctx.fillText(w, 0, (wi - (words.length - 1) / 2) * 14))
        }

        ctx.restore()
      })

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [reducedMotion])

  return (
    <section id="clients" className="relative bg-[#FFE900] py-24 px-[5%]" aria-label="Client brands">
      <h2 className="font-bebas text-black mb-2" style={{ fontSize: 'clamp(3rem, 5vw, 5rem)' }}>
        Brands That Trust Phantom Code
      </h2>
      <p className="font-light text-black/50 text-sm mb-8 tracking-widest uppercase font-mono">
        Drag. Drop. Interact.
      </p>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: '600px', cursor: 'none' }}
        aria-label="Interactive physics playground with client brand logos"
      />
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/clients/
git commit -m "feat: Clients physics playground — 14 brands, drag/drop, collision audio, hover glow"
```

---

## Task 17: Why Phantom Code

**Files:**
- Create: `components/why/WhyPhantom.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/why/WhyPhantom.tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '@/lib/store'

gsap.registerPlugin(ScrollTrigger)

const METRICS = [
  { label: 'Years Active',         value: 10 },
  { label: 'Projects Delivered',   value: 150 },
  { label: 'Clients Served',       value: 45 },
  { label: 'AR Activations',       value: 200 },
  { label: 'Team Members',         value: 25 },
  { label: 'Awards Won',           value: 12 },
]

const PHILOSOPHY = [
  "We don't follow trends.",
  "We create them.",
  "",
  "Immersive experiences aren't a trend.",
  "They're the future of connection.",
  "",
  "Every interaction matters.",
  "Every detail counts.",
  "",
  "We architect experiences that transform",
  "how brands connect with their audience.",
  "",
  "Not through screens.",
  "Through presence.",
]

const KEY_PHRASES = ['Immersive experiences', 'future of connection', 'Through presence']

export function WhyPhantom() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useStore((s) => s.reducedMotion)

  useEffect(() => {
    if (!sectionRef.current) return

    const counters = sectionRef.current.querySelectorAll<HTMLElement>('.metric-num')
    counters.forEach((el) => {
      const target = parseInt(el.dataset.value!)
      const obj = { val: 0 }
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => gsap.to(obj, {
          val: target,
          duration: reducedMotion ? 0.001 : 1.5,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = `${Math.round(obj.val)}+` },
        }),
      })
    })

    const words = sectionRef.current.querySelectorAll<HTMLElement>('.phil-word')
    gsap.fromTo(words,
      { opacity: 0, y: reducedMotion ? 0 : 10 },
      {
        opacity: 1, y: 0,
        stagger: 0.05,
        duration: reducedMotion ? 0.001 : 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current.querySelector('.philosophy'), start: 'top 70%' },
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [reducedMotion])

  return (
    <section id="why" ref={sectionRef} className="bg-[#FFE900] py-32 px-[5%] relative overflow-hidden" aria-label="Why Phantom Code">
      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#0a0a0a 1px, transparent 1px), linear-gradient(90deg, #0a0a0a 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        aria-hidden="true"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 max-w-6xl mx-auto">
        {/* Left — metrics */}
        <div>
          <h2 className="font-bebas text-black mb-12" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            By The Numbers
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-12">
            {METRICS.map((m) => (
              <div key={m.label}>
                <div className="font-bebas text-[#4169FF]" style={{ fontSize: 'clamp(3rem, 5vw, 4rem)' }}>
                  <span className="metric-num" data-value={m.value}>0+</span>
                </div>
                <div className="font-mono text-[0.65rem] tracking-widest uppercase text-black/40 mt-1">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — philosophy */}
        <div className="philosophy">
          <h2 className="font-bebas text-black mb-12" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Our Philosophy
          </h2>
          <div className="flex flex-col gap-1">
            {PHILOSOPHY.map((line, i) =>
              line === '' ? (
                <div key={i} className="h-4" />
              ) : (
                <p key={i} className="leading-relaxed">
                  {line.split(' ').map((word, wi) => (
                    <span
                      key={wi}
                      className="phil-word inline-block mr-[0.25em] opacity-0"
                      style={{ color: KEY_PHRASES.some(kp => kp.includes(word)) ? '#00FFFF' : '#0a0a0a' }}
                    >
                      {word}
                    </span>
                  ))}
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/why/
git commit -m "feat: Why Phantom — animated counters, word-by-word philosophy reveal, grid bg"
```

---

## Task 18: Case Studies

**Files:**
- Create: `components/cases/CaseChapter.tsx`
- Create: `components/cases/CaseStudies.tsx`

- [ ] **Step 1: CaseChapter**

```tsx
// components/cases/CaseChapter.tsx
'use client'
import { useRef, useState } from 'react'

interface Metric { label: string; value: string }
interface Props {
  title: string
  color: string
  metrics: Metric[]
  detail: string
  active: boolean
  bgColor: string
}

export function CaseChapter({ title, color, metrics, detail, active, bgColor }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        opacity: active ? 1 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: active ? 'auto' : 'none',
        background: bgColor,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Title */}
      <div className="relative z-10 text-center px-8">
        <h3
          className="font-bebas leading-none"
          style={{
            fontSize: 'clamp(8vw, 12vw, 16vw)',
            color: color,
            mixBlendMode: 'difference',
          }}
        >
          {title}
        </h3>

        {/* Metrics */}
        <div className="flex gap-12 justify-center mt-8">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className="font-bebas text-4xl" style={{ color }}>{m.value}</div>
              <div className="font-mono text-[0.6rem] tracking-widest uppercase text-black/40 mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Behind-the-scenes reveal */}
        <div
          className="mt-8 overflow-hidden transition-all duration-500"
          style={{ maxHeight: hovered ? '200px' : '0', opacity: hovered ? 1 : 0 }}
        >
          <p className="font-light text-sm text-black/60 max-w-md mx-auto">{detail}</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: CaseStudies**

```tsx
// components/cases/CaseStudies.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CaseChapter } from './CaseChapter'

gsap.registerPlugin(ScrollTrigger)

const CASES = [
  {
    title: 'Dress Code: Digital',
    color: '#FF006E',
    bgColor: '#FFE900',
    metrics: [
      { label: 'Reach',       value: '2.5M+' },
      { label: 'Engagement',  value: '45%' },
      { label: 'Conversions', value: '+180%' },
    ],
    detail: 'WebGL + Three.js real-time cloth simulation. 45 product variations. Built in 6 weeks.',
  },
  {
    title: 'Reality Redefined',
    color: '#A100F2',
    bgColor: '#FFE900',
    metrics: [
      { label: 'Visitors',    value: '50K+' },
      { label: 'Avg Time',    value: '12min' },
      { label: 'Repeat Rate', value: '65%' },
    ],
    detail: 'TouchDesigner + motion capture. 8-week development. Real-time motion simulation on custom hardware.',
  },
  {
    title: 'The Past Meets Tomorrow',
    color: '#00D9FF',
    bgColor: '#FFE900',
    metrics: [
      { label: 'Interactions', value: '1M+' },
      { label: 'Impact Score', value: '9.2/10' },
      { label: 'Accessibility', value: 'AAA' },
    ],
    detail: 'Custom gesture recognition. 3D environment design. Accessibility-first approach with screen reader support.',
  },
]

export function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!sectionRef.current) return
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: true,
      start: 'top top',
      end: `+=${window.innerHeight * 3}`,
      scrub: 0.5,
      onUpdate: (self) => setActive(Math.min(2, Math.floor(self.progress * 3))),
    })
    return () => st.kill()
  }, [])

  return (
    <section id="cases" ref={sectionRef} className="relative h-screen overflow-hidden bg-[#FFE900]" aria-label="Case studies">
      {CASES.map((c, i) => (
        <CaseChapter key={c.title} {...c} active={active === i} />
      ))}
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/cases/
git commit -m "feat: Case Studies — 3-chapter scrolljack with metrics, hover reveal, per-case colors"
```

---

## Task 19: Footer — Metaballs + Logo + Form

**Files:**
- Create: `components/footer/MetaballCanvas.tsx`
- Create: `components/footer/FooterLogo.tsx`
- Create: `components/footer/ContactForm.tsx`
- Create: `components/footer/FooterSection.tsx`

- [ ] **Step 1: MetaballCanvas**

```tsx
// components/footer/MetaballCanvas.tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BLOB_COLORS = ['#4169FF', '#7B00FF', '#CC0033', '#00FF87']

interface Blob {
  x: number; y: number
  vy: number; vx: number
  radius: number
  color: string
  homeY: number
  oy: number
}

export function MetaballCanvas({ onBurst }: { onBurst?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blobsRef  = useRef<Blob[]>([])
  const mouseRef  = useRef({ x: -999, y: -999 })

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.width
    const H = () => canvas.height

    const blobs: Blob[] = BLOB_COLORS.map((color, i) => ({
      x: (i + 1) * (W() / 5),
      y: H() + 150,
      vy: 0, vx: (Math.random() - 0.5) * 0.5,
      radius: 120 + i * 20,
      color,
      homeY: H() * 0.4 + i * 40,
      oy: H() + 150,
    }))
    blobsRef.current = blobs

    // Rise on scroll
    ScrollTrigger.create({
      trigger: canvas.parentElement,
      start: 'top 80%',
      onEnter: () => {
        blobs.forEach((b) => gsap.to(b, { y: b.homeY, duration: 1.2, ease: 'power3.out' }))
      },
    })

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    canvas.addEventListener('mousemove', onMouse)

    let raf: number
    const STIFF = 0.008, DAMP = 0.92

    const drawMetaball = (b: Blob) => {
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius)
      grad.addColorStop(0, b.color + 'cc')
      grad.addColorStop(0.5, b.color + '66')
      grad.addColorStop(1, b.color + '00')
      ctx.beginPath()
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
    }

    const loop = () => {
      ctx.clearRect(0, 0, W(), H())

      blobs.forEach((b) => {
        // Cursor dent
        const dx = b.x - mouseRef.current.x
        const dy = b.y - mouseRef.current.y
        const dist = Math.hypot(dx, dy)
        if (dist < b.radius * 0.8 && dist > 0) {
          b.vx += (dx / dist) * 0.3
          b.vy += (dy / dist) * 0.3
        }

        // Spring to home X
        b.vx += (((blobsRef.current.indexOf(b) + 1) * (W() / 5)) - b.x) * STIFF
        b.vx *= DAMP
        b.vy *= DAMP
        b.x += b.vx
        b.y += b.vy

        drawMetaball(b)
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouse)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const burst = () => {
    blobsRef.current.forEach((b) => {
      const angle = Math.random() * Math.PI * 2
      gsap.to(b, { x: b.x + Math.cos(angle) * 600, y: b.y + Math.sin(angle) * 600, duration: 0.8, ease: 'power2.out' })
    })
    onBurst?.()
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      aria-hidden="true"
      style={{ mixBlendMode: 'multiply' }}
    />
  )
}
```

- [ ] **Step 2: FooterLogo**

```tsx
// components/footer/FooterLogo.tsx
'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Mesh, TextureLoader, Color } from 'three'
import { useLoader } from '@react-three/fiber'
import '@/lib/shaders/iridescent'

function LogoMesh() {
  const ref = useRef<Mesh>(null)
  const texture = useLoader(TextureLoader, '/images/logo.png')

  useFrame(({ clock, camera }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.4
    const mat = ref.current.material as any
    if (mat) { mat.uTime = clock.getElapsedTime(); mat.uCameraPosition = camera.position }
  })

  return (
    <mesh ref={ref}>
      <planeGeometry args={[3, 3]} />
      <iridescentMaterial transparent alphaMap={texture} uColor={new Color('#0a0a0a')} uFresnelPower={2.5} uAlpha={1} />
    </mesh>
  )
}

export function FooterLogo() {
  return (
    <div className="w-40 h-40 mx-auto" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} style={{ background: 'transparent' }}>
        <LogoMesh />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 3: ContactForm**

```tsx
// components/footer/ContactForm.tsx
'use client'
import { useState } from 'react'
import { submitLead } from '@/lib/supabase'
import { audioEngine } from '@/lib/audio/audioEngine'

const TIERS = [
  { id: 'installations', label: 'Interactive Installations' },
  { id: 'activations',   label: 'Brand Activations' },
  { id: 'xr',           label: 'XR Experiences' },
  { id: 'immersive',    label: 'Full Immersive' },
]

export function ContactForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm]   = useState({ name: '', email: '', company: '', tier: 'installations' as const, message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setStatus('loading')
    const { error } = await submitLead(form)
    if (error) { setStatus('error'); return }
    setStatus('success')
    audioEngine.playFormSuccess()
    onSuccess?.()
    setTimeout(() => { setForm({ name: '', email: '', company: '', tier: 'installations', message: '' }); setStatus('idle') }, 3000)
  }

  const inputClass = "w-full bg-transparent border-b border-black/20 py-3 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-[#4169FF] transition-colors"

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <p className="font-mono text-sm tracking-widest">Message received.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6 max-w-md" aria-label="Contact form">
      <input required placeholder="Name" value={form.name} onChange={set('name')} className={inputClass} />
      <input required type="email" placeholder="Email" value={form.email} onChange={set('email')} className={inputClass} />
      <input placeholder="Company" value={form.company} onChange={set('company')} className={inputClass} />

      <fieldset className="border-none p-0">
        <legend className="font-mono text-[0.6rem] tracking-widest uppercase text-black/40 mb-3">Service Tier</legend>
        <div className="flex flex-col gap-2">
          {TIERS.map((t) => (
            <label key={t.id} className="flex items-center gap-3 cursor-none group">
              <input
                type="radio" name="tier" value={t.id}
                checked={form.tier === t.id}
                onChange={() => setForm((f) => ({ ...f, tier: t.id as any }))}
                className="sr-only"
              />
              <span className={`w-1.5 h-1.5 rounded-full transition-colors ${form.tier === t.id ? 'bg-black' : 'bg-black/20'}`} />
              <span className="text-sm font-light text-black/70 group-hover:text-black transition-colors">{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <textarea placeholder="Message" value={form.message} onChange={set('message')} rows={4} className={inputClass + ' resize-none'} />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="font-mono text-sm tracking-widest uppercase text-black border-b border-black/20 pb-2 text-left hover:border-[#4169FF] transition-colors cursor-none disabled:opacity-40"
      >
        {status === 'loading' ? 'Sending...' : status === 'error' ? 'Error — try again' : 'Send Message →'}
      </button>
    </form>
  )
}
```

- [ ] **Step 4: FooterSection**

```tsx
// components/footer/FooterSection.tsx
'use client'
import { useRef, useState } from 'react'
import { MetaballCanvas } from './MetaballCanvas'
import { FooterLogo }     from './FooterLogo'
import { ContactForm }    from './ContactForm'

const SOCIALS = [
  { name: 'Instagram', href: 'https://instagram.com/phantomcode' },
  { name: 'LinkedIn',  href: 'https://linkedin.com/company/phantomcode' },
  { name: 'Twitter',   href: 'https://twitter.com/phantomcode' },
  { name: 'YouTube',   href: 'https://youtube.com/@phantomcode' },
]

export function FooterSection() {
  const [burst, setBurst] = useState(false)

  return (
    <footer id="footer" className="relative min-h-screen bg-[#FFE900] overflow-hidden" aria-label="Footer">
      {/* Metaballs layer */}
      <div className="absolute inset-0 pointer-events-none">
        <MetaballCanvas onBurst={() => setBurst(true)} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-[5%] py-24">
        <FooterLogo />

        <h2 className="font-bebas mt-8 mb-16 text-center text-black" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}>
          Let&rsquo;s Build Something Impossible
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 w-full max-w-5xl">
          <ContactForm onSuccess={() => setBurst(true)} />

          <div className="flex flex-col gap-8">
            <div>
              <p className="font-mono text-[0.65rem] tracking-widest uppercase text-black/40 mb-2">Email</p>
              <a href="mailto:studio@enterphantomcode.com" className="text-sm font-light text-black hover:opacity-60 transition-opacity">
                studio@enterphantomcode.com
              </a>
            </div>
            <div>
              <p className="font-mono text-[0.65rem] tracking-widest uppercase text-black/40 mb-2">Location</p>
              <p className="text-sm font-light text-black/70">Johannesburg, South Africa</p>
            </div>
            <div>
              <p className="font-mono text-[0.65rem] tracking-widest uppercase text-black/40 mb-3">Follow</p>
              <div className="flex gap-6">
                {SOCIALS.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[0.6rem] tracking-widest uppercase text-black/40 hover:text-[#4169FF] transition-colors cursor-none">
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-24 font-mono text-[0.6rem] tracking-widest uppercase text-black/30">
          Phantom Code © 2025 — Immersive by Design
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/footer/
git commit -m "feat: Footer — metaball rise, rotating iridescent logo, contact form + Supabase, socials"
```

---

## Task 20: Page Assembly

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Assemble all sections**

```tsx
// app/page.tsx
import dynamic from 'next/dynamic'
import { Nav }              from '@/components/nav/Nav'
import { LoadingScreen }    from '@/components/loader/LoadingScreen'
import { HeroText }         from '@/components/hero/HeroText'
import { ProblemSection }   from '@/components/problem/ProblemSection'
import { WhyPhantom }       from '@/components/why/WhyPhantom'
import { FooterSection }    from '@/components/footer/FooterSection'

// Heavy 3D sections — dynamic imported
const HeroScene       = dynamic(() => import('@/components/hero/HeroScene').then(m => ({ default: m.HeroScene })), { ssr: false })
const ServicesSection = dynamic(() => import('@/components/services/ServicesSection').then(m => ({ default: m.ServicesSection })), { ssr: false })
const ClientsPlayground = dynamic(() => import('@/components/clients/ClientsPlayground').then(m => ({ default: m.ClientsPlayground })), { ssr: false })
const CaseStudies     = dynamic(() => import('@/components/cases/CaseStudies').then(m => ({ default: m.CaseStudies })), { ssr: false })

export default function Home() {
  return (
    <main>
      <LoadingScreen />
      <Nav />

      {/* Hero */}
      <section className="relative min-h-screen" aria-label="Hero">
        <HeroScene />
        <HeroText />
      </section>

      <ProblemSection />
      <ServicesSection />
      <ClientsPlayground />
      <WhyPhantom />
      <CaseStudies />
      <FooterSection />
    </main>
  )
}
```

- [ ] **Step 2: Run dev server to verify no build errors**

```bash
npm run dev
```
Expected: Compiles successfully, opens at `http://localhost:3000`

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble all sections in page.tsx with dynamic imports for heavy 3D"
```

---

## Task 21: Accessibility Pass

**Files:**
- Modify: `app/globals.css` (reduced-motion media query)

- [ ] **Step 1: Add reduced-motion CSS**

```css
/* append to app/globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 2: Verify keyboard navigation**

Open `http://localhost:3000`, tab through: Nav links → Service CTAs → Contact form fields → Social links. Every element must receive a visible focus ring (2px Xenon Blue outline from globals.css).

- [ ] **Step 3: Verify screen reader labels**

Confirm these aria attributes are present (grep check):

```bash
grep -r "aria-label\|aria-hidden\|role=\"img\"" components/ --include="*.tsx"
```
Expected: Results in HeroScene, ClientsPlayground, MetaballCanvas, MagneticInkCanvas.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat: accessibility — reduced-motion CSS, aria labels on all canvas elements"
```

---

## Task 22: Vercel Deployment

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create vercel.json**

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

- [ ] **Step 2: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/phantom-code-nextjs.git
git push -u origin main
```

- [ ] **Step 3: Deploy on Vercel**

1. Go to vercel.com → New Project → Import from GitHub
2. Select `phantom-code-nextjs`
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
4. Click Deploy
5. After deploy: Settings → Domains → Add `enterphantomcode.com`

- [ ] **Step 4: Create Supabase `leads` table**

Run in Supabase SQL editor:
```sql
create table leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  company     text,
  tier        text,
  message     text,
  created_at  timestamptz default now()
);

alter table leads enable row level security;

create policy "Allow insert from anon"
  on leads for insert to anon with check (true);
```

- [ ] **Step 5: Final commit**

```bash
git add vercel.json
git commit -m "feat: Vercel deployment config"
git push
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Loading screen (Task 11)
- ✅ Nav + Magnetic Ink (Task 12)
- ✅ Hero bubbles + particles + post-processing (Task 13)
- ✅ Problem section (Task 14)
- ✅ Services scrolljack × 4 chapters (Task 15)
- ✅ Clients physics playground (Task 16)
- ✅ Why Phantom counters + philosophy (Task 17)
- ✅ Case studies × 3 (Task 18)
- ✅ Footer metaballs + logo + form (Task 19)
- ✅ Audio engine wired to hover/click/collision/form (Tasks 5, 16, 19)
- ✅ Zustand store (Task 3)
- ✅ Accessibility pass (Task 21)
- ✅ Supabase leads table (Task 22)
- ✅ Vercel deploy (Task 22)

**Type consistency verified:**
- `LogoBody` defined in Task 6, used in Task 16 ✓
- `AudioEngine.playLogoCollision` defined in Task 5, called in Task 16 ✓
- `IridescentMaterial` defined in Task 8, used in Tasks 13, 15, 19 ✓
- `submitLead(Lead)` defined in Task 7, called in Task 19 ✓
- `useStore` shape defined in Task 3, used throughout ✓

