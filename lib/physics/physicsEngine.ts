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

      b.vy += 0.05
      b.vx += wind
      b.vx *= b.friction
      b.vy *= b.friction

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

      b.x += b.vx
      b.y += b.vy

      if (b.x - b.radius < 0) { b.x = b.radius; b.vx = Math.abs(b.vx) * b.restitution }
      if (b.x + b.radius > this.w) { b.x = this.w - b.radius; b.vx = -Math.abs(b.vx) * b.restitution }
      if (b.y - b.radius < 0) { b.y = b.radius; b.vy = Math.abs(b.vy) * b.restitution }
      if (b.y + b.radius > this.h) { b.y = this.h - b.radius; b.vy = -Math.abs(b.vy) * b.restitution }
    }

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

    const overlap = (minDist - dist) / 2
    const nx = dx / dist
    const ny = dy / dist
    if (!a.dragging) { a.x -= nx * overlap; a.y -= ny * overlap }
    if (!b.dragging) { b.x += nx * overlap; b.y += ny * overlap }

    const dvx = a.vx - b.vx
    const dvy = a.vy - b.vy
    const dot = dvx * nx + dvy * ny
    if (dot > 0) return
    const impulse = (2 * dot) / (a.mass + b.mass)
    if (!a.dragging) { a.vx -= impulse * b.mass * nx; a.vy -= impulse * b.mass * ny }
    if (!b.dragging) { b.vx += impulse * a.mass * nx; b.vy += impulse * a.mass * ny }
  }
}
