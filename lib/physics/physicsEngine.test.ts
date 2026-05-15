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
